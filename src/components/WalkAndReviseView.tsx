import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Flame, 
  Award, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  BrainCircuit, 
  Zap, 
  Check, 
  ChevronRight, 
  AlertTriangle,
  BarChart3,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Headphones,
  Trash2
} from 'lucide-react';
import { 
  AcademicJourney, 
  WalkDrillMode, 
  WalkDrillSet, 
  WalkDrillQuestion, 
  EvaluationResult, 
  ActiveTab,
  UserProfile 
} from '../types';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { saveEvaluation, toggleEvaluationAnalysisInclusion } from '../utils/storage';
import { cleanRepeatedPhrases, mergeSpeechTranscripts } from '../utils/speechUtils';
import { checkGuestQuota, consumeGuestQuota, isUserGuest } from '../utils/guestManager';
import { 
  playSpeechWithRate, 
  stopCurrentSpeech, 
  generateSynthesizedWavBlob, 
  triggerFileDownload 
} from '../utils/audioExporter';

interface WalkAndReviseViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (j: AcademicJourney) => void;
  onEvaluationComplete: (evalResult: EvaluationResult) => void;
  setActiveTab: (tab: ActiveTab) => void;
  initialSubject?: string;
  initialChapter?: string;
  activeProfile?: UserProfile | null;
  onTriggerGuestLimit?: (featureName: string, message?: string) => void;
}

export const WalkAndReviseView: React.FC<WalkAndReviseViewProps> = ({
  currentJourney,
  setCurrentJourney,
  onEvaluationComplete,
  setActiveTab,
  initialSubject,
  initialChapter,
  activeProfile,
  onTriggerGuestLimit
}) => {
  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];

  // Setup form states
  const [selectedSubject, setSelectedSubject] = useState<string>(
    initialSubject || journeyDef.subjects[0]?.name || 'Accountancy'
  );
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>(
    initialChapter || journeyDef.subjects[0]?.chapters[0] || 'Fundamentals of Partnership'
  );
  const [drillMode, setDrillMode] = useState<WalkDrillMode>('mcq_sprint');
  const [difficulty, setDifficulty] = useState<string>('Exam Standard');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [pyqMode, setPyqMode] = useState<boolean>(true);
  const [pyqYearRange, setPyqYearRange] = useState<string>('2015-2025');

  // Execution states
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDrill, setActiveDrill] = useState<WalkDrillSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Student Answers
  // For MCQs: { [qId]: selectedOptionIndex }
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  // For Theory / Rapid Q&A: { [qId]: string }
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechLanguage, setSpeechLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [liveInterimText, setLiveInterimText] = useState<string>('');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const activeQuestionIdRef = useRef<string>('');
  const sessionBaseAnswerRef = useRef<string>('');
  const userWantsListeningRef = useRef<boolean>(false);

  // Audio Playback & Speed Controls (0.75x, 1x, 1.25x, 1.5x, 2x)
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPodcastActive, setIsPodcastActive] = useState<boolean>(false);
  const [isExportingAudio, setIsExportingAudio] = useState<boolean>(false);

  // Drill evaluation and progress states
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [completedEvaluation, setCompletedEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [includeInAnalysis, setIncludeInAnalysis] = useState<boolean>(true);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
    };
  }, []);

  // Stop speech when changing question unless podcast mode is active
  useEffect(() => {
    if (!isPodcastActive) {
      stopCurrentSpeech();
      setIsPlayingAudio(false);
    }
  }, [currentQuestionIndex]);

  // Play / Pause audio readout for current question
  const handleTogglePlayQuestionAudio = (targetQuestion?: WalkDrillQuestion) => {
    const q = targetQuestion || activeDrill?.questions[currentQuestionIndex];
    if (!q) return;

    if (isPlayingAudio && !isPodcastActive) {
      stopCurrentSpeech();
      setIsPlayingAudio(false);
      return;
    }

    let speechText = `Question ${q.question_number || currentQuestionIndex + 1}. ${q.question_text}. `;
    if (q.options && q.options.length > 0) {
      speechText += `Options are: Option A, ${q.options[0]}. Option B, ${q.options[1]}. Option C, ${q.options[2]}. Option D, ${q.options[3]}. `;
    }
    if (q.sub_topic) {
      speechText += `Focus area is ${q.sub_topic}. `;
    }

    setIsPlayingAudio(true);
    playSpeechWithRate(speechText, {
      rate: audioPlaybackSpeed,
      lang: speechLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN',
      onEnd: () => {
        setIsPlayingAudio(false);
      },
      onError: () => {
        setIsPlayingAudio(false);
      }
    });
  };

  // Play full drill as continuous hands-free revision podcast
  const handleToggleContinuousPodcast = () => {
    if (!activeDrill || activeDrill.questions.length === 0) return;

    if (isPodcastActive) {
      stopCurrentSpeech();
      setIsPodcastActive(false);
      setIsPlayingAudio(false);
      return;
    }

    setIsPodcastActive(true);
    setIsPlayingAudio(true);

    let fullScript = `Starting Walk and Revise audio podcast for ${activeDrill.subject}, Chapter: ${activeDrill.chapter}. There are ${activeDrill.questions.length} high-yield questions. `;

    activeDrill.questions.forEach((q, idx) => {
      fullScript += `Question number ${idx + 1}. ${q.question_text}. `;
      if (q.options && q.options.length > 0) {
        fullScript += `Option A: ${q.options[0]}. Option B: ${q.options[1]}. Option C: ${q.options[2]}. Option D: ${q.options[3]}. `;
        if (q.explanation) {
          fullScript += `Explanation: ${q.explanation}. `;
        }
      } else if (q.model_answer) {
        fullScript += `Model statutory answer: ${q.model_answer}. `;
      }
      fullScript += ` Next concept. `;
    });

    playSpeechWithRate(fullScript, {
      rate: audioPlaybackSpeed,
      lang: speechLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN',
      onEnd: () => {
        setIsPodcastActive(false);
        setIsPlayingAudio(false);
      },
      onError: () => {
        setIsPodcastActive(false);
        setIsPlayingAudio(false);
      }
    });
  };

  // Direct Audio Download (.WAV / MP3)
  const handleDownloadWavPodcast = async () => {
    if (!activeDrill) return;
    setIsExportingAudio(true);
    try {
      let podcastScript = `${activeDrill.title}. Subject: ${activeDrill.subject}. Topic: ${activeDrill.chapter}.\n\n`;
      activeDrill.questions.forEach((q, idx) => {
        podcastScript += `Q${idx + 1}: ${q.question_text}\n`;
        if (q.options && q.options.length > 0) {
          podcastScript += `Options: A) ${q.options[0]} B) ${q.options[1]} C) ${q.options[2]} D) ${q.options[3]}\n`;
        }
        if (q.explanation) {
          podcastScript += `Explanation: ${q.explanation}\n`;
        }
        if (q.model_answer) {
          podcastScript += `Model Answer: ${q.model_answer}\n`;
        }
        podcastScript += `\n`;
      });

      const audioBlob = await generateSynthesizedWavBlob(podcastScript, activeDrill.title);
      const safeFileName = `${activeDrill.subject}_${activeDrill.chapter}_Revision_Audio.wav`.replace(/[^a-zA-Z0-9._-]/g, '_');
      triggerFileDownload(audioBlob, safeFileName);
    } catch (err: any) {
      alert('Audio download ready: ' + (err.message || 'Complete'));
    } finally {
      setIsExportingAudio(false);
    }
  };

  // Sync active question ID for voice recognition
  useEffect(() => {
    activeQuestionIdRef.current = activeDrill?.questions[currentQuestionIndex]?.question_id || '';
    setLiveInterimText('');
  }, [activeDrill, currentQuestionIndex]);

  // Update selected subject/chapter when journey changes
  useEffect(() => {
    const defaultSub = journeyDef.subjects[0]?.name || '';
    setSelectedSubject(defaultSub);
    const defaultCh = journeyDef.subjects[0]?.chapters[0] || '';
    setSelectedChapter(defaultCh);
  }, [currentJourney]);

  // Update chapter when subject changes
  const handleSubjectChange = (subName: string) => {
    setSelectedSubject(subName);
    setSelectedUnitFilter('all');
    const subObj = journeyDef.subjects.find(s => s.name === subName);
    if (subObj && subObj.chapters.length > 0) {
      setSelectedChapter(subObj.chapters[0]);
    }
  };

  // Check speech recognition capability
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleSpeechRecognition = async () => {
    setMicErrorMessage(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
      setMicErrorMessage('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari, or type your answer.');
      return;
    }

    if (isListening) {
      userWantsListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      const qId = activeQuestionIdRef.current;
      if (liveInterimText.trim() && qId) {
        setTheoryAnswers(prev => {
          const current = (prev[qId] || '').trim();
          const combined = cleanRepeatedPhrases(mergeSpeechTranscripts([current, liveInterimText.trim()]));
          return {
            ...prev,
            [qId]: combined
          };
        });
        setLiveInterimText('');
      }
      return;
    }

    userWantsListeningRef.current = true;

    // Set baseline answer for current question to avoid repeating existing text
    const activeQId = activeQuestionIdRef.current;
    sessionBaseAnswerRef.current = (activeQId && theoryAnswers[activeQId]) ? theoryAnswers[activeQId] : '';

    // Proactively request mic stream to trigger browser permission dialog if needed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission check notice:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicErrorMessage('Microphone access is blocked. Please click the lock/settings icon in your browser address bar to allow microphone access, or open the app in a new tab.');
          userWantsListeningRef.current = false;
          return;
        }
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = speechLanguage;

      rec.onstart = () => {
        setIsListening(true);
        setMicErrorMessage(null);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        const finalizedChunks: string[] = [];

        for (let i = 0; i < event.results.length; ++i) {
          const piece = (event.results[i][0]?.transcript || '').trim();
          if (!piece) continue;
          if (event.results[i].isFinal) {
            finalizedChunks.push(piece);
          } else {
            // Keep the latest interim hypothesis
            interim = piece;
          }
        }

        const qId = activeQuestionIdRef.current;
        if (qId) {
          const base = sessionBaseAnswerRef.current ? sessionBaseAnswerRef.current.trim() : '';
          let combined = '';
          if (finalizedChunks.length > 0) {
            const mergedFinals = mergeSpeechTranscripts(finalizedChunks);
            combined = base ? mergeSpeechTranscripts([base, mergedFinals]) : mergedFinals;
          } else {
            combined = base;
          }

          combined = cleanRepeatedPhrases(combined);
          setTheoryAnswers(prev => ({
            ...prev,
            [qId]: combined
          }));
        }
        setLiveInterimText(cleanRepeatedPhrases(interim));
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setMicErrorMessage('Microphone permission was denied. Please allow microphone in browser address bar (click lock/settings icon) or open the app in a new tab.');
          userWantsListeningRef.current = false;
        } else if (event.error === 'network') {
          setMicErrorMessage('Speech recognition network service error. You can still type your answer.');
          userWantsListeningRef.current = false;
        } else if (event.error === 'audio-capture') {
          setMicErrorMessage('No working microphone found. Please connect a microphone or type your answer.');
          userWantsListeningRef.current = false;
        } else if (event.error !== 'no-speech') {
          setMicErrorMessage(`Speech notice: ${event.error}. You can still type your answer.`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        const qId = activeQuestionIdRef.current;
        if (qId) {
          setTheoryAnswers(prev => {
            const curr = prev[qId] || '';
            return {
              ...prev,
              [qId]: cleanRepeatedPhrases(curr)
            };
          });
        }
        setLiveInterimText('');

        // If listening mode is still active (user did not tap Stop), restart for seamless walk dictation
        if (userWantsListeningRef.current) {
          if (qId) {
            setTheoryAnswers(prev => {
              sessionBaseAnswerRef.current = prev[qId] || '';
              return prev;
            });
          }
          try {
            rec.start();
            setIsListening(true);
            return;
          } catch (e) {
            setIsListening(false);
            userWantsListeningRef.current = false;
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (err: any) {
      console.warn('Speech start error:', err);
      setMicErrorMessage('Could not activate microphone. Please check your browser microphone permission.');
      setIsListening(false);
      userWantsListeningRef.current = false;
    }
  };

  // Generate drill via backend
  const handleStartDrill = async () => {
    // Guest quota enforcement (Bypassed 100% for registered/approved students & admins)
    if (isUserGuest(activeProfile)) {
      const quota = checkGuestQuota('walk');
      if (!quota.canProceed) {
        if (onTriggerGuestLimit) {
          onTriggerGuestLimit('Walk & Revise', quota.message);
        } else {
          alert(quota.message || 'Daily limit of 2 Walk & Revise sessions reached for Guest Mode.');
        }
        return;
      }
    }

    setIsGenerating(true);
    setActiveDrill(null);
    setMcqAnswers({});
    setTheoryAnswers({});
    setCurrentQuestionIndex(0);
    setDrillCompleted(false);
    setCompletedEvaluation(null);

    try {
      const res = await fetch('/api/generate-walk-drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journey: currentJourney,
          level: journeyDef.badge,
          subject: selectedSubject,
          chapter: selectedChapter,
          drillMode,
          difficulty,
          numQuestions,
          pyqMode,
          pyqYearRange
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate drill from AI.');
      }

      const data = await res.json();
      if (data.success && data.drill) {
        setActiveDrill(data.drill);
        if (isUserGuest(activeProfile)) {
          consumeGuestQuota('walk');
        }
      } else {
        throw new Error(data.error || 'Invalid drill data received.');
      }
    } catch (err: any) {
      alert(`Drill generation note: ${err.message || 'Please try again.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle MCQ selection
  const handleSelectOption = (qId: string, optionIdx: number) => {
    setMcqAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Global Keyboard Shortcuts for Rapid Focus Mode
  useEffect(() => {
    if (!activeDrill || drillCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable);

      // Spacebar for Voice Recording (when not typing in textarea, or if Alt+Space pressed)
      if ((e.code === 'Space' && !isInputActive) || (e.code === 'Space' && e.altKey)) {
        e.preventDefault();
        toggleSpeechRecognition();
        return;
      }

      // If user is actively typing in a textarea, do not intercept normal arrow or digit keys unless Alt or Ctrl is held
      if (isInputActive && !e.altKey && !e.ctrlKey) return;

      // Right Arrow or 'n': Next question
      if (e.key === 'ArrowRight' || (!isInputActive && e.key.toLowerCase() === 'n')) {
        if (currentQuestionIndex < activeDrill.questions.length - 1) {
          e.preventDefault();
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }

      // Left Arrow or 'p': Previous question
      if (e.key === 'ArrowLeft' || (!isInputActive && e.key.toLowerCase() === 'p')) {
        if (currentQuestionIndex > 0) {
          e.preventDefault();
          setCurrentQuestionIndex(prev => prev - 1);
        }
      }

      // Digit keys 1, 2, 3, 4 for MCQ options
      if (activeDrill.drill_mode !== 'rapid_qa' && !isInputActive) {
        const currentQ = activeDrill.questions[currentQuestionIndex];
        if (currentQ && ['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          if (currentQ.options && currentQ.options[optIdx]) {
            e.preventDefault();
            handleSelectOption(currentQ.question_id, optIdx);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDrill, drillCompleted, currentQuestionIndex, isListening]);

  // Submit and evaluate drill
  const handleSubmitDrill = async () => {
    if (!activeDrill) return;

    // Stop speech recognition if listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // If MCQ Sprint or Case Study MCQ: check client-side instantly!
    if (activeDrill.drill_mode === 'mcq_sprint' || activeDrill.drill_mode === 'case_study_mcq') {
      let correctCount = 0;
      let totalQuestions = activeDrill.questions.length;

      const evaluatedQuestions = activeDrill.questions.map((q, idx) => {
        const studentSelected = mcqAnswers[q.question_id];
        const isCorrect = studentSelected === q.correct_option_index;
        if (isCorrect) correctCount++;

        return {
          question_id: q.question_id,
          question_number: q.question_number || idx + 1,
          question_text: q.question_text,
          max_marks: 1,
          awarded_marks: isCorrect ? 1 : 0,
          status: isCorrect ? ('Correct' as const) : ('Incorrect' as const),
          confidence: 'High' as const,
          student_answer: studentSelected !== undefined && q.options 
            ? q.options[studentSelected] 
            : 'Unattempted',
          expected_model_answer: q.correct_option_index !== undefined && q.options 
            ? q.options[q.correct_option_index] 
            : 'Option ' + (q.correct_option_letter || 'A'),
          keyterms_required: [q.sub_topic || 'Correct Conceptual Option'],
          keyterms_present: isCorrect ? [q.sub_topic || 'Correct Conceptual Option'] : [],
          keyterms_missing: isCorrect ? [] : [q.sub_topic || 'Option ' + (q.correct_option_letter || 'A')],
          correct_points: isCorrect ? ['Selected correct option accurately.'] : [],
          missing_points: isCorrect ? [] : [q.explanation || 'Option ' + (q.correct_option_letter || 'A') + ' was the correct choice.'],
          errors: isCorrect ? [] : ['Distractor option selected.'],
          marks_deduction_reason: isCorrect ? 'None. Full marks awarded.' : 'Incorrect option chosen.',
          how_to_get_full_marks: q.explanation || 'Select correct statutory option.',
          teacher_feedback: q.explanation || (isCorrect ? 'Well done!' : 'Review this concept.'),
          improvement_tip: 'Presentation marks waived in Walk & Revise mode.',
          mistake_categories: isCorrect ? [] : ['Conceptual Error' as const]
        };
      });

      const percentage = Math.round((correctCount / totalQuestions) * 100);

      const evalResult: EvaluationResult = {
        id: `eval_walk_${Date.now()}`,
        test_title: activeDrill.title,
        journey: currentJourney,
        level: journeyDef.badge,
        subject: selectedSubject,
        chapter: selectedChapter,
        mode: 'walk-and-revise',
        excludeFromAnalysis: !includeInAnalysis,
        total_max_marks: totalQuestions,
        total_obtained_marks: correctCount,
        percentage,
        confidence_overall: 'High',
        evaluated_at: new Date().toISOString(),
        stats: {
          total_questions: totalQuestions,
          attempted: Object.keys(mcqAnswers).length,
          correct: correctCount,
          mostly_correct: 0,
          partially_correct: 0,
          incorrect: totalQuestions - correctCount,
          not_attempted: totalQuestions - Object.keys(mcqAnswers).length
        },
        questions: evaluatedQuestions,
        performance_analysis: {
          strengths: [
            `Scored ${correctCount}/${totalQuestions} in ${selectedChapter} speed drill.`,
            'Zero-pen rapid recall accuracy demonstrated.'
          ],
          weaknesses: totalQuestions - correctCount > 0 
            ? [`Review ${totalQuestions - correctCount} missed questions in ${selectedChapter}.`] 
            : [],
          repeated_errors: [],
          topic_breakdown: [
            {
              topic: selectedChapter,
              chapter: selectedChapter,
              max_marks: totalQuestions,
              obtained_marks: correctCount,
              percentage
            }
          ],
          marks_loss_summary: totalQuestions - correctCount > 0 
            ? [{ category: 'Conceptual Error', marks_lost: totalQuestions - correctCount, explanation: 'Incorrect MCQ options selected.' }] 
            : [],
          teacher_overall_feedback: `Walk & Revise MCQ Drill completed. Scored ${percentage}%. Note: No marks deducted for presentation under drill protocol.`,
          recommended_study_plan: [
            'Revise key statutory terms and formulas for rapid recall',
            'Take another rapid drill to cement accuracy'
          ]
        }
      };

      saveEvaluation(evalResult);
      setCompletedEvaluation(evalResult);
      setDrillCompleted(true);
      return;
    }

    // For Rapid Theory / Oral Q&A: send to AI with 100% Presentation Exemption!
    setIsEvaluating(true);
    try {
      const payloadQuestions = activeDrill.questions.map(q => ({
        question_number: q.question_number,
        question_text: q.question_text,
        max_marks: q.max_marks || 3,
        key_terms_required: q.key_terms_required || [],
        model_answer: q.model_answer || '',
        student_answer: theoryAnswers[q.question_id] || 'Unattempted'
      }));

      const res = await fetch('/api/evaluate-walk-drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journey: currentJourney,
          level: journeyDef.badge,
          subject: selectedSubject,
          chapter: selectedChapter,
          drill_title: activeDrill.title,
          questions: payloadQuestions
        })
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate answers.');
      }

      const data = await res.json();
      if (data.success && data.evaluation) {
        const evalRes: EvaluationResult = {
          ...data.evaluation,
          excludeFromAnalysis: !includeInAnalysis,
          mode: 'walk-and-revise'
        };
        saveEvaluation(evalRes);
        setCompletedEvaluation(evalRes);
        setDrillCompleted(true);
      } else {
        throw new Error(data.error || 'Invalid evaluation received.');
      }
    } catch (err: any) {
      alert(`Evaluation note: ${err.message || 'Please retry.'}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Toggle Analysis inclusion on completed evaluation
  const handleToggleAnalysisInclusion = (include: boolean) => {
    setIncludeInAnalysis(include);
    if (completedEvaluation) {
      toggleEvaluationAnalysisInclusion(completedEvaluation.id, include);
      setCompletedEvaluation(prev => prev ? { ...prev, excludeFromAnalysis: !include } : null);
    }
  };

  // Reset to create another drill
  const handleReset = () => {
    setActiveDrill(null);
    setDrillCompleted(false);
    setCompletedEvaluation(null);
    setMcqAnswers({});
    setTheoryAnswers({});
    setCurrentQuestionIndex(0);
  };

  const activeSubjectObj = journeyDef.subjects.find(s => s.name === selectedSubject);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* TOP PRESENTATION EXEMPTION HERO BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden border border-emerald-400/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/30">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>100% Presentation Exemption Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Walk & Revise</span>
              <span className="text-emerald-200 text-sm sm:text-base font-medium font-mono">
                • Zero-Pen Mobile Practice & Voice Drill
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
              Revise on your morning walk, metro, or bed without notebook or pen. Tap fast-fire MCQs or dictate theory with Indian English voice recognition. 
              <strong className="text-white underline decoration-emerald-300 ml-1">
                Zero marks are deducted for formatting, ledger ruling, or handwriting.
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <span className="text-[10px] text-emerald-200 uppercase font-bold block">Current Focus</span>
              <span className="text-xs font-black text-white">{journeyDef.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: DRILL CREATOR SETUP (If no active drill) */}
      {!activeDrill && !drillCompleted && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <span>Configure Your Walking Drill</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Select chapter and drill mode to start practicing anywhere instantly.
              </p>
            </div>

            {/* Academic Journey Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 self-start sm:self-auto overflow-x-auto max-w-full no-scrollbar">
              <button
                onClick={() => setCurrentJourney('CLASS_12')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CLASS_12'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                12th Commerce
              </button>
              <button
                onClick={() => setCurrentJourney('CLASS_12_SCIENCE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CLASS_12_SCIENCE'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                12th Science
              </button>
              <button
                onClick={() => setCurrentJourney('CLASS_12_ARTS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CLASS_12_ARTS'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                12th Arts
              </button>
              <button
                onClick={() => setCurrentJourney('CLASS_11_SCIENCE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CLASS_11_SCIENCE'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                11th Science
              </button>
              <button
                onClick={() => setCurrentJourney('CLASS_11_COMMERCE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CLASS_11_COMMERCE'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                11th Commerce
              </button>
              <button
                onClick={() => setCurrentJourney('CLASS_11_ARTS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CLASS_11_ARTS'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                11th Arts
              </button>
              <button
                onClick={() => setCurrentJourney('CA_FOUNDATION')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentJourney === 'CA_FOUNDATION'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CA Foundation
              </button>
              <button
                onClick={() => setCurrentJourney('CA_INTERMEDIATE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentJourney === 'CA_INTERMEDIATE'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CA Intermediate
              </button>
              <button
                onClick={() => setCurrentJourney('CA_FINAL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentJourney === 'CA_FINAL'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CA Final ICAI
              </button>
              <button
                onClick={() => setCurrentJourney('NEET')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentJourney === 'NEET'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                NEET (UG)
              </button>
              <button
                onClick={() => setCurrentJourney('JEE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentJourney === 'JEE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                JEE (Main & Adv)
              </button>
              <button
                onClick={() => setCurrentJourney('CUET')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentJourney === 'CUET'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CUET (UG)
              </button>
            </div>
          </div>

          {/* Drill Mode Selection Tiles */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              1. Choose Drill Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              {/* Option A: MCQ Sprint */}
              <div
                onClick={() => setDrillMode('mcq_sprint')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  drillMode === 'mcq_sprint'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Zap className="w-5 h-5" />
                  </span>
                  {drillMode === 'mcq_sprint' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">MCQ Sprint</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Fast-fire 4-option questions with instant explanation, ideal for walking & quick recall.
                </p>
              </div>

              {/* Option B: Case Study MCQ */}
              <div
                onClick={() => setDrillMode('case_study_mcq')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  drillMode === 'case_study_mcq'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
                    <Layers className="w-5 h-5" />
                  </span>
                  {drillMode === 'case_study_mcq' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Case Study MCQs</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  A realistic board/ICAI case scenario followed by comprehension MCQs.
                </p>
              </div>

              {/* Option C: Rapid Q&A (Voice & Type) */}
              <div
                onClick={() => setDrillMode('rapid_qa')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  drillMode === 'rapid_qa'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Mic className="w-5 h-5" />
                  </span>
                  {drillMode === 'rapid_qa' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Rapid Oral Q&A (Voice/Type)</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  High-yield statutory questions. Dictate answers aloud with Indian English voice detection.
                </p>
              </div>

            </div>
          </div>

          {/* Subject & Chapter Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                2. Select Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {journeyDef.subjects.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  3. Select Chapter / Topic
                </label>
                {activeSubjectObj?.units && (
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {activeSubjectObj.chapters.length} Discrete Chapters
                  </span>
                )}
              </div>

              {/* Unit Tabs for Subject with Parts / Units (e.g. Macro vs Indian Economic Development) */}
              {activeSubjectObj?.units && activeSubjectObj.units.length > 0 && (
                <div className="flex flex-wrap gap-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedUnitFilter('all')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedUnitFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({activeSubjectObj.chapters.length})
                  </button>
                  {activeSubjectObj.units.map(u => {
                    const shortUnitLabel = u.unitName.includes(':') 
                      ? u.unitName.split(':')[0] + ': ' + u.unitName.split(':')[1].split('(')[0].trim() 
                      : u.unitName;
                    return (
                      <button
                        key={u.unitName}
                        type="button"
                        onClick={() => {
                          setSelectedUnitFilter(u.unitName);
                          if (!u.chapters.includes(selectedChapter) && u.chapters.length > 0) {
                            setSelectedChapter(u.chapters[0]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedUnitFilter === u.unitName
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {shortUnitLabel} ({u.chapters.length})
                      </button>
                    );
                  })}
                </div>
              )}

              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {activeSubjectObj?.units ? (
                  selectedUnitFilter === 'all' ? (
                    activeSubjectObj.units.map(u => (
                      <optgroup key={u.unitName} label={u.unitName}>
                        <option value={`Unit: ${u.unitName}`}>
                          ⭐ Entire {u.unitName} ({u.chapters.length} chapters combined)
                        </option>
                        {u.chapters.map(ch => (
                          <option key={ch} value={ch}>• Chapter: {ch}</option>
                        ))}
                      </optgroup>
                    ))
                  ) : (
                    activeSubjectObj.units
                      .filter(u => u.unitName === selectedUnitFilter)
                      .map(u => (
                        <optgroup key={u.unitName} label={u.unitName}>
                          <option value={`Unit: ${u.unitName}`}>
                            ⭐ Entire {u.unitName} ({u.chapters.length} chapters combined)
                          </option>
                          {u.chapters.map(ch => (
                            <option key={ch} value={ch}>• Chapter: {ch}</option>
                          ))}
                        </optgroup>
                      ))
                  )
                ) : (
                  activeSubjectObj?.chapters.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))
                )}
              </select>

              {/* Active Unit Badge Indicator */}
              {activeSubjectObj?.units && (
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                  <span className="font-bold text-indigo-700">Section:</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[10px] border border-slate-200">
                    {activeSubjectObj.units.find(u => u.chapters.includes(selectedChapter))?.unitName || 'General'}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Configuration Parameters: Question count, Difficulty, PYQ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Questions Count
              </label>
              <div className="flex items-center gap-2">
                {[3, 5, 10].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setNumQuestions(count)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      numQuestions === count
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="Exam Standard">Exam Standard (Official)</option>
                <option value="Easy">Easy (Confidence Builder)</option>
                <option value="Medium">Medium (Concept Check)</option>
                <option value="Hard">Hard (Topper Level)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                10-Year PYQ Pool (2015-2025)
              </label>
              <div 
                onClick={() => setPyqMode(!pyqMode)}
                className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  pyqMode
                    ? 'bg-indigo-50/80 border-indigo-200 text-indigo-800'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Official PYQs Only</span>
                </span>
                <span className={`w-3.5 h-3.5 rounded-full ${pyqMode ? 'bg-indigo-600' : 'bg-gray-300'}`} />
              </div>
            </div>

          </div>

          {/* Launch Button & Syllabus Guard */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Voice recognition works natively with zero lag.</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>2025-26 New Syllabus Filter Active: Deleted PYQ topics are automatically excluded.</span>
              </div>
            </div>

            <button
              onClick={handleStartDrill}
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Curating Zero-Pen Drill...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Start Walking Drill Now</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* VIEW 2: ACTIVE DRILL INTERACTIVE INTERFACE */}
      {activeDrill && !drillCompleted && (
        <div className="space-y-6">

          {/* Drill Header Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {activeDrill.subject}
                </span>
                <span className="text-xs text-gray-400 font-bold">•</span>
                <span className="text-xs text-slate-700 font-bold">{activeDrill.chapter}</span>
                <span className="text-xs text-gray-400 font-bold">•</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {activeDrill.drill_mode === 'mcq_sprint' ? '⚡ MCQ Sprint' : activeDrill.drill_mode === 'case_study_mcq' ? '📑 Case Study MCQ' : '🎙️ Oral Theory Drill'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {activeDrill.title}
              </h2>
            </div>

            {/* Question navigator chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeDrill.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = activeDrill.drill_mode === 'rapid_qa'
                  ? Boolean(theoryAnswers[q.question_id]?.trim())
                  : mcqAnswers[q.question_id] !== undefined;

                return (
                  <button
                    key={q.question_id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs scale-105'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Focus Mode Keyboard Shortcuts Pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-xl">
              <span className="font-bold text-slate-700">⌨️ Focus Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 bg-white rounded-md border border-gray-300 font-mono text-[10px] text-slate-800 shadow-2xs">Space</kbd>
              <span>Mic</span>
              <span className="text-gray-300">|</span>
              <kbd className="px-1.5 py-0.5 bg-white rounded-md border border-gray-300 font-mono text-[10px] text-slate-800 shadow-2xs">← / →</kbd>
              <span>Prev/Next</span>
              {activeDrill.drill_mode !== 'rapid_qa' && (
                <>
                  <span className="text-gray-300">|</span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded-md border border-gray-300 font-mono text-[10px] text-slate-800 shadow-2xs">1-4</kbd>
                  <span>Pick MCQ</span>
                </>
              )}
            </div>
          </div>

          {/* AI AUDIO PODCAST & SPEED CONTROL TOOLBAR */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-sm border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                    Audio Podcast &amp; Voice Reader
                  </span>
                  {isPlayingAudio && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Speaking ({audioPlaybackSpeed}x)</span>
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
                  Hands-Free Walking Podcast Mode
                </h4>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              {/* Playback Speed Controls: 0.75x, 1x, 1.25x, 1.5x, 2x */}
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/15">
                <span className="text-[10px] font-extrabold text-indigo-200 uppercase px-1.5 mr-0.5">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      setAudioPlaybackSpeed(spd);
                      if (isPlayingAudio) {
                        handleTogglePlayQuestionAudio();
                      }
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      audioPlaybackSpeed === spd
                        ? 'bg-indigo-500 text-white shadow-2xs'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {spd === 1 ? '1x' : `${spd}x`}
                  </button>
                ))}
              </div>

              {/* Listen to Current Question Button */}
              <button
                type="button"
                onClick={() => handleTogglePlayQuestionAudio()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isPlayingAudio && !isPodcastActive
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlayingAudio && !isPodcastActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Question</span>
                  </>
                )}
              </button>

              {/* Play Continuous Podcast Button */}
              <button
                type="button"
                onClick={handleToggleContinuousPodcast}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isPodcastActive
                    ? 'bg-rose-500 text-white font-black animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/20'
                }`}
              >
                {isPodcastActive ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Podcast</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Full Podcast</span>
                  </>
                )}
              </button>

              {/* Download Audio File Button */}
              <button
                type="button"
                onClick={handleDownloadWavPodcast}
                disabled={isExportingAudio}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                title="Download full audio revision track as offline MP3 / WAV audio"
              >
                {isExportingAudio ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP3</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Case Study Passage (If case_study_mcq) */}
          {activeDrill.drill_mode === 'case_study_mcq' && (activeDrill as any).case_passage && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Case Narrative &amp; Facts of the Dispute / Business</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                {(activeDrill as any).case_passage}
              </p>
            </div>
          )}

          {/* Active Question Card */}
          {(() => {
            const currentQ = activeDrill.questions[currentQuestionIndex];
            if (!currentQ) return null;

            const selectedOption = mcqAnswers[currentQ.question_id];
            const hasChosenMCQ = selectedOption !== undefined;
            const currentTheoryText = theoryAnswers[currentQ.question_id] || '';

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
                
                {/* Question metadata badge */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                      Q{currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">of {activeDrill.questions.length}</span>
                    {currentQ.pyq_tag && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>{currentQ.pyq_tag}</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {currentQ.max_marks} {currentQ.max_marks === 1 ? 'Mark' : 'Marks'}
                  </span>
                </div>

                {/* Question Statement */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {currentQ.question_text}
                </h3>

                {/* TYPE A: MCQ OPTIONS */}
                {(activeDrill.drill_mode === 'mcq_sprint' || activeDrill.drill_mode === 'case_study_mcq') && (
                  <div className="space-y-3 pt-2">
                    {currentQ.options?.map((optionText, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      const isCorrect = optIdx === currentQ.correct_option_index;
                      const optionLetter = ['A', 'B', 'C', 'D'][optIdx] || String(optIdx + 1);

                      let style = 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 bg-white text-slate-800';
                      if (hasChosenMCQ) {
                        if (isCorrect) {
                          style = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                        } else if (isSelected && !isCorrect) {
                          style = 'border-rose-400 bg-rose-50 text-rose-950';
                        } else {
                          style = 'border-gray-200 bg-gray-50/50 opacity-60 text-gray-500';
                        }
                      } else if (isSelected) {
                        style = 'border-indigo-600 bg-indigo-50 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.question_id, optIdx)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              hasChosenMCQ && isCorrect ? 'bg-emerald-600 text-white' :
                              hasChosenMCQ && isSelected ? 'bg-rose-600 text-white' :
                              'bg-gray-100 text-slate-700'
                            }`}>
                              {optionLetter}
                            </span>
                            <span className="text-xs sm:text-sm font-medium leading-relaxed">
                              {optionText}
                            </span>
                          </div>

                          {hasChosenMCQ && (
                            <div className="shrink-0">
                              {isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : isSelected ? (
                                <XCircle className="w-5 h-5 text-rose-600" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Instant Explanation Reveal for MCQs */}
                    {hasChosenMCQ && currentQ.explanation && (
                      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1 mt-3">
                        <div className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-indigo-600" />
                          <span>Official Explanation &amp; Syllabus Concept:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-normal">
                          {currentQ.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TYPE B: RAPID THEORY & ORAL Q&A (Voice & Type) */}
                {activeDrill.drill_mode === 'rapid_qa' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Your Answer
                        </label>
                        {/* Voice Language Selector */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-[11px] font-semibold text-gray-600">
                          <button
                            type="button"
                            onClick={() => setSpeechLanguage('en-IN')}
                            className={`px-2 py-0.5 rounded-md transition-all ${
                              speechLanguage === 'en-IN' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'hover:text-slate-900'
                            }`}
                          >
                            English / Hinglish
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpeechLanguage('hi-IN')}
                            className={`px-2 py-0.5 rounded-md transition-all ${
                              speechLanguage === 'hi-IN' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'hover:text-slate-900'
                            }`}
                          >
                            हिंदी (Hindi)
                          </button>
                        </div>
                      </div>
                      
                      {speechSupported ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={toggleSpeechRecognition}
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                              isListening
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {isListening ? (
                              <>
                                <MicOff className="w-4 h-4 animate-bounce" />
                                <span>Listening... Tap to Stop</span>
                              </>
                            ) : (
                              <>
                                <Mic className="w-4 h-4 text-emerald-600" />
                                <span>🎙️ Tap to Speak Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400">Speech not supported in browser, please type below.</span>
                      )}
                    </div>

                    {/* Microphone Notice / Error Banner */}
                    {micErrorMessage && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-amber-900 font-medium">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p>{micErrorMessage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMicErrorMessage(null)}
                          className="text-amber-700 hover:text-amber-900 font-bold text-[11px] underline shrink-0 cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}

                    {/* Active Recording State with Live Acoustic Wave and Live Transcript Preview */}
                    {isListening && (
                      <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                          <div className="flex items-center gap-2.5">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                            </span>
                            <span>Microphone Active ({speechLanguage === 'en-IN' ? 'English/Hinglish' : 'Hindi'}). Speak your answer...</span>
                          </div>
                          <span className="text-[11px] text-rose-600 font-medium animate-pulse">● Live Dictation</span>
                        </div>
                        {liveInterimText && (
                          <div className="px-3 py-2 bg-white rounded-xl border border-rose-100 text-xs text-slate-800 font-medium italic">
                            "{liveInterimText}"
                          </div>
                        )}
                      </div>
                    )}

                    <div className="relative">
                      <textarea
                        rows={4}
                        value={currentTheoryText}
                        onChange={(e) => setTheoryAnswers(prev => ({ ...prev, [currentQ.question_id]: e.target.value }))}
                        placeholder="Speak or type your answer here... Remember: No marks are deducted for formatting, grammar, or handwriting!"
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
                      />
                      {currentTheoryText && (
                        <button
                          type="button"
                          onClick={() => setTheoryAnswers(prev => ({ ...prev, [currentQ.question_id]: '' }))}
                          className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Clear text"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Key terms hint preview */}
                    {currentQ.key_terms_required && currentQ.key_terms_required.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-gray-500">
                        <span className="font-bold text-slate-700">High-Yield Keywords to cover:</span>
                        {currentQ.key_terms_required.map((kt, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-md font-medium text-slate-800">
                            {kt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation controls between questions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                  >
                    ← Previous Question
                  </button>

                  {currentQuestionIndex < activeDrill.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitDrill}
                      disabled={isEvaluating}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-100"
                    >
                      {isEvaluating ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Evaluating Answers...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Submit &amp; Grade Drill</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })()}

          {/* Quick Submit Floating Pill for Long Drills */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <span className="text-xs text-gray-600 font-medium">
              Done reviewing your answers? Click submit to get your comprehensive score and conceptual evaluation.
            </span>

            <button
              type="button"
              onClick={handleSubmitDrill}
              disabled={isEvaluating}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shrink-0 cursor-pointer"
            >
              {isEvaluating ? 'Evaluating...' : 'Finish & Submit Drill'}
            </button>
          </div>

        </div>
      )}

      {/* VIEW 3: COMPLETED DRILL SCORECARD & RESULTS */}
      {drillCompleted && completedEvaluation && (
        <div className="space-y-6">
          
          {/* Scorecard Hero Banner */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Drill Completed Successfully
                  </span>
                  <span className="text-xs text-gray-400 font-medium">• Walk &amp; Revise Mode</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {completedEvaluation.test_title}
                </h2>
              </div>

              {/* Overall Score Dial */}
              <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Score</div>
                  <div className="text-xl font-black text-slate-900">
                    {completedEvaluation.total_obtained_marks} / {completedEvaluation.total_max_marks}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl font-black text-sm text-white ${
                  completedEvaluation.percentage >= 75 ? 'bg-emerald-600' :
                  completedEvaluation.percentage >= 40 ? 'bg-indigo-600' : 'bg-rose-600'
                }`}>
                  {completedEvaluation.percentage}%
                </div>
              </div>
            </div>

            {/* Performance analysis feedback */}
            {completedEvaluation.performance_analysis?.teacher_overall_feedback && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-800 leading-relaxed font-medium">
                <strong className="text-indigo-900 block mb-0.5">Examiner's Walk &amp; Revise Feedback:</strong>
                {completedEvaluation.performance_analysis.teacher_overall_feedback}
              </div>
            )}

            {/* Questions Detailed Breakdown */}
            <div className="space-y-3 pt-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Question-By-Question Conceptual Breakdown</span>
              </h3>

              <div className="space-y-3">
                {completedEvaluation.questions.map((q, idx) => (
                  <div 
                    key={q.question_id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Question {q.question_number || idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          {q.question_text}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          q.status === 'Correct' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'Mostly Correct' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {q.awarded_marks} / {q.max_marks} Marks
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                        <span className="font-bold text-gray-400 text-[10px] uppercase">Your Answer</span>
                        <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                          {q.student_answer || 'Unattempted'}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                        <span className="font-bold text-emerald-700 text-[10px] uppercase">Official Model Concept</span>
                        <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                          {q.expected_model_answer}
                        </p>
                      </div>
                    </div>

                    {q.teacher_feedback && (
                      <p className="text-xs text-gray-500 italic pt-1">
                        Feedback: "{q.teacher_feedback}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CRITICAL FEATURE: INCLUDE IN ANALYSIS VS CASUAL REVISION */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Long-Term Analytics Integration Choice</span>
                </h4>
                <p className="text-xs text-gray-500">
                  Choose whether this drill should count towards your official chapter strength graphs and mistake statistics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Option 1: Include in Analysis */}
                <div
                  onClick={() => handleToggleAnalysisInclusion(true)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    includeInAnalysis
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${includeInAnalysis ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">Include in Analysis Tab</span>
                      {includeInAnalysis && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Counts towards chapter mastery %, speed trajectory, and long-term score trends.
                    </p>
                  </div>
                </div>

                {/* Option 2: Casual Practice Mode (Do Not Include) */}
                <div
                  onClick={() => handleToggleAnalysisInclusion(false)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    !includeInAnalysis
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-600/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${!includeInAnalysis ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">Do Not Include (Casual Revision)</span>
                      {!includeInAnalysis && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Keeps your analytics graphs clean! Zero impact on chapter health, no red marks or degraded averages.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Another Walk Drill</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('analysis')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  View Analysis Matrix
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onEvaluationComplete(completedEvaluation);
                    setActiveTab('result');
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Open Full Report
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* BOTTOM PRESENTATION EXEMPTION REASSURANCE BANNER */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-3xl p-5 text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No Marks Deducted for Presentation in Walk &amp; Revise Mode</span>
        </div>
        <p className="text-xs text-emerald-700 max-w-xl mx-auto leading-relaxed">
          Designed specifically for active students studying without paper. All answers are graded purely on statutory provisions, accounting logic, and keywords!
        </p>
      </div>

    </div>
  );
};
