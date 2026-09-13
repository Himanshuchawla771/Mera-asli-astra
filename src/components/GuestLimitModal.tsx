import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  UserCheck, 
  Users, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  Bell, 
  ShieldAlert,
  GraduationCap,
  X,
  Smartphone,
  Download
} from 'lucide-react';
import { 
  getActiveGuestRecord, 
  applyReferralCode, 
  grantNotificationBonus,
  GUEST_DAILY_LIMITS 
} from '../utils/guestManager';
import { requestBrowserNotificationPermission, fireSystemPushNotification } from '../utils/notificationEngine';
import { triggerPwaInstallPrompt } from '../utils/pwaHelper';

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  featureName: string;
  limitMessage?: string;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  featureName,
  limitMessage
}) => {
  const [referralInput, setReferralInput] = useState('');
  const [referralStatus, setReferralStatus] = useState<{ success?: boolean; text?: string } | null>(null);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [isActivatingNotifs, setIsActivatingNotifs] = useState(false);

  if (!isOpen) return null;

  const guest = getActiveGuestRecord();

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim()) return;

    const res = applyReferralCode(referralInput);
    setReferralStatus({ success: res.success, text: res.message });
    if (res.success) {
      setReferralInput('');
    }
  };

  const handleCopyMyCode = () => {
    if (!guest?.referralCode) return;
    navigator.clipboard.writeText(guest.referralCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2500);
  };

  const handleEnableNotificationBonus = async () => {
    setIsActivatingNotifs(true);
    try {
      const perm = await requestBrowserNotificationPermission();
      if (perm === 'granted') {
        const res = grantNotificationBonus();
        setReferralStatus({ success: res.success, text: res.message });
        await fireSystemPushNotification(
          '🎉 +1 Bonus Test Unlocked!',
          'Aapko aaj ka 1 extra bonus test mil gaya hai! Jam ke practice karo! 🚀'
        );
      } else {
        setReferralStatus({ 
          success: false, 
          text: 'Browser notification permission allow karke hi +1 bonus test unlock ho sakta hai.' 
        });
      }
    } finally {
      setIsActivatingNotifs(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden text-slate-900">
        
        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Daily Guest Quota Reached
            </span>
          </div>

          <h3 className="text-xl font-black tracking-tight text-white">
            {featureName} Limit Exceeded
          </h3>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            {limitMessage || `Guest users can create ${GUEST_DAILY_LIMITS.TESTS} Tests, 2 Walk sessions, and 2 Paper Evaluations per day.`}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Solution 1: Permanent Free Student Registration (Primary Call to Action) */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Register Free — 100% Unlimited Forever</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                No daily quotas. Unlimited AI tests, paper checking, and cloud performance history. Takes 10 seconds!
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Solution 1.5: Install App on Phone Home Screen (Guest can always install anytime!) */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Install StudyMentor on Your Phone</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Guest students can install the native app anytime! Fullscreen mode, faster launch & zero web address bar.
              </p>
            </div>

            <button
              onClick={() => {
                triggerPwaInstallPrompt();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          </div>

          {/* Solution 2: Unlock +1 Bonus Test by Allowing Notifications */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>Unlock +1 Bonus Test</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Allow friendly exam practice reminders & get instant +1 test creation bonus!
              </p>
            </div>

            <button
              onClick={handleEnableNotificationBonus}
              disabled={isActivatingNotifs}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isActivatingNotifs ? 'Enabling...' : 'Allow & Unlock'}
            </button>
          </div>

          {/* Solution 3: Referral Bonus Engine (+5 Tests & +10 Evaluations) */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">Refer Classmates for Permanent Bonus</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                +5 Tests & +10 Checks
              </span>
            </div>

            {/* My Share Code */}
            {guest?.referralCode && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Your Unique Referral Code</span>
                  <span className="font-mono text-sm font-black text-indigo-700">{guest.referralCode}</span>
                </div>
                <button
                  onClick={handleCopyMyCode}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  {hasCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            )}

            {/* Redeem a friend's code */}
            <form onSubmit={handleApplyCode} className="flex gap-2">
              <input
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                placeholder="Have a friend's code? Enter here..."
                maxLength={10}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Referral Feedback Status */}
            {referralStatus && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                referralStatus.success 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {referralStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />}
                <span className="leading-snug">{referralStatus.text}</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Close &amp; Continue
          </button>
        </div>

      </div>
    </div>
  );
};
