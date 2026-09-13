import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Play, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  RefreshCw,
  FolderUp,
  Download,
  Hourglass,
  Zap,
  Gauge
} from 'lucide-react';
import { AcademicJourney, EvaluationResult, ReferenceSource } from '../types';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { evaluateExamDocument } from '../services/api';
import { saveEvaluation } from '../utils/storage';

export interface BatchQueueItem {
  id: string;
  studentName: string;
  rollNumber?: string;
  fileName: string;
  fileSizeKb: number;
  subject: string;
  journey: AcademicJourney;
  fileBase64?: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progressPercent: number;
  evaluationResult?: EvaluationResult;
  error?: string;
  submittedAt: string;
}

interface BatchProcessingQueueProps {
  currentJourney: AcademicJourney;
  sources: ReferenceSource[];
  onSelectEvaluation: (evaluation: EvaluationResult) => void;
}

export const BatchProcessingQueue: React.FC<BatchProcessingQueueProps> = ({
  currentJourney,
  sources,
  onSelectEvaluation
}) => {
  const [queue, setQueue] = useState<BatchQueueItem[]>([
    {
      id: 'demo_batch_1',
      studentName: 'Aarav Patel',
      rollNumber: 'CBSE-12044',
      fileName: 'Aarav_Accountancy_MockTest.pdf',
      fileSizeKb: 1420,
      subject: 'Accountancy',
      journey: 'CLASS_12',
      status: 'completed',
      progressPercent: 100,
      submittedAt: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString(),
      evaluationResult: {
        id: 'eval_demo_batch_1',
        test_title: 'Class 12 Accountancy Batch Test',
        evaluated_at: new Date().toISOString(),
        journey: 'CLASS_12',
        level: 'Class 12 CBSE',
        subject: 'Accountancy',
        file_name: 'Aarav_Accountancy_MockTest.pdf',
        total_max_marks: 40,
        total_obtained_marks: 35,
        percentage: 87.5,
        confidence_overall: 'High',
        studentName: 'Aarav Patel',
        stats: {
          total_questions: 1,
          attempted: 1,
          correct: 1,
          mostly_correct: 0,
          partially_correct: 0,
          incorrect: 0,
          not_attempted: 0
        },
        performance_analysis: {
          strengths: ['Partnership AS-26 provisions', 'Goodwill accounting'],
          weaknesses: ['Sacrificing ratio formula notation'],
          repeated_errors: [],
          topic_breakdown: [],
          marks_loss_summary: [],
          teacher_overall_feedback: 'Strong understanding of partnership accounting principles.',
          recommended_study_plan: ['Practice AS-26 disclosure notes']
        },
        questions: [
          {
            question_id: 'Q1',
            question_number: 1,
            question_text: 'Explain the treatment of Goodwill upon Admission of a Partner under AS-26.',
            topic: 'Partnership Accounts',
            max_marks: 5,
            awarded_marks: 4.5,
            status: 'Correct',
            confidence: 'High',
            student_answer: 'Goodwill is recorded only when consideration in money is paid. Inherent goodwill is adjusted through Capital Accounts.',
            expected_model_answer: 'As per AS-26, intangible assets like goodwill can only be recognized if purchased. Self-generated goodwill is adjusted via sacrificing ratio.',
            keyterms_required: ['AS-26', 'Sacrificing Ratio', 'Capital Accounts'],
            keyterms_present: ['AS-26', 'Capital Accounts'],
            keyterms_missing: [],
            correct_points: ['Correct AS-26 reference', 'Capital account adjustment'],
            missing_points: [],
            errors: [],
            marks_deduction_reason: 'Sacrificing ratio formula notation was brief.',
            teacher_feedback: 'Excellent conceptual grasp of AS-26 provisions.'
          }
        ]
      }
    },
    {
      id: 'demo_batch_2',
      studentName: 'Priya Sharma',
      rollNumber: 'CBSE-12089',
      fileName: 'Priya_Economics_Macro.pdf',
      fileSizeKb: 2150,
      subject: 'Economics',
      journey: 'CLASS_12',
      status: 'completed',
      progressPercent: 100,
      submittedAt: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString(),
      evaluationResult: {
        id: 'eval_demo_batch_2',
        test_title: 'Macroeconomics National Income Unit Test',
        evaluated_at: new Date().toISOString(),
        journey: 'CLASS_12',
        level: 'Class 12 CBSE',
        subject: 'Economics',
        file_name: 'Priya_Economics_Macro.pdf',
        total_max_marks: 40,
        total_obtained_marks: 31,
        percentage: 77.5,
        confidence_overall: 'High',
        studentName: 'Priya Sharma',
        stats: {
          total_questions: 1,
          attempted: 1,
          correct: 0,
          mostly_correct: 1,
          partially_correct: 0,
          incorrect: 0,
          not_attempted: 0
        },
        performance_analysis: {
          strengths: ['Real vs Nominal GDP conceptual clarity'],
          weaknesses: ['Deflator arithmetic formula missing'],
          repeated_errors: [],
          topic_breakdown: [],
          marks_loss_summary: [],
          teacher_overall_feedback: 'Good comparative presentation.',
          recommended_study_plan: ['Practice national income price index formulas']
        },
        questions: [
          {
            question_id: 'Q1',
            question_number: 1,
            question_text: 'Distinguish between Real GDP and Nominal GDP with suitable formula.',
            topic: 'National Income',
            max_marks: 4,
            awarded_marks: 3.5,
            status: 'Mostly Correct',
            confidence: 'High',
            student_answer: 'Real GDP measures output at constant base year prices whereas Nominal GDP measures output at current prices.',
            expected_model_answer: 'Real GDP = (Nominal GDP / Price Index) * 100. Real GDP eliminates inflation effects.',
            keyterms_required: ['Real GDP', 'Nominal GDP', 'Price Index'],
            keyterms_present: ['Real GDP', 'Nominal GDP'],
            keyterms_missing: ['Price Index deflator formula'],
            correct_points: ['Distinguished base year from current year prices'],
            missing_points: ['Omitted explicit deflator formula'],
            errors: [],
            marks_deduction_reason: 'Price deflator formula was slightly incomplete.',
            teacher_feedback: 'Good comparative distinction.'
          }
        ]
      }
    }
  ]);

  const [selectedSubject, setSelectedSubject] = useState(
    ACADEMIC_JOURNEYS[currentJourney]?.subjects[0]?.name || 'Accountancy'
  );
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [customStudentPrefix, setCustomStudentPrefix] = useState('Student');

  // Real-Time Queue ETA Tracking
  const [currentBatchTotal, setCurrentBatchTotal] = useState<number>(0);
  const [currentBatchProcessed, setCurrentBatchProcessed] = useState<number>(0);
  const [currentProcessingItemName, setCurrentProcessingItemName] = useState<string>('');
  const [avgSecondsPerCopy, setAvgSecondsPerCopy] = useState<number>(2.8);
  const batchStartTimeRef = useRef<number | null>(null);

  // Format seconds to human friendly string ("Approx 2 mins left", "Approx 45 secs left")
  const formatEstimatedTime = (seconds: number): string => {
    if (seconds <= 0) return 'Almost finished...';
    if (seconds < 60) {
      return `Approx ${Math.ceil(seconds)} secs left`;
    }
    const mins = Math.floor(seconds / 60);
    const remSecs = Math.round(seconds % 60);
    if (remSecs === 0) {
      return `Approx ${mins} min${mins > 1 ? 's' : ''} left`;
    }
    return `Approx ${mins} min${mins > 1 ? 's' : ''} ${remSecs}s left`;
  };

  // Multi-file drag and select handler
  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: BatchQueueItem[] = [];
    const filesArray = Array.from(files);

    for (let i = 0; i < filesArray.length; i++) {
      const f = filesArray[i];
      const baseName = f.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const inferredStudentName = baseName.length > 3 ? baseName : `${customStudentPrefix} #${queue.length + i + 1}`;

      // Read file to Base64
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.readAsDataURL(f);
      });

      newItems.push({
        id: `batch_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        studentName: inferredStudentName,
        rollNumber: `ROLL-${1000 + queue.length + i + 1}`,
        fileName: f.name,
        fileSizeKb: Math.round(f.size / 1024),
        subject: selectedSubject,
        journey: currentJourney,
        fileBase64: base64Data,
        status: 'queued',
        progressPercent: 0,
        submittedAt: new Date().toLocaleTimeString()
      });
    }

    setQueue(prev => [...newItems, ...prev]);
  };

  // Run sequential automated evaluation over all queued items with live ETA calculation
  const startBatchProcessing = async () => {
    if (isProcessingQueue) return;
    const queuedItems = queue.filter(item => item.status === 'queued');
    if (queuedItems.length === 0) return;

    setIsProcessingQueue(true);
    setCurrentBatchTotal(queuedItems.length);
    setCurrentBatchProcessed(0);
    batchStartTimeRef.current = Date.now();

    let processedCount = 0;

    for (const item of queuedItems) {
      setCurrentProcessingItemName(item.studentName);
      // Mark as processing
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing', progressPercent: 25 } : q));

      const itemStartTime = Date.now();

      try {
        // Step progress simulation
        await new Promise(r => setTimeout(r, 600));
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progressPercent: 60 } : q));

        const activeSources = sources.filter(s => s.journey === item.journey && s.isActive);
        const evalResult = await evaluateExamDocument({
          pdfBase64: item.fileBase64,
          journey: item.journey,
          level: item.journey === 'CLASS_12' ? 'Class 12 CBSE' : 'CA Foundation ICAI',
          subject: item.subject,
          fileName: item.fileName,
          activeSources: activeSources.map(s => ({
            title: s.title,
            category: s.category,
            content: s.content || ''
          }))
        });

        // Attach student identifier
        evalResult.studentName = item.studentName;
        evalResult.file_name = item.fileName;
        saveEvaluation(evalResult);

        processedCount++;
        setCurrentBatchProcessed(processedCount);

        // Update rolling average processing duration
        const itemDurationSec = (Date.now() - itemStartTime) / 1000;
        setAvgSecondsPerCopy(prev => (prev * 0.7) + (itemDurationSec * 0.3));

        setQueue(prev => prev.map(q => q.id === item.id ? { 
          ...q, 
          status: 'completed', 
          progressPercent: 100, 
          evaluationResult: evalResult 
        } : q));

      } catch (err: any) {
        processedCount++;
        setCurrentBatchProcessed(processedCount);
        setQueue(prev => prev.map(q => q.id === item.id ? { 
          ...q, 
          status: 'error', 
          progressPercent: 0, 
          error: err.message || 'Evaluation error' 
        } : q));
      }
    }

    setIsProcessingQueue(false);
    setCurrentProcessingItemName('');
    batchStartTimeRef.current = null;
  };

  const removeQueueItem = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  const clearCompleted = () => {
    setQueue(prev => prev.filter(q => q.status !== 'completed'));
  };

  const completedCount = queue.filter(q => q.status === 'completed').length;
  const queuedCount = queue.filter(q => q.status === 'queued').length;
  const processingCount = queue.filter(q => q.status === 'processing').length;

  const remainingInBatch = Math.max(0, currentBatchTotal - currentBatchProcessed);
  const estimatedSecondsLeft = remainingInBatch * avgSecondsPerCopy;
  const batchPercent = currentBatchTotal > 0 ? Math.round((currentBatchProcessed / currentBatchTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Batch Header Bento */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Coaching Institute &amp; Multi-Student Engine
            </span>
            <span className="text-xs text-gray-400 font-medium">Asynchronous Pipeline</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Batch Upload &amp; Multi-Copy Evaluation Queue</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Upload up to 50 student copies simultaneously (e.g., 30-40 copies per batch). The system grades each student's paper sequentially in the background with real-time ETA countdowns against ICAI / CBSE marking rubrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end flex-wrap">
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Completed ({completedCount})
            </button>
          )}

          <button
            onClick={startBatchProcessing}
            disabled={isProcessingQueue || queuedCount === 0}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              queuedCount > 0 && !isProcessingQueue
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessingQueue ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Queue ({remainingInBatch} left)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Batch Evaluation ({queuedCount} Ready)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIVE ETA & BATCH PROGRESS BANNER (When 30-40 copies are processing) */}
      {isProcessingQueue && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-indigo-500/30 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/90 border border-indigo-400/30 flex items-center justify-center text-white shrink-0">
                <Gauge className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Active Pipeline
                  </span>
                  <span className="text-xs font-bold text-indigo-200">
                    Copy {currentBatchProcessed + 1} of {currentBatchTotal}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                  Currently Evaluating: <span className="text-amber-300">{currentProcessingItemName || 'Student Copy'}</span>
                </h3>
              </div>
            </div>

            {/* Estimated Time Remaining (ETA) Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20 flex items-center gap-3 shrink-0">
              <Hourglass className="w-5 h-5 text-amber-300 animate-spin" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 block">
                  Estimated Time Remaining
                </span>
                <span className="text-sm font-black text-white">
                  {formatEstimatedTime(estimatedSecondsLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Processing Volume: {currentBatchProcessed} / {currentBatchTotal} copies done ({batchPercent}%)</span>
              </span>
              <span>Rate: ~{avgSecondsPerCopy.toFixed(1)}s per copy</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${Math.max(5, batchPercent)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Multi-File Upload Drop Area */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 p-8 text-center transition-all">
        <input 
          id="multi-pdf-batch-input"
          type="file"
          multiple
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => handleFilesAdded(e.target.files)}
        />
        <label 
          htmlFor="multi-pdf-batch-input"
          className="cursor-pointer flex flex-col items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <FolderUp className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Click or drag &amp; drop multiple PDFs or Scans to add to Batch Queue
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Select 5, 10, or 50 student answer sheet files at once.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs">
            + Select Student Answer Sheets
          </span>
        </label>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Batch Evaluation Queue ({queue.length} Papers)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              {completedCount} Evaluated
            </span>
            {queuedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                {queuedCount} Pending
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Batch Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-300 bg-white"
            >
              {ACADEMIC_JOURNEYS[currentJourney]?.subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {queue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student &amp; Roll No</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Status &amp; Progress</th>
                  <th className="py-3 px-4 text-center">Score Awarded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.studentName}</span>
                        <span className="text-[10px] font-mono text-gray-400">{item.rollNumber || 'Unassigned'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{item.fileName}</span>
                        <span className="text-[10px] text-gray-400">({item.fileSizeKb} KB)</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.subject}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Checked &amp; Certified
                        </span>
                      ) : item.status === 'processing' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                          Evaluating ({item.progressPercent}%)
                        </span>
                      ) : item.status === 'error' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          In Queue
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono">
                      {item.evaluationResult ? (
                        <div>
                          <span className="font-bold text-slate-900 text-sm">
                            {item.evaluationResult.total_obtained_marks}
                          </span>
                          <span className="text-gray-400 text-xs"> / {item.evaluationResult.total_max_marks}</span>
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            ({item.evaluationResult.percentage}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.evaluationResult && (
                          <button
                            onClick={() => onSelectEvaluation(item.evaluationResult!)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Open Checked Copy</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => removeQueueItem(item.id)}
                          className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from batch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            No papers in the queue. Drag and drop multiple PDF files above to start batch checking.
          </div>
        )}
      </div>

    </div>
  );
};
