import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EvaluateView } from './components/EvaluateView';
import { ResultView } from './components/ResultView';
import { AnalysisView } from './components/AnalysisView';
import { SourceLibraryView } from './components/SourceLibraryView';
import { TestCreatorView } from './components/TestCreatorView';
import { TestHistoryView } from './components/TestHistoryView';
import { AIAssistantView } from './components/AIAssistantView';
import { ClassroomAdminView } from './components/ClassroomAdminView';
import { CoachingPortalView } from './components/CoachingPortalView';
import { WalkAndReviseView } from './components/WalkAndReviseView';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { WaitingRoomView } from './components/WaitingRoomView';
import { AuthModal } from './components/AuthModal';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { StudentSupportDrawer } from './components/StudentSupportDrawer';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { SmartNotificationBanner } from './components/SmartNotificationBanner';
import { GuestLimitModal } from './components/GuestLimitModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { MessageSquare, Lock, ShieldCheck } from 'lucide-react';
import { 
  EvaluationResult, 
  ReferenceSource, 
  GeneratedTest, 
  ActiveTab,
  AcademicJourney,
  UserProfile
} from './types';
import { 
  getSavedEvaluations, 
  saveEvaluation, 
  deleteEvaluation, 
  getSavedSources, 
  addOrUpdateSource, 
  deleteSource, 
  getSavedTests, 
  saveTest, 
  deleteTest,
  getActiveEvaluationId,
  setActiveEvaluationId,
  getAllEvaluationsForAllStudents,
  getSavedJourney,
  saveJourney,
  getActiveProfile,
  getSavedProfiles,
  saveProfile as persistProfile,
  setActiveProfile as persistActiveProfileId,
  clearActiveSession,
  hasUserOnboarded,
  setHasUserOnboarded
} from './utils/storage';
import { 
  registerCurrentDeviceSession, 
  SUPER_ADMIN_EMAIL 
} from './utils/security';
import { fetchProfileFromCloud } from './utils/cloudSync';
import { SampleExam } from './data/sampleExams';

// Initial seed evaluations to showcase the Bento Grid checked copies & analytics
const SEED_EVALUATIONS: EvaluationResult[] = [
  {
    id: 'eval_seed_c12_accountancy',
    test_title: 'Class 12 Accountancy: Partnership Fundamentals Assessment',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Accountancy',
    chapter: 'Fundamentals of Partnership',
    total_max_marks: 25,
    total_obtained_marks: 21.5,
    percentage: 86.0,
    confidence_overall: 'High',
    file_name: 'Class12_Accountancy_Partnership_Exam.pdf',
    evaluated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    stats: {
      total_questions: 4,
      attempted: 4,
      correct: 2,
      mostly_correct: 1,
      partially_correct: 1,
      incorrect: 0,
      not_attempted: 0
    },
    questions: [
      {
        question_id: 'Q1',
        question_number: 1,
        question_text: 'State the provisions of the Indian Partnership Act, 1932 regarding: (a) Interest on Capital, (b) Interest on Drawings, (c) Partner\'s Salary, (d) Interest on Partner\'s Loan, in the absence of a Partnership Deed.',
        topic: 'Provisions in Absence of Partnership Deed',
        chapter: 'Fundamentals of Partnership',
        max_marks: 4,
        awarded_marks: 4,
        status: 'Correct',
        confidence: 'High',
        student_answer: 'In the absence of a Partnership Deed: (a) Interest on Capital: No interest is allowed. (b) Interest on Drawings: No interest is charged. (c) Partner\'s Salary: No salary payable. (d) Interest on Partner\'s Loan: Allowed @ 6% p.a. (Charge against profit).',
        expected_model_answer: 'Provisions under Indian Partnership Act, 1932:\n1. Interest on Capital: Not allowed to any partner.\n2. Interest on Drawings: Not charged on drawings.\n3. Salary/Remuneration: Not allowed to any partner.\n4. Interest on Advances/Loan: Allowed at 6% p.a., treated as a charge against profit.',
        keyterms_required: ['No interest', 'Charge against profit', '6% p.a.', 'Not allowed'],
        keyterms_present: ['No interest', 'Charge against profit', '6% p.a.'],
        keyterms_missing: [],
        correct_points: ['Accurately stated all 4 statutory provisions under the 1932 Act', 'Correctly identified interest on partner loan as a charge against profits at 6% p.a.'],
        missing_points: [],
        errors: [],
        marks_deduction_reason: 'None. Full marks awarded for flawless statutory accuracy.',
        how_to_get_full_marks: 'Answer already contains all statutory clauses.',
        teacher_feedback: 'Excellent conceptual grasp of the 1932 Partnership Act provisions.',
        improvement_tip: 'Maintain this level of concise bullet-point presentation.',
        mistake_categories: []
      },
      {
        question_id: 'Q2',
        question_number: 2,
        question_text: 'A and B are partners sharing profits in the ratio 3:2. A withdrew ₹4,000 at the beginning of every month for 12 months. Calculate Interest on Drawings @ 10% p.a. using the Average Period method.',
        topic: 'Interest on Drawings - Average Period Method',
        chapter: 'Fundamentals of Partnership',
        max_marks: 6,
        awarded_marks: 6,
        status: 'Correct',
        confidence: 'High',
        student_answer: 'Monthly drawings = ₹4,000. Total = ₹48,000.\nAverage Period = (12 + 1) / 2 = 6.5 months.\nInterest on Drawings = 48,000 × (10/100) × (6.5/12) = ₹2,600.',
        expected_model_answer: 'Total Drawings = ₹4,000 × 12 = ₹48,000\nAverage Period = (Months remaining after first drawing + Months remaining after last drawing) / 2 = (12 + 1) / 2 = 6.5 months\nInterest on Drawings = ₹48,000 × (10 / 100) × (6.5 / 12) = ₹2,600',
        keyterms_required: ['Total Drawings', 'Average Period', '6.5 months', '₹2,600'],
        keyterms_present: ['Total Drawings', 'Average Period', '6.5 months', '₹2,600'],
        keyterms_missing: [],
        correct_points: ['Correctly calculated total annual drawings of ₹48,000', 'Accurately derived average period of 6.5 months', 'Final numerical calculation ₹2,600 is exact'],
        missing_points: [],
        errors: [],
        marks_deduction_reason: 'None. Complete working and correct final computation.',
        how_to_get_full_marks: 'Formula and calculation are both 100% complete.',
        teacher_feedback: 'Well-structured formula derivation and accurate arithmetic computation.',
        improvement_tip: 'Always state the standard formula definition in words before substituting numbers.',
        mistake_categories: []
      },
      {
        question_id: 'Q3',
        question_number: 3,
        question_text: 'Prepare Profit and Loss Appropriation Account for X and Y for the year ended 31st March 2026 given Net Profit ₹2,10,000, Interest on Capital @ 6% p.a. (Capitals ₹5L and ₹3L), X\'s Salary ₹5,000 p.m., and Y\'s Commission @ 5% on net profit after charging such commission. (Profit ratio 3:2)',
        topic: 'Profit and Loss Appropriation Account',
        chapter: 'Fundamentals of Partnership',
        max_marks: 8,
        awarded_marks: 7.5,
        status: 'Mostly Correct',
        confidence: 'High',
        student_answer: 'Prepared P&L Appropriation Account:\n- Net Profit: ₹2,10,000\n- Interest on Capital: X = ₹30,000, Y = ₹18,000 (Total ₹48,000)\n- X\'s Salary: ₹60,000\n- Y\'s Commission: 2,10,000 × 5/105 = ₹10,000\n- Divisible Profit: ₹92,000 (X = ₹55,200, Y = ₹36,800)',
        expected_model_answer: 'PROFIT & LOSS APPROPRIATION A/C for year ended 31.03.2026\nCr: By Net Profit b/d = ₹2,10,000\nDr: To Interest on Capital (X: 30,000, Y: 18,000) = ₹48,000\nDr: To X\'s Salary = ₹60,000\nDr: To Y\'s Commission (2,10,000 × 5 / 105) = ₹10,000\nDr: To Profit transferred to Partners\' Capital A/cs (X: 55,200, Y: 36,800) = ₹92,000\nTotal = ₹2,10,000',
        keyterms_required: ['P&L Appropriation A/c', 'Dr/Cr', 'Divisible Profit', 'Capital A/c transfer'],
        keyterms_present: ['P&L Appropriation A/c', 'Divisible Profit', 'Capital A/c transfer'],
        keyterms_missing: ['Dr/Cr column headers omitted in scratch notes'],
        correct_points: ['Accurate calculation of \'after charging such commission\' formula (5/105)', 'Correct Interest on Capital and Salary totals', 'Correct profit apportionment ratio (3:2)'],
        missing_points: ['Omitted explicit Dr. and Cr. designations on account borders'],
        errors: [],
        marks_deduction_reason: 'Lost 0.5 marks: Minor presentation slip (missing Dr./Cr. header tags on account ledger).',
        how_to_get_full_marks: 'Always write \'Dr.\' and \'Cr.\' on the top left and right edges of the ledger account and specify \'To\' and \'By\' prefixes consistently.',
        teacher_feedback: 'Exceptional mathematical and accounting precision. Minor presentation polish needed.',
        improvement_tip: 'Use standard CBSE ledger table format with Debit and Credit headings.',
        mistake_categories: ['Presentation / Format Issue']
      },
      {
        question_id: 'Q4',
        question_number: 4,
        question_text: 'Explain what is meant by \'Past Adjustments\' in partnership accounts and state two reasons why past errors occur.',
        topic: 'Past Adjustments in Partnership Accounts',
        chapter: 'Fundamentals of Partnership',
        max_marks: 7,
        awarded_marks: 4,
        status: 'Partially Correct',
        confidence: 'High',
        student_answer: 'Past adjustments refer to adjustments made in the books of accounts of a partnership firm to rectify errors or omissions that took place in previous years after final accounts have been closed. Reasons for past errors: 1. Interest on capital was omitted or provided at wrong rate.',
        expected_model_answer: 'Meaning: Past adjustments are retrospective rectifications made in partnership books through a single adjusting journal entry (or Profit & Loss Adjustment A/c) to correct errors or omissions discovered after closing annual accounts.\nReasons for errors:\n1. Interest on Capital or Interest on Drawings omitted or computed at wrong rate.\n2. Salaries/remuneration payable to partners omitted.\n3. Profits or losses distributed in wrong ratio or retrospective amendment in profit sharing agreement.',
        keyterms_required: ['Past Adjustments', 'Adjusting Journal Entry', 'Errors or Omissions', 'Wrong Ratio'],
        keyterms_present: ['Past Adjustments', 'Rectify errors or omissions'],
        keyterms_missing: ['Adjusting Journal Entry', 'Second reason for error'],
        correct_points: ['Correctly defined the purpose of past adjustments after closing of accounts', 'Provided 1 valid reason for omission of interest on capital'],
        missing_points: ['Failed to state the mandatory second reason for past errors (omitted partner salary / wrong profit sharing ratio)', 'Did not mention the single adjusting journal entry mechanism'],
        errors: ['Incomplete answer: Stopped after 1 reason instead of the 2 asked by the question'],
        marks_deduction_reason: 'Lost 3 marks: (1) Omitted the second reason for error requested in question (-2 marks). (2) Missed explaining the single adjustment journal entry mechanism (-1 mark).',
        how_to_get_full_marks: 'Always ensure all sub-parts of the prompt are fulfilled. When asked for \'two reasons\', list at least two distinct numbered points.',
        teacher_feedback: 'Good definition, but lost significant credit due to an incomplete second half.',
        improvement_tip: 'Check off each requirement of the question paper before moving to the next answer.',
        mistake_categories: ['Incomplete Answer', 'Missing Key Point']
      }
    ],
    performance_analysis: {
      strengths: [
        'Strong numerical mastery of partnership profit distributions',
        'Accurate calculation of commission after charging such commission',
        'Clear understanding of statutory clauses under 1932 Partnership Act'
      ],
      weaknesses: [
        'Omission of secondary requirements in descriptive theory questions',
        'Minor presentation formatting omissions (Dr./Cr. ledger markings)'
      ],
      repeated_errors: [
        'Incomplete theory answers where multiple sub-conditions are asked'
      ],
      topic_breakdown: [
        { topic: 'Fundamentals of Partnership', max_marks: 25, obtained_marks: 21.5, percentage: 86.0 }
      ],
      marks_loss_summary: [
        { category: 'Incomplete Answer', marks_lost: 2.0, explanation: 'Omitted second reason for past adjustment errors' },
        { category: 'Missing Key Point', marks_lost: 1.0, explanation: 'Missed adjusting journal entry mechanism in theory definition' },
        { category: 'Presentation Slip', marks_lost: 0.5, explanation: 'Omitted Dr./Cr. headings in ledger account' }
      ],
      teacher_overall_feedback: 'Outstanding performance demonstrating solid mathematical and legal foundation in partnership accounts. Focus on completing all parts of descriptive questions to secure a centum (100/100).',
      recommended_study_plan: [
        'Practice 4-mark and 6-mark theory answers with a 3-point minimum structure',
        'Memorize standard adjustment journal entry formats for past adjustments',
        'Underline key technical phrases like \'Charge against profit\' and \'Adjusting Entry\''
      ]
    }
  },
  {
    id: 'eval_seed_ca_law',
    test_title: 'CA Foundation Business Laws: Indian Contract Act 1872 Case Study Assessment',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Business Laws',
    chapter: 'Indian Contract Act, 1872',
    total_max_marks: 20,
    total_obtained_marks: 18.0,
    percentage: 90.0,
    confidence_overall: 'High',
    file_name: 'CA_Foundation_Business_Laws_Paper2.pdf',
    evaluated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    stats: {
      total_questions: 3,
      attempted: 3,
      correct: 2,
      mostly_correct: 1,
      partially_correct: 0,
      incorrect: 0,
      not_attempted: 0
    },
    questions: [
      {
        question_id: 'Q1',
        question_number: 1,
        question_text: 'Mr. Ramesh promised to pay a monthly allowance of ₹25,000 to his wife Sunita while posted abroad. Ramesh stopped paying after 2 months. Sunita filed a suit. Decide with reference to the Indian Contract Act, 1872 whether Sunita can recover the amount.',
        topic: 'Intention to Create Legal Relations & Domestic Agreements',
        chapter: 'Indian Contract Act, 1872',
        max_marks: 6,
        awarded_marks: 6,
        status: 'Correct',
        confidence: 'High',
        student_answer: '1. Provision of Law: In social/domestic agreements, the presumption is parties do not intend to create legal obligations (Balfour v. Balfour 1919).\n2. Facts: Promise between husband and wife for maintenance.\n3. Analysis: Domestic agreement without legal intention.\n4. Conclusion: Sunita cannot succeed in her lawsuit.',
        expected_model_answer: '1. Relevant Provision: Intention to create legal relationship is an essential element under the Indian Contract Act, 1872. In domestic agreements, law presumes absence of legal intent (Balfour v. Balfour).\n2. Facts of the Case\n3. Analysis & Application\n4. Conclusion: Suit is not maintainable.',
        keyterms_required: ['Balfour v. Balfour', 'Intention to create legal relations', 'Domestic agreement', 'Not enforceable'],
        keyterms_present: ['Balfour v. Balfour', 'Intention to create legal relations', 'Domestic agreement', 'Not enforceable'],
        keyterms_missing: [],
        correct_points: ['Adhered to ICAI 4-tier case analysis format (Provision, Facts, Analysis, Conclusion)', 'Correct case law citation: Balfour v. Balfour (1919)'],
        missing_points: [],
        errors: [],
        marks_deduction_reason: 'None. Full marks awarded for ICAI benchmark formatting.',
        how_to_get_full_marks: 'Format and legal reasoning are both exemplary.',
        teacher_feedback: 'Flawless execution of the 4-tier ICAI case study answering format.',
        improvement_tip: 'Continue citing landmark case law with year wherever applicable.',
        mistake_categories: []
      }
    ],
    performance_analysis: {
      strengths: ['Mastery of ICAI 4-tier answering structure', 'Precise statutory section and case law recall'],
      weaknesses: ['Ensure equal time management across all 5 questions in ICAI Paper 2'],
      repeated_errors: [],
      topic_breakdown: [
        { topic: 'Indian Contract Act, 1872', max_marks: 20, obtained_marks: 18.0, percentage: 90.0 }
      ],
      marks_loss_summary: [
        { category: 'Weak Explanation', marks_lost: 2.0, explanation: 'Minor elaboration missing on Section 25 exceptions' }
      ],
      teacher_overall_feedback: 'Excellent grasp of legal principles, case law citations, and ICAI examination presentation.',
      recommended_study_plan: [
        'Practice Section 15 & 16 comparative charts',
        'Review ICAI Suggested Answers for latest RTP & MTP'
      ]
    }
  }
];

export default function App() {
  const [currentJourney, setCurrentJourneyState] = useState<AcademicJourney>(getSavedJourney());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [sources, setSources] = useState<ReferenceSource[]>([]);
  const [savedTests, setSavedTests] = useState<GeneratedTest[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [selectedSampleExam, setSelectedSampleExam] = useState<SampleExam | null>(null);
  const [selectedTestForEvaluation, setSelectedTestForEvaluation] = useState<GeneratedTest | null>(null);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string>('');
  
  // User Profile state
  const [profiles, setProfiles] = useState<UserProfile[]>(getSavedProfiles());
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(getActiveProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false);
  const [guestLimitModalState, setGuestLimitModalState] = useState<{
    isOpen: boolean;
    featureName: string;
    message?: string;
  }>({
    isOpen: false,
    featureName: '',
    message: ''
  });

  const [testCreatorPrefill, setTestCreatorPrefill] = useState<{
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
  } | null>(null);

  const setCurrentJourney = (j: AcademicJourney) => {
    setCurrentJourneyState(j);
    saveJourney(j);
  };

  const loadUserDataForProfile = (userProfileId?: string) => {
    const userEvals = getSavedEvaluations(undefined, userProfileId);
    const userTests = getSavedTests(undefined, userProfileId);
    const userEvalId = getActiveEvaluationId(userProfileId);

    setEvaluations(userEvals);
    setSavedTests(userTests);

    if (userEvalId && userEvals.length > 0) {
      const activeEval = userEvals.find(e => e.id === userEvalId) || userEvals[0];
      setCurrentEvaluation(activeEval);
    } else if (userEvals.length > 0) {
      setCurrentEvaluation(userEvals[0]);
    } else {
      setCurrentEvaluation(null);
    }
  };

  const handleSelectProfile = (profileId: string) => {
    persistActiveProfileId(profileId);
    const found = profiles.find(p => p.id === profileId);
    if (found) {
      setActiveProfileState(found);
      setCurrentJourney(found.targetJourney);
      loadUserDataForProfile(found.id);
      if (found.role === 'teacher_admin' && activeTab === 'dashboard') {
        setActiveTab('classroom');
      }
    }
  };

  const handleSaveProfile = (profile: UserProfile) => {
    const updated = persistProfile(profile);
    setProfiles(updated);
    setActiveProfileState(profile);
    persistActiveProfileId(profile.id);
    loadUserDataForProfile(profile.id);
  };

  const handleCompleteAuth = (newProfile: UserProfile) => {
    const updated = persistProfile(newProfile);
    setProfiles(updated);
    setActiveProfileState(newProfile);
    persistActiveProfileId(newProfile.id);
    setCurrentJourney(newProfile.targetJourney);
    setIsAuthModalOpen(false);
    loadUserDataForProfile(newProfile.id);
  };

  const handleSignOut = () => {
    clearActiveSession();
    setActiveProfileState(null);
    setIsProfileModalOpen(false);
    loadUserDataForProfile('guest_user');
  };

  // Initial load from storage + seed evaluations (strictly scoped by active profile)
  useEffect(() => {
    const loadedProfiles = getSavedProfiles();
    const activeProf = getActiveProfile();

    setProfiles(loadedProfiles);
    if (activeProf) {
      const registeredProfile = registerCurrentDeviceSession(activeProf);
      setActiveProfileState(registeredProfile);
    } else {
      setActiveProfileState(null);
    }

    const activeUserId = activeProf?.id || undefined;
    let loadedEvals = getSavedEvaluations(undefined, activeUserId);
    const loadedSources = getSavedSources();
    const loadedTests = getSavedTests(undefined, activeUserId);
    const activeEvalId = getActiveEvaluationId(activeUserId);

    // Only seed default test if user has zero evaluations
    if (loadedEvals.length === 0 && !activeProf?.isGuest && activeProf?.role !== 'teacher_admin') {
      for (const seed of SEED_EVALUATIONS) {
        saveEvaluation(seed, activeUserId);
      }
      loadedEvals = getSavedEvaluations(undefined, activeUserId);
    }

    setEvaluations(loadedEvals);
    setSources(loadedSources);
    setSavedTests(loadedTests);

    if (activeEvalId && loadedEvals.length > 0) {
      const activeEval = loadedEvals.find(e => e.id === activeEvalId) || loadedEvals[0];
      setCurrentEvaluation(activeEval);
    } else if (loadedEvals.length > 0) {
      setCurrentEvaluation(loadedEvals[0]);
    } else {
      setCurrentEvaluation(null);
    }
  }, []);

  // Check if current user is Super Admin or approved
  const isSuperAdmin = activeProfile?.email === SUPER_ADMIN_EMAIL || activeProfile?.role === 'teacher_admin';
  const isKillSwitched = activeProfile?.isKillSwitched === true || activeProfile?.approvalStatus === 'blocked';
  const isPendingApproval = Boolean(activeProfile) && !isSuperAdmin && (activeProfile?.approvalStatus === 'pending_approval' || !activeProfile?.approvalStatus);
  const isRejected = Boolean(activeProfile) && !isSuperAdmin && activeProfile?.approvalStatus === 'rejected';
  const shouldShowWaitingRoom = Boolean(activeProfile) && (isPendingApproval || isKillSwitched || isRejected);

  const handleRefreshApprovalStatus = async () => {
    if (activeProfile?.id) {
      try {
        const cloudProf = await fetchProfileFromCloud(activeProfile.id, activeProfile.email);
        if (cloudProf) {
          persistProfile(cloudProf);
        }
      } catch (e) {}
    }
    const loadedProfiles = getSavedProfiles();
    const activeProf = getActiveProfile();
    setProfiles(loadedProfiles);
    setActiveProfileState(activeProf);
  };

  const handleSwitchToAdmin = () => {
    setIsAdminPasswordModalOpen(true);
  };

  const handleAdminPasswordSuccess = () => {
    setIsAdminPasswordModalOpen(false);
    let adminProf = profiles.find(p => p.email === SUPER_ADMIN_EMAIL || p.role === 'teacher_admin');
    if (!adminProf) {
      adminProf = {
        id: 'admin_himanshu',
        name: 'Himanshu Chawla',
        role: 'teacher_admin',
        email: SUPER_ADMIN_EMAIL,
        targetJourney: 'CLASS_12',
        institution: 'StudyMentor AI Central Command',
        hasInspectorPrivilege: true,
        approvalStatus: 'approved',
        isKillSwitched: false,
        bio: 'Super Admin & Lead Paper Examiner for Class 12 & CA Foundation.',
        createdAt: new Date().toISOString()
      };
      persistProfile(adminProf);
      setProfiles(getSavedProfiles());
    }
    setActiveProfileState(adminProf);
    persistActiveProfileId(adminProf.id);
    loadUserDataForProfile(adminProf.id);
    setActiveTab('classroom');
  };

  // Handle evaluation complete from EvaluateView
  const handleEvaluationComplete = (result: EvaluationResult) => {
    const targetUserId = activeProfile?.id || 'guest_user';
    const resultWithUser: EvaluationResult = {
      ...result,
      userId: targetUserId,
      studentName: activeProfile?.name || result.studentName || 'Student'
    };
    saveEvaluation(resultWithUser, targetUserId);
    setEvaluations(prev => [resultWithUser, ...prev.filter(e => e.id !== resultWithUser.id)]);
    setCurrentEvaluation(resultWithUser);
    setActiveEvaluationId(resultWithUser.id, targetUserId);
    setActiveTab('result');

    // Trigger celebration confetti for distinction (>=75%)
    if (resultWithUser.percentage >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if canvas-confetti is not available
      }
    }
  };

  // Handle manual question score update / human review
  const handleUpdateEvaluation = (updated: EvaluationResult) => {
    const targetUserId = activeProfile?.id || updated.userId || 'guest_user';
    saveEvaluation(updated, targetUserId);
    setEvaluations(prev => prev.map(e => e.id === updated.id ? updated : e));
    setCurrentEvaluation(updated);
  };

  // Handle delete evaluation
  const handleDeleteEvaluation = (id: string) => {
    const targetUserId = activeProfile?.id || 'guest_user';
    const updated = deleteEvaluation(id, targetUserId);
    setEvaluations(updated);
    if (currentEvaluation?.id === id) {
      setCurrentEvaluation(updated.length > 0 ? updated[0] : null);
      if (updated.length === 0 && activeTab === 'result') {
        setActiveTab('dashboard');
      }
    }
  };

  // Handle select evaluation to view
  const handleSelectEvaluation = (evalResult: EvaluationResult) => {
    setCurrentEvaluation(evalResult);
    setActiveEvaluationId(evalResult.id, activeProfile?.id);
    if (evalResult.journey) {
      setCurrentJourney(evalResult.journey);
    }
    setActiveTab('result');
  };

  // Source library actions
  const handleAddOrUpdateSource = (source: ReferenceSource) => {
    const updated = addOrUpdateSource(source);
    setSources(updated);
  };

  const handleDeleteSource = (id: string) => {
    const updated = deleteSource(id);
    setSources(updated);
  };

  // Test creator actions
  const handleSaveTest = (test: GeneratedTest) => {
    const targetUserId = activeProfile?.id || 'guest_user';
    const updated = saveTest(test, targetUserId);
    setSavedTests(updated);
  };

  const handleDeleteTest = (testId: string) => {
    const targetUserId = activeProfile?.id || 'guest_user';
    const updated = deleteTest(testId, targetUserId);
    setSavedTests(updated);
  };

  // Load sample exam for instant evaluation
  const handleLoadSampleExam = (sample: SampleExam) => {
    setSelectedSampleExam(sample);
    setCurrentJourney(sample.journey);
    setActiveTab('evaluate');
  };

  // Start evaluating student answers for a generated test
  const handleStartEvaluationWithTest = (test: GeneratedTest) => {
    setSelectedTestForEvaluation(test);
    const questionsText = test.questions.map(q => 
      `${q.question_id || `Q${q.question_number}`}. ${q.question_text} [${q.max_marks} Marks]`
    ).join('\n\n');

    setSelectedSampleExam({
      id: test.test_id,
      title: test.title,
      journey: test.journey || currentJourney,
      level: test.level || 'Standard Examination',
      subject: test.subject,
      difficulty: test.difficulty,
      totalMarks: test.total_marks,
      description: `Evaluation for created test: ${test.title}`,
      documentContent: `=== QUESTION PAPER: ${test.title.toUpperCase()} (MAX MARKS: ${test.total_marks}) ===\n${questionsText}\n\n=== STUDENT ANSWERS ===\n(Paste or type student's answers below)`
    });

    if (test.journey) {
      setCurrentJourney(test.journey);
    }
    setActiveTab('evaluate');
  };

  // Ask question in AI Assistant with context
  const handleAskQuestionInChat = (questionId: string, contextPrompt: string) => {
    setAssistantInitialPrompt(contextPrompt);
    setActiveTab('assistant');
  };

  // Launch AI Weak-Topic Remedial Practice Drill from Analysis
  const handleStartWeakTopicPractice = (
    subject: string, 
    chapter: string, 
    weakTopics?: string[], 
    customInstructions?: string, 
    autoGenerate = true
  ) => {
    let instructions = customInstructions || '';
    if (!instructions && weakTopics && weakTopics.length > 0) {
      instructions = `Special diagnostic test targeting the student's recorded weak topics: ${weakTopics.join(', ')}. Include high-yield exam numericals & reasoning questions with step-by-step mark allocation.`;
    }
    
    setTestCreatorPrefill({
      subject,
      topic: chapter,
      customInstructions: instructions,
      difficulty: 'Exam Standard',
      numQuestions: 4,
      totalMarks: 20,
      durationMinutes: 30,
      autoGenerate,
      isRemedial: true,
      weakTopics
    });
    setActiveTab('create-test');
  };

  return (
    <div className="min-h-screen bg-academic-mesh text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      
      {/* 1. If user is NOT authenticated/logged in, show mandatory Auth Modal */}
      {!activeProfile ? (
        <AuthModal
          isOpen={true}
          onSuccess={handleCompleteAuth}
        />
      ) : shouldShowWaitingRoom ? (
        /* 2. If student is pending approval, rejected, or kill-switched, show Waiting Room */
        <WaitingRoomView
          activeProfile={activeProfile}
          onRefreshStatus={handleRefreshApprovalStatus}
          onSwitchToAdmin={handleSwitchToAdmin}
          onResetProfile={handleSignOut}
        />
      ) : (
        /* 3. If authenticated & approved / Super Admin, render main app */
        <>
          {/* Smart Hinglish Notification Engine Banner */}
          <SmartNotificationBanner
            isGuest={Boolean(activeProfile?.isGuest)}
            onOpenRegister={() => setIsAuthModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
          />

          {/* PWA Install Banner */}
          <PwaInstallPrompt />

          {/* Top Navigation */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentJourney={currentJourney}
            setCurrentJourney={setCurrentJourney}
            sources={sources}
            hasActiveEvaluation={Boolean(currentEvaluation)}
            activeProfile={activeProfile}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onQuickUpload={() => {
              setSelectedSampleExam(null);
              setActiveTab('evaluate');
            }}
            onSignOut={handleSignOut}
          />

          {/* Main Content Area */}
          <main className="flex-1 pb-16">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                evaluations={evaluations}
                sources={sources}
                activeProfile={activeProfile}
                setActiveTab={setActiveTab}
                onSelectEvaluation={handleSelectEvaluation}
                onLoadSampleExam={handleLoadSampleExam}
              />
            )}

            {activeTab === 'classroom' && (
              <ClassroomAdminView
                evaluations={activeProfile?.role === 'teacher_admin' ? getAllEvaluationsForAllStudents() : evaluations}
                activeProfile={activeProfile}
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                onSelectEvaluation={handleSelectEvaluation}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
                setActiveTab={setActiveTab}
                sources={sources}
              />
            )}

            {activeTab === 'evaluate' && (
              <EvaluateView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                sources={sources}
                onEvaluationComplete={handleEvaluationComplete}
                initialSampleExam={selectedSampleExam}
                initialTestContext={selectedTestForEvaluation}
                savedTests={savedTests}
                activeProfile={activeProfile}
                onClearLinkedExam={() => {
                  setSelectedSampleExam(null);
                  setSelectedTestForEvaluation(null);
                }}
                onTriggerGuestLimit={(feature, msg) => {
                  setGuestLimitModalState({
                    isOpen: true,
                    featureName: feature,
                    message: msg
                  });
                }}
              />
            )}

            {activeTab === 'result' && currentEvaluation && (
              <ResultView
                evaluation={currentEvaluation}
                sources={sources}
                onUpdateEvaluation={handleUpdateEvaluation}
                setActiveTab={setActiveTab}
                onAskQuestionInChat={handleAskQuestionInChat}
                onDeleteEvaluation={handleDeleteEvaluation}
              />
            )}

            {activeTab === 'walk-and-revise' && (
              <WalkAndReviseView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                onEvaluationComplete={handleEvaluationComplete}
                setActiveTab={setActiveTab}
                activeProfile={activeProfile}
                onTriggerGuestLimit={(feature, msg) => {
                  setGuestLimitModalState({
                    isOpen: true,
                    featureName: feature,
                    message: msg
                  });
                }}
              />
            )}

            {activeTab === 'coaching' && (
              <CoachingPortalView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                activeProfile={activeProfile}
                onSelectEvaluation={handleSelectEvaluation}
                setActiveTab={setActiveTab}
                sources={sources}
              />
            )}

            {activeTab === 'analysis' && (
              <AnalysisView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                evaluations={evaluations}
                activeUserId={activeProfile?.id}
                onStartPracticeTest={handleStartWeakTopicPractice}
                onAskTutor={(prompt) => {
                  setAssistantInitialPrompt(prompt);
                  setActiveTab('assistant');
                }}
                onDeleteEvaluation={handleDeleteEvaluation}
                onSelectEvaluation={handleSelectEvaluation}
              />
            )}

            {activeTab === 'sources' && (
              <SourceLibraryView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                sources={sources}
                onAddOrUpdateSource={handleAddOrUpdateSource}
                onDeleteSource={handleDeleteSource}
              />
            )}

            {activeTab === 'create-test' && (
              <TestCreatorView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                savedTests={savedTests}
                onSaveTest={handleSaveTest}
                onDeleteTest={handleDeleteTest}
                onStartEvaluationWithTest={handleStartEvaluationWithTest}
                setActiveTab={setActiveTab}
                initialPrefill={testCreatorPrefill}
                activeProfile={activeProfile}
                onTriggerGuestLimit={(feature, msg) => {
                  setGuestLimitModalState({
                    isOpen: true,
                    featureName: feature,
                    message: msg
                  });
                }}
              />
            )}

            {activeTab === 'history' && (
              <TestHistoryView
                evaluations={evaluations}
                onSelectEvaluation={handleSelectEvaluation}
                onDeleteEvaluation={handleDeleteEvaluation}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'assistant' && (
              <AIAssistantView
                currentJourney={currentJourney}
                setCurrentJourney={setCurrentJourney}
                currentEvaluation={currentEvaluation}
                initialPrompt={assistantInitialPrompt}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="font-medium text-slate-700">StudyMentor <span className="text-indigo-600 font-semibold italic">AI Evaluator</span> • Automated Multimodal Exam Paper Checker</p>
              <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                <span>Examiner Vision 2.0</span>
                <span>•</span>
                <span>Gatekeeper Security Gate</span>
                <span>•</span>
                <span>Active Device Tracker</span>
                <span>•</span>
                <span>Class 12 & CA Foundation</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* User Profile & Role Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onSaveProfile={handleSaveProfile}
        onSwitchAccount={handleSignOut}
      />

      {/* Admin Password Modal for Master Verification */}
      <AdminPasswordModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => setIsAdminPasswordModalOpen(false)}
        onSuccess={handleAdminPasswordSuccess}
      />

      {/* Floating Direct Student Support & Help Desk Button */}
      {activeProfile && activeProfile.approvalStatus === 'approved' && !activeProfile.isKillSwitched && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            id="floating-student-support-btn"
            onClick={() => {
              if (activeProfile.role === 'teacher_admin') {
                setActiveTab('classroom');
              } else {
                setIsSupportDrawerOpen(true);
              }
            }}
            className="group flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-indigo-600 active:scale-95 text-white rounded-full shadow-2xl border border-slate-700/80 transition-all cursor-pointer select-none"
            title="Private Student Support Desk (Direct to Himanshu Sir)"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight flex items-center gap-1">
                {activeProfile.role === 'teacher_admin' ? 'Support Inbox' : 'Private Help Desk'}
                <Lock className="w-2.5 h-2.5 text-indigo-300" />
              </span>
              <span className="text-[9px] text-slate-300 group-hover:text-indigo-100 font-medium">
                {activeProfile.role === 'teacher_admin' ? 'View Student Queries' : 'Direct to Himanshu Sir'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Private Student Support Drawer Component */}
      <StudentSupportDrawer
        isOpen={isSupportDrawerOpen}
        onClose={() => setIsSupportDrawerOpen(false)}
        activeProfile={activeProfile}
        currentJourney={currentJourney}
      />

      {/* Guest Limit & Referral Modal */}
      <GuestLimitModal
        isOpen={guestLimitModalState.isOpen}
        onClose={() => setGuestLimitModalState(prev => ({ ...prev, isOpen: false }))}
        onOpenRegister={() => {
          setGuestLimitModalState(prev => ({ ...prev, isOpen: false }));
          setIsAuthModalOpen(true);
        }}
        featureName={guestLimitModalState.featureName}
        limitMessage={guestLimitModalState.message}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isGuest={Boolean(activeProfile?.isGuest)}
      />

      {/* Dynamic AuthModal when Guest wants to Register or Switch Account */}
      {isAuthModalOpen && activeProfile && (
        <AuthModal
          isOpen={true}
          defaultMode="register"
          onSuccess={handleCompleteAuth}
          onCancel={() => setIsAuthModalOpen(false)}
        />
      )}

    </div>
  );
}
