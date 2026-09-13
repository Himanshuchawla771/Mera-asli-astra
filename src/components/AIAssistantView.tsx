import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  RotateCcw, 
  Loader2, 
  CheckCircle2, 
  GraduationCap,
  MessageSquare,
  User,
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';
import { EvaluationResult, ChatMessage, AcademicJourney } from '../types';
import { askAIAssistant } from '../services/api';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';
import { cleanRepeatedPhrases, mergeSpeechTranscripts } from '../utils/speechUtils';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { acquireActionLock } from '../utils/performance';

interface AIAssistantViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (j: AcademicJourney) => void;
  currentEvaluation: EvaluationResult | null;
  initialPrompt?: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  currentJourney,
  setCurrentJourney,
  currentEvaluation,
  initialPrompt = ''
}) => {
  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];
  const [selectedSubject, setSelectedSubject] = useState<string>(
    currentEvaluation?.subject || journeyDef.subjects[0]?.name || 'Accountancy'
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content: currentEvaluation
        ? `Hello! I'm your AI Study Tutor. I've loaded your evaluation for **"${currentEvaluation.test_title}"** (${currentEvaluation.total_obtained_marks}/${currentEvaluation.total_max_marks} Marks, ${currentEvaluation.percentage}% in ${currentEvaluation.subject}).\n\nYou can ask me why marks were deducted in any question, how to write ideal topper answers, or click 📷 **Snap Question** to upload any tough numerical or case-study!`
        : `Hello! I'm your AI Study Mentor for **${journeyDef.title}**.\n\nAsk me any conceptual doubt, request exam answering tips, or use 📷 **Snap Question / Upload Photo** to get instant Topper-Grade Model Solutions for up to 3 questions!`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Photo Question Solver States
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    dataUrl: string;
    sizeKb: number;
  } | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const baseInputRef = useRef<string>('');

  const toggleMic = async () => {
    setMicNotice(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicNotice('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // Capture starting text so speech doesn't duplicate or loop
    baseInputRef.current = input;

    // Request mic permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicNotice('Microphone access was denied. Please allow microphone permission in your browser address bar.');
          return;
        }
      }
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setMicNotice(null);
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
            interim = piece;
          }
        }
        const base = baseInputRef.current ? baseInputRef.current.trim() : '';
        let merged = '';
        if (finalizedChunks.length > 0) {
          const mergedFinals = mergeSpeechTranscripts(finalizedChunks);
          merged = base ? mergeSpeechTranscripts([base, mergedFinals]) : mergedFinals;
        } else {
          merged = base;
        }
        if (interim) {
          merged = `${merged} ${interim}`.trim();
        }
        setInput(cleanRepeatedPhrases(merged));
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setMicNotice('Microphone blocked. Please enable mic access in your browser settings.');
        } else if (event.error !== 'no-speech') {
          setMicNotice(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
        setInput(prev => cleanRepeatedPhrases(prev));
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (e) {
      setIsListening(false);
      setMicNotice('Could not start microphone.');
    }
  };

  // Image Selection and Client-side instant compression
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const optimized = await optimizeImageFile(file, 1920, 0.85);
      setSelectedImage({
        file: optimized.file,
        dataUrl: optimized.dataUrl,
        sizeKb: optimized.optimizedSizeKb
      });
    } catch (err) {
      console.error('Failed to optimize image, falling back to direct reader:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage({
          file,
          dataUrl: reader.result as string,
          sizeKb: Math.round(file.size / 1024)
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCopySolution = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, selectedImage]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (!journeyDef.subjects.some(s => s.name === selectedSubject)) {
      setSelectedSubject(journeyDef.subjects[0]?.name || 'Accountancy');
    }
  }, [currentJourney]);

  const handleSend = async (textToSend?: string) => {
    if (isLoading) return;
    if (!acquireActionLock('send_ai_query', 1200)) return;

    const text = textToSend !== undefined ? textToSend : input;
    const imageToSend = selectedImage;

    if (!text.trim() && !imageToSend) return;

    const userPromptText = text.trim() || (imageToSend ? '📷 Please solve these questions from the photo with complete Topper step-by-step working.' : '');

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userPromptText,
      timestamp: new Date().toISOString(),
      imageUrl: imageToSend?.dataUrl
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const chatHistoryForAPI = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const reply = await askAIAssistant(userPromptText, {
        journey: currentJourney,
        subject: selectedSubject,
        evaluationContext: currentEvaluation,
        chatHistory: chatHistoryForAPI,
        imageBase64: imageToSend?.dataUrl
      });

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        isPhotoSolution: Boolean(imageToSend)
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Error: ${err.message || 'Failed to get a response. Please check your connection.'}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. How can I help you with your ${journeyDef.badge} preparation today?`,
        timestamp: new Date().toISOString()
      }
    ]);
    setSelectedImage(null);
  };

  // Quick suggestion prompts
  const suggestions = currentEvaluation
    ? [
        `Why did I lose marks in ${currentEvaluation.questions[0]?.question_id || 'Q1'}?`,
        `Explain how to write an ideal topper answer for ${currentEvaluation.questions[0]?.question_id || 'Q1'}.`,
        `Give me 3 targeted practice questions on ${currentEvaluation.chapter || currentEvaluation.subject}.`,
        `What mandatory keywords or conditions did I omit in this paper?`
      ]
    : currentJourney === 'CLASS_12'
    ? [
        'How do I calculate interest on drawings using the average period method in Accountancy?',
        'Differentiate between Unity of Command and Unity of Direction with basis in Business Studies.',
        'Explain National Income measurement using Value Added Method in Economics.',
        'What is the standard CBSE format for Notice and Letter writing in English Core?'
      ]
    : [
        'Explain the 4-tier ICAI answering format for CA Foundation Business Laws case studies.',
        'How do I calculate abnormal loss in transit in Consignment Accounting?',
        'What are the statutory exceptions to "No Consideration, No Contract" under Section 25?',
        'How do I handle bank reconciliation timing differences in CA Foundation Paper 1?'
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Hidden file inputs for Camera and Gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      {/* Header Bento Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
              {journeyDef.badge} AI Tutor
            </span>
            {currentEvaluation && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                Context: {currentEvaluation.test_title}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-indigo-600" />
            <span>Interactive AI Study Tutor</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Clarify mistakes, solve tough textbook/exam numericals with photo snap, and master CBSE & ICAI Topper Step Marking.
          </p>
        </div>

        {/* Academic Journey Switcher & Subject Select */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center border border-gray-200">
            <button
              onClick={() => {
                setCurrentJourney('CLASS_12');
                setSelectedSubject('Accountancy');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentJourney === 'CLASS_12'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Class 12
            </button>
            <button
              onClick={() => {
                setCurrentJourney('CA_FOUNDATION');
                setSelectedSubject('Principles and Practice of Accounting');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentJourney === 'CA_FOUNDATION'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              CA Foundation
            </button>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-slate-800"
          >
            {journeyDef.subjects.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Photo Question Solver Quick Action Strip */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-emerald-50/80 rounded-2xl border border-indigo-100/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-950">Photo Question Solver</span>
              <span className="text-[10px] font-bold bg-indigo-200/80 text-indigo-800 px-2 py-0.5 rounded-full">
                Max 1 to 3 Questions
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
              Snap textbook numericals, journal entries, or case laws for instant step-by-step Topper Model Solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>Take Photo</span>
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface Bento */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
        
        {/* Chat Messages Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 leading-relaxed ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl sm:max-w-3xl p-4 sm:p-5 rounded-2xl ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none text-xs sm:text-[13px]'
                      : 'bg-gray-50/90 border border-gray-200/90 text-slate-900 rounded-tl-none shadow-2xs text-[13.5px] sm:text-sm font-normal'
                  }`}
                >
                  {/* User Question Image Thumbnail */}
                  {isUser && msg.imageUrl && (
                    <div className="mb-3">
                      <div className="relative inline-block">
                        <img
                          src={msg.imageUrl}
                          alt="Question sheet"
                          className="max-w-[260px] max-h-[190px] rounded-xl object-contain bg-black/20 border border-white/30 shadow-xs"
                        />
                      </div>
                      <span className="text-[10px] text-indigo-200 block mt-1 font-medium">
                        📷 Attached Question Sheet
                      </span>
                    </div>
                  )}

                  {/* Assistant Header Bar with Copy Button */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-3 pb-2.5 mb-3 border-b border-gray-200">
                      <div className="flex items-center gap-1.5">
                        {msg.isPhotoSolution ? (
                          <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
                            <Award className="w-3.5 h-3.5 text-amber-700" />
                            Topper Model Solution (CBSE/ICAI Benchmark)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                            <Bot className="w-3.5 h-3.5" />
                            StudyMentor AI Tutor
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopySolution(msg.id, msg.content)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs transition-colors cursor-pointer"
                        title="Copy solution text"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Solution</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-gray-600 shadow-2xs">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="font-medium">
                  Analyzing questions, calculating working notes, and preparing Topper Model Answer...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Pills */}
        <div className="px-6 py-2 bg-gray-50/70 border-t border-gray-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
            Suggested:
          </span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(sug)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-gray-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Image Attachment Preview Strip if a photo is selected */}
        {selectedImage && (
          <div className="mx-4 mb-2 p-2.5 bg-indigo-50/90 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={selectedImage.dataUrl} 
                alt="Question thumbnail" 
                className="w-12 h-12 rounded-xl object-cover border border-indigo-300 shadow-2xs shrink-0" 
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-indigo-950 truncate">
                    {selectedImage.file.name || 'Question Photo'}
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-200/80 text-indigo-800 px-1.5 py-0.2 rounded-md font-bold shrink-0">
                    {selectedImage.sizeKb} KB
                  </span>
                </div>
                <p className="text-[11px] text-indigo-700 font-medium truncate mt-0.5">
                  🎯 Ready: AI Tutor will solve up to 3 questions with full Working Notes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1.5 text-indigo-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Remove Photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Compressing indicator */}
        {isCompressingImage && (
          <div className="mx-4 mb-2 p-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs text-indigo-700">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Optimizing question photo for high-accuracy reading...</span>
          </div>
        )}

        {/* Mic notice banner */}
        {micNotice && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex items-center justify-between">
            <span>{micNotice}</span>
            <button
              onClick={() => setMicNotice(null)}
              className="text-amber-600 hover:text-amber-900 font-bold underline text-[11px] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={clearChat}
            className="p-2.5 text-gray-400 hover:text-slate-700 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick Camera Snap Button */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-2.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Take Photo of Question (Max 3)"
          >
            <Camera className="w-4 h-4 text-indigo-600" />
          </button>

          {/* Gallery Upload Button */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="p-2.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Upload Photo of Question from Gallery"
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
          </button>

          <input
            type="text"
            placeholder={
              selectedImage 
                ? "Type any specific instruction (optional) and tap Send..." 
                : isListening 
                ? "Listening... Speak your doubt now..." 
                : `Ask a doubt or snap a photo of question(s)...`
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className={`flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border transition-all text-slate-900 ${
              isListening 
                ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200' 
                : selectedImage
                ? 'border-indigo-400 bg-indigo-50/20 ring-2 ring-indigo-100'
                : 'border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/40'
            }`}
          />

          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200 animate-pulse'
                : 'bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700'
            }`}
            title={isListening ? "Listening (Tap to stop)" : "Speak your doubt"}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-100 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

      </div>

    </div>
  );
};

