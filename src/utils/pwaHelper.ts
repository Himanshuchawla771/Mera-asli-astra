/**
 * Global PWA & Web Push State Manager
 * Captures beforeinstallprompt at the earliest script load time (before React mounts)
 * and dispatches prompt triggers reliably across all browsers.
 */

export const PWA_TRIGGER_INSTALL_EVENT = 'studymentor_trigger_pwa_install';
export const PWA_PROMPT_CAPTURED_EVENT = 'studymentor_pwa_prompt_captured';
export const NOTIFICATION_MODAL_OPEN_EVENT = 'studymentor_open_notification_modal';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

// Capture early if browser fires before React components mount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent(PWA_PROMPT_CAPTURED_EVENT, { detail: e }));
  });
}

export function getGlobalDeferredPrompt(): BeforeInstallPromptEvent | null {
  if (globalDeferredPrompt) return globalDeferredPrompt;
  if (typeof window !== 'undefined' && (window as any).__PWA_PROMPT__) {
    return (window as any).__PWA_PROMPT__ as BeforeInstallPromptEvent;
  }
  return null;
}

export function setGlobalDeferredPrompt(val: BeforeInstallPromptEvent | null): void {
  globalDeferredPrompt = val;
  if (typeof window !== 'undefined') {
    (window as any).__PWA_PROMPT__ = val;
  }
}

export function triggerPwaInstallPrompt(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PWA_TRIGGER_INSTALL_EVENT));
  }
}

export function openNotificationCenterModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_MODAL_OPEN_EVENT));
  }
}
