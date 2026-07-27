import React, { useState } from 'react';
import { UserProfile, Certificate, Badge } from '../types';
import {
  X,
  User,
  Shield,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle,
  Building,
  Mail,
  Zap,
  Flame,
  Globe,
  Edit3,
  Check,
  Download,
  ExternalLink
} from 'lucide-react';
import { getTranslation } from '../services/localization';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  certificates: Certificate[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  certificates,
  onUpdateUser,
  onViewCertificate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [org, setOrg] = useState(user.organization || 'Zalamati Global Academy');
  const [bio, setBio] = useState(user.bio || 'Passionate scholar pursuing autonomous AI agent engineering and open knowledge.');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const t = getTranslation(user.language);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({
      name,
      email,
      organization: org,
      bio,
      avatarUrl,
    });
    setIsEditing(false);
  };

  const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1820] border border-[#1b3a4a] text-white shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div className="relative h-36 bg-gradient-to-r from-cyan-900/60 via-teal-900/40 to-slate-900 border-b border-[#1b3a4a] p-6 flex items-end justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 translate-y-8">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl border-2 border-cyan-400 shadow-xl object-cover bg-slate-800"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-xs font-semibold text-cyan-300 backdrop-blur-xs cursor-pointer">
                  Select
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {name}
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                  {user.role}
                </span>
              </h2>
              <p className="text-xs text-[#82a3b2] flex items-center gap-2 mt-0.5">
                <Building className="w-3.5 h-3.5 text-teal-400" />
                <span>{org}</span>
                <span>•</span>
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{email}</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all flex items-center gap-1.5 shadow-md"
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? 'Done Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Edit Form Drawer if Editing */}
        {isEditing && (
          <div className="mt-12 mx-6 p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4 text-xs">
            <h3 className="font-bold text-cyan-300 uppercase tracking-wider text-xs">Update Profile Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Institution / Organization</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Choose Avatar Preset</label>
                <div className="flex items-center gap-2">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Avatar option"
                      referrerPolicy="no-referrer"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-9 h-9 rounded-xl cursor-pointer border-2 object-cover ${
                        avatarUrl === url ? 'border-cyan-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Academic Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-md"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

        {/* Profile Content Body */}
        <div className="p-6 pt-12 space-y-6">
          {/* Bio statement */}
          <div className="p-4 rounded-2xl bg-[#0e2029] border border-[#1c3c4d] text-xs text-[#8bb0c0] leading-relaxed">
            <span className="font-semibold text-cyan-300 block mb-0.5">Scholar Statement:</span>
            {user.bio || bio}
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t.totalXP}</span>
              </div>
              <div className="text-xl font-bold text-white">{user.xpPoints.toLocaleString()} XP</div>
              <div className="text-[10px] text-emerald-400">Level {user.level} Scholar</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>{t.streak}</span>
              </div>
              <div className="text-xl font-bold text-white">{user.streakDays} Days</div>
              <div className="text-[10px] text-rose-300">Active Study Streak</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <Award className="w-4 h-4 text-purple-400" />
                <span>{t.badgesUnlocked}</span>
              </div>
              <div className="text-xl font-bold text-white">{user.badges.length} Badges</div>
              <div className="text-[10px] text-purple-300">Mastery Unlocks</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{t.certificatesEarned}</span>
              </div>
              <div className="text-xl font-bold text-white">{certificates.length} Earned</div>
              <div className="text-[10px] text-cyan-300">Verified Credentials</div>
            </div>
          </div>

          {/* Unlocked Badges Locker */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Unlocked Honor Badges</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3.5 rounded-2xl bg-[#0d1e27] border border-[#1a3848] flex items-start gap-3 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="text-2xl p-2 rounded-xl bg-black/40 border border-white/5">{badge.icon}</div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <p className="text-[11px] text-[#789cae] leading-snug">{badge.description}</p>
                    <span className="text-[9px] text-cyan-400 block pt-0.5">Unlocked {badge.dateUnlocked}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earned Verified Certificates */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Verified Degrees & Certificates</span>
            </h3>

            {certificates.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0d1c24] border border-[#1a3644] text-center text-xs text-[#7193a2]">
                No certificates earned yet. Complete degree program modules and pass capstone evaluations to generate official credentials!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-[#0d1e27] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{cert.verificationId}</span>
                      <h4 className="text-xs font-bold text-white">{cert.courseTitle}</h4>
                      <p className="text-[10px] text-[#7193a2]">{cert.issuedDate} • Grade: {cert.score}%</p>
                    </div>
                    <button
                      onClick={() => onViewCertificate(cert)}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1b3a4a] bg-[#08131a] flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] text-cyan-300 text-xs font-semibold transition-all border border-cyan-500/20"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
