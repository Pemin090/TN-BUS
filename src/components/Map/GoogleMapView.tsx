import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Bus, BusRoute, BusStop, TrafficIncident, WeatherRiskArea, EventTrafficZone, Language } from '../../types';
import { Bus as BusIcon, AlertTriangle, Shield, CloudRain, Info } from 'lucide-react';

interface GoogleMapViewProps {
  apiKey: string;
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
  showTraffic: boolean;
  showBuses: boolean;
  showStops: boolean;
  showIncidents: boolean;
  showWeather: boolean;
  showSafety: boolean;
  showHeatmap: boolean;
  language: Language;
}

// Inner component to handle Map camera pan and polylines
const MapController: React.FC<{
  selectedBus: Bus | null;
  selectedStop: BusStop | null;
  routes: BusRoute[];
  selectedRoute: BusRoute | null;
  showTraffic: boolean;
}> = ({ selectedBus, selectedStop, routes, selectedRoute, showTraffic }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedBus) {
      map.panTo({ lat: selectedBus.latitude, lng: selectedBus.longitude });
      map.setZoom(15);
    } else if (selectedStop) {
      map.panTo({ lat: selectedStop.location.lat, lng: selectedStop.location.lng });
      map.setZoom(15);
    }
  }, [map, selectedBus?.id, selectedStop?.id]);

  // Draw Route Polylines onto the Google Map instance
  useEffect(() => {
    if (!map || !(window as any).google?.maps) return;

    const polylines: any[] = [];

    routes.forEach((r) => {
      const isSelected = selectedRoute?.id === r.id;
      const poly = new (window as any).google.maps.Polyline({
        path: r.polyline,
        geodesic: true,
        strokeColor: isSelected ? '#38bdf8' : r.color || '#0284c7',
        strokeOpacity: isSelected ? 1.0 : 0.75,
        strokeWeight: isSelected ? 6 : 4,
        map: map
      });
      polylines.push(poly);
    });

    return () => {
      polylines.forEach((p) => p.setMap(null));
    };
  }, [map, routes, selectedRoute?.id, showTraffic]);

  // Traffic Layer toggle
  useEffect(() => {
    if (!map || !(window as any).google?.maps) return;
    let trafficLayer: any = null;
    if (showTraffic) {
      trafficLayer = new (window as any).google.maps.TrafficLayer();
      trafficLayer.setMap(map);
    }
    return () => {
      if (trafficLayer) trafficLayer.setMap(null);
    };
  }, [map, showTraffic]);

  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  apiKey,
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
  showTraffic,
  showBuses,
  showStops,
  showIncidents,
  showWeather,
  showSafety,
  showHeatmap,
  language
}) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState<{
    type: 'bus' | 'stop' | 'incident';
    data: any;
  } | null>(null);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <APIProvider apiKey={apiKey} libraries={['places', 'routes', 'marker']}>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat: 12.9850, lng: 80.1700 }}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <MapController
            selectedBus={selectedBus}
            selectedStop={selectedStop}
            routes={routes}
            selectedRoute={selectedRoute}
            showTraffic={showTraffic}
          />

          {/* Live Animated Buses as Advanced Markers */}
          {showBuses &&
            buses.map((bus) => (
              <AdvancedMarker
                key={bus.id}
                position={{ lat: bus.latitude, lng: bus.longitude }}
                onClick={() => {
                  onSelectBus(bus);
                  setActiveInfoWindow({ type: 'bus', data: bus });
                }}
                title={`${bus.routeNumber} - ${bus.registrationNumber}`}
              >
                <div className="relative flex flex-col items-center cursor-pointer group transition-transform hover:scale-110">
                  {/* Floating Route Pill */}
                  <div
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-md border whitespace-nowrap mb-1 ${
                      selectedBus?.id === bus.id
                        ? 'bg-amber-400 text-slate-900 border-white'
                        : 'bg-slate-900/95 text-white border-slate-700'
                    }`}
                  >
                    {bus.routeNumber}
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ml-1 ${
                        bus.occupancy === 'low'
                          ? 'bg-emerald-400'
                          : bus.occupancy === 'medium'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  {/* Bus Icon Body with bearing rotation */}
                  <div
                    style={{ transform: `rotate(${bus.bearing}deg)` }}
                    className={`p-1.5 rounded-lg shadow-lg flex items-center justify-center transition-transform ${
                      bus.status === 'breakdown'
                        ? 'bg-rose-600 text-white'
                        : bus.isAc
                        ? 'bg-cyan-600 text-white'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    <BusIcon className="w-4 h-4" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* Bus Stops as Advanced Markers */}
          {showStops &&
            stops.map((stop) => (
              <AdvancedMarker
                key={stop.id}
                position={{ lat: stop.location.lat, lng: stop.location.lng }}
                onClick={() => {
                  onSelectStop(stop);
                  setActiveInfoWindow({ type: 'stop', data: stop });
                }}
              >
                <Pin
                  background={selectedStop?.id === stop.id ? '#f59e0b' : stop.isMajorHub ? '#2563eb' : '#64748b'}
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                  scale={stop.isMajorHub ? 0.85 : 0.65}
                />
              </AdvancedMarker>
            ))}

          {/* Incidents on Map */}
          {showIncidents &&
            incidents.map((inc) => (
              <AdvancedMarker
                key={inc.id}
                position={{ lat: inc.location.lat, lng: inc.location.lng }}
                onClick={() => setActiveInfoWindow({ type: 'incident', data: inc })}
              >
                <div className="p-2 bg-rose-600 text-white rounded-full shadow-lg border-2 border-white animate-pulse cursor-pointer">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </AdvancedMarker>
            ))}

          {/* InfoWindow on marker click */}
          {activeInfoWindow && (
            <InfoWindow
              position={
                activeInfoWindow.type === 'bus'
                  ? { lat: activeInfoWindow.data.latitude, lng: activeInfoWindow.data.longitude }
                  : activeInfoWindow.type === 'stop'
                  ? { lat: activeInfoWindow.data.location.lat, lng: activeInfoWindow.data.location.lng }
                  : { lat: activeInfoWindow.data.location.lat, lng: activeInfoWindow.data.location.lng }
              }
              onCloseClick={() => setActiveInfoWindow(null)}
            >
              <div className="p-2 max-w-xs text-slate-900 font-sans">
                {activeInfoWindow.type === 'bus' && (
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b pb-1 mb-1">
                      <span className="font-bold text-sm text-sky-700">
                        Bus {activeInfoWindow.data.routeNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {activeInfoWindow.data.registrationNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <div>Speed: {activeInfoWindow.data.speedKmh} km/h</div>
                      <div>Comfort: {activeInfoWindow.data.comfortScore}/100</div>
                      <div>Crowd: {activeInfoWindow.data.occupancy}</div>
                      <div className="text-amber-700 font-semibold mt-1">
                        Delay: +{activeInfoWindow.data.delayMinutes}m
                      </div>
                    </div>
                  </div>
                )}

                {activeInfoWindow.type === 'stop' && (
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {language === 'ta' ? activeInfoWindow.data.nameTa : activeInfoWindow.data.nameEn}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Connecting Routes: {activeInfoWindow.data.connectingRoutes.join(', ')}
                    </p>
                    <div className="text-xs text-emerald-700 font-semibold mt-1">
                      {activeInfoWindow.data.isSafeNightStop ? 'Verified Safe Night Hub' : 'Standard Stop'}
                    </div>
                  </div>
                )}

                {activeInfoWindow.type === 'incident' && (
                  <div>
                    <div className="font-bold text-sm text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {language === 'ta' ? activeInfoWindow.data.titleTa : activeInfoWindow.data.titleEn}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {language === 'ta' ? activeInfoWindow.data.descriptionTa : activeInfoWindow.data.descriptionEn}
                    </p>
                    <div className="text-xs font-semibold text-rose-600 mt-1">
                      Delay: +{activeInfoWindow.data.expectedDelayMinutes} mins
                    </div>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
