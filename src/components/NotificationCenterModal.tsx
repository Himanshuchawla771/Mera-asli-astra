import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  X, 
  CheckCircle2, 
  Gift, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Smartphone,
  ExternalLink,
  Wifi
} from 'lucide-react';
import { 
  requestBrowserNotificationPermission, 
  fireSystemPushNotification,
  isRunningInIframe,
  subscribeDeviceToPush
} from '../utils/notificationEngine';
import { grantNotificationBonus } from '../utils/guestManager';
import { NOTIFICATION_MODAL_OPEN_EVENT } from '../utils/pwaHelper';

interface NotificationCenterModalProps {
  isGuest: boolean;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isGuest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>('default');
  const [testSent, setTestSent] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ vapidConfigured?: boolean; totalSubscribers?: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(isRunningInIframe());

      if (!('Notification' in window)) {
        setPermissionState('unsupported');
      } else {
        setPermissionState(Notification.permission);
      }

      const handleOpen = () => {
        setIsOpen(true);
        // Refresh permission state on modal open
        if ('Notification' in window) {
          setPermissionState(Notification.permission);
        }
        // Check server status
        fetch('/api/notifications/status')
          .then(r => r.json())
          .then(d => setServerStatus(d))
          .catch(() => {});
      };

      window.addEventListener(NOTIFICATION_MODAL_OPEN_EVENT, handleOpen);
      return () => window.removeEventListener(NOTIFICATION_MODAL_OPEN_EVENT, handleOpen);
    }
  }, []);

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const perm = await requestBrowserNotificationPermission();
      setPermissionState(perm);
      if (perm === 'granted') {
        if (isGuest) {
          grantNotificationBonus();
          setBonusClaimed(true);
        }
        await fireSystemPushNotification(
          '🎉 Notifications Activated!',
          'Aapko Class 12 & CA ke exam tips aur study alerts aana shuru ho gaye hain! 🚀'
        );
      }
    } catch (e) {
      console.warn('Request permission error:', e);
    }
  };

  const handleSendTestNotification = async () => {
    setTestSent(true);
    await fireSystemPushNotification(
      'StudyMentor Test Alert 🔔',
      'Badhai ho! Aapke device par StudyMentor Web Push bilkul perfect kaam kar raha hai! 🎯'
    );
    setTimeout(() => setTestSent(false), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-5 sm:p-6 space-y-5 my-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                Exam &amp; Study Notifications
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Daily revision drills, topper tips &amp; evaluation alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Current Status:</span>
            {permissionState === 'granted' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Allowed &amp; Active
              </span>
            ) : permissionState === 'denied' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Blocked in Browser
              </span>
            ) : permissionState === 'unsupported' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 font-extrabold text-[11px]">
                Not Supported
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px]">
                Not Enabled Yet
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {permissionState === 'granted' 
              ? 'Aapke browser par notifications enabled hain. Server push engine active hai aur study reminders direct aapke phone / PC screen par aayenge.'
              : permissionState === 'denied'
              ? 'Aapne browser mein notifications block kiye huye hain. Address bar mein 🔒 (lock) icon par tap karke "Notifications: Allow" select karein.'
              : 'Notifications on karne par subah aur shaam revision ke smart alerts milte hain.'}
          </p>

          {/* Iframe Notice */}
          {isIframe && permissionState !== 'granted' && (
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate font-semibold">Preview iframe me browser push block rehti hai.</span>
              </div>
              <a
                href={typeof window !== 'undefined' ? window.location.href : '#'}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10px] shrink-0 flex items-center gap-1"
              >
                <span>New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {permissionState !== 'granted' ? (
          <div className="space-y-3">
            <button
              onClick={handleRequestPermission}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Turn On Notifications {isGuest ? '(+1 Bonus Test)' : ''}</span>
            </button>

            {isGuest && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Guest Students ko notifications enable karte hi instant 1 bonus test milta hai!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleSendTestNotification}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Notification to My Phone / PC</span>
            </button>

            {testSent && (
              <p className="text-center text-xs text-emerald-700 font-bold animate-fadeIn">
                Notification bheja gaya! Apne device ke top notification bar mein check karein 🔔
              </p>
            )}
          </div>
        )}

        {/* Features of Notifications */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Aapko kya-kya alerts milenge:</span>
          </h4>
          <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Subah 8 AM &amp; Shaam 6 PM revision test reminders (Class 12 &amp; CA).</li>
            <li>Teacher checked copy aur feedback evaluation complete hone par instant alert.</li>
            <li>Walk &amp; Revise voice drill sessions ka recommendation.</li>
            <li>Zero spam policy: Maximum 2-3 helpful alerts per day.</li>
          </ul>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
