'use client';

import { Brief } from '@/lib/types';
import { motion } from 'framer-motion';
import { Copy, Check, Download, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import SceneCard from './SceneCard';

interface ResultsViewProps {
  brief: Brief;
  onBack: () => void;
}

export default function ResultsView({ brief, onBack }: ResultsViewProps) {
  const [copied, setCopied] = useState(false);

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
    
    // Sanitize the filename to alphanumeric characters and dashes only
    const cleanTitle = brief.title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'motion';
    a.download = `${cleanTitle}-brief.md`;
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full py-12 px-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#6EE7B7]/60 hover:text-[#6EE7B7] transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Script
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">{brief.title}</h1>
          <div className="flex gap-4 text-sm text-white/40">
            <span>Duration: <span className="text-white/60">{brief.totalDuration}</span></span>
            <span>Mood: <span className="text-white/60">{brief.overallMood}</span></span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyAsMarkdown}
            className="flex items-center gap-2 px-4 py-2 glass-card hover:border-[#6EE7B7]/50 transition-all text-sm font-medium"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#6EE7B7]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
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
        </div>
      </div>

      <div className="space-y-8">
        {brief.scenes.map((scene, index) => (
          <SceneCard key={scene.id} scene={scene} index={index} />
        ))}
      </div>

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
    </motion.div>
  );
}
