/**
 * Guest System & Referral & Notification Engine
 * 
 * Rules:
 * 1. Guest Limits:
 *    - 2 Tests per day
 *    - 2 Walk & Revise sessions per day
 *    - 2 Paper Evaluations per day
 * 2. 1 Phone = 1 Guest ID (Persistent Device UUID)
 * 3. 1 Referral Code applied per Guest ID (No self-referral)
 * 4. Successful referral award: +5 Tests & +10 Evaluations permanent balance
 * 5. Notification allow bonus: +1 Test bonus (locked for 24 hours)
 * 6. Registered / Approved Users: 100% UNLIMITED (Bypass all limits)
 */

import { syncGuestToCloud } from './cloudSync';

export interface GuestUsageRecord {
  guestId: string;
  guestName: string;
  deviceFingerprint: string;
  referralCode: string;
  referredByCode?: string;
  hasUsedReferral?: boolean;
  
  // Date-tracked daily usage: 'YYYY-MM-DD'
  lastDate: string;
  dailyTestsCreated: number;
  dailyWalkSessions: number;
  dailyEvaluations: number;

  // Bonus wallets (earned via referrals / notifications)
  bonusTests: number;
  bonusEvaluations: number;
  
  // Notification allowance tracking
  hasAllowedNotifications?: boolean;
  notificationBonusGrantedDate?: string; // YYYY-MM-DD

  createdAt: string;
  lastActiveAt: string;
}

const GUEST_STORAGE_KEY = 'studymentor_guest_record_v1';
const DEVICE_UUID_KEY = 'studymentor_device_uuid_v1';

// Limits defined as requested by User
export const GUEST_DAILY_LIMITS = {
  TESTS: 2,
  WALK_SESSIONS: 2,
  EVALUATIONS: 2
} as const;

/**
 * Generate or retrieve permanent unique device fingerprint
 */
export function getOrCreateDeviceFingerprint(): string {
  try {
    let uuid = localStorage.getItem(DEVICE_UUID_KEY);
    if (!uuid) {
      uuid = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(DEVICE_UUID_KEY, uuid);
    }
    return uuid;
  } catch (e) {
    return 'dev_fallback_' + Date.now();
  }
}

/**
 * Generate 6-character clean referral code for a guest
 */
function generateReferralCode(name: string): string {
  const cleanName = (name.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'STUDY').toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}${randomNum}`;
}

/**
 * Get current system date in YYYY-MM-DD
 */
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Get active guest record from localStorage
 */
export function getActiveGuestRecord(): GuestUsageRecord | null {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return null;
    const record: GuestUsageRecord = JSON.parse(raw);
    
    // Auto reset daily counters if new day
    const today = getTodayString();
    if (record.lastDate !== today) {
      record.lastDate = today;
      record.dailyTestsCreated = 0;
      record.dailyWalkSessions = 0;
      record.dailyEvaluations = 0;
      saveGuestRecord(record);
    }
    return record;
  } catch (err) {
    console.error('Error reading guest record:', err);
    return null;
  }
}

/**
 * Save guest record to localStorage
 */
export function saveGuestRecord(record: GuestUsageRecord): void {
  try {
    record.lastActiveAt = new Date().toISOString();
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(record));
    
    // Also save in all-guests index for Admin Panel lookup
    indexGuestForAdmin(record);

    // Synchronize to Firestore & Server API so Admin Himanshu can see it from any device
    syncGuestToCloud(record).catch(err => console.warn('[GuestManager] Cloud guest sync notice:', err));
  } catch (err) {
    console.error('Error saving guest record:', err);
  }
}

/**
 * Initialize a new Guest Session
 * Enforces: 1 Device = 1 Guest ID
 */
export function initializeGuestUser(name: string): GuestUsageRecord {
  const deviceFp = getOrCreateDeviceFingerprint();
  const existing = getActiveGuestRecord();
  
  if (existing) {
    // If name is updated, refresh it while preserving ID & limits
    existing.guestName = name.trim() || existing.guestName;
    saveGuestRecord(existing);
    return existing;
  }

  const today = getTodayString();
  const newGuest: GuestUsageRecord = {
    guestId: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    guestName: name.trim() || 'Guest Student',
    deviceFingerprint: deviceFp,
    referralCode: generateReferralCode(name),
    lastDate: today,
    dailyTestsCreated: 0,
    dailyWalkSessions: 0,
    dailyEvaluations: 0,
    bonusTests: 0,
    bonusEvaluations: 0,
    hasUsedReferral: false,
    hasAllowedNotifications: false,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };

  saveGuestRecord(newGuest);
  return newGuest;
}

/**
 * Check if current user is a guest
 */
export function isUserGuest(profile?: { isGuest?: boolean; role?: string } | null): boolean {
  if (!profile) return false;
  return Boolean(profile.isGuest);
}

/**
 * Check if guest has remaining quota for an action
 */
export function checkGuestQuota(action: 'test' | 'walk' | 'evaluate'): {
  canProceed: boolean;
  remainingDaily: number;
  bonusAvailable: number;
  message?: string;
} {
  const guest = getActiveGuestRecord();
  if (!guest) {
    return { canProceed: true, remainingDaily: 999, bonusAvailable: 999 };
  }

  const today = getTodayString();
  if (guest.lastDate !== today) {
    guest.lastDate = today;
    guest.dailyTestsCreated = 0;
    guest.dailyWalkSessions = 0;
    guest.dailyEvaluations = 0;
    saveGuestRecord(guest);
  }

  if (action === 'test') {
    const remainingDaily = Math.max(0, GUEST_DAILY_LIMITS.TESTS - guest.dailyTestsCreated);
    const bonusAvailable = guest.bonusTests || 0;
    const canProceed = remainingDaily > 0 || bonusAvailable > 0;
    return {
      canProceed,
      remainingDaily,
      bonusAvailable,
      message: canProceed 
        ? undefined 
        : `Daily limit of ${GUEST_DAILY_LIMITS.TESTS} tests reached for Guest Mode. Register for unlimited access or invite friends for bonus tests!`
    };
  }

  if (action === 'walk') {
    const remainingDaily = Math.max(0, GUEST_DAILY_LIMITS.WALK_SESSIONS - guest.dailyWalkSessions);
    const bonusAvailable = 0; // Walk sessions reset daily
    const canProceed = remainingDaily > 0;
    return {
      canProceed,
      remainingDaily,
      bonusAvailable,
      message: canProceed 
        ? undefined 
        : `Daily limit of ${GUEST_DAILY_LIMITS.WALK_SESSIONS} Walk & Revise sessions reached. Register to enjoy unlimited practice!`
    };
  }

  if (action === 'evaluate') {
    const remainingDaily = Math.max(0, GUEST_DAILY_LIMITS.EVALUATIONS - guest.dailyEvaluations);
    const bonusAvailable = guest.bonusEvaluations || 0;
    const canProceed = remainingDaily > 0 || bonusAvailable > 0;
    return {
      canProceed,
      remainingDaily,
      bonusAvailable,
      message: canProceed 
        ? undefined 
        : `Daily limit of ${GUEST_DAILY_LIMITS.EVALUATIONS} paper evaluations reached for today. Register free to check unlimited copies!`
    };
  }

  return { canProceed: true, remainingDaily: 999, bonusAvailable: 999 };
}

/**
 * Consume 1 quota unit for guest. Uses daily quota first, then bonus balance.
 */
export function consumeGuestQuota(action: 'test' | 'walk' | 'evaluate'): boolean {
  const guest = getActiveGuestRecord();
  if (!guest) return true;

  const quota = checkGuestQuota(action);
  if (!quota.canProceed) return false;

  if (action === 'test') {
    if (guest.dailyTestsCreated < GUEST_DAILY_LIMITS.TESTS) {
      guest.dailyTestsCreated += 1;
    } else if (guest.bonusTests > 0) {
      guest.bonusTests -= 1;
    }
  } else if (action === 'walk') {
    guest.dailyWalkSessions += 1;
  } else if (action === 'evaluate') {
    if (guest.dailyEvaluations < GUEST_DAILY_LIMITS.EVALUATIONS) {
      guest.dailyEvaluations += 1;
    } else if (guest.bonusEvaluations > 0) {
      guest.bonusEvaluations -= 1;
    }
  }

  saveGuestRecord(guest);
  return true;
}

/**
 * Apply a referral code.
 * Enforces:
 * 1. Cannot apply own code
 * 2. Only 1 referral code can be applied per guest
 * 3. Cannot apply if on same device
 * 4. Awards +5 Tests & +10 Evaluations
 */
export function applyReferralCode(codeToApply: string): { success: boolean; message: string } {
  const guest = getActiveGuestRecord();
  if (!guest) {
    return { success: false, message: 'Guest session not active.' };
  }

  const cleanCode = codeToApply.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: 'Please enter a valid referral code.' };
  }

  if (cleanCode === guest.referralCode.toUpperCase()) {
    return { success: false, message: 'Self-referral is not permitted. Share your code with a classmate!' };
  }

  if (guest.hasUsedReferral) {
    return { success: false, message: 'You have already redeemed a referral code on this device.' };
  }

  // Find referrer in all-guests index
  const allGuests = getAllGuestsForAdmin();
  const referrer = allGuests.find(g => g.referralCode.toUpperCase() === cleanCode);

  if (referrer && referrer.deviceFingerprint === guest.deviceFingerprint) {
    return { success: false, message: 'Referral code from the same device cannot be redeemed.' };
  }

  // Grant bonuses to current user
  guest.bonusTests = (guest.bonusTests || 0) + 5;
  guest.bonusEvaluations = (guest.bonusEvaluations || 0) + 10;
  guest.hasUsedReferral = true;
  guest.referredByCode = cleanCode;
  saveGuestRecord(guest);

  // If referrer exists in local index, award them bonus too!
  if (referrer) {
    referrer.bonusTests = (referrer.bonusTests || 0) + 5;
    referrer.bonusEvaluations = (referrer.bonusEvaluations || 0) + 10;
    saveGuestRecord(referrer);
  }

  return { 
    success: true, 
    message: '🎉 Referral code applied successfully! +5 Test Creations and +10 Paper Evaluations added to your balance.' 
  };
}

/**
 * Allow notification bonus (+1 Test bonus, locked for 24h)
 */
export function grantNotificationBonus(): { success: boolean; message: string } {
  const guest = getActiveGuestRecord();
  if (!guest) return { success: false, message: 'No guest profile.' };

  const today = getTodayString();
  if (guest.notificationBonusGrantedDate === today) {
    return { success: false, message: 'Notification bonus already claimed for today!' };
  }

  guest.hasAllowedNotifications = true;
  guest.notificationBonusGrantedDate = today;
  guest.bonusTests = (guest.bonusTests || 0) + 1;
  saveGuestRecord(guest);

  return {
    success: true,
    message: '🔔 Notifications enabled! +1 Bonus Test Creation added for 24 hours.'
  };
}

// ---------------- Admin Lookup Storage ----------------
const ALL_GUESTS_INDEX_KEY = 'studymentor_all_guests_registry_v1';

export function getAllGuestsForAdmin(): GuestUsageRecord[] {
  try {
    const raw = localStorage.getItem(ALL_GUESTS_INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function mergeGuestsForAdmin(remoteGuests: GuestUsageRecord[]): GuestUsageRecord[] {
  try {
    const local = getAllGuestsForAdmin();
    const map = new Map<string, GuestUsageRecord>();
    for (const g of local) {
      if (g && g.guestId) map.set(g.guestId, g);
    }
    for (const rg of remoteGuests) {
      if (rg && rg.guestId) {
        const existing = map.get(rg.guestId);
        if (!existing || new Date(rg.lastActiveAt || 0).getTime() >= new Date(existing.lastActiveAt || 0).getTime()) {
          map.set(rg.guestId, rg);
        }
      }
    }
    const merged = Array.from(map.values()).sort((a, b) => 
      new Date(b.lastActiveAt || b.createdAt).getTime() - new Date(a.lastActiveAt || a.createdAt).getTime()
    );
    localStorage.setItem(ALL_GUESTS_INDEX_KEY, JSON.stringify(merged));
    return merged;
  } catch (e) {
    return remoteGuests;
  }
}

function indexGuestForAdmin(guest: GuestUsageRecord): void {
  try {
    const list = getAllGuestsForAdmin();
    const idx = list.findIndex(g => g.guestId === guest.guestId || g.deviceFingerprint === guest.deviceFingerprint);
    if (idx >= 0) {
      list[idx] = guest;
    } else {
      list.unshift(guest);
    }
    localStorage.setItem(ALL_GUESTS_INDEX_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}
