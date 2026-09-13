import { 
  EvaluationResult, 
  ReferenceSource, 
  GeneratedTest, 
  MistakeRecord, 
  LongTermAnalysisData, 
  AcademicJourney,
  MistakeCategoryType,
  SupportTicket,
  SupportMessage,
  TicketStatus
} from '../types';
import { DEFAULT_SOURCES } from '../data/defaultSources';
import { 
  syncEvaluationToCloud, 
  deleteEvaluationFromCloud, 
  syncMistakesToCloud, 
  syncTestToCloud, 
  syncProfileToCloud,
  syncSupportTicketToCloud,
  deleteSupportTicketFromCloud
} from './cloudSync';

const KEYS = {
  EVALUATIONS: 'studymentor_evaluations_v2',
  SOURCES: 'studymentor_sources_v2',
  TESTS: 'studymentor_tests_v2',
  MISTAKES: 'studymentor_mistakes_v2',
  TICKETS: 'studymentor_support_tickets_v2',
  ACTIVE_EVAL_ID: 'studymentor_active_eval_id_v2',
  ACTIVE_JOURNEY: 'studymentor_active_journey_v2',
  ACTIVE_SUBJECT: 'studymentor_active_subject_v2'
};

export const PROFILE_KEYS = {
  PROFILES: 'studymentor_user_profiles_v4',
  ACTIVE_PROFILE_ID: 'studymentor_active_profile_id_v4',
  HAS_ONBOARDED: 'studymentor_has_onboarded_v4',
  IS_AUTHENTICATED: 'studymentor_is_authenticated_v4'
};

/**
 * Helper to safely resolve the active user/student ID for storage isolation.
 */
export function resolveActiveUserId(explicitUserId?: string): string {
  if (explicitUserId && explicitUserId.trim()) {
    return explicitUserId.trim();
  }
  try {
    const activeId = localStorage.getItem(PROFILE_KEYS.ACTIVE_PROFILE_ID);
    if (activeId && activeId.trim()) return activeId.trim();
  } catch (err) {
    // ignore
  }
  return 'guest_user';
}

/**
 * Returns a storage key strictly scoped to the active user profile to guarantee 0% data leakage.
 */
export function getScopedKey(baseKey: string, activeUserId?: string): string {
  const resolved = resolveActiveUserId(activeUserId);
  return `${baseKey}_usr_${resolved}`;
}

// ----------------- Academic Journey & Scope -----------------
export function getSavedJourney(): AcademicJourney {
  try {
    const saved = localStorage.getItem(KEYS.ACTIVE_JOURNEY);
    if (saved === 'CLASS_12' || saved === 'CA_FOUNDATION' || saved === 'CA_INTERMEDIATE') {
      return saved as AcademicJourney;
    }
  } catch (err) {
    // fallback
  }
  return 'CLASS_12';
}

export function saveJourney(journey: AcademicJourney): void {
  try {
    localStorage.setItem(KEYS.ACTIVE_JOURNEY, journey);
  } catch (err) {
    console.error('Error saving journey:', err);
  }
}

export function getSavedSubject(): string {
  try {
    const saved = localStorage.getItem(KEYS.ACTIVE_SUBJECT);
    return saved || 'Accountancy';
  } catch (err) {
    return 'Accountancy';
  }
}

export function saveSubject(subject: string): void {
  try {
    localStorage.setItem(KEYS.ACTIVE_SUBJECT, subject);
  } catch (err) {
    console.error('Error saving subject:', err);
  }
}

// ----------------- Evaluations Storage -----------------
export function getSavedEvaluations(journeyFilter?: AcademicJourney, activeUserId?: string): EvaluationResult[] {
  try {
    const scopedKey = getScopedKey(KEYS.EVALUATIONS, activeUserId);
    let raw = localStorage.getItem(scopedKey);
    
    // Smooth zero-loss migration: If scoped key is not set yet, check global key and migrate user's own items
    if (!raw) {
      const legacyRaw = localStorage.getItem(KEYS.EVALUATIONS);
      if (legacyRaw) {
        try {
          const legacyEvals: EvaluationResult[] = JSON.parse(legacyRaw);
          const currentUserId = resolveActiveUserId(activeUserId);
          // Migrate evals that belong to this user (or if none have userId yet, isolate them to current user)
          const userOwnEvals = legacyEvals.filter(e => !e.userId || e.userId === currentUserId);
          if (userOwnEvals.length > 0) {
            localStorage.setItem(scopedKey, JSON.stringify(userOwnEvals));
            raw = JSON.stringify(userOwnEvals);
          }
        } catch (e) {
          // ignore migration parse error
        }
      }
    }

    const evals: EvaluationResult[] = raw ? JSON.parse(raw) : [];
    if (journeyFilter) {
      return evals.filter(e => e.journey === journeyFilter);
    }
    return evals;
  } catch (err) {
    console.error('Error reading evaluations from localStorage:', err);
    return [];
  }
}

export function saveEvaluation(result: EvaluationResult, activeUserId?: string): void {
  try {
    const targetUserId = activeUserId || result.userId || resolveActiveUserId();
    const resultWithUser: EvaluationResult = {
      ...result,
      userId: targetUserId
    };

    const current = getSavedEvaluations(undefined, targetUserId);
    const existingIndex = current.findIndex(e => e.id === resultWithUser.id);
    let updated: EvaluationResult[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = resultWithUser;
    } else {
      updated = [resultWithUser, ...current];
    }
    
    const scopedKey = getScopedKey(KEYS.EVALUATIONS, targetUserId);
    localStorage.setItem(scopedKey, JSON.stringify(updated));
    localStorage.setItem(getScopedKey(KEYS.ACTIVE_EVAL_ID, targetUserId), resultWithUser.id);

    // Update long term mistake database (user-isolated)
    updateMistakesFromEvaluation(resultWithUser, targetUserId);

    // Asynchronously synchronize to Cloud Firestore for Multi-User Safety
    syncEvaluationToCloud(resultWithUser, targetUserId).catch(err => console.warn('[CloudSync] Background sync notice:', err));
  } catch (err) {
    console.error('Error saving evaluation to localStorage:', err);
  }
}

export function deleteEvaluation(id: string, activeUserId?: string): EvaluationResult[] {
  try {
    const targetUserId = resolveActiveUserId(activeUserId);
    const current = getSavedEvaluations(undefined, targetUserId);
    const updated = current.filter(e => e.id !== id);
    const scopedKey = getScopedKey(KEYS.EVALUATIONS, targetUserId);
    localStorage.setItem(scopedKey, JSON.stringify(updated));

    // Clean up mistake records linked to this test so red alerts and metrics drop accurately
    try {
      const currentMistakes = getSavedMistakes(undefined, targetUserId);
      const cleanedMistakes = currentMistakes.map(m => {
        const filteredExamples = m.examples.filter(ex => ex.test_id !== id);
        return {
          ...m,
          examples: filteredExamples,
          frequency: filteredExamples.length
        };
      }).filter(m => m.frequency > 0);
      localStorage.setItem(getScopedKey(KEYS.MISTAKES, targetUserId), JSON.stringify(cleanedMistakes));
    } catch (err) {
      console.error('Error cleaning up mistakes for deleted test:', err);
    }

    // Also remove from cloud
    deleteEvaluationFromCloud(id).catch(err => console.warn('[CloudSync] Background delete notice:', err));
    return updated;
  } catch (err) {
    console.error('Error deleting evaluation:', err);
    return [];
  }
}

export function toggleEvaluationAnalysisInclusion(id: string, include: boolean, activeUserId?: string): EvaluationResult[] {
  try {
    const targetUserId = resolveActiveUserId(activeUserId);
    const current = getSavedEvaluations(undefined, targetUserId);
    const target = current.find(e => e.id === id);
    if (!target) return current;

    const updated = current.map(e => e.id === id ? { ...e, excludeFromAnalysis: !include } : e);
    localStorage.setItem(getScopedKey(KEYS.EVALUATIONS, targetUserId), JSON.stringify(updated));

    // If excluding from analysis, remove its mistakes from long term tracking
    if (!include) {
      try {
        const currentMistakes = getSavedMistakes(undefined, targetUserId);
        const cleanedMistakes = currentMistakes.map(m => {
          const filteredExamples = m.examples.filter(ex => ex.test_id !== id);
          return {
            ...m,
            examples: filteredExamples,
            frequency: filteredExamples.length
          };
        }).filter(m => m.frequency > 0);
        localStorage.setItem(getScopedKey(KEYS.MISTAKES, targetUserId), JSON.stringify(cleanedMistakes));
      } catch (err) {
        console.error('Error removing mistakes for excluded test:', err);
      }
    } else {
      // If re-including, re-add mistake records
      updateMistakesFromEvaluation({ ...target, excludeFromAnalysis: false }, targetUserId);
    }

    return updated;
  } catch (err) {
    console.error('Error toggling analysis inclusion:', err);
    return getSavedEvaluations(undefined, activeUserId);
  }
}

export function getActiveEvaluationId(activeUserId?: string): string | null {
  const targetUserId = resolveActiveUserId(activeUserId);
  return localStorage.getItem(getScopedKey(KEYS.ACTIVE_EVAL_ID, targetUserId)) || localStorage.getItem(KEYS.ACTIVE_EVAL_ID);
}

export function setActiveEvaluationId(id: string, activeUserId?: string): void {
  const targetUserId = resolveActiveUserId(activeUserId);
  localStorage.setItem(getScopedKey(KEYS.ACTIVE_EVAL_ID, targetUserId), id);
}

/**
 * Super Admin helper: Aggregates evaluations across all registered student scopes
 * so the Teacher Admin can view the central gradebook without leaking data to students.
 */
export function getAllEvaluationsForAllStudents(journeyFilter?: AcademicJourney): EvaluationResult[] {
  try {
    const allMap = new Map<string, EvaluationResult>();
    
    // 1. Check all user-scoped storage keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${KEYS.EVALUATIONS}_usr_`)) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const list: EvaluationResult[] = JSON.parse(raw);
            list.forEach(e => allMap.set(e.id, e));
          }
        } catch (e) {
          // ignore
        }
      }
    }

    // 2. Also check the legacy/fallback evaluations key
    try {
      const rawLegacy = localStorage.getItem(KEYS.EVALUATIONS);
      if (rawLegacy) {
        const list: EvaluationResult[] = JSON.parse(rawLegacy);
        list.forEach(e => {
          if (!allMap.has(e.id)) {
            allMap.set(e.id, e);
          }
        });
      }
    } catch (e) {}

    const aggregated = Array.from(allMap.values());
    if (journeyFilter) {
      return aggregated.filter(e => e.journey === journeyFilter);
    }
    return aggregated;
  } catch (err) {
    console.error('Error reading all evaluations for admin:', err);
    return [];
  }
}

// ----------------- Source Library (Isolated) -----------------
export function getSavedSources(journeyFilter?: AcademicJourney, subjectFilter?: string): ReferenceSource[] {
  try {
    const raw = localStorage.getItem(KEYS.SOURCES);
    let sources: ReferenceSource[];
    if (!raw) {
      // Seed default sources
      localStorage.setItem(KEYS.SOURCES, JSON.stringify(DEFAULT_SOURCES));
      sources = DEFAULT_SOURCES;
    } else {
      sources = JSON.parse(raw);
      // Auto-merge or update built-in sources so users always have the latest official syllabus
      const existingMap = new Map(sources.map(s => [s.id, s]));
      let hasChanges = false;

      for (const builtIn of DEFAULT_SOURCES) {
        const existing = existingMap.get(builtIn.id);
        if (!existing) {
          sources.push(builtIn);
          hasChanges = true;
        } else if (existing.isBuiltIn && existing.content !== builtIn.content) {
          // Update to latest official content while preserving user active state
          const idx = sources.findIndex(s => s.id === builtIn.id);
          if (idx !== -1) {
            sources[idx] = { ...builtIn, isActive: existing.isActive };
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        localStorage.setItem(KEYS.SOURCES, JSON.stringify(sources));
      }
    }

    if (journeyFilter) {
      sources = sources.filter(s => s.journey === journeyFilter);
    }
    if (subjectFilter && subjectFilter !== 'All') {
      sources = sources.filter(s => s.subject === subjectFilter || s.subject === 'All Subjects');
    }
    return sources;
  } catch (err) {
    console.error('Error reading sources from localStorage:', err);
    return DEFAULT_SOURCES;
  }
}

export function saveSources(sources: ReferenceSource[]): void {
  try {
    localStorage.setItem(KEYS.SOURCES, JSON.stringify(sources));
  } catch (err) {
    console.error('Error saving sources:', err);
  }
}

export function addOrUpdateSource(source: ReferenceSource): ReferenceSource[] {
  const current = getSavedSources();
  const existingIdx = current.findIndex(s => s.id === source.id);
  let updated: ReferenceSource[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...source, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...source, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }
  saveSources(updated);
  return updated;
}

export function deleteSource(id: string): ReferenceSource[] {
  const current = getSavedSources();
  const updated = current.filter(s => s.id !== id);
  saveSources(updated);
  return updated;
}

// ----------------- Generated Tests (Isolated) -----------------
export function getSavedTests(journeyFilter?: AcademicJourney, activeUserId?: string): GeneratedTest[] {
  try {
    const scopedKey = getScopedKey(KEYS.TESTS, activeUserId);
    let raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const legacyRaw = localStorage.getItem(KEYS.TESTS);
      if (legacyRaw) {
        localStorage.setItem(scopedKey, legacyRaw);
        raw = legacyRaw;
      }
    }
    const tests: GeneratedTest[] = raw ? JSON.parse(raw) : [];
    if (journeyFilter) {
      return tests.filter(t => t.journey === journeyFilter);
    }
    return tests;
  } catch (err) {
    console.error('Error reading tests from localStorage:', err);
    return [];
  }
}

export function saveTest(test: GeneratedTest, activeUserId?: string): GeneratedTest[] {
  try {
    const targetUserId = resolveActiveUserId(activeUserId);
    const current = getSavedTests(undefined, targetUserId);
    const updated = [test, ...current.filter(t => t.test_id !== test.test_id)];
    localStorage.setItem(getScopedKey(KEYS.TESTS, targetUserId), JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving test to localStorage:', err);
    return [];
  }
}

export function deleteTest(testId: string, activeUserId?: string): GeneratedTest[] {
  try {
    const targetUserId = resolveActiveUserId(activeUserId);
    const current = getSavedTests(undefined, targetUserId);
    const updated = current.filter(t => t.test_id !== testId);
    localStorage.setItem(getScopedKey(KEYS.TESTS, targetUserId), JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting test:', err);
    return [];
  }
}

// ----------------- Mistake Tracking & Long-Term Analysis -----------------
export function getSavedMistakes(journeyFilter?: AcademicJourney, activeUserId?: string): MistakeRecord[] {
  try {
    const scopedKey = getScopedKey(KEYS.MISTAKES, activeUserId);
    let raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const legacyRaw = localStorage.getItem(KEYS.MISTAKES);
      if (legacyRaw) {
        localStorage.setItem(scopedKey, legacyRaw);
        raw = legacyRaw;
      }
    }
    const records: MistakeRecord[] = raw ? JSON.parse(raw) : [];
    if (journeyFilter) {
      return records.filter(m => m.journey === journeyFilter);
    }
    return records;
  } catch (err) {
    console.error('Error reading mistake records:', err);
    return [];
  }
}

function updateMistakesFromEvaluation(evalResult: EvaluationResult, activeUserId?: string): void {
  if (evalResult.excludeFromAnalysis) {
    return;
  }
  try {
    const targetUserId = resolveActiveUserId(activeUserId || evalResult.userId);
    const currentMistakes = getSavedMistakes(undefined, targetUserId);
    const updated = [...currentMistakes];

    for (const q of evalResult.questions) {
      // If marks were lost or errors occurred
      const marksLost = q.max_marks - q.awarded_marks;
      if (marksLost > 0 || (q.errors && q.errors.length > 0) || (q.missing_points && q.missing_points.length > 0)) {
        
        // Categorize mistake
        let mistakeType: MistakeCategoryType = 'Weak Explanation';
        if (q.status === 'Not Attempted') {
          mistakeType = 'Unattempted';
        } else if (q.missing_points && q.missing_points.length > 0) {
          mistakeType = 'Missing Key Point';
        } else if (q.errors && q.errors.some(e => /calc|arithmetic|formula|substitut|math/i.test(e))) {
          mistakeType = 'Calculation Error';
        } else if (q.errors && q.errors.some(e => /concept|principle|law|theory|rule/i.test(e))) {
          mistakeType = 'Conceptual Error';
        } else if (q.errors && q.errors.some(e => /incomplet|half|partial/i.test(e))) {
          mistakeType = 'Incomplete Answer';
        }

        const conceptName = q.topic || q.chapter || evalResult.chapter || 'Core Concepts';
        const chapterName = q.chapter || evalResult.chapter || 'General Chapter';

        const existing = updated.find(m => 
          m.journey === evalResult.journey &&
          m.subject === evalResult.subject &&
          m.chapter.toLowerCase() === chapterName.toLowerCase() &&
          m.concept.toLowerCase() === conceptName.toLowerCase() &&
          m.mistake_type === mistakeType
        );

        const snippetText = q.marks_deduction_reason || q.errors?.join('; ') || q.missing_points?.join('; ') || 'Marks deducted in evaluation.';

        if (existing) {
          existing.frequency += 1;
          existing.last_occurred = new Date().toISOString();
          existing.examples.unshift({
            test_id: evalResult.id,
            test_title: evalResult.test_title,
            question_id: String(q.question_id || q.question_number),
            snippet: snippetText
          });
          if (existing.examples.length > 5) existing.examples.pop();
        } else {
          updated.push({
            id: `mistake_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            journey: evalResult.journey,
            subject: evalResult.subject,
            chapter: chapterName,
            concept: conceptName,
            mistake_type: mistakeType,
            frequency: 1,
            last_occurred: new Date().toISOString(),
            examples: [{
              test_id: evalResult.id,
              test_title: evalResult.test_title,
              question_id: String(q.question_id || q.question_number),
              snippet: snippetText
            }]
          });
        }
      }
    }

    localStorage.setItem(getScopedKey(KEYS.MISTAKES, targetUserId), JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating mistake records:', err);
  }
}

// ----------------- Comprehensive Long-Term Learning Analytics Engine -----------------
export function computeLongTermAnalysis(journey: AcademicJourney, subjectFilter?: string, activeUserId?: string): LongTermAnalysisData {
  const evaluations = getSavedEvaluations(journey, activeUserId).filter(e => 
    (!subjectFilter || subjectFilter === 'All' || e.subject === subjectFilter) &&
    !e.excludeFromAnalysis
  );
  const mistakes = getSavedMistakes(journey, activeUserId).filter(m => 
    !subjectFilter || subjectFilter === 'All' || m.subject === subjectFilter
  );

  let totalMarksAwarded = 0;
  let totalMaxMarks = 0;
  const subjectPerformance: Record<string, { totalMax: number; totalObtained: number; count: number; percentage: number }> = {};
  const chapterPerformance: Record<string, {
    subject: string;
    totalMax: number;
    totalObtained: number;
    count: number;
    percentage: number;
    status: 'Strong' | 'Moderate' | 'Weak';
    weakTopics: string[];
    mistakeSummary: string[];
    suggestedQuestionsCount: number;
  }> = {};

  const recurringMistakes: Record<string, number> = {
    'Missing Key Point / Omission': 0,
    'Incomplete Explanation / Answer': 0,
    'Calculation & Arithmetic Errors': 0,
    'Conceptual Misunderstandings': 0,
    'Format / Presentation Slips': 0,
    'Unattempted Questions': 0
  };

  let omissionErrorsCount = 0;
  let incompleteAnswersCount = 0;
  let calculationErrorsCount = 0;

  // Process evaluations
  for (const ev of evaluations) {
    totalMarksAwarded += ev.total_obtained_marks;
    totalMaxMarks += ev.total_max_marks;

    // Subject breakdown
    if (!subjectPerformance[ev.subject]) {
      subjectPerformance[ev.subject] = { totalMax: 0, totalObtained: 0, count: 0, percentage: 0 };
    }
    subjectPerformance[ev.subject].totalMax += ev.total_max_marks;
    subjectPerformance[ev.subject].totalObtained += ev.total_obtained_marks;
    subjectPerformance[ev.subject].count += 1;

    // Question-level chapter and mistake stats
    for (const q of ev.questions) {
      const chName = q.chapter || ev.chapter || q.topic || 'General Chapter';
      if (!chapterPerformance[chName]) {
        chapterPerformance[chName] = { 
          subject: ev.subject, 
          totalMax: 0, 
          totalObtained: 0, 
          count: 0, 
          percentage: 0,
          status: 'Moderate',
          weakTopics: [],
          mistakeSummary: [],
          suggestedQuestionsCount: 4
        };
      }
      chapterPerformance[chName].totalMax += q.max_marks;
      chapterPerformance[chName].totalObtained += q.awarded_marks;
      chapterPerformance[chName].count += 1;

      // Track weak sub-topics & specific errors for remedial question generation
      const marksLost = q.max_marks - q.awarded_marks;
      if (marksLost > 0 || (q.errors && q.errors.length > 0) || (q.missing_points && q.missing_points.length > 0)) {
        const topicName = q.topic || q.question_text?.substring(0, 45) || 'Core Concepts';
        if (!chapterPerformance[chName].weakTopics.includes(topicName)) {
          chapterPerformance[chName].weakTopics.push(topicName);
        }

        if (q.marks_deduction_reason && !chapterPerformance[chName].mistakeSummary.includes(q.marks_deduction_reason)) {
          chapterPerformance[chName].mistakeSummary.push(q.marks_deduction_reason);
        } else if (q.missing_points && q.missing_points.length > 0) {
          for (const mp of q.missing_points) {
            if (!chapterPerformance[chName].mistakeSummary.includes(mp)) {
              chapterPerformance[chName].mistakeSummary.push(mp);
            }
          }
        }
      }

      if (q.missing_points && q.missing_points.length > 0) {
        omissionErrorsCount += q.missing_points.length;
        recurringMistakes['Missing Key Point / Omission'] += q.missing_points.length;
      }
      if (q.status === 'Partially Correct') {
        incompleteAnswersCount += 1;
        recurringMistakes['Incomplete Explanation / Answer'] += 1;
      }
      if (q.status === 'Not Attempted') {
        recurringMistakes['Unattempted Questions'] += 1;
      }
      if (q.errors && q.errors.some(e => /calc|arithmetic|formula|math/i.test(e))) {
        calculationErrorsCount += 1;
        recurringMistakes['Calculation & Arithmetic Errors'] += 1;
      }
      if (q.errors && q.errors.some(e => /concept|principle|law|theory|rule/i.test(e))) {
        recurringMistakes['Conceptual Misunderstandings'] += 1;
      }
    }
  }

  // Calculate percentages and classify Chapter Mastery (Strong / Moderate / Weak)
  let strongChaptersCount = 0;
  let moderateChaptersCount = 0;
  let weakChaptersCount = 0;

  for (const s of Object.keys(subjectPerformance)) {
    const item = subjectPerformance[s];
    item.percentage = item.totalMax > 0 ? Math.round((item.totalObtained / item.totalMax) * 1000) / 10 : 0;
  }
  
  for (const c of Object.keys(chapterPerformance)) {
    const item = chapterPerformance[c];
    item.percentage = item.totalMax > 0 ? Math.round((item.totalObtained / item.totalMax) * 1000) / 10 : 0;
    
    // Classify
    if (item.percentage >= 75 && item.weakTopics.length <= 1) {
      item.status = 'Strong';
      item.suggestedQuestionsCount = 3;
      strongChaptersCount++;
    } else if (item.percentage >= 50) {
      item.status = 'Moderate';
      item.suggestedQuestionsCount = 4;
      moderateChaptersCount++;
    } else {
      item.status = 'Weak';
      item.suggestedQuestionsCount = 5;
      weakChaptersCount++;
    }
  }

  // Concept gaps detection: If any concept in mistakes has frequency >= 2 across tests
  const conceptGaps: Array<{ subject: string; chapter: string; concept: string; occurrences: number; recommendation: string }> = [];
  const conceptFrequencyMap: Record<string, { subject: string; chapter: string; concept: string; count: number }> = {};

  for (const m of mistakes) {
    const k = `${m.subject}:::${m.chapter}:::${m.concept}`;
    if (!conceptFrequencyMap[k]) {
      conceptFrequencyMap[k] = { subject: m.subject, chapter: m.chapter, concept: m.concept, count: 0 };
    }
    conceptFrequencyMap[k].count += m.frequency;
  }

  for (const item of Object.values(conceptFrequencyMap)) {
    if (item.count >= 2) {
      conceptGaps.push({
        subject: item.subject,
        chapter: item.chapter,
        concept: item.concept,
        occurrences: item.count,
        recommendation: `Repeated deductions detected in ${item.concept} (${item.count} occurrences). Revise official ${journey === 'CLASS_12' ? 'NCERT / CBSE' : 'ICAI'} textbook examples and practice 5 targeted questions.`
      });
    }
  }

  // Trajectory sorted by evaluation date
  const trajectory = evaluations
    .slice()
    .sort((a, b) => new Date(a.evaluated_at).getTime() - new Date(b.evaluated_at).getTime())
    .map(e => ({
      date: new Date(e.evaluated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      title: e.test_title,
      subject: e.subject,
      score: e.total_obtained_marks,
      percentage: e.percentage
    }));

  const averagePercentage = totalMaxMarks > 0 
    ? Math.round((totalMarksAwarded / totalMaxMarks) * 1000) / 10 
    : 0;

  return {
    totalEvaluations: evaluations.length,
    averagePercentage,
    totalMarksAwarded,
    totalMaxMarks,
    strongChaptersCount,
    moderateChaptersCount,
    weakChaptersCount,
    subjectPerformance,
    chapterPerformance,
    recurringMistakes,
    omissionErrorsCount,
    incompleteAnswersCount,
    calculationErrorsCount,
    conceptGaps,
    trajectory
  };
}

// ----------------- User Profile Storage -----------------
export const DEFAULT_PROFILES: import('../types').UserProfile[] = [];

export function isSessionAuthenticated(): boolean {
  try {
    const isAuth = localStorage.getItem(PROFILE_KEYS.IS_AUTHENTICATED);
    const activeId = localStorage.getItem(PROFILE_KEYS.ACTIVE_PROFILE_ID);
    return isAuth === 'true' && Boolean(activeId);
  } catch (err) {
    return false;
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(PROFILE_KEYS.ACTIVE_PROFILE_ID);
    localStorage.removeItem(PROFILE_KEYS.IS_AUTHENTICATED);
  } catch (err) {
    console.error('Error clearing session:', err);
  }
}

export function hasUserOnboarded(): boolean {
  try {
    return localStorage.getItem(PROFILE_KEYS.HAS_ONBOARDED) === 'true';
  } catch (err) {
    return false;
  }
}

export function setHasUserOnboarded(status: boolean): void {
  try {
    localStorage.setItem(PROFILE_KEYS.HAS_ONBOARDED, status ? 'true' : 'false');
  } catch (err) {
    console.error('Error saving onboarded status:', err);
  }
}

export function getSavedProfiles(): import('../types').UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILE_KEYS.PROFILES);
    if (!raw) {
      const defaultAdmin: import('../types').UserProfile = {
        id: 'admin_himanshu',
        name: 'Himanshu Chawla',
        role: 'teacher_admin',
        email: 'admin@studymentor.edu',
        targetJourney: 'CLASS_12',
        targetScorePercentage: 95,
        hasInspectorPrivilege: true,
        approvalStatus: 'approved',
        isKillSwitched: false,
        bio: 'Super Admin & Lead Paper Examiner for Class 12 & CA Foundation.',
        assignedBatches: ['Class 12 Commerce - Batch Alpha', 'CA Foundation - Fastrack Batch 1'],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(PROFILE_KEYS.PROFILES, JSON.stringify([defaultAdmin]));
      // DO NOT set active profile automatically! Must authenticate!
      return [defaultAdmin];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
  } catch (err) {
    console.error('Error reading profiles:', err);
    return [];
  }
}

export function saveProfile(profile: import('../types').UserProfile): import('../types').UserProfile[] {
  try {
    const current = getSavedProfiles();
    const idx = current.findIndex(p => p.id === profile.id);
    let updated: import('../types').UserProfile[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = profile;
    } else {
      updated = [...current, profile];
    }
    localStorage.setItem(PROFILE_KEYS.PROFILES, JSON.stringify(updated));
    // Sync profile to cloud in background
    syncProfileToCloud(profile).catch(err => console.warn('[CloudSync] Profile sync notice:', err));
    return updated;
  } catch (err) {
    console.error('Error saving profile:', err);
    return getSavedProfiles();
  }
}

export function saveProfilesBulk(profilesToMerge: import('../types').UserProfile[]): import('../types').UserProfile[] {
  try {
    const current = getSavedProfiles();
    const map = new Map<string, import('../types').UserProfile>();
    for (const p of current) {
      if (p && p.id) map.set(p.id, p);
    }
    for (const p of profilesToMerge) {
      if (p && p.id) {
        const existing = map.get(p.id);
        if (!existing) {
          map.set(p.id, p);
        } else {
          map.set(p.id, { ...existing, ...p });
        }
      }
    }
    const updated = Array.from(map.values());
    localStorage.setItem(PROFILE_KEYS.PROFILES, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving profiles bulk:', err);
    return getSavedProfiles();
  }
}

export function getActiveProfile(): import('../types').UserProfile | null {
  try {
    if (!isSessionAuthenticated()) return null;
    const profiles = getSavedProfiles();
    const activeId = localStorage.getItem(PROFILE_KEYS.ACTIVE_PROFILE_ID);
    if (activeId) {
      const found = profiles.find(p => p.id === activeId);
      if (found) return found;
    }
  } catch (err) {
    // fallback
  }
  return null;
}

export function setActiveProfile(profileId: string): void {
  try {
    localStorage.setItem(PROFILE_KEYS.ACTIVE_PROFILE_ID, profileId);
    localStorage.setItem(PROFILE_KEYS.IS_AUTHENTICATED, 'true');
    localStorage.setItem(PROFILE_KEYS.HAS_ONBOARDED, 'true');
  } catch (err) {
    console.error('Error setting active profile:', err);
  }
}

// ----------------- Private Support Tickets (Isolated) -----------------
const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'ticket_seed_01',
    studentId: 'usr_arjun_c12',
    studentName: 'Arjun Mehta',
    studentEmail: 'arjun.mehta@delhividyapith.edu',
    studentRoll: 'CBSE-12-88214',
    journey: 'CLASS_12',
    subject: 'Accountancy',
    category: 'Evaluation Doubt',
    subjectTitle: 'Doubt in Partnership Revaluation Goodwill Working Note',
    status: 'in_progress',
    priority: 'high',
    messages: [
      {
        id: 'msg_01',
        senderId: 'usr_arjun_c12',
        senderName: 'Arjun Mehta',
        senderRole: 'student',
        message: 'Sir, in my Accountancy test on Admission of Partner, 1.5 marks were deducted in Question 3 for the goodwill adjustment entry. Is sacrificing ratio mandatory to show in working notes for full 6 marks?',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'msg_02',
        senderId: 'admin_himanshu',
        senderName: 'Himanshu Chawla',
        senderRole: 'teacher_admin',
        message: 'Hello Arjun! Yes, as per CBSE Marking Scheme (Core 055), working notes carrying the step-by-step Sacrificing Ratio calculation (Old Ratio - New Ratio) carry 1 full mark. Always box your ratio before writing the Journal Entry.',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    isReadByAdmin: true,
    isReadByStudent: true
  },
  {
    id: 'ticket_seed_02',
    studentId: 'usr_priya_ca',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@icaifoundation.org',
    studentRoll: 'WRO-089124',
    journey: 'CA_FOUNDATION',
    subject: 'Business Laws',
    category: 'Chapter Test Query',
    subjectTitle: 'Request for Companies Act 2013 Corporate Veil Mock Drill',
    status: 'open',
    priority: 'normal',
    messages: [
      {
        id: 'msg_03',
        senderId: 'usr_priya_ca',
        senderName: 'Priya Sharma',
        senderRole: 'student',
        message: 'Respected Himanshu Sir, can we have a dedicated Chapter Range test covering Indian Regulatory Framework and Companies Act 2013 with ICAI 4-tier case law evaluation?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isReadByAdmin: false,
    isReadByStudent: true
  }
];

export function getSavedSupportTickets(studentId?: string, isAdmin?: boolean): SupportTicket[] {
  try {
    const raw = localStorage.getItem(KEYS.TICKETS);
    let tickets: SupportTicket[] = [];
    if (!raw) {
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(SEED_TICKETS));
      tickets = SEED_TICKETS;
    } else {
      tickets = JSON.parse(raw);
    }

    if (isAdmin) {
      // Admin sees ALL tickets
      return tickets.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    }

    if (studentId) {
      // Normal student sees ONLY their own tickets (Zero cross-user leakage)
      return tickets
        .filter(t => t.studentId === studentId)
        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    }

    return [];
  } catch (err) {
    console.error('Error reading support tickets:', err);
    return [];
  }
}

export function saveSupportTicket(ticket: SupportTicket): SupportTicket[] {
  try {
    const raw = localStorage.getItem(KEYS.TICKETS);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : [...SEED_TICKETS];
    const idx = tickets.findIndex(t => t.id === ticket.id);
    let updated: SupportTicket[];

    if (idx >= 0) {
      updated = [...tickets];
      updated[idx] = { ...ticket, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...ticket, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...tickets];
    }

    localStorage.setItem(KEYS.TICKETS, JSON.stringify(updated));
    syncSupportTicketToCloud(ticket).catch(err => console.warn('[CloudSync] Ticket cloud sync:', err));
    return updated;
  } catch (err) {
    console.error('Error saving support ticket:', err);
    return [];
  }
}

export function deleteSupportTicket(ticketId: string): SupportTicket[] {
  try {
    const raw = localStorage.getItem(KEYS.TICKETS);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : [];
    const updated = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(updated));
    deleteSupportTicketFromCloud(ticketId).catch(err => console.warn('[CloudSync] Ticket cloud delete:', err));
    return updated;
  } catch (err) {
    console.error('Error deleting support ticket:', err);
    return [];
  }
}

export function addMessageToSupportTicket(
  ticketId: string, 
  message: { senderId: string; senderName: string; senderRole: 'student' | 'teacher_admin'; message: string }
): SupportTicket | null {
  try {
    const raw = localStorage.getItem(KEYS.TICKETS);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : [...SEED_TICKETS];
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx < 0) return null;

    const existing = tickets[idx];
    const newMsg: SupportMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: message.senderId,
      senderName: message.senderName,
      senderRole: message.senderRole,
      message: message.message.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedTicket: SupportTicket = {
      ...existing,
      messages: [...existing.messages, newMsg],
      updatedAt: new Date().toISOString(),
      isReadByAdmin: message.senderRole === 'teacher_admin',
      isReadByStudent: message.senderRole === 'student'
    };

    tickets[idx] = updatedTicket;
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
    syncSupportTicketToCloud(updatedTicket).catch(err => console.warn('[CloudSync] Ticket cloud sync:', err));
    return updatedTicket;
  } catch (err) {
    console.error('Error adding message to support ticket:', err);
    return null;
  }
}

export function updateTicketStatus(ticketId: string, status: TicketStatus): SupportTicket | null {
  try {
    const raw = localStorage.getItem(KEYS.TICKETS);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : [];
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx < 0) return null;

    const updatedTicket: SupportTicket = {
      ...tickets[idx],
      status,
      updatedAt: new Date().toISOString()
    };

    tickets[idx] = updatedTicket;
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
    syncSupportTicketToCloud(updatedTicket).catch(err => console.warn('[CloudSync] Ticket cloud sync:', err));
    return updatedTicket;
  } catch (err) {
    console.error('Error updating ticket status:', err);
    return null;
  }
}

