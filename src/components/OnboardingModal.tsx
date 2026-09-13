import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Target, 
  Mail, 
  School,
  CheckCircle2,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { UserProfile, AcademicJourney } from '../types';
import { verifyMasterAdminPassword, SUPER_ADMIN_EMAIL } from '../utils/security';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetJourney, setTargetJourney] = useState<AcademicJourney>('CLASS_12');
  const [institution, setInstitution] = useState('');
  const [targetScore, setTargetScore] = useState<number>(95);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const isHimanshuAdmin = email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    if (isHimanshuAdmin) {
      if (!verifyMasterAdminPassword(password)) {
        setError('Incorrect Master Admin password for Himanshu Chawla.');
        return;
      }
    }

    const newProfile: UserProfile = {
      id: isHimanshuAdmin ? 'admin_himanshu' : `profile_${Date.now()}`,
      name: name.trim(),
      role: isHimanshuAdmin ? 'teacher_admin' : 'student',
      email: email.trim().toLowerCase(),
      targetJourney,
      institution: institution.trim() || undefined,
      targetScorePercentage: Number(targetScore) || 95,
      hasInspectorPrivilege: isHimanshuAdmin,
      approvalStatus: isHimanshuAdmin ? 'approved' : 'pending_approval',
      passwordHash: btoa(password),
      bio: isHimanshuAdmin
        ? 'Super Admin & Lead Paper Examiner for Class 12, CA, NEET, JEE & CUET.'
        : (targetJourney === 'CLASS_12' 
          ? 'Class 12 Commerce Aspirant preparing with AI Mentor.' 
          : targetJourney === 'CLASS_12_SCIENCE'
          ? 'Class 12 Science (PCM/PCB) Aspirant preparing for Board & Competitive Exams.'
          : targetJourney === 'CLASS_12_ARTS'
          ? 'Class 12 Arts (Humanities) Aspirant preparing for Board Examinations.'
          : targetJourney === 'CLASS_11_SCIENCE'
          ? 'Class 11 Science (PCM/PCB) Aspirant preparing for Foundation & Board Examinations.'
          : targetJourney === 'CLASS_11_COMMERCE'
          ? 'Class 11 Commerce Aspirant preparing with Foundation & Board syllabus.'
          : targetJourney === 'CLASS_11_ARTS'
          ? 'Class 11 Arts (Humanities) Aspirant preparing for Foundation & Board Examinations.'
          : targetJourney === 'CA_INTERMEDIATE'
          ? 'CA Intermediate Aspirant preparing for ICAI Exams (Group 1 & 2).'
          : targetJourney === 'NEET'
          ? 'NEET (UG) Medical Aspirant preparing for Physics, Chemistry & Biology.'
          : targetJourney === 'JEE'
          ? 'JEE (Main & Advanced) Aspirant preparing for Physics, Chemistry & Mathematics.'
          : targetJourney === 'CUET'
          ? 'CUET (UG) Aspirant preparing for Language, Domain Subjects & General Test.'
          : 'CA Foundation Aspirant preparing for ICAI Exams.'),
      assignedBatches: [
        targetJourney === 'CLASS_12' 
          ? 'Class 12 Commerce - Batch Alpha' 
          : targetJourney === 'CLASS_12_SCIENCE'
          ? 'Class 12 Science - Batch Newton'
          : targetJourney === 'CLASS_12_ARTS'
          ? 'Class 12 Arts - Batch Socrates'
          : targetJourney === 'CLASS_11_SCIENCE'
          ? 'Class 11 Science - Batch Galileo'
          : targetJourney === 'CLASS_11_COMMERCE'
          ? 'Class 11 Commerce - Batch Chanakya'
          : targetJourney === 'CLASS_11_ARTS'
          ? 'Class 11 Arts - Batch Plato'
          : targetJourney === 'CA_INTERMEDIATE'
          ? 'CA Intermediate 2026 Batch'
          : targetJourney === 'NEET'
          ? 'NEET 2026 Medical Batch'
          : targetJourney === 'JEE'
          ? 'IIT JEE 2026 Engineering Batch'
          : targetJourney === 'CUET'
          ? 'CUET 2026 Central Universities Batch'
          : 'CA Foundation 2026 Batch'
      ],
      createdAt: new Date().toISOString()
    };

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Header Hero */}
        <div className="p-6 sm:p-7 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <GraduationCap className="w-32 h-32 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to StudyMentor AI</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Set Up Your Personal Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Please enter your name and academic focus to customize your answer-sheet evaluation, working notes &amp; mistake analytics.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Rohan Sharma / Priya Gupta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium placeholder:text-gray-400"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter a secure password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium placeholder:text-gray-400"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Target Exam Focus */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Primary Academic Focus <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetJourney('CLASS_12')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CLASS_12'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">12th Comm.</span>
                  {targetJourney === 'CLASS_12' && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">Commerce</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CLASS_12_SCIENCE')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CLASS_12_SCIENCE'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">12th Science</span>
                  {targetJourney === 'CLASS_12_SCIENCE' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">PCM / PCB</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CLASS_12_ARTS')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CLASS_12_ARTS'
                    ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">12th Arts</span>
                  {targetJourney === 'CLASS_12_ARTS' && <CheckCircle2 className="w-3 h-3 text-rose-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">Humanities</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CLASS_11_SCIENCE')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CLASS_11_SCIENCE'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">11th Sci.</span>
                  {targetJourney === 'CLASS_11_SCIENCE' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">PCM / PCB</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CLASS_11_COMMERCE')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CLASS_11_COMMERCE'
                    ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">11th Comm.</span>
                  {targetJourney === 'CLASS_11_COMMERCE' && <CheckCircle2 className="w-3 h-3 text-amber-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">Accounts / BST</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CLASS_11_ARTS')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CLASS_11_ARTS'
                    ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">11th Arts</span>
                  {targetJourney === 'CLASS_11_ARTS' && <CheckCircle2 className="w-3 h-3 text-rose-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">Humanities</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CA_FOUNDATION')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CA_FOUNDATION'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">CA Found.</span>
                  {targetJourney === 'CA_FOUNDATION' && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">ICAI Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CA_INTERMEDIATE')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CA_INTERMEDIATE'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">CA Inter</span>
                  {targetJourney === 'CA_INTERMEDIATE' && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">New Scheme</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CA_FINAL')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CA_FINAL'
                    ? 'border-purple-700 bg-purple-50/70 ring-2 ring-purple-700/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">CA Final</span>
                  {targetJourney === 'CA_FINAL' && <CheckCircle2 className="w-3 h-3 text-purple-700" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">ICAI Pinnacle</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('NEET')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'NEET'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">NEET (UG)</span>
                  {targetJourney === 'NEET' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">Medical Entrance</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('JEE')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'JEE'
                    ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">JEE (Main & Adv)</span>
                  {targetJourney === 'JEE' && <CheckCircle2 className="w-3 h-3 text-amber-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">IIT Engineering</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetJourney('CUET')}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                  targetJourney === 'CUET'
                    ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">CUET (UG)</span>
                  {targetJourney === 'CUET' && <CheckCircle2 className="w-3 h-3 text-violet-600" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium truncate">Central Universities</span>
              </button>
            </div>
          </div>

          {/* School / Institute & Target Percentage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                School / Institute <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. DPS / Self Study"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium placeholder:text-gray-400"
                />
                <School className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Target Score Goal
              </label>
              <div className="relative">
                <select
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-bold text-indigo-700 bg-white"
                >
                  <option value={95}>95%+ (Merit / AIR Goal)</option>
                  <option value={90}>90%+ (Distinction Goal)</option>
                  <option value={80}>80%+ (First Class Goal)</option>
                  <option value={70}>70%+ (Passing / Foundation Goal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started with My Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
