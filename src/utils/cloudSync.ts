import { db, isFirebaseConfigured, doc, setDoc, getDoc, getDocs, collection, deleteDoc, query, where, onSnapshot } from '../services/firebase';
import { EvaluationResult, MistakeRecord, GeneratedTest, UserProfile, SupportTicket, UserStatus, AcademicJourney } from '../types';

/**
 * Multi-User Cloud Synchronization Engine (Firebase Firestore & Full-Stack Redundant Server)
 * Enables 50+ concurrent students to save, retrieve, and backup their evaluations,
 * mistake diary, generated tests, and profiles with zero cross-user leakage.
 * Guarantees that new student registrations and waiting room requests immediately
 * reach Super Administrator Himanshu Chawla (himanshuch492@gmail.com) in real-time.
 */

const COLLECTIONS = {
  USERS: 'users',
  GUESTS: 'guests',
  EVALUATIONS: 'evaluations',
  MISTAKES: 'mistakes',
  TESTS: 'tests',
  TICKETS: 'support_tickets'
};

const SUPER_ADMIN_EMAIL = 'himanshuch492@gmail.com';

// ----------------- Profile Cloud Sync (Dual Firestore + Server Redundancy) -----------------

/**
 * Synchronize a student profile to both Firestore and the backend Server API.
 * Ensures that even if one channel has network delay, the registration request
 * is immediately recorded and visible to Admin Himanshu.
 */
export async function syncProfileToCloud(profile: UserProfile): Promise<boolean> {
  if (!profile.id) return false;
  let firestoreSuccess = false;

  // 1. Firestore Cloud Sync
  if (isFirebaseConfigured) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, profile.id);
      await setDoc(userRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      firestoreSuccess = true;
    } catch (err) {
      console.warn('[CloudSync] Firestore profile sync notice:', err);
    }
  }

  // 2. Redundant Server API Sync (guarantees cross-device visibility to Admin)
  try {
    const res = await fetch('/api/register-student-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      return true;
    }
  } catch (serverErr) {
    console.warn('[CloudSync] Server registration sync notice:', serverErr);
  }

  return firestoreSuccess;
}

/**
 * Fetch a single profile from Firestore with fallback to Server API
 */
export async function fetchProfileFromCloud(profileId: string, email?: string): Promise<UserProfile | null> {
  if (!profileId && !email) return null;

  // 1. Try Firestore
  if (isFirebaseConfigured && profileId) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, profileId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('[CloudSync] Firestore single profile fetch notice:', err);
    }
  } else if (isFirebaseConfigured && email) {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email.trim().toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as UserProfile;
      }
    } catch (err) {
      console.warn('[CloudSync] Firestore email profile fetch notice:', err);
    }
  }

  // 2. Try Server API Fallback
  try {
    const queryParams = new URLSearchParams();
    if (profileId) queryParams.set('studentId', profileId);
    if (email) queryParams.set('email', email);

    const res = await fetch(`/api/check-approval-status?${queryParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.student) {
        return data.student as UserProfile;
      }
    }
  } catch (serverErr) {
    console.warn('[CloudSync] Server profile fetch notice:', serverErr);
  }

  return null;
}

// Request coalescing cache to eliminate redundant parallel server & Firestore round-trips
let inFlightProfilesPromise: Promise<UserProfile[]> | null = null;
let lastProfilesFetchedAt = 0;
let cachedProfiles: UserProfile[] = [];

/**
 * Fetch all registered student profiles across all devices for Super Admin Himanshu.
 * Queries both Firestore and the Server API and merges them seamlessly.
 * Includes in-flight request coalescing and 1.5s cache to prevent server bombardment.
 */
export async function fetchAllProfilesFromCloud(force = false): Promise<UserProfile[]> {
  const now = Date.now();
  if (!force && inFlightProfilesPromise) {
    return inFlightProfilesPromise;
  }
  if (!force && cachedProfiles.length > 0 && (now - lastProfilesFetchedAt < 1500)) {
    return cachedProfiles;
  }

  inFlightProfilesPromise = (async () => {
    const profileMap = new Map<string, UserProfile>();

    // 1. Fetch from Firestore
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
        querySnapshot.forEach((docSnap) => {
          const p = docSnap.data() as UserProfile;
          if (p && p.id) {
            profileMap.set(p.id, p);
          }
        });
      } catch (err) {
        console.warn('[CloudSync] Error fetching all profiles from Firestore:', err);
      }
    }

    // 2. Fetch from Server API
    try {
      const res = await fetch('/api/student-requests');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.students)) {
          for (const s of data.students as UserProfile[]) {
            if (s && s.id) {
              const existing = profileMap.get(s.id);
              if (!existing) {
                profileMap.set(s.id, s);
              } else {
                // Merge, prioritizing latest update
                const existingTime = new Date((existing as any).updatedAt || (existing as any).createdAt || 0).getTime();
                const serverTime = new Date((s as any).updatedAt || (s as any).createdAt || 0).getTime();
                if (serverTime >= existingTime) {
                  profileMap.set(s.id, { ...existing, ...s });
                }
              }
            }
          }
        }
      }
    } catch (serverErr) {
      console.warn('[CloudSync] Error fetching profiles from Server API:', serverErr);
    }

    const result = Array.from(profileMap.values());
    cachedProfiles = result;
    lastProfilesFetchedAt = Date.now();
    return result;
  })().finally(() => {
    inFlightProfilesPromise = null;
  });

  return inFlightProfilesPromise;
}

/**
 * Real-time listener for Super Admin Himanshu Chawla.
 * Automatically notifies when any new student on any device registers or enters Waiting Room.
 * Uses smart visibility throttling to pause background polling when window/tab is hidden.
 */
export function subscribeToAllProfiles(onUpdate: (profiles: UserProfile[]) => void): () => void {
  let isCleanedUp = false;
  let firestoreUnsub: (() => void) | null = null;

  // 1. Real-time Firestore onSnapshot listener
  if (isFirebaseConfigured) {
    try {
      firestoreUnsub = onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
        if (isCleanedUp) return;
        const profiles: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          const p = docSnap.data() as UserProfile;
          if (p && p.id) {
            profiles.push(p);
          }
        });
        if (profiles.length > 0) {
          onUpdate(profiles);
        }
      }, (err) => {
        console.warn('[CloudSync] Firestore real-time profile subscription notice:', err);
      });
    } catch (err) {
      console.warn('[CloudSync] Error initializing Firestore onSnapshot:', err);
    }
  }

  // 2. Periodic Server Polling Fallback (12s if Firestore active, 6s if offline/no Firestore)
  const pollIntervalMs = isFirebaseConfigured ? 12000 : 6000;
  const pollInterval = setInterval(async () => {
    if (isCleanedUp) return;
    // Do not poll server if tab/window is hidden in the background
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;

    try {
      const serverProfiles = await fetchAllProfilesFromCloud(true);
      if (serverProfiles.length > 0 && !isCleanedUp) {
        onUpdate(serverProfiles);
      }
    } catch (e) {
      // transient network poll notice
    }
  }, pollIntervalMs);

  // Initial trigger
  fetchAllProfilesFromCloud().then((initial) => {
    if (!isCleanedUp && initial.length > 0) {
      onUpdate(initial);
    }
  }).catch(() => {});

  return () => {
    isCleanedUp = true;
    if (firestoreUnsub) {
      try {
        firestoreUnsub();
      } catch (e) {}
    }
    clearInterval(pollInterval);
  };
}

/**
 * Admin action to approve, reject, or kill-switch a student across cloud and server.
 */
export async function updateStudentApprovalCloud(
  studentId: string, 
  status: UserStatus, 
  approvedBy: string = 'Himanshu Chawla',
  reason?: string,
  extraProfileData?: Partial<UserProfile>
): Promise<boolean> {
  let firestoreOk = false;
  const now = new Date().toISOString();

  // 1. Update in Firestore
  if (isFirebaseConfigured && studentId) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, studentId);
      const updateData: any = {
        approvalStatus: status,
        approvedBy: status === 'approved' ? approvedBy : undefined,
        approvedAt: status === 'approved' ? now : undefined,
        isKillSwitched: status === 'blocked' || status === 'rejected',
        killSwitchReason: (status === 'blocked' || status === 'rejected') ? reason : undefined,
        updatedAt: now
      };
      if (extraProfileData) {
        if (extraProfileData.name) updateData.name = extraProfileData.name;
        if (extraProfileData.email) updateData.email = extraProfileData.email;
        if (extraProfileData.targetJourney) updateData.targetJourney = extraProfileData.targetJourney;
        if (extraProfileData.rollNumber) updateData.rollNumber = extraProfileData.rollNumber;
      }
      await setDoc(userRef, updateData, { merge: true });
      firestoreOk = true;
    } catch (err) {
      console.warn('[CloudSync] Firestore update approval error:', err);
    }
  }

  // 2. Update on Server API
  try {
    const res = await fetch('/api/update-student-approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        status,
        approvedBy,
        killSwitchReason: reason,
        email: extraProfileData?.email,
        name: extraProfileData?.name,
        targetJourney: extraProfileData?.targetJourney
      })
    });
    if (res.ok) {
      return true;
    }
  } catch (serverErr) {
    console.warn('[CloudSync] Server update approval notice:', serverErr);
  }

  return firestoreOk;
}

/**
 * Pre-approve a student by email before they even register or open the app.
 */
export async function preApproveStudentCloud(
  name: string,
  email: string,
  targetJourney: AcademicJourney = 'CLASS_12',
  institution?: string,
  rollNumber?: string,
  approvedBy: string = 'Himanshu Chawla'
): Promise<UserProfile | null> {
  const cleanEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();
  const studentId = `usr_pre_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const profile: UserProfile = {
    id: studentId,
    name: name.trim() || cleanEmail.split('@')[0],
    email: cleanEmail,
    role: 'student',
    targetJourney,
    institution: institution?.trim() || undefined,
    rollNumber: rollNumber?.trim() || undefined,
    approvalStatus: 'approved',
    approvedBy,
    approvedAt: now,
    isKillSwitched: false,
    createdAt: now
  };

  // 1. Save in Firestore
  if (isFirebaseConfigured) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, studentId);
      await setDoc(userRef, profile, { merge: true });
    } catch (err) {
      console.warn('[CloudSync] Error saving pre-approved profile to Firestore:', err);
    }
  }

  // 2. Save on Server API
  try {
    const res = await fetch('/api/pre-approve-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: cleanEmail,
        targetJourney,
        institution,
        rollNumber,
        approvedBy
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.student) {
        return data.student as UserProfile;
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Error saving pre-approved profile to Server API:', err);
  }

  return profile;
}

/**
 * Real-time listener for student in Waiting Room.
 * Detects the exact instant Admin Himanshu approves their profile and passes the approved profile.
 */
export function subscribeToStudentApproval(
  studentId: string,
  studentEmail: string,
  onStatusChange: (profile: UserProfile) => void
): () => void {
  let isCleanedUp = false;
  let firestoreUnsub: (() => void) | null = null;

  // 1. Firestore single doc listener
  if (isFirebaseConfigured && studentId) {
    try {
      firestoreUnsub = onSnapshot(doc(db, COLLECTIONS.USERS, studentId), (docSnap) => {
        if (isCleanedUp || !docSnap.exists()) return;
        const prof = docSnap.data() as UserProfile;
        if (prof) {
          onStatusChange(prof);
        }
      }, (err) => {
        console.warn('[CloudSync] Waiting room Firestore doc notice:', err);
      });
    } catch (e) {}
  }

  // 2. Rapid Server Polling (every 3 seconds for fast entrance)
  const pollInterval = setInterval(async () => {
    if (isCleanedUp) return;
    try {
      const cloudProf = await fetchProfileFromCloud(studentId, studentEmail);
      if (cloudProf && !isCleanedUp) {
        onStatusChange(cloudProf);
      }
    } catch (e) {}
  }, 3000);

  // Initial check
  fetchProfileFromCloud(studentId, studentEmail).then((initial) => {
    if (!isCleanedUp && initial) {
      onStatusChange(initial);
    }
  }).catch(() => {});

  return () => {
    isCleanedUp = true;
    if (firestoreUnsub) {
      try {
        firestoreUnsub();
      } catch (e) {}
    }
    clearInterval(pollInterval);
  };
}

// ----------------- Evaluations Multi-User Cloud Sync -----------------
export async function syncEvaluationToCloud(evalResult: EvaluationResult, userId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !evalResult.id) return false;
  try {
    const evalRef = doc(db, COLLECTIONS.EVALUATIONS, evalResult.id);
    await setDoc(evalRef, {
      ...evalResult,
      userId: userId || 'anonymous_student',
      savedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[CloudSync] Evaluation cloud sync notice:', err);
    return false;
  }
}

export async function fetchEvaluationsFromCloud(userId: string): Promise<EvaluationResult[]> {
  if (!isFirebaseConfigured || !userId) return [];
  try {
    const q = query(
      collection(db, COLLECTIONS.EVALUATIONS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const results: EvaluationResult[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as EvaluationResult);
    });
    return results.sort((a, b) => new Date(b.evaluated_at || 0).getTime() - new Date(a.evaluated_at || 0).getTime());
  } catch (err) {
    console.warn('[CloudSync] Failed to fetch evaluations from cloud:', err);
    return [];
  }
}

export async function deleteEvaluationFromCloud(evalId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !evalId) return false;
  try {
    const evalRef = doc(db, COLLECTIONS.EVALUATIONS, evalId);
    await deleteDoc(evalRef);
    return true;
  } catch (err) {
    console.warn('[CloudSync] Failed to delete evaluation from cloud:', err);
    return false;
  }
}

// ----------------- Mistake Diary Multi-User Cloud Sync -----------------
export async function syncMistakesToCloud(mistakes: MistakeRecord[], userId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !userId) return false;
  try {
    const batchPromises = mistakes.map(m => {
      const mistRef = doc(db, COLLECTIONS.MISTAKES, m.id);
      return setDoc(mistRef, {
        ...m,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
    await Promise.all(batchPromises);
    return true;
  } catch (err) {
    console.warn('[CloudSync] Mistakes cloud sync notice:', err);
    return false;
  }
}

export async function fetchMistakesFromCloud(userId: string): Promise<MistakeRecord[]> {
  if (!isFirebaseConfigured || !userId) return [];
  try {
    const q = query(
      collection(db, COLLECTIONS.MISTAKES),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const results: MistakeRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as MistakeRecord);
    });
    return results.sort((a, b) => new Date(b.last_occurred || 0).getTime() - new Date(a.last_occurred || 0).getTime());
  } catch (err) {
    console.warn('[CloudSync] Failed to fetch mistakes from cloud:', err);
    return [];
  }
}

// ----------------- Generated Tests Cloud Sync -----------------
export async function syncTestToCloud(test: GeneratedTest, userId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !test.test_id) return false;
  try {
    const testRef = doc(db, COLLECTIONS.TESTS, test.test_id);
    await setDoc(testRef, {
      ...test,
      userId: userId || 'anonymous_student',
      savedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[CloudSync] Test cloud sync notice:', err);
    return false;
  }
}

export async function fetchTestsFromCloud(userId: string): Promise<GeneratedTest[]> {
  if (!isFirebaseConfigured || !userId) return [];
  try {
    const q = query(
      collection(db, COLLECTIONS.TESTS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const results: GeneratedTest[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as GeneratedTest);
    });
    return results.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  } catch (err) {
    console.warn('[CloudSync] Failed to fetch tests from cloud:', err);
    return [];
  }
}

// ----------------- Private Support Tickets Multi-User Cloud Sync -----------------
export async function syncSupportTicketToCloud(ticket: SupportTicket): Promise<boolean> {
  if (!isFirebaseConfigured || !ticket.id) return false;
  try {
    const ticketRef = doc(db, COLLECTIONS.TICKETS, ticket.id);
    await setDoc(ticketRef, {
      ...ticket,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[CloudSync] Ticket cloud sync notice:', err);
    return false;
  }
}

export async function fetchSupportTicketsFromCloud(studentId?: string, isAdmin?: boolean): Promise<SupportTicket[]> {
  if (!isFirebaseConfigured) return [];
  try {
    let q;
    if (isAdmin) {
      // Super Admin (Himanshu) fetches all support tickets
      q = collection(db, COLLECTIONS.TICKETS);
    } else if (studentId) {
      // Regular student fetches ONLY their own tickets (Zero cross-leakage)
      q = query(
        collection(db, COLLECTIONS.TICKETS),
        where('studentId', '==', studentId)
      );
    } else {
      return [];
    }

    const querySnapshot = await getDocs(q);
    const results: SupportTicket[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as SupportTicket);
    });
    return results.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  } catch (err) {
    console.warn('[CloudSync] Failed to fetch support tickets from cloud:', err);
    return [];
  }
}

export async function deleteSupportTicketFromCloud(ticketId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !ticketId) return false;
  try {
    const ticketRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    await deleteDoc(ticketRef);
    return true;
  } catch (err) {
    console.warn('[CloudSync] Failed to delete ticket from cloud:', err);
    return false;
  }
}

// ----------------- Guest Tracking & Cross-Device Cloud Sync -----------------

export interface CloudGuestRecord {
  guestId: string;
  guestName: string;
  deviceFingerprint: string;
  referralCode: string;
  referredByCode?: string;
  hasUsedReferral?: boolean;
  lastDate: string;
  dailyTestsCreated: number;
  dailyWalkSessions: number;
  dailyEvaluations: number;
  bonusTests: number;
  bonusEvaluations: number;
  hasAllowedNotifications?: boolean;
  notificationBonusGrantedDate?: string;
  createdAt: string;
  lastActiveAt: string;
}

/**
 * Sync guest usage record to Firestore & Server API so Admin Himanshu can see it from any device
 */
export async function syncGuestToCloud(guest: CloudGuestRecord): Promise<boolean> {
  if (!guest || !guest.guestId) return false;
  let firestoreSuccess = false;

  // 1. Dual Firestore sync
  if (isFirebaseConfigured) {
    try {
      const guestRef = doc(db, COLLECTIONS.GUESTS, guest.guestId);
      await setDoc(guestRef, {
        ...guest,
        lastActiveAt: new Date().toISOString()
      }, { merge: true });
      firestoreSuccess = true;
    } catch (err) {
      console.warn('[CloudSync] Firestore guest sync notice:', err);
    }
  }

  // 2. Full-stack Server redundancy sync (always works across all network setups)
  try {
    const res = await fetch('/api/guest/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guest)
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('[CloudSync] Server guest sync notice:', err);
  }

  return firestoreSuccess;
}

// Request coalescing cache for guests
let inFlightGuestsPromise: Promise<CloudGuestRecord[]> | null = null;
let lastGuestsFetchedAt = 0;
let cachedGuests: CloudGuestRecord[] = [];

/**
 * Fetch all registered guests across all devices for the Super Admin panel.
 * Uses in-flight deduplication and 1.5s cache to minimize redundant requests.
 */
export async function fetchAllGuestsFromCloud(force = false): Promise<CloudGuestRecord[]> {
  const now = Date.now();
  if (!force && inFlightGuestsPromise) {
    return inFlightGuestsPromise;
  }
  if (!force && cachedGuests.length > 0 && (now - lastGuestsFetchedAt < 1500)) {
    return cachedGuests;
  }

  inFlightGuestsPromise = (async () => {
    const map = new Map<string, CloudGuestRecord>();

    // 1. Try Server API
    try {
      const res = await fetch('/api/guest/all');
      if (res.ok) {
        const data = await res.json();
        if (data.guests && Array.isArray(data.guests)) {
          for (const g of data.guests) {
            if (g && g.guestId) {
              map.set(g.guestId, g);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[CloudSync] Server fetch guests notice:', err);
    }

    // 2. Try Firestore
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.GUESTS));
        querySnapshot.forEach((docSnap) => {
          const g = docSnap.data() as CloudGuestRecord;
          if (g && g.guestId) {
            const existing = map.get(g.guestId);
            if (!existing || new Date(g.lastActiveAt || 0).getTime() > new Date(existing.lastActiveAt || 0).getTime()) {
              map.set(g.guestId, g);
            }
          }
        });
      } catch (err) {
        console.warn('[CloudSync] Firestore fetch guests notice:', err);
      }
    }

    const result = Array.from(map.values()).sort((a, b) => 
      new Date(b.lastActiveAt || b.createdAt).getTime() - new Date(a.lastActiveAt || a.createdAt).getTime()
    );
    cachedGuests = result;
    lastGuestsFetchedAt = Date.now();
    return result;
  })().finally(() => {
    inFlightGuestsPromise = null;
  });

  return inFlightGuestsPromise;
}

/**
 * Real-time subscription for guests: instantly updates the admin dashboard when any student uses guest entry.
 * Uses smart visibility throttling to avoid hammering server when tab is minimized.
 */
export function subscribeToAllGuests(callback: (guests: CloudGuestRecord[]) => void): () => void {
  let isUnsubscribed = false;

  // 1. Firestore live realtime listener
  let unsubscribeFirestore = () => {};
  if (isFirebaseConfigured) {
    try {
      unsubscribeFirestore = onSnapshot(collection(db, COLLECTIONS.GUESTS), (snapshot) => {
        if (isUnsubscribed) return;
        const guests: CloudGuestRecord[] = [];
        snapshot.forEach((docSnap) => {
          guests.push(docSnap.data() as CloudGuestRecord);
        });
        if (guests.length > 0) {
          callback(guests.sort((a, b) => 
            new Date(b.lastActiveAt || b.createdAt).getTime() - new Date(a.lastActiveAt || a.createdAt).getTime()
          ));
        }
      }, (err) => {
        console.warn('[CloudSync] Guests live snapshot error:', err);
      });
    } catch (e) {
      console.warn('[CloudSync] Guests onSnapshot setup error:', e);
    }
  }

  // 2. Polling interval for server API as fallback (12s if Firestore active, 6s if offline)
  const pollIntervalMs = isFirebaseConfigured ? 12000 : 6000;
  const interval = setInterval(async () => {
    if (isUnsubscribed) return;
    // Skip polling if window/tab is hidden
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;

    try {
      const res = await fetch('/api/guest/all');
      if (res.ok) {
        const data = await res.json();
        if (data.guests && Array.isArray(data.guests)) {
          callback(data.guests);
        }
      }
    } catch (e) {
      // ignore
    }
  }, pollIntervalMs);

  return () => {
    isUnsubscribed = true;
    unsubscribeFirestore();
    clearInterval(interval);
  };
}

/**
 * Admin action to grant bonus quotas or reset daily limits for a guest
 */
export async function adminUpdateGuestLimitsCloud(
  guestId: string, 
  bonusTestsDelta?: number, 
  bonusEvaluationsDelta?: number, 
  resetDaily?: boolean
): Promise<boolean> {
  let success = false;
  try {
    const res = await fetch('/api/guest/update-limits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId, bonusTestsDelta, bonusEvaluationsDelta, resetDaily })
    });
    if (res.ok) {
      success = true;
    }
  } catch (err) {
    console.warn('[CloudSync] Server update guest limits notice:', err);
  }

  if (isFirebaseConfigured) {
    try {
      const guestRef = doc(db, COLLECTIONS.GUESTS, guestId);
      const snap = await getDoc(guestRef);
      if (snap.exists()) {
        const cur = snap.data() as CloudGuestRecord;
        const updates: Partial<CloudGuestRecord> = {
          lastActiveAt: new Date().toISOString()
        };
        if (bonusTestsDelta) {
          updates.bonusTests = Math.max(0, (cur.bonusTests || 0) + bonusTestsDelta);
        }
        if (bonusEvaluationsDelta) {
          updates.bonusEvaluations = Math.max(0, (cur.bonusEvaluations || 0) + bonusEvaluationsDelta);
        }
        if (resetDaily) {
          updates.dailyTestsCreated = 0;
          updates.dailyWalkSessions = 0;
          updates.dailyEvaluations = 0;
        }
        await setDoc(guestRef, updates, { merge: true });
        success = true;
      }
    } catch (err) {
      console.warn('[CloudSync] Firestore update guest limits notice:', err);
    }
  }

  return success;
}

