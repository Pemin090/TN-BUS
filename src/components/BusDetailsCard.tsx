import React, { useState } from 'react';
import { Bus, BusRoute, BusStop, Language, TrafficIncident, WeatherRiskArea } from '../types';
import { DepotAndCrewView } from './DepotAndCrewView';
import { NextStopIntelligenceCard } from './NextStopIntelligenceCard';
import { BusIotTelemetryCard } from './BusIotTelemetryCard';
import {
  X,
  Navigation,
  AlertTriangle,
  ShieldCheck,
  Heart,
  Users,
  Clock,
  Zap,
  MapPin,
  Bell,
  Fuel,
  Gauge,
  UserCheck,
  CreditCard,
  Thermometer,
  Layers,
  Sparkles,
  Building2,
  Phone,
  Cpu
} from 'lucide-react';
import { translations } from '../i18n/translations';

interface BusDetailsCardProps {
  bus: Bus;
  route: BusRoute | null;
  stops: BusStop[];
  incidents: TrafficIncident[];
  weatherRisks: WeatherRiskArea[];
  onClose: () => void;
  onSelectStop: (stop: BusStop) => void;
  onSetGetDownAlert: (bus: Bus, destStopId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  language: Language;
}

export const BusDetailsCard: React.FC<BusDetailsCardProps> = ({
  bus,
  route,
  stops,
  incidents,
  weatherRisks,
  onClose,
  onSelectStop,
  onSetGetDownAlert,
  isFavorite,
  onToggleFavorite,
  language
}) => {
  const t = translations[language];
  const [activeCardTab, setActiveCardTab] = useState<'next_stop' | 'telemetry' | 'iot' | 'crew_depot' | 'route'>('next_stop');
  const [selectedDestStopId, setSelectedDestStopId] = useState<string>(
    route?.stops[route.stops.length - 1]?.stopId || ''
  );
  const [alertSetSuccess, setAlertSetSuccess] = useState(false);
  const [show3dChassis, setShow3dChassis] = useState(true);

  // Calculate route stops
  const routeStopsWithDetails = route
    ? route.stops.map((s) => {
        const found = stops.find((st) => st.id === s.stopId);
        return {
          ...s,
          details: found
        };
      })
    : [];

  const handleCreateAlert = () => {
    if (selectedDestStopId) {
      onSetGetDownAlert(bus, selectedDestStopId);
      setAlertSetSuccess(true);
      setTimeout(() => setAlertSetSuccess(false), 3000);
    }
  };

  // Crowd level styling
  const crowdConfig = {
    low: { label: t.crowdLow, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' },
    medium: { label: t.crowdMedium, color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400' },
    high: { label: t.crowdHigh, color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', dot: 'bg-orange-400' },
    very_high: { label: t.crowdVeryHigh, color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dot: 'bg-rose-500' }
  }[bus.occupancy];

  const telem = bus.telemetry;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col gap-3.5 relative max-h-[88vh] overflow-y-auto font-sans">
      {/* Header Bar with Distinctive Typography */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/25 to-blue-600/30 border border-sky-400/40 flex items-center justify-center font-display font-extrabold text-sky-400 text-xl shadow-lg shadow-sky-500/10">
            {bus.routeNumber}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-mono-transit font-bold text-base text-white tracking-wide">
                {bus.registrationNumber}
              </h3>
              {/* Operator Category Badge */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-display font-bold border ${
                bus.operatorCategory === 'SETC'
                  ? 'bg-rose-950/70 text-rose-300 border-rose-600/50'
                  : bus.operatorCategory === 'TNSTC'
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50'
                  : 'bg-sky-950/70 text-sky-300 border-sky-500/50'
              }`}>
                {bus.operatorCategory}
                {bus.tnstcDivision ? ` • ${bus.tnstcDivision}` : ''}
              </span>
              {bus.serviceType && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                  {bus.serviceType}
                </span>
              )}
              {bus.district && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold">
                  📍 {language === 'ta' && bus.districtTa ? bus.districtTa : bus.district}
                </span>
              )}
              {bus.isAc && (
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-display font-bold">
                  AC
                </span>
              )}
              {(bus.isWomenPinkBus || route?.isWomenPinkBus) && (
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-display font-bold">
                  {language === 'ta' ? 'மகளிர் இலவசம் (₹0)' : 'Pink Bus (₹0 Free)'}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-xs text-slate-400 font-sans">
                {language === 'ta' ? bus.operatorTa : bus.operator}
              </p>
              {bus.availableSeats !== undefined && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 shrink-0">
                  {bus.availableSeats} / {bus.totalSeats || 48} {language === 'ta' ? 'காலி ஆசனங்கள்' : 'Free Seats'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-xl border transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Segmented Sub-Navigation for Bus Details */}
      <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCardTab('next_stop')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all ${
            activeCardTab === 'next_stop'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ta' ? 'அடுத்த நிறுத்தம் & AI ETA' : 'Next Stop & AI ETA'}</span>
        </button>

        <button
          onClick={() => setActiveCardTab('telemetry')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all ${
            activeCardTab === 'telemetry'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? '3D வேகம்' : '3D Chassis'}</span>
        </button>

        <button
          onClick={() => setActiveCardTab('iot')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all ${
            activeCardTab === 'iot'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'ta' ? 'IoT உணரிகள் & நலம்' : 'IoT & Health'}</span>
        </button>

        <button
          onClick={() => setActiveCardTab('crew_depot')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all ${
            activeCardTab === 'crew_depot'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ta' ? 'பணிமனை & பணியாளர்கள்' : 'Depot & Crew'}</span>
        </button>

        <button
          onClick={() => setActiveCardTab('route')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all ${
            activeCardTab === 'route'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'நிறுத்தங்கள்' : 'Stops'}</span>
        </button>
      </div>

      {/* TAB 0: NEXT STOP INTELLIGENCE & AI ETA */}
      {activeCardTab === 'next_stop' && (
        <NextStopIntelligenceCard
          bus={bus}
          route={route}
          stops={stops}
          incidents={incidents}
          weatherRisks={weatherRisks}
          language={language}
          onSelectStop={onSelectStop}
        />
      )}

      {/* TAB 0.5: IoT TELEMETRY & PREDICTIVE FLEET HEALTH */}
      {activeCardTab === 'iot' && (
        <BusIotTelemetryCard bus={bus} language={language} />
      )}

      {/* TAB 1: CREW & DEPOT ROSTER */}
      {activeCardTab === 'crew_depot' && (
        <DepotAndCrewView bus={bus} language={language} />
      )}

      {/* TAB 2: 3D CHASSIS & LIVE TELEMETRY */}
      {activeCardTab === 'telemetry' && (
        <>
          {/* Quick Depot & Crew Teaser Strip */}
          <div
            onClick={() => setActiveCardTab('crew_depot')}
            className="p-2.5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400 font-medium">
                  {language === 'ta' ? 'பணிமனை:' : 'Depot:'}{' '}
                </span>
                <span className="text-white font-bold">{bus.telemetry?.depotName || `${bus.district} Central`}</span>
                <span className="mx-1 text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">{bus.telemetry?.driverName || 'K. Murugesan'} (On-Duty)</span>
              </div>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold hover:underline">
              {language === 'ta' ? 'முழு விவரம் →' : 'View Crew Roster →'}
            </span>
          </div>

          {/* 3D Interactive Isometric Bus Chassis Visualizer */}
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-display font-bold text-sky-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? '3D பேருந்து உள்அமைப்பு & சுமை' : '3D Chassis & Cabin Load'}</span>
          </div>
          <span className="font-mono-transit text-[11px] text-slate-400">
            {telem ? `${telem.passengerCount}/${telem.totalSeats} Seats` : `${bus.speedKmh} km/h`}
          </span>
        </div>

        {/* Isometric 3D Bus Render Card with Realistic Coach Livery */}
        <div className="w-full h-32 relative flex items-center justify-center perspective-800">
          {/* Determine operator livery styling */}
          {(() => {
            const isPink = bus.isWomenPinkBus;
            const isSetc = bus.operator === 'SETC';
            const isTnstc = bus.operator === 'TNSTC';

            const coachSkin = isPink
              ? 'from-pink-950 via-rose-900 to-pink-950 border-pink-400/70 shadow-[0_0_20px_rgba(236,72,153,0.25)]'
              : isSetc
              ? 'from-red-950 via-rose-900 to-red-950 border-amber-400/70 shadow-[0_0_20px_rgba(225,29,72,0.25)]'
              : isTnstc
              ? 'from-emerald-950 via-green-900 to-emerald-950 border-emerald-400/70 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'from-blue-950 via-sky-900 to-blue-950 border-sky-400/70 shadow-[0_0_20px_rgba(56,189,248,0.25)]';

            const liveryStripe = isPink
              ? 'bg-pink-300'
              : isSetc
              ? 'bg-amber-400'
              : isTnstc
              ? 'bg-amber-100'
              : 'bg-white';

            const corpBadgeText = isPink
              ? 'மகளிர் இலவச பயணம்'
              : isSetc
              ? 'SETC ULTRA DELUXE'
              : isTnstc
              ? `TNSTC • ${bus.district || 'TAMIL NADU'}`
              : 'MTC CHENNAI METRO';

            return (
              <div
                className="w-72 h-22 relative transition-transform duration-500 preserve-3d"
                style={{ transform: 'rotateX(28deg) rotateY(-22deg) rotateZ(3deg)' }}
              >
                {/* Ground contact shadow with asphalt tyre marks */}
                <div className="absolute -bottom-3 left-2 right-2 h-14 bg-black/60 rounded-full blur-md" />

                {/* Main Coach Body 3D Extrusion */}
                <div className={`w-full h-full bg-gradient-to-r ${coachSkin} border-2 rounded-xl shadow-2xl relative overflow-hidden backdrop-blur-sm`}>
                  {/* Realistic Headlight Beams */}
                  <div className="absolute -top-3 -left-6 w-20 h-14 bg-amber-200/30 blur-sm transform -rotate-45 pointer-events-none" />
                  <div className="absolute -top-1 -left-4 w-12 h-8 bg-sky-200/40 blur-[2px] transform -rotate-45 pointer-events-none" />

                  {/* Exterior Livery Waistband Stripe */}
                  <div className={`absolute top-2 left-0 right-0 h-[2px] ${liveryStripe} opacity-80 shadow-[0_0_4px_currentColor]`} />
                  <div className={`absolute bottom-2 left-0 right-0 h-[2px] ${liveryStripe} opacity-80 shadow-[0_0_4px_currentColor]`} />

                  {/* Exterior Corporation Stamped Livery Badge */}
                  <div className="absolute top-0 right-3 px-1.5 py-0.2 rounded-b bg-black/70 border-x border-b border-white/20 text-[8px] font-mono font-bold text-amber-300 tracking-wider">
                    {corpBadgeText}
                  </div>

                  {/* Cabin Seating Grid */}
                  <div className="p-1.5 h-full flex flex-col justify-between relative z-10">
                    {/* Upper Seat Rows */}
                    <div className="flex items-center justify-between gap-1 px-2 pt-1">
                      {/* Driver Cockpit Seat */}
                      <div className="w-3.5 h-3.5 rounded bg-sky-500 border border-sky-200 text-[8px] flex items-center justify-center font-bold text-slate-950 shadow">
                        D
                      </div>
                      <div className="flex-1 flex justify-evenly">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={`top-${i}`}
                            className={`w-2 h-2 rounded-[2px] shadow-sm ${
                              i % 3 === 0 ? 'bg-emerald-400' : 'bg-amber-400/90'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Central Aisle */}
                    <div className="h-[1px] bg-slate-700/60 mx-4" />

                    {/* Lower Seat Rows */}
                    <div className="flex items-center justify-between gap-1 px-2 pb-1">
                      <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-600 text-[7px] flex items-center justify-center text-slate-300">
                        C
                      </div>
                      <div className="flex-1 flex justify-evenly">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={`bot-${i}`}
                            className={`w-2 h-2 rounded-[2px] shadow-sm ${
                              i === 4 || i === 7 ? 'bg-emerald-400' : 'bg-rose-400/90'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aerodynamic Roof AC Unit */}
                {bus.isAc && (
                  <div className="absolute -top-2 left-16 w-32 h-3.5 bg-neutral-900 border border-neutral-600 rounded-md shadow-lg flex items-center justify-evenly">
                    <div className="w-2 h-1 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-[7px] font-mono text-cyan-300 font-bold">CARRIER AC</span>
                    <div className="w-2 h-1 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Realistic Heavy-Duty Radial Tyres */}
                <div className="absolute -bottom-2 left-6 w-7 h-3 bg-neutral-950 border-2 border-neutral-700 rounded-md shadow-inner" />
                <div className="absolute -bottom-2 right-6 w-8 h-3 bg-neutral-950 border-2 border-neutral-700 rounded-md shadow-inner" />
              </div>
            );
          })()}
        </div>

        {/* Chassis Model Telemetry Legend */}
        {telem && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="text-slate-400 truncate max-w-[200px] font-sans">
              {telem.vehicleModel}
            </div>
            <div className="font-mono-transit text-sky-400 font-bold">
              {telem.depotCode}
            </div>
          </div>
        )}
      </div>

      {/* Breakdown or stationary detection banner */}
      {bus.status === 'breakdown' && (
        <div className="p-3 bg-rose-950/60 border border-rose-500 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-display font-bold text-rose-300">
              {language === 'ta' ? '⚠ பேருந்து பழுது கண்டறியப்பட்டுள்ளது' : '⚠ Possible Bus Breakdown Detected'}
            </div>
            <p className="text-[11px] text-rose-300/80 mt-0.5 font-sans">
              {language === 'ta'
                ? `பேருந்து சுமார் ${bus.stationaryDurationMinutes || 9} நிமிடங்களாக ஒரே இடத்தில் நகராமல் நிற்கிறது.`
                : `Bus has been stationary for ${bus.stationaryDurationMinutes || 9} minutes on this route.`}
            </p>
          </div>
        </div>
      )}

      {/* Core Bus Metrics Grid with Unique Fonts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Speed & Heading */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] uppercase font-display font-bold text-slate-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-sky-400" />
            <span>{language === 'ta' ? 'வேகம்' : 'Live Speed'}</span>
          </div>
          <div className="text-lg font-display font-black text-white mt-1">
            {bus.speedKmh} <span className="text-xs font-mono-transit text-slate-400">km/h</span>
          </div>
        </div>

        {/* Crowd Level */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] uppercase font-display font-bold text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3 text-amber-400" />
            <span>{language === 'ta' ? 'கூட்டம்' : 'Crowd'}</span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-display font-bold border ${crowdConfig.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${crowdConfig.dot}`}></span>
              {crowdConfig.label}
            </span>
          </div>
        </div>

        {/* Comfort Score */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] uppercase font-display font-bold text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{language === 'ta' ? 'வசதி குறியீடு' : 'Comfort'}</span>
          </div>
          <div className="text-lg font-display font-black text-emerald-300 mt-1">
            {bus.comfortScore}<span className="text-xs font-mono-transit text-slate-400">/100</span>
          </div>
        </div>

        {/* Reliability Score */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10px] uppercase font-display font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>{language === 'ta' ? 'நம்பகத்தன்மை' : 'Reliability'}</span>
          </div>
          <div className="text-lg font-display font-black text-purple-300 mt-1">
            {bus.reliabilityScore}%
          </div>
        </div>
      </div>

      {/* Realistic Telemetry Strip (Depot, Driver & Engine Diagnostics) */}
      {telem && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 text-xs">
          {/* Driver & Depot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <div>
                <div className="font-sans font-bold text-slate-200">{telem.driverName}</div>
                <div className="text-[10px] font-mono-transit text-slate-400">
                  {language === 'ta' ? telem.depotNameTa : telem.depotName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-display font-bold">
                ★ {telem.driverRating}
              </span>
            </div>
          </div>

          {/* Engine Temp & Fuel/Range */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Fuel className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-display">
                  {telem.fuelType.toUpperCase()} Range
                </div>
                <div className="font-mono-transit font-bold text-slate-200">
                  {telem.fuelOrBatteryPercent}% • {telem.remainingRangeKm} km
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-display">Engine Temp</div>
                <div className="font-mono-transit font-bold text-slate-200">
                  {telem.engineTempCelsius}°C • Optimal
                </div>
              </div>
            </div>
          </div>

          {/* Next Toll Plaza with FASTag Status */}
          {telem.nextTollGate && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-medium">
                  {language === 'ta' ? telem.nextTollGate.nameTa : telem.nextTollGate.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-transit text-slate-400">
                  {telem.nextTollGate.distanceKm} km
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-display font-bold uppercase">
                  FASTag {telem.nextTollGate.fastagStatus}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

          {/* Delay Predictor Box with Unique Typography */}
          <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display font-extrabold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {language === 'ta' ? 'தாமதக் கணிப்பான் (Delay Predictor)' : 'AI Delay Predictor'}
              </span>
              <span className="text-[11px] font-mono-transit text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                {language === 'ta' ? 'துல்லியம் 92%' : '92% Confidence'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {language === 'ta'
                ? bus.delayReasonTa || 'பேருந்து தற்போது சீராக செல்கிறது. தேசிய நெடுஞ்சாலை சுங்கச்சாவடிகளில் குறைந்த நேர தாமதமே பதிவாகியுள்ளது.'
                : bus.delayReasonEn || 'Bus is cruising smoothly. Minimal corridor delay observed at highway junctions.'}
            </p>

            {/* Dynamic Traffic-Aware ETA Visualization */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-1.5 bg-slate-900 rounded-lg">
                <div className="text-slate-400 font-display text-[10px]">
                  {language === 'ta' ? 'இயல்பு நேரம்' : 'Normal Flow'}
                </div>
                <div className="font-display font-bold text-slate-200">
                  {route?.averageTravelTimeMinutes || 34} min
                </div>
              </div>
              <div className="p-1.5 bg-slate-900 rounded-lg">
                <div className="text-amber-400 font-display text-[10px]">
                  {language === 'ta' ? 'தாமதம்' : 'Delay'}
                </div>
                <div className="font-display font-bold text-amber-300">
                  +{bus.delayMinutes} min
                </div>
              </div>
              <div className="p-1.5 bg-slate-900 rounded-lg border border-sky-500/40">
                <div className="text-sky-300 font-display text-[10px]">
                  {language === 'ta' ? 'கணித்த ETA' : 'Predicted ETA'}
                </div>
                <div className="font-display font-bold text-sky-400">
                  {(route?.averageTravelTimeMinutes || 34) + bus.predictedDelayMinutes} min
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 3: ROUTE STOPS & GET-DOWN ALERT */}
      {activeCardTab === 'route' && (
        <>
          {/* Set Get-Down Alert */}
          <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display font-bold text-indigo-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                {language === 'ta' ? 'இறங்கும் நிறுத்த நினைவூட்டல்' : 'Smart Get-Down Alert'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <select
                value={selectedDestStopId}
                onChange={(e) => setSelectedDestStopId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {routeStopsWithDetails.map((s) => (
                  <option key={s.stopId} value={s.stopId}>
                    {language === 'ta' ? s.details?.nameTa : s.details?.nameEn}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateAlert}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs rounded-xl shadow transition-colors shrink-0"
              >
                {alertSetSuccess
                  ? (language === 'ta' ? 'அமைக்கப்பட்டது ✓' : 'Alert Set ✓')
                  : (language === 'ta' ? 'நினைவூட்டு' : 'Set Alert')}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              {language === 'ta'
                ? 'உங்கள் நிறுத்தம் 2 நிறுத்தங்களுக்கு முன்பு வரும்போதும், நெருங்கும்போதும் தானாகவே எச்சரிக்கை ஒலிக்கும்.'
                : 'Will notify you: "2 stops away" → "Stop approaching" → "Get ready to exit".'}
            </p>
          </div>

          {/* What's Happening on My Route Timeline */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 mb-2">
              {language === 'ta' ? 'என் வழித்தடத்தில் என்ன நடக்கிறது?' : "What's Happening on My Route?"}
            </h4>
            <div className="space-y-1.5">
              {routeStopsWithDetails.map((stopItem, idx) => {
                const isPassed = idx < bus.currentStopIndex;
                const isCurrent = idx === bus.currentStopIndex;
                const isNext = idx === bus.currentStopIndex + 1;

                let statusBadge = { labelEn: 'Normal', labelTa: 'சீரானது', color: 'text-emerald-400' };
                if (stopItem.stopId === 'stop-pallavaram') {
                  statusBadge = { labelEn: 'Heavy Traffic ⚠', labelTa: 'கடும் நெரிசல் ⚠', color: 'text-rose-400' };
                } else if (stopItem.stopId === 'stop-saidapet') {
                  statusBadge = { labelEn: 'Moderate', labelTa: 'மிதமானது', color: 'text-amber-400' };
                }

                return (
                  <div
                    key={stopItem.stopId}
                    onClick={() => stopItem.details && onSelectStop(stopItem.details)}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-sky-950/60 border-sky-500 text-white font-bold'
                        : isNext
                        ? 'bg-slate-950/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isCurrent
                            ? 'bg-sky-400 animate-ping'
                            : isPassed
                            ? 'bg-slate-600'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="font-sans">
                        {language === 'ta' ? stopItem.details?.nameTa : stopItem.details?.nameEn}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-display font-extrabold uppercase">
                          {language === 'ta' ? 'இங்கு உள்ளது' : 'Bus Here'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className={`font-display font-semibold ${statusBadge.color}`}>
                        {language === 'ta' ? statusBadge.labelTa : statusBadge.labelEn}
                      </span>
                      {isNext && (
                        <span className="font-mono-transit text-amber-300 font-bold">
                          {bus.etaNextStopMinutes}m
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
