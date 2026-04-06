'use client'

import { motion } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, Zap, Target, Rocket, Award, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  { name: 'Starter', price: '499', icon: <Target className="text-gray-400" />, desc: 'For content creators starting out.', features: ['5 Videos / month', '720p HD Export', 'Community Support', 'Standard Rendering Speed'] },
  { name: 'Creator', price: '999', icon: <Zap className="text-blue-400" />, desc: 'For dedicated storytellers.', features: ['20 Videos / month', '1080p FHD Export', 'Priority Support', 'No Watermark', 'Fast Rendering'] },
  { name: 'Elite', price: '1499', icon: <Rocket className="text-indigo-400" />, desc: 'Most Popular for High Viral Gain.', features: ['50 Videos / month', '4K UHD Export', 'Direct Support Agent', 'Custom AI Voice Styling', 'Ultra-Fast Rendering'], highlight: true },
  { name: 'Agency', price: '1999', icon: <Award className="text-purple-400" />, desc: 'For massive scale dominance.', features: ['Unlimited Videos / month', '8K Export Ready', 'API Access', 'Dedicated Storyteller Assistant', 'Instant Rendering'] }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col bg-mesh">
      {/* Header */}
      <nav className="p-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-white transition group"><ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home</Link>
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black">S</div>
             <span className="font-black text-lg">StoryWala</span>
          </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[200px] -z-10 rounded-full animate-pulse"></div>
         <h1 className="text-7xl font-black font-outfit tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">Pick Your Path to <span className="italic text-blue-500">Virality</span></h1>
         <p className="text-xl text-gray-400 font-inter font-light max-w-2xl mx-auto italic mb-20 leading-relaxed px-6">Simple transparent pricing for every tier of storytelling. No hidden fees, no complexity. Just raw AI power.</p>

         <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {tiers.map((tier, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className={`relative glass-card p-10 rounded-[48px] border-white/5 flex flex-col justify-between transition-all group hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(37,99,235,0.1)] ${tier.highlight ? 'border-blue-500/50 ring-2 ring-blue-500 bg-blue-600/[0.03] scale-105 z-10' : 'opacity-80 hover:opacity-100'}`}
               >
                  {tier.highlight && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full border border-white/20 shadow-xl">RECOMMENDED FOR GROWTH</span>}
                  
                  <div className="mb-10">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center p-3 mb-8 group-hover:scale-110 transition-transform">
                        {tier.icon}
                     </div>
                     <h3 className="text-2xl font-black mb-3">{tier.name}</h3>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-6">{tier.desc}</p>
                     
                     <div className="flex items-baseline mb-12">
                        <span className="text-2xl font-bold translate-y-[-10px] mr-1">₹</span>
                        <span className="text-7xl font-black tracking-tighter">{tier.price}</span>
                        <span className="text-gray-500 text-sm ml-1 font-inter">/mo</span>
                     </div>

                     <div className="space-y-4">
                        {tier.features.map((feature, j) => (
                           <div key={j} className="flex items-center text-sm font-medium text-gray-400 transition-colors group-hover:text-white">
                              <div className={`mr-4 w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-gray-600'}`}>
                                 <Check size={12} />
                              </div>
                              {feature}
                           </div>
                        ))}
                     </div>
                  </div>

                  <Link href="/dashboard" className={`w-full py-5 rounded-3xl font-black text-xl tracking-tight transition-all flex items-center justify-center group/btn ${tier.highlight ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-500' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                     SELECT PLAN <ArrowRight size={20} className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
               </motion.div>
            ))}
         </div>

         {/* Trust Section */}
         <div className="max-w-4xl mx-auto flex justify-center items-center gap-20 py-20 opacity-30 grayscale saturate-0 hover:grayscale-0 hover:saturate-100 hover:opacity-100 transition-all duration-1000">
            <div className="flex items-center space-x-2 font-black text-2xl"><ShieldCheck size={28} /> SECURE</div>
            <div className="flex items-center space-x-2 font-black text-2xl"><Heart size={28} /> LOVED BY 10K+</div>
            <div className="text-2xl font-black">256-BIT SSL</div>
         </div>
      </div>

      <footer className="py-12 border-t border-white/5 bg-black/40 text-center">
         <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">StoryWala AI &copy; 2026. All plans subject to high usage limits.</p>
      </footer>
    </div>
  );
}
