'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Key, Send, History, Trash2, Cpu } from 'lucide-react';
import StylePicker from '@/components/StylePicker';
import ResultsView from '@/components/ResultsView';
import SkeletonCard from '@/components/SkeletonCard';
import Toast from '@/components/Toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import PremiumVoiceInput from '@/components/PremiumVoiceInput';
import TextReveal from '@/components/TextReveal';
import { Brief, StyleType } from '@/lib/types';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [script, setScript] = useState('');
  const [style, setStyle] = useState<StyleType>('Commercial');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Brief | null>(null);
  const [history, setHistory] = useState<Brief[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    const savedKey = localStorage.getItem('motionbrief_key');
    if (savedKey) setApiKey(savedKey);

    const savedHistory = localStorage.getItem('motionbrief_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [script]);

  const saveToHistory = (brief: Brief) => {
    const newHistory = [brief, ...history.slice(0, 4)];
    setHistory(newHistory);
    localStorage.setItem('motionbrief_history', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please enter your Groq API key.');
      return;
    }
    if (!script.trim()) {
      setError('Please enter a script to generate a brief.');
      return;
    }

    setLoading(true);
    setError(null);
    localStorage.setItem('motionbrief_key', apiKey);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-groq-key': apiKey,
        },
        body: JSON.stringify({ script, style }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate');
      }

      const data = await response.json();
      const briefWithStyle = { ...data, style, createdAt: new Date().toISOString() };
      setResult(briefWithStyle);
      saveToHistory(briefWithStyle);
      
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (result) {
    return (
      <ResultsView 
        brief={result} 
        onBack={() => setResult(null)} 
        onRevise={(newBrief) => {
          setResult(newBrief);
          saveToHistory(newBrief);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        apiKey={apiKey}
      />
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#6EE7B7] uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Empowered by Llama 3.3
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05]">
            <span className="block overflow-hidden pb-2">
              <motion.span 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                className="block"
              >
                Turn your script
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#6EE7B7]"
              >
                into a motion brief.
              </motion.span>
            </span>
          </h1>
          
          <div className="h-20 mb-12">
            <TextReveal 
              text="Professional scene breakdowns, motion styles, and technical specs generated from your text in pure seconds."
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium"
              delay={0.4}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full space-y-8"
        >
          {/* API Key Field */}
          <div className="w-full relative group flex flex-col items-start gap-2">
            <div className="w-full relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#6EE7B7]/40 transition-colors pointer-events-none">
                <Key className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Enter Groq API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-white/5 rounded-2xl focus:border-[#6EE7B7]/30 focus:ring-1 focus:ring-[#6EE7B7]/20 outline-none transition-all placeholder:text-white/10 text-white"
              />
            </div>
            <a 
              href="https://console.groq.com/keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-white/40 hover:text-[#6EE7B7] transition-colors ml-2"
            >
              Get your free API key from Groq Console →
            </a>
          </div>

          {/* Style Picker */}
          <div className="w-full flex flex-col items-start gap-3">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-2">Choose Style</span>
            <StylePicker selected={style} onChange={setStyle} />
          </div>

          {/* Premium Voice Input / Script Area */}
          <div className="w-full mt-4">
            <PremiumVoiceInput 
              value={script}
              onChange={setScript}
              onSend={handleGenerate}
              onTranscript={(text) => setScript(text)}
              disabled={loading}
            />
          </div>
        </motion.div>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full mt-12 grid grid-cols-1 gap-6"
          >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </motion.div>
        )}

        {/* History Section */}
        {history.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 w-full"
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2 text-white/40">
                <History className="w-4 h-4" />
                <h2 className="text-xs font-bold uppercase tracking-widest">Recent Briefs</h2>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('motionbrief_history');
                  setHistory([]);
                }}
                className="text-white/20 hover:text-red-400 transition-colors text-xs"
              >
                Clear
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((brief, i) => (
                <button
                  key={i}
                  onClick={() => setResult(brief)}
                  className="glass-card p-4 text-left hover:border-[#6EE7B7]/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-[#6EE7B7]/60 font-medium">{brief.style}</span>
                    <span className="text-[10px] text-white/20">{new Date(brief.createdAt!).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#6EE7B7] transition-colors line-clamp-1">{brief.title}</h3>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Toast 
        message={error || ''} 
        isVisible={!!error} 
        onClose={() => setError(null)} 
      />
    </main>
  );
}
