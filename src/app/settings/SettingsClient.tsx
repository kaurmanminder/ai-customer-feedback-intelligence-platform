'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, User, Mail, Phone, Bell, CheckCircle2, Settings, Edit, Save, BookOpen, AlertCircle } from 'lucide-react';

interface SettingsClientProps {
  user: {
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: string;
    workspaceName: string;
    bio?: string;
  };
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();

  // Mode state
  const [isEditing, setIsEditing] = useState(false);

  // Form values state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber);
  const [workspaceName, setWorkspaceName] = useState(user.workspaceName === 'Acme Corp' ? '' : user.workspaceName);
  const [bio, setBio] = useState(user.bio || '');

  // Notifications State
  const [notifications, setNotifications] = useState(true);

  // Status message states
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber: phone,
          role: user.role,
          bio,
          workspaceName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile settings.');
      }

      setSaved(true);
      setIsEditing(false);
      
      // Force Next.js router refresh to update session elements across layout
      router.refresh();
      
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'An error occurred while saving profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden max-w-[100vw]">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="p-2 rounded-xl text-slate-400 hover:text-neon border border-slate-800 hover:border-neon/20 hover:bg-neon/5 transition-all duration-200"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-neon to-emerald-500 flex items-center justify-center shadow-md shadow-neon/10">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Feedback Loop</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="h-6 w-6 rounded-full bg-neon/20 text-neon font-bold text-xs flex items-center justify-center">
              {name.charAt(0)}
            </div>
            <p className="text-xs font-semibold text-slate-200">{name}</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-neon/20 bg-neon/5 text-neon text-xs mb-3 font-semibold">
            <Settings className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile & Preferences</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your identity, role access, and contact details stored on our server.</p>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
            <span>Profile settings successfully saved to MySQL database!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Menu Sidebar */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl bg-neon text-slate-950 shadow-md shadow-neon/10 text-left transition-all w-full">
              <User className="w-4.5 h-4.5" />
              <span>User Profile</span>
            </button>
          </div>

          {/* Details Card Panel */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-xl flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon to-transparent opacity-60" />
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white mb-0.5">Profile Information</h2>
                  <p className="text-[11px] text-slate-400">Personalize your credentials for feedback loop audits.</p>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-300 hover:text-neon border border-slate-850 hover:border-neon/20 hover:bg-neon/5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-200">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  )}
                </div>

                {/* Account Status (Static) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Account Status</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#deff9a] shrink-0 animate-pulse" />
                    <span className="text-sm font-semibold text-neon">{user.status}</span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-200">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium">{email}</span>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all font-mono"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-200">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium font-mono">{phone}</span>
                    </div>
                  )}
                </div>

                {/* Workspace Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Workspace</label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter workspace name..."
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-200">
                      <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium">{workspaceName || 'No workspace set'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Professional Bio</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all font-sans leading-relaxed resize-none"
                  />
                ) : (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-200 leading-relaxed text-sm italic">
                    <BookOpen className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                    <span>{bio || 'No professional bio added yet. Click Edit Profile to insert a bio.'}</span>
                  </div>
                )}
              </div>

              {/* Notification Preference Toggle */}
              <div className="border-t border-slate-800/60 pt-6 flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-neon/10 text-neon flex items-center justify-center shrink-0">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Push Notifications</h3>
                    <p className="text-[11px] text-slate-400">Receive alerts when negative sentiment reviews are analyzed.</p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications ? 'bg-neon' : 'bg-slate-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Action Buttons in edit mode */}
              {isEditing && (
                <div className="flex justify-end gap-3 mt-2 border-t border-slate-800/60 pt-5">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                      setEmail(user.email);
                      setPhone(user.phoneNumber);
                      setWorkspaceName(user.workspaceName === 'Acme Corp' ? '' : user.workspaceName);
                      setBio(user.bio || '');
                      setError(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-slate-950 bg-neon hover:bg-[#cff57d] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-neon/10 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
