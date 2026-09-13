import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Printer, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ListFilter,
  Check,
  AlertCircle,
  BarChart2,
  FileText,
  PenTool,
  Trash2,
  ShieldCheck,
  Share2,
  Copy,
  Scale,
  Columns
} from 'lucide-react';
import { EvaluationResult, QuestionEvaluation, ReferenceSource, ActiveTab } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { generatePDFReport } from '../utils/pdfExport';
import { HumanReviewModal } from './HumanReviewModal';
import { RecheckDisputeModal } from './RecheckDisputeModal';
import { PrintableReport } from './PrintableReport';
import { CertifiedEvaluatedCopyView } from './CertifiedEvaluatedCopyView';
import { SplitScreenExaminerStation } from './SplitScreenExaminerStation';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { toggleEvaluationAnalysisInclusion } from '../utils/storage';

interface ResultViewProps {
  evaluation: EvaluationResult;
  sources: ReferenceSource[];
  onUpdateEvaluation: (updated: EvaluationResult) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onAskQuestionInChat: (questionId: string, questionContext: string) => void;
  onDeleteEvaluation?: (id: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  evaluation,
  sources,
  onUpdateEvaluation,
  setActiveTab,
  onAskQuestionInChat,
  onDeleteEvaluation
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'station' | 'questions' | 'diagnostics' | 'certified' | 'report'>('station');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>(
    evaluation.questions.map(q => q.question_id) // Default all expanded
  );
  
  // Human Review Modal state
  const [reviewingQuestion, setReviewingQuestion] = useState<QuestionEvaluation | null>(null);
  const [disputeQuestion, setDisputeQuestion] = useState<QuestionEvaluation | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDisputeSuccess = (updatedQuestion: QuestionEvaluation, delta: number) => {
    const updatedQuestions = evaluation.questions.map(q => 
      q.question_id === updatedQuestion.question_id ? updatedQuestion : q
    );
    const newObtainedMarks = Math.max(0, parseFloat((evaluation.total_obtained_marks + delta).toFixed(2)));
    const newPercentage = evaluation.total_max_marks > 0
      ? Math.min(100, Math.round((newObtainedMarks / evaluation.total_max_marks) * 100))
      : 0;

    const updatedEvaluation: EvaluationResult = {
      ...evaluation,
      total_obtained_marks: newObtainedMarks,
      percentage: newPercentage,
      questions: updatedQuestions
    };

    onUpdateEvaluation(updatedEvaluation);
  };

  const isExcludedFromAnalysis = Boolean(evaluation.excludeFromAnalysis);

  const handleToggleAnalysisInclusion = () => {
    const updated = !isExcludedFromAnalysis;
    toggleEvaluationAnalysisInclusion(evaluation.id, !updated);
    onUpdateEvaluation({
      ...evaluation,
      excludeFromAnalysis: updated
    });
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (onDeleteEvaluation) {
      onDeleteEvaluation(evaluation.id);
    }
    setActiveTab('history');
  };

  const toggleExpand = (qId: string) => {
    setExpandedQuestionIds(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const expandAll = () => {
    setExpandedQuestionIds(evaluation.questions.map(q => q.question_id));
  };

  const collapseAll = () => {
    setExpandedQuestionIds([]);
  };

  const handleSaveQuestionReview = (updatedQ: QuestionEvaluation) => {
    const updatedQuestions = evaluation.questions.map(q => 
      q.question_id === updatedQ.question_id ? updatedQ : q
    );

    // Recalculate totals programmatically
    let computedMax = 0;
    let computedObtained = 0;
    let correctCount = 0;
    let mostlyCorrectCount = 0;
    let partiallyCorrectCount = 0;
    let incorrectCount = 0;
    let notAttemptedCount = 0;

    updatedQuestions.forEach(q => {
      computedMax += q.max_marks;
      computedObtained += q.awarded_marks;
      if (q.status === 'Correct') correctCount++;
      else if (q.status === 'Mostly Correct') mostlyCorrectCount++;
      else if (q.status === 'Partially Correct') partiallyCorrectCount++;
      else if (q.status === 'Incorrect') incorrectCount++;
      else if (q.status === 'Not Attempted') notAttemptedCount++;
    });

    const finalObtained = Math.round(computedObtained * 10) / 10;
    const finalMax = computedMax > 0 ? computedMax : evaluation.total_max_marks;
    const percentage = finalMax > 0 ? Math.round((finalObtained / finalMax) * 1000) / 10 : 0;

    const newEvaluation: EvaluationResult = {
      ...evaluation,
      questions: updatedQuestions,
      total_max_marks: finalMax,
      total_obtained_marks: finalObtained,
      percentage: percentage,
      stats: {
        total_questions: updatedQuestions.length,
        attempted: updatedQuestions.length - notAttemptedCount,
        correct: correctCount,
        mostly_correct: mostlyCorrectCount,
        partially_correct: partiallyCorrectCount,
        incorrect: incorrectCount,
        not_attempted: notAttemptedCount
      }
    };

    onUpdateEvaluation(newEvaluation);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generatePDFReport(evaluation);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const [copiedShare, setCopiedShare] = useState(false);

  const getFormattedShareReport = () => {
    const journeyTitle = evaluation.journey === 'CLASS_12' ? 'Class 12 CBSE Commerce' : 'ICAI CA Foundation';
    const statusEmoji = evaluation.percentage >= 75 ? '🌟 Distinction' : evaluation.percentage >= 40 ? '✅ Passed' : '⚠️ Needs Practice';
    const strengths = evaluation.performance_analysis?.strengths?.slice(0, 2).map(s => `• ${s}`).join('\n') || '• Good conceptual foundation.';
    const recommendations = evaluation.performance_analysis?.recommended_study_plan?.slice(0, 2).map(r => `• ${r}`).join('\n') || '• Review step-wise working notes.';

    return `📊 *Student Assessment Report* (${journeyTitle})
*Subject:* ${evaluation.subject || 'General'}
*Chapter/Topic:* ${evaluation.chapter || evaluation.test_title || 'Assessment Test'}
*Score:* ${evaluation.total_obtained_marks} / ${evaluation.total_max_marks} (${evaluation.percentage}%) — ${statusEmoji}

*Key Strengths:*
${strengths}

*Action Plan for Full Marks:*
${recommendations}

_Evaluated with Strict Board/ICAI Step-Marking Rubrics._`;
  };

  const handleShareWhatsApp = () => {
    const text = getFormattedShareReport();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyShareText = () => {
    const text = getFormattedShareReport();
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Filter questions
  const filteredQuestions = evaluation.questions.filter(q => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'correct') return q.status === 'Correct' || q.status === 'Mostly Correct';
    if (filterStatus === 'partial') return q.status === 'Partially Correct';
    if (filterStatus === 'incorrect') return q.status === 'Incorrect' || q.status === 'Not Attempted';
    if (filterStatus === 'review') return q.needs_review === true || q.status === 'Needs Review';
    return true;
  });

  const isDistinction = evaluation.percentage >= 75;
  const isPassed = evaluation.percentage >= 40;

  // Calculate circular gauge for result score
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (evaluation.percentage / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Walk & Revise Special Exemption Banner */}
      {evaluation.mode === 'walk-and-revise' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm uppercase tracking-wider text-emerald-950">
                Walk &amp; Revise Drill (100% Presentation Exemption Enforced)
              </div>
              <p className="text-xs text-emerald-800">
                No marks were deducted for formatting, ledger rulings, handwriting, or speech dictation slips. Graded 100% on conceptual mastery and statutory provisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[10px] font-bold px-2.5 py-1 bg-white rounded-lg border border-emerald-300 text-emerald-800">
              Zero-Pen Mobile Mode
            </span>
          </div>
        </div>
      )}

      {/* Excluded From Analytics Notice */}
      {isExcludedFromAnalysis && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>This test is <strong>excluded</strong> from your cumulative analytics and mistake alerts. It does not affect your subject accuracy graphs.</span>
          </div>
          <button
            type="button"
            onClick={handleToggleAnalysisInclusion}
            className="px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold hover:bg-amber-100 cursor-pointer shrink-0"
          >
            Re-include
          </button>
        </div>
      )}
      
      {/* Top Bento Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Score Bento with Circular Radial Gauge & Executive Performance Ribbon (Span 4) */}
        <section className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Top Edge Ambient Gradient */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
            isDistinction ? 'from-emerald-500 via-teal-500 to-blue-500' : isPassed ? 'from-blue-600 via-indigo-600 to-slate-900' : 'from-rose-500 via-amber-500 to-rose-600'
          }`} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                {evaluation.subject || 'General Assessment'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {new Date(evaluation.evaluated_at).toLocaleDateString()}
              </span>
            </div>

            {/* Dynamic Performance Ribbon */}
            <div className="mb-4">
              <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                evaluation.percentage >= 90
                  ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100/60 border-amber-300/80 text-amber-950 shadow-xs'
                  : evaluation.percentage >= 75
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-950'
                  : evaluation.percentage >= 50
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none">
                    {evaluation.percentage >= 90 ? '🏆' : evaluation.percentage >= 75 ? '⚡' : evaluation.percentage >= 50 ? '📈' : '🎯'}
                  </span>
                  <span className="font-bold tracking-tight">
                    {evaluation.percentage >= 90
                      ? 'Top 2% Percentile in Batch'
                      : evaluation.percentage >= 75
                      ? 'Top 10% First Division Benchmark'
                      : evaluation.percentage >= 50
                      ? 'Solid Passing Performance'
                      : 'Needs Guided Drill & Practice'}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  ICAI/CBSE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5 my-2">
              {/* Circular Radial Gauge */}
              <div className="relative w-22 h-22 flex items-center justify-center shrink-0">
                <svg className="w-22 h-22 -rotate-90" viewBox="0 0 90 90">
                  <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    className={`${isDistinction ? 'text-emerald-600' : isPassed ? 'text-blue-600' : 'text-rose-600'} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-slate-900 leading-none">{evaluation.percentage}%</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Score</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Marks</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {evaluation.total_obtained_marks}{' '}
                  <span className="text-base font-normal text-slate-400">/ {evaluation.total_max_marks}</span>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded inline-block border ${
                  isDistinction ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : isPassed ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {isDistinction ? 'Distinction' : isPassed ? 'Passed' : 'Needs Practice'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Accuracy: {Math.round(evaluation.percentage)}%</span>
            <span className="font-semibold text-slate-700">{evaluation.questions.length} Questions Checked</span>
          </div>
        </section>

        {/* Exam Information & Teacher Verdict Bento (Span 5) */}
        <section className="md:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Official Evaluation Report</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              {evaluation.test_title}
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Source file: <span className="font-mono text-slate-700 font-medium">{evaluation.file_name || 'Document.pdf'}</span>
            </p>
            
            {evaluation.performance_analysis?.teacher_overall_feedback && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                "{evaluation.performance_analysis.teacher_overall_feedback}"
              </div>
            )}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Syllabus Rubrics Verified
            </span>
            <button 
              onClick={() => setActiveSubTab('diagnostics')}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Full diagnostics →
            </button>
          </div>
        </section>

        {/* Quick Actions Dark Bento (Span 3) */}
        <section className="md:col-span-3 bg-slate-900 rounded-2xl p-6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col justify-between border border-slate-800">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Export &amp; Share</span>
            <h3 className="text-base font-bold mt-1 text-white">Scorecard Actions</h3>
            <p className="text-slate-400 text-xs mt-1">Download official scorecard PDF or review with AI tutor.</p>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 py-2 px-3 rounded-lg font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={() => setActiveTab('assistant')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Tutor</span>
              </button>
            </div>

            {/* 1-Click WhatsApp / Parents Report Share */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-1.5 px-2 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Share scorecard summary directly on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareText}
                className="bg-slate-800 hover:bg-slate-700 text-white py-1.5 px-3 rounded-lg text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Copy formatted scorecard text"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Ingestion & Delete Management */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAnalysisInclusion}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isExcludedFromAnalysis
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title={isExcludedFromAnalysis ? 'Re-include this test in overall analytics' : 'Exclude this test from analytics and mistake alerts'}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isExcludedFromAnalysis ? 'Excluded from Stats' : 'Included in Stats'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-colors cursor-pointer"
                title="Delete this test record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Bento Sub-navigation & Stats Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Sub-tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 flex-wrap gap-1">
            <button
              onClick={() => setActiveSubTab('station')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'station'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split-Screen Examiner Station</span>
            </button>

            <button
              onClick={() => setActiveSubTab('questions')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'questions'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Question Feedback ({evaluation.questions.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('diagnostics')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'diagnostics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Performance Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveSubTab('certified')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'certified'
                  ? 'bg-red-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Certified Evaluated Copy</span>
            </button>

            <button
              onClick={() => setActiveSubTab('report')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'report'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Printable Report</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-normal">
            {evaluation.stats?.correct || 0} Correct • {evaluation.stats?.partially_correct || 0} Partial • {evaluation.stats?.incorrect || 0} Incorrect
          </span>
        </div>

        {/* Quick Stats Bento Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 text-center">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Total Questions</span>
            <span className="text-lg font-bold text-slate-900">{evaluation.stats?.total_questions || evaluation.questions.length}</span>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70 text-center">
            <span className="text-[11px] text-emerald-800 font-semibold uppercase block">Full Marks</span>
            <span className="text-lg font-bold text-emerald-900">{evaluation.stats?.correct || 0}</span>
          </div>

          <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200/70 text-center">
            <span className="text-[11px] text-teal-800 font-semibold uppercase block">Mostly Correct</span>
            <span className="text-lg font-bold text-teal-900">{evaluation.stats?.mostly_correct || 0}</span>
          </div>

          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 text-center">
            <span className="text-[11px] text-amber-800 font-semibold uppercase block">Partially Correct</span>
            <span className="text-lg font-bold text-amber-900">{evaluation.stats?.partially_correct || 0}</span>
          </div>

          <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/70 text-center">
            <span className="text-[11px] text-rose-800 font-semibold uppercase block">Zero / Incorrect</span>
            <span className="text-lg font-bold text-rose-900">{evaluation.stats?.incorrect || 0}</span>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-semibold uppercase block">Not Attempted</span>
            <span className="text-lg font-bold text-slate-700">{evaluation.stats?.not_attempted || 0}</span>
          </div>
        </div>

      </div>

      {/* SUB-TAB: CERTIFIED EVALUATED COPY (ICAI / CBSE STYLE) */}
      {activeSubTab === 'certified' && (
        <CertifiedEvaluatedCopyView
          evaluation={evaluation}
          sources={sources}
          onDownloadPDF={handleExportPDF}
          onPrint={handlePrint}
        />
      )}

      {/* SUB-TAB 1: QUESTION-WISE EVALUATION */}
      {activeSubTab === 'questions' && (
        <div className="space-y-4">
          
          {/* Filter & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <ListFilter className="w-3.5 h-3.5 text-slate-600" />
                Filter:
              </span>
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'correct', label: 'Full Marks' },
                { id: 'partial', label: 'Partially Correct' },
                { id: 'incorrect', label: 'Incorrect / Zero' },
                { id: 'review', label: 'Needs Review' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterStatus === f.id
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Expand / Collapse All */}
            <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-semibold text-slate-500">
              <button 
                onClick={expandAll}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <span>•</span>
              <button 
                onClick={collapseAll}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>

          </div>

          {/* Question Cards Bento List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionIds.includes(q.question_id);

              // Subject-based ambient tone
              const subjLower = (evaluation.subject || '').toLowerCase();
              const subjectBadgeStyle = subjLower.includes('account')
                ? 'border-indigo-200 bg-indigo-50/40'
                : subjLower.includes('econ')
                ? 'border-emerald-200 bg-emerald-50/40'
                : subjLower.includes('law')
                ? 'border-rose-200 bg-rose-50/30'
                : subjLower.includes('math')
                ? 'border-blue-200 bg-blue-50/40'
                : 'border-slate-200/90 bg-white';

              const subjectAccentColor = subjLower.includes('account')
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                : subjLower.includes('econ')
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : subjLower.includes('law')
                ? 'text-rose-700 bg-rose-50 border-rose-200'
                : 'text-blue-700 bg-blue-50 border-blue-200';

              return (
                <div
                  key={q.question_id}
                  id={`eval-question-card-${q.question_id}`}
                  className={`rounded-2xl border shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200 ${
                    isExpanded ? `${subjectBadgeStyle} ring-1 ring-blue-500/10` : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header (Accordion trigger) */}
                  <div
                    onClick={() => toggleExpand(q.question_id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Question Number Badge */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        Q{q.question_id}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Subject Ambient Tag */}
                          {evaluation.subject && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${subjectAccentColor}`}>
                              {evaluation.subject}
                            </span>
                          )}

                          {/* Status Badge */}
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                            q.status === 'Correct'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : q.status === 'Mostly Correct'
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : q.status === 'Partially Correct'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {q.status}
                          </span>

                          {q.topic && (
                            <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                              • {q.topic}
                            </span>
                          )}

                          {q.needs_review && (
                            <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Needs Review
                            </span>
                          )}

                          {q.recheck_status === 'ACCEPTED' && (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 shadow-2xs">
                              <Scale className="w-3 h-3 text-emerald-600" />
                              Re-evaluated: +{q.recheck_delta} Marks
                            </span>
                          )}

                          {q.recheck_status === 'REJECTED' && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                              <Scale className="w-3 h-3 text-slate-500" />
                              Recheck Reviewed
                            </span>
                          )}
                        </div>

                        <p className="font-semibold text-slate-900 text-sm truncate mt-1">
                          {q.question_text}
                        </p>
                      </div>
                    </div>

                    {/* Marks Pill & Toggle */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900">
                          {q.awarded_marks} <span className="text-xs text-slate-400 font-normal">/ {q.max_marks} M</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Confidence: {q.confidence}
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-gray-100 space-y-4 bg-gray-50/40">
                      
                      {/* Question Text (Full) */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 mt-4">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                          Full Question ({q.max_marks} Marks)
                        </span>
                        <p className="font-bold text-slate-900 text-sm mt-1 leading-relaxed">
                          {q.question_text}
                        </p>
                      </div>

                      {/* Student Answer */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Student's Extracted Answer
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            OCR Transcription
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl border border-gray-100">
                          {q.student_answer || '(No answer provided for this question)'}
                        </p>
                      </div>

                      {/* Marks Deduction Reason (if marks lost) */}
                      {q.marks_deduction_reason && (
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Why Marks Were Deducted:</span>
                          </div>
                          <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                            {q.marks_deduction_reason}
                          </p>
                        </div>
                      )}

                      {/* TOPPER MODEL ANSWER */}
                      <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/50 border border-indigo-200 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>Topper Model Answer (Full Marks Benchmark):</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                            100% Benchmark
                          </span>
                        </div>
                        <div className="text-xs text-slate-900 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-indigo-100">
                          <MarkdownRenderer content={q.expected_model_answer} />
                        </div>

                        {/* Keyterms breakdown */}
                        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-[11px] font-bold text-gray-500">Essential Keywords:</span>
                          
                          {/* Present keyterms */}
                          {q.keyterms_present?.map((kt, i) => (
                            <span key={`p_${i}`} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {kt}
                            </span>
                          ))}

                          {/* Missing keyterms */}
                          {q.keyterms_missing?.map((kt, i) => (
                            <span key={`m_${i}`} className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              {kt} (Missing)
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Step-by-Step Marking Rubric Timeline (Visual Delight) */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            Official Step-by-Step Marking Breakdown
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                            {q.awarded_marks} of {q.max_marks} Marks
                          </span>
                        </div>

                        {/* Interactive Timeline Stepper */}
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                          
                          {/* Step 1: Conceptual Identification & Setup */}
                          <div className="relative">
                            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                              q.status === 'Correct' || q.status === 'Mostly Correct' ? 'bg-emerald-600 ring-2 ring-emerald-100' : q.status === 'Partially Correct' ? 'bg-amber-500 ring-2 ring-amber-100' : 'bg-rose-500 ring-2 ring-rose-100'
                            }`}>
                              {q.status === 'Correct' || q.status === 'Mostly Correct' ? '✓' : q.status === 'Partially Correct' ? '½' : '✕'}
                            </div>
                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <span>Step 1: Formula / Concept / Statutory Section</span>
                                <span className={q.status !== 'Incorrect' ? 'text-emerald-700' : 'text-rose-600'}>
                                  {q.status !== 'Incorrect' ? 'Awarded' : '0 M (Missed)'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {q.keyterms_present && q.keyterms_present.length > 0 
                                  ? `Identified key provisions: ${q.keyterms_present.slice(0, 3).join(', ')}`
                                  : 'Missing primary definition/statutory provisions in answer header.'}
                              </p>
                            </div>
                          </div>

                          {/* Step 2: Intermediate Working & Working Notes */}
                          <div className="relative">
                            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                              q.correct_points && q.correct_points.length > 0 ? 'bg-emerald-600 ring-2 ring-emerald-100' : 'bg-amber-500 ring-2 ring-amber-100'
                            }`}>
                              {q.correct_points && q.correct_points.length > 0 ? '✓' : '!'}
                            </div>
                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <span>Step 2: Calculations & Working Notes Execution</span>
                                <span className={q.correct_points && q.correct_points.length > 0 ? 'text-emerald-700' : 'text-amber-700'}>
                                  {q.correct_points && q.correct_points.length > 0 ? 'Substantiated' : 'Partial Notes'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {q.correct_points && q.correct_points[0] ? q.correct_points[0] : 'Intermediate adjustments and calculation steps reviewed.'}
                              </p>
                            </div>
                          </div>

                          {/* Step 3: Final Conclusion & Units/Presentation */}
                          <div className="relative">
                            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                              q.awarded_marks === q.max_marks ? 'bg-emerald-600 ring-2 ring-emerald-100' : q.awarded_marks > 0 ? 'bg-amber-500 ring-2 ring-amber-100' : 'bg-rose-500 ring-2 ring-rose-100'
                            }`}>
                              {q.awarded_marks === q.max_marks ? '✓' : q.awarded_marks > 0 ? '½' : '✕'}
                            </div>
                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <span>Step 3: Final Verdict & Balance Sheet / Legal Opinion</span>
                                <span className={q.awarded_marks === q.max_marks ? 'text-emerald-700' : 'text-slate-600'}>
                                  Net Score: {q.awarded_marks}/{q.max_marks} M
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {q.marks_deduction_reason ? q.marks_deduction_reason : 'Completed according to official board benchmark standards.'}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Points breakdown: Correct vs Missing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Correct points */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Valid Points & Steps Awarded
                          </span>
                          {q.correct_points && q.correct_points.length > 0 ? (
                            <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside font-medium">
                              {q.correct_points.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No valid conceptual points found.</p>
                          )}
                        </div>

                        {/* Missing points */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Missing Points & Key Gaps
                          </span>
                          {q.missing_points && q.missing_points.length > 0 ? (
                            <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside font-medium">
                              {q.missing_points.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-emerald-600 font-bold">All essential points covered!</p>
                          )}
                        </div>

                      </div>

                      {/* Teacher Feedback & Improvement Tip */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Teacher's Commentary
                          </span>
                          <p className="text-xs text-slate-700 italic leading-relaxed">
                            "{q.teacher_feedback}"
                          </p>
                        </div>

                        {/* Dispute Record if previously rechecked */}
                        {q.recheck_response && (
                          <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            q.recheck_status === 'ACCEPTED' 
                              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' 
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}>
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1.5">
                                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                                Re-evaluation Verdict:
                              </span>
                              {q.recheck_delta && q.recheck_delta > 0 ? (
                                <span className="font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 text-[11px]">
                                  +{q.recheck_delta} Marks Credited
                                </span>
                              ) : (
                                <span className="text-slate-500 font-semibold text-[11px]">Score Maintained</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600">
                              <strong className="text-slate-700">Student Claim:</strong> "{q.recheck_argument}"
                            </p>
                            <p className="font-medium pt-1.5 border-t border-gray-200/70 text-slate-800">
                              <strong className="text-indigo-900">Examiner's Ruling:</strong> {q.recheck_response}
                            </p>
                          </div>
                        )}

                        {q.improvement_tip && (
                          <div className="pt-2 border-t border-gray-100 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/50 p-2.5 rounded-xl">
                            <span className="font-bold text-indigo-700 shrink-0">💡 Full Mark Tip:</span>
                            <span>{q.improvement_tip}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              onAskQuestionInChat(q.question_id, `Explain why I lost marks in ${q.question_id} and how I can write the full-mark answer for: "${q.question_text}"`);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors border border-emerald-200 cursor-pointer"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>Ask AI Tutor About {q.question_id}</span>
                          </button>

                          <button
                            onClick={() => setDisputeQuestion(q)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors border border-indigo-200 shadow-2xs cursor-pointer"
                            title="Challenge marks or explain OCR / pen scratch / omitted working notes to the Senior Examiner"
                          >
                            <Scale className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Challenge / Recheck with Teacher</span>
                            {q.recheck_status === 'ACCEPTED' && q.recheck_delta && q.recheck_delta > 0 && (
                              <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-full ml-1">
                                +{q.recheck_delta}
                              </span>
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() => setReviewingQuestion(q)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-gray-100 px-3.5 py-2 rounded-xl border border-gray-200 transition-colors shadow-xs cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Teacher Score Override / Edit</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: PERFORMANCE DIAGNOSTICS */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-6">
          
          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Identified Strengths & Mastery Areas</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800">
                {evaluation.performance_analysis?.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Key Weaknesses & Knowledge Gaps</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800">
                {evaluation.performance_analysis?.weaknesses?.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-50/60 p-3 rounded-xl border border-rose-100 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Topic Breakdown & Marks Loss */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Topic Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>Topic-Wise Score Breakdown</span>
              </div>
              
              <div className="space-y-3">
                {evaluation.performance_analysis?.topic_breakdown?.map((topic, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800">{topic.topic}</span>
                      <span className="text-gray-500">{topic.obtained_marks} / {topic.max_marks} ({topic.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          topic.percentage >= 75 ? 'bg-emerald-500' : topic.percentage >= 50 ? 'bg-indigo-600' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, topic.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marks Loss Summary */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Where Marks Were Lost (Root Causes)</span>
              </div>

              <div className="space-y-2.5">
                {evaluation.performance_analysis?.marks_loss_summary?.map((loss, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{loss.category}</span>
                      <span className="text-rose-600">-{loss.marks_lost} Marks</span>
                    </div>
                    <p className="text-gray-500 text-[11px]">{loss.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Teacher's Overall Feedback & Study Plan */}
          <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Senior Examiner's Comprehensive Feedback</span>
              </div>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                {evaluation.performance_analysis?.teacher_overall_feedback}
              </p>
            </div>

            {/* Actionable Study Plan */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Recommended Study & Revision Strategy:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {evaluation.performance_analysis?.recommended_study_plan?.map((step, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-xs text-white space-y-1">
                    <span className="font-black text-indigo-400">Step 0{idx + 1}</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 0: SPLIT-SCREEN EXAMINER STATION (LEFT VS RIGHT DUAL PANE) */}
      {activeSubTab === 'station' && (
        <SplitScreenExaminerStation
          evaluation={evaluation}
          sources={sources}
          onDownloadPDF={handleExportPDF}
          onPrint={handlePrint}
        />
      )}

      {/* SUB-TAB 3: CERTIFIED EVALUATED COPY (REAL TEACHER RED-PEN BOOKLET) */}
      {activeSubTab === 'certified' && (
        <CertifiedEvaluatedCopyView
          evaluation={evaluation}
          sources={sources}
          onDownloadPDF={handleExportPDF}
          onPrint={handlePrint}
        />
      )}

      {/* SUB-TAB 4: FULL PRINTABLE REPORT */}
      {activeSubTab === 'report' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Document</span>
            </button>
          </div>

          <PrintableReport evaluation={evaluation} sources={sources} />
        </div>
      )}

      {/* Human Review Modal */}
      {reviewingQuestion && (
        <HumanReviewModal
          question={reviewingQuestion}
          isOpen={Boolean(reviewingQuestion)}
          onClose={() => setReviewingQuestion(null)}
          onSave={handleSaveQuestionReview}
        />
      )}

      {/* Recheck / Teacher Dispute Modal */}
      {disputeQuestion && (
        <RecheckDisputeModal
          question={disputeQuestion}
          isOpen={Boolean(disputeQuestion)}
          onClose={() => setDisputeQuestion(null)}
          onRecheckSuccess={handleDisputeSuccess}
          journey={evaluation.journey}
          subject={evaluation.subject}
          chapter={evaluation.chapter}
        />
      )}

      {/* 2-Tap Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        evaluation={evaluation}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

    </div>
  );
};
