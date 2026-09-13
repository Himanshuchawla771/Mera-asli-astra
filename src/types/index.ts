export type AcademicJourney = 'CLASS_12' | 'CLASS_12_SCIENCE' | 'CLASS_12_ARTS' | 'CLASS_11_SCIENCE' | 'CLASS_11_COMMERCE' | 'CLASS_11_ARTS' | 'CA_FOUNDATION' | 'CA_INTERMEDIATE' | 'CA_FINAL' | 'NEET' | 'JEE' | 'CUET';

export interface AcademicScope {
  journey: AcademicJourney;
  level: string; // e.g. "Class 12 CBSE" | "CA Foundation ICAI"
  subject: string;
  chapter?: string;
}

export type EvaluationStatus = 
  | 'Correct'
  | 'Mostly Correct'
  | 'Partially Correct'
  | 'Incorrect'
  | 'Not Attempted'
  | 'Needs Review';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type MistakeCategoryType = 
  | 'Conceptual Error'
  | 'Factual Error'
  | 'Calculation Error'
  | 'Incomplete Answer'
  | 'Missing Key Point'
  | 'Misunderstanding Question'
  | 'Incorrect Application'
  | 'Weak Explanation'
  | 'Presentation / Format Issue'
  | 'Unattempted'
  | 'Other';

export interface QuestionEvaluation {
  question_id: string;
  question_number: string | number;
  sub_part?: string;
  question_text: string;
  topic?: string;
  chapter?: string;
  max_marks: number;
  awarded_marks: number;
  status: EvaluationStatus;
  confidence: ConfidenceLevel;
  student_answer: string;
  expected_model_answer: string;
  keyterms_required: string[];
  keyterms_present: string[];
  keyterms_missing: string[];
  correct_points: string[];
  missing_points: string[];
  errors: string[];
  marks_deduction_reason?: string;
  how_to_get_full_marks?: string;
  teacher_feedback: string;
  improvement_tip?: string;
  mistake_categories?: MistakeCategoryType[];
  needs_review?: boolean;
  needs_review_reason?: string;
  recheck_status?: 'NONE' | 'ACCEPTED' | 'REJECTED';
  recheck_argument?: string;
  recheck_response?: string;
  recheck_delta?: number;
  rechecked_at?: string;
}

export interface TopicBreakdown {
  topic: string;
  chapter?: string;
  max_marks: number;
  obtained_marks: number;
  percentage: number;
}

export interface MarksLossItem {
  category: MistakeCategoryType | string;
  marks_lost: number;
  explanation: string;
}

export interface PerformanceAnalysis {
  strengths: string[];
  weaknesses: string[];
  repeated_errors: string[];
  topic_breakdown: TopicBreakdown[];
  marks_loss_summary: MarksLossItem[];
  teacher_overall_feedback: string;
  recommended_study_plan: string[];
}

export interface EvaluationStats {
  total_questions: number;
  attempted: number;
  correct: number;
  mostly_correct: number;
  partially_correct: number;
  incorrect: number;
  not_attempted: number;
}

export interface EvaluationResult {
  id: string;
  test_title: string;
  journey: AcademicJourney;
  level: string;
  subject: string;
  chapter?: string;
  total_max_marks: number;
  total_obtained_marks: number;
  percentage: number;
  confidence_overall: ConfidenceLevel;
  questions: QuestionEvaluation[];
  performance_analysis: PerformanceAnalysis;
  stats: EvaluationStats;
  evaluated_at: string;
  file_name?: string;
  active_source_ids?: string[];
  excludeFromAnalysis?: boolean;
  mode?: 'certified' | 'walk-and-revise' | 'standard';
  userId?: string;
  studentName?: string;
  test_id?: string;
  source_test?: GeneratedTest;
}

export type SourceCategory = 
  | 'Official Syllabus'
  | 'Textbook' 
  | 'Marking Scheme' 
  | 'Topper Copy' 
  | 'Revision Notes' 
  | 'Formula Sheet' 
  | 'PYQs' 
  | 'Sample Paper' 
  | 'ICAI Study Material' 
  | 'NCERT Book';

export interface ReferenceSource {
  id: string;
  title: string;
  category: SourceCategory;
  journey: AcademicJourney;
  level: string;
  subject: string;
  chapter?: string;
  year?: string;
  description: string;
  content: string;
  isActive: boolean;
  isBuiltIn?: boolean;
  attachedFileName?: string;
  attachedFileSize?: number;
  attachedFileType?: string;
  attachedFileBase64?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedQuestion {
  question_id: string;
  question_number: number;
  question_text: string;
  question_type: string;
  max_marks: number;
  sub_topic?: string;
  model_answer: string;
  key_concepts: string[];
  marking_scheme_steps: string[];
  pyq_tag?: string; // e.g. "CBSE Board 2023 - Set 1", "CA Foundation Nov 2022"
  pyq_year?: string; // e.g. "2023", "Nov 2022"
  is_pyq?: boolean;
}

export interface GeneratedTest {
  test_id: string;
  title: string;
  journey: AcademicJourney;
  level: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam Standard';
  total_marks: number;
  duration_minutes: number;
  general_instructions: string[];
  questions: GeneratedQuestion[];
  created_at: string;
  is_pyq_mode?: boolean;
  pyq_year_range?: string; // e.g. "2014-2024" or "2019-2024"
}

export interface MistakeRecord {
  id: string;
  journey: AcademicJourney;
  subject: string;
  chapter: string;
  concept: string;
  mistake_type: MistakeCategoryType;
  frequency: number;
  last_occurred: string;
  examples: Array<{
    test_id: string;
    test_title: string;
    question_id: string;
    snippet: string;
  }>;
}

export interface ChapterAnalysisItem {
  subject: string;
  totalMax: number;
  totalObtained: number;
  count: number;
  percentage: number;
  status: 'Strong' | 'Moderate' | 'Weak';
  weakTopics: string[];
  mistakeSummary: string[];
  suggestedQuestionsCount: number;
}

export interface LongTermAnalysisData {
  totalEvaluations: number;
  averagePercentage: number;
  totalMarksAwarded: number;
  totalMaxMarks: number;
  strongChaptersCount: number;
  moderateChaptersCount: number;
  weakChaptersCount: number;
  subjectPerformance: Record<string, { totalMax: number; totalObtained: number; count: number; percentage: number }>;
  chapterPerformance: Record<string, ChapterAnalysisItem>;
  recurringMistakes: Record<string, number>;
  omissionErrorsCount: number;
  incompleteAnswersCount: number;
  calculationErrorsCount: number;
  conceptGaps: Array<{ subject: string; chapter: string; concept: string; occurrences: number; recommendation: string }>;
  trajectory: Array<{ date: string; title: string; subject: string; score: number; percentage: number }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  isPhotoSolution?: boolean;
}

export type UserRole = 'student' | 'teacher_admin' | 'coaching_partner';

export type UserStatus = 'approved' | 'pending_approval' | 'rejected' | 'blocked';

export interface DeviceSession {
  sessionId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  ipAddress?: string;
  locationHint?: string;
  loginTimestamp: string;
  lastActiveTimestamp: string;
  isCurrentDevice?: boolean;
  status: 'active' | 'terminated';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  rollNumber?: string;
  targetJourney: AcademicJourney;
  institution?: string;
  instituteCity?: string;
  estimatedStudents?: number;
  watermarkText?: string;
  targetScorePercentage?: number;
  bio?: string;
  hasInspectorPrivilege?: boolean;
  assignedBatches?: string[];
  createdAt: string;
  passwordHash?: string;
  approvalStatus?: UserStatus;
  approvedBy?: string;
  approvedAt?: string;
  isKillSwitched?: boolean;
  killSwitchReason?: string;
  deviceSessions?: DeviceSession[];
  isGuest?: boolean;
  referralCode?: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher_admin';
  message: string;
  timestamp: string;
}

export type TicketCategory = 
  | 'Evaluation Doubt' 
  | 'Technical / App Issue' 
  | 'Chapter Test Query' 
  | 'Syllabus & Concept Guidance' 
  | 'Account & Access' 
  | 'Fee & Enrollment'
  | 'General Feedback';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface SupportTicket {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentRoll?: string;
  journey: AcademicJourney;
  subject?: string;
  category: TicketCategory;
  subjectTitle: string;
  status: TicketStatus;
  priority: 'normal' | 'high' | 'urgent';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  isReadByAdmin?: boolean;
  isReadByStudent?: boolean;
}

export interface BotDefenseMetrics {
  honeypotTrapsTriggered: number;
  rateLimitBlocks: number;
  verifiedHumanRequests: number;
  activeShieldStatus: 'Active & Hardened' | 'Diagnostic Mode';
}

export type ActiveTab = 
  | 'dashboard' 
  | 'evaluate' 
  | 'result' 
  | 'sources' 
  | 'analysis' 
  | 'create-test' 
  | 'walk-and-revise'
  | 'coaching'
  | 'history' 
  | 'classroom'
  | 'assistant';

export * from './coaching';

export type WalkDrillMode = 'mcq_sprint' | 'case_study_mcq' | 'rapid_qa';

export interface WalkDrillQuestion {
  question_id: string;
  question_number: number;
  question_text: string;
  question_type: 'MCQ' | 'Case Study MCQ' | 'Rapid Theory';
  max_marks: number;
  options?: string[];
  correct_option_index?: number;
  correct_option_letter?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  sub_topic?: string;
  key_terms_required?: string[];
  model_answer?: string;
  case_passage?: string;
  pyq_tag?: string;
  pyq_year?: string;
  is_pyq?: boolean;
}

export interface WalkDrillSet {
  drill_id: string;
  title: string;
  journey: AcademicJourney;
  level: string;
  subject: string;
  chapter: string;
  drill_mode: WalkDrillMode;
  difficulty: string;
  total_questions: number;
  total_marks: number;
  is_pyq_mode?: boolean;
  pyq_year_range?: string;
  questions: WalkDrillQuestion[];
}


