import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  Sparkles,
  BookOpen,
  Award,
  Stethoscope,
  KeyRound,
  Laptop,
  Users,
  Compass,
  Gift,
  Smartphone,
  Download,
  Zap,
  Landmark,
  Atom
} from 'lucide-react';
import { AcademicJourney, UserProfile } from '../types';
import { registerNewStudent, registerNewCoachingPartner, authenticateUser, SUPER_ADMIN_EMAIL } from '../utils/security';
import { syncProfileToCloud, fetchProfileFromCloud, syncGuestToCloud } from '../utils/cloudSync';
import { saveProfile, setActiveProfile } from '../utils/storage';
import { savePartnerApplication } from '../utils/coachingStorage';
import { initializeGuestUser, applyReferralCode } from '../utils/guestManager';
import { triggerPwaInstallPrompt } from '../utils/pwaHelper';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (profile: UserProfile) => void;
  onCancel?: () => void;
  defaultMode?: 'signin' | 'register' | 'admin' | 'guest';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onSuccess,
  defaultMode = 'signin'
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'admin' | 'guest'>(defaultMode);
  const [registerRole, setRegisterRole] = useState<'student' | 'coaching_partner'>('student');
  
  // Student Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetJourney, setTargetJourney] = useState<AcademicJourney>('CLASS_12');
  const [institution, setInstitution] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // Coaching Partner Form fields
  const [instituteName, setInstituteName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [instituteCity, setInstituteCity] = useState('');
  const [estimatedStudents, setEstimatedStudents] = useState<number>(100);
  const [watermarkText, setWatermarkText] = useState('');

  // Guest Mode fields
  const [guestName, setGuestName] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    (async () => {
      try {
        if (authMode === 'guest') {
          if (!guestName.trim()) {
            setError('Please enter your name to enter as Guest.');
            setIsLoading(false);
            return;
          }

          const guestRecord = initializeGuestUser(guestName.trim());

          // If guest provided an optional referral code, apply it
          if (referralCodeInput.trim()) {
            applyReferralCode(referralCodeInput.trim());
          }

          const guestProfile: UserProfile = {
            id: guestRecord.guestId,
            name: guestRecord.guestName,
            role: 'student',
            email: `guest_${guestRecord.guestId}@guest.studymentor.edu`,
            targetJourney: 'CLASS_12',
            institution: 'Guest Explorer',
            hasInspectorPrivilege: false,
            approvalStatus: 'approved', // Guest enters directly into the app
            isKillSwitched: false,
            isGuest: true,
            referralCode: guestRecord.referralCode,
            bio: 'Guest student exploring exam assessment & AI tutor.',
            createdAt: guestRecord.createdAt
          };

          saveProfile(guestProfile);
          setActiveProfile(guestProfile.id);

          // Immediately sync guest record and profile to Firestore & Server API so Admin sees it live
          syncGuestToCloud(guestRecord).catch(err => console.warn('[AuthModal] Guest cloud sync error:', err));
          syncProfileToCloud(guestProfile).catch(err => console.warn('[AuthModal] Guest profile sync error:', err));

          setIsLoading(false);
          onSuccess(guestProfile);
          return;
        }

        if (authMode === 'register') {
          if (registerRole === 'coaching_partner') {
            // Register as Coaching Institute Partner
            const res = registerNewCoachingPartner({
              instituteName,
              partnerName: directorName || name,
              email,
              password,
              phone: partnerPhone,
              city: instituteCity,
              estimatedStudents: Number(estimatedStudents) || 50,
              watermarkText: watermarkText || `${instituteName.trim().toUpperCase()} • OFFICIAL EVALUATION`
            });

            if (!res.success || !res.profile) {
              setError(res.error || 'Coaching partner registration failed');
              setIsLoading(false);
              return;
            }

            // Save partner application in institutional database
            savePartnerApplication({
              id: `app_${Date.now()}`,
              instituteName: instituteName.trim(),
              partnerName: (directorName || name).trim(),
              email: email.trim().toLowerCase(),
              phone: partnerPhone.trim() || '+91 98765 43210',
              city: instituteCity.trim() || 'National',
              estimatedStudents: Number(estimatedStudents) || 50,
              status: 'pending',
              appliedAt: new Date().toISOString(),
              watermarkText: watermarkText.trim() || `${instituteName.trim().toUpperCase()} • OFFICIAL EVALUATION`
            });

            await syncProfileToCloud(res.profile);

            setIsLoading(false);
            onSuccess(res.profile);
            return;
          }

          // Register as Student
          const res = registerNewStudent({
            name,
            email,
            password,
            targetJourney,
            institution,
            rollNumber
          });

          if (!res.success || !res.profile) {
            setError(res.error || 'Registration failed');
            setIsLoading(false);
            return;
          }

          // Dual sync to Firestore & Server API to immediately notify Super Admin
          await syncProfileToCloud(res.profile);

          setIsLoading(false);
          onSuccess(res.profile);
        } else if (authMode === 'admin') {
          const res = authenticateUser(SUPER_ADMIN_EMAIL, password);
          if (!res.success || !res.profile) {
            setError(res.error || 'Invalid Admin Password');
            setIsLoading(false);
            return;
          }
          setIsLoading(false);
          onSuccess(res.profile);
        } else {
          // Normal student / partner sign in
          let res = authenticateUser(email, password);
          if (!res.success) {
            // Check if profile exists in Cloud or Server registry (cross-device support)
            const cloudProf = await fetchProfileFromCloud('', email);
            if (cloudProf) {
              saveProfile(cloudProf);
              res = authenticateUser(email, password);
            }
          }

          if (!res.success || !res.profile) {
            setError(res.error || 'Sign in failed. Check your email & password or Register first.');
            setIsLoading(false);
            return;
          }
          setIsLoading(false);
          onSuccess(res.profile);
        }
      } catch (err: any) {
        setError(err.message || 'Authentication error');
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 animate-fadeIn my-8">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">StudyMentor AI</h2>
              <p className="text-xs text-slate-400">Class 12 &amp; CA Foundation Exam Evaluation</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 border border-slate-700 text-indigo-400">
            {authMode === 'admin' ? 'Admin Gateway' : authMode === 'register' ? 'New Student' : authMode === 'guest' ? 'Guest Mode' : 'Student Login'}
          </span>
        </div>

        {/* Tab Switcher - 3 clean public tabs: Guest Entry, Sign In, Register */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 my-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('guest');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center truncate ${
              authMode === 'guest'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Guest Entry
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center truncate ${
              authMode === 'signin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center truncate ${
              authMode === 'register'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {authMode === 'guest' ? (
            /* Guest Entry Mode - Only Name Required! */
            <div className="space-y-4 py-1">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs leading-relaxed flex items-start gap-3">
                <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Explore Instantly as Guest Student</p>
                  <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                    Koi registration ya password ki zaroorat nahi! Sirf apna naam likhein aur din ke 2 Tests, 2 Walk &amp; Revise sessions aur 2 Paper Evaluations turant shuru karein.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Aryan Verma / Simran Kaur"
                    required
                    autoFocus
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Referral Code (Optional)</span>
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    +5 Tests &amp; +10 Checks
                  </span>
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. ROHA4920 (agar friend ne diya hai)"
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Daily Test Creations:</span>
                  <span className="font-bold text-white">2 Tests / Day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily Walk &amp; Revise:</span>
                  <span className="font-bold text-white">2 Sessions / Day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily Paper Evaluation:</span>
                  <span className="font-bold text-white">2 Papers / Day</span>
                </div>
                <div className="pt-1 border-t border-slate-800 text-slate-400">
                  Tip: Kabhi bhi full free Register karke 100% unlimited access paa sakte hain.
                </div>
              </div>
            </div>
          ) : authMode === 'admin' ? (
            /* Super Admin Mode */
            <div className="space-y-3 py-2">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Himanshu Chawla Super Admin Console</p>
                  <p className="text-[11px] text-amber-300/90 mt-0.5">
                    Master Administrator: <span className="font-semibold text-white">Himanshu Chawla</span>. Protected with Master Examiner Password.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Master Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Master Admin Password..."
                    required
                    autoFocus
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Student / Partner Sign In or Register */
            <>
              {authMode === 'register' && (
                /* Registration Role Segmented Selector */
                <div className="space-y-3 mb-2">
                  <label className="block font-semibold text-slate-300">
                    Choose Account Type <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setRegisterRole('student')}
                      className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        registerRole === 'student'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('coaching_partner')}
                      className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        registerRole === 'coaching_partner'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Coaching / Institute</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Coaching Partner Registration */}
              {authMode === 'register' && registerRole === 'coaching_partner' ? (
                <div className="space-y-3 py-1">
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs leading-relaxed flex items-start gap-2.5">
                    <Building2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Coaching Partner B2B Registration</p>
                      <p className="text-[11px] text-indigo-300/90 mt-0.5 leading-relaxed">
                        Register your coaching institute for AI Bulk Paper Ingestion, 50+ Answer-sheet auto-splitting, and Instant Class Ledgers. Account requires Super Admin Himanshu's approval.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Institute / Coaching Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        placeholder="e.g. Apex Rankers Academy / Target CA Institute"
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Director / Teacher Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={directorName}
                          onChange={(e) => setDirectorName(e.target.value)}
                          placeholder="e.g. Prof. R. K. Sharma"
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Phone / WhatsApp <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={partnerPhone}
                          onChange={(e) => setPartnerPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Official Email <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="director@apexacademy.edu"
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        City / Location <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={instituteCity}
                        onChange={(e) => setInstituteCity(e.target.value)}
                        placeholder="e.g. Kota / Delhi / Jaipur"
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create login password..."
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Batch Size (Students/Mo)
                      </label>
                      <input
                        type="number"
                        value={estimatedStudents}
                        onChange={(e) => setEstimatedStudents(Number(e.target.value))}
                        min={10}
                        max={5000}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Watermark for Evaluated Copies (Optional)
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. APEX ACADEMY • CONFIDENTIAL OFFICIAL EVALUATION"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                /* Student Registration or Sign In */
                <>
                  {authMode === 'register' && (
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Student Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rohan Sharma / Priya Gupta"
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Academic Journey <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setTargetJourney('CLASS_12')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CLASS_12'
                                ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">12th Comm.</p>
                              <p className="text-[10px] text-slate-400 font-normal">CBSE</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CLASS_12_SCIENCE')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CLASS_12_SCIENCE'
                                ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">12th Science</p>
                              <p className="text-[10px] text-slate-400 font-normal">PCM/PCB</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CLASS_12_ARTS')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CLASS_12_ARTS'
                                ? 'bg-rose-600/20 border-rose-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Landmark className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">12th Arts</p>
                              <p className="text-[10px] text-slate-400 font-normal">Humanities</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CLASS_11_SCIENCE')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CLASS_11_SCIENCE'
                                ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Atom className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">11th Sci.</p>
                              <p className="text-[10px] text-slate-400 font-normal">PCM / PCB</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CLASS_11_COMMERCE')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CLASS_11_COMMERCE'
                                ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">11th Comm.</p>
                              <p className="text-[10px] text-slate-400 font-normal">Accounts / BST</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CLASS_11_ARTS')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CLASS_11_ARTS'
                                ? 'bg-rose-600/20 border-rose-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Landmark className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">11th Arts</p>
                              <p className="text-[10px] text-slate-400 font-normal">Humanities</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CA_FOUNDATION')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CA_FOUNDATION'
                                ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">CA Found.</p>
                              <p className="text-[10px] text-slate-400 font-normal">ICAI</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CA_INTERMEDIATE')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CA_INTERMEDIATE'
                                ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">CA Inter</p>
                              <p className="text-[10px] text-slate-400 font-normal">New Scheme</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CA_FINAL')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CA_FINAL'
                                ? 'bg-purple-800/30 border-purple-400 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">CA Final</p>
                              <p className="text-[10px] text-slate-400 font-normal">ICAI Pinnacle</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('NEET')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'NEET'
                                ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Stethoscope className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">NEET (UG)</p>
                              <p className="text-[10px] text-slate-400 font-normal">Medical</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('JEE')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'JEE'
                                ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">JEE (M&A)</p>
                              <p className="text-[10px] text-slate-400 font-normal">IIT Engg</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetJourney('CUET')}
                            className={`p-2 rounded-xl border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                              targetJourney === 'CUET'
                                ? 'bg-violet-600/20 border-violet-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Compass className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs truncate">CUET (UG)</p>
                              <p className="text-[10px] text-slate-400 font-normal">Central Univ</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            School / Coaching
                          </label>
                          <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            placeholder="e.g. DPS / Career Institute"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Roll Number / ID
                          </label>
                          <input
                            type="text"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            placeholder="e.g. 120448"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 ${
                authMode === 'guest'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                  : authMode === 'admin'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
              }`}
            >
              {authMode === 'guest' ? (
                <>
                  <Compass className="w-4 h-4" />
                  <span>{isLoading ? 'Starting Guest Session...' : 'Enter App as Guest (Instant)'}</span>
                </>
              ) : authMode === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Admin Key...' : 'Unlock Admin Command Console'}</span>
                </>
              ) : authMode === 'register' ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isLoading 
                      ? 'Submitting Application...' 
                      : registerRole === 'coaching_partner' 
                      ? 'Register Institute & Request Partner Approval' 
                      : 'Register Student & Request Access'}
                  </span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In to StudyMentor'}</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Install App Button for Guests & Onboarding Students */}
          <div className="pt-1">
            <button
              type="button"
              id="auth-install-pwa-btn"
              onClick={() => triggerPwaInstallPrompt()}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-700 hover:border-indigo-500 bg-slate-950/60 hover:bg-indigo-950/30 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>📱 Install App on Home Screen (Works in Guest Mode)</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
            <span>Protected with End-to-End Session Fingerprinting &amp; Device Lock</span>
            <button
              type="button"
              id="auth-secret-admin-trigger"
              onClick={() => {
                setAuthMode('admin');
                setError(null);
              }}
              className="p-1 text-slate-700 hover:text-amber-500 transition-colors cursor-pointer"
              title="Staff & Master Console Passkey"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
