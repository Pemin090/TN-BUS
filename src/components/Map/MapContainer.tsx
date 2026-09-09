import React, { useState } from 'react';
import { Bus, BusRoute, BusStop, TrafficIncident, WeatherRiskArea, EventTrafficZone, Language } from '../../types';
import { InteractiveCanvasMap } from './InteractiveCanvasMap';
import { GoogleMapView } from './GoogleMapView';
import { Layers, Map as MapIcon, Eye, EyeOff, Shield, CloudRain, Flame, AlertCircle } from 'lucide-react';

interface MapContainerProps {
  buses: Bus[];
  routes: BusRoute[];
  stops: BusStop[];
  incidents: TrafficIncident[];
  weatherRisks: WeatherRiskArea[];
  eventZones: EventTrafficZone[];
  selectedBus: Bus | null;
  selectedRoute: BusRoute | null;
  selectedStop: BusStop | null;
  onSelectBus: (bus: Bus) => void;
  onSelectStop: (stop: BusStop) => void;
  language: Language;
  highlightCorridor?: string | null;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  buses,
  routes,
  stops,
  incidents,
  weatherRisks,
  eventZones,
  selectedBus,
  selectedRoute,
  selectedStop,
  onSelectBus,
  onSelectStop,
  language,
  highlightCorridor
}) => {
  // Layer visibility toggles
  const [showTraffic, setShowTraffic] = useState(true);
  const [showBuses, setShowBuses] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showSafety, setShowSafety] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Map engine mode: Default to our own custom built-in Tamil Nadu Map Engine (Zero API Key required)
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [mapEngine, setMapEngine] = useState<'canvas' | 'gmap'>('canvas');

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Map Layer Control Bar */}
      <div className="absolute top-12 left-3 right-16 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        {/* Layer Toggles Pills */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl overflow-x-auto max-w-full scrollbar-none text-[11px] font-display font-bold">
          <button
            onClick={() => setShowTraffic((v) => !v)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              showTraffic
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {language === 'ta' ? 'போக்குவரத்து' : 'Traffic Flow'}
          </button>

          <button
            onClick={() => setShowBuses((v) => !v)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              showBuses
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            {language === 'ta' ? 'பேருந்துகள்' : 'Buses'}
          </button>

          <button
            onClick={() => setShowStops((v) => !v)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              showStops
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            {language === 'ta' ? 'முனையங்கள்' : 'Terminals'}
          </button>

          <button
            onClick={() => setShowIncidents((v) => !v)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              showIncidents
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-rose-400" />
            {language === 'ta' ? 'நெரிசல்கள்' : 'Alerts'}
          </button>

          <button
            onClick={() => setShowWeather((v) => !v)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              showWeather
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3 h-3 text-cyan-400" />
            {language === 'ta' ? 'வானிலை' : 'Weather'}
          </button>

          {/* Engine toggle if user has key configured in env */}
          {envKey && (
            <button
              onClick={() => setMapEngine((e) => (e === 'canvas' ? 'gmap' : 'canvas'))}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapEngine === 'gmap'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3 h-3 text-purple-400" />
              {mapEngine === 'gmap' ? 'Google Maps' : 'Built-in Map'}
            </button>
          )}
        </div>
      </div>

      {/* Map Body: Always default to custom built-in vector transit engine */}
      <div className="flex-1 w-full h-full relative">
        {mapEngine === 'canvas' ? (
          <InteractiveCanvasMap
            buses={buses}
            routes={routes}
            stops={stops}
            incidents={incidents}
            weatherRisks={weatherRisks}
            eventZones={eventZones}
            selectedBus={selectedBus}
            selectedRoute={selectedRoute}
            selectedStop={selectedStop}
            onSelectBus={onSelectBus}
            onSelectStop={onSelectStop}
            showTraffic={showTraffic}
            showBuses={showBuses}
            showStops={showStops}
            showIncidents={showIncidents}
            showWeather={showWeather}
            showSafety={showSafety}
            showHeatmap={showHeatmap}
            highlightCorridor={highlightCorridor}
            language={language}
          />
        ) : (
          <GoogleMapView
            apiKey={envKey}
            buses={buses}
            routes={routes}
            stops={stops}
            incidents={incidents}
            selectedBus={selectedBus}
            selectedRoute={selectedRoute}
            selectedStop={selectedStop}
            onSelectBus={onSelectBus}
            onSelectStop={onSelectStop}
            showTraffic={showTraffic}
            showBuses={showBuses}
            showStops={showStops}
            showIncidents={showIncidents}
            language={language}
          />
        )}
      </div>
    </div>
  );
};
