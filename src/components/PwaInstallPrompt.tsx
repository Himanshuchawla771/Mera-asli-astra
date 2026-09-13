import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Monitor,
  ExternalLink
} from 'lucide-react';

import { 
  PWA_TRIGGER_INSTALL_EVENT, 
  PWA_PROMPT_CAPTURED_EVENT, 
  BeforeInstallPromptEvent,
  getGlobalDeferredPrompt,
  setGlobalDeferredPrompt
} from '../utils/pwaHelper';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(getGlobalDeferredPrompt());
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isInstalledJustNow, setIsInstalledJustNow] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (already installed & opened from home screen)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    setIsStandalone(isStandaloneMode);

    // Check if device is iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setGlobalDeferredPrompt(promptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for early captured prompt
    const handlePromptCaptured = () => {
      const prompt = getGlobalDeferredPrompt();
      if (prompt) {
        setDeferredPrompt(prompt);
      }
    };
    window.addEventListener(PWA_PROMPT_CAPTURED_EVENT, handlePromptCaptured);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalledJustNow(true);
      setDeferredPrompt(null);
      setGlobalDeferredPrompt(null);
      setTimeout(() => setShowBanner(false), 3000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for external trigger to launch install flow or modal
    const handleExternalTrigger = () => {
      triggerInstall();
    };

    window.addEventListener(PWA_TRIGGER_INSTALL_EVENT, handleExternalTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener(PWA_PROMPT_CAPTURED_EVENT, handlePromptCaptured);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener(PWA_TRIGGER_INSTALL_EVENT, handleExternalTrigger);
    };
  }, []);

  const triggerInstall = async () => {
    // Check both local component state and global early-captured prompt
    const prompt = deferredPrompt || getGlobalDeferredPrompt();

    if (prompt) {
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalledJustNow(true);
          setTimeout(() => {
            setShowBanner(false);
            setShowModal(false);
          }, 2000);
        }
        setDeferredPrompt(null);
        setGlobalDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowModal(true);
      }
    } else {
      // In preview iframe or when browser doesn't expose native event, show guide modal
      setShowModal(true);
    }
  };

  // If already running as installed standalone app, don't show the top install pill
  if (isStandalone && !showModal) return null;

  return (
    <>
      {/* Sleek Top Install Pill Banner */}
      {showBanner && !isStandalone && (
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white border-b border-indigo-800/40 px-3 sm:px-4 py-2 sm:py-2.5 shadow-md transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 truncate">
                <span className="font-bold text-slate-100 flex items-center gap-1.5 whitespace-nowrap text-[12px] sm:text-xs">
                  <span>📱 Install StudyMentor App</span>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-md font-extrabold hidden md:inline">
                    Fullscreen PWA
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                  Faster loading, full-screen view &amp; zero URL bar.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isInstalledJustNow ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Installed!
                </span>
              ) : (
                <button
                  id="pwa-quick-install-btn"
                  onClick={triggerInstall}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install</span>
                </button>
              )}

              <button
                onClick={() => setShowBanner(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal for iOS Safari, Desktop Chrome & Instant In-Browser Installation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-5 sm:p-6 space-y-4 sm:space-y-5 my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                    Install StudyMentor on Phone / PC
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Native Fullscreen App • Works for All Students &amp; Guests
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If direct deferredPrompt is available, give 1-Click Install Button directly in modal */}
            {deferredPrompt ? (
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center space-y-2">
                <p className="text-xs font-bold text-indigo-950">
                  Your browser supports 1-click automatic installation!
                </p>
                <button
                  onClick={triggerInstall}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Click to Install App Now</span>
                </button>
              </div>
            ) : null}

            {/* Platform Specific Easy Steps */}
            {isIos ? (
              /* iOS Safari Instructions */
              <div className="space-y-3 text-xs text-slate-700">
                <p className="font-bold text-slate-900">
                  Follow these 2 simple steps in Apple Safari:
                </p>
                
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Tap the 'Share' icon</span>
                    <span className="text-[11px] text-slate-500">
                      Located at the bottom toolbar of Safari (box with upward arrow <Share className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" />).
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Select 'Add to Home Screen'</span>
                    <span className="text-[11px] text-slate-500">
                      Scroll down in the share sheet and tap <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" /> <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Android & Desktop Chrome Instructions */
              <div className="space-y-3 text-xs text-slate-700">
                <p className="font-bold text-slate-900">
                  Simple 2-step setup on Chrome / Android / PC:
                </p>
                
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Open Browser Menu (⋮)</span>
                    <span className="text-[11px] text-slate-500">
                      Tap the 3 vertical dots at the top right of your browser or the install icon in the URL bar.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Tap "Install App" or "Add to Home Screen"</span>
                    <span className="text-[11px] text-slate-500">
                      StudyMentor icon will appear right on your phone home screen!
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Zero Play Store download required. Works smoothly with auto-saved logins.</span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Done / Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
