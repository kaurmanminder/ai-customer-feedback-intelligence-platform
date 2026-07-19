'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, ScrollText, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-3xl relative z-10 my-8">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider mb-6 bg-slate-900/40 px-3.5 py-2 rounded-xl border border-slate-800/80 backdrop-blur-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
            <ScrollText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
            <p className="text-slate-400 text-xs">Last Updated: July 2026</p>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 max-h-[70vh] overflow-y-auto pr-6 scrollbar-thin">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              By registering an account or accessing the Feedback Loop platform (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              2. User Accounts and Registration
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              To use the Service, you must register a workspace and create an administrative account. You agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account password and session token.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              3. AI Analysis &amp; Data Processing
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              The Service uses advanced artificial intelligence algorithms, specifically powered by the Anthropic Claude model APIs, to process customer feedback. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1.5 pt-1">
              <li>Customer feedback texts submitted to the analyze routes are sent to Anthropic API services for evaluation.</li>
              <li>You must not submit personally identifiable information (PII) of customers without proper consent.</li>
              <li>AI analysis outputs (sentiments, themes, summaries) are provided for analytical purposes and do not represent professional legal or business counsel.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              4. Prohibited Conduct
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              You agree not to upload, post, or transmit any feedback that is unlawful, harmful, threatening, abusive, defamatory, or violates any third-party intellectual property rights. You will not attempt to reverse engineer, disrupt, or bypass the security boundaries of the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0" />
              5. Limitation of Liability
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              To the maximum extent permitted by law, Feedback Loop and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising directly or indirectly from your use of the Service.
            </p>
          </section>
        </div>

        {/* Simple text info */}
        <div className="text-center mt-6 text-[10px] text-slate-500 font-medium">
          If you have any questions regarding these terms, please contact support.
        </div>
      </div>
    </div>
  );
}
