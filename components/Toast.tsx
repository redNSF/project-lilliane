'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 glass-card bg-red-950/20 border-red-500/30 px-4 py-3 min-w-[300px]"
        >
          <XCircle className="text-red-400 w-5 h-5" />
          <p className="text-sm font-medium text-red-200 flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-red-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
