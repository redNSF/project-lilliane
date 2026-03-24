'use client';

import { Brief } from '@/lib/types';
import { motion } from 'framer-motion';
import { Copy, Check, Download, ArrowLeft, Share2, Sparkles, Send, Cpu, AlertCircle, Printer, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import LZString from 'lz-string';
import SceneCard from './SceneCard';
import MagneticButton from './MagneticButton';

interface ResultsViewProps {
  brief: Brief;
  onBack: () => void;
  isShareMode?: boolean;
  onRevise?: (newBrief: Brief) => void;
  apiKey?: string;
}

export default function ResultsView({ brief, onBack, isShareMode = false, onRevise, apiKey }: ResultsViewProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'brief' | 'storyboard'>('brief');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [revisionError, setRevisionError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea for revisions
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [revisionNotes]);

  const generateMarkdown = () => {
    return `
# Motion Design Brief: ${brief.title}
**Total Duration:** ${brief.totalDuration}
**Overall Mood:** ${brief.overallMood}
**Style:** ${brief.style}

${brief.scenes.map(s => `
## Scene ${s.id}: ${s.name}
- **Timecode:** ${s.timecode} (${s.duration})
- **Script:** "${s.scriptExcerpt}"
- **Motion Style:** ${s.motionStyle}
- **Color Palette:** ${(s.colorHex || []).join(', ')} (${s.colorDescription})
- **Text Overlay:** ${s.textOverlay || 'None'}
- **Assets:** ${(s.assets || []).join(', ')}
- **Transition:** ${s.transition}
- **Audio Mood:** ${s.audioMood}
`).join('\n')}

### Technical Notes
${brief.technicalNotes}
    `.trim();
  };

  const copyAsMarkdown = () => {
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const cleanTitle = brief.title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'motion';
    a.download = `${cleanTitle}-brief.md`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const generateShareLink = () => {
    const jsonStr = JSON.stringify(brief);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const shareUrl = `${origin}/share?b=${compressed}`;
    
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (viewMode !== 'storyboard') {
      setViewMode('storyboard');
      setTimeout(() => {
        window.print();
      }, 100);
    } else {
      window.print();
    }
  };

  const handleRevise = async () => {
    if (!revisionNotes.trim()) {
      setRevisionError('Please enter revision notes.');
      return;
    }
    if (!apiKey) {
      setRevisionError('API Key is missing. Please return to the homepage and enter it.');
      return;
    }

    setIsRevising(true);
    setRevisionError(null);

    try {
      const response = await fetch('/api/revise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-groq-key': apiKey,
        },
        body: JSON.stringify({ 
          originalBrief: brief,
          revisionNotes 
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to revise brief');
      }

      const updatedBrief = await response.json();
      
      // Preserve style and createdAt if not returned by AI
      const finalBrief: Brief = {
        ...updatedBrief,
        style: brief.style,
        createdAt: brief.createdAt || new Date().toISOString()
      };

      if (onRevise) {
        onRevise(finalBrief);
        setRevisionNotes(''); // Clear notes on success
      }
    } catch (err: any) {
      console.error(err);
      setRevisionError(err.message);
    } finally {
      setIsRevising(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`max-w-4xl mx-auto w-full py-12 px-6 transition-opacity duration-500 ${isRevising ? 'opacity-50 pointer-events-none' : ''} print:p-0 print:max-w-none`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 print:hidden">
        <div>
          {!isShareMode && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[#6EE7B7]/60 hover:text-[#6EE7B7] transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Script
            </button>
          )}
          <h1 className="text-4xl font-bold text-white mb-2">{brief.title}</h1>
          <div className="flex gap-4 text-sm text-white/40">
            <span>Duration: <span className="text-white/60">{brief.totalDuration}</span></span>
            <span>Mood: <span className="text-white/60">{brief.overallMood}</span></span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isShareMode && (
             <button
              onClick={generateShareLink}
              className="flex items-center gap-2 px-4 py-2 bg-[#6EE7B7]/10 text-[#6EE7B7] hover:bg-[#6EE7B7]/20 border border-[#6EE7B7]/30 rounded-lg transition-all text-sm font-medium"
            >
              {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shareCopied ? 'Link Copied!' : 'Share Link'}
            </button>
          )}

          <button
            onClick={copyAsMarkdown}
            className="flex items-center gap-2 px-4 py-2 glass-card hover:border-[#6EE7B7]/50 transition-all text-sm font-medium"
          >
            {copied ? <Check className="w-4 h-4 text-[#6EE7B7]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy md'}
          </button>
          
          <button
            onClick={downloadAsMarkdown}
            className="flex items-center gap-2 px-4 py-2 glass-card hover:border-[#6EE7B7]/50 transition-all text-sm font-medium"
            title="Download as .md file"
          >
            <Download className="w-4 h-4" />
            Download md
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-[#6EE7B7] text-[#0a0a0a] hover:bg-[#34D399] rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_-3px_rgba(110,231,183,0.4)]"
            title="Save as PDF"
          >
            <Printer className="w-4 h-4" />
            Save as PDF
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-12 print:hidden">
        <div className="flex bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-xl">
          <button
            onClick={() => setViewMode('brief')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              viewMode === 'brief' ? 'bg-[#6EE7B7] text-[#0a0a0a] shadow-[0_0_20px_-5px_#6EE7B7]' : 'text-white/60 hover:text-white'
            }`}
          >
            Visual Boards
          </button>
          <button
            onClick={() => setViewMode('storyboard')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              viewMode === 'storyboard' ? 'bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.8)]' : 'text-white/60 hover:text-white'
            }`}
          >
            Production Doc
          </button>
        </div>
      </div>

      {viewMode === 'brief' ? (
        <div className="space-y-8">
          {brief.scenes.map((scene, index) => (
            <SceneCard key={scene.id} scene={scene} index={index} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#FAFAFA] text-black p-10 rounded-2xl shadow-2xl overflow-x-auto print:p-0 print:shadow-none print:bg-white"
        >
          <div className="mb-8 pb-6 border-b-4 border-black font-sans">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mix-blend-difference">{brief.title}</h2>
                <h3 className="text-xl font-bold uppercase tracking-widest text-gray-500 mt-1">Shot List Detail</h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold bg-black text-white px-3 py-1 inline-block uppercase tracking-widest mb-1">Total runtime: {brief.totalDuration}</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">Style: {brief.style}</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">Mood: {brief.overallMood}</div>
              </div>
            </div>
          </div>
          <table className="w-full text-left border-collapse min-w-[800px] font-sans">
            <thead>
              <tr className="border-b-2 border-black bg-gray-100">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-center w-16">Shot</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest w-32 border-l border-gray-300">Timecode</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest w-[30%] border-l border-gray-300">Visual Action / Camera</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest w-[25%] border-l border-gray-300">Motion Style</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest w-[25%] border-l border-gray-300">Audio / Music</th>
              </tr>
            </thead>
            <tbody>
              {brief.scenes.map((scene) => (
                <tr key={scene.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors align-top group">
                  <td className="p-4 text-3xl font-black text-center text-gray-300 group-hover:text-black transition-colors">{scene.id}</td>
                  <td className="p-4 border-l border-gray-200">
                    <div className="font-mono text-sm font-bold bg-gray-100 inline-block px-2 py-1 rounded">{scene.timecode}</div>
                    <div className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-bold">{scene.duration}</div>
                  </td>
                  <td className="p-4 text-sm leading-relaxed text-gray-800 border-l border-gray-200">
                    <p className="font-medium italic text-gray-600">"{scene.scriptExcerpt}"</p>
                    {scene.colorDescription && scene.colorDescription !== 'None' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">Color Direction</span>
                        <p className="text-xs font-bold text-gray-600 mb-2">{scene.colorDescription}</p>
                        <div className="flex gap-3 print:hidden">
                           <a 
                             href={`https://coolors.co/${scene.colorHex.map(h => h.replace('#', '')).join('-')}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                           >
                             Coolors <ExternalLink className="w-2.5 h-2.5" />
                           </a>
                           <a 
                             href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(scene.colorDescription + ' motion design moodboard')}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
                           >
                             Pinterest <ExternalLink className="w-2.5 h-2.5" />
                           </a>
                        </div>
                      </div>
                    )}
                    {scene.assets && scene.assets.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">Required Assets</span>
                        <span className="text-xs font-bold text-blue-600">{scene.assets.join(', ')}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm leading-relaxed text-gray-800 border-l border-gray-200">
                    <p className="font-medium">{scene.motionStyle}</p>
                    {scene.transition && (
                      <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-white bg-black inline-block px-2 py-1 rounded">
                        Transition: {scene.transition}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm leading-relaxed text-gray-800 border-l border-gray-200">
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">Target Mood / Audio</span>
                      <span className="text-sm font-bold text-emerald-600">{scene.audioMood}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Brief-only Footer Sections */}
      {viewMode === 'brief' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 p-8 glass-card border-[#6EE7B7]/20 border-dashed"
          >
            <h3 className="text-[#6EE7B7] font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Technical Notes
            </h3>
            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
              {brief.technicalNotes}
            </p>
          </motion.div>

          {/* Revision Mode Section */}
          {!isShareMode && onRevise && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-16 relative glass-card p-2 border-[#6EE7B7]/30"
            >
              <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 text-[10px] font-bold text-[#6EE7B7] uppercase tracking-[0.1em]">
                <Sparkles className="w-3 h-3" />
                Revision Mode
              </div>
              
              <textarea
                ref={textareaRef}
                placeholder="Need changes? Paste notes here (e.g., 'Make Scene 2's colors neon pink and change the music to upbeat synth')..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                disabled={isRevising}
                className="w-full bg-transparent p-6 pt-12 resize-none outline-none text-white placeholder:text-white/20 min-h-[120px] disabled:opacity-50"
              />
              
              {revisionError && (
                <div className="px-6 pb-2 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {revisionError}
                </div>
              )}
              
              <div className="flex justify-end items-center px-4 py-3 border-t border-white/5 bg-surface/80 backdrop-blur-xl rounded-b-2xl">
                <MagneticButton
                  onClick={handleRevise}
                  disabled={isRevising || !revisionNotes.trim()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-shadow group ${
                    isRevising || !revisionNotes.trim() ? 'bg-white/5 text-white/20' : 'bg-[#6EE7B7] text-[#0a0a0a] hover:shadow-[0_0_30px_-5px_#6EE7B7]'
                  }`}
                >
                  {isRevising ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      Updating Brief...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Apply Revisions
                    </>
                  )}
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
