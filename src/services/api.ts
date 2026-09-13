import { EvaluationResult, GeneratedTest, ReferenceSource, AcademicJourney } from '../types';

export interface EvaluatePayload {
  pdfBase64?: string;
  imagesBase64?: Array<string | { data: string; mimeType?: string; name?: string }>;
  mimeType?: string;
  fileName?: string;
  manualText?: string;
  activeSources?: Array<{ title: string; category: string; content: string }>;
  journey?: AcademicJourney;
  level?: string;
  subject?: string;
  chapter?: string;
  totalMarksHint?: number;
  testContext?: GeneratedTest | null;
}

export async function evaluateExamDocument(payload: EvaluatePayload): Promise<EvaluationResult> {
  const response = await fetch('/api/evaluate-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Evaluation failed on server.');
  }

  // Ensure unique ID and fields
  const evaluation: EvaluationResult = {
    ...data.evaluation,
    id: data.evaluation.id || `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    journey: data.evaluation.journey || payload.journey || 'CLASS_12',
    level: data.evaluation.level || payload.level || 'Class 12 CBSE',
    subject: data.evaluation.subject || payload.subject || 'Accountancy',
    chapter: data.evaluation.chapter || payload.chapter || undefined,
    test_id: payload.testContext?.test_id || data.evaluation.test_id,
    source_test: payload.testContext || data.evaluation.source_test
  };

  return evaluation;
}

export async function askAIAssistant(
  message: string,
  options?: {
    journey?: AcademicJourney;
    subject?: string;
    evaluationContext?: EvaluationResult | null;
    chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    imageBase64?: string;
  }
): Promise<string> {
  const response = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      journey: options?.journey || 'CLASS_12',
      subject: options?.subject || 'Accountancy',
      evaluationContext: options?.evaluationContext,
      chatHistory: options?.chatHistory || [],
      imageBase64: options?.imageBase64
    })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to get response from AI Assistant.');
  }

  return data.reply;
}

export async function generateAITest(options: {
  journey: AcademicJourney;
  level: string;
  subject: string;
  topic: string;
  difficulty: string;
  numQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  questionTypes: string[];
  customInstructions?: string;
  pyqMode?: boolean;
  pyqYearRange?: string;
}): Promise<GeneratedTest> {
  const response = await fetch('/api/generate-test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate test.');
  }

  return data.test;
}

export async function checkServerHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { status: 'error', hasGeminiKey: false };
  }
}

export async function fetchSecurityStatus(): Promise<any> {
  try {
    const res = await fetch('/api/security-status');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export interface RecheckPayload {
  journey: AcademicJourney;
  level?: string;
  subject?: string;
  chapter?: string;
  question: any;
  student_argument: string;
}

export interface RecheckResult {
  verdict: 'ACCEPTED' | 'REJECTED';
  new_awarded_marks: number;
  delta_marks: number;
  new_status: 'Correct' | 'Partially Correct' | 'Incorrect';
  teacher_reply: string;
  updated_deduction_reason?: string;
  actionable_guidance?: string;
}

export async function recheckQuestionEvaluation(payload: RecheckPayload): Promise<RecheckResult> {
  const response = await fetch('/api/recheck-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to recheck question evaluation.');
  }

  return data.recheck;
}

