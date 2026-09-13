import React, { useState } from 'react';
import { X, Check, Award, AlertCircle, Sparkles } from 'lucide-react';
import { QuestionEvaluation, EvaluationStatus } from '../types';

interface HumanReviewModalProps {
  question: QuestionEvaluation;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: QuestionEvaluation) => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [awardedMarks, setAwardedMarks] = useState<number>(question.awarded_marks);
  const [status, setStatus] = useState<EvaluationStatus>(question.status);
  const [teacherFeedback, setTeacherFeedback] = useState<string>(question.teacher_feedback);
  const [marksDeductionReason, setMarksDeductionReason] = useState<string>(question.marks_deduction_reason || '');
  const [studentAnswer, setStudentAnswer] = useState<string>(question.student_answer);

  const statuses: EvaluationStatus[] = [
    'Correct',
    'Mostly Correct',
    'Partially Correct',
    'Incorrect',
    'Not Attempted',
    'Needs Review'
  ];

  const handleSave = () => {
    let clampedMarks = Number(awardedMarks);
    if (isNaN(clampedMarks) || clampedMarks < 0) clampedMarks = 0;
    if (clampedMarks > question.max_marks) clampedMarks = question.max_marks;

    onSave({
      ...question,
      awarded_marks: clampedMarks,
      status,
      teacher_feedback: teacherFeedback,
      marks_deduction_reason: marksDeductionReason,
      student_answer: studentAnswer,
      needs_review: false // cleared on manual review
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {question.question_id}
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Teacher Review & Score Adjustment</h3>
              <p className="text-xs text-zinc-500">Manually override AI evaluation and recalculate scores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Question Text */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Question</span>
            <p className="font-semibold text-zinc-900 text-sm mt-1">{question.question_text}</p>
            <p className="text-xs text-zinc-500 mt-1">Maximum Marks: {question.max_marks}</p>
          </div>

          {/* Student Answer Textarea (in case OCR missed a word) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Extracted Student Answer</label>
            <textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs font-mono rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Awarded Marks & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Awarded Marks (Max: {question.max_marks})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={question.max_marks}
                  value={awardedMarks}
                  onChange={(e) => setAwardedMarks(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-zinc-900 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-zinc-400">
                  / {question.max_marks}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Status Classification
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EvaluationStatus)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 bg-white text-zinc-900"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Marks Deduction Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Deduction Reason (if marks lost)</label>
            <input
              type="text"
              value={marksDeductionReason}
              onChange={(e) => setMarksDeductionReason(e.target.value)}
              placeholder="e.g. Missing condition for Lenz's law, calculation error in final step"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 bg-white text-zinc-900"
            />
          </div>

          {/* Teacher Feedback */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Teacher Remarks & Advice</label>
            <textarea
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 bg-white text-zinc-900"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 bg-zinc-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes & Recalculate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
