'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  apiKey: string;
  onError: (msg: string) => void;
}

export default function VoiceRecorder({ onTranscript, apiKey, onError }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  // Audio Visualizer Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!apiKey) {
      onError('Please enter your Groq API key first to use voice typing.');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Set up Audio Context for visualizer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // Gives us 32 frequency bins
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const drawVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Siri-like animation logic: divide the frequency data into 4 bands for 4 blobs
        const bands = [
          (dataArray[0] + dataArray[1]) / 2, // Bass
          (dataArray[4] + dataArray[5]) / 2, // Low-mid
          (dataArray[12] + dataArray[13]) / 2, // Mid
          (dataArray[24] + dataArray[25]) / 2 // Treble
        ];
        
        barsRef.current.forEach((blob, i) => {
          if (blob && bands[i] !== undefined) {
            const value = bands[i];
            // Scale and stretch the blobs horizontally when volume spikes
            const scaleY = 0.5 + (value / 255) * 1.5;
            const scaleX = 1 + (value / 255) * 0.8;
            const opacity = 0.6 + (value / 255) * 0.4;
            
            blob.style.transform = `scale(${scaleX}, ${scaleY})`;
            blob.style.opacity = `${opacity}`;
          }
        });
        
        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
      };
      
      drawVisualizer();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio processing
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(console.error);
        }

        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handleTranscription(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Mic error:', err);
      onError('Microphone access denied or unavailable. Please check your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'x-groq-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Transcription failed');
      }

      const data = await response.json();
      if (data.text) {
        onTranscript(data.text);
      }
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'Error communicating with Groq Whisper API.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => !isTranscribing && !isRecording && startRecording()}
        disabled={isTranscribing || isRecording}
        className={`relative p-3 rounded-full flex items-center justify-center transition-all ${
          isTranscribing
            ? 'bg-[#6EE7B7]/10 text-[#6EE7B7] opacity-80 cursor-not-allowed'
            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
        }`}
        title="Record Script via Voice"
      >
        {isTranscribing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Voice Recognition Modal Overlay */}
      <AnimatePresence>
        {(isRecording || isTranscribing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-sm p-8 flex flex-col items-center gap-8 relative overflow-hidden shadow-2xl border-[#6EE7B7]/20"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#6EE7B7]/10 to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 text-[10px] font-bold text-[#6EE7B7] uppercase tracking-[0.1em] mb-4">
                  <Sparkles className="w-3 h-3" />
                  Groq Whisper AI
                </div>
                
                <h3 className="text-xl font-bold text-white">
                  {isTranscribing ? 'Transcribing...' : 'Listening...'}
                </h3>
                <p className="text-sm text-white/50">
                  {isTranscribing 
                    ? 'Converting your voice into a motion design script' 
                    : 'Speak your ideas clearly into the microphone'}
                </p>
              </div>

              {/* Visualizer Area */}
              <div className="relative z-10 flex items-center justify-center h-[120px] w-full overflow-hidden">
                {isRecording ? (
                  <div className="relative w-full h-full flex items-center justify-center filter blur-xl opacity-80 mix-blend-screen scale-150">
                    <style>{`
                      @keyframes siri-spin-1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                      @keyframes siri-spin-2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                    `}</style>
                    
                    {/* Blob 1 - Blue/Cyan */}
                    <div className="absolute flex items-center justify-center" style={{ animation: 'siri-spin-1 4s linear infinite' }}>
                      <div ref={el => { barsRef.current[0] = el; }} className="w-24 h-24 bg-blue-500 rounded-full mix-blend-screen transition-transform duration-75" />
                    </div>
                    {/* Blob 2 - Purple/Pink */}
                    <div className="absolute flex items-center justify-center" style={{ animation: 'siri-spin-2 5s linear infinite' }}>
                      <div ref={el => { barsRef.current[1] = el; }} className="w-28 h-20 bg-purple-500 rounded-[40%_60%_70%_30%] mix-blend-screen transition-transform duration-75" />
                    </div>
                    {/* Blob 3 - Pink/Orange */}
                    <div className="absolute flex items-center justify-center" style={{ animation: 'siri-spin-1 6s linear infinite' }}>
                      <div ref={el => { barsRef.current[2] = el; }} className="w-20 h-28 bg-pink-500 rounded-[60%_40%_30%_70%] mix-blend-screen transition-transform duration-75" />
                    </div>
                    {/* Blob 4 - Mint/Cyan */}
                    <div className="absolute flex items-center justify-center" style={{ animation: 'siri-spin-2 4.5s linear infinite' }}>
                      <div ref={el => { barsRef.current[3] = el; }} className="w-24 h-24 bg-cyan-400 rounded-[50%_50%_60%_40%] mix-blend-screen transition-transform duration-75" />
                    </div>
                  </div>
                ) : (
                  // Transcribing pulse animation
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-[#6EE7B7]/20 flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 text-[#6EE7B7] animate-spin" />
                  </motion.div>
                )}
              </div>

              {/* Stop Button */}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="relative z-10 flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all hover:scale-105 active:scale-95 group"
                >
                  <Square className="w-4 h-4 fill-current group-hover:animate-pulse" />
                  Finish Recording
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
