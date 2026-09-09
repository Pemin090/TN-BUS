import React from 'react';
import { Bus, BusRoute, BusStop, Language, StopPrediction, TrafficIncident } from '../types';
import { predictArrivalForStop } from '../services/predictionEngine';
import { X, Clock, Navigation, ShieldCheck, Users, Zap, Bus as BusIcon, AlertTriangle } from 'lucide-react';
import { translations } from '../i18n/translations';

interface StopDetailsCardProps {
  stop: BusStop;
  buses: Bus[];
  routes: BusRoute[];
  incidents: TrafficIncident[];
  onClose: () => void;
  onSelectBus: (bus: Bus) => void;
  language: Language;
}

export const StopDetailsCard: React.FC<StopDetailsCardProps> = ({
  stop,
  buses,
  routes,
  incidents,
  onClose,
  onSelectBus,
  language
}) => {
  const t = translations[language];

  // Find incoming buses whose route passes this stop
  const incomingPredictions: { prediction: StopPrediction; bus: Bus; route: BusRoute }[] = [];

  buses.forEach((bus) => {
    const route = routes.find((r) => r.id === bus.routeId);
    if (!route) return;
    const hasStop = route.stops.some((s) => s.stopId === stop.id);
    if (hasStop) {
      const pred = predictArrivalForStop(bus, stop, route, incidents);
      incomingPredictions.push({
        prediction: pred,
        bus,
        route
      });
    }
  });

  // Sort by ETA ascending
  incomingPredictions.sort((a, b) => a.prediction.etaMinutes - b.prediction.etaMinutes);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col gap-3.5 max-h-[80vh] overflow-y-auto">
      {/* Top Title */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white">
              {language === 'ta' ? stop.nameTa : stop.nameEn}
            </h3>
            {stop.isMajorHub && (
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                {language === 'ta' ? 'முக்கிய முனையம்' : 'Major Hub'}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {language === 'ta' ? 'இணைக்கும் வழித்தடங்கள்:' : 'Connecting Routes:'}{' '}
            <span className="text-slate-200 font-semibold">{stop.connectingRoutes.join(', ')}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Safety and Crowd status chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {stop.isSafeNightStop && (
          <div className="px-2.5 py-1 rounded-xl bg-purple-950/50 border border-purple-800/40 text-purple-300 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'ta' ? 'இரவு பாதுகாப்பான நிறுத்தம் (CCTV & வெளிச்சம்)' : 'Verified Safe Night Hub (CCTV & Well-Lit)'}</span>
          </div>
        )}
        <div className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ta' ? `கூட்ட நெரிசல்: ${stop.currentCrowdScore || 65}%` : `Stop Crowd: ${stop.currentCrowdScore || 65}%`}</span>
        </div>
      </div>

      {/* Live Bus Arrival Predictions List (Feature 2) */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{language === 'ta' ? 'அடுத்த பேருந்து வருகை கணிப்புகள்' : 'Upcoming Bus Arrival Predictions'}</span>
        </h4>

        {incomingPredictions.length === 0 ? (
          <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-400">
            {language === 'ta'
              ? 'இந்த நிறுத்தத்திற்கு தற்போது இயங்கும் பேருந்துகள் கண்டறியப்படவில்லை.'
              : 'No active buses currently on route towards this stop.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {incomingPredictions.map(({ prediction, bus, route }) => (
              <div
                key={bus.id}
                onClick={() => onSelectBus(bus)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500 rounded-xl cursor-pointer transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-black text-xs rounded border border-sky-500/30">
                      {prediction.routeNumber}
                    </span>
                    <span className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors">
                      {prediction.regNumber}
                    </span>
                    {prediction.isAc && (
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/50 px-1 rounded border border-cyan-800">
                        AC
                      </span>
                    )}
                  </div>

                  {/* Primary Arrival ETA */}
                  <div className="text-right">
                    <div className="text-base font-black text-amber-400 flex items-center gap-1 justify-end">
                      <span>{prediction.etaMinutes} min away</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'ta' ? 'அடுத்தது:' : 'Next following:'} {prediction.followingBusEtaMinutes} min
                    </div>
                  </div>
                </div>

                {/* Prediction Metrics Bar */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-slate-400">{language === 'ta' ? 'தாமதம்' : 'Traffic Delay'}</div>
                    <div className="font-bold text-amber-300">
                      +{prediction.expectedDelayMinutes} min
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">{language === 'ta' ? 'தூரம்' : 'Distance'}</div>
                    <div className="font-bold text-slate-200">
                      {prediction.distanceKm} km
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">{language === 'ta' ? 'துல்லியம்' : 'Confidence'}</div>
                    <div className="font-bold text-emerald-400">
                      {prediction.confidenceScore}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
