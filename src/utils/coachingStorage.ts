import { InstitutionalBatchTest, MasterQuestionPaperConfig } from '../types/coaching';
import { AcademicJourney, EvaluationResult } from '../types';

const COACHING_BATCHES_KEY = 'studymentor_coaching_batches_v1';
const COACHING_PROFILE_KEY = 'studymentor_coaching_profile_v1';

export interface CoachingPartnerProfile {
  instituteName: string;
  partnerName: string;
  email: string;
  phone?: string;
  city?: string;
  tagline?: string;
  watermarkText: string;
  isApprovedByAdmin: boolean;
  registeredAt: string;
  batchesCount: number;
}

export const DEFAULT_COACHING_PROFILE: CoachingPartnerProfile = {
  instituteName: 'Apex Rankers Academy',
  partnerName: 'Himanshu Sharma (HOD)',
  email: 'himanshuch492@gmail.com',
  phone: '+91 98765 43210',
  city: 'Kota / Delhi NCR',
  tagline: 'Premier Board & Entrance Excellence Center',
  watermarkText: 'APEX ACADEMY • CONFIDENTIAL EVALUATION',
  isApprovedByAdmin: true,
  registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  batchesCount: 3
};

// Seed sample batches for instant out-of-the-box demonstration
export const SEED_BATCH_TESTS: InstitutionalBatchTest[] = [
  {
    id: 'batch_c11_phy_term1',
    batchName: 'Class 11 Science - Batch Galileo (Morning)',
    instituteName: 'Apex Rankers Academy',
    watermarkText: 'APEX ACADEMY • VERIFIED EXAMINER',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'completed',
    targetStudentCount: 5,
    pagesPerStudentEstimate: 3,
    averageScore: 54.6,
    highestScore: 67.5,
    lowestScore: 42.0,
    passPercentage: 100,
    questionPaper: {
      paperTitle: 'Class 11 Physics: Mechanics, Laws of Motion & Work-Energy Mock Exam',
      journey: 'CLASS_11_SCIENCE',
      subject: 'Physics',
      chapterOrTopic: 'Kinematics & Laws of Motion (Units 1 to 4)',
      totalQuestions: 4,
      totalMarks: 70,
      durationMinutes: 180,
      markingSchemeType: 'step_wise_strict',
      masterAnswerKeyText: 'Step-wise marking scheme strictly applied: 0.5 mark for given data + SI unit, 1 mark for formula derivation, 1.5 marks for intermediate substitution, 1 mark for final boxed answer with mandatory SI units.',
      sections: [
        { id: 'sec_a', sectionName: 'Section A (Derivations & Concepts)', questionCount: 2, marksPerQuestion: 15, questionNumbers: ['Q1', 'Q2'] },
        { id: 'sec_b', sectionName: 'Section B (Numericals & Applications)', questionCount: 2, marksPerQuestion: 20, questionNumbers: ['Q3', 'Q4'] }
      ]
    },
    evaluatedSubmissions: [
      {
        id: 'eval_batch_std_1',
        test_title: 'Class 11 Physics: Mechanics & Laws of Motion Mock Exam',
        journey: 'CLASS_11_SCIENCE',
        level: 'Class 11 CBSE (Science)',
        subject: 'Physics',
        chapter: 'Kinematics & Laws of Motion',
        total_max_marks: 70,
        total_obtained_marks: 67.5,
        percentage: 96.4,
        confidence_overall: 'High',
        studentName: 'Aarav Sharma',
        file_name: 'Aarav_Sharma_Roll101_Physics.pdf',
        evaluated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        stats: { total_questions: 4, attempted: 4, correct: 3, mostly_correct: 1, partially_correct: 0, incorrect: 0, not_attempted: 0 },
        questions: [
          {
            question_id: 'Q1',
            question_number: 1,
            question_text: 'Derive the expression for the maximum speed with which a car can safely take a turn on a banked road having coefficient of friction μ.',
            max_marks: 15,
            awarded_marks: 15,
            status: 'Correct',
            confidence: 'High',
            student_answer: 'Drew free body diagram with normal reaction components N cos θ and N sin θ, frictional force components f cos θ and f sin θ. Set up equations for vertical and horizontal equilibrium. Solved for v_max = √[rg (tan θ + μ) / (1 - μ tan θ)].',
            expected_model_answer: 'Accurate FBD with all forces resolved, vertical equilibrium N cos θ = mg + f sin θ, horizontal centripetal force N sin θ + f cos θ = mv²/r. Final relation v = √[rg (μ + tan θ) / (1 - μ tan θ)].',
            keyterms_required: ['Free Body Diagram', 'Banking Angle', 'Centripetal Force', 'Limiting Friction'],
            keyterms_present: ['Free Body Diagram', 'Banking Angle', 'Centripetal Force', 'Limiting Friction'],
            keyterms_missing: [],
            correct_points: ['Complete FBD with correct arrow vectors', 'Flawless algebraic trigonometric derivation'],
            missing_points: [],
            errors: [],
            teacher_feedback: 'Exemplary derivation with clean vector diagram and physical reasoning.',
            marks_deduction_reason: 'None. Full marks awarded.'
          },
          {
            question_id: 'Q2',
            question_number: 2,
            question_text: 'State and prove the Work-Energy Theorem for a variable force in one dimension.',
            max_marks: 15,
            awarded_marks: 14.5,
            status: 'Mostly Correct',
            confidence: 'High',
            student_answer: 'Statement: Work done by the net force acting on a body equals the change in its kinetic energy. Proof: dK/dt = d(1/2 mv²)/dt = m v (dv/dt) = m a v = F v = F (dx/dt). Therefore dK = F dx. Integrating both sides from xi to xf gives Kf - Ki = W.',
            expected_model_answer: 'Definition of Work-Energy Theorem. Calculus proof dK = F dx and integration limits from initial to final position. Final relation W = ΔK.',
            keyterms_required: ['Work-Energy Theorem', 'Variable Force', 'Calculus Integration', 'ΔK = W'],
            keyterms_present: ['Work-Energy Theorem', 'Variable Force', 'Calculus Integration', 'ΔK = W'],
            keyterms_missing: [],
            correct_points: ['Accurate calculus proof from first principles', 'Clear integration step'],
            missing_points: ['Minor: Specify that force is conservative or net external force in definition statement'],
            errors: [],
            teacher_feedback: 'Outstanding mathematical rigor. Specify net external force in the introductory line.',
            marks_deduction_reason: '0.5 mark deducted for omitting \'net external\' qualifier in verbal definition.'
          },
          {
            question_id: 'Q3',
            question_number: 3,
            question_text: 'A bullet of mass 50 g moving with velocity 400 m/s strikes a wooden block of mass 2 kg suspended by a string. If the bullet gets embedded, find the height to which the block rises. (Take g = 9.8 m/s²)',
            max_marks: 20,
            awarded_marks: 20,
            status: 'Correct',
            confidence: 'High',
            student_answer: 'Conservation of linear momentum: m1 v1 = (m1 + m2) V. (0.05 × 400) = (2.05) V => V = 20 / 2.05 = 9.756 m/s. Conservation of energy: (1/2) (m1 + m2) V² = (m1 + m2) g h => h = V² / (2g) = (9.756)² / (2 × 9.8) = 95.18 / 19.6 = 4.856 m.',
            expected_model_answer: 'Step 1: Conservation of momentum V = 9.756 m/s. Step 2: Mechanical energy conservation h = V² / 2g = 4.86 m.',
            keyterms_required: ['Conservation of Linear Momentum', 'Inelastic Collision', 'Conservation of Mechanical Energy', '4.86 m'],
            keyterms_present: ['Conservation of Linear Momentum', 'Inelastic Collision', 'Conservation of Mechanical Energy', '4.856 m'],
            keyterms_missing: [],
            correct_points: ['Correct unit conversion of bullet mass (0.05 kg)', 'Accurate 2-stage momentum and energy conservation steps', 'Correct final answer with unit (4.86 m)'],
            missing_points: [],
            errors: [],
            teacher_feedback: 'Perfect numerical handling with correct units and significant figures.',
            marks_deduction_reason: 'None. Full marks awarded.'
          },
          {
            question_id: 'Q4',
            question_number: 4,
            question_text: 'Calculate the power of a crane in kW which lifts a load of 2 metric tonnes to a height of 30 m in 20 seconds with an efficiency of 80%. (Take g = 9.8 m/s²)',
            max_marks: 20,
            awarded_marks: 18,
            status: 'Mostly Correct',
            confidence: 'High',
            student_answer: 'Mass = 2000 kg, h = 30 m, t = 20 s. Output Work = m g h = 2000 × 9.8 × 30 = 588,000 J. Output Power = Work / t = 588,000 / 20 = 29.4 kW. Input Power = Output Power / Efficiency = 29.4 / 0.8 = 36.75 kW.',
            expected_model_answer: 'Useful power = mgh/t = 29.4 kW. Required power = 29.4 / 0.8 = 36.75 kW.',
            keyterms_required: ['Efficiency formula', 'mgh/t', 'Output Power', '36.75 kW'],
            keyterms_present: ['Output Power', '36.75 kW'],
            keyterms_missing: [],
            correct_points: ['Accurate metric tonne conversion to 2000 kg', 'Correct output power 29.4 kW', 'Correct efficiency division yielding 36.75 kW'],
            missing_points: ['Did not write explicit algebraic formula definition for efficiency η = P_out / P_in before calculating'],
            errors: [],
            teacher_feedback: 'Correct numerical result. Always write the formula η = (P_out / P_in) × 100 explicitly.',
            marks_deduction_reason: '2 marks deducted for omitted general formula definition step.'
          }
        ],
        performance_analysis: {
          strengths: ['Calculus derivations', 'SI unit accuracy', 'Multi-stage physics problem decomposition'],
          weaknesses: ['Writing formal definition equations before numeric substitution'],
          repeated_errors: [],
          topic_breakdown: [
            { topic: 'Laws of Motion & Banking', max_marks: 15, obtained_marks: 15, percentage: 100 },
            { topic: 'Work-Energy Theorem', max_marks: 15, obtained_marks: 14.5, percentage: 96.7 },
            { topic: 'Inelastic Collisions & Momentum', max_marks: 20, obtained_marks: 20, percentage: 100 },
            { topic: 'Power & Mechanical Efficiency', max_marks: 20, obtained_marks: 18, percentage: 90 }
          ],
          marks_loss_summary: [
            { category: 'Incomplete Answer', marks_lost: 2.0, explanation: 'Missing explicit algebraic definition of efficiency' },
            { category: 'Weak Explanation', marks_lost: 0.5, explanation: 'Omitted net external force phrase in W-E theorem' }
          ],
          teacher_overall_feedback: 'Outstanding performance. Rank 1 in Batch Galileo.',
          recommended_study_plan: ['Maintain step-wise formula discipline for full marks in board finals']
        }
      },
      {
        id: 'eval_batch_std_2',
        test_title: 'Class 11 Physics: Mechanics & Laws of Motion Mock Exam',
        journey: 'CLASS_11_SCIENCE',
        level: 'Class 11 CBSE (Science)',
        subject: 'Physics',
        chapter: 'Kinematics & Laws of Motion',
        total_max_marks: 70,
        total_obtained_marks: 59.0,
        percentage: 84.3,
        confidence_overall: 'High',
        studentName: 'Bhavna Patel',
        file_name: 'Bhavna_Patel_Roll102_Physics.pdf',
        evaluated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        stats: { total_questions: 4, attempted: 4, correct: 2, mostly_correct: 2, partially_correct: 0, incorrect: 0, not_attempted: 0 },
        questions: [],
        performance_analysis: {
          strengths: ['Clear diagrams', 'Neat handwriting', 'Good numerical solving speed'],
          weaknesses: ['Forgot SI units on intermediate power calculation in Q4'],
          repeated_errors: ['SI unit omission on working steps'],
          topic_breakdown: [],
          marks_loss_summary: [{ category: 'Calculation Error', marks_lost: 4.0, explanation: 'Intermediate step arithmetic slip in collision velocity' }],
          teacher_overall_feedback: 'Very solid conceptual grasp, with minor arithmetic corrections needed.',
          recommended_study_plan: ['Double-check arithmetic substitutions during revision window']
        }
      },
      {
        id: 'eval_batch_std_3',
        test_title: 'Class 11 Physics: Mechanics & Laws of Motion Mock Exam',
        journey: 'CLASS_11_SCIENCE',
        level: 'Class 11 CBSE (Science)',
        subject: 'Physics',
        chapter: 'Kinematics & Laws of Motion',
        total_max_marks: 70,
        total_obtained_marks: 52.0,
        percentage: 74.3,
        confidence_overall: 'High',
        studentName: 'Rohan Verma',
        file_name: 'Rohan_Verma_Roll103_Physics.pdf',
        evaluated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        stats: { total_questions: 4, attempted: 4, correct: 1, mostly_correct: 2, partially_correct: 1, incorrect: 0, not_attempted: 0 },
        questions: [],
        performance_analysis: {
          strengths: ['Good grasp of kinematics', 'Underlined all final results'],
          weaknesses: ['Work-energy theorem integration limits were mixed up'],
          repeated_errors: ['Integration boundary conditions'],
          topic_breakdown: [],
          marks_loss_summary: [{ category: 'Conceptual Error', marks_lost: 7.0, explanation: 'Incomplete resolution of friction vectors on banked road' }],
          teacher_overall_feedback: 'Good effort, revise vector components on inclined curves.',
          recommended_study_plan: ['Re-practice banking of roads derivation with 3 separate color pens for normal and friction vectors']
        }
      },
      {
        id: 'eval_batch_std_4',
        test_title: 'Class 11 Physics: Mechanics & Laws of Motion Mock Exam',
        journey: 'CLASS_11_SCIENCE',
        level: 'Class 11 CBSE (Science)',
        subject: 'Physics',
        chapter: 'Kinematics & Laws of Motion',
        total_max_marks: 70,
        total_obtained_marks: 48.5,
        percentage: 69.3,
        confidence_overall: 'High',
        studentName: 'Ananya Gupta',
        file_name: 'Ananya_Gupta_Roll104_Physics.pdf',
        evaluated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        stats: { total_questions: 4, attempted: 4, correct: 1, mostly_correct: 1, partially_correct: 2, incorrect: 0, not_attempted: 0 },
        questions: [],
        performance_analysis: {
          strengths: ['Theoretical recall of Newton laws'],
          weaknesses: ['Crane efficiency problem incomplete working'],
          repeated_errors: [],
          topic_breakdown: [],
          marks_loss_summary: [{ category: 'Incomplete Answer', marks_lost: 8.0, explanation: 'Could not finish Q4 efficiency computation before time' }],
          teacher_overall_feedback: 'Needs pace improvement on long numerical calculations.',
          recommended_study_plan: ['Time-boxed 20-minute daily numerical drill']
        }
      },
      {
        id: 'eval_batch_std_5',
        test_title: 'Class 11 Physics: Mechanics & Laws of Motion Mock Exam',
        journey: 'CLASS_11_SCIENCE',
        level: 'Class 11 CBSE (Science)',
        subject: 'Physics',
        chapter: 'Kinematics & Laws of Motion',
        total_max_marks: 70,
        total_obtained_marks: 46.0,
        percentage: 65.7,
        confidence_overall: 'High',
        studentName: 'Devansh Singh',
        file_name: 'Devansh_Singh_Roll105_Physics.pdf',
        evaluated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        stats: { total_questions: 4, attempted: 4, correct: 0, mostly_correct: 3, partially_correct: 1, incorrect: 0, not_attempted: 0 },
        questions: [],
        performance_analysis: {
          strengths: ['Good conceptual clarity on momentum'],
          weaknesses: ['Missed SI units in final answers', 'Lost marks in Q1 FBD labels'],
          repeated_errors: ['Missing SI units'],
          topic_breakdown: [],
          marks_loss_summary: [{ category: 'Presentation / Format Issue', marks_lost: 5.0, explanation: 'Missing units on 3 separate sub-parts' }],
          teacher_overall_feedback: 'Focus on SI units and boxing final answers for immediate mark retention.',
          recommended_study_plan: ['SI unit checklist before submitting copy']
        }
      }
    ]
  }
];

export function getSavedCoachingBatches(): InstitutionalBatchTest[] {
  try {
    const raw = localStorage.getItem(COACHING_BATCHES_KEY);
    if (!raw) {
      localStorage.setItem(COACHING_BATCHES_KEY, JSON.stringify(SEED_BATCH_TESTS));
      return SEED_BATCH_TESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_BATCH_TESTS;
  } catch (err) {
    return SEED_BATCH_TESTS;
  }
}

export function saveCoachingBatch(batch: InstitutionalBatchTest): void {
  try {
    const batches = getSavedCoachingBatches();
    const existingIndex = batches.findIndex(b => b.id === batch.id);
    if (existingIndex >= 0) {
      batches[existingIndex] = batch;
    } else {
      batches.unshift(batch);
    }
    localStorage.setItem(COACHING_BATCHES_KEY, JSON.stringify(batches));
  } catch (err) {
    console.error('Failed to save coaching batch:', err);
  }
}

export function deleteCoachingBatch(batchId: string): void {
  try {
    const batches = getSavedCoachingBatches().filter(b => b.id !== batchId);
    localStorage.setItem(COACHING_BATCHES_KEY, JSON.stringify(batches));
  } catch (err) {
    console.error('Failed to delete coaching batch:', err);
  }
}

const PARTNER_APPLICATIONS_KEY = 'studymentor_partner_applications_v1';

export interface PartnerApplication {
  id: string;
  instituteName: string;
  partnerName: string;
  email: string;
  phone: string;
  city: string;
  estimatedStudents: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  watermarkText: string;
}

export const SEED_PARTNER_APPLICATIONS: PartnerApplication[] = [
  {
    id: 'app_apex_academy',
    instituteName: 'Apex Rankers Academy',
    partnerName: 'Himanshu Sharma (HOD)',
    email: 'himanshuch492@gmail.com',
    phone: '+91 98765 43210',
    city: 'Kota / Delhi NCR',
    estimatedStudents: 250,
    status: 'approved',
    appliedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    watermarkText: 'APEX ACADEMY • CONFIDENTIAL OFFICIAL EVALUATION'
  },
  {
    id: 'app_zenith_institute',
    instituteName: 'Zenith Commerce & CA Classes',
    partnerName: 'Prof. R. K. Mittal',
    email: 'zenith.commerce@edu.in',
    phone: '+91 98111 22334',
    city: 'Jaipur / Ahmedabad',
    estimatedStudents: 120,
    status: 'pending',
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    watermarkText: 'ZENITH COMMERCE • VERIFIED EVALUATION'
  },
  {
    id: 'app_catalyst_neet',
    instituteName: 'Catalyst Medical & JEE Foundation',
    partnerName: 'Dr. Ananya Roy',
    email: 'director@catalystfoundation.org',
    phone: '+91 98222 33445',
    city: 'Pune / Mumbai',
    estimatedStudents: 180,
    status: 'pending',
    appliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    watermarkText: 'CATALYST MED • OFFICIAL SCORECARD'
  }
];

export function getPartnerApplications(): PartnerApplication[] {
  try {
    const raw = localStorage.getItem(PARTNER_APPLICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(PARTNER_APPLICATIONS_KEY, JSON.stringify(SEED_PARTNER_APPLICATIONS));
      return SEED_PARTNER_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_PARTNER_APPLICATIONS;
  } catch (err) {
    return SEED_PARTNER_APPLICATIONS;
  }
}

export function savePartnerApplication(app: PartnerApplication): void {
  try {
    const list = getPartnerApplications();
    const existingIndex = list.findIndex(a => a.id === app.id || a.email.toLowerCase() === app.email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...app };
    } else {
      list.unshift(app);
    }
    localStorage.setItem(PARTNER_APPLICATIONS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save partner application:', err);
  }
}

export function updatePartnerApplicationStatus(appId: string, status: 'approved' | 'rejected'): PartnerApplication[] {
  try {
    const list = getPartnerApplications().map(a => {
      if (a.id === appId) {
        return { ...a, status };
      }
      return a;
    });
    localStorage.setItem(PARTNER_APPLICATIONS_KEY, JSON.stringify(list));

    // If approved, update active partner profile if matching email
    const target = list.find(a => a.id === appId);
    if (target && status === 'approved') {
      const currentProfile = getCoachingPartnerProfile();
      if (currentProfile.email.toLowerCase() === target.email.toLowerCase()) {
        saveCoachingPartnerProfile({
          ...currentProfile,
          isApprovedByAdmin: true,
          instituteName: target.instituteName,
          partnerName: target.partnerName,
          city: target.city,
          watermarkText: target.watermarkText
        });
      }
    }
    return list;
  } catch (err) {
    console.error('Failed to update partner application status:', err);
    return getPartnerApplications();
  }
}

export function getCoachingPartnerProfile(): CoachingPartnerProfile {
  try {
    const raw = localStorage.getItem(COACHING_PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(COACHING_PROFILE_KEY, JSON.stringify(DEFAULT_COACHING_PROFILE));
      return DEFAULT_COACHING_PROFILE;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_COACHING_PROFILE;
  }
}

export function saveCoachingPartnerProfile(profile: CoachingPartnerProfile): void {
  try {
    localStorage.setItem(COACHING_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save coaching partner profile:', err);
  }
}
