import React, { useState } from 'react';
import { Bus, BusRoute, BusStop, Language, TrafficIncident } from '../types';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  Award,
  Calendar,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';

interface AiTransportAnalyticsProps {
  buses: Bus[];
  routes: BusRoute[];
  stops: BusStop[];
  incidents: TrafficIncident[];
  language: Language;
}

export const AiTransportAnalytics: React.FC<AiTransportAnalyticsProps> = ({
  buses,
  routes,
  stops,
  incidents,
  language
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'custom'>('today');

  // Passenger volume trends by hour
  const hourlyPassengerData = [
    { hour: '06:00', passengers: 12400, delayAvg: 2 },
    { hour: '07:00', passengers: 28500, delayAvg: 4 },
    { hour: '08:00', passengers: 68200, delayAvg: 12 },
    { hour: '09:00', passengers: 74900, delayAvg: 16 },
    { hour: '10:00', passengers: 42100, delayAvg: 8 },
    { hour: '12:00', passengers: 31000, delayAvg: 3 },
    { hour: '14:00', passengers: 29400, delayAvg: 2 },
    { hour: '16:00', passengers: 48600, delayAvg: 7 },
    { hour: '17:00', passengers: 78900, delayAvg: 18 },
    { hour: '18:00', passengers: 82400, delayAvg: 21 },
    { hour: '19:00', passengers: 61200, delayAvg: 14 },
    { hour: '21:00', passengers: 24500, delayAvg: 4 }
  ];

  // Most crowded routes
  const crowdedRoutesData = [
    { route: 'MTC 500 AC', occupancy: 94, name: 'Chengalpattu ⇄ Tambaram' },
    { route: 'MTC 21G', occupancy: 88, name: 'Tambaram ⇄ Broadway' },
    { route: 'TNSTC 101', occupancy: 82, name: 'Gandhipuram ⇄ Pollachi' },
    { route: 'SETC 101', occupancy: 78, name: 'Chennai ⇄ Madurai' },
    { route: 'TNSTC 301', occupancy: 72, name: 'Chennai ⇄ Coimbatore' }
  ];

  // Most delayed corridors
  const delayedCorridorsData = [
    { corridor: 'GST Road (Pallavaram)', delayMin: 14, cause: 'Metro works & bottlenecks' },
    { corridor: 'NH 544 (Sankari Toll)', delayMin: 9, cause: 'Toll plaza queue' },
    { corridor: 'Madurai Bye-pass (MIBT)', delayMin: 8, cause: 'Interchange congestion' },
    { corridor: 'Gandhipuram flyover', delayMin: 6, cause: 'Signal phasing delay' },
    { corridor: 'Salem MGR Central', delayMin: 4, cause: 'Platform clearance' }
  ];

  // Top popular hubs
  const popularHubs = [
    { name: 'Chennai Kilambakkam (KCBT)', dailyFootfall: '142,000 commuters', rating: '98% on-time' },
    { name: 'Coimbatore Gandhipuram Central', dailyFootfall: '98,000 commuters', rating: '96% on-time' },
    { name: 'Madurai Mattuthavani (MIBT)', dailyFootfall: '112,000 commuters', rating: '94% on-time' },
    { name: 'Trichy Central Bus Stand', dailyFootfall: '84,000 commuters', rating: '95% on-time' },
    { name: 'Pollachi Central Bus Stand', dailyFootfall: '46,000 commuters', rating: '97% on-time' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-100 flex flex-col gap-4 font-sans">
      {/* Analytics Header & Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>{language === 'ta' ? 'தமிழ்நாடு AI போக்குவரத்து பகுப்பாய்வு' : 'AI Transit Intelligence Analytics'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                PHASE 18
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Corridor crowd forecasts, punctuality patterns, and passenger movement across Tamil Nadu.
            </p>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          {(['today', '7days', '30days', 'custom'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === 'today'
                ? language === 'ta' ? 'இன்று' : 'Today'
                : range === '7days'
                ? language === 'ta' ? '7 நாட்கள்' : '7 Days'
                : range === '30days'
                ? language === 'ta' ? '30 நாட்கள்' : '30 Days'
                : language === 'ta' ? 'தேர்ந்தெடுக்க' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono block">TOTAL RIDERSHIP</span>
          <span className="text-2xl font-black font-mono text-white">4.82 M</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">↑ 4.2% vs last week</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono block">AVG JOURNEY TIME</span>
          <span className="text-2xl font-black font-mono text-sky-400">42 min</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">38 districts intercity</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono block">FLEET ON-TIME ACCURACY</span>
          <span className="text-2xl font-black font-mono text-emerald-400">93.4%</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">AI schedule alignment</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono block">PEAK HOUR RUSH</span>
          <span className="text-2xl font-black font-mono text-amber-400">08:45 AM</span>
          <span className="text-[10px] text-amber-300 block mt-0.5">Evening peak: 06:15 PM</span>
        </div>
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Hourly Passenger Volume & Delay Pattern */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              {language === 'ta' ? 'மணிநேரப் பயணிகள் எண்ணிக்கை & தாமதம்' : 'Hourly Commuter Volume & Average Delay'}
            </span>
            <span className="text-[10px] text-purple-400 font-mono">Live Aggregated</span>
          </div>
          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPassengerData}>
                <defs>
                  <linearGradient id="passengerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="passengers" stroke="#c084fc" fillOpacity={1} fill="url(#passengerGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Most Crowded Corridors Bar Chart */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-rose-400" />
              {language === 'ta' ? 'அதிக பயணிகள் கூட்டம் கொண்ட வழித்தடங்கள்' : 'Most Crowded Routes (Occupancy %)'}
            </span>
            <span className="text-[10px] text-rose-400 font-mono">Top 5 Corridors</span>
          </div>
          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crowdedRoutesData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="route" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="occupancy" fill="#f43f5e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Corridors and Popular Bus Stands Ranking Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Most Delayed Corridors */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {language === 'ta' ? 'அதிக தாமதம் ஏற்படும் பகுதிகள்' : 'Most Delayed Corridors & Root Causes'}
          </span>
          <div className="flex flex-col gap-2 mt-1">
            {delayedCorridorsData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-850">
                <div>
                  <span className="font-bold text-white">{d.corridor}</span>
                  <span className="text-[10px] text-slate-400 block">{d.cause}</span>
                </div>
                <span className="font-mono font-bold text-rose-400">+{d.delayMin}m avg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Interchange Hubs */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            {language === 'ta' ? 'அதிக பயணிகள் பயன்படுத்தும் பேருந்து நிலையங்கள்' : 'Top Passenger Hubs & Reliability'}
          </span>
          <div className="flex flex-col gap-2 mt-1">
            {popularHubs.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-850">
                <div>
                  <span className="font-bold text-white">{h.name}</span>
                  <span className="text-[10px] text-slate-400 block">{h.dailyFootfall}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-[11px]">{h.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
