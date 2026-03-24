'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LZString from 'lz-string';
import { Brief } from '@/lib/types';
import ResultsView from '@/components/ResultsView';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    try {
      const b = searchParams.get('b');
      if (!b) {
        setError("No brief data found in the URL.");
        return;
      }

      const decompressed = LZString.decompressFromEncodedURIComponent(b);
      if (!decompressed) {
        throw new Error("Invalid or corrupted link data.");
      }

      const parsed: Brief = JSON.parse(decompressed);
      setBrief(parsed);
    } catch (err) {
      console.error("Failed to parse brief from URL:", err);
      setError("Failed to load the brief from this link. It may be broken or corrupted.");
    }
  }, [searchParams]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto flex flex-col z-10 relative">
        {/* Header specifically for Client Mode */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#6EE7B7] uppercase tracking-[0.2em] backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4" />
              Client Mode Preview
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

        {error ? (
          <div className="glass-card p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
            <p className="text-white/60 mb-8">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#6EE7B7] text-[#0a0a0a] px-6 py-3 rounded-full font-bold focus:outline-none hover:shadow-[0_0_40px_-10px_#6EE7B7] transition-shadow"
            >
               Return to Home
            </button>
          </div>
        ) : brief ? (
          <ResultsView 
            brief={brief} 
            onBack={() => {}} 
            isShareMode={true} 
          />
        ) : (
          <div className="flex justify-center items-center py-32">
             <div className="w-8 h-8 rounded-full border-2 border-[#6EE7B7] border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
       <main className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
         <div className="w-8 h-8 rounded-full border-2 border-[#6EE7B7] border-t-transparent animate-spin" />
       </main>
    }>
      <ShareContent />
    </Suspense>
  );
}
