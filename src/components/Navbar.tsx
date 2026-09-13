import React from 'react';
import { 
  FileCheck2, 
  LayoutDashboard, 
  Library, 
  Sparkles, 
  History, 
  Bot, 
  Upload,
  GraduationCap,
  BarChart3,
  ShieldCheck,
  User,
  Sliders,
  LogOut,
  Footprints,
  Smartphone,
  Download,
  Bell,
  Building2,
  Crown
} from 'lucide-react';
import { ActiveTab, ReferenceSource, AcademicJourney, UserProfile } from '../types';
import { triggerPwaInstallPrompt, openNotificationCenterModal } from '../utils/pwaHelper';
import { JourneyMegaSelector } from './JourneyMegaSelector';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentJourney: AcademicJourney;
  setCurrentJourney: (journey: AcademicJourney) => void;
  sources: ReferenceSource[];
  hasActiveEvaluation: boolean;
  activeProfile: UserProfile | null;
  onOpenProfileModal: () => void;
  onQuickUpload: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentJourney,
  setCurrentJourney,
  sources,
  hasActiveEvaluation,
  activeProfile,
  onOpenProfileModal,
  onQuickUpload,
  onSignOut
}) => {
  const activeSourcesCount = sources.filter(s => s.journey === currentJourney && s.isActive).length;
  const hasInspector = Boolean(activeProfile?.hasInspectorPrivilege || activeProfile?.role === 'teacher_admin' || activeProfile?.email === 'himanshuch492@gmail.com' || activeProfile?.email === 'admin@studymentor.edu');
  const isCoachingAuthorized = Boolean(
    (activeProfile?.role === 'coaching_partner' && (activeProfile?.approvalStatus === 'approved' || !activeProfile?.approvalStatus)) ||
    activeProfile?.role === 'teacher_admin' ||
    activeProfile?.email === 'himanshuch492@gmail.com' ||
    activeProfile?.email === 'admin@studymentor.edu' ||
    activeProfile?.hasInspectorPrivilege
  );

  // Strict RBAC: No coaching or admin tabs exposed to regular students or guests
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    ...(isCoachingAuthorized ? [{ id: 'coaching' as ActiveTab, label: 'Coaching Hub', icon: Building2, highlight: true }] : []),
    { id: 'evaluate' as ActiveTab, label: 'Evaluate PDF', icon: Upload },
    ...(hasActiveEvaluation ? [{ id: 'result' as ActiveTab, label: 'Checked Copy', icon: FileCheck2 }] : []),
    { id: 'walk-and-revise' as ActiveTab, label: 'Walk & Revise', icon: Footprints, badge: 'Zero-Pen' },
    { id: 'analysis' as ActiveTab, label: 'Analysis & Mistakes', icon: BarChart3 },
    { 
      id: 'sources' as ActiveTab, 
      label: 'Source Library', 
      icon: Library, 
      badge: activeSourcesCount > 0 ? `${activeSourcesCount} active` : undefined 
    },
    { id: 'create-test' as ActiveTab, label: 'Test Creator', icon: Sparkles },
    { id: 'history' as ActiveTab, label: 'History', icon: History },
    { id: 'assistant' as ActiveTab, label: 'AI Tutor', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div 
              id="nav-brand-logo"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-8.5 h-8.5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-xl flex items-center justify-center text-white shadow-sm ring-1 ring-white/20 transition-all group-hover:scale-105">
                <GraduationCap className="w-4 h-4 text-blue-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
                  StudyMentor <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">PRO</span>
                </h1>
              </div>
            </div>

            {/* Premium Command Mega Selector */}
            <div className="border-l border-slate-200/80 pl-3 ml-0.5">
              <JourneyMegaSelector
                currentJourney={currentJourney}
                onSelectJourney={setCurrentJourney}
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/20'
                      : item.highlight
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100/70 border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action & Profile Switcher Section */}
          <div className="flex items-center gap-2.5">
            {/* Notification Center Bell Button */}
            <button
              id="nav-notification-center-btn"
              onClick={() => openNotificationCenterModal()}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 rounded-xl transition-all cursor-pointer relative shadow-2xs active:scale-95"
              title="Notifications & Study Reminders"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </button>

            {/* Direct 1-Click Install App button in Navbar */}
            <button
              id="nav-install-app-btn"
              onClick={() => triggerPwaInstallPrompt()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/90 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Install StudyMentor AI on your Phone or PC (Works for Guests & Registered Students)"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Install App</span>
            </button>

            <button
              id="nav-quick-evaluate-btn"
              onClick={onQuickUpload}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Evaluate PDF</span>
            </button>

            {/* WAF Shield & Cloud Status Indicators */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-700 text-[11px] font-bold select-none"
              title="Web Application Firewall (WAF) & Anti-DDoS Shield Active (Zero-Latency Protection)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>WAF Shield Active</span>
            </div>

            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold select-none"
              title="Firebase Firestore Cloud Connected for 50+ Students multi-user isolated storage"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Multi-User</span>
            </div>

            {/* Profile Pill & Logout */}
            {activeProfile && (
              <div className="flex items-center gap-1.5">
                {/* Super Admin Discreet Elevated Master Command Trigger */}
                {hasInspector && (
                  <button
                    id="nav-master-command-btn"
                    onClick={() => setActiveTab('classroom')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 border ${
                      activeTab === 'classroom'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-amber-500/20'
                        : 'bg-amber-50 hover:bg-amber-100/90 text-amber-900 border-amber-300'
                    }`}
                    title="Super Admin Master Command Console (Himanshu) - Gatekeeper, Approvals & Live Operations"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span className="hidden sm:inline font-mono uppercase tracking-wider text-[10px]">Master Command</span>
                  </button>
                )}

                <button
                  id="nav-profile-switcher-btn"
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 shadow-2xs transition-all cursor-pointer"
                  title="Click to view & edit Profile"
                >
                  <div className="h-7 w-7 rounded-xl flex items-center justify-center text-xs font-black text-white bg-indigo-600 shadow-2xs">
                    {activeProfile.name ? activeProfile.name.charAt(0) : 'H'}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-black leading-tight line-clamp-1">
                      {activeProfile.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-0.5">
                      {activeProfile.isGuest ? 'Guest Mode' : hasInspector ? 'Super Admin' : 'Student'}
                    </span>
                  </div>
                </button>

                {onSignOut && (
                  <button
                    id="nav-logout-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSignOut();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-rose-200/90 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title={`Log out from ${activeProfile.name}`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between gap-1.5 overflow-x-auto py-2 border-t border-gray-100 no-scrollbar">
          <div className="flex items-center gap-1.5">
            {hasInspector && (
              <button
                id="mobile-nav-master-command-btn"
                onClick={() => setActiveTab('classroom')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-black rounded-lg whitespace-nowrap active:scale-95 transition-all border ${
                  activeTab === 'classroom'
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
                title="Super Admin Master Command"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Master</span>
              </button>
            )}

            <button
              id="mobile-nav-notif-btn"
              onClick={() => openNotificationCenterModal()}
              className="flex items-center justify-center p-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg active:scale-95 transition-all relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </button>

            <button
              id="mobile-nav-install-btn"
              onClick={() => triggerPwaInstallPrompt()}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg whitespace-nowrap active:scale-95 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Install</span>
            </button>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {onSignOut && activeProfile && (
            <button
              id="mobile-nav-logout-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSignOut();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shrink-0 cursor-pointer active:scale-95 transition-all"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
