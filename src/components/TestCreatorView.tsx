import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Layers,
  ListChecks,
  Sliders,
  Check,
  RotateCcw,
  Loader2,
  Trash2,
  GraduationCap,
  History,
  Calendar,
  Filter,
  CheckCheck
} from 'lucide-react';
import { GeneratedTest, ActiveTab, AcademicJourney, UserProfile } from '../types';
import { generateAITest } from '../services/api';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { ExamStopwatchPaceTracker } from './ExamStopwatchPaceTracker';
import { checkGuestQuota, consumeGuestQuota, isUserGuest } from '../utils/guestManager';
import { acquireActionLock } from '../utils/performance';

interface TestCreatorPrefill {
  subject?: string;
  topic?: string;
  customInstructions?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Exam Standard';
  numQuestions?: number;
  totalMarks?: number;
  durationMinutes?: number;
  autoGenerate?: boolean;
  isRemedial?: boolean;
  weakTopics?: string[];
  pyqMode?: boolean;
  pyqYearRange?: string;
}

interface TestCreatorViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (j: AcademicJourney) => void;
  savedTests: GeneratedTest[];
  onSaveTest: (test: GeneratedTest) => void;
  onDeleteTest: (testId: string) => void;
  onStartEvaluationWithTest: (test: GeneratedTest) => void;
  setActiveTab: (tab: ActiveTab) => void;
  initialPrefill?: TestCreatorPrefill | null;
  activeProfile?: UserProfile | null;
  onTriggerGuestLimit?: (featureName: string, message?: string) => void;
}

const QUESTION_TYPE_OPTIONS = [
  'Short Answer',
  'Numerical / Calculation',
  'Long Answer & Case Study',
  'Conceptual / Reason',
  'Multiple Choice (MCQ)'
];

const PYQ_YEAR_RANGES = [
  { id: '2015-2025', label: '10-Year Pool (2015 – 2025)', desc: 'Complete 10-year comprehensive blueprint' },
  { id: '2020-2025', label: 'Last 5 Years (2020 – 2025)', desc: 'High frequency & latest competency style' },
  { id: '2023-2025', label: 'Recent Years (2023 – 2025)', desc: 'Fresh 2025 board & ICAI paper trends' },
  { id: '2025-Special', label: '2025 Board & RTP Series', desc: 'Latest 2025 official exam & sample papers' },
];

type ChapterSelectionMode = 'single' | 'unit' | 'range' | 'custom' | 'all';

export const TestCreatorView: React.FC<TestCreatorViewProps> = ({
  currentJourney,
  setCurrentJourney,
  savedTests,
  onSaveTest,
  onDeleteTest,
  onStartEvaluationWithTest,
  setActiveTab,
  initialPrefill,
  activeProfile,
  onTriggerGuestLimit
}) => {
  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];

  const [subject, setSubject] = useState(initialPrefill?.subject || journeyDef.subjects[0]?.name || 'Accountancy');
  const currentSubjectDef = journeyDef.subjects.find(s => s.name === subject) || journeyDef.subjects[0];
  const availableChapters = currentSubjectDef?.chapters || [];

  const [chapterMode, setChapterMode] = useState<ChapterSelectionMode>('single');
  const [selectedUnit, setSelectedUnit] = useState<string>(currentSubjectDef?.units?.[0]?.unitName || '');
  const [singleChapterUnitFilter, setSingleChapterUnitFilter] = useState<string>('all');
  const [topic, setTopic] = useState(initialPrefill?.topic || availableChapters[0] || 'General Chapter');
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [rangeEnd, setRangeEnd] = useState<number>(Math.min(3, availableChapters.length - 1));
  const [customSelectedChapters, setCustomSelectedChapters] = useState<string[]>([availableChapters[0] || '']);

  // PYQ Mode State
  const [isPyqMode, setIsPyqMode] = useState<boolean>(initialPrefill?.pyqMode ?? true);
  const [pyqYearRange, setPyqYearRange] = useState<string>(initialPrefill?.pyqYearRange || '2015-2025');
  const [minMarksFilter, setMinMarksFilter] = useState<'any' | '3plus' | '5plus'>('any');

  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Exam Standard'>(initialPrefill?.difficulty || 'Exam Standard');
  const [numQuestions, setNumQuestions] = useState(initialPrefill?.numQuestions || 5);
  const [totalMarks, setTotalMarks] = useState(initialPrefill?.totalMarks || 25);
  const [durationMinutes, setDurationMinutes] = useState(initialPrefill?.durationMinutes || 45);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'Short Answer',
    'Numerical / Calculation',
    'Long Answer & Case Study'
  ]);
  const [customInstructions, setCustomInstructions] = useState(initialPrefill?.customInstructions || '');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTest, setCurrentTest] = useState<GeneratedTest | null>(
    savedTests.find(t => t.journey === currentJourney) || savedTests[0] || null
  );
  const [error, setError] = useState<string | null>(null);

  // When subject changes, reset chapters
  const handleSubjectChange = (newSub: string) => {
    setSubject(newSub);
    setSingleChapterUnitFilter('all');
    const subDef = journeyDef.subjects.find(s => s.name === newSub);
    const chapters = subDef?.chapters || [];
    setSelectedUnit(subDef?.units?.[0]?.unitName || '');
    setTopic(chapters[0] || 'General Chapter');
    setRangeStart(0);
    setRangeEnd(Math.min(3, Math.max(0, chapters.length - 1)));
    setCustomSelectedChapters(chapters.length > 0 ? [chapters[0]] : []);
  };

  // Compute effective topic string based on selection mode
  const getEffectiveTopic = (): { topicTitle: string; extraInstruction: string } => {
    if (chapterMode === 'single') {
      return {
        topicTitle: topic,
        extraInstruction: `Focus strictly on the chapter: ${topic}.`
      };
    } else if (chapterMode === 'unit') {
      const activeUnitObj = currentSubjectDef?.units?.find(u => u.unitName === selectedUnit) || currentSubjectDef?.units?.[0];
      const unitChapters = activeUnitObj?.chapters || [availableChapters[0] || ''];
      return {
        topicTitle: activeUnitObj?.unitName || `Unit Test: ${subject}`,
        extraInstruction: `This test covers the complete unit: "${activeUnitObj?.unitName}". This unit includes the following chapters: ${unitChapters.join(', ')}. Create a balanced test with questions spanning these chapters in this unit.`
      };
    } else if (chapterMode === 'range') {
      const startIdx = Math.min(rangeStart, rangeEnd);
      const endIdx = Math.max(rangeStart, rangeEnd);
      const chosen = availableChapters.slice(startIdx, endIdx + 1);
      const rangeLabel = `Chapter ${startIdx + 1} to ${endIdx + 1}: ${chosen[0]} to ${chosen[chosen.length - 1]}`;
      return {
        topicTitle: rangeLabel,
        extraInstruction: `This test covers a Custom Chapter Range (${startIdx + 1} to ${endIdx + 1}). Chapters included: ${chosen.map((c, i) => `Ch ${startIdx + 1 + i}: ${c}`).join(', ')}. Distribute questions evenly across these ${chosen.length} chapters.`
      };
    } else if (chapterMode === 'custom') {
      const chosen = customSelectedChapters.length > 0 ? customSelectedChapters : [availableChapters[0]];
      return {
        topicTitle: `Custom Selected (${chosen.length} Chapters): ${chosen.join(', ')}`,
        extraInstruction: `This test covers ${chosen.length} custom-selected chapters as per student choice: ${chosen.join(', ')}. Balance questions across all of these selected chapters.`
      };
    } else {
      // Full syllabus
      return {
        topicTitle: `Full Syllabus (${availableChapters.length} Chapters)`,
        extraInstruction: `This is a comprehensive full syllabus test covering all chapters: ${availableChapters.join(', ')}.`
      };
    }
  };

  // Sync initialPrefill when it changes
  React.useEffect(() => {
    if (initialPrefill) {
      if (initialPrefill.subject) setSubject(initialPrefill.subject);
      if (initialPrefill.topic) setTopic(initialPrefill.topic);
      if (initialPrefill.difficulty) setDifficulty(initialPrefill.difficulty);
      if (initialPrefill.numQuestions) setNumQuestions(initialPrefill.numQuestions);
      if (initialPrefill.totalMarks) setTotalMarks(initialPrefill.totalMarks);
      if (initialPrefill.durationMinutes) setDurationMinutes(initialPrefill.durationMinutes);
      if (initialPrefill.customInstructions) setCustomInstructions(initialPrefill.customInstructions);
      if (initialPrefill.pyqMode !== undefined) setIsPyqMode(initialPrefill.pyqMode);
      if (initialPrefill.pyqYearRange) setPyqYearRange(initialPrefill.pyqYearRange);

      if (initialPrefill.autoGenerate) {
        const triggerAutoGenerate = async () => {
          setIsGenerating(true);
          setError(null);
          try {
            const targetSubject = initialPrefill.subject || subject;
            const targetTopic = initialPrefill.topic || topic;
            const generated = await generateAITest({
              journey: currentJourney,
              level: journeyDef.defaultLevel,
              subject: targetSubject,
              topic: targetTopic,
              difficulty: initialPrefill.difficulty || 'Exam Standard',
              numQuestions: Number(initialPrefill.numQuestions || 4),
              totalMarks: Number(initialPrefill.totalMarks || 20),
              durationMinutes: Number(initialPrefill.durationMinutes || 35),
              questionTypes: ['Short Answer', 'Numerical / Calculation', 'Long Answer & Case Study'],
              customInstructions: initialPrefill.customInstructions || undefined,
              pyqMode: initialPrefill.pyqMode ?? isPyqMode,
              pyqYearRange: initialPrefill.pyqYearRange || pyqYearRange
            });

            const fullTest: GeneratedTest = {
              ...generated,
              journey: currentJourney,
              level: journeyDef.defaultLevel,
              subject: targetSubject,
              created_at: new Date().toISOString(),
              is_pyq_mode: initialPrefill.pyqMode ?? isPyqMode,
              pyq_year_range: initialPrefill.pyqYearRange || pyqYearRange
            };

            setCurrentTest(fullTest);
            onSaveTest(fullTest);
          } catch (err: any) {
            setError(err.message || 'Failed to auto-generate remedial test.');
          } finally {
            setIsGenerating(false);
          }
        };

        triggerAutoGenerate();
      }
    }
  }, [initialPrefill]);

  // Sync subject & chapters when journey changes
  React.useEffect(() => {
    if (!journeyDef.subjects.some(s => s.name === subject)) {
      const defaultSub = journeyDef.subjects[0]?.name || '';
      handleSubjectChange(defaultSub);
    }
  }, [currentJourney]);

  const toggleType = (t: string) => {
    setSelectedTypes(prev =>
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const toggleCustomChapter = (ch: string) => {
    setCustomSelectedChapters(prev => {
      if (prev.includes(ch)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(c => c !== ch);
      } else {
        return [...prev, ch];
      }
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    if (!acquireActionLock('generate_practice_test', 2000)) return;

    setError(null);

    // Guest quota enforcement (Bypassed 100% for registered/approved students & admins)
    if (isUserGuest(activeProfile)) {
      const quota = checkGuestQuota('test');
      if (!quota.canProceed) {
        if (onTriggerGuestLimit) {
          onTriggerGuestLimit('Test Creator', quota.message);
        } else {
          setError(quota.message || 'Daily limit of 2 tests reached for Guest Mode.');
        }
        return;
      }
    }

    setIsGenerating(true);

    try {
      const { topicTitle, extraInstruction } = getEffectiveTopic();
      let weightageFilterNote = '';
      if (minMarksFilter === '3plus') {
        weightageFilterNote = 'Prioritize Medium to High weightage past year questions (3 to 6 marks each).';
      } else if (minMarksFilter === '5plus') {
        weightageFilterNote = 'Prioritize High weightage long answer / case study questions (5+ marks each).';
      }

      const combinedInstructions = [
        customInstructions.trim(), 
        extraInstruction,
        weightageFilterNote
      ].filter(Boolean).join('\n');

      const generated = await generateAITest({
        journey: currentJourney,
        level: journeyDef.defaultLevel,
        subject,
        topic: topicTitle,
        difficulty,
        numQuestions: Number(numQuestions),
        totalMarks: Number(totalMarks),
        durationMinutes: Number(durationMinutes),
        questionTypes: selectedTypes,
        customInstructions: combinedInstructions || undefined,
        pyqMode: isPyqMode,
        pyqYearRange: pyqYearRange
      });

      const fullTest: GeneratedTest = {
        ...generated,
        journey: currentJourney,
        level: journeyDef.defaultLevel,
        subject: subject,
        created_at: new Date().toISOString(),
        is_pyq_mode: isPyqMode,
        pyq_year_range: pyqYearRange
      };

      setCurrentTest(fullTest);
      onSaveTest(fullTest);

      // Consume guest quota if guest
      if (isUserGuest(activeProfile)) {
        consumeGuestQuota('test');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate test. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintTest = () => {
    window.print();
  };

  // Get current included chapters in range
  const rangeStartClamped = Math.min(rangeStart, rangeEnd);
  const rangeEndClamped = Math.max(rangeStart, rangeEnd);
  const includedRangeChapters = availableChapters.slice(rangeStartClamped, rangeEndClamped + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Bento Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-1">
            <History className="w-3.5 h-3.5 text-amber-600" />
            <span>10-Year PYQ & Syllabus-Aligned Test Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Generate Authentic Exam Papers & Model Answers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Generate custom test papers from official past 10-year question banks (CBSE Board & ICAI Papers) with chapter range selection and step-by-step marking rubrics.
          </p>
        </div>

        {/* Academic Journey Switcher */}
        <div className="bg-gray-100 p-1 rounded-2xl flex items-center border border-gray-200 shrink-0 overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => {
              setCurrentJourney('CLASS_12');
              const def = ACADEMIC_JOURNEYS['CLASS_12'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CLASS_12'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            12th Commerce
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CLASS_12_SCIENCE');
              const def = ACADEMIC_JOURNEYS['CLASS_12_SCIENCE'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CLASS_12_SCIENCE'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            12th Science
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CLASS_12_ARTS');
              const def = ACADEMIC_JOURNEYS['CLASS_12_ARTS'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CLASS_12_ARTS'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            12th Arts
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CLASS_11_SCIENCE');
              const def = ACADEMIC_JOURNEYS['CLASS_11_SCIENCE'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CLASS_11_SCIENCE'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            11th Science
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CLASS_11_COMMERCE');
              const def = ACADEMIC_JOURNEYS['CLASS_11_COMMERCE'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CLASS_11_COMMERCE'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            11th Commerce
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CLASS_11_ARTS');
              const def = ACADEMIC_JOURNEYS['CLASS_11_ARTS'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CLASS_11_ARTS'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            11th Arts
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CA_FOUNDATION');
              const def = ACADEMIC_JOURNEYS['CA_FOUNDATION'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentJourney === 'CA_FOUNDATION'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            CA Foundation
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CA_INTERMEDIATE');
              const def = ACADEMIC_JOURNEYS['CA_INTERMEDIATE'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentJourney === 'CA_INTERMEDIATE'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            CA Intermediate
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CA_FINAL');
              const def = ACADEMIC_JOURNEYS['CA_FINAL'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentJourney === 'CA_FINAL'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            CA Final ICAI
          </button>
          <button
            onClick={() => {
              setCurrentJourney('NEET');
              const def = ACADEMIC_JOURNEYS['NEET'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentJourney === 'NEET'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            NEET (UG)
          </button>
          <button
            onClick={() => {
              setCurrentJourney('JEE');
              const def = ACADEMIC_JOURNEYS['JEE'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentJourney === 'JEE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            JEE (Main & Adv)
          </button>
          <button
            onClick={() => {
              setCurrentJourney('CUET');
              const def = ACADEMIC_JOURNEYS['CUET'];
              handleSubjectChange(def.subjects[0].name);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentJourney === 'CUET'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            CUET (UG)
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Two Column Layout: Generator Form & Test Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Generator Config Form Bento */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Test Configuration ({journeyDef.badge})</span>
              </h3>
            </div>

            {/* 🔥 10-YEAR PYQ MODE TOGGLE BENTO BOX */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isPyqMode 
                ? 'bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-amber-100/40 border-amber-300 shadow-2xs' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isPyqMode ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">
                        10-Year Past Year Questions (PYQ) Mode
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200/90 text-amber-900 text-[9px] font-black uppercase tracking-wider">
                        Official Papers
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {isPyqMode 
                        ? `Extracts authentic repeated questions from official ${currentJourney === 'CLASS_12' ? 'CBSE Board' : 'ICAI CA'} past papers with exam year tags.`
                        : 'Standard syllabus-aligned test generation without strict past paper restriction.'}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  id="pyq-mode-toggle"
                  onClick={() => setIsPyqMode(!isPyqMode)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    isPyqMode ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isPyqMode ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* PYQ Controls (If Enabled) */}
              {isPyqMode && (
                <div className="mt-3.5 pt-3 border-t border-amber-200/70 space-y-3">
                  {/* Year Range Filter */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-950 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>Past Year Paper Cycle:</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {PYQ_YEAR_RANGES.map(range => (
                        <button
                          key={range.id}
                          type="button"
                          onClick={() => setPyqYearRange(range.id)}
                          className={`p-1.5 rounded-xl text-center border transition-all cursor-pointer ${
                            pyqYearRange === range.id
                              ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                              : 'bg-white/80 hover:bg-white text-slate-700 border-amber-200/80 text-[10px]'
                          }`}
                        >
                          <div className="text-[11px] font-bold">{range.id}</div>
                          <div className={`text-[8px] truncate ${pyqYearRange === range.id ? 'text-amber-100' : 'text-slate-500'}`}>
                            {range.id === '2015-2025' ? '10-Yr Pool' : range.id === '2020-2025' ? 'Last 5 Yrs' : range.id === '2023-2025' ? 'Recent 3 Yrs' : '2025 Special'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weightage / Marks Filter */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-950 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-amber-600" />
                      <span>PYQ Weightage Filter:</span>
                    </label>
                    <div className="flex gap-1.5">
                      {[
                        { id: 'any', label: 'All Marks Mix' },
                        { id: '3plus', label: '3+ Marks (Medium/High)' },
                        { id: '5plus', label: '5+ Marks (Long/Case)' },
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setMinMarksFilter(f.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            minMarksFilter === f.id
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white border-amber-200 text-slate-600 hover:bg-amber-50'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Syllabus Guard Status Indicator */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-[11px] leading-relaxed">
                    <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">✓</span>
                    <div>
                      <span className="font-bold">New 2025-26 Syllabus Guard Active: </span>
                      <span className="text-emerald-800">
                        {currentJourney === 'CLASS_12' 
                          ? 'Past paper questions on deleted topics (NPO, Poverty in IED, Infrastructure, old CPA 1986, Rolle\'s theorem, 3D planes) are strictly filtered out.'
                          : currentJourney === 'NEET'
                          ? 'Past paper questions on deleted NMC NEET topics (Earthworm, Sensory Organs, Transport in Plants) are strictly filtered out.'
                          : currentJourney === 'JEE'
                          ? 'Past paper questions on deleted NTA JEE topics (Solid State, Surface Chem, Polymers, Communication Systems) are strictly filtered out.'
                          : currentJourney === 'CUET'
                          ? 'Past paper questions on out-of-syllabus units and outdated pattern formats are strictly filtered out as per NTA CUET standards.'
                          : 'Past paper questions on deleted topics (BCR, BCK, Consignment) are strictly filtered out.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-gray-200 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {journeyDef.subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Chapter Selection Mode Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Chapter Scope / Coverage *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setChapterMode('single')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    chapterMode === 'single'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Single Chapter
                </button>
                <button
                  type="button"
                  onClick={() => setChapterMode('unit')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    chapterMode === 'unit'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unit Test ⭐
                </button>
                <button
                  type="button"
                  onClick={() => setChapterMode('range')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    chapterMode === 'range'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chapter Range
                </button>
                <button
                  type="button"
                  onClick={() => setChapterMode('custom')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    chapterMode === 'custom'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Your Choice
                </button>
                <button
                  type="button"
                  onClick={() => setChapterMode('all')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    chapterMode === 'all'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full Syllabus
                </button>
              </div>

              {/* Mode: Unit Test (Whole Unit coverage) */}
              {chapterMode === 'unit' && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Select Unit to Test</span>
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">
                      Full Unit Examination
                    </span>
                  </div>

                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-indigo-200 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {(currentSubjectDef?.units || []).map(u => (
                      <option key={u.unitName} value={u.unitName}>
                        {u.unitName} ({u.chapters.length} chapters)
                      </option>
                    ))}
                  </select>

                  {/* Show chapters included in the selected unit */}
                  {(() => {
                    const currentUnitObj = currentSubjectDef?.units?.find(u => u.unitName === selectedUnit) || currentSubjectDef?.units?.[0];
                    if (!currentUnitObj) return null;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">
                            Chapters Included in this Unit Test:
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-600">
                            {currentUnitObj.chapters.length} Chapters
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {currentUnitObj.chapters.map(ch => (
                            <span
                              key={ch}
                              className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                            >
                              • {ch}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-500 italic pt-1">
                          💡 Need a test on only one particular chapter (e.g. {currentUnitObj.chapters[0]})? Switch to "Single Chapter" above!
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Mode 1: Single Chapter Focus */}
              {chapterMode === 'single' && (
                <div className="pt-1 space-y-2">
                  {currentSubjectDef?.units && currentSubjectDef.units.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setSingleChapterUnitFilter('all')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          singleChapterUnitFilter === 'all'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All Units ({availableChapters.length})
                      </button>
                      {currentSubjectDef.units.map(u => {
                        const shortName = u.unitName.includes(':')
                          ? u.unitName.split(':')[0] + ': ' + u.unitName.split(':')[1].split('(')[0].trim()
                          : u.unitName;
                        return (
                          <button
                            key={u.unitName}
                            type="button"
                            onClick={() => {
                              setSingleChapterUnitFilter(u.unitName);
                              if (!u.chapters.includes(topic) && u.chapters.length > 0) {
                                setTopic(u.chapters[0]);
                              }
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              singleChapterUnitFilter === u.unitName
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {shortName} ({u.chapters.length})
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-gray-200 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {currentSubjectDef?.units ? (
                      singleChapterUnitFilter === 'all' ? (
                        currentSubjectDef.units.map(u => (
                          <optgroup key={u.unitName} label={u.unitName}>
                            {u.chapters.map((ch) => {
                              const globalIdx = availableChapters.indexOf(ch);
                              return (
                                <option key={ch} value={ch}>
                                  Ch {globalIdx + 1}: {ch}
                                </option>
                              );
                            })}
                          </optgroup>
                        ))
                      ) : (
                        currentSubjectDef.units
                          .filter(u => u.unitName === singleChapterUnitFilter)
                          .map(u => (
                            <optgroup key={u.unitName} label={u.unitName}>
                              {u.chapters.map(ch => {
                                const globalIdx = availableChapters.indexOf(ch);
                                return (
                                  <option key={ch} value={ch}>
                                    Ch {globalIdx + 1}: {ch}
                                  </option>
                                );
                              })}
                            </optgroup>
                          ))
                      )
                    ) : (
                      availableChapters.map((ch, idx) => (
                        <option key={ch} value={ch}>
                          Ch {idx + 1}: {ch}
                        </option>
                      ))
                    )}
                  </select>

                  {currentSubjectDef?.units && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="font-bold text-indigo-700">Section:</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[10px] border border-slate-200">
                        {currentSubjectDef.units.find(u => u.chapters.includes(topic))?.unitName || 'General'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: Chapter Range (e.g. Chapter 2 to 6, Chapter 7 to 12) */}
              {chapterMode === 'range' && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Select Chapter Range</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-900 text-[10px]">
                      {includedRangeChapters.length} Chapters Combined
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        From (Start Chapter)
                      </label>
                      <select
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Number(e.target.value))}
                        className="w-full px-2.5 py-2 text-xs font-bold bg-white rounded-xl border border-indigo-200 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        {availableChapters.map((ch, idx) => (
                          <option key={`start_${idx}`} value={idx}>
                            Ch {idx + 1}: {ch.length > 22 ? ch.substring(0, 20) + '...' : ch}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        To (End Chapter)
                      </label>
                      <select
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Number(e.target.value))}
                        className="w-full px-2.5 py-2 text-xs font-bold bg-white rounded-xl border border-indigo-200 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        {availableChapters.map((ch, idx) => (
                          <option key={`end_${idx}`} value={idx}>
                            Ch {idx + 1}: {ch.length > 22 ? ch.substring(0, 20) + '...' : ch}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visual Tags of Included Chapters */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-800">
                      Included in Test Paper (Ch {rangeStartClamped + 1} to Ch {rangeEndClamped + 1}):
                    </p>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                      {includedRangeChapters.map((ch, idx) => (
                        <span 
                          key={ch} 
                          className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-slate-700 text-[10px] font-medium"
                        >
                          Ch {rangeStartClamped + 1 + idx}: {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Custom As Per Your Choice */}
              {chapterMode === 'custom' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Pick Any Chapters ({customSelectedChapters.length} Selected)</span>
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setCustomSelectedChapters([...availableChapters])}
                        className="text-indigo-600 hover:underline cursor-pointer"
                      >
                        Select All ({availableChapters.length})
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setCustomSelectedChapters([availableChapters[0]])}
                        className="text-slate-500 hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* If subject has units, provide quick unit selection pills */}
                  {currentSubjectDef?.units && (
                    <div className="flex flex-wrap gap-1 pt-1 pb-1 border-b border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 self-center mr-1">Quick Select:</span>
                      {currentSubjectDef.units.map(u => {
                        const allUnitSelected = u.chapters.every(ch => customSelectedChapters.includes(ch));
                        const shortUnitName = u.unitName.includes(':') 
                          ? u.unitName.split(':')[0] 
                          : u.unitName;
                        return (
                          <button
                            key={u.unitName}
                            type="button"
                            onClick={() => {
                              if (allUnitSelected) {
                                // Deselect this unit's chapters (unless it leaves empty, keep at least one)
                                const remaining = customSelectedChapters.filter(ch => !u.chapters.includes(ch));
                                setCustomSelectedChapters(remaining.length > 0 ? remaining : [availableChapters[0]]);
                              } else {
                                // Add all chapters from this unit
                                const union = Array.from(new Set([...customSelectedChapters, ...u.chapters]));
                                setCustomSelectedChapters(union);
                              }
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                              allUnitSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-50'
                            }`}
                          >
                            {allUnitSelected ? '✓ ' : '+ '} {shortUnitName} ({u.chapters.length})
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {availableChapters.map((ch, idx) => {
                      const isChecked = customSelectedChapters.includes(ch);
                      const unitOwner = currentSubjectDef?.units?.find(u => u.chapters.includes(ch));
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => toggleCustomChapter(ch)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                            isChecked
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                              : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="shrink-0 font-bold text-slate-800">
                              Ch {idx + 1}:
                            </span>
                            <span className="truncate">{ch}</span>
                            {unitOwner && (
                              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200/60 text-slate-600 shrink-0">
                                {unitOwner.unitName.includes(':') ? unitOwner.unitName.split(':')[0] : 'Unit'}
                              </span>
                            )}
                          </div>
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-indigo-600 text-white' : 'border border-gray-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode 4: Full Syllabus */}
              {chapterMode === 'all' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Full Syllabus Mock Paper covering all <strong>{availableChapters.length} chapters</strong> with comprehensive weightage.
                  </span>
                </div>
              )}
            </div>

            {/* Questions, Marks, Time */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Questions</label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time (mins)</label>
                <input
                  type="number"
                  min={10}
                  max={180}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Easy', 'Medium', 'Hard', 'Exam Standard'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer text-center ${
                      difficulty === diff
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Question Types Included</label>
              <div className="flex flex-wrap gap-1.5">
                {QUESTION_TYPE_OPTIONS.map(type => {
                  const isSel = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPyqMode 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isPyqMode ? 'Extracting Past 10-Yr Papers & Solutions...' : 'Drafting Exam Paper & Answers...'}</span>
                </>
              ) : (
                <>
                  {isPyqMode ? <History className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isPyqMode ? `Generate ${pyqYearRange} PYQ Exam Paper` : 'Generate Test Paper'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Generated Test View Bento */}
        <div className="lg:col-span-7 space-y-6">
          {currentTest ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                      {currentTest.level || journeyDef.title} • {currentTest.subject}
                    </span>
                    {currentTest.is_pyq_mode && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                        <History className="w-3 h-3 text-amber-700" />
                        <span>PYQ Series ({currentTest.pyq_year_range || '10-Yr Pool'})</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{currentTest.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Total Marks: <strong className="text-slate-800">{currentTest.total_marks}</strong> • Duration: <strong className="text-slate-800">{currentTest.duration_minutes} Mins</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartEvaluationWithTest(currentTest)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Evaluate My Answers</span>
                  </button>
                  <button
                    onClick={handlePrintTest}
                    className="p-2 text-gray-500 hover:text-slate-900 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
                    title="Print Test"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Exam-Hall Stopwatch & Pace Tracker */}
              <ExamStopwatchPaceTracker
                durationMinutes={currentTest.duration_minutes || 45}
                totalMarks={currentTest.total_marks || 25}
                totalQuestions={currentTest.questions?.length || 5}
                testTitle={currentTest.title}
              />

              {/* Question list */}
              <div className="space-y-4">
                {currentTest.questions.map((q, idx) => (
                  <div key={q.question_id || idx} className="p-4 rounded-2xl bg-gray-50/90 border border-gray-100 space-y-2.5 text-xs hover:border-gray-200 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">
                          {q.question_id || `Q${idx + 1}`}. [{q.question_type || 'Short Answer'}]
                        </span>
                        
                        {/* 🌟 OFFICIAL PAST YEAR EXAM TAG BADGE */}
                        {q.pyq_tag && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-300/80 text-amber-900 font-extrabold text-[10px] shadow-2xs">
                            <History className="w-3 h-3 text-amber-600" />
                            <span>{q.pyq_tag}</span>
                          </span>
                        )}
                      </div>

                      <span className="font-black px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 text-[11px] shrink-0">
                        {q.max_marks} Marks
                      </span>
                    </div>

                    <p className="text-slate-800 text-xs leading-relaxed font-medium">
                      {q.question_text}
                    </p>

                    {/* Marking Scheme Steps */}
                    {q.marking_scheme_steps && q.marking_scheme_steps.length > 0 && (
                      <div className="pt-2 border-t border-gray-200/60 mt-2">
                        <p className="font-bold text-[11px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Official Step-wise Marking Scheme:</span>
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-0.5 text-[11px]">
                          {q.marking_scheme_steps.map((st, sidx) => (
                            <li key={sidx}>{st}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-400 text-xs">
              Configure parameters on the left and click "Generate Test Paper" to produce a standard exam copy.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
