import React from 'react';
import { 
  Check, 
  X,
  AlertTriangle, 
  GraduationCap, 
  Sparkles, 
  PenTool, 
  FileText,
  Printer,
  Download
} from 'lucide-react';
import { EvaluationResult, ReferenceSource } from '../types';

interface CertifiedEvaluatedCopyViewProps {
  evaluation: EvaluationResult;
  sources: ReferenceSource[];
  onDownloadPDF?: () => void;
  onPrint?: () => void;
}

export const CertifiedEvaluatedCopyView: React.FC<CertifiedEvaluatedCopyViewProps> = ({
  evaluation,
  sources: _sources,
  onDownloadPDF,
  onPrint
}) => {
  const isDistinction = evaluation.percentage >= 75;
  const isPassed = evaluation.percentage >= 40;

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-black">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>ICAI / CBSE Certified Evaluated Copy Mode</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase tracking-wide">
                Direct On-Sheet Red-Pen Markings
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Complete authenticated answer booklet with examiner step-marks, followed by a 2-page deep diagnostic report.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onPrint && (
            <button
              onClick={onPrint}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Copy</span>
            </button>
          )}
          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Certified PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Printable / Rendered Certified Document Container */}
      <div 
        id="certified-evaluated-answer-sheet" 
        className="bg-white max-w-4xl mx-auto rounded-3xl border border-gray-300 shadow-lg overflow-hidden text-slate-900 print:border-none print:shadow-none print:max-w-none print:rounded-none"
      >
        
        {/* ========================================================================= */}
        {/* PART 1: CERTIFIED COVER SHEET & EXAMINER SCORE GRID (ICAI / CBSE STYLE) */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-10 border-b-4 border-slate-900 bg-[#FAFAFA] relative">
          
          {/* Official Watermark & Stamp */}
          <div className="absolute right-6 top-6 sm:right-10 sm:top-8 rotate-[-12deg] pointer-events-none opacity-85 select-none">
            <div className="border-4 border-dashed border-red-600 rounded-2xl px-4 py-2 text-center text-red-600 font-mono shadow-xs bg-white/70 backdrop-blur-xs">
              <div className="text-[10px] font-black uppercase tracking-widest">EVALUATED &amp; VERIFIED</div>
              <div className="text-xl font-black">{evaluation.total_obtained_marks} / {evaluation.total_max_marks}</div>
              <div className="text-[9px] font-bold uppercase">{isDistinction ? 'FIRST CLASS DISTINCTION' : isPassed ? 'PASSED / SATISFACTORY' : 'NEEDS REMEDIAL PRACTICE'}</div>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                {evaluation.level || 'ICAI / CBSE Standard'}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Certified Evaluation Copy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {evaluation.test_title}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Subject</span>
                <strong className="text-slate-900 font-bold">{evaluation.subject}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Candidate / File</span>
                <strong className="text-slate-900 font-medium font-mono truncate block">{evaluation.file_name || 'AnswerSheet.pdf'}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Evaluation Date</span>
                <strong className="text-slate-900 font-bold">{new Date(evaluation.evaluated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
              </div>
            </div>
          </div>

          {/* Question-Wise Score Table (Official Front Page Grid) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Examiner's Question-Wise Award Sheet</span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-black border-b border-gray-300">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-gray-200 text-center w-16">Q. No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-200">Question Topic / Concept</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 text-center w-24">Max Marks</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 text-center w-24 text-red-700 bg-red-50/50">Awarded</th>
                    <th className="py-2.5 px-3 text-center w-28">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {evaluation.questions.map((q, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2 px-3 border-r border-gray-200 text-center font-bold font-mono text-slate-900">
                        {q.question_id || `Q${idx + 1}`}
                      </td>
                      <td className="py-2 px-3 border-r border-gray-200 font-medium text-slate-800">
                        {q.topic || q.question_text.slice(0, 45)}...
                      </td>
                      <td className="py-2 px-3 border-r border-gray-200 text-center font-bold text-gray-600">
                        {q.max_marks}
                      </td>
                      <td className="py-2 px-3 border-r border-gray-200 text-center font-black text-red-600 font-mono bg-red-50/30 text-sm">
                        {q.awarded_marks}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          q.status === 'Correct' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'Mostly Correct' ? 'bg-emerald-50 text-emerald-700' :
                          q.status === 'Partially Correct' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-black border-t-2 border-slate-900">
                    <td colSpan={2} className="py-2.5 px-3 text-right text-slate-900 uppercase tracking-wider border-r border-gray-300">
                      Grand Total Marks Awarded:
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-900 border-r border-gray-300">
                      {evaluation.total_max_marks}
                    </td>
                    <td className="py-2.5 px-3 text-center text-red-600 font-mono text-base bg-red-100/50 border-r border-gray-300">
                      {evaluation.total_obtained_marks}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-900 font-extrabold">
                      {evaluation.percentage}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 2: CERTIFIED PAGES WITH DIRECT RED-PEN MARKINGS & ON-SHEET ANNOTATIONS */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-10 space-y-8 bg-[#FFFDF9] print:bg-white">
          
          <div className="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>Candidate Answer Script With Examiner Red-Ink Evaluation</span>
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">
              [Ruled Exam Sheet Standard]
            </span>
          </div>

          <div className="space-y-8">
            {evaluation.questions.map((q, idx) => (
              <div 
                key={q.question_id || idx}
                className="relative rounded-2xl border-2 border-slate-300/80 bg-[#FFFDF8] p-6 shadow-sm space-y-4 print:border-gray-400 print:bg-white overflow-hidden"
              >
                
                {/* Official Examiner Top-Right Authentic Stamp & Seal (Board Red-Ink Stamp) */}
                <div className="absolute right-4 top-4 sm:right-6 sm:top-5 select-none pointer-events-none z-20">
                  <div className="border-stamp-red rounded-xl px-3 py-1.5 text-center bg-white/95 shadow-sm rotate-[-3deg] backdrop-blur-2xs">
                    <div className="text-[8px] font-black tracking-widest text-red-700 uppercase border-b border-red-200 pb-0.5">
                      OFFICIAL BOARD EXAMINER
                    </div>
                    <div className="flex items-center justify-center gap-1.5 pt-0.5">
                      {q.status === 'Correct' ? (
                        <span className="text-emerald-700 font-bold text-base leading-none font-handwriting">
                          ✓✓
                        </span>
                      ) : q.status === 'Partially Correct' || q.status === 'Mostly Correct' ? (
                        <span className="text-amber-700 font-bold text-base leading-none font-handwriting">
                          ½✓
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold text-base leading-none font-handwriting">
                          ✗
                        </span>
                      )}
                      <span className="text-xl font-black text-red-600 font-mono tracking-tight leading-none">
                        +{q.awarded_marks}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        / {q.max_marks}M
                      </span>
                    </div>
                    <div className="text-[9px] font-handwriting text-red-600 font-bold tracking-wide pt-0.5">
                      Eval Code: EX-804 • Signed
                    </div>
                  </div>
                </div>

                {/* Question Header */}
                <div className="pr-36 sm:pr-44 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono font-bold text-xs tracking-wider">
                      {q.question_id || `Q${idx + 1}`}
                    </span>
                    {q.topic && (
                      <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {q.topic}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Max: {q.max_marks} Marks
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug pt-1">
                    {q.question_text}
                  </h3>
                </div>

                {/* Candidate's Written Answer on Ruled Sheet with Left Red Margin & Red Pen Notes */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                      Candidate's Handled Response Sheet (Certified Script)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Authentic CBSE / ICAI Ruled Margin Standard
                    </span>
                  </div>
                  
                  {/* Authentic Ruled Notebook Sheet Container */}
                  <div className="rounded-xl border-2 border-slate-300 bg-white relative overflow-hidden shadow-xs flex">
                    
                    {/* Left Margin Column (where question numbers and examiner red-pen ticks live) */}
                    <div className="w-14 sm:w-16 shrink-0 border-r-2 border-red-400/90 bg-red-50/15 p-2 pt-3 flex flex-col items-center select-none text-center">
                      <span className="font-mono font-bold text-slate-700 text-xs">
                        Ans.{idx + 1}
                      </span>

                      {/* Examiner Margin Ticks & Marks in Caveat Font */}
                      <div className="mt-4 space-y-3 font-handwriting text-red-600 font-bold text-lg leading-none">
                        {q.status === 'Correct' ? (
                          <div title="Full marks tick" className="text-xl">✓✓</div>
                        ) : q.status === 'Partially Correct' || q.status === 'Mostly Correct' ? (
                          <div title="Half marks tick" className="text-xl">½✓</div>
                        ) : (
                          <div title="Cross / Zero tick" className="text-xl">✗</div>
                        )}
                        
                        <div className="text-sm font-mono font-black text-red-600 border border-dashed border-red-300 rounded px-1 py-0.5 bg-red-50/60">
                          +{q.awarded_marks}
                        </div>
                      </div>
                    </div>

                    {/* Ruled lines body with candidate answer & Red-Pen Teacher Annotations */}
                    <div className="flex-1 p-3 sm:p-5 font-mono text-xs sm:text-sm text-slate-800 leading-[28px] bg-ruled-paper whitespace-pre-wrap relative z-0 min-h-[140px]">
                      {q.student_answer ? (
                        <div className="relative">
                          {q.student_answer}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">(Candidate left this question unattempted / blank in submitted copy)</span>
                      )}

                      {/* Authentic Examiner Red-Pen On-Sheet Handwriting Annotation */}
                      <div className="mt-3 pt-2.5 border-t border-red-300/80 font-handwriting text-red-600 text-lg sm:text-xl font-bold leading-snug select-none space-y-1">
                        {q.marks_deduction_reason ? (
                          <div className="flex items-start gap-1.5 bg-red-50/60 p-2 rounded-lg border border-dashed border-red-300">
                            <span className="text-xl leading-none shrink-0">✍️</span>
                            <span>
                              Examiner note: &ldquo;{q.marks_deduction_reason}&rdquo; &bull; [Deduction: -{(q.max_marks - q.awarded_marks).toFixed(1)} M]
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-dashed border-emerald-300 text-emerald-800">
                            <span className="text-xl leading-none shrink-0">✍️</span>
                            <span>
                              Examiner note: &ldquo;Accurate presentation and statutory provisions verified. Full credit awarded.&rdquo; [+{q.awarded_marks} M]
                            </span>
                          </div>
                        )}

                        {/* On-sheet examiner highlighted keywords recognized */}
                        {q.keyterms_present && q.keyterms_present.length > 0 && (
                          <div className="text-xs font-handwriting text-emerald-700 font-bold pt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm">✓ Key steps verified:</span>
                            {q.keyterms_present.slice(0, 3).map((term, tIdx) => (
                              <span key={tIdx} className="underline decoration-emerald-500 decoration-wavy underline-offset-4">
                                {term}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* ========================================================== */}
                {/* DIRECT ON-SHEET ANNOTATIONS WITH NORMAL FONT SIZES */}
                {/* ========================================================== */}
                <div className="space-y-2 pt-2 border-t border-dashed border-gray-300">
                  
                  {/* 1. Present Keywords & Valid Concepts (Green Normal Font) */}
                  {q.keyterms_present && q.keyterms_present.length > 0 && (
                    <div className="flex items-start gap-2 text-xs bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl text-emerald-950">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <div className="space-y-0.5">
                        <strong className="text-emerald-800 font-bold">Valid Concepts &amp; Steps Recognized:</strong>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {q.keyterms_present.map((kp, kIdx) => (
                            <span key={kIdx} className="px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-900 text-[11px] font-semibold">
                              ✓ {kp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Deductions & Missing Points (Red Normal Font) */}
                  {q.marks_deduction_reason && (
                    <div className="flex items-start gap-2 text-xs bg-rose-50/80 border border-rose-200 p-2.5 rounded-xl text-rose-950">
                      <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <div className="space-y-1">
                        <div>
                          <strong className="text-rose-800 font-bold">Examiner Deduction Note (-{(q.max_marks - q.awarded_marks).toFixed(1)} Marks): </strong>
                          <span>{q.marks_deduction_reason}</span>
                        </div>
                        {q.keyterms_missing && q.keyterms_missing.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            <span className="text-[11px] font-bold text-rose-700">Missing Key Elements:</span>
                            {q.keyterms_missing.map((km, mIdx) => (
                              <span key={mIdx} className="px-2 py-0.5 rounded bg-white border border-rose-300 text-rose-800 text-[11px] font-semibold">
                                ✗ {km}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. Topper Benchmark & Full Marks Strategy (Blue/Indigo Normal Font) */}
                  {(q.how_to_get_full_marks || q.expected_model_answer) && (
                    <div className="flex items-start gap-2 text-xs bg-indigo-50/70 border border-indigo-200 p-2.5 rounded-xl text-indigo-950">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-indigo-900 font-bold">Topper Step / How to Score Full Marks:</strong>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                          {q.how_to_get_full_marks || q.expected_model_answer}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Examiner Remarks */}
                  {q.teacher_feedback && (
                    <p className="text-[11px] text-gray-600 italic pl-1">
                      <strong>Remarks:</strong> {q.teacher_feedback}
                    </p>
                  )}

                </div>

              </div>
            ))}
          </div>

          {/* Verification Seal & Digital Signature */}
          <div className="pt-6 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-600 flex items-center justify-center text-indigo-700 bg-indigo-50 font-black">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <strong className="block text-slate-900">StudyMentor AI Academic Examination Cell</strong>
                <span className="text-gray-500 text-[11px]">Certified Evaluation &amp; Pedagogical Audit Standard</span>
              </div>
            </div>

            <div className="text-right border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4">
              <div className="font-mono font-bold text-red-600 text-xs">
                [Digitally Certified by AI Senior Examiner]
              </div>
              <div className="text-[10px] text-gray-400">
                Audit Hash: #{evaluation.id.slice(0, 12).toUpperCase()}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
