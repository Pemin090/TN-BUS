import React from 'react';
import { Bus, BusRoute, BusStop, Language, TrafficIncident, WeatherRiskArea } from '../types';
import { calculateAiEtaPrediction, calculateCrowdPrediction, evaluateDelayDetection } from '../services/aiEtaEngine';
import {
  MapPin,
  Clock,
  Users,
  Compass,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Navigation,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';

interface NextStopIntelligenceCardProps {
  bus: Bus;
  route: BusRoute | null;
  stops: BusStop[];
  incidents: TrafficIncident[];
  weatherRisks: WeatherRiskArea[];
  language: Language;
  onSelectStop?: (stop: BusStop) => void;
}

export const NextStopIntelligenceCard: React.FC<NextStopIntelligenceCardProps> = ({
  bus,
  route,
  stops,
  incidents,
  weatherRisks,
  language,
  onSelectStop
}) => {
  const routeStops = route?.stops || [];

  // Determine current stop, next stop, following stop, destination
  const nextStopObj = stops.find((s) => s.id === bus.nextStopId) || stops[0];
  const nextStopIndex = routeStops.findIndex((s) => s.stopId === bus.nextStopId);

  const prevStopIndex = nextStopIndex > 0 ? nextStopIndex - 1 : 0;
  const prevStopObj = stops.find((s) => s.id === routeStops[prevStopIndex]?.stopId) || stops[0];

  const followingStopIndex = nextStopIndex + 1 < routeStops.length ? nextStopIndex + 1 : -1;
  const followingStopObj = followingStopIndex !== -1 ? stops.find((s) => s.id === routeStops[followingStopIndex]?.stopId) : null;

  const destStopObj = routeStops.length > 0 ? stops.find((s) => s.id === routeStops[routeStops.length - 1]?.stopId) : null;

  // AI predictions
  const aiEta = calculateAiEtaPrediction(bus, route, incidents, weatherRisks, nextStopObj);
  const crowdPred = calculateCrowdPrediction(bus);
  const delayDetection = evaluateDelayDetection(bus, route, [bus], route ? [route] : [], incidents);

  // Bearing direction name
  const getBearingLabel = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N (North)';
    if (deg >= 22.5 && deg < 67.5) return 'NE (North-East)';
    if (deg >= 67.5 && deg < 112.5) return 'E (East)';
    if (deg >= 112.5 && deg < 157.5) return 'SE (South-East)';
    if (deg >= 157.5 && deg < 202.5) return 'S (South)';
    if (deg >= 202.5 && deg < 247.5) return 'SW (South-West)';
    if (deg >= 247.5 && deg < 292.5) return 'W (West)';
    return 'NW (North-West)';
  };

  const distToNextKm = Math.max(0.6, Math.round(((bus.etaNextStopMinutes || 4) / 60) * Math.max(22, bus.speedKmh) * 10) / 10);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl text-slate-100 flex flex-col gap-3 relative overflow-hidden">
      {/* Simulation Notice Header */}
      <div className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-800/80">
        <span className="font-mono text-emerald-400 flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          {language === 'ta' ? 'அடுத்த நிறுத்த நுண்ணறிவு (நேரலை)' : 'NEXT STOP INTELLIGENCE'}
        </span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
          DEMO TELEMETRY / AIS-140 SIMULATOR
        </span>
      </div>

      {/* Primary Highlight Card: NEXT STOP */}
      <div className="bg-gradient-to-br from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/40 rounded-xl p-3.5 shadow-lg relative">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5 animate-bounce" />
              <span>{language === 'ta' ? 'அடுத்த பேருந்து நிறுத்தம்' : 'NEXT STOP (IMMINENT)'}</span>
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {nextStopObj ? (language === 'ta' ? nextStopObj.nameTa : nextStopObj.nameEn) : 'Next Stop'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {nextStopObj?.district ? (language === 'ta' ? nextStopObj.districtTa : nextStopObj.district) : ''}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              {language === 'ta' ? 'கணித்த வருகை' : 'AI ETA'}
            </span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {bus.etaNextStopMinutes || 4} min
            </span>
            <span className="text-[11px] block font-mono text-slate-300">
              {aiEta.formattedEta}
            </span>
          </div>
        </div>

        {/* Next Stop Key Matrix Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Distance */}
          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'ta' ? 'தூரம்' : 'Distance'}
            </span>
            <span className="font-bold text-white font-mono">{distToNextKm} km</span>
          </div>

          {/* Expected Crowd */}
          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'ta' ? 'எதிர்பார்க்கும் கூட்டம்' : 'Crowd'}
            </span>
            <span className={`font-bold flex items-center gap-1 ${
              crowdPred.predictedLevel === 'high' || crowdPred.predictedLevel === 'very_high'
                ? 'text-rose-400'
                : crowdPred.predictedLevel === 'medium'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                crowdPred.predictedLevel === 'high' || crowdPred.predictedLevel === 'very_high'
                  ? 'bg-rose-500'
                  : crowdPred.predictedLevel === 'medium'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`} />
              <span>{crowdPred.predictedNextStopPercent}%</span>
            </span>
          </div>

          {/* Traffic Status */}
          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'ta' ? 'போக்குவரத்து' : 'Traffic'}
            </span>
            <span className={`font-bold text-xs ${
              bus.delayMinutes > 5 ? 'text-rose-400' : bus.delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {bus.delayMinutes > 5
                ? language === 'ta' ? 'கடும் நெரிசல்' : 'Heavy'
                : bus.delayMinutes > 0
                ? language === 'ta' ? 'மிதமான நெரிசல்' : 'Moderate'
                : language === 'ta' ? 'தடையில்லா ஓட்டம்' : 'Free Flow'}
            </span>
          </div>
        </div>
      </div>

      {/* Stop Progression Hierarchy: CURRENT STOP ↓ NEXT STOP ↓ FOLLOWING STOP ↓ DESTINATION */}
      <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          {language === 'ta' ? 'நிறுத்த வரிசைப் பாதை' : 'STOP PROGRESSION HIERARCHY'}
        </span>

        <div className="flex flex-col gap-2 relative pl-4 border-l-2 border-slate-700 ml-2 py-1">
          {/* 1. CURRENT / PREVIOUS STOP */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 -ml-[22px] border-2 border-slate-950" />
              <span className="text-slate-400">
                {language === 'ta' ? 'முந்தைய நிறுத்தம்:' : 'CURRENT / PREVIOUS:'}
              </span>
              <span className="font-semibold text-slate-300">
                {prevStopObj ? (language === 'ta' ? prevStopObj.nameTa : prevStopObj.nameEn) : 'Origin'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Departed</span>
          </div>

          {/* 2. NEXT STOP (Active) */}
          <div className="flex items-center justify-between text-xs bg-sky-950/40 p-1.5 rounded-lg border border-sky-500/30 -ml-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 -ml-[20px] border-2 border-slate-950 animate-pulse" />
              <span className="font-bold text-sky-300">
                {language === 'ta' ? 'அடுத்த நிறுத்தம்:' : 'NEXT STOP:'}
              </span>
              <span className="font-bold text-white">
                {nextStopObj ? (language === 'ta' ? nextStopObj.nameTa : nextStopObj.nameEn) : 'Next Stop'}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">
              in {bus.etaNextStopMinutes || 4}m
            </span>
          </div>

          {/* 3. FOLLOWING STOP */}
          {followingStopObj && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600 -ml-[22px] border-2 border-slate-950" />
                <span className="text-slate-400">
                  {language === 'ta' ? 'அதற்கு அடுத்த நிறுத்தம்:' : 'FOLLOWING STOP:'}
                </span>
                <span className="font-semibold text-slate-300">
                  {language === 'ta' ? followingStopObj.nameTa : followingStopObj.nameEn}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                +{(bus.etaNextStopMinutes || 4) + 8}m
              </span>
            </div>
          )}

          {/* 4. DESTINATION */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 -ml-[22px] border-2 border-slate-950" />
              <span className="text-amber-400 font-bold">
                {language === 'ta' ? 'சேருமிடம்:' : 'DESTINATION:'}
              </span>
              <span className="font-bold text-white">
                {destStopObj ? (language === 'ta' ? destStopObj.nameTa : destStopObj.nameEn) : (route ? (language === 'ta' ? route.destinationTa : route.destinationEn) : 'Terminal')}
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold">
              Final Bay
            </span>
          </div>
        </div>
      </div>

      {/* Bus Telematics Snapshot: Speed, Heading, AI Confidence */}
      <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <Gauge className="w-3 h-3 text-sky-400" />
            {language === 'ta' ? 'வேகம்' : 'Speed'}
          </span>
          <span className="font-bold font-mono text-white text-sm">
            {bus.speedKmh} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <Compass className="w-3 h-3 text-amber-400" />
            {language === 'ta' ? 'திசை' : 'Direction'}
          </span>
          <span className="font-bold font-mono text-white text-xs truncate block" title={`${bus.bearing}° ${getBearingLabel(bus.bearing)}`}>
            {bus.bearing}° {getBearingLabel(bus.bearing).split(' ')[0]}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {language === 'ta' ? 'துல்லியம்' : 'Confidence'}
          </span>
          <span className="font-bold font-mono text-emerald-400 text-sm">
            {aiEta.confidencePercent}%
          </span>
        </div>
      </div>

      {/* Delay Alert Callout if Delayed */}
      {delayDetection.isDelayed && (
        <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-xl flex flex-col gap-1.5 text-xs text-rose-200">
          <div className="flex items-center gap-1.5 font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {language === 'ta' ? '⚠️ போக்குவரத்து தாமதம் கண்டறியப்பட்டது' : '⚠️ DELAY DETECTED'}
            </span>
          </div>
          <p className="text-[11px] text-rose-200">
            {language === 'ta' ? delayDetection.reasonTa : delayDetection.reasonEn}
          </p>
          <div className="flex items-center justify-between text-[10px] text-rose-300 font-mono mt-1">
            <span>
              {language === 'ta' ? 'எதிர்பார்க்கும் கூடுதல் தாமதம்:' : 'Expected delay:'}{' '}
              <strong className="text-white">+{delayDetection.delayMinutes} min</strong>
            </span>
            {delayDetection.suggestedAlternatives[0] && (
              <span className="text-sky-300 underline cursor-pointer">
                Alt: {delayDetection.suggestedAlternatives[0].busNumber}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
