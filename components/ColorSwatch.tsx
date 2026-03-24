'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorSwatchProps {
  hex: string;
}

export default function ColorSwatch({ hex }: ColorSwatchProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleCopy}
    >
      <div 
        className="w-6 h-6 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: hex }}
      />
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-white/10 rounded text-[10px] font-mono whitespace-nowrap z-10"
          >
            {copied ? 'COPIED!' : hex.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
