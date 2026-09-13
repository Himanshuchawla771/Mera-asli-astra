import React from 'react';
import { EvaluationResult, ReferenceSource } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Award, BookOpen, GraduationCap } from 'lucide-react';

interface PrintableReportProps {
  evaluation: EvaluationResult;
  sources: ReferenceSource[];
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ evaluation, sources }) => {
  const activeSources = sources.filter(s => evaluation.active_source_ids?.includes(s.id));

  return (
    <div id="printable-evaluation-report" className="bg-white p-8 max-w-4xl mx-auto space-y-6 text-zinc-900 border border-zinc-200 rounded-2xl shadow-sm my-6 print:border-none print:shadow-none print:p-0">
      
      {/* Header Banner */}
      <div className="border-b-2 border-indigo-600 pb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
            <GraduationCap className="w-6 h-6" />
            <span>AI Study Evaluator — Official Examination Report</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 mt-1">
            {evaluation.test_title}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Subject: <strong className="text-zinc-700">{evaluation.subject}</strong> • Evaluated on: {new Date(evaluation.evaluated_at).toLocaleDateString()}
          </p>
        </div>

        {/* Score Badge */}
        <div className="text-right bg-indigo-50 border border-indigo-200 px-5 py-3 rounded-xl">
          <div className="text-3xl font-black text-indigo-700">
            {evaluation.total_obtained_marks} <span className="text-base text-zinc-500 font-normal">/ {evaluation.total_max_marks}</span>
          </div>
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mt-0.5">
            Score: {evaluation.percentage}% ({evaluation.percentage >= 75 ? 'Distinction' : evaluation.percentage >= 40 ? 'Passed' : 'Needs Focus'})
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-center text-xs">
        <div>
          <span className="text-zinc-500 block">Total Questions</span>
          <strong className="text-base text-zinc-900 font-bold">{evaluation.stats?.total_questions || evaluation.questions.length}</strong>
        </div>
        <div>
          <span className="text-emerald-700 block">Correct / Full Marks</span>
          <strong className="text-base text-emerald-700 font-bold">{evaluation.stats?.correct || 0}</strong>
        </div>
        <div>
          <span className="text-amber-700 block">Partially Correct</span>
          <strong className="text-base text-amber-700 font-bold">{evaluation.stats?.partially_correct || 0}</strong>
        </div>
        <div>
          <span className="text-rose-700 block">Incorrect / Zero</span>
          <strong className="text-base text-rose-700 font-bold">{evaluation.stats?.incorrect || 0}</strong>
        </div>
      </div>

      {/* Teacher's Overall Feedback */}
      {evaluation.performance_analysis?.teacher_overall_feedback && (
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Examiner's Overall Assessment</span>
          </div>
          <p className="text-zinc-800 leading-relaxed">
            {evaluation.performance_analysis.teacher_overall_feedback}
          </p>
        </div>
      )}

      {/* Active References */}
      {activeSources.length > 0 && (
        <div className="text-xs text-zinc-500 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Referenced Marking Rubrics: </span>
          <div className="flex flex-wrap gap-1">
            {activeSources.map(s => (
              <span key={s.id} className="bg-zinc-100 text-zinc-700 font-medium px-2 py-0.5 rounded text-[11px]">
                {s.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question-Wise Evaluation List */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-2">
          Question-Wise Academic Evaluation & Deductions
        </h3>

        <div className="space-y-4">
          {evaluation.questions.map((q, idx) => (
            <div key={q.question_id || idx} className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2.5 text-xs">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 text-sm">{q.question_id}</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                      q.status === 'Correct'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.status === 'Mostly Correct'
                        ? 'bg-emerald-50 text-emerald-700'
                        : q.status === 'Partially Correct'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {q.status}
                    </span>
                    {q.topic && <span className="text-zinc-400">• {q.topic}</span>}
                  </div>
                  <p className="font-semibold text-zinc-800">{q.question_text}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-sm text-zinc-900">{q.awarded_marks}</span>
                  <span className="text-zinc-400"> / {q.max_marks} Marks</span>
                </div>
              </div>

              {/* Student Answer */}
              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 text-zinc-700 font-mono text-[11px]">
                <strong className="font-sans text-zinc-500 block text-[10px] uppercase mb-0.5">Student Answer:</strong>
                {q.student_answer || '(No answer provided / Not attempted)'}
              </div>

              {/* Deduction Reason */}
              {q.marks_deduction_reason && (
                <div className="text-rose-700 bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                  <strong>Marks Deduction:</strong> {q.marks_deduction_reason}
                </div>
              )}

              {/* Topper Model Answer */}
              {q.expected_model_answer && (
                <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 text-zinc-800">
                  <strong className="text-indigo-900 block text-[10px] uppercase mb-0.5">Topper Model Answer:</strong>
                  {q.expected_model_answer}
                </div>
              )}

              {/* Missing Keyterms */}
              {q.keyterms_missing && q.keyterms_missing.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-semibold text-[10px] uppercase">Missing Keyterms:</span>
                  {q.keyterms_missing.map((kt, i) => (
                    <span key={i} className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      {kt}
                    </span>
                  ))}
                </div>
              )}

              {/* Teacher Feedback */}
              {q.teacher_feedback && (
                <p className="text-zinc-600 italic">
                  <strong>Examiner Remarks:</strong> {q.teacher_feedback}
                </p>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Recommended Study Plan */}
      {evaluation.performance_analysis?.recommended_study_plan && evaluation.performance_analysis.recommended_study_plan.length > 0 && (
        <div className="bg-indigo-50/60 border border-indigo-200 p-4 rounded-xl text-xs space-y-2">
          <h4 className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
            Actionable Next Steps & Practice Strategy
          </h4>
          <ul className="list-disc list-inside space-y-1 text-zinc-800">
            {evaluation.performance_analysis.recommended_study_plan.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-zinc-200 pt-4 text-center text-[11px] text-zinc-400">
        Generated automatically with AI Study Evaluator • Multimodal Exam Checker
      </div>
    </div>
  );
};
