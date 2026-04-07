'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Loader2, Play, Download, CheckCircle, 
  ArrowLeft, Send, Monitor, Edit3, RefreshCcw, 
  Lock, User as UserIcon, Type, Video as VideoIcon, 
  Save, Zap, Layout, Globe, Smartphone, Tablet, Copy, DownloadCloud
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const API_BASE_URL = 'https://storywala-ai-production.up.railway.app/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  
  // Budget Controllers
  const [tone, setTone] = useState('Viral');
  const [length, setLength] = useState('short');
  const [language, setLanguage] = useState('English');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'brainstorming' | 'reviewing' | 'previewing' | 'awaiting-approval' | 'exporting' | 'completed' | 'failed'>('idle');
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
     const savedToken = localStorage.getItem('token');
     const savedUser = localStorage.getItem('user');
     if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
     }
  }, []);

  const handleBrainstorm = async () => {
    if (!token) { setShowAuth(true); return; }
    setLoading(true); setStatus('brainstorming'); setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/stories/generate`, { 
        prompt, tone, language, length 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStory(res.data.story);
      setUser({ ...user, usageCredits: res.data.creditsLeft });
      setStatus('reviewing');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Brainstorming failed');
      setStatus('failed');
    } finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(story.scriptText || '');
    alert('Script copied to clipboard! 📋');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - Small */}
      <div className="w-20 border-r border-white/5 flex flex-col items-center py-10 space-y-10 bg-black/50 backdrop-blur-xl shrink-0">
        <Link href="/" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg"><Sparkles size={18} /></Link>
        <div className="flex flex-col space-y-8 text-gray-500">
           <Link href="/dashboard" className="text-white hover:text-white transition"><Monitor size={22} /></Link>
           <Lock size={22} className="opacity-20" />
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto relative bg-mesh">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black font-outfit tracking-tight mb-2">StoryWala <span className="text-blue-500">Editor</span></h1>
            {user && (
               <div className="flex items-center gap-4">
                  <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Credits left: {user.usageCredits}/5 Today</span>
                  <button onClick={() => setShowUpgrade(true)} className="text-[10px] font-black text-blue-500 underline uppercase tracking-widest hover:text-blue-400 transition">UPGRADE</button>
               </div>
            )}
          </div>
          <button onClick={() => setShowAuth(true)} className="glass-card px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-white/5 transition-all outline-none">
             {user ? <UserIcon size={16} /> : <Lock size={16} />}
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'failed' ? (
              <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10 pt-10">
                
                {/* Prompt Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Tone & Vibe</label>
                       <div className="flex gap-2">
                          {['Viral', 'Dramatic', 'Fast'].map(t => (
                             <button key={t} onClick={() => setTone(t)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition-all ${tone === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>{t.toUpperCase()}</button>
                          ))}
                       </div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Script Length (Token Saver 💸)</label>
                       <div className="flex gap-2">
                          {['short', 'medium'].map(l => (
                             <button key={l} onClick={() => setLength(l)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition-all ${length === l ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>{l.toUpperCase()}</button>
                          ))}
                       </div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Target Language</label>
                       <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-[10px] font-black outline-none tracking-widest uppercase">
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Hinglish">Hinglish</option>
                       </select>
                    </div>
                </div>

                <div className="glass-card p-12 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden bg-black/40">
                   <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Describe your vision (Hindi, English, Hinglish)..." className="w-full bg-transparent border-none text-3xl font-outfit font-black focus:ring-0 placeholder:text-white/5 outline-none resize-none leading-tight" />
                   {error && <p className="mt-8 text-red-500 font-bold bg-red-500/10 p-4 rounded-2xl border border-red-500/20">{error}</p>}
                </div>

                <div className="flex justify-center">
                   <button onClick={handleBrainstorm} className="glow-button min-w-[320px] text-2xl font-black py-8 rounded-3xl">
                     {loading ? <Loader2 className="animate-spin inline mr-3" /> : <Zap className="inline mr-3 shadow-glow" />}
                     GENERATE VIRAL SCRIPT
                   </button>
                </div>
              </motion.div>
            ) : status === 'brainstorming' ? (
              <div key="b" className="flex flex-col items-center py-40">
                 <div className="w-20 h-20 border-4 border-t-blue-600 border-white/5 rounded-full animate-spin mb-10 shadow-[0_0_40px_rgba(59,130,246,0.3)]"></div>
                 <h2 className="text-4xl font-black tracking-tighter font-outfit">Optimizing Tokens & Logic...</h2>
              </div>
            ) : (
               <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pt-10">
                  <div className="flex justify-between items-end">
                    <h2 className="text-5xl font-black tracking-tighter">Your <span className="text-blue-500">Masterpiece.</span></h2>
                    <div className="flex gap-2">
                       <button onClick={copyToClipboard} className="glass-card p-4 rounded-2xl hover:bg-blue-600/20 hover:text-blue-400 transition-all flex items-center gap-2 text-[10px] font-black uppercase"><Copy size={16}/> Copy Script</button>
                       <button className="glass-card p-4 rounded-2xl hover:bg-indigo-600/20 hover:text-indigo-400 transition-all flex items-center gap-2 text-[10px] font-black uppercase"><DownloadCloud size={16}/> Save Draft</button>
                    </div>
                  </div>

                  <div className="glass-card p-12 rounded-[50px] bg-gradient-to-br from-white/5 to-transparent border-white/10 shadow-2xl relative">
                     <div className="absolute top-8 right-8 bg-blue-600/10 text-blue-500 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-500/20">Verified Output</div>
                     <p className="text-3xl font-inter font-light leading-relaxed whitespace-pre-wrap">{story.scriptText}</p>
                  </div>

                  <div className="flex flex-col gap-4 max-w-xl mx-auto pt-10">
                     <button onClick={() => setStatus('idle')} className="w-full bg-white text-black py-8 rounded-[30px] font-black text-2xl flex items-center justify-center hover:scale-[1.02] transition-all shadow-glow"><RefreshCcw className="mr-3" /> REGENERATE WITH VARIATION</button>
                     <p className="text-[10px] text-gray-500 text-center uppercase font-black tracking-widest opacity-50">Regeneration uses 1 Credit</p>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
        {['5 Free requests / day', 'Daily reset', 'Cache storage active'].map(i => (
           <span key={i} className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">{i}</span>
        ))}
      </div>
    </div>
  );
}
