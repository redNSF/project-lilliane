'use client';

import { useMemo } from 'react';
import { Scene } from '@/lib/types';
import { motion } from 'framer-motion';
import { Type, Play, Music, Layers, Palette, FolderOpen, ExternalLink, MousePointer2 } from 'lucide-react';
import ColorSwatch from './ColorSwatch';

interface SceneCardProps {
  scene: Scene;
  index: number;
}

export default function SceneCard({ scene, index }: SceneCardProps) {
  const coolorsUrl = useMemo(() => {
    return `https://coolors.co/${scene.colorHex.map(h => h.replace('#', '')).join('-')}`;
  }, [scene.colorHex]);

  const pinterestUrl = useMemo(() => {
    return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(scene.colorDescription + ' motion design moodboard')}`;
  }, [scene.colorDescription]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="glass-card p-6 group hover:border-[#6EE7B7]/50 transition-all duration-500 relative"
    >
      {/* Left Glow Effect on Hover */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#6EE7B7] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 accent-glow" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-[#6EE7B7]/10 text-[#6EE7B7] text-xs font-bold border border-[#6EE7B7]/20">
            SCENE {scene.id}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">{scene.name}</h3>
        </div>
        <span className="jetbrains-mono text-sm text-[#6EE7B7]/80 bg-white/5 px-2 py-1 rounded">
          {scene.timecode}
        </span>
      </div>

      <div className="space-y-6">
        <div className="pl-4 border-l-2 border-[#6EE7B7]/30 italic text-sm text-foreground/80 leading-relaxed">
          "{scene.scriptExcerpt}"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <Play className="w-4 h-4 text-[#6EE7B7] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Motion Style</p>
                <p className="text-sm text-foreground/90 leading-tight">{scene.motionStyle}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Music className="w-4 h-4 text-[#6EE7B7] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Audio Mood</p>
                <p className="text-sm text-foreground/90 leading-tight">{scene.audioMood}</p>
              </div>
            </div>

            {scene.fontPairing && (
              <div className="flex gap-3 items-start">
                <MousePointer2 className="w-4 h-4 text-[#6EE7B7] mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Font Pairing</p>
                  <p className="text-sm text-foreground/90 leading-tight font-serif italic">{scene.fontPairing}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <Type className="w-4 h-4 text-[#6EE7B7] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Text Overlay</p>
                <p className="text-sm text-foreground/90 leading-tight">{scene.textOverlay || 'None'}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Layers className="w-4 h-4 text-[#6EE7B7] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Transition</p>
                <p className="text-sm text-foreground/90 leading-tight">{scene.transition}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-white/40" />
              <div className="flex gap-1.5">
                {scene.colorHex.map((hex, i) => (
                  <ColorSwatch key={i} hex={hex} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Moodboard:</span>
              <a 
                href={coolorsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-[#6EE7B7]/60 hover:text-[#6EE7B7] transition-colors flex items-center gap-1"
              >
                Coolors <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a 
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-[#6EE7B7]/60 hover:text-[#6EE7B7] transition-colors flex items-center gap-1"
              >
                Pinterest <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-white/40 self-center mr-1" />
            {scene.assets.map((asset, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60">
                {asset}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
