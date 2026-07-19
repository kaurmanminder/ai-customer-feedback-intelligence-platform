'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Key, ArrowRight, ArrowLeft, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Stages: 1 (Request OTP), 2 (Verify OTP), 3 (Reset Password)
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!emailOrPhone.trim()) {
      setError('Please enter your email address or phone number.');
      return;
    }

    setLoading(true);

    // Simulate OTP sending to the email/phone
    setTimeout(() => {
      setLoading(false);
      setSuccess('A verification OTP has been sent successfully. (Use code: 123456)');
      setStage(2);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp !== '123456') {
      setError('Invalid OTP code. Please try again (use: 123456).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess('Identity verified. Please set a new password.');
      setStage(3);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password. Please try again.');
      }

      setSuccess('Password updated successfully! Redirecting to login...');
      
      setTimeout(() => {
        router.push('/login?reset=true');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Grid overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-sm mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>AI Customer Feedback Intelligence</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Feedback <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">Loop</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Securely recover your organization account
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />

          {/* Heading based on stage */}
          <h2 className="text-xl font-bold text-white mb-6">
            {stage === 1 && 'Forgot Password'}
            {stage === 2 && 'Enter Verification Code'}
            {stage === 3 && 'Create New Password'}
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STAGE 1: Request OTP */}
          {stage === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label htmlFor="emailOrPhone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="emailOrPhone"
                    type="text"
                    required
                    placeholder="admin@example.com or +15555551234"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                {loading ? 'Sending OTP...' : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STAGE 2: Input OTP */}
          {stage === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label htmlFor="otp" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-5 h-5" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-lg"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">Please enter the pre-seeded simulation code 123456</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                {loading ? 'Verifying...' : 'Verify OTP Code'}
              </button>
            </form>
          )}

          {/* STAGE 3: Reset Password */}
          {stage === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                {loading ? 'Saving...' : 'Reset & Save Password'}
              </button>
            </form>
          )}

          {/* Registration & Legal Links */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col gap-4">
            <div className="text-center text-xs text-slate-400">
              Remember your credentials?{' '}
              <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5 mt-1.5 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
