'use client';

export default function SkeletonCard() {
  return (
    <div className="glass-card p-6 overflow-hidden relative">
      <div className="shimmer absolute inset-0 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="h-6 w-24 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/5 rounded" />
      </div>

      <div className="space-y-4">
        <div className="h-4 w-3/4 bg-white/10 rounded" />
        <div className="h-20 w-full bg-white/5 rounded border-l-2 border-white/10" />
        
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-12 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
