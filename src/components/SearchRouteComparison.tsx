import React, { useState } from 'react';
import { Bus, BusRoute, BusStop, Language, TrafficIncident } from '../types';
import { ArrowRight, Clock, Users, Award, ShieldCheck, Leaf, AlertTriangle, ChevronRight, Zap, Sparkles, Mic } from 'lucide-react';
import { calculateGreenTravelMetrics } from '../services/predictionEngine';
import { calculateSmartRouteScore } from '../services/aiEtaEngine';

interface SearchRouteComparisonProps {
  buses: Bus[];
  routes: BusRoute[];
  stops: BusStop[];
  incidents: TrafficIncident[];
  onSelectBus: (bus: Bus) => void;
  onSelectRoute: (route: BusRoute) => void;
  onTriggerDemoScenario: () => void;
  language: Language;
}

export const SearchRouteComparison: React.FC<SearchRouteComparisonProps> = ({
  buses,
  routes,
  stops,
  incidents,
  onSelectBus,
  onSelectRoute,
  onTriggerDemoScenario,
  language
}) => {
  const [origin, setOrigin] = useState<string>('stop-kcbt-kilambakkam');
  const [destination, setDestination] = useState<string>('stop-madurai-mattuthavani');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Find relevant buses based on selected route or default
  const activeRoute = routes.find(
    (r) =>
      r.stops.some((s) => s.stopId === origin) &&
      r.stops.some((s) => s.stopId === destination)
  ) || routes[0];

  const matchedBuses = buses.filter((b) => b.routeId === activeRoute?.id);
  const primaryBus = matchedBuses[0] || buses[0];
  const secondaryBus = buses.find((b) => b.id !== primaryBus.id) || buses[1];

  // Active bottleneck check
  const activeTrafficJam = incidents.find(
    (i) => i.active && (i.affectedRouteNumbers.includes(primaryBus?.routeNumber || ''))
  );

  const greenMetrics = calculateGreenTravelMetrics(activeRoute ? activeRoute.averageTravelTimeMinutes * 0.8 : 35);
  const smartScore = calculateSmartRouteScore(activeRoute, primaryBus);

  const handleApplyPreset = (origId: string, destId: string, routeNum: string) => {
    setOrigin(origId);
    setDestination(destId);
    const r = routes.find((x) => x.routeNumber.includes(routeNum));
    if (r) {
      onSelectRoute(r);
      const b = buses.find((bus) => bus.routeId === r.id);
      if (b) onSelectBus(b);
    }
  };

  // Voice Search Handler (English & Tamil)
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === 'ta'
          ? 'உங்கள் உலாவியில் குரல் தேடல் ஆதரிக்கப்படவில்லை.'
          : 'Voice search is not supported in this browser.'
      );
      return;
    }

    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsVoiceListening(true);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript.toLowerCase();
        setIsVoiceListening(false);

        if (text.includes('pollachi') || text.includes('பொள்ளாச்சி')) {
          handleApplyPreset('stop-cbe-gandhipuram', 'stop-pollachi-central', '101');
        } else if (text.includes('madurai') || text.includes('மதுரை')) {
          handleApplyPreset('stop-kcbt-kilambakkam', 'stop-madurai-mattuthavani', 'SETC 101');
        } else if (text.includes('coimbatore') || text.includes('கோவை')) {
          handleApplyPreset('stop-cmbt-koyambedu', 'stop-cbe-gandhipuram', 'TNSTC 301');
        } else if (text.includes('guindy') || text.includes('கிண்டி') || text.includes('tambaram') || text.includes('தாம்பரம்')) {
          handleApplyPreset('stop-tambaram', 'stop-guindy', '21G');
        }
      };
      rec.onerror = () => setIsVoiceListening(false);
      rec.onend = () => setIsVoiceListening(false);
      rec.start();
    } catch {
      setIsVoiceListening(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-slate-100 flex flex-col gap-4 font-sans">
      {/* Search Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>{language === 'ta' ? 'அனைத்து தமிழ்நாடு ஸ்மார்ட் வழித்தட ஒப்பீடு' : 'Smart Route AI & Corridor Finder'}</span>
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-xs ${
                isVoiceListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Voice Search (English & Tamil)"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{language === 'ta' ? 'குரல் தேடல்' : 'Voice Search'}</span>
            </button>
            <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded-full">
              38 Districts
            </span>
          </div>
        </div>

        {/* Quick Corridor Presets Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mt-2.5 pb-1">
          <button
            onClick={() => handleApplyPreset('stop-cbe-gandhipuram', 'stop-pollachi-central', '101')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold hover:bg-emerald-900/60 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>🎯</span>
            <span>{language === 'ta' ? 'காந்திபுரம் ⇄ பொள்ளாச்சி (101)' : 'Gandhipuram ⇄ Pollachi (101)'}</span>
          </button>
          <button
            onClick={() => handleApplyPreset('stop-kcbt-kilambakkam', 'stop-madurai-mattuthavani', 'SETC 101')}
            className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300 text-[11px] font-semibold hover:bg-sky-900/60 whitespace-nowrap transition-colors"
          >
            {language === 'ta' ? 'சென்னை ⇄ மதுரை' : 'Chennai ⇄ Madurai (SETC 101)'}
          </button>
          <button
            onClick={() => handleApplyPreset('stop-cmbt-koyambedu', 'stop-cbe-gandhipuram', 'TNSTC 301')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-900/60 whitespace-nowrap transition-colors"
          >
            {language === 'ta' ? 'சென்னை ⇄ கோவை' : 'Chennai ⇄ Coimbatore (301)'}
          </button>
          <button
            onClick={() => handleApplyPreset('stop-cbe-singanallur', 'stop-madurai-arappalayam', 'TNSTC 204')}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[11px] font-semibold hover:bg-purple-900/60 whitespace-nowrap transition-colors"
          >
            {language === 'ta' ? 'கோவை ⇄ மதுரை' : 'Coimbatore ⇄ Madurai (204)'}
          </button>
          <button
            onClick={() => handleApplyPreset('stop-tambaram', 'stop-guindy', '21G')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[11px] font-semibold hover:bg-amber-900/60 whitespace-nowrap transition-colors"
          >
            {language === 'ta' ? 'தாம்பரம் ⇄ கிண்டி' : 'Tambaram ⇄ Guindy (21G)'}
          </button>
        </div>

        {/* Origin & Destination Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              {language === 'ta' ? 'புறப்படும் முனையம் (Origin Terminal)' : 'Origin Hub'}
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'ta' ? `${s.nameTa} (${s.districtTa || ''})` : `${s.nameEn} (${s.district || ''})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              {language === 'ta' ? 'சேருமிடம் (Destination Terminal)' : 'Destination Hub'}
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'ta' ? `${s.nameTa} (${s.districtTa || ''})` : `${s.nameEn} (${s.district || ''})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Route Score / 100 Showcase Tile */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-950 to-sky-950/60 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center font-black text-xl font-mono text-white shadow-lg shadow-indigo-500/20">
            {smartScore.aiScore}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                AI ROUTE SCORE /100
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                {language === 'ta' ? smartScore.tagLabelTa : smartScore.tagLabelEn}
              </span>
            </div>
            <h4 className="font-extrabold text-xs text-white">
              {language === 'ta' ? activeRoute?.nameTa : activeRoute?.nameEn}
            </h4>
            <div className="text-[10px] text-slate-300 flex items-center gap-2 mt-0.5 font-mono">
              <span>Time: <strong>{smartScore.travelTimeFormatted}</strong></span>
              <span>Delay: <strong className="text-amber-400">+{smartScore.expectedDelayMinutes}m</strong></span>
              <span>Reliability: <strong className="text-emerald-400">{smartScore.reliabilityPercent}%</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (activeRoute) onSelectRoute(activeRoute);
            if (primaryBus) onSelectBus(primaryBus);
          }}
          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition-all shrink-0"
        >
          {language === 'ta' ? 'தேர்வு செய்' : 'Select'}
        </button>
      </div>

      {/* Traffic Alert Banner for this corridor if affected */}
      {activeTrafficJam && (
        <div className="p-3 bg-rose-950/40 border border-rose-600/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">
              {language === 'ta' ? 'வழித்தட தாமத எச்சரிக்கை: ' : 'Corridor Bottleneck Alert: '}
            </span>
            <span>
              {language === 'ta' ? activeTrafficJam.titleTa : activeTrafficJam.titleEn}
              {' '}(+{activeTrafficJam.expectedDelayMinutes} min delay expected).
            </span>
          </div>
        </div>
      )}

      {/* Options Cards for this route */}
      <div className="flex flex-col gap-2.5">
        {/* Option 1: Primary Intercity / Express Option */}
        <div
          onClick={() => {
            if (primaryBus) onSelectBus(primaryBus);
            if (activeRoute) onSelectRoute(activeRoute);
          }}
          className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-sky-800/50 hover:border-sky-500 rounded-xl cursor-pointer transition-all flex flex-col gap-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500 text-slate-950 font-display font-black text-xs">
                {primaryBus?.routeNumber || activeRoute?.routeNumber}
              </span>
              <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                {language === 'ta' ? primaryBus?.operatorTa : primaryBus?.operator}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {language === 'ta' ? 'பரிந்துரைக்கப்பட்டது' : 'Recommended'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-display font-semibold">
                {language === 'ta' ? 'அடுத்த வருகை' : 'Next Arrival'}
              </div>
              <div className="font-display font-extrabold text-amber-400 font-mono">{primaryBus?.etaNextStopMinutes || 8} min</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-display font-semibold">
                {language === 'ta' ? 'கூட்டம்' : 'Crowd'}
              </div>
              <div className="font-bold capitalize text-slate-200">{primaryBus?.occupancy || 'medium'}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-display font-semibold">
                {language === 'ta' ? 'நம்பகத்தன்மை' : 'Reliability'}
              </div>
              <div className="font-display font-bold text-emerald-400 font-mono">{primaryBus?.reliabilityScore || 92}%</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-display font-semibold">
                {language === 'ta' ? 'கட்டணம்' : 'Fare'}
              </div>
              <div className="font-display font-bold text-sky-400 font-mono">₹{activeRoute?.fareRupees || 45}</div>
            </div>
          </div>
        </div>

        {/* Option 2: Alternate Fleet Option */}
        {secondaryBus && (
          <div
            onClick={() => onSelectBus(secondaryBus)}
            className="p-3 bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all flex flex-col gap-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-700 text-white font-black text-xs font-mono">
                  {secondaryBus.routeNumber}
                </span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                  {language === 'ta' ? secondaryBus.operatorTa : secondaryBus.operator}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {secondaryBus.isAc ? 'AC Coach' : 'Express'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <div>
                <span className="text-[9px] uppercase font-semibold block">{language === 'ta' ? 'வருகை' : 'ETA'}</span>
                <span className="font-bold text-slate-200 font-mono">{secondaryBus.etaNextStopMinutes} min</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-semibold block">{language === 'ta' ? 'கூட்டம்' : 'Crowd'}</span>
                <span className="font-bold text-emerald-400 capitalize">{secondaryBus.occupancy}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-semibold block">{language === 'ta' ? 'வேகம்' : 'Speed'}</span>
                <span className="font-bold text-slate-200 font-mono">{secondaryBus.speedKmh} km/h</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-semibold block">{language === 'ta' ? 'நிலை' : 'Status'}</span>
                <span className="font-bold text-emerald-400 capitalize">{secondaryBus.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Green Commute Footprint Metric */}
      <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl flex items-center justify-between text-xs text-emerald-200">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ta'
              ? `இப்பயணத்தில் நீங்கள் ${greenMetrics.singleTripCo2Kg} kg CO₂ உமிழ்வை மிச்சப்படுத்துகிறீர்கள்`
              : `Choosing public transit saves ~${greenMetrics.singleTripCo2Kg} kg CO₂ on this trip`}
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full shrink-0">
          Eco Choice
        </span>
      </div>
    </div>
  );
};
export default SearchRouteComparison;
