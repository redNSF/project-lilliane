'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Brief } from '@/lib/types';
import ResultsView from '@/components/ResultsView';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Lock, Sparkles, ArrowLeft, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [metadata, setMetadata] = useState<any>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata();
  }, [id]);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scripts/${id}`);
      if (!res.ok) {
        throw new Error('Script not found or failed to load');
      }
      const data = await res.json();
      setMetadata(data);
      if (!data.has_password && data.content) {
        setBrief(data.content);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    setError(null);

    try {
      const res = await fetch(`/api/scripts/${id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Incorrect password');
      }

      const data = await res.json();
      setBrief(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUnlocking(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center gap-4">
        <AnimatedBackground />
        <Loader2 className="w-8 h-8 text-[#6EE7B7] animate-spin" />
        <p className="text-white/40 text-sm font-medium animate-pulse">Fetching brief...</p>
      </main>
    );
  }

  if (error && !metadata) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-6 relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="glass-card p-12 text-center max-w-md w-full relative z-10 border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/60 mb-8">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
          >
             Back to Safety
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto flex flex-col z-10 relative">
        <AnimatePresence mode="wait">
          {!brief && metadata?.has_password ? (
            <motion.div
              key="unlock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-12 max-w-md mx-auto w-full text-center"
            >
              <div className="w-16 h-16 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="w-8 h-8 text-[#6EE7B7]" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">Protected Brief</h1>
              <p className="text-white/40 text-sm mb-8">
                This script by <span className="text-white/80 font-bold">{metadata.author_name}</span> is password protected.
              </p>

              <form onSubmit={handleUnlock} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 px-1">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#6EE7B7]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs flex items-center gap-1 px-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="w-full py-4 bg-[#6EE7B7] text-[#0a0a0a] rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_#6EE7B7] transition-all disabled:opacity-50"
                >
                  {isUnlocking ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Unlock Brief
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : brief ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#6EE7B7] uppercase tracking-[0.2em] backdrop-blur-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    Shared by {metadata?.author_name || 'Anonymous'}
                  </motion.div>

                  <motion.button 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     onClick={() => router.push('/')}
                     className="flex items-center gap-2 text-[#6EE7B7]/60 hover:text-[#6EE7B7] transition-colors text-sm font-medium group"
                   >
                     Create your own 
                     <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
              </div>

              <ResultsView 
                brief={brief} 
                onBack={() => {}} 
                isShareMode={true} 
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
