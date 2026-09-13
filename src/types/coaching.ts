import { AcademicJourney, EvaluationResult } from './index';

export interface QuestionPaperSection {
  id: string;
  sectionName: string; // e.g. "Section A (1 Mark MCQs)", "Section B (Short Answers)"
  questionCount: number;
  marksPerQuestion: number;
  questionNumbers: string[]; // e.g. ["1", "2", "3", "4", "5"]
}

export interface MasterQuestionPaperConfig {
  paperTitle: string;
  journey: AcademicJourney;
  subject: string;
  chapterOrTopic: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  markingSchemeType: 'step_wise_strict' | 'cbse_standard' | 'nta_mcq' | 'icai_case_law';
  sections: QuestionPaperSection[];
  masterAnswerKeyText?: string;
  attachedQuestionPaperName?: string;
  attachedQuestionPaperBase64?: string;
}

export interface InstitutionalBatchTest {
  id: string;
  batchName: string; // e.g. "Class 11 Sci - Batch Galileo (Morning)"
  instituteName: string; // e.g. "Apex IIT-JEE & Board Academy"
  instituteLogoUrl?: string;
  watermarkText: string;
  createdAt: string;
  scheduledDate?: string;
  status: 'draft' | 'ready_for_upload' | 'evaluating' | 'completed';
  questionPaper: MasterQuestionPaperConfig;
  targetStudentCount: number;
  pagesPerStudentEstimate: number;
  evaluatedSubmissions: EvaluationResult[];
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  passPercentage?: number;
}
