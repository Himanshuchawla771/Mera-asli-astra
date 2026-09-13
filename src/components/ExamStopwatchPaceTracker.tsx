import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Hourglass, 
  AlertCircle, 
  Sparkles,
  Zap
} from 'lucide-react';

interface ExamStopwatchPaceTrackerProps {
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  testTitle: string;
}

export const ExamStopwatchPaceTracker: React.FC<ExamStopwatchPaceTrackerProps> = ({
  durationMinutes,
  totalMarks,
  totalQuestions,
  testTitle
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const initialTotalSeconds = durationMinutes * 60;
  const timerRef = useRef<any>(null);

  // Sync when durationMinutes prop changes
  useEffect(() => {
    if (!isRunning) {
      setSecondsRemaining(durationMinutes * 60);
      setElapsedSeconds(0);
    }
  }, [durationMinutes]);

  // Timer interval loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleTogglePlay = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationMinutes * 60);
    setElapsedSeconds(0);
  };

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pace metrics
  const pacePerMark = totalMarks > 0 ? (durationMinutes / totalMarks).toFixed(1) : '1.8';
  const pacePerQuestion = totalQuestions > 0 ? (durationMinutes / totalQuestions).toFixed(1) : '9';
  const isCriticalTime = mode === 'countdown' && secondsRemaining < 300 && secondsRemaining > 0;
  const isTimeUp = mode === 'countdown' && secondsRemaining === 0;

  // Percentage for progress
  const progressPercent = mode === 'countdown' 
    ? Math.max(0, Math.min(100, Math.round((secondsRemaining / initialTotalSeconds) * 100)))
    : Math.min(100, Math.round((elapsedSeconds / initialTotalSeconds) * 100));

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Stopwatch Display & Pace Metrics */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
            isTimeUp 
              ? 'bg-rose-600 text-white animate-pulse'
              : isCriticalTime
              ? 'bg-amber-500 text-white animate-pulse'
              : isRunning
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-white'
          }`}>
            {mode === 'countdown' ? <Hourglass className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Exam Hall Pace Tracker
              </span>
              <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${
                isRunning 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' 
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {isRunning ? '● LIVE TEST IN PROGRESS' : 'PAUSED'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`font-mono text-2xl font-black tracking-tight ${
                isTimeUp ? 'text-rose-600' : isCriticalTime ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {formatTime(mode === 'countdown' ? secondsRemaining : elapsedSeconds)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {mode === 'countdown' ? `left of ${durationMinutes}m` : `elapsed`}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Pace Guide Chip */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Pace:</span>
          </div>
          <span className="text-slate-700 font-medium">
            <strong>~{pacePerMark} mins</strong> / Mark
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-slate-700 font-medium">
            <strong>~{pacePerQuestion} mins</strong> / Question
          </span>
        </div>

        {/* Right: Controls & Mode Selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Mode Switcher */}
          <div className="flex items-center bg-gray-200/60 p-0.5 rounded-xl text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setMode('countdown')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mode === 'countdown' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Countdown
            </button>
            <button
              type="button"
              onClick={() => setMode('stopwatch')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mode === 'stopwatch' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Stopwatch
            </button>
          </div>

          {/* Start / Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{elapsedSeconds > 0 ? 'Resume' : 'Start Exam'}</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset timer to initial paper duration"
            className="p-2 rounded-xl text-gray-500 hover:text-slate-900 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            isTimeUp 
              ? 'bg-rose-600' 
              : isCriticalTime 
              ? 'bg-amber-500' 
              : 'bg-indigo-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isCriticalTime && (
        <div className="mt-2 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Less than 5 minutes remaining! Complete final calculations and re-read working notes.</span>
        </div>
      )}

      {isTimeUp && (
        <div className="mt-2 text-[11px] text-rose-700 font-bold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
          <span>Time is Up! Put down your pen and click "Evaluate My Answers" to scan your answer sheet.</span>
        </div>
      )}
    </div>
  );
};
