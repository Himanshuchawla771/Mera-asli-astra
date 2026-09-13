import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  FileText, 
  PenTool, 
  Sliders, 
  Sparkles, 
  ArrowRight,
  Printer,
  ChevronRight,
  ShieldAlert,
  Laptop,
  Smartphone,
  Tablet,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  RefreshCw,
  Zap,
  Globe,
  Clock,
  LogOut,
  AlertTriangle,
  MessageSquare,
  Bell,
  Layers,
  Building2
} from 'lucide-react';
import { EvaluationResult, UserProfile, AcademicJourney, DeviceSession, UserStatus, ReferenceSource } from '../types';
import { 
  getSavedProfiles, 
  saveProfile, 
  saveProfilesBulk,
  getSavedEvaluations 
} from '../utils/storage';
import { 
  getPartnerApplications, 
  updatePartnerApplicationStatus, 
  PartnerApplication 
} from '../utils/coachingStorage';
import { getAllGuestsForAdmin, mergeGuestsForAdmin, saveGuestRecord, GuestUsageRecord } from '../utils/guestManager';
import { 
  approveStudent, 
  rejectStudent, 
  toggleStudentKillSwitch, 
  terminateDeviceSession, 
  terminateAllOtherSessions,
  getCurrentSessionId,
  SUPER_ADMIN_EMAIL
} from '../utils/security';
import { 
  syncProfileToCloud, 
  fetchAllProfilesFromCloud, 
  subscribeToAllProfiles, 
  updateStudentApprovalCloud,
  fetchAllGuestsFromCloud,
  subscribeToAllGuests,
  adminUpdateGuestLimitsCloud
} from '../utils/cloudSync';
import { AdminSupportInbox } from './AdminSupportInbox';
import { AdminBroadcastNotificationPanel } from './AdminBroadcastNotificationPanel';
import { BatchProcessingQueue } from './BatchProcessingQueue';
import { useDebounce } from '../utils/performance';

interface ClassroomAdminViewProps {
  evaluations: EvaluationResult[];
  activeProfile: UserProfile | null;
  currentJourney: AcademicJourney;
  setCurrentJourney: (journey: AcademicJourney) => void;
  onSelectEvaluation: (evaluation: EvaluationResult) => void;
  onOpenProfileModal: () => void;
  setActiveTab: (tab: any) => void;
  sources?: ReferenceSource[];
}

export const ClassroomAdminView: React.FC<ClassroomAdminViewProps> = ({
  evaluations,
  activeProfile,
  currentJourney,
  setCurrentJourney,
  onSelectEvaluation,
  onOpenProfileModal,
  setActiveTab,
  sources = []
}) => {
  const [adminViewTab, setAdminViewTab] = useState<'gradebook' | 'batch' | 'gatekeeper' | 'devices' | 'guests' | 'rubric' | 'support' | 'broadcast'>('gradebook');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'blocked'>('all');
  const [selectedBatch, setSelectedBatch] = useState('Class 12 Commerce - Batch Alpha');
  const [markingStrictness, setMarkingStrictness] = useState<'standard' | 'strict_icai' | 'diagnostic'>('standard');
  const [showStrictnessSaved, setShowStrictnessSaved] = useState(false);
  const [profilesList, setProfilesList] = useState<UserProfile[]>([]);
  const [partnerApps, setPartnerApps] = useState<PartnerApplication[]>(() => getPartnerApplications());
  const [guestsList, setGuestsList] = useState<GuestUsageRecord[]>(() => getAllGuestsForAdmin());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(new Date().toLocaleTimeString());

  // Load profiles & guests and subscribe to live Firestore + Server multi-device events
  useEffect(() => {
    // 1. Initial local load
    const loaded = getSavedProfiles();
    setProfilesList(loaded);
    const localGuests = getAllGuestsForAdmin();
    setGuestsList(localGuests);

    // 2. Initial fetch from cloud/server for profiles
    fetchAllProfilesFromCloud().then((cloudProfiles) => {
      if (cloudProfiles && cloudProfiles.length > 0) {
        const merged = saveProfilesBulk(cloudProfiles);
        setProfilesList(merged);
        setLastSyncedTime(new Date().toLocaleTimeString());
      }
    }).catch((err) => {
      console.warn('[AdminView] Initial cloud fetch notice:', err);
    });

    // 3. Initial fetch from cloud/server for guests across all devices
    fetchAllGuestsFromCloud().then((cloudGuests) => {
      if (cloudGuests && cloudGuests.length > 0) {
        const merged = mergeGuestsForAdmin(cloudGuests);
        setGuestsList(merged);
      }
    }).catch((err) => {
      console.warn('[AdminView] Initial guest cloud fetch notice:', err);
    });

    // 4. Real-time multi-device subscription for student profiles
    const unsubscribeProfiles = subscribeToAllProfiles((cloudProfiles) => {
      if (cloudProfiles && cloudProfiles.length > 0) {
        const merged = saveProfilesBulk(cloudProfiles);
        setProfilesList(merged);
        setLastSyncedTime(new Date().toLocaleTimeString());
      }
    });

    // 5. Real-time multi-device subscription for guests (instant detection of new guest visits)
    const unsubscribeGuests = subscribeToAllGuests((cloudGuests) => {
      if (cloudGuests && cloudGuests.length > 0) {
        const merged = mergeGuestsForAdmin(cloudGuests);
        setGuestsList(merged);
      }
    });

    return () => {
      unsubscribeProfiles();
      unsubscribeGuests();
    };
  }, []);

  const handleManualRefreshCloud = async () => {
    setIsLoadingCloud(true);
    try {
      const cloudProfiles = await fetchAllProfilesFromCloud();
      if (cloudProfiles && cloudProfiles.length > 0) {
        const merged = saveProfilesBulk(cloudProfiles);
        setProfilesList(merged);
      }
      const cloudGuests = await fetchAllGuestsFromCloud();
      if (cloudGuests && cloudGuests.length > 0) {
        const mergedGuests = mergeGuestsForAdmin(cloudGuests);
        setGuestsList(mergedGuests);
      }
      showToast('Synced all student and guest records from cloud.');
      setLastSyncedTime(new Date().toLocaleTimeString());
    } catch (e) {
      showToast('Using local offline student records.');
    } finally {
      setIsLoadingCloud(false);
    }
  };

  const handleRefreshGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const cloudGuests = await fetchAllGuestsFromCloud();
      if (cloudGuests && cloudGuests.length > 0) {
        const merged = mergeGuestsForAdmin(cloudGuests);
        setGuestsList(merged);
        showToast(`Synced ${cloudGuests.length} guest records across all devices.`);
      } else {
        const local = getAllGuestsForAdmin();
        setGuestsList(local);
        showToast('Guest directory is up to date.');
      }
    } catch (e) {
      showToast('Error syncing guests from cloud.');
    } finally {
      setIsLoadingGuests(false);
    }
  };

  const handleGrantGuestBonus = async (guestId: string, bonusTests: number, bonusEvaluations: number) => {
    try {
      await adminUpdateGuestLimitsCloud(guestId, bonusTests, bonusEvaluations, false);
      setGuestsList(prev => prev.map(g => {
        if (g.guestId === guestId) {
          const updated = {
            ...g,
            bonusTests: (g.bonusTests || 0) + bonusTests,
            bonusEvaluations: (g.bonusEvaluations || 0) + bonusEvaluations,
            lastActiveAt: new Date().toISOString()
          };
          saveGuestRecord(updated);
          return updated;
        }
        return g;
      }));
      showToast(`Granted +${bonusTests} Tests & +${bonusEvaluations} Evals to guest!`);
    } catch (e) {
      showToast('Failed to update guest limits.');
    }
  };

  const handleResetGuestDaily = async (guestId: string) => {
    try {
      await adminUpdateGuestLimitsCloud(guestId, 0, 0, true);
      setGuestsList(prev => prev.map(g => {
        if (g.guestId === guestId) {
          const updated = {
            ...g,
            dailyTestsCreated: 0,
            dailyWalkSessions: 0,
            dailyEvaluations: 0,
            lastActiveAt: new Date().toISOString()
          };
          saveGuestRecord(updated);
          return updated;
        }
        return g;
      }));
      showToast("Reset today's usage limits for this guest!");
    } catch (e) {
      showToast('Failed to reset daily limits.');
    }
  };

  const handleCreateDemoGuest = () => {
    const demoGuest: GuestUsageRecord = {
      guestId: `guest_${Date.now()}_sample`,
      guestName: 'Rohan Sharma (Demo Guest)',
      deviceFingerprint: 'dev_mobile_samsung_s23',
      referralCode: 'ROHAN449',
      lastDate: new Date().toISOString().split('T')[0],
      dailyTestsCreated: 1,
      dailyWalkSessions: 2,
      dailyEvaluations: 1,
      bonusTests: 5,
      bonusEvaluations: 10,
      hasUsedReferral: true,
      referredByCode: 'PRIYA102',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    saveGuestRecord(demoGuest);
    setGuestsList(prev => [demoGuest, ...prev]);
    showToast('Sample Guest record generated & synced to cloud!');
  };

  const refreshProfiles = () => {
    const loaded = getSavedProfiles();
    setProfilesList(loaded);
    handleManualRefreshCloud();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Debounced search query to eliminate unnecessary re-filtering on rapid keystrokes
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  // Filter evaluations for the current journey and search
  const journeyEvals = evaluations.filter(e => e.journey === currentJourney);
  const subjects = ['All', ...Array.from(new Set(journeyEvals.map(e => e.subject).filter(Boolean)))];

  const filteredEvals = journeyEvals.filter(e => {
    const matchesSearch = 
      e.test_title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (e.file_name && e.file_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    const matchesSubject = subjectFilter === 'All' || e.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  // Classroom metrics
  const totalSubmissions = journeyEvals.length;
  const totalMaxPossible = journeyEvals.reduce((acc, curr) => acc + curr.total_max_marks, 0);
  const totalObtainedSum = journeyEvals.reduce((acc, curr) => acc + curr.total_obtained_marks, 0);
  const classAvgPercentage = totalMaxPossible > 0 ? Math.round((totalObtainedSum / totalMaxPossible) * 1000) / 10 : 0;
  
  const distinctions = journeyEvals.filter(e => e.percentage >= 75).length;
  const needRemedial = journeyEvals.filter(e => e.percentage < 50).length;
  const passRate = totalSubmissions > 0 ? Math.round(((totalSubmissions - needRemedial) / totalSubmissions) * 100) : 100;

  // Student Approvals & Security stats
  const pendingApprovalsCount = profilesList.filter(p => p.approvalStatus === 'pending_approval' || (p.role === 'student' && !p.approvalStatus)).length;
  const activeStudentsCount = profilesList.filter(p => p.approvalStatus === 'approved' || (p.role === 'teacher_admin')).length;
  const blockedCount = profilesList.filter(p => p.approvalStatus === 'blocked' || p.isKillSwitched).length;

  // Collect all active device sessions across all users (deduplicated)
  const currentSessionId = getCurrentSessionId();
  const seenSessionCombos = new Set<string>();
  const allSessions: Array<DeviceSession & { studentName: string; studentRole: string; isSuperAdmin: boolean; uniqueKey: string }> = [];
  profilesList.forEach(p => {
    if (p.deviceSessions && p.deviceSessions.length > 0) {
      p.deviceSessions.forEach((sess, sIdx) => {
        if (!sess || !sess.sessionId) return;
        const comboKey = `${p.id}_${sess.sessionId}`;
        if (seenSessionCombos.has(comboKey)) return;
        seenSessionCombos.add(comboKey);

        allSessions.push({
          ...sess,
          studentName: p.name,
          studentRole: p.role,
          isSuperAdmin: p.email === SUPER_ADMIN_EMAIL || p.role === 'teacher_admin',
          uniqueKey: `session_${p.id}_${sess.sessionId}_${sIdx}`
        });
      });
    }
  });

  // Filter profiles for Gatekeeper
  const filteredProfiles = profilesList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                          (p.email && p.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
                          (p.rollNumber && p.rollNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    const status = p.approvalStatus || (p.role === 'teacher_admin' ? 'approved' : 'pending_approval');
    if (statusFilter === 'pending') return status === 'pending_approval';
    if (statusFilter === 'approved') return status === 'approved' && !p.isKillSwitched;
    if (statusFilter === 'blocked') return status === 'blocked' || p.isKillSwitched;
    return true;
  });

  // Export Gradebook as CSV
  const handleExportCSV = () => {
    if (journeyEvals.length === 0) return;

    const headers = ['Test ID', 'Test Title', 'Subject', 'Max Marks', 'Obtained Marks', 'Percentage', 'Status', 'Date'];
    const rows = journeyEvals.map(e => [
      `"${e.id}"`,
      `"${e.test_title.replace(/"/g, '""')}"`,
      `"${e.subject}"`,
      e.total_max_marks,
      e.total_obtained_marks,
      `${e.percentage}%`,
      e.percentage >= 75 ? 'Distinction' : e.percentage >= 40 ? 'Passed' : 'Needs Remedial',
      `"${new Date(e.evaluated_at).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudyMentor_Classroom_Gradebook_${currentJourney}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveStrictness = () => {
    setShowStrictnessSaved(true);
    setTimeout(() => setShowStrictnessSaved(false), 2500);
  };

  // Actions for Gatekeeper with Cloud & Server Dual Sync
  const handleApprove = async (studentId: string, name: string) => {
    const adminName = activeProfile?.name || 'Himanshu Chawla';
    const updated = approveStudent(studentId, adminName);
    setProfilesList(updated);
    showToast(`Access granted to ${name}!`);
    await updateStudentApprovalCloud(studentId, 'approved', adminName);
  };

  const handleReject = async (studentId: string, name: string) => {
    const adminName = activeProfile?.name || 'Himanshu Chawla';
    const updated = rejectStudent(studentId);
    setProfilesList(updated);
    showToast(`Declined registration for ${name}.`);
    await updateStudentApprovalCloud(studentId, 'rejected', adminName, 'Registration declined by administrator.');
  };

  const handleToggleKillSwitch = async (studentId: string, name: string, isBlocked: boolean) => {
    const adminName = activeProfile?.name || 'Himanshu Chawla';
    const updated = toggleStudentKillSwitch(studentId, 'Emergency Kill-Switch triggered by Super Administrator');
    setProfilesList(updated);
    showToast(isBlocked ? `Unblocked ${name}. Access reinstated.` : `⚡ Kill-Switch Triggered: ${name} is blocked immediately!`);
    await updateStudentApprovalCloud(studentId, isBlocked ? 'approved' : 'blocked', adminName, 'Emergency Kill-Switch');
  };

  const handleApproveAllPending = async () => {
    const pending = profilesList.filter(p => (p.approvalStatus === 'pending_approval' || (p.role === 'student' && !p.approvalStatus)) && p.email !== SUPER_ADMIN_EMAIL);
    if (pending.length === 0) return;

    const adminName = activeProfile?.name || 'Himanshu Chawla';
    for (const s of pending) {
      approveStudent(s.id, adminName);
      updateStudentApprovalCloud(s.id, 'approved', adminName);
    }
    const fresh = getSavedProfiles();
    setProfilesList(fresh);
    showToast(`Approved all ${pending.length} pending student registrations!`);
  };

  const handleTerminateSession = (userId: string, sessionId: string, deviceName: string) => {
    const updated = terminateDeviceSession(userId, sessionId);
    setProfilesList(updated);
    showToast(`Terminated ${deviceName} session.`);
  };

  const handleApprovePartner = (appId: string, instName: string) => {
    const updated = updatePartnerApplicationStatus(appId, 'approved');
    setPartnerApps(updated);
    
    // Also approve matching user profile if registered
    const app = partnerApps.find(a => a.id === appId);
    if (app && app.email) {
      const profs = getSavedProfiles();
      const targetProf = profs.find(p => p.email?.toLowerCase() === app.email?.toLowerCase());
      if (targetProf) {
        targetProf.role = 'coaching_partner';
        targetProf.approvalStatus = 'approved';
        targetProf.institution = app.instituteName;
        targetProf.watermarkText = app.watermarkText;
        saveProfile(targetProf);
        syncProfileToCloud(targetProf).catch(() => {});
        setProfilesList(getSavedProfiles());
      }
    }
    showToast(`Granted Institutional Partner license to "${instName}". Coaching hub unlocked!`);
  };

  const handleRejectPartner = (appId: string, instName: string) => {
    const updated = updatePartnerApplicationStatus(appId, 'rejected');
    setPartnerApps(updated);
    showToast(`Declined partner application for "${instName}".`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-indigo-500/30 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Inspector Console Info */}
      <div className="rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin &amp; Gatekeeper Command Center
            </span>
            <span className="text-xs text-slate-300 font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              Admin: {activeProfile.name} (Super Admin)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Institutional Control &amp; Student Gatekeeper
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage student approvals, trigger instant kill-switches, monitor live multi-device sessions, and inspect evaluated copies across all 50+ concurrent students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenProfileModal}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
          >
            Admin Profile
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        
        <button
          onClick={() => setAdminViewTab('gradebook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'gradebook'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <span>Classroom Gradebook</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {totalSubmissions}
          </span>
        </button>

        <button
          onClick={() => setAdminViewTab('batch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'batch'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Batch Upload Queue</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
            Bulk Mode
          </span>
        </button>

        <button
          onClick={() => setAdminViewTab('gatekeeper')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'gatekeeper'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Approval Gatekeeper (Waiting Room)</span>
          {pendingApprovalsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black animate-pulse">
              {pendingApprovalsCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminViewTab('devices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'devices'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4 text-emerald-500" />
          <span>Active Device Tracker</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
            {allSessions.length} Online
          </span>
        </button>

        <button
          onClick={() => setAdminViewTab('guests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'guests'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Guest Registry &amp; Referrals</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {guestsList.length} Guests
          </span>
        </button>

        <button
          onClick={() => setAdminViewTab('support')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'support'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          <span>Support & Help Desk (Direct Chat)</span>
        </button>

        <button
          onClick={() => setAdminViewTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'broadcast'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Broadcast Push Notifications</span>
        </button>

        <button
          onClick={() => setAdminViewTab('rubric')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            adminViewTab === 'rubric'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-indigo-500" />
          <span>Examiner Rubric Preset</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* TAB 1: CLASSROOM GRADEBOOK & SUBMISSIONS */}
      {/* ========================================================= */}
      {adminViewTab === 'gradebook' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Classroom High-Level Metrics (Bento Grid) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Submissions */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Submissions</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalSubmissions}
              </div>
              <p className="text-[11px] text-gray-500">
                Checked answer copies in current journey
              </p>
            </div>

            {/* Metric 2: Class Average */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Class Average</span>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                {classAvgPercentage}%
              </div>
              <p className="text-[11px] text-gray-500">
                Across all evaluated subjects
              </p>
            </div>

            {/* Metric 3: Distinctions (>= 75%) */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Distinctions</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                {distinctions} <span className="text-xs text-gray-400 font-normal">copies</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Scored 75%+ with exemplary working notes
              </p>
            </div>

            {/* Metric 4: Batch Pass Rate */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pass Rate</span>
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {passRate}%
              </div>
              <p className="text-[11px] text-gray-500">
                {needRemedial > 0 ? `${needRemedial} students recommended for remedial drill` : 'All students cleared threshold'}
              </p>
            </div>

          </div>

          {/* Gradebook Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden space-y-0">
            
            {/* Table Header Controls */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Student Submissions Roster ({filteredEvals.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Showing verified answer sheets for {currentJourney === 'CLASS_12' ? 'Class 12 CBSE' : 'CA Foundation'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search test title or student..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              {filteredEvals.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Test Title &amp; Document</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-center">Percentage</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                    {filteredEvals.map((e) => {
                      const isDistinction = e.percentage >= 75;
                      const isPass = e.percentage >= 40;

                      return (
                        <tr 
                          key={e.id}
                          onClick={() => onSelectEvaluation(e)}
                          className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block line-clamp-1">
                                {e.test_title}
                              </span>
                              <span className="text-[11px] text-gray-400 font-mono">
                                {e.file_name || 'Standard Upload'} • {new Date(e.evaluated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                                {e.studentName || (e.userId ? (profilesList.find(p => p.id === e.userId)?.name || e.userId) : 'Admin')}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {e.subject}
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold">
                            <span className="text-slate-900">{e.total_obtained_marks}</span>
                            <span className="text-gray-400"> / {e.total_max_marks}</span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold">
                            <span className={isDistinction ? 'text-amber-600' : isPass ? 'text-indigo-600' : 'text-rose-600'}>
                              {e.percentage}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                              isDistinction
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : isPass
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}>
                              {isDistinction ? 'Distinction' : isPass ? 'Passed' : 'Needs Review'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                onSelectEvaluation(e);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                            >
                              <span>Inspect Copy</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center space-y-3">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No evaluations found in this batch</p>
                  <p className="text-xs text-gray-500">
                    Upload student answer sheets in the "Evaluate PDF" tab to populate this classroom gradebook.
                  </p>
                  <button
                    onClick={() => setActiveTab('evaluate')}
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition-all cursor-pointer inline-block"
                  >
                    Upload Answer Sheet
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GATEKEEPER (STUDENT APPROVALS & KILL SWITCH) */}
      {/* ========================================================= */}
      {adminViewTab === 'gatekeeper' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Real-time Cloud Sync & Manual Refresh Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Real-Time Multi-Device Sync Active</span>
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Dual Cloud &amp; Server
                  </span>
                </p>
                <p className="text-[10px] text-slate-400">
                  New student signups and waiting room requests stream to this console instantly • Last ping: {lastSyncedTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pendingApprovalsCount > 0 && (
                <button
                  onClick={handleApproveAllPending}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve All ({pendingApprovalsCount})</span>
                </button>
              )}

              <button
                onClick={handleManualRefreshCloud}
                disabled={isLoadingCloud}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Force refresh student registrations from cloud database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCloud ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isLoadingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>
            </div>
          </div>

          {/* Urgent Pending Registration Banner for Admin Himanshu */}
          {pendingApprovalsCount > 0 && (
            <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm animate-pulse">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 dark:text-amber-300">
                      ⚡ Action Required: {pendingApprovalsCount} Student{pendingApprovalsCount > 1 ? 's' : ''} in Waiting Room
                    </h4>
                    <p className="text-xs text-amber-800/90 dark:text-amber-400/90">
                      Students registered on their devices and are awaiting your authorization to enter StudyMentor AI.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleApproveAllPending}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>One-Click Approve All</span>
                </button>
              </div>

              {/* Quick Action Cards for Pending Students */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profilesList
                  .filter(p => (p.approvalStatus === 'pending_approval' || (p.role === 'student' && !p.approvalStatus)) && p.email !== SUPER_ADMIN_EMAIL)
                  .map(pendingStudent => (
                    <div 
                      key={pendingStudent.id}
                      className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{pendingStudent.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-50 text-indigo-700 font-semibold">
                            {pendingStudent.targetJourney}
                          </span>
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono truncate">
                          {pendingStudent.email || 'No email'} • Roll: {pendingStudent.rollNumber || 'N/A'}
                        </p>
                        {pendingStudent.institution && (
                          <p className="text-[10px] text-gray-400 truncate">
                            {pendingStudent.institution}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleApprove(pendingStudent.id, pendingStudent.name)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(pendingStudent.id, pendingStudent.name)}
                          className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Institutional Coaching Partner Applications & Verification Gateway */}
          <div className="bg-white rounded-3xl border border-indigo-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Institutional Coaching Partner Requests</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      B2B Hub Licensing
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and approve coaching institutes, teachers, and academies applying for bulk evaluation pipelines.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  {partnerApps.filter(a => a.status === 'pending').length} Pending Requests
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {partnerApps.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  No institutional partner applications submitted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerApps.map(app => (
                    <div 
                      key={app.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        app.status === 'approved'
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : app.status === 'rejected'
                          ? 'bg-rose-50/40 border-rose-200 opacity-70'
                          : 'bg-white border-amber-300 ring-2 ring-amber-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900">{app.instituteName}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-semibold">{app.partnerName} • {app.city || 'National'}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="py-2.5 text-[11px] text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Official Contact:</span>
                          <span className="font-mono text-slate-800 font-semibold">{app.email} | {app.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Estimated Batch:</span>
                          <span className="font-bold text-slate-800">{app.estimatedStudents} Students / month</span>
                        </div>
                        {app.watermarkText && (
                          <div className="text-[10px] font-mono text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded-lg truncate">
                            Mark: "{app.watermarkText}"
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleApprovePartner(app.id, app.instituteName)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Grant Institutional License</span>
                          </button>
                        )}
                        {app.status === 'pending' && (
                          <button
                            onClick={() => handleRejectPartner(app.id, app.instituteName)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                        )}
                        {app.status === 'approved' && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active Licensed Partner</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Security Gatekeeper Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-900">{pendingApprovalsCount}</div>
              <p className="text-[11px] text-amber-700">Students in Waiting Room</p>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200/80 space-y-1">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider">Active Approved Students</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-900">{activeStudentsCount}</div>
              <p className="text-[11px] text-emerald-700">Accessing study tools</p>
            </div>

            <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200/80 space-y-1">
              <div className="flex items-center justify-between text-rose-800">
                <span className="text-xs font-bold uppercase tracking-wider">Kill-Switched / Blocked</span>
                <Lock className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-3xl font-black text-rose-900">{blockedCount}</div>
              <p className="text-[11px] text-rose-700">Instantly locked out</p>
            </div>
          </div>

          {/* Student Access Gate Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Student Access Control Roster ({filteredProfiles.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Approve new student sign-ins, reject unauthorized accounts, or execute instant kill-switches.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search student or roll..."
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                  {(['all', 'pending', 'approved', 'blocked'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        statusFilter === s ? 'bg-slate-900 text-white' : 'text-gray-600 hover:text-slate-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student &amp; Email</th>
                    <th className="py-3 px-4">Target Journey</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Devices</th>
                    <th className="py-3 px-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                  {filteredProfiles.map((p, idx) => {
                    const isSuperAdmin = p.email === SUPER_ADMIN_EMAIL || p.role === 'teacher_admin';
                    const isBlocked = p.approvalStatus === 'blocked' || p.isKillSwitched;
                    const isPending = p.approvalStatus === 'pending_approval' || (!p.approvalStatus && !isSuperAdmin);
                    const isApproved = (p.approvalStatus === 'approved' || isSuperAdmin) && !isBlocked;

                    return (
                      <tr key={`prof_${p.id}_${idx}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {isSuperAdmin && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">Admin</span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-400 font-mono">
                                {isSuperAdmin ? 'Master Access' : (p.email || 'No email registered')} • Roll: {p.rollNumber || (isSuperAdmin ? 'MASTER-KEY' : p.id.substring(0, 8))}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {p.targetJourney}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isBlocked
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {isBlocked ? <Lock className="w-3 h-3" /> : isPending ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            <span>{isBlocked ? 'Access Blocked' : isPending ? 'Pending In Review' : 'Approved Active'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-xs">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold">
                            {p.deviceSessions?.length || 1} Device
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isSuperAdmin ? (
                            <span className="text-[11px] text-gray-400 italic">Master Owner</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve Button */}
                              {(!isApproved || isPending) && (
                                <button
                                  onClick={() => handleApprove(p.id, p.name)}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Approve access to application"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {/* Reject Button (if pending) */}
                              {isPending && (
                                <button
                                  onClick={() => handleReject(p.id, p.name)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                                  title="Decline request"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </button>
                              )}

                              {/* Instant Kill-Switch Button */}
                              <button
                                onClick={() => handleToggleKillSwitch(p.id, p.name, isBlocked)}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                                  isBlocked
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                                }`}
                                title={isBlocked ? 'Reinstate access' : 'Instantly revoke access (Kill-Switch)'}
                              >
                                {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                                <span>{isBlocked ? 'Unblock' : '⚡ Kill-Switch'}</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LIVE ACTIVE DEVICE SESSIONS TRACKER */}
      {/* ========================================================= */}
      {adminViewTab === 'devices' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  <span>Real-Time Device &amp; Login Session Tracker</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Track connected browsers, operating systems, and remote IP sessions. Terminate suspicious logins instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshProfiles}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-slate-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Sessions</span>
                </button>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="overflow-x-auto">
              {allSessions.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">User &amp; Role</th>
                      <th className="py-3 px-4">Device &amp; Browser</th>
                      <th className="py-3 px-4">Location / Network</th>
                      <th className="py-3 px-4">Login Time</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                    {allSessions.map((sess, idx) => {
                      const isCurrent = sess.sessionId === currentSessionId;
                      const isTerminated = sess.status === 'terminated';

                      return (
                        <tr key={`sess-row-${idx}-${sess.sessionId}-${sess.userId || 'u'}`} className={`hover:bg-slate-50/60 transition-colors ${isTerminated ? 'opacity-50' : ''}`}>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{sess.studentName}</span>
                              {sess.isSuperAdmin && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">Admin</span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono">
                              {sess.userEmail || sess.userId}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {sess.deviceType === 'Mobile' ? (
                                <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
                              ) : sess.deviceType === 'Tablet' ? (
                                <Tablet className="w-4 h-4 text-indigo-600 shrink-0" />
                              ) : (
                                <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                              )}
                              <div>
                                <span className="font-bold text-slate-800 block">
                                  {sess.os} • {sess.browser}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  ID: {sess.sessionId.substring(0, 14)}...
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Globe className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{sess.locationHint || 'India (Authorized Ingress)'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                            {new Date(sess.loginTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(sess.loginTimestamp).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {isCurrent ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                                Current Tab
                              </span>
                            ) : isTerminated ? (
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                                Terminated
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                Active Session
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {!isTerminated && !isCurrent && (
                              <button
                                onClick={() => handleTerminateSession(sess.userId, sess.sessionId, `${sess.os} (${sess.browser})`)}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-all flex items-center gap-1 ml-auto cursor-pointer"
                                title="Force logout this device session"
                              >
                                <LogOut className="w-3 h-3" />
                                <span>Kick Device</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  No active device sessions recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: EVALUATOR RUBRIC & MARKING STRICTNESS CONTROLS */}
      {/* ========================================================= */}
      {adminViewTab === 'rubric' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Evaluator Grading Strictness &amp; Marking Rubric</span>
              </h2>
              <p className="text-xs text-gray-500">
                Configure how the 3-Agent AI Evaluator handles working notes, presentation slips, and legal provisions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {showStrictnessSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Settings Applied!
                </span>
              )}
              <button
                onClick={handleSaveStrictness}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Save Rubric Preset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Option 1: Standard Board */}
            <div
              onClick={() => setMarkingStrictness('standard')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 ${
                markingStrictness === 'standard'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">Standard CBSE Board Rubric</span>
                {markingStrictness === 'standard' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Balanced step marking. Deducts 0.5 marks for minor presentation slips, with standard credit for formula and partial steps.
              </p>
            </div>

            {/* Option 2: Strict ICAI Professional */}
            <div
              onClick={() => setMarkingStrictness('strict_icai')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 ${
                markingStrictness === 'strict_icai'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">ICAI Strict Professional Benchmark</span>
                {markingStrictness === 'strict_icai' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ultra-strict examiner mode. Severe penalties for missing Working Notes (WN), omitted statutory citations, or unrounded calculations.
              </p>
            </div>

            {/* Option 3: Diagnostic / Lenient */}
            <div
              onClick={() => setMarkingStrictness('diagnostic')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 ${
                markingStrictness === 'diagnostic'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">Diagnostic Learning Mode</span>
                {markingStrictness === 'diagnostic' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Encouraging evaluation. Focuses primarily on conceptual understanding and core formulas, offering detailed constructive guidance.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: GUEST REGISTRY & REFERRAL TRACKER */}
      {/* ========================================================= */}
      {adminViewTab === 'guests' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Guest Student Directory &amp; Device Tracker</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track every guest student who entered using their name, their 1-device lock, daily quota utilization, and referral bonus generation across all devices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCreateDemoGuest}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer border border-indigo-200"
                  title="Generate a sample guest student to preview name and limits"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Demo Guest</span>
                </button>

                <button
                  onClick={handleRefreshGuests}
                  disabled={isLoadingGuests}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 border border-gray-200"
                  title="Sync guests from cloud server"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGuests ? 'animate-spin text-emerald-600' : ''}`} />
                  <span>{isLoadingGuests ? 'Syncing...' : 'Refresh Guests'}</span>
                </button>

                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {guestsList.length} Active Guests
                </span>
              </div>
            </div>

            {guestsList.length === 0 ? (
              <div className="p-10 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 space-y-3">
                <Users className="w-10 h-10 text-emerald-500/60 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No guest sessions recorded yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    Any student who enters using the &quot;Guest Entry&quot; option on login will immediately appear here in real-time with their name, device fingerprint, and quota.
                  </p>
                </div>
                <button
                  onClick={handleCreateDemoGuest}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Sample Guest Student</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 uppercase font-semibold text-[10px] border-y border-gray-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Guest Student Name</th>
                      <th className="py-3 px-4">Guest ID / Device</th>
                      <th className="py-3 px-4">Referral Code</th>
                      <th className="py-3 px-4">Today&apos;s Daily Quota</th>
                      <th className="py-3 px-4">Bonus Wallet</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
                    {guestsList.map((g, idx) => (
                      <tr key={`guest_${g.guestId}_${idx}`} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center text-xs shrink-0 shadow-xs border border-emerald-200/60 dark:border-emerald-800/40">
                              {g.guestName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                {g.guestName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                Enrolled: {new Date(g.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          <div className="font-semibold text-slate-700 dark:text-slate-300">{g.guestId}</div>
                          <div className="text-[10px] text-slate-400">Dev: {g.deviceFingerprint.slice(0, 14)}...</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                            {g.referralCode}
                          </span>
                          {g.referredByCode && (
                            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                              Referred by: {g.referredByCode}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Tests:</span>
                              <span className={`font-bold ${g.dailyTestsCreated >= 2 ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                {g.dailyTestsCreated} / 2
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Walk &amp; Revise:</span>
                              <span className={`font-bold ${g.dailyWalkSessions >= 2 ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                {g.dailyWalkSessions} / 2
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Evals:</span>
                              <span className={`font-bold ${g.dailyEvaluations >= 2 ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                {g.dailyEvaluations} / 2
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs whitespace-nowrap">
                            +{g.bonusTests || 0} Tests | +{g.bonusEvaluations || 0} Evals
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(g.lastActiveAt || g.createdAt).toLocaleDateString()} {new Date(g.lastActiveAt || g.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleGrantGuestBonus(g.guestId, 5, 0)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer whitespace-nowrap"
                              title="Grant +5 bonus tests to this guest"
                            >
                              +5 Tests
                            </button>
                            <button
                              onClick={() => handleGrantGuestBonus(g.guestId, 0, 10)}
                              className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 transition-colors cursor-pointer whitespace-nowrap"
                              title="Grant +10 bonus paper evaluations to this guest"
                            >
                              +10 Evals
                            </button>
                            <button
                              onClick={() => handleResetGuestDaily(g.guestId)}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition-colors cursor-pointer whitespace-nowrap"
                              title="Reset today's used limits to 0"
                            >
                              Reset Quota
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PRIVATE SUPPORT & STUDENT INQUIRIES */}
      {/* ========================================================= */}
      {adminViewTab === 'support' && (
        <div className="space-y-6 animate-fadeIn">
          <AdminSupportInbox adminProfile={activeProfile} />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: BROADCAST PUSH NOTIFICATIONS ENGINE */}
      {/* ========================================================= */}
      {adminViewTab === 'broadcast' && (
        <div className="space-y-6 animate-fadeIn">
          <AdminBroadcastNotificationPanel />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: BATCH EVALUATION QUEUE FOR COACHING INSTITUTES */}
      {/* ========================================================= */}
      {adminViewTab === 'batch' && (
        <div className="space-y-6 animate-fadeIn">
          <BatchProcessingQueue
            currentJourney={currentJourney}
            sources={sources}
            onSelectEvaluation={onSelectEvaluation}
          />
        </div>
      )}

    </div>
  );
};
