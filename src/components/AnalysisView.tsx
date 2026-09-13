import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  Target, 
  Flame, 
  Sparkles,
  Layers,
  GraduationCap,
  ArrowRight,
  ShieldAlert,
  Zap,
  HelpCircle,
  BookOpen,
  Filter,
  CheckCircle,
  FileQuestion,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { AcademicJourney, LongTermAnalysisData, EvaluationResult } from '../types';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { computeLongTermAnalysis, toggleEvaluationAnalysisInclusion } from '../utils/storage';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AnalysisViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (journey: AcademicJourney) => void;
  evaluations: EvaluationResult[];
  activeUserId?: string;
  onStartPracticeTest?: (
    subject: string, 
    chapter: string, 
    weakTopics?: string[], 
    customInstructions?: string, 
    autoGenerate?: boolean
  ) => void;
  onAskTutor?: (prompt: string) => void;
  onDeleteEvaluation?: (id: string) => void;
  onSelectEvaluation?: (result: EvaluationResult) => void;
}

type ChapterFilterTab = 'all' | 'weak' | 'moderate' | 'strong' | 'curriculum';

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  currentJourney,
  setCurrentJourney,
  evaluations,
  activeUserId,
  onStartPracticeTest,
  onAskTutor,
  onDeleteEvaluation,
  onSelectEvaluation
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [chapterFilter, setChapterFilter] = useState<ChapterFilterTab>('all');
  const [pendingDeleteEval, setPendingDeleteEval] = useState<EvaluationResult | null>(null);
  const [, setRefreshTick] = useState(0);

  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];

  // Reset filter when journey switches
  useEffect(() => {
    setSelectedSubject('All');
    setChapterFilter('all');
  }, [currentJourney]);
  const analysisData: LongTermAnalysisData = computeLongTermAnalysis(currentJourney, selectedSubject, activeUserId);

  const handleToggleInclusion = (eId: string, currentStatus: boolean) => {
    toggleEvaluationAnalysisInclusion(eId, !currentStatus, activeUserId);
    setRefreshTick(t => t + 1);
  };

  const subjectsList = ['All', ...journeyDef.subjects.map(s => s.name)];

  // Prepare chart data for chapter performance
  const chapterEntries = Object.entries(analysisData.chapterPerformance).map(([chName, stats]) => ({
    name: chName.length > 24 ? `${chName.substring(0, 24)}...` : chName,
    fullName: chName,
    percentage: stats.percentage,
    subject: stats.subject,
    testsCount: stats.count,
    status: stats.status,
    weakTopics: stats.weakTopics,
    mistakeSummary: stats.mistakeSummary,
    totalMax: stats.totalMax,
    totalObtained: stats.totalObtained,
    suggestedQuestionsCount: stats.suggestedQuestionsCount
  })).sort((a, b) => a.percentage - b.percentage); // Ascending order so weakest are first!

  // Prepare chart data for subject performance
  const subjectChartData = Object.entries(analysisData.subjectPerformance).map(([sName, stats]) => ({
    subject: sName,
    percentage: stats.percentage,
    testsCount: stats.count,
    obtained: stats.totalObtained,
    max: stats.totalMax
  }));

  // Mistake types distribution
  const recurringMistakesList = Object.entries(analysisData.recurringMistakes)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a);

  // Filtered chapters according to selected tab
  const weakChapters = chapterEntries.filter(c => c.status === 'Weak');
  const moderateChapters = chapterEntries.filter(c => c.status === 'Moderate');
  const strongChapters = chapterEntries.filter(c => c.status === 'Strong');

  // Full curriculum chapters with evaluated vs untested status
  const currentSubjectObj = selectedSubject !== 'All' 
    ? journeyDef.subjects.find(s => s.name === selectedSubject)
    : null;

  const curriculumChaptersList: Array<{ subject: string; chapter: string; evaluated: boolean; stats?: any }> = [];
  
  const subjectsToScan = currentSubjectObj ? [currentSubjectObj] : journeyDef.subjects;
  for (const s of subjectsToScan) {
    for (const ch of s.chapters) {
      const stats = analysisData.chapterPerformance[ch];
      curriculumChaptersList.push({
        subject: s.name,
        chapter: ch,
        evaluated: Boolean(stats),
        stats: stats || null
      });
    }
  }

  // Active list to show in matrix
  let displayedChapters = chapterEntries;
  if (chapterFilter === 'weak') displayedChapters = weakChapters;
  else if (chapterFilter === 'moderate') displayedChapters = moderateChapters;
  else if (chapterFilter === 'strong') displayedChapters = strongChapters;

  // Aggregate all unique weak topics across the syllabus for 1-click comprehensive remedial test
  const allWeakTopicsList: Array<{ subject: string; chapter: string; topic: string }> = [];
  for (const c of chapterEntries) {
    for (const wt of c.weakTopics) {
      if (!allWeakTopicsList.some(item => item.topic.toLowerCase() === wt.toLowerCase())) {
        allWeakTopicsList.push({
          subject: c.subject,
          chapter: c.fullName,
          topic: wt
        });
      }
    }
  }

  // Handle instant generation of comprehensive remedial test across all weak areas
  const handleGenerateAllWeakTopicsTest = () => {
    if (allWeakTopicsList.length === 0) {
      // If no weak topics recorded yet, use first subject
      const defaultSub = journeyDef.subjects[0]?.name || 'Accountancy';
      const defaultCh = journeyDef.subjects[0]?.chapters[0] || 'Fundamentals of Partnership';
      onStartPracticeTest?.(
        defaultSub, 
        defaultCh, 
        ['Core High-Yield Concepts'], 
        `Diagnostic assessment covering essential board exam questions for ${defaultCh}.`,
        true
      );
      return;
    }

    const primarySubject = weakChapters[0]?.subject || allWeakTopicsList[0]?.subject || journeyDef.subjects[0].name;
    const primaryChapter = weakChapters[0]?.fullName || allWeakTopicsList[0]?.chapter || journeyDef.subjects[0].chapters[0];
    const weakTopicNames = allWeakTopicsList.map(w => w.topic);

    const customPrompt = `Generate a Comprehensive AI Remedial Test targeting the student's recorded weak topics across ${primarySubject}: ${weakTopicNames.slice(0, 5).join(', ')}. Include realistic board examination questions, numericals with working note allocations, and strict step-marking schemes.`;

    onStartPracticeTest?.(
      primarySubject,
      primaryChapter,
      weakTopicNames,
      customPrompt,
      true
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Journey Selector */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              Long-Term Learning Database
            </span>
            <span className="text-xs text-gray-400 font-medium">• Diagnostic Intelligence & AI Remedial Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Chapter Strength Analysis & Weak-Topic Test Generator
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Automatically categorizes your mastery into Strong, Moderate, and Weak chapters based on evaluation history. Generate instant AI diagnostic tests targeting your specific mistake patterns.
          </p>
        </div>

        {/* Academic Journey Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
            <button
              onClick={() => {
                setCurrentJourney('CLASS_12');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CLASS_12'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              12th Commerce
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CLASS_12_SCIENCE');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CLASS_12_SCIENCE'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              12th Science
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CLASS_12_ARTS');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CLASS_12_ARTS'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              12th Arts
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CLASS_11_SCIENCE');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CLASS_11_SCIENCE'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              11th Science
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CLASS_11_COMMERCE');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CLASS_11_COMMERCE'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              11th Commerce
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CLASS_11_ARTS');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CLASS_11_ARTS'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              11th Arts
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CA_FOUNDATION');
                setSelectedSubject('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentJourney === 'CA_FOUNDATION'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              CA Foundation
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CA_INTERMEDIATE');
                setSelectedSubject('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CA_INTERMEDIATE'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              CA Intermediate
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CA_FINAL');
                setSelectedSubject('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CA_FINAL'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              CA Final ICAI
            </button>
            <button
              onClick={() => {
                setCurrentJourney('NEET');
                setSelectedSubject('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'NEET'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              NEET (UG)
            </button>
            <button
              onClick={() => {
                setCurrentJourney('JEE');
                setSelectedSubject('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'JEE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              JEE (Main & Adv)
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CUET');
                setSelectedSubject('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentJourney === 'CUET'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              CUET (UG)
            </button>
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-slate-800 shadow-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {subjectsList.map(s => (
              <option key={s} value={s}>{s === 'All' ? `All ${journeyDef.title} Subjects` : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Strong Chapters */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Strong Chapters</p>
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{analysisData.strongChaptersCount}</span>
            <span className="text-xs text-gray-400 font-medium">mastered (&gt;=75%)</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>Solid concept recall &amp; presentation</span>
          </div>
        </div>

        {/* Moderate Chapters */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Moderate Chapters</p>
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600">{analysisData.moderateChaptersCount}</span>
            <span className="text-xs text-gray-400 font-medium">needs review (50-74%)</span>
          </div>
          <div className="mt-3 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <span>Minor omission or speed slips</span>
          </div>
        </div>

        {/* Weak Chapters */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Weak Chapters</p>
            <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600">{analysisData.weakChaptersCount}</span>
            <span className="text-xs text-gray-400 font-medium">action required (&lt;50%)</span>
          </div>
          <div className="mt-3 text-[11px] text-rose-700 font-semibold flex items-center gap-1">
            <span>Highest priority for remedial tests</span>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cumulative Score</p>
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${
              analysisData.averagePercentage >= 75 ? 'text-emerald-600' :
              analysisData.averagePercentage >= 50 ? 'text-amber-600' : 'text-slate-900'
            }`}>
              {analysisData.totalEvaluations > 0 ? `${analysisData.averagePercentage}%` : '—'}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              ({analysisData.totalMarksAwarded}/{analysisData.totalMaxMarks} Marks)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <span>Across {analysisData.totalEvaluations} checked papers</span>
          </div>
        </div>

      </div>

      {/* Prominent Smart Remedial Drill Station Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-indigo-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>AI Weak-Topic Diagnostic Test Engine</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {allWeakTopicsList.length > 0 
                ? `Target & Fix ${allWeakTopicsList.length} Identified Weak Concepts with AI Drills`
                : `Generate Targeted Examination Drills on Any Chapter`
              }
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {allWeakTopicsList.length > 0
                ? `We analyzed your step-wise marks and found specific weak spots (${allWeakTopicsList.slice(0, 3).map(w => `"${w.topic}"`).join(', ')}${allWeakTopicsList.length > 3 ? '...' : ''}). Click below to generate a tailored diagnostic paper with model answers and marking rubrics.`
                : `Continuous diagnostic evaluation will automatically extract your mistake patterns here. You can also generate practice test papers for any syllabus chapter right away.`
              }
            </p>

            {/* Quick weak topic chips preview */}
            {allWeakTopicsList.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {allWeakTopicsList.slice(0, 5).map((wt, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 text-[11px] font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>{wt.topic}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleGenerateAllWeakTopicsTest}
              className="px-5 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Weak-Topics Test Paper</span>
            </button>

            {onAskTutor && (
              <button
                onClick={() => {
                  const weakNames = allWeakTopicsList.map(w => w.topic).slice(0, 4).join(', ');
                  onAskTutor(
                    weakNames 
                      ? `Can you explain these specific weak concepts step-by-step with exam tips so I don't lose marks: ${weakNames}?`
                      : `Give me a structured revision guide for the most important scoring concepts in ${journeyDef.title}.`
                  );
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Explain Weak Topics in AI Tutor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Analysis Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Chapter Strength Matrix & Drill Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chapter Strength Matrix Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>Chapter Strength & Weakness Matrix</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Detailed diagnostics with 1-click AI Remedial Question Generator
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                <button
                  onClick={() => setChapterFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    chapterFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  All Tested ({chapterEntries.length})
                </button>
                <button
                  onClick={() => setChapterFilter('weak')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    chapterFilter === 'weak'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Weak ({weakChapters.length})</span>
                </button>
                <button
                  onClick={() => setChapterFilter('moderate')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    chapterFilter === 'moderate'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  Moderate ({moderateChapters.length})
                </button>
                <button
                  onClick={() => setChapterFilter('strong')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    chapterFilter === 'strong'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Strong ({strongChapters.length})
                </button>
                <button
                  onClick={() => setChapterFilter('curriculum')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    chapterFilter === 'curriculum'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-indigo-800 hover:bg-indigo-50'
                  }`}
                >
                  All Syllabus
                </button>
              </div>
            </div>

            {/* If in Standard Filter Mode (Tested Chapters) */}
            {chapterFilter !== 'curriculum' && (
              <div className="space-y-4">
                {displayedChapters.length > 0 ? (
                  displayedChapters.map((ch, idx) => (
                    <div 
                      key={idx}
                      className={`p-5 rounded-3xl border transition-all ${
                        ch.status === 'Weak' 
                          ? 'bg-rose-50/40 border-rose-200/70 hover:border-rose-300' 
                          : ch.status === 'Moderate'
                          ? 'bg-amber-50/40 border-amber-200/70 hover:border-amber-300'
                          : 'bg-emerald-50/30 border-emerald-200/70 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-gray-200 text-slate-700 shadow-2xs">
                              {ch.subject}
                            </span>
                            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              ch.status === 'Weak' ? 'bg-rose-100 text-rose-800' :
                              ch.status === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {ch.status === 'Weak' && <AlertTriangle className="w-3 h-3" />}
                              {ch.status === 'Moderate' && <Zap className="w-3 h-3" />}
                              {ch.status === 'Strong' && <CheckCircle className="w-3 h-3" />}
                              <span>{ch.status === 'Weak' ? 'Weak Chapter (High Priority)' : ch.status === 'Moderate' ? 'Moderate (Needs Polish)' : 'Strong (Mastered)'}</span>
                            </span>
                          </div>
                          
                          <h4 className="text-base font-bold text-slate-900 mt-2">
                            {ch.fullName}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Attempted in <strong className="text-slate-800">{ch.testsCount}</strong> questions • Scored <strong className="text-slate-800">{ch.totalObtained} / {ch.totalMax}</strong> marks
                          </p>
                        </div>

                        {/* Accuracy Percentage Box */}
                        <div className="text-right shrink-0">
                          <div className={`text-2xl font-black ${
                            ch.percentage >= 75 ? 'text-emerald-600' :
                            ch.percentage >= 50 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {ch.percentage}%
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">accuracy</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200/80 h-2.5 rounded-full overflow-hidden mt-3">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            ch.percentage >= 75 ? 'bg-emerald-500' :
                            ch.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${ch.percentage}%` }}
                        />
                      </div>

                      {/* Specific Weak Sub-Topics / Error Patterns */}
                      {ch.weakTopics.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-gray-200/60 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Identified Sub-Topics Where Marks Were Lost:</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {ch.weakTopics.map((topicName, tidx) => (
                              <span key={tidx} className="px-2.5 py-0.5 rounded-md bg-white border border-rose-200 text-rose-900 text-[11px] font-medium shadow-2xs">
                                {topicName}
                              </span>
                            ))}
                          </div>

                          {/* Specific mistake reasons if present */}
                          {ch.mistakeSummary.length > 0 && (
                            <p className="text-[11px] text-gray-600 italic mt-1 line-clamp-2">
                              Feedback: "{ch.mistakeSummary[0]}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Drill Buttons */}
                      <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onStartPracticeTest?.(
                                ch.subject,
                                ch.fullName,
                                ch.weakTopics,
                                `Diagnostic test on "${ch.fullName}" focusing on student's weak sub-topics: ${ch.weakTopics.join(', ')}. Include 4 standard examination questions with full step-marking schemes.`,
                                true
                              );
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              ch.status === 'Weak' 
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : ch.status === 'Moderate'
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>
                              {ch.status === 'Weak' ? 'Generate AI Weak-Topic Drill' : 'Generate Practice Test'}
                            </span>
                          </button>

                          {onAskTutor && (
                            <button
                              onClick={() => {
                                onAskTutor(
                                  `Please teach me the most challenging concepts in "${ch.fullName}" (${ch.subject}), focusing particularly on: ${ch.weakTopics.join(', ') || 'key exam scoring areas'}.`
                                );
                              }}
                              className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Clarify with AI Tutor</span>
                            </button>
                          )}
                        </div>

                        <span className="text-[11px] text-gray-500 font-medium">
                          Suggested Drill: <strong>{ch.suggestedQuestionsCount} Qs</strong>
                        </span>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-3xl bg-gray-50 text-center border border-dashed border-gray-200 space-y-2">
                    <p className="text-xs font-bold text-slate-800">
                      No chapters matching "{chapterFilter.toUpperCase()}" filter.
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Switch filters or upload evaluated answer sheets to populate diagnostics.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* If in Full Curriculum Syllabus Mode */}
            {chapterFilter === 'curriculum' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  Complete official syllabus coverage for {selectedSubject === 'All' ? journeyDef.title : selectedSubject}. Click "Take Diagnostic Test" to test any unattempted chapter.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {curriculumChaptersList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-indigo-300 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-slate-700">
                            {item.subject}
                          </span>
                          {item.evaluated ? (
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              item.stats?.status === 'Weak' ? 'bg-rose-100 text-rose-800' :
                              item.stats?.status === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.stats?.percentage}% • {item.stats?.status}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              Not Attempted
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-2">
                          {item.chapter}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            onStartPracticeTest?.(
                              item.subject,
                              item.chapter,
                              item.stats?.weakTopics || ['Comprehensive Syllabus Assessment'],
                              `Standard examination question paper for ${item.chapter} (${item.subject}). Include numericals & case studies with step marking rubrics.`,
                              true
                            );
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{item.evaluated ? 'Generate Practice Test' : 'Take Diagnostic Test'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Longitudinal Progress Chart (Section 31) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>Longitudinal Score Progress Trajectory</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chronological percentage trajectory across evaluated papers in {journeyDef.title}
                </p>
              </div>
            </div>

            {analysisData.trajectory.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData.trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '16px', fontSize: '12px' }}
                      formatter={(value: any) => [`${value}%`, 'Score']}
                      labelFormatter={(label, payload) => payload[0]?.payload?.title || label}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#4F46E5', stroke: '#FFF', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-medium">No evaluation records yet for this filter.</p>
                <p className="text-[11px] text-gray-400 mt-1">Upload and evaluate answer sheets to populate performance curves.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Concept Gaps & Recurring Mistakes */}
        <div className="space-y-6">
          
          {/* Concept Gap Warning Banners (Section 28) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Flagged Concept Gaps (2+ Repeats)</span>
            </h3>
            <p className="text-xs text-gray-500">
              Evidence-based weaknesses that have recurred across multiple evaluations
            </p>

            <div className="space-y-3 pt-2">
              {analysisData.conceptGaps.length > 0 ? (
                analysisData.conceptGaps.map((gap, idx) => (
                  <div 
                    key={idx}
                    className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl space-y-2.5 relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                          {gap.subject} • {gap.chapter}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {gap.concept}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black shrink-0">
                        {gap.occurrences}x Deductions
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-950/80 leading-relaxed">
                      {gap.recommendation}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onStartPracticeTest?.(
                            gap.subject,
                            gap.chapter,
                            [gap.concept],
                            `Generate 3 targeted practice questions on "${gap.concept}" in ${gap.chapter} (${gap.subject}) to eliminate recurring misconceptions.`,
                            true
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>AI Drill on this Gap</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-gray-50 text-center text-xs text-gray-500">
                  No multi-test repeated concept gaps detected yet.
                </div>
              )}
            </div>
          </div>

          {/* Recurring Mistakes Bento (Section 25) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Recurring Mistake Types</span>
            </h3>
            <p className="text-xs text-gray-500">
              Aggregated frequency of specific deduction categories across papers
            </p>

            <div className="space-y-3 pt-2">
              {recurringMistakesList.length > 0 ? (
                recurringMistakesList.map(([category, count]) => (
                  <div key={category} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{category}</span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold">
                      {count} {count === 1 ? 'time' : 'times'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-gray-50 text-center text-xs text-gray-500">
                  No mistake patterns logged yet.
                </div>
              )}
            </div>
          </div>

          {/* Subject Performance Breakdown (Section 30) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Subject Performance in {journeyDef.badge}</span>
            </h3>

            <div className="space-y-3 pt-2">
              {subjectChartData.length > 0 ? (
                subjectChartData.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{s.subject}</span>
                      <span className="font-extrabold text-slate-800">{s.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                      <span>{s.testsCount} tests recorded</span>
                      <span>{s.obtained} / {s.max} marks</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-gray-50 text-center text-xs text-gray-500">
                  No subject evaluations recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Manage Recorded Tests & Analysis Inclusions (Section 31) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Manage Recorded Tests &amp; Analysis Impact</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Exclude casual practice or walk-drills so they don't lower your score or trigger red alerts. Delete unwanted tests with 2-tap safety.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-gray-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                {evaluations.length} Tests in Database
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {evaluations.length > 0 ? (
                evaluations.map((ev) => {
                  const isExcluded = Boolean(ev.excludeFromAnalysis);

                  return (
                    <div 
                      key={ev.id} 
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isExcluded 
                          ? 'bg-gray-50/70 border-gray-200 opacity-75' 
                          : 'bg-white border-gray-200 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            ev.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' :
                            ev.percentage >= 40 ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ev.percentage}%
                          </span>
                          <span className="font-bold text-slate-900 text-xs truncate max-w-xs">
                            {ev.test_title}
                          </span>
                          {ev.mode === 'walk-and-revise' && (
                            <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                              Walk &amp; Revise
                            </span>
                          )}
                          {isExcluded ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                              Excluded from Analysis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              Included in Analytics
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span>{ev.subject}</span>
                          <span>•</span>
                          <span>{ev.total_obtained_marks}/{ev.total_max_marks} Marks</span>
                          <span>•</span>
                          <span>{new Date(ev.evaluated_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        {/* Toggle Analysis Inclusion */}
                        <button
                          type="button"
                          onClick={() => handleToggleInclusion(ev.id, !isExcluded)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            isExcluded
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                          }`}
                          title={isExcluded ? 'Include this test in analysis stats' : 'Exclude this test so it does not degrade your stats'}
                        >
                          {isExcluded ? 'Include in Analysis' : 'Exclude from Stats'}
                        </button>

                        {/* View result button */}
                        {onSelectEvaluation && (
                          <button
                            type="button"
                            onClick={() => onSelectEvaluation(ev)}
                            className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="View evaluation report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* 2-Tap Delete Trigger */}
                        <button
                          type="button"
                          onClick={() => setPendingDeleteEval(ev)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete test (2-Tap Confirmation)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 rounded-2xl bg-gray-50 text-center text-xs text-gray-500">
                  No tests saved yet. Take a test or walk-drill to see it listed here.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 2-Tap Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(pendingDeleteEval)}
        evaluation={pendingDeleteEval}
        onConfirm={() => {
          if (pendingDeleteEval) {
            if (onDeleteEvaluation) {
              onDeleteEvaluation(pendingDeleteEval.id);
            }
            setPendingDeleteEval(null);
            setRefreshTick(t => t + 1);
          }
        }}
        onCancel={() => setPendingDeleteEval(null)}
      />

    </div>
  );
};
