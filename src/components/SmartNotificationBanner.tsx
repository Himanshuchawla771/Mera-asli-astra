import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  X, 
  ArrowRight, 
  Gift, 
  CheckCircle2, 
  Volume2,
  AlertCircle,
  Send,
  ExternalLink
} from 'lucide-react';
import { 
  SmartNotificationMessage, 
  getNextContextualNotification, 
  recordSentNotification,
  requestBrowserNotificationPermission,
  fireSystemPushNotification,
  isRunningInIframe
} from '../utils/notificationEngine';
import { grantNotificationBonus } from '../utils/guestManager';
import { openNotificationCenterModal } from '../utils/pwaHelper';

interface SmartNotificationBannerProps {
  isGuest: boolean;
  onOpenRegister?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SmartNotificationBanner: React.FC<SmartNotificationBannerProps> = ({
  isGuest,
  onOpenRegister,
  onNavigateTab
}) => {
  const [activeNotif, setActiveNotif] = useState<SmartNotificationMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(isRunningInIframe());

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setBonusClaimed(true);
      }
    }

    // Show polite contextual notification 2s after load
    const timer = setTimeout(() => {
      let next = getNextContextualNotification(isGuest);
      if (!next) {
        // Provide contextual study tips even if time cooldown was active
        next = getNextContextualNotification(isGuest, true);
      }
      if (next) {
        setActiveNotif(next);
        setIsVisible(true);
        recordSentNotification(next.id);

        // Also attempt system push notification if user already gave permission
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          fireSystemPushNotification(next.title, next.body).catch(() => {});
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isGuest]);

  if (!isVisible || !activeNotif) return null;

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleClaimBonus = async () => {
    setPushStatus('Requesting...');
    try {
      const perm = await requestBrowserNotificationPermission();
      if (perm === 'granted') {
        grantNotificationBonus();
        setBonusClaimed(true);
        setPushStatus('Enabled!');
        await fireSystemPushNotification(
          '🎉 Push Notifications Activated!',
          'Aapko daily study tips aur +1 bonus test unlock ho chuka hai! 🚀'
        );
        setTimeout(() => setIsVisible(false), 3000);
      } else {
        setPushStatus(isIframe ? 'Open in New Tab' : 'Permission not allowed');
        setTimeout(() => setPushStatus(null), 4000);
      }
    } catch (e) {
      setPushStatus(null);
    }
  };

  const handleQuickTest = async () => {
    setTestSent(true);
    await fireSystemPushNotification(
      'StudyMentor Test Alert 🔔',
      'Badhai ho! Aapke device par StudyMentor Web Push bilkul perfect kaam kar raha hai! 🎯'
    );
    setTimeout(() => setTestSent(false), 3500);
  };

  return (
    /* Responsive full-width on mobile with safe top clearance below mobile nav tabs */
    <div className="fixed top-28 sm:top-20 left-3 right-3 sm:left-auto sm:right-6 z-50 max-w-lg sm:w-[440px] transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="relative rounded-2xl bg-white shadow-2xl border border-indigo-200/90 p-4 sm:p-5 text-slate-900 ring-1 ring-black/10">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-amber-400 via-indigo-500 to-rose-500" />

        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Animated Bell Icon */}
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80 shadow-2xs">
              <Bell className="w-5 h-5 animate-swing" />
            </div>

            {/* Content Body */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                  {activeNotif.title}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold whitespace-nowrap">
                  StudyMentor Reminder
                </span>
              </div>

              {/* Complete, untruncated message text */}
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {activeNotif.body}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {isGuest && onOpenRegister && (
                  <button
                    onClick={() => {
                      setIsVisible(false);
                      onOpenRegister();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Free Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Enable Push Button or Active Status */}
                {!bonusClaimed ? (
                  <button
                    onClick={handleClaimBonus}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <Gift className="w-3.5 h-3.5 text-slate-950" />
                    <span>{pushStatus || 'Turn On Notifications (+1 Bonus)'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Notifications Active</span>
                    </span>

                    {/* Quick Test Button */}
                    <button
                      onClick={handleQuickTest}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-indigo-200 active:scale-95"
                      title="Send instant test alert to device"
                    >
                      <Send className="w-3 h-3" />
                      <span>{testSent ? 'Sent! Check bar' : 'Test Alert'}</span>
                    </button>
                  </div>
                )}

                {/* Open Full Notification Center */}
                <button
                  onClick={() => {
                    setIsVisible(false);
                    openNotificationCenterModal();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Iframe tip helper if inside preview */}
              {isIframe && !bonusClaimed && (
                <p className="text-[10px] text-slate-600 pt-1 flex items-center gap-1">
                  <span>Agar prompt na dikhe toh app ko</span>
                  <a 
                    href={typeof window !== 'undefined' ? window.location.href : '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="underline text-indigo-600 font-bold flex items-center gap-0.5"
                  >
                    New Tab mein kholein <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
