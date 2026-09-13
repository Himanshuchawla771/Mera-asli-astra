import { AcademicJourney, DeviceSession, UserProfile, UserStatus } from '../types';
import { getSavedProfiles, saveProfile, getActiveProfile, setActiveProfile } from './storage';
import { syncProfileToCloud } from './cloudSync';

const SESSION_KEY = 'studymentor_device_session_id';

// Super Admin definition & Master Key
export const SUPER_ADMIN_EMAIL = 'himanshuch492@gmail.com';
export const MASTER_ADMIN_PASSWORD = 'Himanshuch@11!';

/**
 * Verify Master Admin Password for Himanshu Chawla
 */
export function verifyMasterAdminPassword(password: string): boolean {
  return password.trim() === MASTER_ADMIN_PASSWORD;
}

/**
 * Register a new student with required credentials
 */
export function registerNewStudent(params: {
  name: string;
  email: string;
  password: string;
  targetJourney: AcademicJourney;
  institution?: string;
  rollNumber?: string;
}): { success: boolean; profile?: UserProfile; error?: string } {
  if (!params.name.trim()) return { success: false, error: 'Full name is required' };
  if (!params.email.trim()) return { success: false, error: 'Email address is required' };
  if (!params.password || params.password.length < 4) return { success: false, error: 'Password must be at least 4 characters' };

  const isHimanshu = params.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  
  if (isHimanshu) {
    // If registering as admin, password MUST match Master Admin Password
    if (!verifyMasterAdminPassword(params.password)) {
      return { success: false, error: 'Invalid Super Admin password for Himanshu Chawla.' };
    }
  }

  const profiles = getSavedProfiles();
  const existing = profiles.find(p => p.email && p.email.toLowerCase() === params.email.trim().toLowerCase());

  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please Sign In.' };
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim(),
    email: params.email.trim().toLowerCase(),
    role: isHimanshu ? 'teacher_admin' : 'student',
    targetJourney: params.targetJourney,
    institution: params.institution?.trim() || undefined,
    rollNumber: params.rollNumber?.trim() || undefined,
    targetScorePercentage: 95,
    hasInspectorPrivilege: isHimanshu,
    approvalStatus: isHimanshu ? 'approved' : 'pending_approval',
    isKillSwitched: false,
    passwordHash: btoa(params.password), // standard client obfuscation
    bio: isHimanshu 
      ? 'Super Admin & Lead Paper Examiner.' 
      : `${params.targetJourney === 'CLASS_12' ? 'Class 12 Commerce' : params.targetJourney === 'CA_INTERMEDIATE' ? 'CA Intermediate' : params.targetJourney === 'NEET' ? 'NEET (UG) Medical' : 'CA Foundation'} Student preparing for Exams.`,
    createdAt: new Date().toISOString()
  };

  saveProfile(newProfile);
  setActiveProfile(newProfile.id);
  syncProfileToCloud(newProfile).catch(err => console.warn('[Security] Cloud profile sync:', err));

  return { success: true, profile: newProfile };
}

/**
 * Register a new Coaching Institute / Teacher Partner
 */
export function registerNewCoachingPartner(params: {
  instituteName: string;
  partnerName: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  estimatedStudents?: number;
  watermarkText?: string;
}): { success: boolean; profile?: UserProfile; error?: string } {
  if (!params.instituteName.trim()) return { success: false, error: 'Institute / Coaching name is required' };
  if (!params.partnerName.trim()) return { success: false, error: 'Director / Lead Teacher name is required' };
  if (!params.email.trim()) return { success: false, error: 'Official email address is required' };
  if (!params.password || params.password.length < 4) return { success: false, error: 'Password must be at least 4 characters' };

  const cleanEmail = params.email.trim().toLowerCase();
  const isHimanshu = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  const profiles = getSavedProfiles();
  const existing = profiles.find(p => p.email && p.email.toLowerCase() === cleanEmail);

  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please Sign In.' };
  }

  const newProfile: UserProfile = {
    id: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.partnerName.trim(),
    email: cleanEmail,
    phone: params.phone?.trim(),
    role: isHimanshu ? 'teacher_admin' : 'coaching_partner',
    targetJourney: 'CLASS_12',
    institution: params.instituteName.trim(),
    instituteCity: params.city?.trim() || 'National',
    estimatedStudents: params.estimatedStudents || 50,
    watermarkText: params.watermarkText?.trim() || `${params.instituteName.trim().toUpperCase()} • OFFICIAL EVALUATION`,
    targetScorePercentage: 90,
    hasInspectorPrivilege: isHimanshu,
    approvalStatus: isHimanshu ? 'approved' : 'pending_approval',
    isKillSwitched: false,
    passwordHash: btoa(params.password),
    bio: `Institutional Coaching Partner: ${params.instituteName.trim()} (${params.city || 'India'})`,
    createdAt: new Date().toISOString()
  };

  saveProfile(newProfile);
  setActiveProfile(newProfile.id);
  syncProfileToCloud(newProfile).catch(err => console.warn('[Security] Cloud profile sync:', err));

  return { success: true, profile: newProfile };
}

/**
 * Authenticate login with email and password
 */
export function authenticateUser(email: string, password: string): { success: boolean; profile?: UserProfile; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const isHimanshu = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  if (isHimanshu) {
    if (!verifyMasterAdminPassword(password)) {
      return { success: false, error: 'Incorrect Master Admin password for Himanshu Chawla.' };
    }

    const profiles = getSavedProfiles();
    let adminProf = profiles.find(p => p.email && p.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());

    if (!adminProf) {
      adminProf = {
        id: 'admin_himanshu',
        name: 'Himanshu Chawla',
        role: 'teacher_admin',
        email: SUPER_ADMIN_EMAIL,
        targetJourney: 'CLASS_12',
        hasInspectorPrivilege: true,
        approvalStatus: 'approved',
        isKillSwitched: false,
        passwordHash: btoa(MASTER_ADMIN_PASSWORD),
        bio: 'Super Admin & Lead Paper Examiner for Class 12 & CA Foundation.',
        assignedBatches: ['Class 12 Commerce - Batch Alpha', 'CA Foundation - Fastrack Batch 1'],
        createdAt: new Date().toISOString()
      };
      saveProfile(adminProf);
    }

    setActiveProfile(adminProf.id);
    return { success: true, profile: adminProf };
  }

  // Student login
  const profiles = getSavedProfiles();
  const student = profiles.find(p => p.email && p.email.toLowerCase() === cleanEmail);

  if (!student) {
    return { success: false, error: 'No account found with this email. Please Register first.' };
  }

  // Verify password if set
  if (student.passwordHash) {
    try {
      const stored = atob(student.passwordHash);
      if (stored !== password) {
        return { success: false, error: 'Incorrect password.' };
      }
    } catch {
      // fallback
    }
  }

  setActiveProfile(student.id);
  return { success: true, profile: student };
}

/**
 * Detect client device information
 */
export function detectDeviceDetails(): {
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  locationHint: string;
} {
  const ua = navigator.userAgent;
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

  let browser = 'Chrome';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opr\//i.test(ua)) browser = 'Opera';

  let os = 'Windows';
  if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return {
    deviceType,
    browser,
    os,
    locationHint: 'India (Authorized Ingress)'
  };
}

/**
 * Get or create unique session ID for current browser tab
 */
export function getCurrentSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Register or heartbeat current device session
 */
export function registerCurrentDeviceSession(profile: UserProfile): UserProfile {
  const currentSessionId = getCurrentSessionId();
  const { deviceType, browser, os, locationHint } = detectDeviceDetails();
  const now = new Date().toISOString();

  const existingSession = (profile.deviceSessions || []).find(s => s && s.sessionId === currentSessionId);

  const updatedSession: DeviceSession = {
    sessionId: currentSessionId,
    userId: profile.id,
    userName: profile.name,
    userEmail: profile.email,
    deviceType,
    browser,
    os,
    locationHint,
    loginTimestamp: existingSession ? existingSession.loginTimestamp : now,
    lastActiveTimestamp: now,
    isCurrentDevice: true,
    status: 'active'
  };

  // Keep other sessions deduplicated and filter out currentSessionId
  const seenSessionIds = new Set<string>();
  const otherSessions: DeviceSession[] = [];
  for (const s of (profile.deviceSessions || [])) {
    if (s && s.sessionId && s.sessionId !== currentSessionId && !seenSessionIds.has(s.sessionId)) {
      seenSessionIds.add(s.sessionId);
      otherSessions.push({ ...s, isCurrentDevice: false });
    }
  }

  // Prepend current session and keep up to 10 most recent
  const newSessions = [updatedSession, ...otherSessions].slice(0, 10);

  // Ensure Himanshu is always Super Admin approved
  const isSuperAdmin = profile.email === SUPER_ADMIN_EMAIL || profile.name.toLowerCase().includes('himanshu') || profile.role === 'teacher_admin';
  const approvalStatus: UserStatus = isSuperAdmin 
    ? 'approved' 
    : (profile.approvalStatus || 'pending_approval');

  const updatedProfile: UserProfile = {
    ...profile,
    approvalStatus,
    deviceSessions: newSessions
  };

  saveProfile(updatedProfile);
  syncProfileToCloud(updatedProfile).catch(err => console.warn('[Security] Sync profile error:', err));
  return updatedProfile;
}

/**
 * Admin action: Approve student access
 */
export function approveStudent(studentId: string, adminName: string = 'Himanshu Chawla'): UserProfile[] {
  const profiles = getSavedProfiles();
  const target = profiles.find(p => p.id === studentId);
  if (!target) return profiles;

  const updated: UserProfile = {
    ...target,
    approvalStatus: 'approved',
    approvedBy: adminName,
    approvedAt: new Date().toISOString(),
    isKillSwitched: false
  };

  const updatedList = saveProfile(updated);
  syncProfileToCloud(updated).catch(err => console.warn('[Security] Cloud sync error:', err));
  return updatedList;
}

/**
 * Admin action: Reject student access
 */
export function rejectStudent(studentId: string): UserProfile[] {
  const profiles = getSavedProfiles();
  const target = profiles.find(p => p.id === studentId);
  if (!target) return profiles;

  const updated: UserProfile = {
    ...target,
    approvalStatus: 'rejected',
    isKillSwitched: true,
    killSwitchReason: 'Access request rejected by institutional administrator.'
  };

  const updatedList = saveProfile(updated);
  syncProfileToCloud(updated).catch(err => console.warn('[Security] Cloud sync error:', err));
  return updatedList;
}

/**
 * Admin action: Instant Kill-Switch toggle (Block / Revoke immediately)
 */
export function toggleStudentKillSwitch(studentId: string, reason?: string): UserProfile[] {
  const profiles = getSavedProfiles();
  const target = profiles.find(p => p.id === studentId);
  if (!target) return profiles;

  const newKillState = !target.isKillSwitched;
  const updated: UserProfile = {
    ...target,
    isKillSwitched: newKillState,
    approvalStatus: newKillState ? 'blocked' : 'approved',
    killSwitchReason: newKillState 
      ? (reason || 'Emergency Kill-Switch triggered by Super Administrator.') 
      : undefined
  };

  const updatedList = saveProfile(updated);
  syncProfileToCloud(updated).catch(err => console.warn('[Security] Cloud sync error:', err));
  return updatedList;
}

/**
 * Admin action: Terminate a specific device session
 */
export function terminateDeviceSession(userId: string, sessionId: string): UserProfile[] {
  const profiles = getSavedProfiles();
  const target = profiles.find(p => p.id === userId);
  if (!target || !target.deviceSessions) return profiles;

  const updatedSessions = target.deviceSessions.map(s => {
    if (s.sessionId === sessionId) {
      return { ...s, status: 'terminated' as const };
    }
    return s;
  });

  const updated: UserProfile = {
    ...target,
    deviceSessions: updatedSessions
  };

  const updatedList = saveProfile(updated);
  syncProfileToCloud(updated).catch(err => console.warn('[Security] Cloud sync error:', err));
  return updatedList;
}

/**
 * Admin action: Terminate all other sessions for a user
 */
export function terminateAllOtherSessions(userId: string, currentSessionId: string): UserProfile[] {
  const profiles = getSavedProfiles();
  const target = profiles.find(p => p.id === userId);
  if (!target || !target.deviceSessions) return profiles;

  const updatedSessions = target.deviceSessions.map(s => {
    if (s.sessionId !== currentSessionId) {
      return { ...s, status: 'terminated' as const };
    }
    return s;
  });

  const updated: UserProfile = {
    ...target,
    deviceSessions: updatedSessions
  };

  const updatedList = saveProfile(updated);
  syncProfileToCloud(updated).catch(err => console.warn('[Security] Cloud sync error:', err));
  return updatedList;
}
