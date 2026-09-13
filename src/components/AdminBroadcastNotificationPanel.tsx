import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Users, 
  Smartphone, 
  Radio, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';
import { fireSystemPushNotification } from '../utils/notificationEngine';
import { acquireActionLock } from '../utils/performance';

interface PushSubscriber {
  id: string;
  studentId: string;
  studentName: string;
  isGuest: boolean;
  userAgent?: string;
  createdAt: string;
}

interface ServerPushStatus {
  status: string;
  vapidConfigured: boolean;
  totalSubscribers: number;
  scheduler: {
    enabled: boolean;
    scheduledHoursIST: number[];
    checkIntervalMinutes: number;
  };
}

export const AdminBroadcastNotificationPanel: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerPushStatus | null>(null);
  const [subscribers, setSubscribers] = useState<PushSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('🌅 Subah 8 AM Study Drill: 15 Mins Formula Revision');
  const [broadcastBody, setBroadcastBody] = useState('Chalo Class 12 & CA Accounts ke key concepts revise karein! Aaj ka target complete karo 🎯');
  const [targetAudience, setTargetAudience] = useState<'all' | 'guest' | 'registered'>('all');
  const [isSending, setIsSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);

  const fetchStatusAndSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications/status');
      if (res.ok) {
        const data = await res.json();
        setServerStatus(data);
        if (Array.isArray(data.subscribers)) {
          setSubscribers(data.subscribers);
        }
      }
    } catch (err) {
      console.warn('Failed to load push server status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndSubscribers();
  }, []);

  const handleTemplateSelect = (title: string, body: string) => {
    setBroadcastTitle(title);
    setBroadcastBody(body);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
    if (isSending) return;
    if (!acquireActionLock('admin_broadcast_push', 2500)) return;

    setIsSending(true);
    setBroadcastResult(null);

    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          body: broadcastBody,
          targetAudience,
          url: '/'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBroadcastResult(
          `Success! Broadcast sent to ${data.deliveredCount} device(s) (Failed: ${data.failedCount || 0}).`
        );
        // Refresh status
        fetchStatusAndSubscribers();
      } else {
        setBroadcastResult(`Error: ${data.message || 'Failed to broadcast'}`);
      }
    } catch (err: any) {
      setBroadcastResult(`Network Error: ${err.message || 'Failed to reach server'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleTestOnAdminDevice = async () => {
    setTestSent(true);
    await fireSystemPushNotification(
      broadcastTitle || 'Admin Push Test',
      broadcastBody || 'Testing notification sound and screen popup alert.'
    );
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Server Push Notification Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live VAPID Web Push
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Sends lock-screen &amp; notification tray alerts to students even when the website is closed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchStatusAndSubscribers}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Grid: 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Subscribed Devices</span>
            <Smartphone className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {serverStatus?.totalSubscribers ?? 0}
          </div>
          <p className="text-[11px] text-slate-500">
            Active phone &amp; PC browser push tokens stored
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Automated Scheduler</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            8 AM &amp; 6 PM IST
          </div>
          <p className="text-[11px] text-slate-500">
            Background cron runs every 30 mins to trigger daily study drills
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">VAPID Security</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            Active &amp; Ready
          </div>
          <p className="text-[11px] text-slate-500">
            RFC 8292 standard Web Push encryption verified
          </p>
        </div>

      </div>

      {/* Main Broadcast Composer Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              <span>Broadcast Instant Notification to Students</span>
            </h3>
            <p className="text-xs text-slate-500">
              This will send a real push notification to all student devices registered with StudyMentor.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleTestOnAdminDevice}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{testSent ? 'Test Sent to Device!' : 'Test On My Device'}</span>
          </button>
        </div>

        {/* Quick Templates */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Notification Templates (Tap to fill):</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTemplateSelect(
                '🌅 Subah 8 AM Revision Drill: 15 Mins Formula Target',
                'Good morning! Class 12 & CA Accounts ke tough chapters ka 15-minute quick test live hai. Aaj ka score boost karein 🎯'
              )}
              className="p-3 rounded-xl text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all text-xs cursor-pointer group"
            >
              <p className="font-bold text-slate-900 group-hover:text-indigo-900">🌅 Morning 8 AM Drill</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Subah 8 AM Revision Drill: 15 Mins Formula Target</p>
            </button>

            <button
              type="button"
              onClick={() => handleTemplateSelect(
                '🌆 Shaam 6 PM Mock Test Reminder: Daily Practice',
                'Shaam ka study hour shuru! Class 12 & CA Foundation topper notes aur live test series check karein. 🚀'
              )}
              className="p-3 rounded-xl text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all text-xs cursor-pointer group"
            >
              <p className="font-bold text-slate-900 group-hover:text-indigo-900">🌆 Evening 6 PM Reminder</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Shaam 6 PM Mock Test Reminder: Daily Practice</p>
            </button>

            <button
              type="button"
              onClick={() => handleTemplateSelect(
                '📝 Checked Copies Updated: Check Your Step Marks!',
                'Teacher evaluation complete ho chuki hai. Apne answer sheet par examiner comments aur working notes feedback dekhein 🔍'
              )}
              className="p-3 rounded-xl text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all text-xs cursor-pointer group"
            >
              <p className="font-bold text-slate-900 group-hover:text-indigo-900">📝 Checked Copies Live</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Teacher evaluation complete ho chuki hai. Feedback dekhein</p>
            </button>

            <button
              type="button"
              onClick={() => handleTemplateSelect(
                '🎧 Walk & Revise Voice Drill: New Session Ready',
                'Break ke time par Walk & Revise chalao aur bina pen-paper ke key definitions revise karo! 🚶‍♂️'
              )}
              className="p-3 rounded-xl text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all text-xs cursor-pointer group"
            >
              <p className="font-bold text-slate-900 group-hover:text-indigo-900">🎧 Walk &amp; Revise Drill</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Break ke time par voice drill se audio revision karo</p>
            </button>
          </div>
        </div>

        {/* Broadcast Form */}
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">Notification Title:</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Subah 8 AM Study Drill"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Target Audience:</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              >
                <option value="all">All Devices (Guests + Registered)</option>
                <option value="registered">Only Registered Students</option>
                <option value="guest">Only Guest Students</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Message Body:</label>
            <textarea
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              rows={3}
              placeholder="Enter notification message text..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900"
            />
          </div>

          {/* Result Alert */}
          {broadcastResult && (
            <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              broadcastResult.startsWith('Success') 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {broadcastResult.startsWith('Success') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{broadcastResult}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSending || (serverStatus?.totalSubscribers === 0)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Broadcasting...' : `Broadcast to ${serverStatus?.totalSubscribers ?? 0} Devices Now 🚀`}</span>
            </button>
          </div>
        </form>

      </div>

      {/* Registered Devices List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Registered Student Devices ({subscribers.length})</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Stored in data/push_subscriptions.json
          </span>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-slate-700">Abhi tak koi device subscribe nahi hua hai.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Jab students ya guests app ke banner se "Turn On Notifications (+1 Bonus)" tap karenge, unka device yahan live appear ho jayega.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Device / User Agent</th>
                  <th className="py-2.5 px-3">Subscribed At</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {subscribers.map((sub, idx) => (
                  <tr key={sub.id || idx} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {sub.studentName || 'Student'}
                      <span className="block text-[10px] text-slate-500 font-normal">{sub.studentId}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {sub.isGuest ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Guest
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                          Registered
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                      {sub.userAgent || 'Web Browser'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={async () => {
                          await fireSystemPushNotification(
                            'StudyMentor Direct Ping 🔔',
                            `Hello ${sub.studentName}! Aapka study notification active hai.`
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 cursor-pointer"
                      >
                        Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
