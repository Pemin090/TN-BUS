import React, { useState } from 'react';
import { Bus, Language } from '../types';
import { playConductorBell, playBusAirHorn } from '../utils/busAudio';
import {
  Gauge,
  Fuel,
  Thermometer,
  Zap,
  Volume2,
  VolumeX,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';

interface BusCockpitClusterProps {
  bus?: Bus | null;
  language: Language;
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

export const BusCockpitCluster: React.FC<BusCockpitClusterProps> = ({
  bus,
  language,
  isOpen,
  onToggleOpen,
  className = ''
}) => {
  const [hornActive, setHornActive] = useState(false);
  const [bellActive, setBellActive] = useState(false);

  // Speed and telemetry values
  const currentSpeed = bus ? bus.speedKmh : 64;
  const speedDeg = Math.min(240, Math.max(0, (currentSpeed / 120) * 240)) - 120; // -120 to +120 deg

  const brakePressureBar = 8.4; // standard 8.4 bar dual tank
  const brakeDeg = (brakePressureBar / 12) * 240 - 120;

  const fuelPct = bus?.telemetry?.fuelOrBatteryPercent || 74;
  const coolantTemp = bus?.telemetry?.engineTempCelsius || 83;

  const handleTriggerBell = () => {
    setBellActive(true);
    playConductorBell();
    setTimeout(() => setBellActive(false), 500);
  };

  const handleTriggerHorn = () => {
    setHornActive(true);
    playBusAirHorn();
    setTimeout(() => setHornActive(false), 600);
  };

  return (
    <div className={`transition-all duration-300 z-20 ${className}`}>
      {/* Floating Toggle Pill */}
      <div className="flex justify-center mb-1">
        <button
          onClick={onToggleOpen}
          className="px-3 py-1 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all group"
        >
          <Gauge className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>{language === 'ta' ? 'ஓட்டுநர் கேபின் கருவிப் பலகை (Cockpit HUD)' : 'Driver Cockpit & Gauges'}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto text-slate-100">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono uppercase font-bold text-neutral-200 tracking-wider">
                {language === 'ta' ? 'அரசுப் பேருந்து நேரலை கேபின் கன்சோல்' : 'TN Transit Vehicle Instrument Cluster (ECU v4.2)'}
              </span>
            </div>

            {/* Quick Authentic Bus Sound Triggers */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerBell}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  bellActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 scale-95 ring-2 ring-amber-300'
                    : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
                }`}
                title="Play two-stroke conductor brass bell"
              >
                <span>🔔</span>
                <span className="hidden sm:inline">
                  {language === 'ta' ? 'நடத்துநர் மணி (Bell)' : 'Conductor Bell'}
                </span>
              </button>

              <button
                onClick={handleTriggerHorn}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  hornActive
                    ? 'bg-rose-600 text-white border-rose-400 scale-95 ring-2 ring-rose-300'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                }`}
                title="Play dual-tone highway pneumatic air horn"
              >
                <span>🎺</span>
                <span className="hidden sm:inline">
                  {language === 'ta' ? 'ஏர் ஹாரன் (Air Horn)' : 'Air Horn'}
                </span>
              </button>
            </div>
          </div>

          {/* Dials & Instrument Gauges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            {/* 1. Main Analog Speedometer */}
            <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-sky-400" />
                <span>{language === 'ta' ? 'வேகமானி (Speed)' : 'Speedometer'}</span>
              </div>

              {/* Gauge Arc Graphic */}
              <div className="relative w-28 h-16 flex items-end justify-center overflow-hidden">
                <div className="absolute inset-0 rounded-t-full border-4 border-slate-700 border-b-0" />
                <div className="absolute inset-x-2 top-2 bottom-0 rounded-t-full border-2 border-emerald-500/40 border-b-0" />
                {/* Needle */}
                <div
                  className="w-1 h-12 bg-rose-500 origin-bottom transform transition-transform duration-300 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                  style={{ transform: `rotate(${speedDeg}deg)` }}
                />
                <div className="absolute bottom-0 w-3 h-3 rounded-full bg-white border border-slate-900 z-10" />
              </div>

              {/* Digital Readout */}
              <div className="text-xl font-mono font-black text-white mt-1">
                {currentSpeed} <span className="text-[10px] text-neutral-400 font-sans">KM/H</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">
                {currentSpeed > 80 ? '⚠ LIMITER ENGAGED' : '✓ SPEED GOVERNOR OK'}
              </span>
            </div>

            {/* 2. Dual Air Brake Pressure Gauge */}
            <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertOctagon className="w-3 h-3 text-amber-400" />
                <span>{language === 'ta' ? 'ஏர் பிரேக் அழுத்தம்' : 'Air Brake Pressure'}</span>
              </div>

              {/* Dial Graphic */}
              <div className="relative w-28 h-16 flex items-end justify-center overflow-hidden">
                <div className="absolute inset-0 rounded-t-full border-4 border-slate-700 border-b-0" />
                {/* Needle */}
                <div
                  className="w-1 h-12 bg-amber-400 origin-bottom transform transition-transform duration-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  style={{ transform: `rotate(${brakeDeg}deg)` }}
                />
                <div className="absolute bottom-0 w-3 h-3 rounded-full bg-white border border-slate-900 z-10" />
              </div>

              <div className="text-xl font-mono font-black text-amber-300 mt-1">
                {brakePressureBar} <span className="text-[10px] text-neutral-400 font-sans">BAR</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">
                RESERVOIR 1 & 2 OPTIMAL (120 PSI)
              </span>
            </div>

            {/* 3. Diesel & DEF Levels */}
            <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-emerald-400" />
                    <span>DIESEL TANK</span>
                  </span>
                  <span className="font-bold text-white">{fuelPct}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                    style={{ width: `${fuelPct}%` }}
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                  <span>AdBlue DEF LEVEL</span>
                  <span className="font-bold text-sky-300">88%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="text-[10px] font-mono text-neutral-400 pt-1 text-center">
                Est. Range: <strong className="text-white font-mono">{bus?.telemetry?.remainingRangeKm || 340} KM</strong>
              </div>
            </div>

            {/* 4. Engine Health & Alternator Voltage */}
            <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-rose-400" />
                  <span>COOLANT</span>
                </div>
                <span className="font-mono text-sm font-bold text-slate-100">{coolantTemp}°C</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>24V BATTERY</span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400">27.6 V</span>
              </div>

              {/* Digital Odometer */}
              <div className="p-1.5 bg-neutral-900 rounded-lg border border-neutral-800 text-center font-mono">
                <span className="text-[9px] text-neutral-500 block uppercase">TOTAL ODOMETER</span>
                <span className="text-sm font-black text-emerald-400 tracking-widest">
                  {bus?.telemetry?.totalKmsDriven ? bus.telemetry.totalKmsDriven.toLocaleString() : '348,210'}{' '}
                  <span className="text-[9px] text-neutral-400">KM</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
