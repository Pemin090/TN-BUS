import React from 'react';
import { Language, SimulationState } from '../types';
import { Play, Pause, Zap, Ban, CloudRain, AlertOctagon, Users, FastForward, Sliders, X } from 'lucide-react';

interface SimulationControlsProps {
  isOpen: boolean;
  onClose: () => void;
  simulationState: SimulationState;
  onTogglePlay: () => void;
  onChangeSpeed: (multiplier: number) => void;
  onToggleTrafficSpike: () => void;
  onToggleRoadClosure: () => void;
  onToggleRain: () => void;
  onToggleBreakdown: () => void;
  onToggleCrowd: () => void;
  language: Language;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isOpen,
  onClose,
  simulationState,
  onTogglePlay,
  onChangeSpeed,
  onToggleTrafficSpike,
  onToggleRoadClosure,
  onToggleRain,
  onToggleBreakdown,
  onToggleCrowd,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 p-5 shadow-2xl text-slate-100 flex flex-col justify-between overflow-y-auto">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-sm text-white uppercase tracking-wider">
              {language === 'ta' ? 'மாதிரி கட்டுப்பாட்டு மையம்' : 'Simulation Engine'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {language === 'ta'
            ? 'ஜிபிஎஸ் நகர்வு, நெரிசல், மழை மற்றும் பேருந்து பழுதுகளை நிகழ்நேரத்தில் பாவனை செய்து சோதிக்கவும்.'
            : 'Interactive demo levers to test dynamic ETA recalibration, traffic spikes, breakdowns and passenger alerts.'}
        </p>

        {/* Master Play / Pause */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">
              {language === 'ta' ? 'பேருந்து இயக்கம்' : 'Simulation Engine'}
            </div>
            <div className="text-[10px] text-slate-400">
              {simulationState.isRunning ? (language === 'ta' ? 'இயங்குகிறது' : 'Active & Moving') : (language === 'ta' ? 'நிறுத்தப்பட்டுள்ளது' : 'Paused')}
            </div>
          </div>
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              simulationState.isRunning
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-emerald-500 text-white shadow-md'
            }`}
          >
            {simulationState.isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start</span>
              </>
            )}
          </button>
        </div>

        {/* Speed Controls */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            {language === 'ta' ? 'வேக பெருக்கி' : 'Simulation Speed'}
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  simulationState.speedMultiplier === s
                    ? 'bg-sky-500 text-white border-sky-400 shadow'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {s}x Speed
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Scenario Toggles */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            {language === 'ta' ? 'நிகழ்வுகள் & சோதனைகள்' : 'Dynamic Scenario Injections'}
          </label>

          {/* Traffic Spike */}
          <button
            onClick={onToggleTrafficSpike}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
              simulationState.isTrafficSpikeActive
                ? 'bg-orange-500/20 border-orange-500 text-orange-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>{language === 'ta' ? '⚡ கடுமையான நெரிசல்' : '⚡ Traffic Spike (GST Road)'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {simulationState.isTrafficSpikeActive ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Road Closure */}
          <button
            onClick={onToggleRoadClosure}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
              simulationState.isRoadClosureActive
                ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-400" />
              <span>{language === 'ta' ? '🚧 சாலை அடைப்பு & வழிமாற்றம்' : '🚧 Road Closure Diversion'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {simulationState.isRoadClosureActive ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Rain / Flooding */}
          <button
            onClick={onToggleRain}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
              simulationState.isRainSimulated
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ta' ? '🌧 கனமழை & நீர் தேக்கம்' : '🌧 Simulate Monsoon Rain'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {simulationState.isRainSimulated ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Bus Breakdown (Feature 14) */}
          <button
            onClick={onToggleBreakdown}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
              simulationState.isBusBreakdownSimulated
                ? 'bg-rose-950 border-rose-500 text-rose-200 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>{language === 'ta' ? '🚌 பேருந்து பழுது (Breakdown)' : '🚌 Bus Breakdown Alert'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {simulationState.isBusBreakdownSimulated ? 'ACTIVE' : 'OFF'}
            </span>
          </button>

          {/* Surge Crowd */}
          <button
            onClick={onToggleCrowd}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
              simulationState.isHighCrowdSimulated
                ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>{language === 'ta' ? '👥 உச்சக்கட்ட நெரிசல் (Crowd)' : '👥 Surge Peak Crowd'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {simulationState.isHighCrowdSimulated ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
        TN Bus Traffic Alert & Arrival • Simulation Sandbox
      </div>
    </div>
  );
};
