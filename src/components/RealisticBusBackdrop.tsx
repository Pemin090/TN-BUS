import React from 'react';
import { BusLiveryTheme } from '../types';

interface RealisticBusBackdropProps {
  theme: BusLiveryTheme;
  backdropMode?: 'cinematic' | 'subtle' | 'road_only';
  className?: string;
}

export const RealisticBusBackdrop: React.FC<RealisticBusBackdropProps> = ({
  theme,
  backdropMode = 'subtle',
  className = ''
}) => {
  // Theme color accents for lighting reflection
  const themeGlow = {
    all: 'rgba(56, 189, 248, 0.08)',
    tnstc: 'rgba(16, 185, 129, 0.12)',
    setc: 'rgba(225, 29, 72, 0.14)',
    mtc: 'rgba(37, 99, 235, 0.12)',
    pink: 'rgba(236, 72, 153, 0.14)'
  }[theme];

  const themeBorder = {
    all: 'border-sky-500/30',
    tnstc: 'border-emerald-500/40',
    setc: 'border-rose-500/40',
    mtc: 'border-blue-500/40',
    pink: 'border-pink-500/40'
  }[theme];

  const imageOpacity = {
    cinematic: 'opacity-35',
    subtle: 'opacity-18',
    road_only: 'opacity-0'
  }[backdropMode];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* 1. Photorealistic Bus Terminal Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${imageOpacity}`}
        style={{
          backgroundImage: `url('/src/assets/images/realistic_bus_background_1788950799575.jpg')`,
          filter: 'saturate(1.2) contrast(1.15) brightness(0.9)'
        }}
      />

      {/* 2. Realistic Asphalt Highway Road Overlay with subtle grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/92 to-slate-950/98" />

      {/* 3. Authentic Highway Lane Markings (Subtle Road Atmosphere) */}
      <div className="absolute inset-0 opacity-10">
        {/* Yellow double-stripes for national highway divide */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 flex justify-between pointer-events-none">
          <div className="w-1 h-full bg-amber-400" />
          <div className="w-1 h-full bg-amber-400" />
        </div>
        {/* White dashed corridor edges */}
        <div
          className="absolute top-0 bottom-0 left-[18%] w-0.5 border-r border-dashed border-white/60"
          style={{ backgroundSize: '1px 32px' }}
        />
        <div
          className="absolute top-0 bottom-0 right-[18%] w-0.5 border-r border-dashed border-white/60"
          style={{ backgroundSize: '1px 32px' }}
        />
      </div>

      {/* 4. Active Bus Livery Headlight & Ambient Underglow */}
      <div
        className="absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-700 pointer-events-none"
        style={{ background: themeGlow }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-64 rounded-full blur-3xl transition-colors duration-700 pointer-events-none"
        style={{ background: themeGlow }}
      />

      {/* 5. Realistic Road Reflection Water Sheen */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
    </div>
  );
};
