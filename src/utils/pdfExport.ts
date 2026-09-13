import { EvaluationResult } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDFReport(evaluation: EvaluationResult, elementId?: string): Promise<void> {
  const targetId = elementId || (document.getElementById('certified-evaluated-answer-sheet') ? 'certified-evaluated-answer-sheet' : 'printable-evaluation-report');
  const element = document.getElementById(targetId);
  
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeTitle = (evaluation.test_title || 'Certified_Evaluation_Copy').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeTitle}_Certified_Evaluated_Copy.pdf`);
      return;
    } catch (err) {
      console.warn('Canvas PDF generation fallback to direct programmatic PDF:', err);
    }
  }

  // Programmatic fallback for complete Multi-Page Certified Report
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('ICAI / CBSE Certified Examination Evaluation', 20, y);
  y += 8;

  doc.setFontSize(13);
  doc.setTextColor(79, 70, 229);
  doc.text(`${evaluation.test_title} (${evaluation.subject})`, 20, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Evaluated on: ${new Date(evaluation.evaluated_at).toLocaleDateString()} | File: ${evaluation.file_name || 'AnswerSheet.pdf'}`, 20, y);
  y += 10;

  // Score Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, y, 170, 20, 3, 3, 'FD');
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Score: ${evaluation.total_obtained_marks} / ${evaluation.total_max_marks} (${evaluation.percentage}%)`, 26, y + 13);
  y += 28;

  // Questions
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Question-Wise Certified Markings:', 20, y);
  y += 7;

  evaluation.questions.forEach((q) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${q.question_id}: +${q.awarded_marks} / ${q.max_marks} Marks [${q.status}]`, 20, y);
    y += 5;

    if (q.marks_deduction_reason) {
      doc.setTextColor(185, 28, 28);
      const splitReason = doc.splitTextToSize(`[Deduction] ${q.marks_deduction_reason}`, 165);
      doc.text(splitReason, 24, y);
      y += splitReason.length * 4 + 2;
    }
    if (q.keyterms_present && q.keyterms_present.length > 0) {
      doc.setTextColor(16, 185, 129);
      doc.text(`[Key Concepts ✓] ${q.keyterms_present.join(', ')}`, 24, y);
      y += 5;
    }
    y += 3;
  });

  // End-of-Test Diagnostic Page 1
  doc.addPage();
  y = 20;
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Diagnostic Report: Why Performance Slipped & Key Mistake Anatomy', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('Major Weaknesses & Lost Marks Breakdown:', 20, y);
  y += 6;

  const weaknesses = evaluation.performance_analysis?.weaknesses || ['Numerical working steps need improvement'];
  weaknesses.forEach(w => {
    doc.text(`• ${w}`, 25, y);
    y += 5;
  });

  y += 6;
  doc.text('Examiner Overall Verdict:', 20, y);
  y += 5;
  const splitFeedback = doc.splitTextToSize(evaluation.performance_analysis?.teacher_overall_feedback || 'Review recommended topics.', 165);
  doc.text(splitFeedback, 25, y);
  y += splitFeedback.length * 4 + 10;

  // End-of-Test Diagnostic Page 2
  doc.addPage();
  y = 20;
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Presentation Diagnosis & Topper Action Blueprint', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('Recommended Study & Step Improvement Plan:', 20, y);
  y += 6;

  const plan = evaluation.performance_analysis?.recommended_study_plan || ['Practice 3 numericals daily with full working notes'];
  plan.forEach((step, idx) => {
    doc.text(`${idx + 1}. ${step}`, 25, y);
    y += 6;
  });

  const safeTitle = (evaluation.test_title || 'Certified_Evaluation_Copy').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeTitle}_Certified_Evaluated_Copy.pdf`);
}
