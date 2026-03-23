'use client';

import { StyleType } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STYLES: StyleType[] = [
  'Commercial',
  'Explainer',
  'Social Media',
  'Corporate',
  'Music Video',
  'Short Film',
];

interface StylePickerProps {
  selected: StyleType;
  onChange: (style: StyleType) => void;
}

export default function StylePicker({ selected, onChange }: StylePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLES.map((style) => (
        <button
          key={style}
          onClick={() => onChange(style)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
            selected === style
              ? "bg-[#6EE7B7] text-[#0a0a0a] border-[#6EE7B7] accent-glow"
              : "bg-surface text-foreground border-white/10 hover:border-[#6EE7B7]/50"
          )}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
