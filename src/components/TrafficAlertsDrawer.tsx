import React, { useState } from 'react';
import { TrafficIncident, WeatherRiskArea, EventTrafficZone, Language, TrafficSeverity } from '../types';
import { AlertTriangle, CloudRain, Flame, Filter, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { translations } from '../i18n/translations';

interface TrafficAlertsDrawerProps {
  incidents: TrafficIncident[];
  weatherRisks: WeatherRiskArea[];
  eventZones: EventTrafficZone[];
  onSelectIncident: (inc: TrafficIncident) => void;
  language: Language;
}

export const TrafficAlertsDrawer: React.FC<TrafficAlertsDrawerProps> = ({
  incidents,
  weatherRisks,
  eventZones,
  onSelectIncident,
  language
}) => {
  const t = translations[language];
  const [severityFilter, setSeverityFilter] = useState<'all' | TrafficSeverity>('all');

  const filteredIncidents = incidents.filter((inc) => {
    if (!inc.active) return false;
    if (severityFilter === 'all') return true;
    return inc.severity === severityFilter;
  });

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto text-slate-100 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{language === 'ta' ? 'ஸ்மார்ட் போக்குவரத்து எச்சரிக்கைகள்' : 'Smart Traffic & Corridor Alerts'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ta'
              ? 'சாலை விபத்துகள், மெட்ரோ பணிகள், நீர் தேக்கம் மற்றும் நெரிசல் அறிவிப்புகள்'
              : 'Multi-corridor incident monitoring with automated delay forecasts'}
          </p>
        </div>

        {/* Severity Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['all', 'red', 'orange', 'yellow'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all uppercase text-[11px] ${
                severityFilter === sev
                  ? 'bg-slate-800 text-white shadow border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Active Weather Hazard Warnings */}
      {weatherRisks.length > 0 && (
        <div className="p-4 bg-cyan-950/40 border border-cyan-700/50 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm">
            <CloudRain className="w-4 h-4" />
            <span>{language === 'ta' ? 'பருவமழை / நீர் தேக்க எச்சரிக்கை' : 'Active Monsoon & Waterlogging Hazards'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {weatherRisks.map((w) => (
              <div key={w.id} className="p-3 bg-slate-950/70 rounded-xl border border-cyan-900/60 text-xs">
                <div className="font-bold text-cyan-200">
                  {language === 'ta' ? w.areaNameTa : w.areaNameEn}
                </div>
                <p className="text-[11px] text-cyan-300/80 mt-1">
                  {language === 'ta' ? w.advisoryTa : w.advisoryEn}
                </p>
                <div className="mt-2 text-[10px] text-amber-300 font-semibold">
                  {language === 'ta' ? 'எதிர்பார்க்கும் தாமதம்:' : 'Expected delay:'} +{w.expectedDelayMinutes} mins
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incident List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredIncidents.map((inc) => {
          const config = {
            red: { bg: 'bg-rose-950/30', border: 'border-rose-600/40', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', label: 'Severe' },
            orange: { bg: 'bg-orange-950/30', border: 'border-orange-600/40', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40', label: 'Heavy' },
            yellow: { bg: 'bg-amber-950/30', border: 'border-amber-600/40', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', label: 'Moderate' },
            green: { bg: 'bg-emerald-950/30', border: 'border-emerald-600/40', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', label: 'Normal' }
          }[inc.severity];

          return (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className={`p-4 rounded-2xl border ${config.bg} ${config.border} hover:border-sky-500 cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-md`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${config.badge}`}>
                    {config.label}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">
                    +{inc.expectedDelayMinutes}m delay
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-white mt-2">
                  {language === 'ta' ? inc.titleTa : inc.titleEn}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {language === 'ta' ? inc.descriptionTa : inc.descriptionEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{inc.roadName}</span>
                </span>
                <span className="text-slate-500">Routes: {inc.affectedRouteNumbers.join(', ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
