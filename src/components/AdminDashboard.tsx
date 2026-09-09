import React from 'react';
import { Bus, BusRoute, TrafficIncident, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, AlertTriangle, Bus as BusIcon, Clock, CheckCircle2, Shield, Radio, ArrowUpRight, Users } from 'lucide-react';
import { translations } from '../i18n/translations';
import { RouteCrewWarningSystem } from './RouteCrewWarningSystem';

interface AdminDashboardProps {
  buses: Bus[];
  routes: BusRoute[];
  incidents: TrafficIncident[];
  onVerifyIncident: (id: string) => void;
  onSelectBus: (bus: Bus) => void;
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  buses,
  routes,
  incidents,
  onVerifyIncident,
  onSelectBus,
  language
}) => {
  const t = translations[language];

  const hourlyDelayData = [
    { time: '06:00', delay: 2, buses: 32 },
    { time: '07:30', delay: 5, buses: 45 },
    { time: '08:30', delay: 14, buses: 58 },
    { time: '09:30', delay: 18, buses: 62 },
    { time: '11:00', delay: 7, buses: 48 },
    { time: '13:00', delay: 4, buses: 40 },
    { time: '15:00', delay: 6, buses: 44 },
    { time: '17:30', delay: 19, buses: 64 },
    { time: '19:00', delay: 22, buses: 65 },
    { time: '21:00', delay: 8, buses: 38 }
  ];

  const corridorHealth = [
    { corridor: 'GST Road (NH 45)', delay: 12, status: 'Congested', color: '#ef4444' },
    { corridor: 'Anna Salai Corridor', delay: 6, status: 'Moderate', color: '#f59e0b' },
    { corridor: 'OMR IT Expressway', delay: 4, status: 'Clear', color: '#10b981' },
    { corridor: 'Inner Ring Road', delay: 8, status: 'Moderate', color: '#f59e0b' }
  ];

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto text-slate-100 flex flex-col gap-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-black text-white tracking-tight">
              {language === 'ta' ? 'தமிழ்நாடு போக்குவரத்து கட்டுப்பாட்டு அறை' : 'TN Transit Operational Command Center'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ta'
              ? 'MTC சென்னை & TNSTC மண்டல வழித்தடங்களின் நேரலை மேலாண்மை'
              : 'Real-time telemetry, automated delay predictions, corridor congestion monitoring'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-sky-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>GPS Pings: Active 48/48</span>
          </span>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'ta' ? 'செயலில் உள்ள பேருந்துகள்' : 'Active Fleet Buses'}</span>
            <BusIcon className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {buses.length * 12}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>98.2% telemetry online</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'ta' ? 'சராசரி தாமதம்' : 'Avg Network Delay'}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2">
            +6.4 min
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            GST corridor heaviest (+12m)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'ta' ? 'நேரந்தவறாமை' : 'On-Time Punctuality'}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            87.6%
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Above state target (85%)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'ta' ? 'பதிவான தடைகள்' : 'Active Incidents'}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            {incidents.filter((i) => i.active).length}
          </div>
          <div className="text-[11px] text-rose-300 mt-1">
            1 requires field officer check
          </div>
        </div>
      </div>

      {/* Crew Compliance & Statutory Shift Warning System */}
      <RouteCrewWarningSystem
        routes={routes}
        buses={buses}
        language={language}
        onSelectBus={onSelectBus}
      />

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Delay Trend Chart */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">
              {language === 'ta' ? 'மணிநேர போக்குவரத்து தாமத போக்கு' : 'Hourly Bus Delay Trend (Minutes)'}
            </h3>
            <span className="text-[10px] text-slate-400">Past 24 Hours</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyDelayData}>
                <defs>
                  <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="delay" stroke="#f59e0b" strokeWidth={2} fill="url(#delayGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Corridor Health Status */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">
              {language === 'ta' ? 'முக்கிய வழித்தடங்களின் நிலை' : 'Corridor Congestion & Delay Status'}
            </h3>
            <span className="text-[10px] text-slate-400">Live Telemetry</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corridorHealth} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} unit="m" />
                <YAxis dataKey="corridor" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="delay" radius={[0, 6, 6, 0]}>
                  {corridorHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Incident Verification & Dispatch Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-black text-sm text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{language === 'ta' ? 'செயலில் உள்ள போக்குவரத்து தடைகள் & சரிபார்ப்பு' : 'Active Road Incidents & Field Verification'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                <th className="pb-2.5">Corridor / Incident</th>
                <th className="pb-2.5">Type</th>
                <th className="pb-2.5">Severity</th>
                <th className="pb-2.5">Delay</th>
                <th className="pb-2.5">Reports</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-bold text-white">
                    <div>{language === 'ta' ? inc.titleTa : inc.titleEn}</div>
                    <div className="text-[10px] font-normal text-slate-400">{inc.roadName}</div>
                  </td>
                  <td className="py-2.5 text-slate-300 capitalize">{inc.type.replace('_', ' ')}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'red'
                          ? 'bg-rose-500/20 text-rose-300'
                          : inc.severity === 'orange'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {inc.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-amber-400">+{inc.expectedDelayMinutes} min</td>
                  <td className="py-2.5 text-slate-300">{inc.verificationCount} verified</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onVerifyIncident(inc.id)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[10px] shadow transition-colors inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verify & Alert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
