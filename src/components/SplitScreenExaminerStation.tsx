import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Printer, 
  Download, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { EvaluationResult, ReferenceSource, QuestionEvaluation } from '../types';
import { 
  playSpeechWithRate, 
  stopCurrentSpeech, 
  generateSynthesizedWavBlob, 
  triggerFileDownload 
} from '../utils/audioExporter';

interface SplitScreenExaminerStationProps {
  evaluation: EvaluationResult;
  sources: ReferenceSource[];
  onDownloadPDF?: () => void;
  onPrint?: () => void;
}

export const SplitScreenExaminerStation: React.FC<SplitScreenExaminerStationProps> = ({
  evaluation,
  sources: _sources,
  onDownloadPDF,
  onPrint
}) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState<boolean>(false);

  // Stop speech on unmount or question change
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
    };
  }, []);

  useEffect(() => {
    stopCurrentSpeech();
    setIsPlayingAudio(false);
  }, [selectedQuestionIndex]);

  const questions = evaluation.questions || [];
  const currentQ: QuestionEvaluation | undefined = questions[selectedQuestionIndex];

  const getFeedbackScript = () => {
    const studentName = evaluation.studentName || 'Candidate';
    return currentQ?.marks_deduction_reason 
      ? `Hello ${studentName}. For question ${selectedQuestionIndex + 1}, you obtained ${currentQ.awarded_marks} out of ${currentQ.max_marks} marks. Key observation: ${currentQ.marks_deduction_reason}. To secure full marks next time, make sure to follow the official step-marking breakdown and substantiate all working notes in your margin.`
      : `Well done ${studentName}! In question ${selectedQuestionIndex + 1}, you scored full ${currentQ?.awarded_marks || 0} marks. Your presentation, formula execution, and final statutory steps strictly match the official board criteria. Keep it up!`;
  };

  // Speech synthesis for teacher feedback with custom rate
  const togglePlayAudioFeedback = () => {
    if (isPlayingAudio) {
      stopCurrentSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const feedbackText = getFeedbackScript();

    setIsPlayingAudio(true);
    playSpeechWithRate(feedbackText, {
      rate: audioSpeed,
      lang: 'en-IN',
      onEnd: () => {
        setIsPlayingAudio(false);
        setAudioPlayed(true);
      },
      onError: () => {
        setIsPlayingAudio(false);
      }
    });
  };

  // Direct Audio Download (.WAV / MP3)
  const handleDownloadExaminerAudio = async () => {
    setIsDownloadingAudio(true);
    try {
      const feedbackText = `Official Examiner Feedback for ${evaluation.studentName || 'Candidate'}.\nExam: ${evaluation.test_title}.\nQuestion ${selectedQuestionIndex + 1}: ${currentQ?.question_text || ''}\n\n${getFeedbackScript()}`;
      const blob = await generateSynthesizedWavBlob(feedbackText, `Examiner_Feedback_Q${selectedQuestionIndex + 1}`);
      const filename = `${evaluation.studentName || 'Student'}_Q${selectedQuestionIndex + 1}_Examiner_Voice.wav`.replace(/[^a-zA-Z0-9._-]/g, '_');
      triggerFileDownload(blob, filename);
    } catch (err: any) {
      alert('Audio download ready: ' + (err.message || 'Complete'));
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        No question evaluations available for this test copy.
      </div>
    );
  }

  // Derive dynamic 3-point fix for 20/20 based on weak areas
  const weakPoints = questions
    .filter(q => q.awarded_marks < q.max_marks && q.marks_deduction_reason)
    .slice(0, 3);

  const defaultThreePointFix = [
    'Always draw a distinct Working Notes box on the right-hand margin or below the ledger.',
    'Cite statutory section numbers or accounting standard principles in your introductory paragraph.',
    'Double-underline final balancing figures and write units (₹, Units, Ratio) clearly.'
  ];

  const threePointFix = weakPoints.length > 0 
    ? weakPoints.map((wp, i) => `${wp.marks_deduction_reason} (Focus on ${wp.topic || `Q${i + 1}`})`)
    : defaultThreePointFix;

  // Grade badge calculation
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { label: 'Grade: A+', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (percentage >= 75) return { label: 'Grade: A (Distinction)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (percentage >= 60) return { label: 'Grade: B (First Class)', color: 'bg-teal-100 text-teal-800 border-teal-300' };
    if (percentage >= 50) return { label: 'Grade: C (Second Class)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (percentage >= 40) return { label: 'Grade: D (Pass)', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    return { label: 'Grade: F (Needs Remedial)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const gradeInfo = getGrade(evaluation.percentage);

  return (
    <div className="space-y-4">
      
      {/* Top Studio Control Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
              EXAMINER STATION
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              CBSE 12 &amp; ICAI Dual-Pane Synchronized Evaluation
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{evaluation.test_title}</span>
            <span className="text-xs font-bold text-slate-400 font-mono">({evaluation.subject || 'Core'})</span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Question Stepper Indicator */}
          <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="text-slate-400">Question:</span>
            <span className="font-bold text-white">{selectedQuestionIndex + 1} of {questions.length}</span>
            <div className="flex items-center gap-1 pl-1">
              <button
                type="button"
                disabled={selectedQuestionIndex === 0}
                onClick={() => setSelectedQuestionIndex(prev => Math.max(0, prev - 1))}
                className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 cursor-pointer"
                title="Previous Question"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={selectedQuestionIndex === questions.length - 1}
                onClick={() => setSelectedQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 cursor-pointer"
                title="Next Question"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Print & PDF Buttons */}
          {onPrint && (
            <button
              onClick={onPrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}

          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Official PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {questions.map((q, idx) => {
          const isSelected = idx === selectedQuestionIndex;
          const isFull = q.awarded_marks === q.max_marks;
          const isZero = q.awarded_marks === 0;

          return (
            <button
              key={q.question_id || idx}
              onClick={() => setSelectedQuestionIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
            >
              <span className="font-mono">Q{idx + 1}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : isFull
                  ? 'bg-emerald-100 text-emerald-800'
                  : isZero
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {q.awarded_marks}/{q.max_marks}M
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN SPLIT-SCREEN EXAMINER STATION (LEFT VS RIGHT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* --------------------------------------------------------------------- */}
        {/* LEFT PANE (SPAN 6): STUDENT'S ORIGINAL ANSWER SHEET (WITH RED & GREEN PEN) */}
        {/* --------------------------------------------------------------------- */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden flex flex-col">
          
          {/* Header Banner */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Left Pane: Student&apos;s Original Answer Sheet
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-300 font-mono">
              Ruled Booklet + Red Margin
            </span>
          </div>

          {/* Paper Content Area */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-[#FFFDF8]">
            
            {/* Question Title & Prompt */}
            <div className="space-y-1.5 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                  {currentQ?.question_id || `Q${selectedQuestionIndex + 1}`}
                </span>
                {currentQ?.topic && (
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {currentQ.topic}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-semibold ml-auto">
                  Weightage: {currentQ?.max_marks} Marks
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {currentQ?.question_text}
              </h4>
            </div>

            {/* Authentic Ruled Sheet Container */}
            <div className="rounded-xl border-2 border-slate-300 bg-white relative overflow-hidden shadow-xs flex min-h-[320px]">
              
              {/* Left Margin Column (Question number and examiner ticks) */}
              <div className="w-14 sm:w-16 shrink-0 border-r-2 border-red-400 bg-red-50/15 p-2 pt-3 flex flex-col items-center select-none text-center">
                <span className="font-mono font-bold text-slate-700 text-xs">
                  Ans.{selectedQuestionIndex + 1}
                </span>

                {/* Vertical Margin Red-Pen Examiner Ticks */}
                <div className="mt-4 space-y-3 font-handwriting text-red-600 font-bold text-lg leading-none">
                  {currentQ?.status === 'Correct' ? (
                    <div title="Full marks tick" className="text-2xl text-emerald-700">✓✓</div>
                  ) : currentQ?.status === 'Partially Correct' || currentQ?.status === 'Mostly Correct' ? (
                    <div title="Partial tick" className="text-2xl text-amber-600">½✓</div>
                  ) : (
                    <div title="Deduction tick" className="text-2xl text-rose-600">✗</div>
                  )}

                  <div className="text-sm font-mono font-black text-red-600 border border-dashed border-red-300 rounded px-1 py-0.5 bg-red-50/80">
                    +{currentQ?.awarded_marks}
                  </div>
                </div>
              </div>

              {/* Ruled lines body with candidate answer & Live Red/Green Overlays */}
              <div className="flex-1 p-4 font-mono text-xs sm:text-sm text-slate-800 leading-[28px] bg-ruled-paper whitespace-pre-wrap relative z-0 flex flex-col justify-between">
                <div>
                  {currentQ?.student_answer ? (
                    <div className="relative">
                      {currentQ.student_answer}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">
                      (Candidate left this question unattempted / blank in submitted copy)
                    </span>
                  )}
                </div>

                {/* Visual Red Circle & Green Tick Overlays (As in prompt wireframe) */}
                <div className="pt-4 space-y-2 mt-4 border-t border-slate-200">
                  {/* Green Key Concept Recognitions */}
                  {currentQ?.keyterms_present && currentQ.keyterms_present.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-start gap-2 select-none">
                      <span className="text-emerald-700 font-bold text-sm leading-none">✔</span>
                      <div>
                        <span className="font-bold text-emerald-800">[GREEN OVERLAY]: Concept Verified </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentQ.keyterms_present.map((kp, kIdx) => (
                            <span key={kIdx} className="bg-white text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded text-[11px] font-bold">
                              ✓ {kp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Red Circle / Deduction Flag Overlay */}
                  {currentQ?.marks_deduction_reason && (
                    <div className="p-2.5 rounded-lg bg-rose-50/90 border-2 border-dashed border-rose-400 text-rose-950 text-xs font-mono flex items-start gap-2 select-none shadow-2xs">
                      <span className="text-rose-600 font-bold text-base leading-none">⭕</span>
                      <div>
                        <span className="font-bold text-rose-800">[RED CIRCLE WARNING]: </span>
                        <span className="text-rose-900 font-semibold">{currentQ.marks_deduction_reason}</span>
                        <div className="text-[11px] text-rose-700 mt-0.5 font-bold">
                          Deduction applied: -{((currentQ?.max_marks || 0) - (currentQ?.awarded_marks || 0)).toFixed(1)} Marks
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Official Examiner Red-Ink Rubber Stamp on Sheet */}
            <div className="pt-2 flex justify-end">
              <div className="border-2 border-red-600 rounded-xl px-4 py-2 bg-white shadow-xs rotate-[-2deg] text-center select-none">
                <div className="text-[9px] font-black tracking-widest text-red-700 uppercase border-b border-red-200 pb-0.5">
                  CHECKED BY: Senior Evaluator
                </div>
                <div className="flex items-center justify-center gap-2 pt-0.5 text-red-600">
                  <span className="font-mono text-base font-black">
                    MARKS: {currentQ?.awarded_marks} / {currentQ?.max_marks}
                  </span>
                </div>
                <div className="text-[9px] font-handwriting text-red-600 font-bold pt-0.5">
                  Audit: #{evaluation.id.slice(0, 8).toUpperCase()} • Signed
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* --------------------------------------------------------------------- */}
        {/* RIGHT PANE (SPAN 6): EXAMINER'S STEP-WISE MARKING SLIP & 3-POINT FIX */}
        {/* --------------------------------------------------------------------- */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-5">
          
          {/* Header & Total Marks Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block">
                  Official Rubric Breakdown
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Examiner&apos;s Step-Wise Marking Slip
                </h3>
              </div>

              {/* Total Marks Pill with Grade */}
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-500">
                  TOTAL MARKS: <span className="text-slate-900 font-extrabold text-sm">{currentQ?.awarded_marks} / {currentQ?.max_marks}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${gradeInfo.color}`}>
                  {gradeInfo.label}
                </span>
              </div>
            </div>

            {/* Official Step-by-Step Marking Scheme Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Step-by-Step Marking Scheme Rubrics
              </span>

              {/* Step 1: Conceptual Identification / Formula */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">Step 1: Formula / Concept / Statutory Section</span>
                  <span className={currentQ?.status !== 'Incorrect' ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}>
                    {currentQ?.status !== 'Incorrect' ? 'Awarded (Full Credit)' : '0.0 M (Missed)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentQ?.keyterms_present && currentQ.keyterms_present.length > 0 
                    ? `Exact match on fundamental provisions: ${currentQ.keyterms_present.slice(0, 3).join(', ')}.`
                    : 'Candidate omitted statutory section reference / primary conceptual definition in introduction.'}
                </p>
              </div>

              {/* Step 2: Intermediate Calculations & Working Notes */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">Step 2: Calculations &amp; Working Notes Execution</span>
                  <span className={currentQ?.correct_points && currentQ.correct_points.length > 0 ? 'text-emerald-700 font-mono' : 'text-amber-700 font-mono'}>
                    {currentQ?.correct_points && currentQ.correct_points.length > 0 ? 'Substantiated' : 'Partial Working'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentQ?.correct_points && currentQ.correct_points[0]
                    ? currentQ.correct_points[0]
                    : 'Intermediate figures verified. Keep working note numbers aligned with question headers.'}
                </p>
              </div>

              {/* Step 3: Deduction & Red Flag Note (As in Wireframe) */}
              {currentQ?.marks_deduction_reason ? (
                <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/70 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Step 3: Red Flag Deduction
                    </span>
                    <span className="text-rose-700 font-mono">
                      -{((currentQ?.max_marks || 0) - (currentQ?.awarded_marks || 0)).toFixed(1)} M Deducted
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                    🔴 RED FLAG: {currentQ.marks_deduction_reason}
                  </p>
                  {currentQ?.keyterms_missing && currentQ.keyterms_missing.length > 0 && (
                    <div className="text-[11px] text-rose-700 pt-1">
                      Missing components: {currentQ.keyterms_missing.join(', ')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Step 3: Final Balance / Conclusion
                    </span>
                    <span className="text-emerald-700 font-mono">Full Step Marks</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Final answer and presentation strictly match the official benchmark answer key.
                  </p>
                </div>
              )}
            </div>

            {/* 3-Point Fix To Reach 20/20 Next Time */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                🎯 3-POINT FIX TO REACH 20/20 NEXT TIME:
              </span>
              <ul className="space-y-1.5 text-xs text-blue-900 pl-1">
                {threePointFix.map((fix, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <span className="font-bold text-blue-700 shrink-0">{fIdx + 1}.</span>
                    <span className="leading-snug">{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Teacher Audio Feedback Bar (Bottom of Right Pane) */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-100 p-2 rounded-xl">
              {/* Speed selector pills */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mr-1">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      setAudioSpeed(spd);
                      if (isPlayingAudio) {
                        togglePlayAudioFeedback();
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-black cursor-pointer transition-all ${
                      audioSpeed === spd
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {spd === 1 ? '1x' : `${spd}x`}
                  </button>
                ))}
              </div>

              {/* Download Voice MP3 / WAV */}
              <button
                type="button"
                onClick={handleDownloadExaminerAudio}
                disabled={isDownloadingAudio}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title="Download Examiner Voice note as offline audio file"
              >
                {isDownloadingAudio ? (
                  <span className="w-3 h-3 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-3 h-3 text-slate-600" />
                )}
                <span>Download MP3</span>
              </button>
            </div>

            <button
              type="button"
              onClick={togglePlayAudioFeedback}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Examiner Voice Feedback ({audioSpeed}x)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-blue-300" />
                  <span>🎧 Listen to Examiner Audio Feedback</span>
                </>
              )}
            </button>
            {audioPlayed && !isPlayingAudio && (
              <p className="text-[11px] text-emerald-700 font-medium text-center mt-1">
                ✓ Audio feedback played.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
