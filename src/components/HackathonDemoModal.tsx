import React, { useState, useEffect } from 'react';
import { Bus, BusRoute, Language } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Clock,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Users,
  Navigation,
  ArrowRight,
  Shield,
  Zap,
  Flame,
  X
} from 'lucide-react';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectBus?: (bus: Bus) => void;
}

interface DemoStep {
  time: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  etaDisplay: string;
  delayMin: number;
  crowdLevel: 'LOW 🟢' | 'MEDIUM 🟡' | 'HIGH 🔴';
  crowdPercent: number;
  highlightCategory: 'start' | 'traffic' | 'recalculate' | 'crowd' | 'alternative' | 'arrival';
  icon: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    time: '08:30',
    titleEn: 'Bus Starts Journey from Terminal',
    titleTa: 'பேருந்து புறப்படும் முனையத்திலிருந்து தொடங்கியது',
    descEn: 'Bus 101 departing Gandhipuram Bay 2 on schedule. AIS-140 GPS fix acquired (42 km/h).',
    descTa: 'பேருந்து 101 காந்திபுரம் தளம் 2-லிருந்து நேரத்திற்கு புறப்பட்டது. ஜிபிஎஸ் இணைப்பு செயலில் உள்ளது.',
    etaDisplay: '08:45 AM (Original)',
    delayMin: 0,
    crowdLevel: 'LOW 🟢',
    crowdPercent: 32,
    highlightCategory: 'start',
    icon: '🚌'
  },
  {
    time: '08:35',
    titleEn: 'AI Detects Corridor Bottleneck Ahead',
    titleTa: 'முன்னால் உள்ள போக்குவரத்து நெரிசலை AI கண்டறிந்தது',
    descEn: 'Computer vision & traffic feed detects sudden +8 min bottleneck near Kinathukadavu bypass.',
    descTa: 'கிணத்துக்கடவு புறவழிச்சாலை பகுதியில் +8 நிமிட போக்குவரத்து நெரிசல் கண்டறியப்பட்டது.',
    etaDisplay: '08:45 AM → Calculating...',
    delayMin: 8,
    crowdLevel: 'MEDIUM 🟡',
    crowdPercent: 62,
    highlightCategory: 'traffic',
    icon: '⚠️'
  },
  {
    time: '08:36',
    titleEn: 'Real-Time AI ETA Recalculation',
    titleTa: 'நிகழ்நேர AI வருகை நேரம் தானாக புதுப்பிக்கப்பட்டது',
    descEn: 'Original ETA: 08:45 AM → New Recalculated AI ETA: 08:53 AM (+8 min delay, Confidence: 94%). Commuters notified.',
    descTa: 'முந்தைய வருகை: 08:45 AM → புதிய கணக்கீடு: 08:53 AM (+8 நிமிடம் தாமதம், துல்லியம் 94%).',
    etaDisplay: '08:53 AM (+8 min)',
    delayMin: 8,
    crowdLevel: 'MEDIUM 🟡',
    crowdPercent: 68,
    highlightCategory: 'recalculate',
    icon: '⚡'
  },
  {
    time: '08:38',
    titleEn: 'Crowd Spike Forecast at Upcoming Interchange',
    titleTa: 'அடுத்த முக்கிய சந்திப்பில் அதிக பயணிகள் கூட்டம் முன்னறிவிப்பு',
    descEn: 'AI forecasts HIGH CROWD (86%) at college junction. Available seats dropping from 22 to 4.',
    descTa: 'கல்லூரி சந்திப்பில் அதிக கூட்டம் (86%) அதிகரிக்கும் என கணிக்கப்பட்டுள்ளது. காலியிடங்கள் குறைகிறது.',
    etaDisplay: '08:53 AM',
    delayMin: 8,
    crowdLevel: 'HIGH 🔴',
    crowdPercent: 86,
    highlightCategory: 'crowd',
    icon: '👥'
  },
  {
    time: '08:42',
    titleEn: 'Smart Alternative Bypass Suggested',
    titleTa: 'மாற்று விரைவுப் பாதை மற்றும் பேருந்து பரிந்துரைக்கப்பட்டது',
    descEn: 'Algorithm alerts dispatch & suggests parallel Deluxe Bus 205 with Low Crowd 🟢 for waiting commuters.',
    descTa: 'காத்திருக்கும் பயணிகளுக்கு குறைந்த கூட்டம் கொண்ட டீலக்ஸ் பேருந்து 205 பரிந்துரைக்கப்படுகிறது.',
    etaDisplay: '08:52 AM (Optimized)',
    delayMin: 5,
    crowdLevel: 'HIGH 🔴',
    crowdPercent: 88,
    highlightCategory: 'alternative',
    icon: '🔀'
  },
  {
    time: '08:52',
    titleEn: 'Bus Safely Reaches Destination Bay',
    titleTa: 'பேருந்து பத்திரமாக இலக்கு நிலையத்தை அடைந்தது',
    descEn: 'Bus arrives at Pollachi Central Terminal. Accurate within 1 min of AI recalculated schedule.',
    descTa: 'பொள்ளாச்சி மத்திய பேருந்து நிலையத்தை அடைந்தது. AI கணித்த நேரத்திற்குள் துல்லியமாக சேர்ந்தது.',
    etaDisplay: 'Arrived (08:52 AM)',
    delayMin: 0,
    crowdLevel: 'LOW 🟢',
    crowdPercent: 18,
    highlightCategory: 'arrival',
    icon: '🏁'
  }
];

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= DEMO_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black">
              <Zap className="w-5 h-5 fill-slate-950 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{language === 'ta' ? 'ஹேக்கத்தான் நேரலை விளக்க காட்சி முறைமை' : 'HACKATHON DEMO MODE'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                  STEP {currentStepIndex + 1} OF {DEMO_STEPS.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Automated multi-stage timeline demonstrating AI traffic detection, dynamic ETA recalculation, and crowd prediction.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Animated Stage Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden">
          {/* Accent top line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ${
              currentStep.highlightCategory === 'traffic'
                ? 'bg-rose-500'
                : currentStep.highlightCategory === 'recalculate'
                ? 'bg-amber-400'
                : currentStep.highlightCategory === 'crowd'
                ? 'bg-purple-500'
                : 'bg-emerald-500'
            }`}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentStep.icon}</span>
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  CLOCK TIME: {currentStep.time}
                </span>
                <h4 className="text-lg font-black text-white">
                  {language === 'ta' ? currentStep.titleTa : currentStep.titleEn}
                </h4>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Dynamic AI ETA</span>
              <span className="text-xl font-mono font-black text-emerald-400">
                {currentStep.etaDisplay}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {language === 'ta' ? currentStep.descTa : currentStep.descEn}
          </p>

          {/* Key Indicators Row */}
          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">EXPECTED DELAY</span>
              <span className={`text-base font-bold font-mono ${currentStep.delayMin > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentStep.delayMin > 0 ? `+${currentStep.delayMin} min` : '0 min (On-Time)'}
              </span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">CROWD PREDICTION</span>
              <span className="text-base font-bold font-mono text-white">
                {currentStep.crowdLevel} ({currentStep.crowdPercent}%)
              </span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">AI CONFIDENCE</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                94% (Validated)
              </span>
            </div>
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        <div className="flex items-center justify-between gap-1 px-1">
          {DEMO_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <div
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-full h-2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-amber-400 shadow-md shadow-amber-400/30'
                      : isPassed
                      ? 'bg-emerald-500'
                      : 'bg-slate-800'
                  }`}
                />
                <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
              </div>
            );
          })}
        </div>

        {/* Modal Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isPlaying ? 'Pause Demo' : 'Play Presentation'}</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1))}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            {language === 'ta' ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
