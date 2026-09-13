import React, { useState } from 'react';
import { 
  Scale, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { QuestionEvaluation, AcademicJourney } from '../types';
import { recheckQuestionEvaluation, RecheckResult } from '../services/api';

interface RecheckDisputeModalProps {
  question: QuestionEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
  onRecheckSuccess: (updatedQuestion: QuestionEvaluation, delta: number) => void;
  journey: AcademicJourney;
  subject: string;
  chapter?: string;
}

export const RecheckDisputeModal: React.FC<RecheckDisputeModalProps> = ({
  question,
  isOpen,
  onClose,
  onRecheckSuccess,
  journey,
  subject,
  chapter
}) => {
  const [argument, setArgument] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecheckResult | null>(null);

  if (!isOpen || !question) return null;

  const quickPrompts = [
    'I had struck through the initial calculation with pen, OCR misread it.',
    'My working notes at the bottom of the page were omitted during scan.',
    'I used an alternative formula/accounting treatment recognized by CBSE/ICAI.',
    'Final answer and journal entries are balanced, please review step marks.'
  ];

  const handleApplyQuickPrompt = (promptText: string) => {
    setArgument(prev => prev ? `${prev} ${promptText}` : promptText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argument.trim()) {
      setError('Please provide a specific reason or explanation for why you believe the marks should be reviewed.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await recheckQuestionEvaluation({
        journey,
        subject,
        chapter,
        question,
        student_argument: argument.trim()
      });

      setResult(res);

      if (res.verdict === 'ACCEPTED' && res.delta_marks > 0) {
        const updatedQ: QuestionEvaluation = {
          ...question,
          awarded_marks: res.new_awarded_marks,
          status: res.new_status,
          teacher_feedback: `${question.teacher_feedback}\n\n[Re-evaluation Note]: ${res.teacher_reply}`,
          marks_deduction_reason: res.updated_deduction_reason || question.marks_deduction_reason,
          recheck_status: 'ACCEPTED',
          recheck_argument: argument.trim(),
          recheck_response: res.teacher_reply,
          recheck_delta: res.delta_marks,
          rechecked_at: new Date().toISOString()
        };
        onRecheckSuccess(updatedQ, res.delta_marks);
      } else {
        const updatedQ: QuestionEvaluation = {
          ...question,
          recheck_status: 'REJECTED',
          recheck_argument: argument.trim(),
          recheck_response: res.teacher_reply,
          recheck_delta: 0,
          rechecked_at: new Date().toISOString()
        };
        onRecheckSuccess(updatedQ, 0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit recheck petition. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Teacher Dispute & Re-evaluation</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                  Senior Examiner
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Question {question.question_id} • Current: <strong>{question.awarded_marks} / {question.max_marks} Marks</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Question context chip */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700">
              <span>Question Statement:</span>
              <span className="text-indigo-600 font-mono">Max Marks: {question.max_marks}</span>
            </div>
            <p className="text-slate-600 line-clamp-2 italic">
              "{question.question_text}"
            </p>
          </div>

          {/* Current Deduction Reason if any */}
          {question.marks_deduction_reason && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Current Deduction Reason:
              </span>
              <p className="text-rose-900 leading-relaxed">
                {question.marks_deduction_reason}
              </p>
            </div>
          )}

          {/* Result view if already rechecked */}
          {result ? (
            <div className={`p-5 rounded-2xl border space-y-3 ${
              result.verdict === 'ACCEPTED'
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.verdict === 'ACCEPTED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                  )}
                  <span className={`font-black text-sm uppercase tracking-wide ${
                    result.verdict === 'ACCEPTED' ? 'text-emerald-800' : 'text-amber-800'
                  }`}>
                    {result.verdict === 'ACCEPTED' ? 'Dispute Accepted • Marks Awarded!' : 'Original Score Maintained'}
                  </span>
                </div>

                {result.delta_marks > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-xs">
                    +{result.delta_marks} Marks
                  </span>
                )}
              </div>

              {/* Teacher Explanation */}
              <div className="bg-white p-4 rounded-xl border border-gray-200/80 text-xs space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Head Examiner's Verdict & Rationale:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.teacher_reply}
                </p>
              </div>

              {/* Actionable Guidance */}
              {result.actionable_guidance && (
                <div className="text-xs text-indigo-900 bg-indigo-50/80 border border-indigo-200/60 p-3 rounded-xl flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-800">Examiner's Presentation Tip: </span>
                    <span>{result.actionable_guidance}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close & View Updated Scorecard
                </button>
              </div>
            </div>
          ) : (
            /* Dispute Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Explanation / Dispute for the Teacher:
                </label>
                <textarea
                  value={argument}
                  onChange={(e) => setArgument(e.target.value)}
                  placeholder="e.g., Sir, in step 2 I struck through the initial 5,000 calculation with my pen and wrote 4,500 below it. The OCR counted the scratched portion as an error. Please verify the final working note."
                  rows={4}
                  className="w-full p-3.5 text-xs text-slate-800 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Tap to add common clarifications:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyQuickPrompt(p)}
                      className="text-[10px] font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors text-left cursor-pointer"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strictness notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Official Re-evaluation Guidelines:
                </span>
                <p className="leading-relaxed">
                  The Head Examiner strictly enforces CBSE / ICAI step-marking rubrics. Genuine grievances (struck-through pen work, omitted working notes, alternative recognized accounting/statutory methods) will be credited. Mere emotional requests for extra marks are disallowed.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !argument.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Arbitrating with Board Examiner...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Petition for Recheck</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
