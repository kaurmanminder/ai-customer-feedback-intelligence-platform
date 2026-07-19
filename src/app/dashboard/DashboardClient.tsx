'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  LogOut, 
  Filter, 
  Inbox, 
  Clock, 
  CornerDownRight, 
  ThumbsUp, 
  Settings
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface EditablePhoneProps {
  initialPhone: string;
  isHeader?: boolean;
}

function EditablePhone({ initialPhone, isHeader = false }: EditablePhoneProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(initialPhone);

  const handleSave = () => {
    setPhone(inputVal);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 mt-1">
        <input 
          type="tel"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:border-neon w-24 font-mono"
        />
        <button 
          onClick={handleSave}
          className="px-1.5 py-0.5 bg-neon hover:bg-[#cff57d] text-[9px] text-slate-950 font-bold rounded transition-all cursor-pointer"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${isHeader ? 'mt-0.5' : ''}`}>
      <span className={isHeader ? 'text-[10px] text-slate-400 font-mono font-medium' : 'text-sm font-medium font-mono text-slate-200'}>
        {phone}
      </span>
      <button 
        onClick={() => { setInputVal(phone); setEditing(true); }}
        className="text-slate-500 hover:text-slate-300 transition-colors"
        title="Edit phone number"
      >
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      </button>
    </div>
  );
}

// Theme styling map
const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  red: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', dot: 'bg-indigo-400' },
  gray: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', dot: 'bg-slate-400' }
};

interface ThemeItem {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

interface FeedbackThemeLink {
  confidence: number;
  theme: ThemeItem;
}

interface FeedbackItem {
  id: string;
  content: string;
  channel: string;
  sourceRef: string | null;
  customerLabel: string | null;
  sentiment: 'POS' | 'NEU' | 'NEG';
  sentimentScore: number;
  status: 'NEW' | 'REVIEWED' | 'ACTIONED';
  createdAt: string;
  themes: FeedbackThemeLink[];
}

interface DashboardClientProps {
  initialFeedbacks: FeedbackItem[];
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
    workspaceId: string;
    workspaceName: string;
    phoneNumber?: string;
  };
}

export default function DashboardClient({ initialFeedbacks, user }: DashboardClientProps) {
  const router = useRouter();
  
  // Application State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [newFeedbackChannel, setNewFeedbackChannel] = useState('Web');
  const [analyzing, setAnalyzing] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'ALL' | 'POS' | 'NEU' | 'NEG'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'NEW' | 'REVIEWED' | 'ACTIONED'>('ALL');
  
  // UI States
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show Toast Helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Perform Logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
        router.push('/');
        router.refresh();
      } else {
        showToast('Logout failed', 'error');
      }
    } catch {
      showToast('Error logging out', 'error');
    }
  };

  // Analyze Customer Feedback
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newFeedbackText,
          channel: newFeedbackChannel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze feedback.');
      }

      // Prepend newly analyzed feedback to state
      setFeedbacks(prev => [data, ...prev]);
      setNewFeedbackText('');
      showToast('AI feedback analysis completed and saved successfully!');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Error occurred while calling AI API.';
      showToast(errorMessage, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Filter & Search Logic
  const filteredFeedbacks = feedbacks.filter(fb => {
    // Search match (content, channel, summary or theme names)
    const matchesSearch = 
      fb.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.customerLabel && fb.customerLabel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      fb.themes.some(t => t.theme.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sentiment match
    const matchesSentiment = selectedSentiment === 'ALL' || fb.sentiment === selectedSentiment;

    // Status match
    const matchesStatus = selectedStatus === 'ALL' || fb.status === selectedStatus;

    return matchesSearch && matchesSentiment && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = feedbacks.length;
  const positiveCount = feedbacks.filter(f => f.sentiment === 'POS').length;
  const neutralCount = feedbacks.filter(f => f.sentiment === 'NEU').length;
  const negativeCount = feedbacks.filter(f => f.sentiment === 'NEG').length;
  
  const positivePercentage = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;
  const pendingCount = feedbacks.filter(f => f.status === 'NEW').length;

  // Prepare chart data for Recharts
  const chartData = [
    { name: 'Positive', value: positiveCount, color: '#10B981' },
    { name: 'Neutral', value: neutralCount, color: '#EAB308' },
    { name: 'Negative', value: negativeCount, color: '#F43F5E' },
  ].filter(item => item.value > 0); // Only render categories with items

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3.5 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-slate-900 border-emerald-500/30 text-emerald-300' 
            : 'bg-slate-900 border-rose-500/30 text-rose-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-neon to-emerald-500 flex items-center justify-center shadow-md shadow-neon/10">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Feedback Loop</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Settings Link */}
            <Link 
              href="/settings"
              className="p-2 rounded-xl text-slate-400 hover:text-neon border border-slate-800 hover:border-neon/20 hover:bg-neon/5 transition-all duration-200 cursor-pointer"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="h-6 w-6 rounded-full bg-neon/20 text-neon font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                <EditablePhone initialPhone={user.phoneNumber || '+15555551234'} isHeader={true} />
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 hover:bg-rose-500/5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col gap-8">
        
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Customer Feedback Intelligence
          </h1>
        </div>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total feedbacks */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:border-slate-700/60 transition-all duration-200 group relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-40 transition-all duration-300" />
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Feedback</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{totalCount}</span>
              <span className="text-xs font-medium text-slate-500">entries recorded</span>
            </div>
          </div>

          {/* Card 2: Positive Sentiment % */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:border-slate-700/60 transition-all duration-200 group relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-40 transition-all duration-300" />
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Positive Sentiment</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{positivePercentage}%</span>
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
                <ThumbsUp className="w-3 h-3" /> POS: {positiveCount}
              </span>
            </div>
          </div>

          {/* Card 3: Pending Reviews */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:border-slate-700/60 transition-all duration-200 group relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-40 transition-all duration-300" />
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Action</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{pendingCount}</span>
              <span className="text-xs font-medium text-amber-500">awaiting review</span>
            </div>
          </div>
        </section>

        {/* Dashboard Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Feedback list and search/filters (Spans 2 columns) */}
          <section className="lg:col-span-2 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Filter and Search Panel */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Inbox className="w-4 text-neon" />
                  Feedback Repository ({filteredFeedbacks.length})
                </h3>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search content, channel, themes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all"
                  />
                </div>
              </div>

              {/* Advanced Filter Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-900">
                {/* Sentiment filters */}
                <div className="flex bg-slate-950/60 border border-slate-850 p-1 rounded-xl items-center text-xs">
                  <span className="px-2 text-[10px] uppercase font-bold text-slate-500 border-r border-slate-900 mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Sentiment
                  </span>
                  <button
                    onClick={() => setSelectedSentiment('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedSentiment === 'ALL' 
                        ? 'bg-neon text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedSentiment('POS')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      selectedSentiment === 'POS' 
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold' 
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    Positive
                  </button>
                  <button
                    onClick={() => setSelectedSentiment('NEU')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      selectedSentiment === 'NEU' 
                        ? 'bg-amber-500/20 text-amber-400 font-semibold' 
                        : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    Neutral
                  </button>
                  <button
                    onClick={() => setSelectedSentiment('NEG')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      selectedSentiment === 'NEG' 
                        ? 'bg-rose-500/20 text-rose-400 font-semibold' 
                        : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    Negative
                  </button>
                </div>

                {/* Status filters */}
                <div className="flex bg-slate-950/60 border border-slate-850 p-1 rounded-xl items-center text-xs">
                  <span className="px-2 text-[10px] uppercase font-bold text-slate-500 border-r border-slate-900 mr-1">Status</span>
                  <button
                    onClick={() => setSelectedStatus('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedStatus === 'ALL' 
                        ? 'bg-neon text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedStatus('NEW')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedStatus === 'NEW' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-slate-400 hover:text-blue-400'
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setSelectedStatus('REVIEWED')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedStatus === 'REVIEWED' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'text-slate-400 hover:text-purple-400'
                    }`}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => setSelectedStatus('ACTIONED')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedStatus === 'ACTIONED' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    Actioned
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback Cards List */}
            <div className="flex flex-col gap-4">
              {filteredFeedbacks.length === 0 ? (
                <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Inbox className="w-8 h-8 text-slate-600" />
                  <div>
                    <h4 className="font-semibold text-slate-300">No feedbacks found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">No items match your active filters and search queries. Try modifying your criteria or adding new feedback.</p>
                  </div>
                </div>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <div 
                    key={fb.id} 
                    className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-6 shadow-md transition-all duration-200 flex flex-col gap-4 relative overflow-hidden group"
                  >
                    {/* Top strip colored by sentiment */}
                    <div className={`absolute top-0 left-0 w-full h-[3px] ${
                      fb.sentiment === 'POS' ? 'bg-emerald-500' :
                      fb.sentiment === 'NEG' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />

                    {/* Feedback Header Info */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Sentiment badge */}
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          fb.sentiment === 'POS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          fb.sentiment === 'NEG' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {fb.sentiment === 'POS' ? 'Positive' : fb.sentiment === 'NEG' ? 'Negative' : 'Neutral'} 
                          <span className="opacity-70 ml-1">({Math.round(fb.sentimentScore * 100)}%)</span>
                        </span>

                        {/* Channel Badge */}
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-400 bg-slate-950/60 border border-slate-800/80">
                          {fb.channel}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          fb.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          fb.status === 'REVIEWED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {fb.status}
                        </span>
                      </div>

                      {/* Date */}
                      <span suppressHydrationWarning={true} className="text-[10px] text-slate-500 font-medium shrink-0">
                        {new Date(fb.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Original Feedback Content */}
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal italic">
                      &quot;{fb.content}&quot;
                    </p>

                    {/* AI Analysis section (Summary) */}
                    {fb.customerLabel && (
                      <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-850 mt-1 flex items-start gap-2.5">
                        <div className="mt-1 shrink-0">
                          <CornerDownRight className="w-3.5 h-3.5 text-neon" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-neon tracking-wider block mb-0.5">AI Summary</span>
                          <p className="text-slate-200 text-xs font-medium leading-relaxed">
                            {fb.customerLabel}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Themes list */}
                    {fb.themes && fb.themes.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                        {fb.themes.map((ft, idx) => {
                          const customStyle = colorMap[ft.theme.color] || colorMap.gray;
                          return (
                            <span 
                              key={idx} 
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${customStyle.bg} ${customStyle.text} ${customStyle.border}`}
                              title={ft.theme.description || undefined}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${customStyle.dot}`} />
                              {ft.theme.name}
                              <span className="opacity-60 text-[10px]">{(ft.confidence * 100).toFixed(0)}%</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* RIGHT SIDE: Sentiment breakdown chart & "Analyze with AI" text area */}
          <section className="flex flex-col gap-6 order-1 lg:order-2">
            
            {/* AI Analyzer Panel */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon to-emerald-400" />
              
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon animate-pulse" />
                Real-Time AI Analyzer
              </h3>

              <form onSubmit={handleAnalyze} className="space-y-4">
                {/* Channel selection */}
                <div>
                  <label htmlFor="channel" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Feedback Channel
                  </label>
                  <select
                    value={newFeedbackChannel}
                    onChange={(e) => setNewFeedbackChannel(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon/50"
                  >
                    <option value="Web">Web</option>
                    <option value="Email">Email</option>
                    <option value="Slack">Slack</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Intercom">Intercom</option>
                  </select>
                </div>

                {/* Feedback content input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Feedback Text
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter customer feedback text..."
                    value={newFeedbackText}
                    onChange={(e) => setNewFeedbackText(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-neon/50 focus:border-neon transition-all font-sans leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={analyzing || !newFeedbackText.trim()}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-neon hover:bg-[#cff57d] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-neon/10 mt-1"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Analyzing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sentiment Breakdown Chart */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neon" />
                Sentiment Breakdown
              </h3>
              
              <div className="h-[210px] w-full flex items-center justify-center">
                {mounted ? (
                  totalCount > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="48%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#f8fafc',
                            fontSize: '11px'
                          }} 
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => <span className="text-[10px] font-semibold text-slate-400">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-500 text-xs flex flex-col gap-1.5 items-center">
                      <BarChart3 className="w-6 h-6 text-slate-700" />
                      <span>No sentiment data loaded</span>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col gap-2 items-center text-slate-500 text-xs">
                    <svg className="animate-spin h-5 w-5 text-neon" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Loading visualization...</span>
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>

      </main>
    </div>
  );
}
