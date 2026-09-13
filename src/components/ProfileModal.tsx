import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Check, 
  Target, 
  Mail, 
  School, 
  Sparkles,
  Award,
  Sliders,
  CheckCircle2,
  LogOut,
  KeyRound
} from 'lucide-react';
import { UserProfile, AcademicJourney } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  onSelectProfile: (profileId: string) => void;
  onSaveProfile: (profile: UserProfile) => void;
  onSwitchAccount?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onSaveProfile,
  onSwitchAccount
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSavedBanner, setIsSavedBanner] = useState(false);

  // Form state
  const [name, setName] = useState(activeProfile?.name || 'Himanshu Chawla');
  const [email, setEmail] = useState(activeProfile?.email || 'admin@studymentor.edu');
  const [rollNumber, setRollNumber] = useState(activeProfile?.rollNumber || 'CBSE-12089');
  const [targetJourney, setTargetJourney] = useState<AcademicJourney>(activeProfile?.targetJourney || 'CLASS_12');
  const [institution, setInstitution] = useState(activeProfile?.institution || 'Delhi Public School / ICAI Portal');
  const [targetScore, setTargetScore] = useState(activeProfile?.targetScorePercentage || 95);
  const [hasInspectorPrivilege, setHasInspectorPrivilege] = useState<boolean>(activeProfile?.hasInspectorPrivilege ?? true);
  const [bio, setBio] = useState(activeProfile?.bio || 'Class 12 CBSE Commerce & CA Foundation Dual Aspirant. Aiming for All India Rank.');

  if (!isOpen || !activeProfile) return null;

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedProfile: UserProfile = {
      ...activeProfile,
      name: name.trim(),
      email: email.trim(),
      rollNumber: rollNumber.trim() || undefined,
      targetJourney,
      institution: institution.trim() || undefined,
      targetScorePercentage: Number(targetScore) || 95,
      hasInspectorPrivilege,
      bio: bio.trim() || undefined,
    };

    onSaveProfile(updatedProfile);
    setIsEditing(false);
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-base">
              {name.charAt(0) || 'H'}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{name}</span>
                {hasInspectorPrivilege && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                    Admin / Inspect Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Personal Academic Workspace &amp; Examiner Privileges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-slate-900 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {isSavedBanner && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details &amp; examiner settings saved successfully!</span>
            </div>
          )}

          {/* Overview View */}
          {!isEditing && (
            <div className="space-y-4">
              
              {/* Account Summary Card */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Account Profile
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Full Name</span>
                    <span className="font-bold text-slate-900">{name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Account Status</span>
                    <span className="font-bold text-slate-900">
                      {email === 'himanshu@studymentor.edu'
                        ? 'Master Admin (Verified)'
                        : email.includes('@guest.studymentor.edu')
                        ? 'Guest Explorer'
                        : email}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Target Exam</span>
                    <span className="font-bold text-slate-900">
                      {targetJourney === 'CLASS_12' ? 'Class 12 Commerce' : targetJourney === 'CLASS_12_SCIENCE' ? 'Class 12 Science' : targetJourney === 'CLASS_12_ARTS' ? 'Class 12 Arts' : targetJourney === 'CLASS_11_SCIENCE' ? 'Class 11 Science' : targetJourney === 'CLASS_11_COMMERCE' ? 'Class 11 Commerce' : targetJourney === 'CLASS_11_ARTS' ? 'Class 11 Arts' : targetJourney === 'CA_FOUNDATION' ? 'CA Foundation' : targetJourney === 'CA_INTERMEDIATE' ? 'CA Intermediate' : targetJourney === 'CA_FINAL' ? 'CA Final' : targetJourney === 'NEET' ? 'NEET (UG)' : targetJourney === 'JEE' ? 'JEE' : 'CUET (UG)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Roll / Reg No</span>
                    <span className="font-bold text-slate-900">{rollNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">School / Institute</span>
                    <span className="font-bold text-slate-900">{institution || 'Self Study / ICAI'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Target Goal</span>
                    <span className="font-black text-indigo-600 font-mono">{targetScore}%</span>
                  </div>
                </div>

                {bio && (
                  <p className="text-xs text-gray-600 pt-2 border-t border-gray-200 leading-relaxed italic">
                    "{bio}"
                  </p>
                )}
              </div>

              {/* Special Inspect Privileges Card */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                      Examiner Inspect Option
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    Enabled for You
                  </span>
                </div>
                <p className="text-xs text-indigo-950/80 leading-relaxed">
                  Aapki profile ke liye direct <strong>"Inspect &amp; Gradebook"</strong> option enable hai. Aap navbar se kisi bhi waqt batch gradebook, marking rubrics, aur deep evaluation telemetry inspect kar sakte hain.
                </p>
              </div>

            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-sm font-black text-slate-900">
                  Edit Profile Details
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-500 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Target Journey & Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exam Focus
                  </label>
                  <select
                    value={targetJourney}
                    onChange={(e) => setTargetJourney(e.target.value as AcademicJourney)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium bg-white"
                  >
                    <option value="CLASS_12">Class 12 Commerce (CBSE Board)</option>
                    <option value="CLASS_12_SCIENCE">Class 12 Science (CBSE Board)</option>
                    <option value="CLASS_12_ARTS">Class 12 Arts / Humanities (CBSE Board)</option>
                    <option value="CLASS_11_SCIENCE">Class 11 Science (CBSE Board)</option>
                    <option value="CLASS_11_COMMERCE">Class 11 Commerce (CBSE Board)</option>
                    <option value="CLASS_11_ARTS">Class 11 Arts / Humanities (CBSE Board)</option>
                    <option value="CA_FOUNDATION">CA Foundation (ICAI)</option>
                    <option value="CA_INTERMEDIATE">CA Intermediate (ICAI New Scheme)</option>
                    <option value="CA_FINAL">CA Final (ICAI New Scheme)</option>
                    <option value="NEET">NEET (UG) Medical Entrance</option>
                    <option value="JEE">JEE (Main & Advanced) Engineering</option>
                    <option value="CUET">CUET (UG) Central Universities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Roll / Reg Number
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Institution & Target Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    School / Institute
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Score Goal (%)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Inspect Privilege Toggle */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    Show "Inspect &amp; Gradebook" Option in Navbar
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Allows you to inspect all submissions and rubric controls.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasInspectorPrivilege}
                  onChange={(e) => setHasInspectorPrivilege(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bio / Notes
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-slate-900 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>Profile: <strong>{name}</strong></span>
            {onSwitchAccount && (
              <button
                type="button"
                id="profile-modal-logout-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                  onSwitchAccount();
                }}
                className="ml-2 text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 px-3 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Log Out</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
