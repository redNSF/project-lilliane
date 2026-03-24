'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Link as LinkIcon, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PremiumVoiceInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onTranscript?: (text: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function PremiumVoiceInput({ value, onChange, onSend, onTranscript, disabled }: PremiumVoiceInputProps) {
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const valueRef = useRef(value);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            const currentVal = valueRef.current;
            const newText = currentVal ? `${currentVal} ${finalTranscript.trim()}` : finalTranscript.trim();
            onChange(newText);
          }
          setInterimText(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone permission denied.');
          } else if (event.error === 'no-speech') {
            // No-speech is normal if user pauses
          } else {
            setError(`Error: ${event.error}`);
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          // If we intentionally stopped it, or if it timed out but we want to stay active
          if (isRecordingRef.current) {
            try {
              recognition.start();
            } catch (e) {
               console.error('Failed to restart recognition', e);
            }
          }
        };

        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []); // Initialize once

  const toggleMic = () => {
    setError(null);
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsRecording(false);
      setInterimText('');
      if (onTranscript) onTranscript(valueRef.current);
    } else {
      try {
        if (recognitionRef.current) recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic start failed", err);
        setError('Failed to start mic.');
      }
    }
  };

  const handleSend = () => {
    // If there's interim text, append it before sending
    if (interimText.trim()) {
       const finalStr = value ? `${value} ${interimText.trim()}` : interimText.trim();
       onChange(finalStr);
       setInterimText('');
    }
    onSend();
  };

  // Ensure styles match perfectly
  const sharedTextStyles = "font-sans text-lg leading-relaxed tracking-wide whitespace-pre-wrap break-words";

  return (
    <div className="relative w-full rounded-[20px] transition-all duration-500 z-10">
      {/* Outer blurred glow when active */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-1 rounded-[24px] blur-[20px] pointer-events-none z-0"
            style={{
              background: 'linear-gradient(90deg, #6EE7B7, #34D399, #10B981)',
              backgroundSize: '200% auto',
              animation: 'gradient-pan 3s linear infinite',
            }}
          />
        )}
      </AnimatePresence>

      <div 
        className="relative w-full flex flex-col z-10 overflow-hidden shadow-[0_0_50px_-12px_rgba(110,231,183,0.1)]"
        style={{
          background: 'rgba(6, 40, 30, 0.95)',
          borderRadius: '20px',
        }}
      >
        {/* Animated Neon Gradient Border */}
        {isRecording && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-[20px] z-20"
            style={{
              padding: '2px', // border width
              background: 'linear-gradient(90deg, #6EE7B7, #34D399, #10B981)',
              backgroundSize: '200% auto',
              animation: 'gradient-pan 3s linear infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        {!isRecording && (
           <div className={`absolute inset-0 border rounded-[20px] pointer-events-none z-20 ${error ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'}`} />
        )}

        {/* Text Display / Input Area */}
        <div className="relative w-full min-h-[160px] max-h-[400px] overflow-y-auto">
          {/* Subtle Emerald Glow inside */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6EE7B7]/5 to-transparent pointer-events-none z-0" />
          {/* Visual Display layer */}
          <div 
            className={`absolute inset-0 p-6 pointer-events-none z-10 ${sharedTextStyles}`}
            style={{ color: 'transparent' }} 
            aria-hidden="true"
          >
            <span className="text-white opacity-100">{value}</span>
            {interimText && (
              <span className="text-white/55 ml-1">{interimText}</span>
            )}
            {/* Blinking emerald caret */}
            {(isRecording || (value.length === 0 && !error)) && (
              <span className="inline-block w-[3px] h-5 bg-[#6EE7B7] ml-1 rounded-sm animate-pulse align-middle" />
            )}
            
            {error && (
              <div className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 uppercase tracking-widest font-bold z-30 animate-pulse">
                {error}
              </div>
            )}
          </div>

          {/* Actual textarea for manual typing */}
          <textarea
            ref={textareaRef}
            className={`w-full h-full min-h-[160px] bg-transparent resize-none outline-none z-20 relative p-6 text-transparent caret-transparent ${sharedTextStyles}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={isRecording ? "" : error ? "Mic error. Please type instead..." : "Start speaking or type your idea here..."}
            style={{ 
               color: 'rgba(255,255,255,0.01)', 
               overflowWrap: 'break-word',
               wordWrap: 'break-word',
            }}
            spellCheck={false}
          />
        </div>

        {/* Bottom Toolbar */}
        <div className="relative z-30 flex items-center justify-between px-4 py-3 border-t border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#6EE7B7]/20" />
             <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Input Terminal</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Emerald pulsing dot when recording */}
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[10px] uppercase tracking-widest text-[#6EE7B7] font-bold">Listening</span>
                  <div className="w-2 h-2 rounded-full bg-[#6EE7B7] animate-pulseglow shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mic toggle (sliding pill) */}
            <button
              onClick={toggleMic}
              disabled={disabled}
              className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 border ${
                isRecording ? 'bg-[#6EE7B7]/20 border-[#6EE7B7]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <motion.div
                animate={{ x: isRecording ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                  isRecording ? 'bg-gradient-to-tr from-[#6EE7B7] to-[#34D399]' : 'bg-white/20'
                }`}
              >
                <Mic className="w-3 h-3 text-white" />
              </motion.div>
            </button>

            {/* Send button (emerald gradient circle) */}
            <button 
              onClick={handleSend}
              disabled={disabled || (!value.trim() && !interimText.trim())}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                !value.trim() && !interimText.trim() || disabled
                  ? 'bg-white/5 opacity-50 cursor-not-allowed text-white/40' 
                  : 'bg-gradient-to-tr from-[#6EE7B7] to-[#34D399] hover:shadow-[0_0_20px_#6EE7B7] hover:scale-105 active:scale-95 text-[#0a0a0a]'
              }`}
            >
              {disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global CSS for the animation */}
      <style>{`
        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pulseglow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .animate-pulseglow {
          animation: pulseglow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
