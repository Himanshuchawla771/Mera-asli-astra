import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { EvaluationResult } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  evaluation: EvaluationResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  evaluation,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !evaluation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with warning icon */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Trash2 className="w-6 h-6" />
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & context */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Confirm Test Record Deletion?
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Are you sure you want to permanently delete this test record? (2-Tap Confirmation Required)
          </p>
        </div>

        {/* Test Summary Card */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
          <div className="font-bold text-slate-900 truncate">
            {evaluation.test_title}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-[11px]">
            <span>{evaluation.subject}</span>
            <span>•</span>
            <span>{evaluation.total_obtained_marks}/{evaluation.total_max_marks} Marks ({evaluation.percentage}%)</span>
            <span>•</span>
            <span>{new Date(evaluation.evaluated_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-0.5">
          <div className="font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Analysis Tab Safety:</span>
          </div>
          <p className="text-amber-800/90 leading-relaxed">
            Deleting this test will instantly recalculate your long-term accuracy and remove any mistake alerts / red marks logged specifically from this attempt.
          </p>
        </div>

        {/* Actions: Cancel vs Confirm (2nd Tap) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm &amp; Delete (Tap 2)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
