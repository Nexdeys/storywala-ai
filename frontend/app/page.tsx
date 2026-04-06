'use client'

import { motion } from 'framer-motion';
import { Sparkles, Play, Video, Smartphone, TrendingUp, Layers, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-mesh">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-8 backdrop-blur-xl bg-black/40 border-b border-white/5 sticky top-0 z-[100]">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Video size={20} className="text-white fill-white/20" />
          </div>
          <span className="text-2xl font-black font-outfit tracking-tighter">StoryWala <span className="text-blue-500 font-bold">AI</span></span>
        </div>
        <div className="hidden md:flex space-x-12 text-sm font-medium text-gray-400">
          {['Features', 'Marketplace', 'Pricing', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white hover:underline-offset-8 transition-all tracking-wide">{item}</a>
          ))}
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm font-semibold hover:text-blue-400 transition-colors">Sign In</Link>
          <Link href="/dashboard" className="glow-button !py-3 !px-7 font-bold text-sm tracking-tight flex items-center">
             Start Free <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-56 px-8 flex flex-col items-center text-center overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-1/4 -translate-y-1/2 left-1/4 w-[600px] h-[600px] bg-blue-600/30 blur-[200px] -z-10 rounded-full animate-pulse"></div>
         <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[150px] -z-10 rounded-full"></div>

         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
         >
           <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border-blue-500/20 text-xs font-bold text-blue-400 mb-10 tracking-[0.2em] uppercase">
             <Sparkles size={14} className="mr-2" />
             AI-Powered Video Synthesis
           </div>
           
           <h1 className="text-7xl md:text-9xl font-black leading-[0.95] tracking-tighter mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 max-w-5xl mx-auto drop-shadow-2xl">
             Create <span className="text-blue-500 italic">Viral</span> Story Videos in Seconds
           </h1>
           
           <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-inter font-light leading-relaxed mb-16 px-6">
             The only platform that builds production-grade 4K videos from a single prompt. Scripted, voiced, and directed by cutting-edge AI.
           </p>

           <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8 mb-24">
             <Link href="/dashboard" className="glow-button group">
                <span className="flex items-center text-xl tracking-tight">
                  Start Free (3 Videos) <Play size={20} className="ml-3 fill-white group-hover:scale-125 transition-transform" />
                </span>
             </Link>
             <button className="text-lg font-bold px-10 py-5 rounded-2xl glass-card hover:bg-white/10 transition-all border-white/5 hover:border-white/20">
               Watch Demo
             </button>
           </div>
         </motion.div>

         {/* 3. Demo Video Autoplay */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden glass-card p-2 border-white/10 shadow-2xl"
         >
            <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-gray-900 border border-white/10">
               {/* Video placeholder for now, would be the actual demo */}
               <video 
                 className="w-full h-full object-cover" 
                 autoPlay 
                 loop 
                 muted 
                 playsInline
                 src="https://cdn.pixabay.com/video/2023/10/26/186596-878142750_large.mp4" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
                  <div className="text-left">
                     <p className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-2">Live Preview</p>
                     <h3 className="text-3xl font-black">AI Orchestrated Cinematics</h3>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>

      {/* 4. Feature Section */}
      <section id="features" className="py-32 px-8 relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-5xl font-black mb-6">Built for <span className="text-blue-500">Creators</span></h2>
               <p className="text-gray-400 max-w-2xl mx-auto text-lg italic">Everything you need to dominate social media with zero editing skills.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { icon: <Smartphone />, title: "Vertical First", desc: "Optimized for Instagram Reels, TikTok, and YouTube Shorts." },
                 { icon: <Layers />, title: "Multi-Scene AI", desc: "Complex storytelling with dynamic transitions and coherent imagery." },
                 { icon: <TrendingUp />, title: "Viral Analytics", desc: "Predict engagement based on AI story structure." }
               ].map((feature, i) => (
                 <div key={i} className="glass-card p-10 rounded-[32px] border-white/5 hover:border-blue-500/30 transition-all group hover:-translate-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 p-4 group-hover:scale-110 transition-transform">
                       {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-500 font-inter leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Simplified Pricing Hook on Landing */}
      <section id="pricing" className="py-32 px-8">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-6xl font-black mb-20 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-400">Select Your <span className="italic">Plan</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { tier: "Starter", price: "499", detail: "5 Videos / mo" },
                 { tier: "Pro", price: "999", detail: "20 Videos / mo" },
                 { tier: "Elite", price: "1499", detail: "50 Videos / mo", popular: true },
                 { tier: "Agency", price: "1999", detail: "Unlimited Videos" }
               ].map((plan, i) => (
                 <div key={i} className={`relative glass-card p-8 rounded-[32px] border-white/5 transition-all group scale-100 h-full flex flex-col justify-between ${plan.popular ? 'border-blue-500/50 shadow-[0_0_80px_rgba(37,99,235,0.15)] ring-2 ring-blue-500 md:scale-110 z-10' : 'opacity-70 hover:opacity-100'}`}>
                    {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Most Popular</span>}
                    <div>
                       <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">{plan.tier}</p>
                       <div className="flex items-baseline justify-center mb-8">
                          <span className="text-2xl font-bold mr-1">₹</span>
                          <span className="text-6xl font-black">{plan.price}</span>
                          <span className="text-gray-500 text-sm italic ml-1">/mo</span>
                       </div>
                       <ul className="text-center space-y-4 mb-10 text-sm text-gray-400 font-inter">
                          <li className="flex items-center justify-center"><Check size={14} className="text-green-500 mr-2" /> {plan.detail}</li>
                          <li className="flex items-center justify-center"><Check size={14} className="text-green-500 mr-2" /> 4K Ultra HD Export</li>
                          <li className="flex items-center justify-center"><Check size={14} className="text-green-500 mr-2" /> No Watermark</li>
                       </ul>
                    </div>
                    <Link href="/dashboard" className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                       Get Started
                    </Link>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black/40 text-center relative overflow-hidden">
         <p className="text-gray-500 text-sm tracking-widest uppercase">&copy; 2026 StoryWala AI &bull; Premium Cinematic AI</p>
      </footer>
    </div>
  );
}
