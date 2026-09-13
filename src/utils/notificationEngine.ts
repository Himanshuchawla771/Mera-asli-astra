/**
 * Smart Notification Engine for StudyMentor AI
 * Handles:
 * 1. Time-contextual Hinglish study reminder selection
 * 2. Frequency capping (max 2-3 notifications per day)
 * 3. Mobile System Notification Shade push (via ServiceWorkerRegistration.showNotification with vibration and badge)
 * 4. Permission requests & bonus incentives
 */

export interface SmartNotificationMessage {
  id: string;
  title: string;
  body: string;
  targetRole: 'guest' | 'registered' | 'all';
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
}

const NOTIFICATION_HISTORY_KEY = 'studymentor_sent_notifications_v1';
const NOTIFICATION_PERMISSION_KEY = 'studymentor_notif_permission_v1';
const MAX_NOTIFICATIONS_PER_DAY = 3;

// Registered students contextual notifications
const REGISTERED_STUDENT_NOTIFICATIONS: Array<Omit<SmartNotificationMessage, 'id'>> = [
  {
    title: 'Good Morning, Topper! 🌅🎯',
    body: 'Padhai ka golden time shuru! Class 12 & CA ke liye ek quick 15-min practice test solve karke momentum set karo 🚀',
    targetRole: 'registered',
    timeSlot: 'morning'
  },
  {
    title: 'Post-Lunch Brain Recharge! ⚡🧠',
    body: 'Law provisions ya Accounts formats revise karna hai? "Walk & Revise" open karo aur bina pen chalaaye audio drill karo! 🚶‍♂️',
    targetRole: 'registered',
    timeSlot: 'afternoon'
  },
  {
    title: 'Evening Progress Check 📝🔥',
    body: 'Aaj ka answer sheet snap karke upload karo! AI Mentor step-by-step marks aur teacher feedback ready rakhega.',
    targetRole: 'registered',
    timeSlot: 'evening'
  },
  {
    title: 'Calm Night Reflection 🌙📖',
    body: 'Sone se pehle apne weak concepts aur mistakes review kar lo. Kal subah ka test aapki command par hoga! ✨',
    targetRole: 'registered',
    timeSlot: 'night'
  }
];

// Guest notifications with warm encouragement and friendly registration tips
const GUEST_STUDENT_NOTIFICATIONS: Array<Omit<SmartNotificationMessage, 'id'>> = [
  {
    title: 'Suprabhat Friend! 🚀✨',
    body: 'Aapka 2 free tests aur 2 evaluations ka daily quota ready hai! Aaj bina kisi deri ke ek exam paper solve karke check karwao! 📝',
    targetRole: 'guest',
    timeSlot: 'morning'
  },
  {
    title: 'Apne Doston Ko Invite Kiya? 🎁',
    body: 'Apna referral code classmate ko share karo aur instant +5 Test aur +10 Evaluations ka permanent bonus paao! 🤝🔥',
    targetRole: 'guest',
    timeSlot: 'afternoon'
  },
  {
    title: 'Topper Grade Step Solutions! 📷💡',
    body: 'Book ya question paper ka koi bhi tough numerical snap karo, AI Tutor step-by-step toppers format mein solve karega! 🏆',
    targetRole: 'guest',
    timeSlot: 'evening'
  },
  {
    title: 'Apni Progress Hamesha Ke Liye Save Rakhein! 🌟',
    body: 'Guest quota khatam hone se pehle 10 second mein free register kar lo taaki aapke saare checked copies aur report hamesha safe rahein! 🔓',
    targetRole: 'guest',
    timeSlot: 'night'
  }
];

interface SentNotificationRecord {
  date: string; // YYYY-MM-DD
  count: number;
  lastSentAt: string;
  sentIds: string[];
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getSentNotificationRecord(): SentNotificationRecord {
  try {
    const raw = localStorage.getItem(NOTIFICATION_HISTORY_KEY);
    const today = getTodayString();
    if (raw) {
      const parsed: SentNotificationRecord = JSON.parse(raw);
      if (parsed.date === today) {
        return parsed;
      }
    }
    return {
      date: today,
      count: 0,
      lastSentAt: '',
      sentIds: []
    };
  } catch (e) {
    return { date: getTodayString(), count: 0, lastSentAt: '', sentIds: [] };
  }
}

export function recordSentNotification(notifId: string): void {
  try {
    const rec = getSentNotificationRecord();
    rec.count += 1;
    rec.lastSentAt = new Date().toISOString();
    if (!rec.sentIds.includes(notifId)) {
      rec.sentIds.push(notifId);
    }
    localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(rec));
  } catch (e) {
    console.warn('Failed to record notification history:', e);
  }
}

export function canTriggerNotification(force = false): boolean {
  if (force) return true;

  const rec = getSentNotificationRecord();
  if (rec.count >= MAX_NOTIFICATIONS_PER_DAY) {
    return false;
  }

  if (rec.lastSentAt) {
    const diffMs = Date.now() - new Date(rec.lastSentAt).getTime();
    // 15 minutes between automatic unprompted popups (allows proper testing without spamming)
    if (diffMs < 15 * 60 * 1000) {
      return false;
    }
  }

  return true;
}

export function getNextContextualNotification(isGuest: boolean, force = false): SmartNotificationMessage | null {
  if (!force && !canTriggerNotification()) return null;

  const hour = new Date().getHours();
  let timeSlot: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  if (hour >= 12 && hour < 17) timeSlot = 'afternoon';
  else if (hour >= 17 && hour < 21) timeSlot = 'evening';
  else if (hour >= 21 || hour < 5) timeSlot = 'night';

  const pool = isGuest ? GUEST_STUDENT_NOTIFICATIONS : REGISTERED_STUDENT_NOTIFICATIONS;
  const rec = getSentNotificationRecord();

  let candidates = pool.filter(p => p.timeSlot === timeSlot);
  if (candidates.length === 0) {
    candidates = pool;
  }

  const unsent = candidates.filter((_, idx) => !rec.sentIds.includes(`n_${isGuest ? 'g' : 'r'}_${idx}`));
  const chosenIndex = unsent.length > 0 
    ? Math.floor(Math.random() * unsent.length)
    : Math.floor(Math.random() * candidates.length);

  const chosen = (unsent.length > 0 ? unsent : candidates)[chosenIndex];
  if (!chosen) return null;

  return {
    id: `n_${isGuest ? 'g' : 'r'}_${chosenIndex}_${Date.now()}`,
    ...chosen
  };
}

/**
 * Check if the app is currently running inside an iframe (e.g. AI Studio preview)
 * Browsers block Notification permission requests inside cross-origin iframes.
 */
export function isRunningInIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Utility: Convert URL safe base64 to Uint8Array for VAPID applicationServerKey
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register background PushManager subscription with the server
 * Enables real background push alerts even when the tab is closed
 */
export async function subscribeDeviceToPush(
  studentId?: string,
  studentName?: string,
  isGuest?: boolean
): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { success: false, message: 'Web Push is not supported in this browser.' };
  }

  try {
    // 1. Fetch server's public VAPID key
    const res = await fetch('/api/notifications/vapid-public-key');
    if (!res.ok) {
      return { success: false, message: 'Could not fetch VAPID key from server.' };
    }
    const { publicKey } = await res.json();
    if (!publicKey) {
      return { success: false, message: 'Server did not return a valid VAPID key.' };
    }

    // 2. Wait for Service Worker to be active
    const registration = await navigator.serviceWorker.ready;
    if (!registration || !registration.pushManager) {
      return { success: false, message: 'Service worker push manager not ready.' };
    }

    // 3. Check for existing subscription or create new
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const appKey = urlBase64ToUint8Array(publicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appKey
      });
    }

    // 4. Send subscription to server
    const subJson = subscription.toJSON();
    const saveRes = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subJson,
        studentId: studentId || 'device_student',
        studentName: studentName || 'Student',
        isGuest: Boolean(isGuest),
        userAgent: navigator.userAgent
      })
    });

    if (saveRes.ok) {
      localStorage.setItem('studymentor_push_active_v1', 'true');
      return { success: true, message: 'Device registered for background push notifications!' };
    }
    return { success: false, message: 'Server registration returned an error.' };
  } catch (err: any) {
    console.warn('[Push Engine] Subscription attempt notice:', err);
    return { success: false, message: err?.message || 'Subscription failed.' };
  }
}

/**
 * Request Browser Push Notification Permission
 */
export async function requestBrowserNotificationPermission(
  studentId?: string,
  studentName?: string,
  isGuest?: boolean
): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);

    if (permission === 'granted') {
      // Automatically enroll in Server Web Push for true lock screen & background delivery
      subscribeDeviceToPush(studentId, studentName, isGuest).catch(() => {});
    }

    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Trigger true system notification (appears in phone's lock screen & notification shade like WhatsApp/Instagram)
 * Uses ServiceWorkerRegistration.showNotification when available for full mobile OS integration.
 */
export async function fireSystemPushNotification(
  title: string, 
  body: string, 
  icon = '/pwa-icon.svg',
  url = '/'
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const notifOptions: NotificationOptions = {
    body,
    icon,
    badge: icon,
    tag: 'studymentor-push-alert',
    renotify: true,
    data: { url },
    ...({
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: false
    } as any)
  };

  let delivered = false;

  // 1. Primary: ServiceWorkerRegistration.showNotification (Mobile Android & Desktop notification shade)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, notifOptions);
        delivered = true;
      }
    } catch (swErr) {
      console.warn('[Push Engine] Service worker showNotification note:', swErr);
    }
  }

  // 2. Secondary: Fallback to window Notification constructor on Desktop if SW was pending
  if (!delivered) {
    try {
      new Notification(title, notifOptions);
      delivered = true;
    } catch (notifErr) {
      // Android Chrome will reject new Notification(), which is expected
      console.warn('[Push Engine] Standard notification note:', notifErr);
    }
  }

  // 3. Tertiary: Also trigger server test push in parallel (ensures network push delivery is tested)
  try {
    fetch('/api/notifications/send-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url })
    }).catch(() => {});
  } catch {
    // Non-blocking
  }

  return delivered;
}
