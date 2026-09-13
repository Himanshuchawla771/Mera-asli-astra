import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  ChevronDown, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Atom, 
  Calculator, 
  Landmark, 
  Stethoscope, 
  Rocket, 
  Compass, 
  Award,
  BookOpen,
  Zap,
  Layers
} from 'lucide-react';
import { AcademicJourney } from '../types';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';

interface JourneyMegaSelectorProps {
  currentJourney: AcademicJourney;
  onSelectJourney: (journey: AcademicJourney) => void;
}

interface StreamOption {
  id: AcademicJourney;
  title: string;
  shortName: string;
  category: 'SCHOOL_BOARDS' | 'PROFESSIONAL' | 'COMPETITIVE';
  grade?: '11th' | '12th';
  stream?: 'Science' | 'Commerce' | 'Arts';
  badge: string;
  badgeColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  icon: React.ElementType;
  subjectsCount: number;
  highlightDesc: string;
  tags: string[];
}

const STREAM_OPTIONS: StreamOption[] = [
  // Class 12
  {
    id: 'CLASS_12_SCIENCE',
    title: 'Class 12 Science',
    shortName: '12th Science',
    category: 'SCHOOL_BOARDS',
    grade: '12th',
    stream: 'Science',
    badge: 'PCM / PCB',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
    accentBg: 'hover:bg-blue-50/70 data-[selected=true]:bg-blue-50/90',
    accentBorder: 'data-[selected=true]:border-blue-500 data-[selected=true]:ring-2 data-[selected=true]:ring-blue-500/20',
    accentText: 'text-blue-700',
    icon: Atom,
    subjectsCount: 6,
    highlightDesc: 'Physics, Chemistry, Maths, Biology & CS (Rationalized CBSE)',
    tags: ['class 12', '12th', 'science', 'physics', 'chemistry', 'maths', 'biology', 'pcm', 'pcb', 'cbse']
  },
  {
    id: 'CLASS_12',
    title: 'Class 12 Commerce',
    shortName: '12th Commerce',
    category: 'SCHOOL_BOARDS',
    grade: '12th',
    stream: 'Commerce',
    badge: 'Accounts & BST',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    accentBg: 'hover:bg-amber-50/70 data-[selected=true]:bg-amber-50/90',
    accentBorder: 'data-[selected=true]:border-amber-500 data-[selected=true]:ring-2 data-[selected=true]:ring-amber-500/20',
    accentText: 'text-amber-700',
    icon: Calculator,
    subjectsCount: 6,
    highlightDesc: 'Accountancy, Business Studies, Economics, Applied Maths',
    tags: ['class 12', '12th', 'commerce', 'accounts', 'accountancy', 'business studies', 'bst', 'economics', 'cbse']
  },
  {
    id: 'CLASS_12_ARTS',
    title: 'Class 12 Arts / Humanities',
    shortName: '12th Arts',
    category: 'SCHOOL_BOARDS',
    grade: '12th',
    stream: 'Arts',
    badge: 'Humanities',
    badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-200',
    accentBg: 'hover:bg-rose-50/70 data-[selected=true]:bg-rose-50/90',
    accentBorder: 'data-[selected=true]:border-rose-500 data-[selected=true]:ring-2 data-[selected=true]:ring-rose-500/20',
    accentText: 'text-rose-700',
    icon: Landmark,
    subjectsCount: 7,
    highlightDesc: 'History, Political Science, Geography, Psychology, Sociology',
    tags: ['class 12', '12th', 'arts', 'humanities', 'history', 'pol science', 'geography', 'cbse']
  },

  // Class 11
  {
    id: 'CLASS_11_SCIENCE',
    title: 'Class 11 Science',
    shortName: '11th Science',
    category: 'SCHOOL_BOARDS',
    grade: '11th',
    stream: 'Science',
    badge: 'PCM / PCB',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
    accentBg: 'hover:bg-blue-50/70 data-[selected=true]:bg-blue-50/90',
    accentBorder: 'data-[selected=true]:border-blue-500 data-[selected=true]:ring-2 data-[selected=true]:ring-blue-500/20',
    accentText: 'text-blue-700',
    icon: Atom,
    subjectsCount: 6,
    highlightDesc: 'Kinematics, Thermodynamics, Atom Structure, Calculus, Cells',
    tags: ['class 11', '11th', 'science', 'physics', 'chemistry', 'maths', 'biology', 'pcm', 'pcb', 'cbse']
  },
  {
    id: 'CLASS_11_COMMERCE',
    title: 'Class 11 Commerce',
    shortName: '11th Commerce',
    category: 'SCHOOL_BOARDS',
    grade: '11th',
    stream: 'Commerce',
    badge: 'Accounts & BST',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    accentBg: 'hover:bg-amber-50/70 data-[selected=true]:bg-amber-50/90',
    accentBorder: 'data-[selected=true]:border-amber-500 data-[selected=true]:ring-2 data-[selected=true]:ring-amber-500/20',
    accentText: 'text-amber-700',
    icon: Calculator,
    subjectsCount: 6,
    highlightDesc: 'Journal, Ledger, Financial Statements, Business Forms & Micro-Eco',
    tags: ['class 11', '11th', 'commerce', 'accounts', 'accountancy', 'business studies', 'bst', 'economics', 'cbse']
  },
  {
    id: 'CLASS_11_ARTS',
    title: 'Class 11 Arts / Humanities',
    shortName: '11th Arts',
    category: 'SCHOOL_BOARDS',
    grade: '11th',
    stream: 'Arts',
    badge: 'Humanities',
    badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-200',
    accentBg: 'hover:bg-rose-50/70 data-[selected=true]:bg-rose-50/90',
    accentBorder: 'data-[selected=true]:border-rose-500 data-[selected=true]:ring-2 data-[selected=true]:ring-rose-500/20',
    accentText: 'text-rose-700',
    icon: Landmark,
    subjectsCount: 7,
    highlightDesc: 'Early Societies, Constitution at Work, Geography Principles',
    tags: ['class 11', '11th', 'arts', 'humanities', 'history', 'pol science', 'geography', 'cbse']
  },

  // Professional CA
  {
    id: 'CA_FOUNDATION',
    title: 'CA Foundation',
    shortName: 'CA Foundation',
    category: 'PROFESSIONAL',
    badge: 'ICAI Scheme',
    badgeColor: 'bg-slate-900/10 text-slate-800 border-slate-300',
    accentBg: 'hover:bg-slate-100 data-[selected=true]:bg-slate-100',
    accentBorder: 'data-[selected=true]:border-slate-800 data-[selected=true]:ring-2 data-[selected=true]:ring-slate-800/20',
    accentText: 'text-slate-900',
    icon: Award,
    subjectsCount: 4,
    highlightDesc: 'Accounting, Business Laws, Quantitative Aptitude & Business Economics',
    tags: ['ca', 'icai', 'foundation', 'accounting', 'business laws', 'quantitative aptitude', 'chartered accountancy']
  },
  {
    id: 'CA_INTERMEDIATE',
    title: 'CA Intermediate',
    shortName: 'CA Inter',
    category: 'PROFESSIONAL',
    badge: 'Group 1 & 2',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    accentBg: 'hover:bg-indigo-50/70 data-[selected=true]:bg-indigo-50/90',
    accentBorder: 'data-[selected=true]:border-indigo-500 data-[selected=true]:ring-2 data-[selected=true]:ring-indigo-500/20',
    accentText: 'text-indigo-700',
    icon: Award,
    subjectsCount: 6,
    highlightDesc: 'Adv Accounting, Corp Laws, Taxation, Costing, Audit & FM-SM',
    tags: ['ca', 'icai', 'intermediate', 'inter', 'group 1', 'group 2', 'taxation', 'audit', 'costing', 'chartered accountancy']
  },
  {
    id: 'CA_FINAL',
    title: 'CA Final',
    shortName: 'CA Final',
    category: 'PROFESSIONAL',
    badge: 'National Ranker',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200',
    accentBg: 'hover:bg-purple-50/70 data-[selected=true]:bg-purple-50/90',
    accentBorder: 'data-[selected=true]:border-purple-500 data-[selected=true]:ring-2 data-[selected=true]:ring-purple-500/20',
    accentText: 'text-purple-700',
    icon: Award,
    subjectsCount: 6,
    highlightDesc: 'FR, AFM, Adv Auditing, Direct & Indirect Tax Laws, IBS',
    tags: ['ca', 'icai', 'final', 'fr', 'afm', 'dt', 'idt', 'chartered accountancy']
  },

  // Competitive Entrances
  {
    id: 'NEET',
    title: 'NEET (UG)',
    shortName: 'NEET (UG)',
    category: 'COMPETITIVE',
    badge: 'Medical NTA',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    accentBg: 'hover:bg-emerald-50/70 data-[selected=true]:bg-emerald-50/90',
    accentBorder: 'data-[selected=true]:border-emerald-500 data-[selected=true]:ring-2 data-[selected=true]:ring-emerald-500/20',
    accentText: 'text-emerald-700',
    icon: Stethoscope,
    subjectsCount: 3,
    highlightDesc: 'Physics, Chemistry, Botany & Zoology (NTA NCERT Core)',
    tags: ['neet', 'medical', 'mbbs', 'doctor', 'botany', 'zoology', 'biology', 'nta']
  },
  {
    id: 'JEE',
    title: 'JEE (Main & Advanced)',
    shortName: 'IIT JEE',
    category: 'COMPETITIVE',
    badge: 'Engineering',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    accentBg: 'hover:bg-amber-50/70 data-[selected=true]:bg-amber-50/90',
    accentBorder: 'data-[selected=true]:border-amber-500 data-[selected=true]:ring-2 data-[selected=true]:ring-amber-500/20',
    accentText: 'text-amber-700',
    icon: Rocket,
    subjectsCount: 3,
    highlightDesc: 'Physics, Chemistry & Advanced Mathematics Problem Solving',
    tags: ['jee', 'iit', 'engineering', 'main', 'advanced', 'maths', 'physics', 'chemistry', 'nta']
  },
  {
    id: 'CUET',
    title: 'CUET (UG)',
    shortName: 'CUET (UG)',
    category: 'COMPETITIVE',
    badge: 'Central Univ',
    badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
    accentBg: 'hover:bg-violet-50/70 data-[selected=true]:bg-violet-50/90',
    accentBorder: 'data-[selected=true]:border-violet-500 data-[selected=true]:ring-2 data-[selected=true]:ring-violet-500/20',
    accentText: 'text-violet-700',
    icon: Compass,
    subjectsCount: 4,
    highlightDesc: 'Section IA/IB Languages, Domain Subjects & Section III General Test',
    tags: ['cuet', 'central universities', 'delhi university', 'du', 'bhu', 'general test', 'domain']
  }
];

export const JourneyMegaSelector: React.FC<JourneyMegaSelectorProps> = ({
  currentJourney,
  onSelectJourney
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'SCHOOL_BOARDS' | 'PROFESSIONAL' | 'COMPETITIVE'>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentOption = STREAM_OPTIONS.find(opt => opt.id === currentJourney) || STREAM_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  // Keyboard shortcut Ctrl+K or Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredStreams = STREAM_OPTIONS.filter(stream => {
    const matchesTab = activeTab === 'ALL' || stream.category === activeTab;
    if (!matchesTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      stream.title.toLowerCase().includes(q) ||
      stream.shortName.toLowerCase().includes(q) ||
      stream.highlightDesc.toLowerCase().includes(q) ||
      stream.tags.some(t => t.includes(q))
    );
  });

  const handleSelect = (journeyId: AcademicJourney) => {
    onSelectJourney(journeyId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Sleek Floating Trigger Pill in Navbar */}
      <button
        type="button"
        id="btn-journey-mega-selector"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-xs active:scale-98"
      >
        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${currentOption.badgeColor.split(' ')[0]} ${currentOption.accentText}`}>
          <CurrentIcon className="w-3.5 h-3.5" />
        </div>
        
        <div className="text-left flex items-center gap-1.5">
          <span className="text-xs font-black text-slate-800 tracking-tight group-hover:text-slate-950">
            {currentOption.shortName}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${currentOption.badgeColor} hidden sm:inline-block`}>
            {currentOption.badge}
          </span>
        </div>

        <div className="flex items-center gap-1 pl-1 text-slate-400 group-hover:text-slate-600">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[9px] font-mono font-semibold px-1 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>
      </button>

      {/* Linear-Style Command Mega Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header & Search */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to switch stream... (e.g. '11th Science', 'JEE', 'CA Inter', 'Accounts')"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Streams ({STREAM_OPTIONS.length})
              </button>
              <button
                onClick={() => setActiveTab('SCHOOL_BOARDS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'SCHOOL_BOARDS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🏫 School Boards (11th & 12th)
              </button>
              <button
                onClick={() => setActiveTab('PROFESSIONAL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'PROFESSIONAL'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🎓 CA Professional
              </button>
              <button
                onClick={() => setActiveTab('COMPETITIVE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'COMPETITIVE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🎯 NEET / JEE / CUET
              </button>
            </div>

            {/* Bento Grid Stream List */}
            <div className="p-3.5 overflow-y-auto space-y-4 max-h-[60vh]">
              {filteredStreams.length === 0 ? (
                <div className="py-12 text-center">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No matching academic streams found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try searching "11th Science", "12th Arts", "CA", or "NEET"</p>
                </div>
              ) : (
                <>
                  {/* School Boards Group */}
                  {(activeTab === 'ALL' || activeTab === 'SCHOOL_BOARDS') && (
                    <div>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Senior Secondary (Class 11 & 12)
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">CBSE & State Boards</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredStreams
                          .filter(s => s.category === 'SCHOOL_BOARDS')
                          .map(stream => {
                            const Icon = stream.icon;
                            const isSelected = stream.id === currentJourney;
                            return (
                              <button
                                key={stream.id}
                                data-selected={isSelected}
                                onClick={() => handleSelect(stream.id)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${stream.accentBg} ${stream.accentBorder} ${
                                  isSelected 
                                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs' 
                                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-xs'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${stream.badgeColor.split(' ')[0]} ${stream.accentText}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 justify-between">
                                    <span className="text-xs font-black text-slate-900 truncate">
                                      {stream.title}
                                    </span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${stream.badgeColor} shrink-0`}>
                                      {stream.badge}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {stream.highlightDesc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 self-center" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Professional CA Group */}
                  {(activeTab === 'ALL' || activeTab === 'PROFESSIONAL') && (
                    <div>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Chartered Accountancy (ICAI)
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">New Education Scheme</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {filteredStreams
                          .filter(s => s.category === 'PROFESSIONAL')
                          .map(stream => {
                            const Icon = stream.icon;
                            const isSelected = stream.id === currentJourney;
                            return (
                              <button
                                key={stream.id}
                                data-selected={isSelected}
                                onClick={() => handleSelect(stream.id)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${stream.accentBg} ${stream.accentBorder} ${
                                  isSelected 
                                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs' 
                                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-xs'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${stream.badgeColor.split(' ')[0]} ${stream.accentText}`}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    {isSelected ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                                    ) : (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${stream.badgeColor}`}>
                                        {stream.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-black text-slate-900 block truncate">
                                    {stream.title}
                                  </span>
                                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                                    {stream.highlightDesc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Competitive Entrance Group */}
                  {(activeTab === 'ALL' || activeTab === 'COMPETITIVE') && (
                    <div>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          National Entrance Exams (NTA)
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">UG Entrances</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {filteredStreams
                          .filter(s => s.category === 'COMPETITIVE')
                          .map(stream => {
                            const Icon = stream.icon;
                            const isSelected = stream.id === currentJourney;
                            return (
                              <button
                                key={stream.id}
                                data-selected={isSelected}
                                onClick={() => handleSelect(stream.id)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${stream.accentBg} ${stream.accentBorder} ${
                                  isSelected 
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-xs'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${stream.badgeColor.split(' ')[0]} ${stream.accentText}`}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    {isSelected ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${stream.badgeColor}`}>
                                        {stream.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-black text-slate-900 block truncate">
                                    {stream.title}
                                  </span>
                                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                                    {stream.highlightDesc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">Active:</span> {currentOption.title} ({currentOption.subjectsCount} Subjects Configured)
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px]">ESC</kbd> to exit</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
