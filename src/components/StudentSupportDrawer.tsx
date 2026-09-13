import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  X, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Lock,
  User,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { SupportTicket, TicketCategory, UserProfile, AcademicJourney } from '../types';
import { 
  getSavedSupportTickets, 
  saveSupportTicket, 
  addMessageToSupportTicket,
  updateTicketStatus 
} from '../utils/storage';
import { fetchSupportTicketsFromCloud } from '../utils/cloudSync';

interface StudentSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile | null;
  currentJourney: AcademicJourney;
}

const CATEGORIES: TicketCategory[] = [
  'Evaluation Doubt',
  'Technical / App Issue',
  'Chapter Test Query',
  'Syllabus & Concept Guidance',
  'Account & Access',
  'Fee & Enrollment',
  'General Feedback'
];

export const StudentSupportDrawer: React.FC<StudentSupportDrawerProps> = ({
  isOpen,
  onClose,
  activeProfile,
  currentJourney
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Form states for new ticket
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TicketCategory>('Evaluation Doubt');
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [newInitialMessage, setNewInitialMessage] = useState('');
  
  // Anti-bot honeypot field (hidden from legitimate humans)
  const [honeypotField, setHoneypotField] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentId = activeProfile?.id || 'anonymous_student';
  const studentName = activeProfile?.name || 'Student';
  const studentEmail = activeProfile?.email || '';

  // Load tickets on mount & open
  const loadTickets = async () => {
    setIsSyncing(true);
    // 1. Get from local storage
    const local = getSavedSupportTickets(studentId, false);
    setTickets(local);

    // 2. Try fetching latest from cloud
    try {
      const cloud = await fetchSupportTicketsFromCloud(studentId, false);
      if (cloud && cloud.length > 0) {
        // Merge cloud & local
        setTickets(cloud);
      }
    } catch {
      // fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen, studentId]);

  useEffect(() => {
    if (selectedTicketId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicketId, tickets]);

  if (!isOpen) return null;

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Anti-bot honeypot check: If bot filled the hidden honeypot trap, silently reject
    if (honeypotField) {
      console.warn('[Bot Defense] Dropping automated bot submission in support desk.');
      return;
    }

    if (!newTitle.trim() || !newInitialMessage.trim()) {
      alert('Please fill in the query title and detailed message.');
      return;
    }

    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId,
      studentName,
      studentEmail,
      studentRoll: activeProfile?.rollNumber,
      journey: currentJourney,
      subject: newSubject.trim() || (currentJourney === 'CLASS_12' ? 'Accountancy' : 'Business Laws'),
      category: newCategory,
      subjectTitle: newTitle.trim(),
      status: 'open',
      priority: newPriority,
      messages: [
        {
          id: `msg_${Date.now()}_0`,
          senderId: studentId,
          senderName: studentName,
          senderRole: 'student',
          message: newInitialMessage.trim(),
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isReadByAdmin: false,
      isReadByStudent: true
    };

    saveSupportTicket(newTicket);
    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewInitialMessage('');
    setNewSubject('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;

    const updated = addMessageToSupportTicket(selectedTicketId, {
      senderId: studentId,
      senderName: studentName,
      senderRole: 'student',
      message: replyText.trim()
    });

    if (updated) {
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
      setReplyText('');
    }
  };

  const handleMarkResolved = (ticketId: string) => {
    const updated = updateTicketStatus(ticketId, 'resolved');
    if (updated) {
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        id="student-support-drawer-panel"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-gray-200"
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Private Support Desk</h3>
                <span className="flex items-center gap-1 text-[10px] bg-indigo-900/80 text-indigo-200 font-semibold px-2 py-0.5 rounded-full border border-indigo-700">
                  <Lock className="w-2.5 h-2.5" /> Direct to Himanshu Sir
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1-on-1 private channel with Super Admin & Examiner
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={loadTickets}
              title="Refresh tickets"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-banner: Privacy Assurance & Zero Bot Protection Notice */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-4 py-2 flex items-center justify-between text-xs text-indigo-900">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            End-to-End Privacy: No other student can see your doubts.
          </span>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
            WAF Protected
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4">
          {/* View 1: New Ticket Form */}
          {isCreatingNew ? (
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> New Support / Doubt Query
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                {/* Honeypot Trap (Hidden from legitimate users) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="hp_bot_trap"
                    value={honeypotField}
                    onChange={e => setHoneypotField(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category of Query *
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as TicketCategory)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Accountancy - Admission of Partner or Companies Act"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Query Title / Question Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly state your doubt or issue..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      <option value="normal">Normal (Exam Prep)</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent (Test / Exam Day)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Scope
                    </label>
                    <div className="text-xs px-3 py-2 bg-gray-100 text-slate-700 font-bold rounded-xl border border-gray-200">
                      {currentJourney === 'CLASS_12' ? 'Class 12 Commerce' : 'CA Foundation'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Message for Himanshu Sir *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your question, step deduction, concept clarification or feedback in detail..."
                    value={newInitialMessage}
                    onChange={e => setNewInitialMessage(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Private Query to Himanshu Sir
                </button>
              </form>
            </div>
          ) : selectedTicket ? (
            /* View 2: Active Conversation Thread */
            <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              {/* Ticket Top bar */}
              <div className="p-3.5 bg-slate-50 border-b border-gray-200 flex items-start justify-between gap-2">
                <div>
                  <button
                    onClick={() => setSelectedTicketId(null)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 mb-1 cursor-pointer"
                  >
                    ← Back to All Tickets
                  </button>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {selectedTicket.subjectTitle}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      {selectedTicket.category}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {selectedTicket.subject}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTicket.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedTicket.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedTicket.status === 'resolved' ? 'Resolved' : selectedTicket.status === 'in_progress' ? 'In Review' : 'Open'}
                  </span>
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => handleMarkResolved(selectedTicket.id)}
                      className="text-[10px] font-bold text-slate-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[360px] bg-slate-50/40">
                {selectedTicket.messages.map(msg => {
                  const isAdmin = msg.senderRole === 'teacher_admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                          {isAdmin ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-indigo-600" />
                              <span className="text-indigo-900 font-bold">Himanshu Chawla (Admin)</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-slate-500" />
                              <span>You ({msg.senderName})</span>
                            </>
                          )}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-indigo-600 text-white rounded-tl-xs shadow-xs font-medium'
                          : 'bg-white text-slate-800 border border-gray-200 rounded-tr-xs shadow-2xs'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a follow-up message to Himanshu Sir..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Send
                </button>
              </form>
            </div>
          ) : (
            /* View 3: List of Student's Past Tickets */
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Support Tickets ({tickets.length})
                </h4>
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Ask a Question / Doubt
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    No Support Tickets Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                    Have a doubt in an evaluation score, marking scheme, or chapter test? Post directly to Himanshu Sir.
                  </p>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create First Support Ticket
                  </button>
                </div>
              ) : (
                tickets.map(ticket => {
                  const lastMsg = ticket.messages[ticket.messages.length - 1];
                  const hasAdminReply = ticket.messages.some(m => m.senderRole === 'teacher_admin');
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ticket.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ticket.status === 'resolved' ? 'Resolved' : ticket.status === 'in_progress' ? 'In Review' : 'Open'}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {ticket.category}
                          </span>
                          {hasAdminReply && (
                            <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" /> Reply from Himanshu Sir
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 line-clamp-1">
                        {ticket.subjectTitle}
                      </h5>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {lastMsg ? `${lastMsg.senderRole === 'teacher_admin' ? 'Himanshu Sir: ' : 'You: '}${lastMsg.message}` : ''}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px] text-slate-400">
                        <span>{ticket.subject} • {ticket.messages.length} messages</span>
                        <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                          View Thread <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-gray-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          <span>Responses are verified strictly under CBSE / ICAI guidelines.</span>
        </div>
      </div>
    </div>
  );
};
