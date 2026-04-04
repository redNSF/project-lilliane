'use client';

import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-32 pb-12 flex flex-col items-center gap-6 relative z-10"
    >
      <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex flex-col items-center gap-4">
        <a 
          href="https://github.com/redNSF/project-lilliane"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#6EE7B7]/30 hover:bg-[#6EE7B7]/5 transition-all duration-300"
        >
          <Github className="w-5 h-5 text-white/40 group-hover:text-[#6EE7B7] transition-colors" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] group-hover:text-[#6EE7B7]/60 transition-colors">Open Source</span>
            <span className="text-sm font-bold text-white group-hover:text-white transition-colors">View on GitHub</span>
          </div>
        </a>
        
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] text-white/20 font-medium uppercase tracking-[0.1em]">
            Built with <span className="text-[#6EE7B7]/40">Next.js</span> & <span className="text-[#6EE7B7]/40">Llama 3.3</span>
          </p>
          <p className="text-[10px] text-white/10 font-medium uppercase tracking-[0.05em]">
            &copy; {new Date().getFullYear()} redNSF
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
