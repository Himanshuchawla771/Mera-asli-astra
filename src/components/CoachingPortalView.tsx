import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  PlusCircle, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  Award, 
  Sparkles, 
  Search, 
  Filter, 
  Trash2, 
  ArrowRight, 
  Share2, 
  Printer, 
  Download, 
  Clock, 
  Users, 
  Settings, 
  ChevronRight, 
  Eye, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  AlertTriangle,
  FolderUp,
  FileCheck,
  RefreshCw,
  Sliders,
  Play
} from 'lucide-react';
import { AcademicJourney, EvaluationResult, ReferenceSource, UserProfile } from '../types';
import { 
  InstitutionalBatchTest, 
  MasterQuestionPaperConfig, 
  QuestionPaperSection 
} from '../types/coaching';
import { 
  getSavedCoachingBatches, 
  saveCoachingBatch, 
  deleteCoachingBatch, 
  getCoachingPartnerProfile, 
  saveCoachingPartnerProfile,
  CoachingPartnerProfile,
  savePartnerApplication,
  getPartnerApplications,
  PartnerApplication
} from '../utils/coachingStorage';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { CoachingBulkSegregator } from './CoachingBulkSegregator';
import { CoachingMasterLedger } from './CoachingMasterLedger';

interface CoachingPortalViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (journey: AcademicJourney) => void;
  activeProfile: UserProfile | null;
  onSelectEvaluation: (evaluation: EvaluationResult) => void;
  setActiveTab: (tab: any) => void;
  sources?: ReferenceSource[];
}

export const CoachingPortalView: React.FC<CoachingPortalViewProps> = ({
  currentJourney,
  setCurrentJourney,
  activeProfile,
  onSelectEvaluation,
  setActiveTab,
  sources = []
}) => {
  const [coachingTab, setCoachingTab] = useState<'batches' | 'create_batch' | 'bulk_ingestion' | 'ledger' | 'settings'>('batches');
  const [batches, setBatches] = useState<InstitutionalBatchTest[]>(() => getSavedCoachingBatches());
  const [selectedBatch, setSelectedBatch] = useState<InstitutionalBatchTest | null>(() => {
    const saved = getSavedCoachingBatches();
    return saved.length > 0 ? saved[0] : null;
  });
  const [partnerProfile, setPartnerProfile] = useState<CoachingPartnerProfile>(() => getCoachingPartnerProfile());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);

  // Form State for creating a new batch test
  const [batchName, setBatchName] = useState('Class 11 Science - Batch Newton (Morning)');
  const [selectedJourney, setSelectedJourney] = useState<AcademicJourney>(currentJourney);
  const [subject, setSubject] = useState('Physics');
  const [chapterOrTopic, setChapterOrTopic] = useState('Laws of Motion & Friction (Full Assessment)');
  const [totalQuestions, setTotalQuestions] = useState<number>(4);
  const [totalMarks, setTotalMarks] = useState<number>(70);
  const [durationMinutes, setDurationMinutes] = useState<number>(180);
  const [markingSchemeType, setMarkingSchemeType] = useState<'step_wise_strict' | 'cbse_standard' | 'nta_mcq' | 'icai_case_law'>('step_wise_strict');
  const [masterAnswerKey, setMasterAnswerKey] = useState(`OFFICIAL MARKING SCHEME & STEP-WISE RUBRIC:
- Section A (Derivations & Concepts): 0.5 mark for given data + SI units, 1 mark for formula definition, 1.5 marks for intermediate steps, 1 mark for boxed final answer with SI units.
- Section B (Numericals): Strict deduction of 0.5 marks for missing SI units in final results.`);
  const [targetStudentCount, setTargetStudentCount] = useState<number>(30);
  const [pagesPerStudentEstimate, setPagesPerStudentEstimate] = useState<number>(3);
  const [sections, setSections] = useState<QuestionPaperSection[]>([
    { id: 'sec_1', sectionName: 'Section A (Derivations & Theory)', questionCount: 2, marksPerQuestion: 15, questionNumbers: ['Q1', 'Q2'] },
    { id: 'sec_2', sectionName: 'Section B (Numericals & Applications)', questionCount: 2, marksPerQuestion: 20, questionNumbers: ['Q3', 'Q4'] }
  ]);

  // Sync available subjects when journey changes in creator
  const journeyConfig = ACADEMIC_JOURNEYS[selectedJourney] || ACADEMIC_JOURNEYS['CLASS_11_SCIENCE'];
  const availableSubjects = journeyConfig?.subjects ? Object.keys(journeyConfig.subjects) : ['Physics', 'Chemistry', 'Mathematics'];

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [selectedJourney]);

  const showToast = (msg: string) => {
    setIsSuccessToast(msg);
    setTimeout(() => setIsSuccessToast(null), 3500);
  };

  const handleCreateBatchTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim() || !chapterOrTopic.trim()) return;

    const newBatch: InstitutionalBatchTest = {
      id: `batch_${Date.now()}`,
      batchName: batchName.trim(),
      instituteName: partnerProfile.instituteName,
      watermarkText: partnerProfile.watermarkText,
      createdAt: new Date().toISOString(),
      status: 'ready_for_upload',
      targetStudentCount,
      pagesPerStudentEstimate,
      questionPaper: {
        paperTitle: `${subject}: ${chapterOrTopic}`,
        journey: selectedJourney,
        subject,
        chapterOrTopic,
        totalQuestions,
        totalMarks,
        durationMinutes,
        markingSchemeType,
        masterAnswerKeyText: masterAnswerKey,
        sections
      },
      evaluatedSubmissions: []
    };

    saveCoachingBatch(newBatch);
    const updated = getSavedCoachingBatches();
    setBatches(updated);
    setSelectedBatch(newBatch);
    showToast(`Test Examination "${newBatch.batchName}" created successfully!`);
    setCoachingTab('bulk_ingestion');
  };

  const handleDeleteBatch = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this batch test and all associated evaluations?')) return;
    deleteCoachingBatch(id);
    const updated = getSavedCoachingBatches();
    setBatches(updated);
    if (selectedBatch?.id === id) {
      setSelectedBatch(updated.length > 0 ? updated[0] : null);
    }
    showToast('Batch removed from institutional records.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveCoachingPartnerProfile(partnerProfile);
    showToast('Institute Profile & Watermark Branding saved!');
  };

  const isAuthorized = Boolean(
    (activeProfile?.role === 'coaching_partner' && (activeProfile?.approvalStatus === 'approved' || !activeProfile?.approvalStatus)) ||
    activeProfile?.role === 'teacher_admin' ||
    activeProfile?.email === 'himanshuch492@gmail.com' ||
    activeProfile?.email === 'admin@studymentor.edu' ||
    activeProfile?.hasInspectorPrivilege
  );

  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
          <Building2 className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-block">
            Institutional Access Only
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Coaching Hub & Bulk Ingestion Portal
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This module is strictly reserved for verified Coaching Institutes, Schools, and Examination Partners for batch processing 30–50 copies and class rank ledgers.
          </p>
          <p className="text-xs text-slate-500">
            Registered as student: <strong className="text-slate-800">{activeProfile?.name || 'Student'}</strong> ({activeProfile?.email || 'Individual Account'})
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Return to Student Dashboard
          </button>
          <button
            onClick={() => setActiveTab('evaluate')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Evaluate My Answer Copy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Success Toast */}
      {isSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{isSuccessToast}</span>
        </div>
      )}

      {/* Institutional Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Institutional B2B Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Partner: {partnerProfile.instituteName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Coaching Partner & Bulk Examination Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Create standardized test exams, define master answer keys with step-wise marking rubrics, bulk-ingest 50+ scanned student bundles with AI Auto-Segregation, and view class rank ledgers.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCoachingTab('create_batch')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              Create Test Exam
            </button>
            <button
              onClick={() => setCoachingTab('bulk_ingestion')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <UploadCloud className="w-4 h-4" />
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCoachingTab('batches')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              coachingTab === 'batches'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            Active Batches ({batches.length})
          </button>
          <button
            onClick={() => setCoachingTab('create_batch')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              coachingTab === 'create_batch'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            New Test & Answer Key Setup
          </button>
          <button
            onClick={() => setCoachingTab('bulk_ingestion')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              coachingTab === 'bulk_ingestion'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderUp className="w-4 h-4" />
            AI Segregator & Ingestion
          </button>
          <button
            onClick={() => setCoachingTab('ledger')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              coachingTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Master Class Ledger
          </button>
          <button
            onClick={() => setCoachingTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              coachingTab === 'settings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            Branding & Watermark
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE BATCH TESTS ROSTER */}
      {coachingTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Institutional Examination Batches</h2>
              <p className="text-xs text-slate-500">Track and manage created mock exams, total candidate bundles, and class pass metrics.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batch or exam title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches
              .filter(b => b.batchName.toLowerCase().includes(searchTerm.toLowerCase()) || b.questionPaper.subject.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(batch => {
                const totalEvaluated = batch.evaluatedSubmissions?.length || 0;
                const isCompleted = batch.status === 'completed' || totalEvaluated > 0;
                return (
                  <div
                    key={batch.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {batch.questionPaper.subject}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isCompleted ? `✓ ${totalEvaluated} Copies Evaluated` : 'Ready for Ingestion'}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-black text-slate-900 line-clamp-1">{batch.batchName}</h3>
                      <p className="text-xs text-slate-600 font-medium line-clamp-2">{batch.questionPaper.paperTitle}</p>
                      
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span><strong>{batch.questionPaper.totalMarks}</strong> Marks</span>
                        <span>•</span>
                        <span><strong>{batch.questionPaper.totalQuestions}</strong> Questions</span>
                        <span>•</span>
                        <span><strong>{batch.targetStudentCount}</strong> Candidates</span>
                      </div>
                    </div>

                    {isCompleted && batch.averageScore && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">CLASS AVERAGE</span>
                          <span className="text-sm font-black text-slate-800">{batch.averageScore.toFixed(1)} / {batch.questionPaper.totalMarks}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">TOP SCORE</span>
                          <span className="text-sm font-black text-emerald-600">{batch.highestScore} Marks</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setCoachingTab('ledger');
                        }}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        View Ledger
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setCoachingTab('bulk_ingestion');
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all cursor-pointer"
                        title="Upload student answer sheets for this batch"
                      >
                        <UploadCloud className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Batch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: CREATE NEW BATCH & MASTER QUESTION PAPER */}
      {coachingTab === 'create_batch' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Create Standardized Institutional Examination
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure the Master Question Paper and step-wise marking rubric against which AI will evaluate every student bundle.
            </p>
          </div>

          <form onSubmit={handleCreateBatchTest} className="space-y-6">
            
            {/* Step 1: Batch & Stream Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                  Batch / Section Name *
                </label>
                <input
                  type="text"
                  required
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g. Class 11 Science - Batch Galileo (Morning Slot)"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                  Target Academic Stream *
                </label>
                <select
                  value={selectedJourney}
                  onChange={(e) => setSelectedJourney(e.target.value as AcademicJourney)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="CLASS_11_SCIENCE">Class 11 Science (CBSE / State)</option>
                  <option value="CLASS_11_COMMERCE">Class 11 Commerce (CBSE / State)</option>
                  <option value="CLASS_11_ARTS">Class 11 Arts (Humanities)</option>
                  <option value="CLASS_12_SCIENCE">Class 12 Science (PCM / PCB)</option>
                  <option value="CLASS_12">Class 12 Commerce (Accounts / BST)</option>
                  <option value="CLASS_12_ARTS">Class 12 Arts (Humanities)</option>
                  <option value="CA_FOUNDATION">CA Foundation (ICAI Scheme)</option>
                  <option value="CA_INTERMEDIATE">CA Intermediate (Group 1 & 2)</option>
                  <option value="CA_FINAL">CA Final</option>
                  <option value="NEET">NEET (UG Medical Entrance)</option>
                  <option value="JEE">JEE (Main & Advanced)</option>
                  <option value="CUET">CUET (UG Central Universities)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  {availableSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                  Test / Chapter Coverage *
                </label>
                <input
                  type="text"
                  required
                  value={chapterOrTopic}
                  onChange={(e) => setChapterOrTopic(e.target.value)}
                  placeholder="e.g. Kinematics, Newton's Laws & Friction Unit Assessment"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Step 2: Test Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Total Questions</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 4)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Total Max Marks</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(parseInt(e.target.value) || 70)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Target Students</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={targetStudentCount}
                  onChange={(e) => setTargetStudentCount(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Est. Pages / Student</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={pagesPerStudentEstimate}
                  onChange={(e) => setPagesPerStudentEstimate(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Step 3: Master Answer Key & Strictness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                  Master Answer Key & Step-Wise Marking Rubric
                </label>
                <span className="text-[10px] font-bold text-indigo-600">AI Scoring Standard</span>
              </div>
              <textarea
                rows={4}
                value={masterAnswerKey}
                onChange={(e) => setMasterAnswerKey(e.target.value)}
                placeholder="Paste the official model answer key or specific step-wise marking rules..."
                className="w-full px-3.5 py-2.5 text-xs font-medium font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
                All 50+ uploaded student copies will be evaluated strictly against these standard steps and keyterm requirements.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCoachingTab('batches')}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Examination & Proceed to Ingestion
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: BULK INGESTION & AI SEGREGATOR */}
      {coachingTab === 'bulk_ingestion' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          
          {/* Active Batch Picker if multiple */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Target Batch:</span>
              <select
                value={selectedBatch?.id || ''}
                onChange={(e) => {
                  const found = batches.find(b => b.id === e.target.value);
                  if (found) setSelectedBatch(found);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchName} ({b.questionPaper.subject})
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="text-xs text-slate-500 font-medium">
                Master Rubric: <strong className="text-slate-800">{selectedBatch.questionPaper.totalMarks} Marks</strong> ({selectedBatch.questionPaper.totalQuestions} Questions)
              </div>
            )}
          </div>

          {selectedBatch ? (
            <CoachingBulkSegregator
              batch={selectedBatch}
              onBatchUpdated={(updated) => {
                setSelectedBatch(updated);
                setBatches(getSavedCoachingBatches());
              }}
              onCompleteAndNavigateToLedger={() => {
                setBatches(getSavedCoachingBatches());
                setCoachingTab('ledger');
              }}
              sources={sources}
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-base font-black text-slate-900">No Examination Batch Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please create a new test examination in Tab 2 or select an existing batch to begin uploading student scans.
              </p>
              <button
                onClick={() => setCoachingTab('create_batch')}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Create New Examination
              </button>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: MASTER CLASS LEDGER & RESULT SHEET */}
      {coachingTab === 'ledger' && (
        <div className="space-y-6">
          {/* Active Batch Selector */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Viewing Marksheet For:</span>
              <select
                value={selectedBatch?.id || ''}
                onChange={(e) => {
                  const found = batches.find(b => b.id === e.target.value);
                  if (found) setSelectedBatch(found);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchName} ({b.questionPaper.subject}) - {b.evaluatedSubmissions?.length || 0} Students
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="text-xs text-slate-500 font-semibold">
                Status: <span className="text-emerald-700 font-bold uppercase">{selectedBatch.status}</span> • Watermarked: {selectedBatch.watermarkText}
              </div>
            )}
          </div>

          {selectedBatch ? (
            <CoachingMasterLedger
              batch={selectedBatch}
              onSelectEvaluation={onSelectEvaluation}
              setActiveTab={setActiveTab}
              instituteWatermark={partnerProfile.watermarkText || selectedBatch.watermarkText}
              instituteName={partnerProfile.instituteName || selectedBatch.instituteName}
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-base font-black text-slate-900">No Evaluated Batch Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please create a batch and complete AI Segregation or select an existing examination batch to view class marksheet and export scorecards.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: INSTITUTIONAL BRANDING & WATERMARK */}
      {coachingTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Institute Branding & Certificate Watermark
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Customize how your coaching brand appears on evaluated student answer copies and report cards.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Institute / Coaching Name *</label>
              <input
                type="text"
                required
                value={partnerProfile.instituteName}
                onChange={(e) => setPartnerProfile(prev => ({ ...prev, instituteName: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Director / Head Teacher Name</label>
                <input
                  type="text"
                  value={partnerProfile.partnerName}
                  onChange={(e) => setPartnerProfile(prev => ({ ...prev, partnerName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide">City / Location</label>
                <input
                  type="text"
                  value={partnerProfile.city || ''}
                  onChange={(e) => setPartnerProfile(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Watermark Text (Printed on Evaluated PDFs)</label>
              <input
                type="text"
                value={partnerProfile.watermarkText}
                onChange={(e) => setPartnerProfile(prev => ({ ...prev, watermarkText: e.target.value }))}
                placeholder="e.g. APEX ACADEMY • CONFIDENTIAL OFFICIAL EVALUATION"
                className="w-full px-3.5 py-2.5 text-xs font-semibold font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Official institutional changes are synced to Super Admin command ledger.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
              >
                Save Branding Settings
              </button>
            </div>
          </form>

          {/* Quick Apply / Institutional Verification Status Card */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">Super Admin Partner Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active Verified License
                  </span>
                </div>
                <p className="text-xs text-indigo-800/80 max-w-xl">
                  Your academy has full authorization for 50+ concurrent batch evaluations, AI document segregation, and official student dossier generation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  savePartnerApplication({
                    id: `app_${Date.now()}`,
                    instituteName: partnerProfile.instituteName,
                    partnerName: partnerProfile.partnerName,
                    email: partnerProfile.email || activeProfile?.email || 'partner@academy.edu',
                    phone: '+91 98765 43210',
                    city: partnerProfile.city || 'National',
                    estimatedStudents: 300,
                    status: 'approved',
                    appliedAt: new Date().toISOString(),
                    watermarkText: partnerProfile.watermarkText
                  });
                  showToast('Verified license quota refreshed with Super Admin Himanshu!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                Sync License Quota
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
