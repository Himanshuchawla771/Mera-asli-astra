import React from 'react';
import { 
  Upload, 
  Sparkles, 
  Library, 
  Bot, 
  Award, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen,
  HelpCircle,
  BarChart3,
  Clock,
  ChevronRight,
  Plus,
  AlertTriangle,
  GraduationCap,
  Footprints,
  ShieldCheck,
  Smartphone,
  Download,
  Building2,
  Layers,
  FolderUp
} from 'lucide-react';
import { EvaluationResult, ReferenceSource, ActiveTab, AcademicJourney, UserProfile } from '../types';
import { SAMPLE_EXAMS, SampleExam } from '../data/sampleExams';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { computeLongTermAnalysis } from '../utils/storage';
import { triggerPwaInstallPrompt } from '../utils/pwaHelper';

interface DashboardViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (j: AcademicJourney) => void;
  evaluations: EvaluationResult[];
  sources: ReferenceSource[];
  activeProfile?: UserProfile | null;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectEvaluation: (evalResult: EvaluationResult) => void;
  onLoadSampleExam: (sample: SampleExam) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentJourney,
  setCurrentJourney,
  evaluations,
  sources,
  activeProfile,
  setActiveTab,
  onSelectEvaluation,
  onLoadSampleExam
}) => {
  const isCoachingAuthorized = Boolean(
    (activeProfile?.role === 'coaching_partner' && (activeProfile?.approvalStatus === 'approved' || !activeProfile?.approvalStatus)) ||
    activeProfile?.role === 'teacher_admin' ||
    activeProfile?.email === 'himanshuch492@gmail.com' ||
    activeProfile?.email === 'admin@studymentor.edu' ||
    activeProfile?.hasInspectorPrivilege
  );

  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];
  
  // Filter evaluations for current journey
  const journeyEvaluations = evaluations.filter(e => e.journey === currentJourney);
  const journeySources = sources.filter(s => s.journey === currentJourney);
  const activeSourcesCount = journeySources.filter(s => s.isActive).length;

  // Real computed analytics
  const analysisData = computeLongTermAnalysis(currentJourney);
  const totalTests = journeyEvaluations.length;
  const avgPercentage = totalTests > 0 ? analysisData.averagePercentage : 0;

  // Filter sample exams matching current journey
  const matchingSampleExams = SAMPLE_EXAMS.filter(s => s.journey === currentJourney);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Welcome & Journey Switcher Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
        <div className="pl-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200/80 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              {journeyDef.title}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Certified Examiner Workspace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Classroom &amp; Exam Answer Evaluation System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official curriculum step-marking and handwriting annotation engine for {journeyDef.subjects.map(s => s.name).join(', ')}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100/90 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setCurrentJourney('CLASS_12')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CLASS_12'
                  ? 'bg-white text-blue-950 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class 12 CBSE
            </button>
            <button
              onClick={() => setCurrentJourney('CA_FOUNDATION')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CA_FOUNDATION'
                  ? 'bg-white text-blue-950 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CA Foundation ICAI
            </button>
            <button
              onClick={() => setCurrentJourney('CA_INTERMEDIATE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CA_INTERMEDIATE'
                  ? 'bg-white text-blue-950 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CA Intermediate ICAI
            </button>
            <button
              onClick={() => setCurrentJourney('CA_FINAL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CA_FINAL'
                  ? 'bg-purple-700 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CA Final ICAI
            </button>
            <button
              onClick={() => setCurrentJourney('NEET')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'NEET'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NEET (UG)
            </button>
            <button
              onClick={() => setCurrentJourney('JEE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'JEE'
                  ? 'bg-amber-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JEE (Main & Adv)
            </button>
            <button
              onClick={() => setCurrentJourney('CUET')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CUET'
                  ? 'bg-violet-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CUET (UG)
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Top Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Primary Upload Bento Card (Span 8) */}
        <section className="md:col-span-8 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.06)] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-900 text-xs font-bold mb-2 border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Multimodal Vision &amp; OCR Step Marking</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Upload Student Answer Sheet
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mb-6 leading-relaxed">
            Drop question papers and handwritten copies in PDF or image format. The engine matches answers, applies examiner rubrics, and creates a certified checked copy with marks breakdown.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              id="bento-start-eval-btn"
              onClick={() => setActiveTab('evaluate')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Start Evaluation</span>
            </button>
            <button
              id="bento-walk-revise-btn"
              onClick={() => setActiveTab('walk-and-revise')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm shadow-emerald-600/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Footprints className="w-4 h-4" />
              <span>Walk &amp; Revise Drill</span>
            </button>
            <button
              id="bento-browse-sources-btn"
              onClick={() => setActiveTab('sources')}
              className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Library className="w-4 h-4 text-slate-500" />
              <span>Sources ({activeSourcesCount} Active)</span>
            </button>
            <button
              id="bento-install-app-btn"
              onClick={() => triggerPwaInstallPrompt()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-xs active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
              title="Install App on device"
            >
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Install App</span>
            </button>
          </div>
        </section>

        {/* Source Library Bento Card (Span 4) */}
        <section className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
                <Library className="w-4 h-4 text-indigo-600" />
                <span>Isolated Sources ({journeyDef.badge})</span>
              </h3>
              <button 
                onClick={() => setActiveTab('sources')}
                className="text-indigo-600 text-xs font-semibold hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </button>
            </div>
            
            <div className="space-y-2.5">
              {journeySources.slice(0, 3).map((source) => (
                <div 
                  key={source.id} 
                  onClick={() => setActiveTab('sources')}
                  className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 flex items-center gap-3 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-slate-200 text-slate-700">
                    <BookOpen className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{source.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{source.subject} • {source.category}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${source.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{activeSourcesCount} active for grading</span>
            <button 
              onClick={() => setActiveTab('sources')}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              View all ({journeySources.length}) →
            </button>
          </div>
        </section>

      </div>

      {/* B2B Coaching Partner or Student Practice Booster Callout */}
      {isCoachingAuthorized ? (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Institutional B2B Pipeline
              </span>
              <span className="text-xs text-slate-400 font-semibold">• For Coaching Institutes &amp; Academies</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              Bulk Answer Sheet Ingestion &amp; Master Class Ledger
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Configure Master Question Papers with step-wise marking rubrics, upload 50-student scanned bundles with AI auto-segregation, and view class rank scorecards.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('coaching')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open Coaching Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Footprints className="w-3 h-3" />
                Zero-Pen AI Voice Drills
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Walk &amp; Revise Mode</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              Hands-Free Rapid Voice Practice &amp; Podcast Revisions
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Practice past 10-year exam questions speaking your answers aloud with live speech recognition, multi-speed audio feedback, and instant step grading.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('walk-and-revise')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Start Voice Revision</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Realistic Sample Papers Quick Launch (Class 12 & CA Foundation) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Realistic Sample Exam Papers ({journeyDef.badge})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an authentic exam blueprint to test step-wise evaluation and rubrics instantly
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchingSampleExams.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onLoadSampleExam(sample)}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-400/80 hover:bg-slate-50/50 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase tracking-wider border border-slate-200">
                    {sample.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {sample.totalMarks} Marks
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-slate-900 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                <span>Evaluate this paper →</span>
                <span className="text-[11px] text-slate-400 font-normal">{sample.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Concept Gap Quick Summary Bento */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Longitudinal KPI Summary (Span 4) */}
        <section className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cumulative Accuracy</span>
            <div className="mt-2.5 flex items-baseline gap-2.5">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {totalTests > 0 ? `${avgPercentage}%` : '—'}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                ({analysisData.totalMarksAwarded}/{analysisData.totalMaxMarks} Marks)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Across {totalTests} evaluated {journeyDef.title} papers.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('analysis')}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Open Mistake Analysis &amp; Trajectory →</span>
          </button>
        </section>

        {/* Concept Gaps Alert (Span 8) */}
        <section className="md:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Concept Gap Alerts &amp; Recurring Deductions</span>
              </h3>
              <span className="text-xs text-slate-400">
                {analysisData.conceptGaps.length} flagged
              </span>
            </div>

            {analysisData.conceptGaps.length > 0 ? (
              <div className="space-y-2">
                {analysisData.conceptGaps.slice(0, 2).map((gap, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{gap.concept} ({gap.subject})</span>
                      <span className="text-rose-600 text-[11px] font-bold">{gap.occurrences}x errors</span>
                    </div>
                    <p className="text-[11px] text-amber-900/80">{gap.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                {totalTests > 0 
                  ? 'No recurring concept gaps detected yet. Great progress!' 
                  : 'Evaluate your first answer sheet to activate concept gap detection.'}
              </div>
            )}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Omission errors logged: <strong className="text-slate-800 font-semibold">{analysisData.omissionErrorsCount}</strong>
            </span>
            <button 
              onClick={() => setActiveTab('analysis')}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              View detailed mistake breakdown →
            </button>
          </div>
        </section>

      </div>

      {/* Recent Evaluations Table */}
      {journeyEvaluations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Recent {journeyDef.title} Evaluated Papers</span>
            </h3>
            <button 
              onClick={() => setActiveTab('history')}
              className="text-indigo-600 text-xs font-semibold hover:underline cursor-pointer"
            >
              View all history →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Test Title</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Percentage</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {journeyEvaluations.slice(0, 5).map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 max-w-xs truncate">{ev.test_title}</td>
                    <td className="py-3">{ev.subject}</td>
                    <td className="py-3 font-semibold text-slate-900">{ev.total_obtained_marks} / {ev.total_max_marks}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        ev.percentage >= 75 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        ev.percentage >= 40 ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {ev.percentage}%
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(ev.evaluated_at).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectEvaluation(ev)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md border border-slate-200 transition-colors cursor-pointer"
                      >
                        View Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
