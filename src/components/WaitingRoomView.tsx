import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Lock, 
  Mail, 
  RefreshCw, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  LogOut,
  Laptop,
  Smartphone
} from 'lucide-react';
import { UserProfile } from '../types';
import { SUPER_ADMIN_EMAIL, detectDeviceDetails } from '../utils/security';
import { fetchProfileFromCloud, subscribeToStudentApproval } from '../utils/cloudSync';
import { saveProfile, setActiveProfile } from '../utils/storage';
import { AdminPasswordModal } from './AdminPasswordModal';
import { triggerPwaInstallPrompt } from '../utils/pwaHelper';

interface WaitingRoomViewProps {
  activeProfile: UserProfile | null;
  onRefreshStatus: () => void;
  onSwitchToAdmin: () => void;
  onResetProfile: () => void;
}

export const WaitingRoomView: React.FC<WaitingRoomViewProps> = ({
  activeProfile,
  onRefreshStatus,
  onSwitchToAdmin,
  onResetProfile
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>(new Date().toLocaleTimeString());
  const [isAdminPassModalOpen, setIsAdminPassModalOpen] = useState(false);
  const device = detectDeviceDetails();

  const isBlocked = activeProfile?.approvalStatus === 'blocked' || activeProfile?.isKillSwitched;
  const isRejected = activeProfile?.approvalStatus === 'rejected';
  const isPending = activeProfile?.approvalStatus === 'pending_approval' || (!isBlocked && !isRejected && activeProfile?.approvalStatus !== 'approved');

  // Real-time listener: instant trigger the moment Super Admin Himanshu clicks "Approve"
  useEffect(() => {
    if (!activeProfile?.id) return;

    const unsubscribe = subscribeToStudentApproval(
      activeProfile.id,
      activeProfile.email || '',
      (cloudProfile) => {
        setLastChecked(new Date().toLocaleTimeString());
        if (cloudProfile && cloudProfile.approvalStatus === 'approved' && !cloudProfile.isKillSwitched) {
          const merged: UserProfile = { ...activeProfile, ...cloudProfile, approvalStatus: 'approved', isKillSwitched: false };
          saveProfile(merged);
          setActiveProfile(merged.id);
          onRefreshStatus();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeProfile?.id, activeProfile?.email, onRefreshStatus]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      if (activeProfile?.id) {
        const cloudProfile = await fetchProfileFromCloud(activeProfile.id, activeProfile.email);
        if (cloudProfile) {
          const merged: UserProfile = { ...activeProfile, ...cloudProfile };
          saveProfile(merged);
          if (merged.approvalStatus === 'approved' && !merged.isKillSwitched) {
            setActiveProfile(merged.id);
            onRefreshStatus();
            return;
          }
        }
      }
      onRefreshStatus();
    } finally {
      setTimeout(() => {
        setIsChecking(false);
        setLastChecked(new Date().toLocaleTimeString());
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-inner ${
              isBlocked ? 'bg-rose-600' : isRejected ? 'bg-amber-600' : 'bg-indigo-600'
            }`}>
              {isBlocked ? <Lock className="w-5 h-5" /> : isRejected ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Institutional Gatekeeper</h1>
              <p className="text-xs text-slate-400">StudyMentor AI Security & Access Control</p>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
            isBlocked 
              ? 'bg-rose-950/60 border-rose-800 text-rose-300' 
              : isRejected 
              ? 'bg-amber-950/60 border-amber-800 text-amber-300'
              : 'bg-indigo-950/60 border-indigo-800 text-indigo-300'
          }`}>
            {isBlocked ? 'Access Revoked' : isRejected ? 'Declined' : 'Pending Approval'}
          </div>
        </div>

        {/* Content Box */}
        {isBlocked ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Instant Kill-Switch Triggered</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeProfile?.killSwitchReason || 'Your student session has been suspended by the Super Administrator. You cannot submit evaluations or view answers until reinstated.'}
            </p>
          </div>
        ) : isRejected ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Enrollment Request Declined</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your registration request was not approved for this batch. Please reach out to your instructor with your valid roll number.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-center py-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h2 className="text-xl font-bold text-white">Access Under Review</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hello <span className="font-semibold text-indigo-300">{activeProfile?.name || 'Student'}</span>! Your enrollment request for <span className="text-slate-200 font-medium">{activeProfile?.targetJourney || 'Commerce / CA'}</span> has been sent to Administrator <span className="font-semibold text-white">Himanshu Chawla</span>.
            </p>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-time polling active. You will enter automatically upon approval.</span>
            </div>
          </div>
        )}

        {/* Student Application Summary */}
        <div className="mt-6 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Student Name:</span>
            <span className="font-semibold text-slate-200">{activeProfile?.name || 'New Student'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Roll / ID:</span>
            <span className="font-mono text-slate-200">{activeProfile?.rollNumber || activeProfile?.id?.substring(0, 8) || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Target Course:</span>
            <span className="font-medium text-indigo-300">{activeProfile?.targetJourney || 'Class 12'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Device Bound:</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              {device.os} ({device.browser})
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] font-medium text-white text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Approval...' : 'Check Status Now'}</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => triggerPwaInstallPrompt()}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install App on Phone</span>
            </button>

            <a
              href={`mailto:${SUPER_ADMIN_EMAIL}?subject=StudyMentor Access Request for ${encodeURIComponent(activeProfile.name)}&body=Hello Himanshu Sir,%0D%0A%0D%0APlease approve my access request on StudyMentor AI.%0D%0AStudent: ${encodeURIComponent(activeProfile.name)}%0D%0ACourse: ${encodeURIComponent(activeProfile.targetJourney)}%0D%0AStudent ID: ${activeProfile.id}`}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Admin</span>
            </a>

            <button
              onClick={onResetProfile}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Change Profile</span>
            </button>
          </div>
        </div>

        {/* Master Admin Bypass Key for Himanshu */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40 -mx-6 -mb-6 p-4 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Master Admin Login</span>
          </div>
          <button
            onClick={() => setIsAdminPassModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Log in as Himanshu (Admin)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Admin Password Prompt Modal */}
      <AdminPasswordModal
        isOpen={isAdminPassModalOpen}
        onClose={() => setIsAdminPassModalOpen(false)}
        onSuccess={() => {
          setIsAdminPassModalOpen(false);
          onSwitchToAdmin();
        }}
      />

      <div className="mt-6 text-center text-xs text-slate-500">
        Last Cloud Sync Ping: {lastChecked} • End-to-End Encrypted Session
      </div>
    </div>
  );
};
