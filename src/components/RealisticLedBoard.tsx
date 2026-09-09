import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Radio } from 'lucide-react';

interface RealisticLedBoardProps {
  language: Language;
  className?: string;
}

const LED_MESSAGES = [
  {
    corp: 'SETC',
    color: 'text-rose-400',
    routeNum: '172-UD',
    en: 'CHENNAI (CMBT / KCBT) ⇄ MADURAI (MGR TERMINAL) • ULTRA DELUXE AIR SUSPENSION',
    ta: 'சென்னை (கிளாம்பாக்கம்) ⇄ மதுரை (மாட்டுத்தாவணி) • சொகுசு விரைவுப் பேருந்து',
    viaEn: 'VIA: VILLUPURAM • TRICHY • DINDIGUL',
    viaTa: 'வழியாக: விழுப்புரம் • திருச்சி • திண்டுக்கல்',
    speed: '78 km/h'
  },
  {
    corp: 'TNSTC',
    color: 'text-emerald-400',
    routeNum: '111-EXP',
    en: 'COIMBATORE (GANDHIPURAM) ⇄ SALEM (NEW BUS STAND) • 1-TO-1 EXPRESS',
    ta: 'கோவை (காந்திபுரம்) ⇄ சேலம் (புதிய பேருந்து நிலையம்) • 1-க்கு-1 விரைவு',
    viaEn: 'VIA: AVINASHI • PERUNDURAI • SANKARI',
    viaTa: 'வழியாக: அவினாசி • பெருந்துறை • சங்ககிரி',
    speed: '72 km/h'
  },
  {
    corp: 'MTC',
    color: 'text-sky-400',
    routeNum: '21G',
    en: 'TAMBARAM WEST ⇄ BROADWAY • GST CORRIDOR EXPRESS • LIVE GPS ACTIVE',
    ta: 'தாம்பரம் மேற்கு ⇄ பிராட்வே • ஜிஎஸ்டி சாலை விரைவு • நேரலை ஜிபிஎஸ்',
    viaEn: 'VIA: CHROMEPET • GUINDY • SAIDAPET • ANNA SALAI',
    viaTa: 'வழியாக: குரோம்பேட்டை • கிண்டி • சைதாப்பேட்டை',
    speed: '44 km/h'
  },
  {
    corp: 'MTC',
    color: 'text-pink-400',
    routeNum: '500-VP',
    en: 'CHENGALPATTU ⇄ TAMBARAM • VIDIYAL PAYANAM (WOMEN FREE TRAVEL ₹0)',
    ta: 'செங்கல்பட்டு ⇄ தாம்பரம் • மகளிர் இலவச விடியல் பயணம் (கட்டணம் ₹0)',
    viaEn: 'VIA: GUDUVANCHERY • VANDALUR ZOO',
    viaTa: 'வழியாக: கூடுவாஞ்சேரி • வண்டலூர் உயிரியல் பூங்கா',
    speed: '51 km/h'
  },
  {
    corp: 'SETC',
    color: 'text-amber-400',
    routeNum: '888-AC',
    en: 'BENGALURU (SHANTINAGAR) ⇄ TIRUNELVELI (VEINTHANKULAM) • MULTI-AXLE AC SLEEPER',
    ta: 'பெங்களூரு ⇄ திருநெல்வேலி • நவீன குளிர்சாதன படுக்கை வசதி பேருந்து',
    viaEn: 'VIA: HOSUR • DHARMAPURI • SALEM • MADURAI',
    viaTa: 'வழியாக: ஓசூர் • தர்மபுரி • சேலம் • மதுரை',
    speed: '82 km/h'
  }
];

export const RealisticLedBoard: React.FC<RealisticLedBoardProps> = ({
  language,
  className = ''
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LED_MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const msg = LED_MESSAGES[index];

  return (
    <div
      onClick={() => setIndex((prev) => (prev + 1) % LED_MESSAGES.length)}
      className={`relative w-full bg-neutral-950 border-y sm:border sm:rounded-xl border-neutral-800 shadow-2xl overflow-hidden cursor-pointer select-none group ${className}`}
      title="Click to cycle active bus LED display"
    >
      {/* Authentic Dot-Matrix Screen Scanlines & Glare Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/70 z-10" />

      {/* Main Display Ribbon */}
      <div className="flex items-center justify-between gap-3 px-3 py-1.5 z-20 relative">
        {/* Left: Corp Badge & Route Number */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 border border-amber-500/40 text-amber-400 font-mono text-[11px] font-bold tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Radio className="w-3 h-3 animate-pulse text-amber-400" />
            <span>{msg.corp}</span>
          </div>

          <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/50 text-amber-300 font-mono text-xs font-black tracking-widest shadow-[0_0_12px_rgba(245,158,11,0.35)]">
            {msg.routeNum}
          </div>
        </div>

        {/* Center: Glowing Dot-Matrix Scrolling Text */}
        <div className="flex-1 overflow-hidden">
          <div className="font-mono text-xs font-bold text-amber-400 tracking-wide truncate drop-shadow-[0_0_8px_rgba(245,158,11,0.65)]">
            {language === 'ta' ? msg.ta : msg.en}
          </div>
          <div className="font-mono text-[10px] text-amber-400/70 tracking-wider truncate hidden sm:block drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]">
            {language === 'ta' ? msg.viaTa : msg.viaEn}
          </div>
        </div>

        {/* Right: Telemetry Badge */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 border border-neutral-700 text-neutral-300">
            {msg.speed}
          </span>
          <span className="text-[9px] font-mono uppercase text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
};
