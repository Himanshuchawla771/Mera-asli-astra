import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  User, 
  GraduationCap, 
  Trash2, 
  RefreshCw,
  Sparkles,
  Lock,
  MessageCircle,
  Check
} from 'lucide-react';
import { SupportTicket, TicketCategory, TicketStatus, UserProfile } from '../types';
import { 
  getSavedSupportTickets, 
  addMessageToSupportTicket, 
  updateTicketStatus, 
  deleteSupportTicket 
} from '../utils/storage';
import { fetchSupportTicketsFromCloud } from '../utils/cloudSync';

interface AdminSupportInboxProps {
  adminProfile: UserProfile | null;
}

const QUICK_REPLIES = [
  'As per CBSE official marking scheme, step-wise working notes carry dedicated marks. Make sure to box your final ratio/figure.',
  'Your answer has been re-verified. The deduction was due to missing legal provisions / ICAI keywords as required in the rubric.',
  'Chapter test requested has been prioritized in the Test Creator engine with custom chapter range selection.',
  'Issue resolved! Please refresh your dashboard to see your updated evaluation score and certified copy.',
  'Well done on reaching this score! Keep practicing the suggested PYQ patterns in your Mistake Diary.'
];

export const AdminSupportInbox: React.FC<AdminSupportInboxProps> = ({ adminProfile }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    setIsRefreshing(true);
    // Load local tickets for Admin (all)
    const local = getSavedSupportTickets(undefined, true);
    setTickets(local);

    try {
      const cloud = await fetchSupportTicketsFromCloud(undefined, true);
      if (cloud && cloud.length > 0) {
        setTickets(cloud);
      }
    } catch {
      // fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicketId, tickets]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.studentName.toLowerCase().includes(q);
      const matchTitle = t.subjectTitle.toLowerCase().includes(q);
      const matchSubject = (t.subject || '').toLowerCase().includes(q);
      const matchRoll = (t.studentRoll || '').toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchSubject && !matchRoll) return false;
    }
    return true;
  });

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;

    const updated = addMessageToSupportTicket(selectedTicketId, {
      senderId: adminProfile?.id || 'admin_himanshu',
      senderName: 'Himanshu Chawla',
      senderRole: 'teacher_admin',
      message: replyText.trim()
    });

    if (updated) {
      // If was open, transition to in_progress automatically
      if (updated.status === 'open') {
        const inProg = updateTicketStatus(selectedTicketId, 'in_progress');
        if (inProg) {
          setTickets(prev => prev.map(t => t.id === inProg.id ? inProg : t));
        }
      } else {
        setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
      }
      setReplyText('');
    }
  };

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    const updated = updateTicketStatus(ticketId, status);
    if (updated) {
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
  };

  const handleDelete = (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      const updated = deleteSupportTicket(ticketId);
      setTickets(updated);
      if (selectedTicketId === ticketId) {
        setSelectedTicketId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Counters */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Direct Student Support & Inquiries Command Desk
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Private 1-on-1 Help Desk managed exclusively by Super Admin Himanshu Chawla. Student queries are isolated with zero cross-user visibility.
          </p>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
            <div className="text-xl font-black text-amber-400">{openTicketsCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open</div>
          </div>
          <div className="px-4 py-2.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
            <div className="text-xl font-black text-blue-400">{inProgressCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Review</div>
          </div>
          <div className="px-4 py-2.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
            <div className="text-xl font-black text-emerald-400">{resolvedCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</div>
          </div>
          <button
            onClick={loadTickets}
            title="Refresh Inquiries"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Ticket List (Left) + Active Conversation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Ticket Filters & List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-600" /> Student Inquiries ({filteredTickets.length})
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Total {tickets.length} tickets
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, roll, or topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-[11px] font-bold">
            {(['ALL', 'open', 'in_progress', 'resolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`flex-1 py-1.5 rounded-xl transition-all capitalize cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab === 'in_progress' ? 'In Review' : tab}
              </button>
            ))}
          </div>

          {/* Tickets scroll list */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No tickets matching current filters.
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isSelected = ticket.id === selectedTicketId;
                const lastMsg = ticket.messages[ticket.messages.length - 1];
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          {ticket.studentName}
                        </span>
                        {ticket.studentRoll && (
                          <span className="text-[10px] text-slate-500 bg-gray-100 px-1.5 py-0.2 rounded-sm">
                            {ticket.studentRoll}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status === 'resolved' ? 'Resolved' : ticket.status === 'in_progress' ? 'In Review' : 'Open'}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 mb-1 line-clamp-1">
                      {ticket.subjectTitle}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {lastMsg ? lastMsg.message : ''}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px] text-slate-400">
                      <span>{ticket.category} • {ticket.journey === 'CLASS_12' ? 'Class 12' : 'CA Found.'}</span>
                      <span>{new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Ticket Thread & Quick Reply Composer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col min-h-[580px]">
          {selectedTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-slate-900">
                      {selectedTicket.studentName}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({selectedTicket.studentEmail || 'No email'})
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      {selectedTicket.journey === 'CLASS_12' ? 'Class 12' : 'CA Foundation'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">
                    <span className="font-bold text-slate-900">Query:</span> {selectedTicket.subjectTitle}
                  </p>
                </div>

                {/* Status action dropdown & delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedTicket.status}
                    onChange={e => handleStatusChange(selectedTicket.id, e.target.value as TicketStatus)}
                    className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Review</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedTicket.id)}
                    title="Delete Ticket"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px] bg-slate-50/30">
                {selectedTicket.messages.map(msg => {
                  const isAdmin = msg.senderRole === 'teacher_admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          {isAdmin ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="text-indigo-900 font-bold">You (Himanshu Chawla)</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <span>Student: {selectedTicket.studentName}</span>
                            </>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs font-medium'
                          : 'bg-white text-slate-800 border border-gray-200 rounded-tl-xs shadow-2xs'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Template Replies for Himanshu */}
              <div className="px-4 py-2 bg-slate-100/70 border-t border-gray-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" /> Quick Examiner Presets:
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_REPLIES.map((reply, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(reply)}
                      className="text-[10px] font-medium px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 rounded-lg text-slate-700 shrink-0 transition-colors cursor-pointer"
                    >
                      {reply.slice(0, 38)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Composer */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                <textarea
                  rows={2}
                  placeholder="Type response as Lead Examiner Himanshu Chawla..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm mb-1">
                Select a Support Ticket
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Select an inquiry from the left panel to review doubts, inspect student answer queries, or provide guidance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
