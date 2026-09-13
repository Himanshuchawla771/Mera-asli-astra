import React, { useState } from 'react';
import { 
  History, 
  TrendingUp, 
  Award, 
  Search, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  BarChart3, 
  FileText, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EvaluationResult, ActiveTab } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

interface TestHistoryViewProps {
  evaluations: EvaluationResult[];
  onSelectEvaluation: (result: EvaluationResult) => void;
  onDeleteEvaluation: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TestHistoryView: React.FC<TestHistoryViewProps> = ({
  evaluations,
  onSelectEvaluation,
  onDeleteEvaluation,
  setActiveTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [pendingDeleteEval, setPendingDeleteEval] = useState<EvaluationResult | null>(null);

  // Compute trend statistics
  const totalCount = evaluations.length;
  const avgPercentage = totalCount > 0
    ? Math.round(evaluations.reduce((sum, e) => sum + e.percentage, 0) / totalCount)
    : 0;

  // Trend analysis (compare latest vs earlier)
  let trendStatus = 'Consistent';
  if (evaluations.length >= 2) {
    const latest = evaluations[0].percentage;
    const previous = evaluations[1].percentage;
    if (latest > previous + 3) trendStatus = 'Improving ↗';
    else if (latest < previous - 3) trendStatus = 'Declining ↘';
    else trendStatus = 'Consistent ➔';
  }

  // Prepare chart data (in chronological order)
  const chartData = [...evaluations].reverse().map((e, idx) => ({
    name: `Test ${idx + 1}`,
    title: e.test_title,
    date: new Date(e.evaluated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: e.percentage,
    obtained: e.total_obtained_marks,
    max: e.total_max_marks,
    subject: e.subject
  }));

  // Unique subjects for filter
  const subjects = ['All', ...Array.from(new Set(evaluations.map(e => e.subject).filter(Boolean)))];

  const filteredEvaluations = evaluations.filter(e => {
    const matchesSearch = e.test_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || e.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Bento Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                Performance Analytics & Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <History className="w-7 h-7 text-indigo-600" />
              <span>Test History & Score Trends</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
              Track student evaluation trajectories, subject mastery curves, recurring error reductions, and historical test reports over time.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('evaluate')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 self-start sm:self-auto cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Evaluate New Paper</span>
          </button>
        </div>

        {/* Top Metric Bento Tiles */}
        {evaluations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Total Tests Evaluated</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalCount}</span>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">Overall Mean Score</span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{avgPercentage}%</span>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-center">
              <span className="text-[11px] text-blue-800 font-bold uppercase tracking-wider block">Trajectory Trend</span>
              <span className="text-2xl font-extrabold text-blue-900 mt-1 block">{trendStatus}</span>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Chart if 2+ evaluations */}
      {evaluations.length >= 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Percentage Score Progression Over Time</span>
              </h3>
              <p className="text-xs text-slate-500">Historical performance trend across consecutive assessments</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', padding: '10px 14px' }}
                  formatter={(val: any) => [`${val}%`, 'Score']}
                  labelFormatter={(idx: any, payload: any) => payload?.[0]?.payload?.title || idx}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 7 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter & Search Bar Bento */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past evaluations by title or subject..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 text-slate-900"
          />
        </div>

        {/* Subject filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredEvaluations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No Evaluation Records Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Evaluated tests and question papers will appear here automatically with full score history and diagnostics.
            </p>
          </div>
        ) : (
          filteredEvaluations.map((evalResult) => {
            const isDistinction = evalResult.percentage >= 75;
            const isPassed = evalResult.percentage >= 40;

            return (
              <div
                key={evalResult.id}
                onClick={() => onSelectEvaluation(evalResult)}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.08)] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 uppercase tracking-wider">
                      {evalResult.subject || 'General'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(evalResult.evaluated_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-400">• {evalResult.questions?.length || 0} Questions</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {evalResult.test_title}
                  </h3>

                  {evalResult.performance_analysis?.teacher_overall_feedback && (
                    <p className="text-xs text-slate-500 line-clamp-1 italic">
                      &ldquo;{evalResult.performance_analysis.teacher_overall_feedback}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">
                      {evalResult.total_obtained_marks} <span className="text-xs text-slate-400 font-normal">/ {evalResult.total_max_marks}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isDistinction 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : isPassed 
                        ? 'bg-blue-50 text-blue-800 border-blue-200' 
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {evalResult.percentage}% Score
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteEval(evalResult);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete record (Requires Confirmation)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2-Tap Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(pendingDeleteEval)}
        evaluation={pendingDeleteEval}
        onConfirm={() => {
          if (pendingDeleteEval) {
            onDeleteEvaluation(pendingDeleteEval.id);
            setPendingDeleteEval(null);
          }
        }}
        onCancel={() => setPendingDeleteEval(null)}
      />

    </div>
  );
};
