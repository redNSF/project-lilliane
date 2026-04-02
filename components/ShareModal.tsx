'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, User, Link as LinkIcon, Check, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { Brief } from '@/lib/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: Brief;
}

export default function ShareModal({ isOpen, onClose, brief }: ShareModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: brief.title,
          content: brief,
          author_name: authorName,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save script to database');
      }

      const { id } = await response.json();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setShareUrl(`${origin}/s/${id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-card p-8 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!shareUrl ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-[#6EE7B7]" />
                    Share Brief
                  </h2>
                  <p className="text-white/60 text-sm">
                    Sharing creates a permanent link. You can optionally add attribution and password protection.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 px-1">
                      Author Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        placeholder="Anonymous"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-[#6EE7B7]/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 px-1">
                      Set Password (Optional)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-[#6EE7B7]/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    {password && (
                      <p className="mt-2 text-[10px] text-[#6EE7B7]/60 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        Content will be fully encrypted in the database.
                      </p>
                    )}
                  </div>

                  {error && (
                     <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {error}
                     </div>
                  )}

                  <button
                    onClick={handleShare}
                    disabled={isSaving}
                    className="w-full py-4 bg-[#6EE7B7] text-[#0a0a0a] rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_#6EE7B7] transition-all disabled:opacity-50 disabled:shadow-none mt-4"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving to Cloud...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Create Share Link
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-[#6EE7B7]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Link Generated!</h2>
                <p className="text-white/60 text-sm mb-8">
                  Your script is now available online. Share the link below.
                </p>

                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/80 font-mono text-sm truncate">
                    {shareUrl}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-3 text-white transition-all"
                  >
                    {copied ? <Check className="w-5 h-5 text-[#6EE7B7]" /> : <LinkIcon className="w-5 h-5" />}
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="mt-8 text-white/40 hover:text-[#6EE7B7] text-sm font-medium transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
