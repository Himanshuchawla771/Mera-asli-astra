import React, { useState, useEffect } from 'react';
import { 
  Library, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  BookOpen, 
  FileCheck, 
  Sparkles, 
  Tag, 
  Search,
  Check,
  X,
  Layers,
  Award,
  GraduationCap,
  Upload,
  Paperclip,
  Download,
  FileText
} from 'lucide-react';
import { ReferenceSource, SourceCategory, AcademicJourney } from '../types';
import { ACADEMIC_JOURNEYS } from '../data/academicStructure';

interface SourceLibraryViewProps {
  currentJourney: AcademicJourney;
  setCurrentJourney: (j: AcademicJourney) => void;
  sources: ReferenceSource[];
  onAddOrUpdateSource: (source: ReferenceSource) => void;
  onDeleteSource: (id: string) => void;
}

const CATEGORIES: SourceCategory[] = [
  'Official Syllabus',
  'Marking Scheme',
  'Topper Copy',
  'Textbook',
  'Revision Notes',
  'Formula Sheet'
];

export const SourceLibraryView: React.FC<SourceLibraryViewProps> = ({
  currentJourney,
  setCurrentJourney,
  sources,
  onAddOrUpdateSource,
  onDeleteSource
}) => {
  const journeyDef = ACADEMIC_JOURNEYS[currentJourney];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Sync filters when journey changes
  useEffect(() => {
    setSelectedSubjectFilter('All');
    setSubject(journeyDef.subjects[0]?.name || 'Accountancy');
    setLevel(journeyDef.defaultLevel);
  }, [currentJourney]);
  
  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ReferenceSource | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [formJourney, setFormJourney] = useState<AcademicJourney>(currentJourney);
  const [level, setLevel] = useState(journeyDef.defaultLevel);
  const [category, setCategory] = useState<SourceCategory>('Marking Scheme');
  const [subject, setSubject] = useState(journeyDef.subjects[0]?.name || 'Accountancy');
  const [chapter, setChapter] = useState('');
  const [year, setYear] = useState('2025-26');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [attachedFileName, setAttachedFileName] = useState<string | undefined>(undefined);
  const [attachedFileSize, setAttachedFileSize] = useState<number | undefined>(undefined);
  const [attachedFileType, setAttachedFileType] = useState<string | undefined>(undefined);
  const [attachedFileBase64, setAttachedFileBase64] = useState<string | undefined>(undefined);

  const handleFileUpload = (selectedFile: File) => {
    if (!selectedFile) return;
    setAttachedFileName(selectedFile.name);
    setAttachedFileSize(selectedFile.size);
    setAttachedFileType(selectedFile.type);

    if (!title.trim()) {
      const cleanTitle = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanTitle);
    }

    const reader = new FileReader();
    if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setAttachedFileBase64(`data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`);
      };
      reader.readAsText(selectedFile);
    } else {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAttachedFileBase64(base64);
        if (!content.trim()) {
          setContent(`[Uploaded Document: ${selectedFile.name}]\nFormat: ${selectedFile.type || 'Document'}\nSize: ${(selectedFile.size / 1024).toFixed(1)} KB\nThis reference document is attached to the syllabus standards library.`);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const openAddModal = (initialFile?: File) => {
    setEditingSource(null);
    setTitle('');
    setFormJourney(currentJourney);
    setLevel(journeyDef.defaultLevel);
    setCategory('Marking Scheme');
    setSubject(journeyDef.subjects[0]?.name || 'Accountancy');
    setChapter('');
    setYear('2025-26');
    setDescription('');
    setContent('');
    setIsActive(true);
    setAttachedFileName(undefined);
    setAttachedFileSize(undefined);
    setAttachedFileType(undefined);
    setAttachedFileBase64(undefined);

    if (initialFile) {
      handleFileUpload(initialFile);
    }

    setIsModalOpen(true);
  };

  const openEditModal = (src: ReferenceSource) => {
    setEditingSource(src);
    setTitle(src.title);
    setFormJourney(src.journey || currentJourney);
    setLevel(src.level || journeyDef.defaultLevel);
    setCategory(src.category);
    setSubject(src.subject);
    setChapter(src.chapter || '');
    setYear(src.year || '2025-26');
    setDescription(src.description);
    setContent(src.content);
    setIsActive(src.isActive);
    setAttachedFileName(src.attachedFileName);
    setAttachedFileSize(src.attachedFileSize);
    setAttachedFileType(src.attachedFileType);
    setAttachedFileBase64(src.attachedFileBase64);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const sourceToSave: ReferenceSource = {
      id: editingSource ? editingSource.id : `source_${Date.now()}`,
      title: title.trim(),
      journey: formJourney,
      level: level || (formJourney === 'CLASS_12' ? 'Class 12 CBSE' : 'CA Foundation ICAI'),
      category,
      subject: subject.trim() || 'General',
      chapter: chapter.trim() || undefined,
      year: year.trim() || undefined,
      description: description.trim(),
      content: content.trim(),
      isActive,
      isBuiltIn: editingSource?.isBuiltIn || false,
      attachedFileName,
      attachedFileSize,
      attachedFileType,
      attachedFileBase64,
      createdAt: editingSource?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddOrUpdateSource(sourceToSave);
    setIsModalOpen(false);
  };

  const toggleSourceActive = (source: ReferenceSource) => {
    onAddOrUpdateSource({
      ...source,
      isActive: !source.isActive,
      updatedAt: new Date().toISOString()
    });
  };

  // Filter sources strictly by current journey
  const journeySources = sources.filter(s => s.journey === currentJourney);

  const filteredSources = journeySources.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'All' || s.subject === selectedSubjectFilter || s.subject === 'All Subjects';
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesSubject && matchesCat;
  });

  const activeCount = journeySources.filter(s => s.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Bento Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                Strict Academic Isolation
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                {activeCount} Active for {journeyDef.badge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Library className="w-7 h-7 text-indigo-600" />
              <span>Source Library & Marking Rubrics</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
              Official Marking Schemes, Topper Copies, and Textbooks strictly isolated by syllabus. The AI evaluator references these standards while giving credit for valid semantic expressions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Journey Switcher */}
            <div className="bg-gray-100 p-1 rounded-2xl flex items-center border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
              <button
                onClick={() => {
                  setCurrentJourney('CLASS_12');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CLASS_12'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                12th Commerce
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CLASS_12_SCIENCE');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CLASS_12_SCIENCE'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                12th Science
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CLASS_12_ARTS');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CLASS_12_ARTS'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                12th Arts
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CLASS_11_SCIENCE');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CLASS_11_SCIENCE'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                11th Science
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CLASS_11_COMMERCE');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CLASS_11_COMMERCE'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                11th Commerce
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CLASS_11_ARTS');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CLASS_11_ARTS'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                11th Arts
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CA_FOUNDATION');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentJourney === 'CA_FOUNDATION'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CA Foundation
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CA_INTERMEDIATE');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentJourney === 'CA_INTERMEDIATE'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CA Intermediate
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CA_FINAL');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentJourney === 'CA_FINAL'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CA Final ICAI
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('NEET');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentJourney === 'NEET'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                NEET (UG)
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('JEE');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentJourney === 'JEE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                JEE (Main & Adv)
              </button>
              <button
                onClick={() => {
                  setCurrentJourney('CUET');
                  setSelectedSubjectFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentJourney === 'CUET'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                CUET (UG)
              </button>
            </div>

            {/* Direct File Upload button */}
            <label
              htmlFor="source-direct-upload-header"
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Upload your notes or reference file directly"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Upload File as Source</span>
            </label>
            <input
              id="source-direct-upload-header"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md,image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  openAddModal(e.target.files[0]);
                }
              }}
            />

            <button
              onClick={() => openAddModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Source</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Bento Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${journeyDef.title} sources...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-gray-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All {journeyDef.badge} Subjects</option>
              {journeyDef.subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
              source.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                    {source.category}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-gray-100 text-slate-700">
                    {source.subject}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleSourceActive(source)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    source.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${source.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  <span>{source.isActive ? 'Active' : 'Disabled'}</span>
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{source.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {source.description || source.content.substring(0, 100) + '...'}
                </p>
              </div>

              {source.chapter && (
                <p className="text-[11px] text-gray-400">
                  Chapter: <span className="font-medium text-slate-700">{source.chapter}</span>
                </p>
              )}

              {source.attachedFileName && (
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 mt-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold truncate">{source.attachedFileName}</span>
                    {source.attachedFileSize && (
                      <span className="text-[10px] text-indigo-500 shrink-0">
                        ({(source.attachedFileSize / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    )}
                  </div>
                  {source.attachedFileBase64 && (
                    <a
                      href={source.attachedFileBase64}
                      download={source.attachedFileName}
                      className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-100 rounded-md transition-colors shrink-0"
                      title="Download attached file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                {source.isBuiltIn ? 'Standard Verified' : 'Custom Added'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(source)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit Source"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {!source.isBuiltIn && (
                  <button
                    onClick={() => onDeleteSource(source.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Source"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Library className="w-5 h-5 text-indigo-600" />
                <span>{editingSource ? 'Edit Reference Source' : 'Add New Reference Source'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Journey</label>
                  <select
                    value={formJourney}
                    onChange={(e) => setFormJourney(e.target.value as AcademicJourney)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold bg-white text-slate-800"
                  >
                    <option value="CLASS_12">Class 12 Commerce</option>
                    <option value="CLASS_12_SCIENCE">Class 12 Science</option>
                    <option value="CLASS_12_ARTS">Class 12 Arts</option>
                    <option value="CLASS_11_SCIENCE">Class 11 Science</option>
                    <option value="CLASS_11_COMMERCE">Class 11 Commerce</option>
                    <option value="CLASS_11_ARTS">Class 11 Arts</option>
                    <option value="CA_FOUNDATION">CA Foundation</option>
                    <option value="CA_INTERMEDIATE">CA Intermediate</option>
                    <option value="CA_FINAL">CA Final</option>
                    <option value="NEET">NEET (UG)</option>
                    <option value="JEE">JEE (Main & Adv)</option>
                    <option value="CUET">CUET (UG)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SourceCategory)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold bg-white text-slate-800"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold bg-white text-slate-800"
                  >
                    {ACADEMIC_JOURNEYS[formJourney].subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="All Subjects">All Subjects</option>
                  </select>
                </div>
              </div>

              {/* File Attachment Dropzone / Attached State */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload / Attach File (PDF, Notes, Images, or Doc)
                </label>
                {attachedFileName ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">
                          {attachedFileName}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {attachedFileSize ? `${(attachedFileSize / (1024 * 1024)).toFixed(2)} MB` : 'Attached'} • {attachedFileType || 'Document'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label
                        htmlFor="source-modal-change-file-input"
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-100 rounded-lg border border-indigo-200 cursor-pointer transition-colors"
                      >
                        Change
                      </label>
                      <input
                        id="source-modal-change-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAttachedFileName(undefined);
                          setAttachedFileSize(undefined);
                          setAttachedFileType(undefined);
                          setAttachedFileBase64(undefined);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove attached file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="source-modal-upload-input"
                    className="border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center group"
                  >
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                      Click to upload your notes, marking scheme, or syllabus document
                    </span>
                    <span className="text-[10px] text-gray-400">
                      PDF, Images, TXT, DOCX supported up to 25MB (Auto-reads text notes)
                    </span>
                    <input
                      id="source-modal-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md,image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE 2026 Official Marking Scheme - Accountancy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chapter Focus (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Partnership Fundamentals"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brief Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Step-wise marks allocation and common deductions"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Source Content & Marking Rubrics (Text/Guidelines)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Paste official textbook definitions, marking scheme steps, or topper model answers..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 font-mono text-xs text-slate-800 bg-gray-50/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="source-active-cb"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="source-active-cb" className="font-bold text-slate-700 cursor-pointer">
                  Activate immediately for {formJourney === 'CLASS_12' ? 'Class 12' : 'CA Foundation'} evaluations
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-100"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
