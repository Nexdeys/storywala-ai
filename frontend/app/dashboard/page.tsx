'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Loader2, Play, Download, CheckCircle, 
  ArrowLeft, Send, Monitor, Edit3, RefreshCcw, 
  Lock, User as UserIcon, Type, Video as VideoIcon, 
  Save, Zap, Layout, Globe, Smartphone, Tablet
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [quality, setQuality] = useState('720p');
  const [platform, setPlatform] = useState('Shorts');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'brainstorming' | 'reviewing' | 'previewing' | 'awaiting-approval' | 'exporting' | 'completed' | 'failed'>('idle');
  const [story, setStory] = useState<any>(null);
  const [editedScenes, setEditedScenes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Voice Persona State
  const [voiceGender, setVoiceGender] = useState('FEMALE');
  const [voiceTone, setVoiceTone] = useState('neutral');
  const [voiceEmotion, setVoiceEmotion] = useState('medium');

  // Auth/Upgrade State
  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
     if (!localStorage.getItem('deviceId')) {
        localStorage.setItem('deviceId', Math.random().toString(36).substring(2, 15));
     }
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
      const res = await axios.post(`${API_BASE_URL}/stories/generate`, { prompt }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStory(res.data);
      setEditedScenes(res.data.scenes.map((s: any) => s.text));
      setStatus('reviewing');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Brainstorming failed');
      setStatus('failed');
    } finally { setLoading(false); }
  };

  const handlePreview = async () => {
    setLoading(true); setStatus('previewing');
    try {
      const res = await axios.post(`${API_BASE_URL}/stories/${story._id}/preview`, { 
        editedScenes,
        voiceSettings: { gender: voiceGender, tone: voiceTone, emotionLevel: voiceEmotion } 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStory(res.data);
      setStatus('awaiting-approval');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Preview failed');
      setStatus('failed');
    } finally { setLoading(false); }
  };

  const handleFinalExport = async () => {
    setLoading(true); setStatus('exporting');
    try {
      const res = await axios.post(`${API_BASE_URL}/stories/${story._id}/export`, { 
        quality, platform 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStory(res.data);
      // Refresh user count
      const userRes = await axios.get(`${API_BASE_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(userRes.data.user);
      localStorage.setItem('user', JSON.stringify(userRes.data.user));
      setStatus('completed');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Final export failed');
      setStatus('failed');
    } finally { setLoading(false); }
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
            <h1 className="text-4xl font-black font-outfit tracking-tight mb-2">Director's <span className="text-blue-500">View</span></h1>
            {user && (
               <p className="text-gray-500 font-inter text-sm flex items-center">
                  <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{3 - (user.videosGenerated || 0)} FREE VIDEOS LEFT</span>
               </p>
            )}
          </div>
          <button onClick={() => setShowAuth(true)} className="glass-card px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-white/5 transition-all outline-none">
             {user ? <UserIcon size={16} /> : <Lock size={16} />}
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'failed' ? (
              <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10 pt-20">
                <div className="flex gap-4 mb-4">
                   {['Sad Story 😢', 'Motivational 🔥', 'Emotional Mystery 🎭', 'Viral Facts 🌍'].map(t => (
                      <button key={t} onClick={() => setPrompt(`Write a ${t} prompt...`)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all font-outfit">{t}</button>
                   ))}
                </div>
                <div className="glass-card p-12 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
                   <div className="flex gap-2 mb-6">
                      {['ENGLISH', 'HINDI', 'HINGLISH'].map(l => (
                        <div key={l} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border border-blue-500/20">{l} SUPPORTED</div>
                      ))}
                   </div>
                   <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Describe your vision (Hindi, English, Hinglish)..." className="w-full bg-transparent border-none text-4xl font-outfit font-black focus:ring-0 placeholder:text-white/5 outline-none resize-none leading-tight" />
                   {error && <p className="mt-8 text-red-500 font-bold bg-red-500/10 p-4 rounded-2xl">{error}</p>}
                </div>
                <div className="flex justify-center">
                   <button onClick={handleBrainstorm} className="glow-button min-w-[320px] text-2xl font-black">
                     {loading ? <Loader2 className="animate-spin inline mr-3" /> : <Zap className="inline mr-3" />}
                     BRAINSTORM SCRIPT
                   </button>
                </div>
              </motion.div>
            ) : status === 'brainstorming' ? (
              <div key="b" className="flex flex-col items-center py-40">
                 <div className="w-20 h-20 border-4 border-t-blue-600 border-white/5 rounded-full animate-spin mb-10"></div>
                 <h2 className="text-4xl font-black">Storyboarding AI Logic...</h2>
              </div>
            ) : status === 'reviewing' ? (
              <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                 <h2 className="text-3xl font-black">Review & <span className="text-blue-500">Customize</span></h2>
                 
                 {/* Voice Panel */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Gender</label>
                       <div className="flex gap-2">
                          {['MALE', 'FEMALE'].map(g => (
                             <button key={g} onClick={() => setVoiceGender(g)} className={`flex-1 py-3 rounded-xl text-xs font-black ${voiceGender === g ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>{g}</button>
                          ))}
                       </div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Narration Style</label>
                       <select value={voiceTone} onChange={(e) => setVoiceTone(e.target.value)} className="w-full bg-transparent border-none text-xs font-bold focus:ring-0">
                          <option value="neutral">Natural</option>
                          <option value="dramatic">Dramatic</option>
                          <option value="funny">Funny</option>
                       </select>
                    </div>
                    <div className="glass-card p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Energy</label>
                       <div className="flex gap-2">
                          {['low', 'medium', 'high'].map(e => (
                             <button key={e} onClick={() => setVoiceEmotion(e)} className={`flex-1 py-3 rounded-xl text-[10px] font-black ${voiceEmotion === e ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>{e.toUpperCase()}</button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Scene List */}
                 <div className="space-y-4">
                    {story.scenes.map((s: any, i: number) => (
                       <div key={i} className="glass-card p-4 rounded-2xl flex gap-4">
                          <span className="text-blue-500 font-black text-xs">#{i+1}</span>
                          <textarea value={editedScenes[i]} onChange={(e) => { const n = [...editedScenes]; n[i] = e.target.value; setEditedScenes(n); }} className="bg-transparent border-none flex-1 text-sm focus:ring-0 resize-none" rows={1} />
                       </div>
                    ))}
                 </div>

                 <button onClick={handlePreview} className="w-full glow-button py-6 text-2xl font-black">
                    {loading ? <Loader2 className="animate-spin inline mr-3" /> : <VideoIcon className="inline mr-3" />}
                    GENERATE FAST PREVIEW (480P)
                 </button>
              </motion.div>
            ) : status === 'previewing' || status === 'exporting' ? (
              <div key="l" className="flex flex-col items-center py-40">
                 <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden mb-10"><motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-full h-full bg-blue-600" /></div>
                 <h2 className="text-4xl font-black">{status === 'previewing' ? 'Drafting Vision...' : 'Rendering 4K Master...'}</h2>
              </div>
            ) : status === 'awaiting-approval' ? (
               <motion.div key="approval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  <div className="aspect-video w-full rounded-[40px] overflow-hidden glass-card relative bg-black shadow-2xl">
                     <video src={`http://localhost:5000${story.videoUrl}`} controls autoPlay className="w-full h-full object-cover" />
                     <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase italic shadow-xl">LOW-RES PREVIEW</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="glass-card p-10 rounded-[40px] space-y-8">
                        <h3 className="text-2xl font-black">Export <span className="text-blue-500">Settings</span></h3>
                        <div>
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Target Platform</label>
                           <div className="grid grid-cols-3 gap-3">
                              {['Shorts', 'TikTok', 'YouTube'].map(p => (
                                 <button key={p} onClick={() => setPlatform(p)} className={`py-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${platform === p ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}>
                                    {p === 'YouTube' ? <Monitor size={20} /> : <Smartphone size={20} />}
                                    <span className="text-[10px] font-black mt-2">{p}</span>
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Output Quality</label>
                           <div className="flex gap-4">
                              {['720p', '1080p', '4K'].map(q => (
                                 <button key={q} onClick={() => setQuality(q)} className={`flex-1 py-4 rounded-2xl font-black text-xs ${quality === q ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>{q}</button>
                              ))}
                           </div>
                           <p className="text-[10px] text-gray-600 mt-4 italic">*1080p+ requires Pro Plan</p>
                        </div>
                     </div>
                     <div className="flex flex-col gap-4 justify-center">
                        <button onClick={handleFinalExport} className="glow-button py-8 text-3xl font-black">
                           {loading ? <Loader2 className="animate-spin inline mr-3" /> : <Zap className="inline mr-3" />}
                           FINALIZE MASTER
                        </button>
                        <button onClick={() => setStatus('reviewing')} className="glass-card py-6 rounded-3xl font-black text-gray-500 hover:text-white transition-all flex items-center justify-center"><Edit3 size={20} className="mr-3" /> GO BACK TO EDIT</button>
                     </div>
                  </div>
               </motion.div>
            ) : (
               <motion.div key="comp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pt-10 text-center">
                  <div className="aspect-video w-full rounded-[40px] overflow-hidden glass-card shadow-2xl mb-10"><video src={`http://localhost:5000${story.videoUrl}`} controls className="w-full h-full object-cover" /></div>
                  <div className="flex gap-4 max-w-xl mx-auto">
                     <button className="flex-[2] bg-white text-black py-6 rounded-3xl font-black text-2xl flex items-center justify-center hover:scale-105 transition-all"><Download size={28} className="mr-3" /> DOWNLOAD MP4</button>
                     <button onClick={() => setStatus('idle')} className="flex-1 glass-card py-6 rounded-3xl font-black hover:bg-white/10 transition-all">NEW VISION</button>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
