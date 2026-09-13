import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Library, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  BookOpen, 
  HelpCircle,
  FileCheck,
  ChevronRight,
  RefreshCw,
  GraduationCap,
  Camera,
  Trash2,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { EvaluationResult, ReferenceSource, AcademicJourney, UserProfile, GeneratedTest } from '../types';
import { evaluateExamDocument, EvaluatePayload } from '../services/api';
import { SAMPLE_EXAMS, SampleExam } from '../data/sampleExams';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { DocumentScannerModal } from './DocumentScannerModal';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { checkGuestQuota, consumeGuestQuota, isUserGuest } from '../utils/guestManager';
import { acquireActionLock } from '../utils/performance';

interface EvaluateViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (j: AcademicJourney) => void;
  sources: ReferenceSource[];
  onEvaluationComplete: (result: EvaluationResult) => void;
  initialSampleExam?: SampleExam | null;
  initialTestContext?: GeneratedTest | null;
  savedTests?: GeneratedTest[];
  activeProfile?: UserProfile | null;
  onTriggerGuestLimit?: (featureName: string, message?: string) => void;
  onClearLinkedExam?: () => void;
}

const PIPELINE_STAGES = [
  { id: 1, name: 'PDF Ingestion & OCR Validation', desc: 'Validating document structures and page orientations' },
  { id: 2, name: 'Question Paper Detection', desc: 'Extracting questions, sub-parts, and maximum allocated marks' },
  { id: 3, name: 'Student Answer Extraction', desc: 'Reading typed & handwritten student answer paragraphs' },
  { id: 4, name: 'Question-Answer Alignment', desc: 'Mapping answers to corresponding question IDs' },
  { id: 5, name: 'Isolated Source Knowledge Loading', desc: 'Retrieving syllabus marking rubrics strictly for active subject' },
  { id: 6, name: 'Rigorous Hybrid Evaluation', desc: 'Evaluating concepts, step calculations, formulas & explanations' },
  { id: 7, name: 'Programmatic Mark Verification', desc: 'Calculating marks, deduction reasons, and topper benchmarks' },
  { id: 8, name: 'Checked Copy & Diagnostics Generation', desc: 'Formulating final report, mistake database & feedback' }
];

export const EvaluateView: React.FC<EvaluateViewProps> = ({
  currentJourney,
  setCurrentJourney,
  sources,
  onEvaluationComplete,
  initialSampleExam,
  initialTestContext,
  savedTests = [],
  activeProfile,
  onTriggerGuestLimit,
  onClearLinkedExam
}) => {
  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];
  
  const [linkedTest, setLinkedTest] = useState<GeneratedTest | null>(initialTestContext || null);
  const [showQuestionsDrawer, setShowQuestionsDrawer] = useState<boolean>(false);
  
  const [selectedSubject, setSelectedSubject] = useState<string>(
    linkedTest ? linkedTest.subject : (initialSampleExam ? initialSampleExam.subject : journeyDef.subjects[0]?.name || 'Accountancy')
  );
  const [selectedChapter, setSelectedChapter] = useState<string>(
    linkedTest ? (linkedTest.topic || '') : (initialSampleExam?.chapter || '')
  );
  const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [uploadedPages, setUploadedPages] = useState<{ id: string; name: string; dataUrl: string }[]>([]);
  const [manualText, setManualText] = useState<string>(initialSampleExam ? initialSampleExam.documentContent : '');
  const [totalMarksHint, setTotalMarksHint] = useState<string>(
    linkedTest ? String(linkedTest.total_marks) : (initialSampleExam ? String(initialSampleExam.totalMarks) : '')
  );

  // Synchronize when initialTestContext changes
  useEffect(() => {
    if (initialTestContext) {
      setLinkedTest(initialTestContext);
      setSelectedSubject(initialTestContext.subject);
      if (initialTestContext.topic) {
        setSelectedChapter(initialTestContext.topic);
      }
      setTotalMarksHint(String(initialTestContext.total_marks));
      if (initialTestContext.journey) {
        setCurrentJourney(initialTestContext.journey);
      }
    }
  }, [initialTestContext]);
  
  // Available chapters for the selected subject
  const currentSubjectDef = journeyDef.subjects.find(s => s.name === selectedSubject);
  const availableChapters = currentSubjectDef?.chapters || [];

  // Filter sources strictly by journey and subject (Strict Subject Isolation)
  const matchingSources = sources.filter(s => 
    s.journey === currentJourney && 
    (s.subject === selectedSubject || s.subject === 'All Subjects')
  );

  // Active sources selected for this evaluation
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);

  // Update selected sources when journey or subject changes
  useEffect(() => {
    const validIds = matchingSources.filter(s => s.isActive).map(s => s.id);
    setSelectedSourceIds(validIds);
  }, [currentJourney, selectedSubject, sources]);

  // Sync subject if journey changes
  useEffect(() => {
    if (!journeyDef.subjects.some(s => s.name === selectedSubject)) {
      setSelectedSubject(journeyDef.subjects[0]?.name || '');
      setSelectedChapter('');
    }
  }, [currentJourney]);

  // Pipeline state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [optimizationNotice, setOptimizationNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScannerCapture = (dataUrl: string, fileName: string) => {
    const newPage = {
      id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: fileName,
      dataUrl
    };
    setUploadedPages(prev => [...prev, newPage]);
    setFileBase64(dataUrl);

    // Create a virtual file object
    const blobBin = atob(dataUrl.split(',')[1]);
    const array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    const virtualFile = new File([new Uint8Array(array)], fileName, { type: 'image/jpeg' });
    setFile(virtualFile);
    setError(null);
  };

  const handleScannerPagesCaptured = (pages: { id: string; dataUrl: string; fileName: string }[]) => {
    if (!pages || pages.length === 0) return;
    const mapped = pages.map(p => ({
      id: p.id,
      name: p.fileName,
      dataUrl: p.dataUrl
    }));
    setUploadedPages(mapped);
    setFileBase64(mapped[0].dataUrl);

    const blobBin = atob(mapped[0].dataUrl.split(',')[1]);
    const array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    const virtualFile = new File([new Uint8Array(array)], mapped[0].name, { type: 'image/jpeg' });
    setFile(virtualFile);
    setError(null);
  };

  // Add an individual image file (for appending extra photos/pages) with Zero-Lag Compression
  const handleAddImageFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File is too large. Maximum supported file size is 25MB.');
      return;
    }

    try {
      const opt = await optimizeImageFile(selectedFile);
      const newPage = {
        id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: opt.file.name || `Page_${uploadedPages.length + 1}.jpg`,
        dataUrl: opt.dataUrl
      };
      setUploadedPages(prev => [...prev, newPage]);
      if (!fileBase64) {
        setFileBase64(opt.dataUrl);
        setFile(opt.file);
      }
      if (opt.savedPercent > 20) {
        setOptimizationNotice(`⚡ Photo Compressed: ${opt.originalSizeKb} KB ➔ ${opt.optimizedSizeKb} KB (${opt.savedPercent}% lighter, instant upload)`);
        setTimeout(() => setOptimizationNotice(null), 4000);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newPage = {
          id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: selectedFile.name || `Page_${uploadedPages.length + 1}.jpg`,
          dataUrl
        };
        setUploadedPages(prev => [...prev, newPage]);
        if (!fileBase64) {
          setFileBase64(dataUrl);
          setFile(selectedFile);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle batch file additions (e.g. user selects 3 photos from gallery)
  const handleMultipleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    Array.from(fileList).forEach(f => {
      if (f.type.startsWith('image/')) {
        handleAddImageFile(f);
      } else {
        handleFileChange(f);
      }
    });
  };

  const handleRemoveUploadedPage = (id: string) => {
    setUploadedPages(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (remaining.length === 0) {
        setFile(null);
        setFileBase64('');
      } else {
        setFileBase64(remaining[0].dataUrl);
      }
      return remaining;
    });
  };

  // Handle single file drop/selection
  const handleFileChange = async (selectedFile: File) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File is too large. Maximum supported file size is 25MB.');
      return;
    }

    if (selectedFile.type.startsWith('image/')) {
      try {
        const opt = await optimizeImageFile(selectedFile);
        setFile(opt.file);
        setFileBase64(opt.dataUrl);
        setUploadedPages([
          {
            id: `page_${Date.now()}`,
            name: opt.file.name,
            dataUrl: opt.dataUrl
          }
        ]);
        if (opt.savedPercent > 20) {
          setOptimizationNotice(`⚡ Photo Compressed: ${opt.originalSizeKb} KB ➔ ${opt.optimizedSizeKb} KB (${opt.savedPercent}% lighter, instant upload)`);
          setTimeout(() => setOptimizationNotice(null), 4000);
        }
        return;
      } catch {
        // Fallback to standard reader
      }
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileBase64(result);
      if (selectedFile.type.startsWith('image/')) {
        setUploadedPages([
          {
            id: `page_${Date.now()}`,
            name: selectedFile.name,
            dataUrl: result
          }
        ]);
      } else {
        setUploadedPages([]);
      }
    };
    reader.onerror = () => {
      setError('Failed to read selected file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFilesAdded(e.dataTransfer.files);
    }
  };

  const toggleSourceSelection = (id: string) => {
    setSelectedSourceIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleStartEvaluation = async () => {
    // Leading-edge throttle: prevent rapid spam-clicks from creating multiple evaluations
    if (isProcessing) return;
    if (!acquireActionLock('evaluate_exam_submission', 2000)) return;

    setError(null);

    if (inputMode === 'pdf' && !fileBase64) {
      setError('Please upload a PDF or image file first, or switch to Text Mode.');
      return;
    }

    if (inputMode === 'text' && !manualText.trim()) {
      setError('Please paste the Question Paper and Student Answer text to evaluate.');
      return;
    }

    // Guest quota enforcement (Bypassed 100% for registered/approved students & admins)
    if (isUserGuest(activeProfile)) {
      const quota = checkGuestQuota('evaluate');
      if (!quota.canProceed) {
        if (onTriggerGuestLimit) {
          onTriggerGuestLimit('Paper Evaluation', quota.message);
        } else {
          setError(quota.message || 'Daily limit of 2 evaluations reached for Guest Mode.');
        }
        return;
      }
    }

    setIsProcessing(true);
    setCurrentStage(1);
    setElapsedSeconds(0);

    // Elapsed timer
    const timerInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Adaptive smooth stage pacing
    const stageInterval = setInterval(() => {
      setCurrentStage(prev => (prev < 7 ? prev + 1 : prev));
    }, 1200);

    try {
      const activeSourcesForEval = matchingSources
        .filter(s => selectedSourceIds.includes(s.id))
        .map(s => ({
          title: s.title,
          category: s.category,
          content: s.content
        }));

      const hasMultiImages = uploadedPages.length > 0;
      const imagesList = hasMultiImages 
        ? uploadedPages.map(p => p.dataUrl) 
        : (fileBase64 && (file?.type.startsWith('image/') || fileBase64.startsWith('data:image')) ? [fileBase64] : undefined);

      const payload: EvaluatePayload = {
        pdfBase64: inputMode === 'pdf' ? fileBase64 : undefined,
        imagesBase64: inputMode === 'pdf' ? imagesList : undefined,
        mimeType: inputMode === 'pdf' && file ? (file.type || 'application/pdf') : 'text/plain',
        fileName: inputMode === 'pdf' && file ? (hasMultiImages && uploadedPages.length > 1 ? `${selectedSubject}_AnswerSheet_${uploadedPages.length}Pages.jpg` : file.name) : `${selectedSubject}_Exam.txt`,
        manualText: inputMode === 'text' ? manualText : undefined,
        activeSources: activeSourcesForEval,
        journey: currentJourney,
        level: journeyDef.defaultLevel,
        subject: selectedSubject,
        chapter: selectedChapter || undefined,
        totalMarksHint: totalMarksHint ? Number(totalMarksHint) : undefined,
        testContext: linkedTest || undefined
      };

      const result = await evaluateExamDocument(payload);

      clearInterval(timerInterval);
      clearInterval(stageInterval);
      setCurrentStage(8);

      setTimeout(() => {
        setIsProcessing(false);
        if (isUserGuest(activeProfile)) {
          consumeGuestQuota('evaluate');
        }
        onEvaluationComplete({
          ...result,
          journey: currentJourney,
          level: journeyDef.defaultLevel,
          subject: selectedSubject,
          chapter: selectedChapter || undefined,
          active_source_ids: selectedSourceIds
        });
      }, 700);

    } catch (err: any) {
      clearInterval(timerInterval);
      clearInterval(stageInterval);
      setIsProcessing(false);
      setError(err.message || 'An error occurred during evaluation. Please verify the document format.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Bento Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {journeyDef.badge}
            </span>
            <span className="text-xs text-gray-400 font-medium">Evaluation Workflow</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Upload className="w-6 h-6 text-indigo-600" />
            <span>Upload Answer Sheet & Evaluate</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select academic context, upload student copy PDF or text, and receive teacher-grade checked copy + analysis report
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="inline-flex p-1 bg-white rounded-2xl border border-gray-200 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setInputMode('pdf')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              inputMode === 'pdf'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-500 hover:text-slate-900'
            }`}
          >
            PDF / Scanned Copy
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              inputMode === 'text'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-500 hover:text-slate-900'
            }`}
          >
            Text / OCR Mode
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Evaluation Error</p>
            <p className="text-rose-700 text-xs leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Live Pipeline Tracker when Processing */}
      {isProcessing && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Evaluating {selectedSubject} Examination Paper...</h3>
                <p className="text-xs text-indigo-600 font-semibold">
                  Stage {currentStage} of 8: {PIPELINE_STAGES[currentStage - 1]?.name} • <span className="font-mono text-slate-600">{elapsedSeconds}s elapsed</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 block">
                {Math.round((currentStage / 8) * 100)}% Complete
              </span>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">Live AI Examiner Analysis</span>
            </div>
          </div>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStage / 8) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {PIPELINE_STAGES.map((stage) => {
              const isCompleted = currentStage > stage.id;
              const isCurrent = currentStage === stage.id;

              return (
                <div 
                  key={stage.id}
                  className={`p-3.5 rounded-2xl border text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm ring-2 ring-indigo-200'
                      : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-[11px]">0{stage.id}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <p className="font-bold">{stage.name}</p>
                  <p className="text-[11px] opacity-80 mt-0.5 line-clamp-1">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Upload / Input Bento Card */}
      {!isProcessing && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Linked Test Paper Banner / Attachment Widget */}
          {linkedTest ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-600 text-white">
                      Linked Test Active
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">
                      Exact Question-Paper Evaluation Mode
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                    {linkedTest.title}
                  </h3>
                  <p className="text-xs text-indigo-900/80 mt-0.5">
                    {linkedTest.questions.length} Questions • Maximum {linkedTest.total_marks} Marks • {linkedTest.difficulty} Level
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowQuestionsDrawer(true)}
                  className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Questions ({linkedTest.questions.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkedTest(null);
                    if (onClearLinkedExam) onClearLinkedExam();
                  }}
                  className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-xl border border-gray-200 transition-all cursor-pointer"
                  title="Unlink this test to evaluate standard document"
                >
                  Unlink
                </button>
              </div>
            </div>
          ) : savedTests && savedTests.length > 0 ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Have a specific test paper you created earlier?
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const testId = e.target.value;
                    const found = savedTests.find(t => t.test_id === testId);
                    if (found) {
                      setLinkedTest(found);
                      setSelectedSubject(found.subject);
                      if (found.topic) setSelectedChapter(found.topic);
                      setTotalMarksHint(String(found.total_marks));
                      if (found.journey) setCurrentJourney(found.journey);
                    }
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold bg-white rounded-xl border border-gray-300 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>Attach Created Test Paper...</option>
                  {savedTests.map(t => (
                    <option key={t.test_id} value={t.test_id}>
                      {t.title} ({t.questions.length} Qs, {t.total_marks} Marks)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {/* Questions Inspector Modal */}
          {showQuestionsDrawer && linkedTest && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                      Official Question Paper Details
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-1">
                      {linkedTest.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {linkedTest.questions.length} Questions • Maximum Marks: {linkedTest.total_marks}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQuestionsDrawer(false)}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 divide-y divide-gray-100">
                  {linkedTest.questions.map((q, idx) => (
                    <div key={idx} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {q.question_id || `Question ${idx + 1}`} ({q.max_marks} Marks)
                        </span>
                        {q.sub_topic && (
                          <span className="text-[11px] font-bold text-gray-400">
                            Topic: {q.sub_topic}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        {q.question_text}
                      </p>
                      {q.marking_scheme_steps && q.marking_scheme_steps.length > 0 && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                          <p className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
                            Step-Wise Marking Scheme
                          </p>
                          <ul className="list-disc list-inside text-xs text-amber-950 space-y-0.5">
                            {q.marking_scheme_steps.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {q.model_answer && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                          <p className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">
                            Model Answer Reference
                          </p>
                          <p className="text-xs text-emerald-950 leading-relaxed font-mono whitespace-pre-wrap">
                            {q.model_answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => setShowQuestionsDrawer(false)}
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                  >
                    Close Questions Paper
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 & 2: Academic Context Selectors */}
          <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>1. Academic Scope & Strict Subject Isolation</span>
              </h3>
              <span className="text-[11px] text-indigo-600 font-semibold">
                {journeyDef.title}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Journey</label>
                <select
                  value={currentJourney}
                  onChange={(e) => setCurrentJourney(e.target.value as AcademicJourney)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-gray-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CLASS_12">Class 12 Commerce (CBSE / State)</option>
                  <option value="CLASS_12_SCIENCE">Class 12 Science PCM / PCB (CBSE)</option>
                  <option value="CLASS_12_ARTS">Class 12 Arts / Humanities (CBSE / State)</option>
                  <option value="CLASS_11_SCIENCE">Class 11 Science PCM / PCB (CBSE)</option>
                  <option value="CLASS_11_COMMERCE">Class 11 Commerce (CBSE / State)</option>
                  <option value="CLASS_11_ARTS">Class 11 Arts / Humanities (CBSE / State)</option>
                  <option value="CA_FOUNDATION">CA Foundation (ICAI)</option>
                  <option value="CA_INTERMEDIATE">CA Intermediate (ICAI New Scheme)</option>
                  <option value="CA_FINAL">CA Final (ICAI New Scheme)</option>
                  <option value="NEET">NEET (UG) - Medical Entrance</option>
                  <option value="JEE">JEE (Main & Advanced) - Engineering</option>
                  <option value="CUET">CUET (UG) - Central Universities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('');
                  }}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-gray-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                >
                  {journeyDef.subjects.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chapter / Topic (Optional)</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-gray-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Whole Syllabus / General</option>
                  {availableChapters.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {inputMode === 'pdf' ? (
            /* PDF Upload & Camera Capture Zone */
            <div className="space-y-4">
              {optimizationNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-bold shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{optimizationNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOptimizationNotice(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-[11px] underline cursor-pointer ml-2 shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {file || uploadedPages.length > 0 ? (
                /* Attached Files / Multi-Page Card */
                <div className="border-2 border-indigo-300 bg-indigo-50/40 rounded-3xl p-5 sm:p-6 space-y-4">
                  {uploadedPages.length > 0 ? (
                    /* Multi-Page Handwritten Answer Sheet Tray */
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-sm sm:text-base">
                                Handwritten Answer Sheet ({uploadedPages.length} Page{uploadedPages.length !== 1 ? 's' : ''})
                              </p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                                Ready for Evaluation
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500">
                              All pages will be checked sequentially as one complete answer paper
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              setFileBase64('');
                              setUploadedPages([]);
                            }}
                            className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear All</span>
                          </button>
                        </div>
                      </div>

                      {/* Filmstrip / Page Thumbnails Grid */}
                      <div className="flex items-center gap-3 overflow-x-auto py-2">
                        {uploadedPages.map((p, idx) => (
                          <div 
                            key={p.id}
                            className="relative group shrink-0 w-20 h-24 rounded-xl border-2 border-indigo-200 bg-white overflow-hidden shadow-xs hover:border-indigo-400 transition-all"
                          >
                            <img 
                              src={p.dataUrl} 
                              alt={`Page ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-center text-white font-extrabold py-0.5">
                              Page {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedPage(p.id)}
                              className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                              title="Delete this page"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* Direct "+ Add Next Photo" Camera Box in the Filmstrip */}
                        <label
                          htmlFor="eval-card-snap-next-camera"
                          className="shrink-0 w-20 h-24 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-all active:scale-95 group"
                          title="Snap next page with camera"
                        >
                          <Camera className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-indigo-700 leading-tight px-1">
                            + Snap Next Page
                          </span>
                        </label>
                        <input
                          id="eval-card-snap-next-camera"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleAddImageFile(e.target.files[0]);
                            }
                          }}
                        />
                      </div>

                      {/* Multi-Photo Action Buttons */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100">
                        <p className="text-xs text-indigo-900 font-medium">
                          Need to add more pages? Snap another photo or choose more from your gallery below:
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Snap next with camera */}
                          <label
                            htmlFor="eval-action-snap-camera"
                            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <Camera className="w-3.5 h-3.5 text-indigo-400" />
                            <span>+ Snap Next Page (Camera)</span>
                          </label>
                          <input
                            id="eval-action-snap-camera"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleAddImageFile(e.target.files[0]);
                              }
                            }}
                          />

                          {/* Upload more photos from device */}
                          <label
                            htmlFor="eval-action-browse-photos"
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add More Photos</span>
                          </label>
                          <input
                            id="eval-action-browse-photos"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleMultipleFilesAdded(e.target.files)}
                          />

                          {/* Open Scanner Modal */}
                          <button
                            type="button"
                            onClick={() => setIsScannerOpen(true)}
                            className="px-3.5 py-2 bg-white hover:bg-gray-100 text-slate-700 font-bold text-xs rounded-xl border border-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Scanner &amp; Enhancer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* PDF Document Card */
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          <FileCheck className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 text-base sm:text-lg truncate max-w-[240px] sm:max-w-md">
                              {file?.name}
                            </p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                              Ready
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {file ? (file.size / (1024 * 1024)).toFixed(2) : '0'} MB • {file?.type || 'Document'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        <label
                          htmlFor="eval-replace-pdf-input"
                          className="px-3.5 py-2 bg-white hover:bg-gray-100 text-slate-700 font-bold text-xs rounded-xl border border-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-gray-500" />
                          <span>Replace</span>
                        </label>
                        <input
                          id="eval-replace-pdf-input"
                          type="file"
                          accept="application/pdf,image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                            }
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setFileBase64('');
                            setUploadedPages([]);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unattached State: Dual-Deck Smart Scanner Studio */
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="bg-gradient-to-b from-white to-slate-50/80 rounded-2xl border-2 border-dashed border-blue-200/90 hover:border-blue-400 p-6 sm:p-10 transition-all shadow-[0_4px_24px_-4px_rgba(37,99,235,0.06)] group"
                >
                  {/* Top Deck: Visual Paper Preview Spread */}
                  <div className="flex items-center justify-center -space-x-4 mb-6">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-white rounded-lg border border-slate-200 shadow-sm rotate-[-8deg] flex flex-col p-2 select-none group-hover:rotate-[-12deg] transition-transform">
                      <div className="w-full h-2.5 bg-blue-100 rounded-sm mb-1.5" />
                      <div className="space-y-1">
                        <div className="w-3/4 h-1.5 bg-slate-100 rounded-xs" />
                        <div className="w-5/6 h-1.5 bg-slate-100 rounded-xs" />
                        <div className="w-2/3 h-1.5 bg-slate-100 rounded-xs" />
                      </div>
                      <div className="mt-auto flex justify-between items-center text-[8px] text-blue-600 font-bold">
                        <span>CBSE</span>
                        <span>Q.1</span>
                      </div>
                    </div>

                    <div className="w-22 h-30 sm:w-28 sm:h-36 bg-white rounded-lg border-2 border-blue-500 shadow-md z-10 flex flex-col p-2.5 select-none transition-transform group-hover:scale-105">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">STUDENT COPY</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-slate-200 rounded-xs" />
                        <div className="w-4/5 h-1.5 bg-slate-200 rounded-xs" />
                        <div className="w-full h-1.5 bg-slate-100 rounded-xs" />
                        <div className="w-3/5 h-1.5 bg-slate-100 rounded-xs" />
                      </div>
                      <div className="mt-auto pt-1 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-slate-400 font-mono">OCR Active</span>
                        <span className="text-emerald-700 font-bold">100% DPI</span>
                      </div>
                    </div>

                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-white rounded-lg border border-slate-200 shadow-sm rotate-[8deg] flex flex-col p-2 select-none group-hover:rotate-[12deg] transition-transform">
                      <div className="w-full h-2.5 bg-emerald-100 rounded-sm mb-1.5" />
                      <div className="space-y-1">
                        <div className="w-4/5 h-1.5 bg-slate-100 rounded-xs" />
                        <div className="w-2/3 h-1.5 bg-slate-100 rounded-xs" />
                      </div>
                      <div className="mt-auto flex justify-between items-center text-[8px] text-emerald-600 font-bold">
                        <span>ICAI</span>
                        <span>Step Rubric</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Dual-Deck Smart Scanner Studio</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                      Drop Question Paper &amp; Student Answer Script
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Instant automatic deskew, OCR handwriting enhancement, and red-pen examiner step marks for <span className="font-semibold text-slate-800">{selectedSubject}</span> (Multi-page PDF or Scans).
                    </p>

                    {/* Prominent Action Bar */}
                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                      {/* 1. Direct Camera Snap Button */}
                      <label
                        htmlFor="eval-direct-camera-input"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                      >
                        <Camera className="w-4 h-4 text-blue-100" />
                        <span>Snap with Mobile Camera</span>
                      </label>
                      <input
                        id="eval-direct-camera-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />

                      {/* 2. File Upload Button */}
                      <label
                        htmlFor="eval-main-file-input"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95"
                      >
                        <Upload className="w-4 h-4 text-slate-600" />
                        <span>Browse Multi-Page PDF</span>
                      </label>
                      <input
                        id="eval-main-file-input"
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />

                      {/* 3. Document Scanner & Enhancer Modal */}
                      <button
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Multi-Page Scanner &amp; Deskew</span>
                      </button>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">✓ PDF, JPG, PNG up to 25MB</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">✓ Verified by Official Board Rubric</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Text Input Area */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Question Paper & Student Answers Text
                </label>
                <span className="text-xs text-gray-400">
                  Include Question text & Student's Answers (e.g. Q1, Ans 1...)
                </span>
              </div>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="=== QUESTION PAPER ===&#10;Q1. State the provisions of Indian Partnership Act... [4 Marks]&#10;Q2. Calculate interest on drawings... [6 Marks]&#10;&#10;=== STUDENT ANSWERS ===&#10;Ans 1: In the absence of partnership deed...&#10;Ans 2: Total drawings = 48,000..."
                rows={12}
                className="w-full p-4 rounded-2xl border border-gray-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-gray-50/60"
              />
            </div>
          )}

          {/* Maximum Marks Hint */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Expected Total Maximum Marks (Optional hint)
            </label>
            <input
              type="number"
              value={totalMarksHint}
              onChange={(e) => setTotalMarksHint(e.target.value)}
              placeholder="e.g. 25, 40, 80, 100"
              className="w-full sm:w-64 px-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
            />
          </div>

          {/* Active Reference Sources Section Bento - Strictly Isolated */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Strictly Isolated Knowledge Base ({selectedSourceIds.length} Active for {selectedSubject})
                </h4>
              </div>
              <span className="text-xs text-gray-400 hidden sm:inline">
                Cross-checked as reference standards & rubrics
              </span>
            </div>

            {matchingSources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchingSources.map((src) => {
                  const isSelected = selectedSourceIds.includes(src.id);
                  return (
                    <div
                      key={src.id}
                      onClick={() => toggleSourceSelection(src.id)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-200'
                          : 'bg-gray-50 border-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-indigo-100">
                          {src.category}
                        </span>
                        <p className="font-bold text-xs text-slate-900 truncate mt-1">{src.title}</p>
                        <p className="text-[11px] text-gray-400 truncate">{src.level} • {src.subject}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 text-xs text-gray-500 text-center border border-dashed border-gray-200">
                No custom sources added for {selectedSubject}. The AI will use standard academic reasoning.
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              ⚡ Evaluates step marks, explains every deduction, and produces checked copy
            </p>

            <button
              id="start-evaluation-submit-btn"
              onClick={handleStartEvaluation}
              disabled={isProcessing || (inputMode === 'pdf' ? !fileBase64 : !manualText.trim())}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Evaluate Answer Sheet</span>
            </button>
          </div>

        </div>
      )}

      {/* Document Scanner & Camera Modal */}
      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onImageCaptured={handleScannerCapture}
        onPagesCaptured={handleScannerPagesCaptured}
        initialImageDataUrl={fileBase64 || undefined}
      />

    </div>
  );
};
