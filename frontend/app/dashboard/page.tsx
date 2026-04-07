'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [prompt, setPrompt] = useState('');
    const [credits, setCredits] = useState(5);
    const [loading, setLoading] = useState(false);
    const [script, setScript] = useState(null);

  const generateScript = async () => {
        setLoading(true);
        try {
                const res = await axios.post('https://storywala-ai-production.up.railway.app/api/stories/generate-text', { prompt });
                setScript(res.data.story.scriptText);
                setCredits(res.data.creditsLeft);
        } catch (e) { alert('Check your Gemini Key on Railway!'); }
        setLoading(false);
  };

  return (
        <div className="p-8 bg-black min-h-screen text-white">
              <div className="flex justify-between mb-8">
                      <h1 className="text-3xl font-black">STORYWALA AI</h1>
                      <div className="bg-blue-600 px-4 py-2 rounded-full font-bold">Credits: {credits}/5</divd
              </
              <texta
                        className="w-full h-40 bg-zinc-900 p-4 rounded-3xl mb-4" 
                placeholder="Enter your viral story prompt..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
              <button 
                        onClick={generateScript}
                        disabled={loading}
                        className="w-full bg-blue-600 py-6 rounded-3xl font-black text-2xl hover:bg-blue-500 transition-all"
                      >
                {loading ? 'GENERATING...' : 'BRAINSTORM SCRIPT'}
              </bubutto
          {script && (
                  <div className="mt-8 p-6 bg-zinc-900 rounded-3xl border border-blue-500/30">
                            <h2 className="text-xl font-bold mb-4">YOUR VIRAL SCRIPT:</h2>
                            <p className="whitespace-pre-wrap">{script}</
                  <>di
          
        </div>div>
  
}
</div>
