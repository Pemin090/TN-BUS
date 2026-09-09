import React from 'react';
import { BusLiveryTheme, Language } from '../types';
import { Palette, Check } from 'lucide-react';

interface BusLiverySelectorProps {
  currentTheme: BusLiveryTheme;
  onChangeTheme: (theme: BusLiveryTheme) => void;
  language: Language;
  className?: string;
}

interface LiveryOption {
  id: BusLiveryTheme;
  nameEn: string;
  nameTa: string;
  corpCode: string;
  primaryColor: string;
  accentColor: string;
  tagline: string;
}

export const LIVERY_OPTIONS: LiveryOption[] = [
  {
    id: 'all',
    nameEn: 'Realistic Fleet Mix',
    nameTa: 'அனைத்து அரசு பேருந்துகள்',
    corpCode: 'ALL FLEET',
    primaryColor: 'bg-sky-600',
    accentColor: 'border-sky-400',
    tagline: 'MTC • TNSTC • SETC Hybrid'
  },
  {
    id: 'tnstc',
    nameEn: 'TNSTC Emerald & Cream',
    nameTa: 'அரசு போக்குவரத்துக் கழகம் (TNSTC)',
    corpCode: 'TNSTC',
    primaryColor: 'bg-emerald-700',
    accentColor: 'border-emerald-400',
    tagline: '6 Divisions (CBE, MDU, SLM, etc.)'
  },
  {
    id: 'setc',
    nameEn: 'SETC Crimson Ultra Deluxe',
    nameTa: 'விரைவுப் போக்குவரத்து (SETC)',
    corpCode: 'SETC',
    primaryColor: 'bg-rose-900',
    accentColor: 'border-rose-400',
    tagline: 'Ultra Deluxe & AC Sleeper'
  },
  {
    id: 'mtc',
    nameEn: 'MTC Chennai Classic Blue',
    nameTa: 'மாநகரப் போக்குவரத்து (MTC)',
    corpCode: 'MTC',
    primaryColor: 'bg-blue-700',
    accentColor: 'border-blue-400',
    tagline: 'Chennai Metro City Transit'
  },
  {
    id: 'pink',
    nameEn: 'Vidiyal Payanam Pink Bus',
    nameTa: 'மகளிர் இலவச விடியல் பயணம்',
    corpCode: 'FREE BUS',
    primaryColor: 'bg-pink-600',
    accentColor: 'border-pink-400',
    tagline: 'Women Free Transit (₹0)'
  }
];

export const BusLiverySelector: React.FC<BusLiverySelectorProps> = ({
  currentTheme,
  onChangeTheme,
  language,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const activeLivery = LIVERY_OPTIONS.find((l) => l.id === currentTheme) || LIVERY_OPTIONS[0];

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all shadow-md group"
        title="Change Realistic Bus Livery Theme"
      >
        <span className={`w-3 h-3 rounded-full ${activeLivery.primaryColor} border border-white/50 shadow`} />
        <Palette className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline font-mono text-[11px]">
          {activeLivery.corpCode}
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1">
            <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800/80 flex items-center justify-between">
              <span>{language === 'ta' ? 'பேருந்து வண்ண வடிவமைப்பு' : 'Select Bus Livery Theme'}</span>
              <span className="text-amber-400">Authentic TN</span>
            </div>

            {LIVERY_OPTIONS.map((opt) => {
              const isSelected = opt.id === currentTheme;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChangeTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 text-white border border-slate-700 shadow-md'
                      : 'hover:bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 rounded-full ${opt.primaryColor} border-2 ${opt.accentColor} shrink-0 shadow`} />
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {language === 'ta' ? opt.nameTa : opt.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        {opt.tagline}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
