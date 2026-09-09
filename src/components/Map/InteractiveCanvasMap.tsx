import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Bus,
  BusRoute,
  BusStop,
  TrafficIncident,
  WeatherRiskArea,
  EventTrafficZone,
  Language,
  TamilNaduRegion
} from '../../types';
import {
  TAMIL_NADU_BORDER,
  MAJOR_HIGHWAY_CORRIDORS,
  TAMIL_NADU_DISTRICTS,
  TN_STATE_CENTER
} from '../../data/tamilNaduData';
import {
  Shield,
  CloudRain,
  Flame,
  AlertTriangle,
  Navigation,
  MapPin,
  Compass,
  ZoomIn,
  ZoomOut,
  Box,
  RotateCw,
  RotateCcw,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

interface CanvasMapProps {
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
  highlightCorridor?: string | null;
  language: Language;
}

// Iconic Tamil Nadu Mountain Peaks & Ghat Ranges for 3D Relief
const TN_MOUNTAIN_PEAKS = [
  { nameEn: 'Doddabetta (Nilgiris)', nameTa: 'தொட்டபெட்டா', lat: 11.4010, lng: 76.7358, elev: 2637 },
  { nameEn: 'Ooty Hills', nameTa: 'ஊட்டி மலைகள்', lat: 11.4102, lng: 76.6950, elev: 2240 },
  { nameEn: 'Kodaikanal (Palani)', nameTa: 'கொடைக்கானல்', lat: 10.2381, lng: 77.4892, elev: 2133 },
  { nameEn: 'Anaimalai / Valparai', nameTa: 'ஆனைமலை / வால்பாறை', lat: 10.3240, lng: 76.9550, elev: 2695 },
  { nameEn: 'Yercaud (Shevaroy)', nameTa: 'ஏற்காடு', lat: 11.7753, lng: 78.2093, elev: 1515 },
  { nameEn: 'Kolli Hills (70 Bends)', nameTa: 'கொல்லிமலை', lat: 11.2486, lng: 78.3385, elev: 1415 },
  { nameEn: 'Agasthiyamalai', nameTa: 'அகஸ்தியர்மலை', lat: 8.6150, lng: 77.2470, elev: 1868 },
  { nameEn: 'Meghamalai (Cloud Mtn)', nameTa: 'மேகமலை', lat: 9.6800, lng: 77.4000, elev: 1500 }
];

export const InteractiveCanvasMap: React.FC<CanvasMapProps> = ({
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
  highlightCorridor,
  language
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera State
  const [center, setCenter] = useState({ lat: 10.8500, lng: 78.6000 });
  const [zoom, setZoom] = useState(7.3); // Zoom level: 6.5 (statewide) to 16 (close up)
  const [pitch, setPitch] = useState(50); // 3D Tilt angle in degrees: 0 (flat 2D) to 62 (3D perspective)
  const [bearing, setBearing] = useState(-12); // Rotation in degrees: -180 to 180 (Isometric default: -12)
  const [is3DMode, setIs3DMode] = useState(true);
  const [followBusMode, setFollowBusMode] = useState(false);

  const [activeRegion, setActiveRegion] = useState<TamilNaduRegion>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isRightDragging, setIsRightDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Region preset coordinate mapping
  const regionPresets: Record<TamilNaduRegion, { lat: number; lng: number; zoom: number; labelEn: string; labelTa: string; pitch?: number; bearing?: number }> = {
    all: { lat: 10.8500, lng: 78.6000, zoom: 7.3, labelEn: 'All Tamil Nadu', labelTa: 'தமிழ்நாடு முழுவதும்', pitch: 48, bearing: -12 },
    chennai: { lat: 12.9850, lng: 80.1700, zoom: 11.2, labelEn: 'Chennai & North', labelTa: 'சென்னை மண்டலம்', pitch: 52, bearing: -18 },
    coimbatore: { lat: 11.0168, lng: 76.9667, zoom: 11.2, labelEn: 'Coimbatore & West', labelTa: 'கொங்கு / கோவை', pitch: 54, bearing: 15 },
    madurai: { lat: 9.9350, lng: 78.1300, zoom: 11.2, labelEn: 'Madurai & South', labelTa: 'மதுரை மண்டலம்', pitch: 50, bearing: -10 },
    trichy: { lat: 10.7905, lng: 78.7047, zoom: 11.5, labelEn: 'Trichy & Delta', labelTa: 'திருச்சி & டெல்டா', pitch: 48, bearing: 0 },
    salem: { lat: 11.6643, lng: 78.1460, zoom: 11.5, labelEn: 'Salem & Hills', labelTa: 'சேலம் மண்டலம்', pitch: 56, bearing: -20 },
    tirunelveli: { lat: 8.4500, lng: 77.6500, zoom: 9.6, labelEn: 'Tirunelveli & Kanyakumari', labelTa: 'நெல்லை & குமரி', pitch: 52, bearing: 8 }
  };

  const handleSelectRegion = (reg: TamilNaduRegion) => {
    setActiveRegion(reg);
    const target = regionPresets[reg];
    setCenter({ lat: target.lat, lng: target.lng });
    setZoom(target.zoom);
    if (is3DMode && target.pitch !== undefined) setPitch(target.pitch);
    if (is3DMode && target.bearing !== undefined) setBearing(target.bearing);
    setFollowBusMode(false);
  };

  const toggle3DMode = () => {
    if (is3DMode) {
      setPitch(0);
      setBearing(0);
      setIs3DMode(false);
    } else {
      setPitch(50);
      setBearing(-12);
      setIs3DMode(true);
    }
  };

  // 3D Perspective Projection Function
  const project3D = (
    lat: number,
    lng: number,
    elevationMeters: number = 0,
    width: number,
    height: number
  ) => {
    const scale = Math.pow(2, zoom) * 32;
    // Ground plane coordinates relative to camera center
    const dx = (lng - center.lng) * scale;
    const dy = (lat - center.lat) * scale * 1.05;

    // Apply camera rotation (bearing)
    const radBearing = (bearing * Math.PI) / 180;
    const cosB = Math.cos(radBearing);
    const sinB = Math.sin(radBearing);
    const rx = dx * cosB - dy * sinB;
    const ry = dx * sinB + dy * cosB;

    if (!is3DMode || pitch === 0) {
      // 2D Orthographic Mode
      return {
        x: width / 2 + rx,
        y: height / 2 - ry,
        scale: 1,
        visible: true
      };
    }

    // 3D Perspective Mode with Pitch & Elevation
    const radPitch = (pitch * Math.PI) / 180;
    const cosP = Math.cos(radPitch);
    const sinP = Math.sin(radPitch);

    // Perspective depth factor (foreshortening along camera line of sight)
    const depth = 1 - ry * 0.00065 * sinP;
    const clampedDepth = Math.max(0.18, depth);
    const perspective = 1 / clampedDepth;

    // Elevation scaled in 3D
    const elevPixels = (elevationMeters / 250) * Math.max(1, (zoom - 5) * 1.5);

    const screenX = width / 2 + rx * perspective;
    const screenY = height / 2 - (ry * cosP + elevPixels * sinP) * perspective;
    const depthScale = Math.min(2.5, Math.max(0.4, perspective));

    return {
      x: screenX,
      y: screenY,
      scale: depthScale,
      visible: depth > 0.1
    };
  };

  // Re-center when user selects a bus or stop
  useEffect(() => {
    if (selectedBus) {
      setCenter({ lat: selectedBus.latitude, lng: selectedBus.longitude });
      if (zoom < 10) setZoom(11.8);
      if (is3DMode) setPitch(54);
    } else if (selectedStop) {
      setCenter({ lat: selectedStop.location.lat, lng: selectedStop.location.lng });
      if (zoom < 10) setZoom(12.5);
      if (is3DMode) setPitch(50);
    }
  }, [selectedBus?.id, selectedStop?.id]);

  // Keep camera centered on followed bus
  useEffect(() => {
    if (followBusMode && selectedBus) {
      setCenter({ lat: selectedBus.latitude, lng: selectedBus.longitude });
      setBearing(selectedBus.bearing - 180);
    }
  }, [selectedBus?.latitude, selectedBus?.longitude, followBusMode]);

  // Main 3D Animation & Rendering Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (timeMs: number) => {
      const t = timeMs / 1000;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Futuristic Dark Ocean & Atmosphere (Deep Cyan/Midnight)
      ctx.fillStyle = '#050911';
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Horizon Glow in 3D Mode
      if (is3DMode && pitch > 20) {
        const horizonGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
        horizonGrad.addColorStop(0, 'rgba(14, 165, 233, 0.18)');
        horizonGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.08)');
        horizonGrad.addColorStop(1, 'rgba(5, 9, 17, 0)');
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, 0, width, height * 0.45);
      }

      // Ocean Watermarks in distinctive Chakra Petch font
      ctx.save();
      const bayOfBengalP = project3D(11.5, 80.65, 0, width, height);
      if (bayOfBengalP.visible) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
        ctx.font = '700 16px "Chakra Petch", sans-serif';
        ctx.fillText(language === 'ta' ? 'வங்காள விரிகுடா' : 'BAY OF BENGAL (EAST SEA)', bayOfBengalP.x, bayOfBengalP.y);
      }

      const indianOceanP = project3D(7.5, 77.8, 0, width, height);
      if (indianOceanP.visible) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.14)';
        ctx.font = '700 15px "Chakra Petch", sans-serif';
        ctx.fillText(language === 'ta' ? 'இந்தியப் பெருங்கடல்' : 'INDIAN OCEAN (SOUTH)', indianOceanP.x, indianOceanP.y);
      }

      const arabianSeaP = project3D(8.5, 76.4, 0, width, height);
      if (arabianSeaP.visible) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.14)';
        ctx.font = '700 14px "Chakra Petch", sans-serif';
        ctx.fillText(language === 'ta' ? 'அரபிக்கடல்' : 'ARABIAN SEA (WEST)', arabianSeaP.x, arabianSeaP.y);
      }
      ctx.restore();

      // 2. Draw Tamil Nadu Landmass Polygon (Base Plane)
      if (TAMIL_NADU_BORDER.length > 0) {
        // 3D Drop-Shadow for Landmass
        if (is3DMode && pitch > 15) {
          ctx.beginPath();
          TAMIL_NADU_BORDER.forEach((pt, i) => {
            const p = project3D(pt.lat, pt.lng, -20, width, height);
            if (i === 0) ctx.moveTo(p.x, p.y + 12);
            else ctx.lineTo(p.x, p.y + 12);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fill();
        }

        // Main Landmass
        ctx.beginPath();
        TAMIL_NADU_BORDER.forEach((pt, i) => {
          const p = project3D(pt.lat, pt.lng, 0, width, height);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        const landGrad = ctx.createLinearGradient(0, 0, 0, height);
        landGrad.addColorStop(0, '#091322');
        landGrad.addColorStop(0.6, '#0c1a2e');
        landGrad.addColorStop(1, '#0e223d');
        ctx.fillStyle = landGrad;
        ctx.fill();

        // High-tech turquoise coastline neon glow
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = Math.max(1.8, Math.min(4.2, zoom * 0.3));
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. 3D Mountain Relief: Western Ghats & Hill Ranges
      TN_MOUNTAIN_PEAKS.forEach((pk) => {
        const baseP = project3D(pk.lat, pk.lng, 0, width, height);
        const peakP = project3D(pk.lat, pk.lng, pk.elev, width, height);

        if (!baseP.visible || !peakP.visible) return;

        // Draw 3D Mountain Pyramid Silhouette
        const baseWidth = (pk.elev / 120) * baseP.scale;
        const grad = ctx.createLinearGradient(peakP.x, peakP.y, baseP.x, baseP.y);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.2)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');

        ctx.beginPath();
        ctx.moveTo(peakP.x, peakP.y);
        ctx.lineTo(baseP.x - baseWidth, baseP.y);
        ctx.lineTo(baseP.x + baseWidth, baseP.y);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Shaded elevation contour lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Mountain Peak Marker & Height
        if (zoom >= 8.5) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(peakP.x, peakP.y, 3 * peakP.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#7dd3fc';
          ctx.font = `600 ${Math.max(9, Math.floor(10 * peakP.scale))}px "Chakra Petch", sans-serif`;
          ctx.fillText(`▲ ${language === 'ta' ? pk.nameTa : pk.nameEn} (${pk.elev}m)`, peakP.x + 6, peakP.y);
        }
      });

      // 4. Subtle 3D Coordinate Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 0.5;
      const step = zoom > 10 ? 0.25 : 1.0;
      for (let lat = 8; lat <= 14; lat += step) {
        const p1 = project3D(lat, 76, 0, width, height);
        const p2 = project3D(lat, 81, 0, width, height);
        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // 5. Major National Highway Corridors (NH 44, NH 45, NH 544, etc.)
      MAJOR_HIGHWAY_CORRIDORS.forEach((hwy) => {
        const isCorridorSelected = highlightCorridor && hwy.name.toLowerCase().includes(highlightCorridor.toLowerCase());
        const hwyWidth = (isCorridorSelected ? Math.max(5, (zoom - 5) * 1.8) : Math.max(2.5, (zoom - 5) * 1.1));

        // Highway underlay road bed
        ctx.strokeStyle = '#0a101d';
        ctx.lineWidth = (hwyWidth + 3);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        hwy.polyline.forEach((pt, i) => {
          const p = project3D(pt.lat, pt.lng, 0, width, height);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Highway neon track
        ctx.strokeStyle = isCorridorSelected ? '#f59e0b' : '#1e293b';
        ctx.lineWidth = hwyWidth;
        ctx.stroke();

        // Corridor tag
        if (zoom >= 8.2 && hwy.polyline.length > 2) {
          const midIdx = Math.floor(hwy.polyline.length / 2);
          const midPoint = project3D(hwy.polyline[midIdx].lat, hwy.polyline[midIdx].lng, 0, width, height);
          if (midPoint.visible) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 9px "Chakra Petch", sans-serif';
            ctx.fillText(hwy.id.toUpperCase(), midPoint.x + 8, midPoint.y);
          }
        }
      });

      // 6. Active Bus Routes with 3D Flowing Energy Pulses
      routes.forEach((route) => {
        const isSelected = selectedRoute?.id === route.id;
        const baseRouteWidth = isSelected ? Math.max(5.5, (zoom - 5) * 2.2) : Math.max(3, (zoom - 5) * 1.3);

        // Render Highway Segments with Live Traffic Color
        for (let i = 0; i < route.polyline.length - 1; i++) {
          const p1 = project3D(route.polyline[i].lat, route.polyline[i].lng, 0, width, height);
          const p2 = project3D(route.polyline[i + 1].lat, route.polyline[i + 1].lng, 0, width, height);

          if (!p1.visible || !p2.visible) continue;

          const midLat = (route.polyline[i].lat + route.polyline[i + 1].lat) / 2;
          const isNearPallavaram = Math.abs(midLat - 12.9675) < 0.02;
          const isNearSalemToll = Math.abs(midLat - 11.4800) < 0.05;

          ctx.lineWidth = baseRouteWidth * p1.scale;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          let segColor = '#10b981'; // Green free flow
          if (isNearPallavaram || isNearSalemToll) segColor = '#ef4444'; // Red jam
          else if (route.routeNumber === 'SETC 101' && midLat > 12.5) segColor = '#f59e0b'; // Amber

          ctx.strokeStyle = showTraffic ? segColor : (route.color || '#0284c7');
          ctx.stroke();

          // 3D Animated Traveling Light Pulse along this highway segment
          const pulseSpeed = isNearPallavaram ? 0.3 : 1.2;
          const pulseOffset = (t * pulseSpeed + i * 0.25) % 1.0;
          const pulseX = p1.x + (p2.x - p1.x) * pulseOffset;
          const pulseY = p1.y + (p2.y - p1.y) * pulseOffset;

          ctx.fillStyle = isNearPallavaram ? '#fca5a5' : '#a7f3d0';
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5 * p1.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 7. 3D Architectural Terminal Hub Skylines & Glowing Towers
      if (showStops) {
        stops.forEach((stop) => {
          const isSelected = selectedStop?.id === stop.id;
          const baseP = project3D(stop.location.lat, stop.location.lng, 0, width, height);

          if (!baseP.visible) return;

          if (stop.isMajorHub) {
            // 3D Architectural Pylon Tower Height
            const towerHeightMeters = 80;
            const topP = project3D(stop.location.lat, stop.location.lng, towerHeightMeters, width, height);

            // Pulsing sonar radar ripple ring expanding outwards
            const rippleR = ((t * 22) % 55) * baseP.scale;
            const rippleAlpha = Math.max(0, 1 - rippleR / (55 * baseP.scale));
            ctx.strokeStyle = isSelected ? `rgba(56, 189, 248, ${rippleAlpha})` : `rgba(249, 115, 22, ${rippleAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(baseP.x, baseP.y, rippleR, 0, Math.PI * 2);
            ctx.stroke();

            // Extruded 3D Landmark Pillar
            if (is3DMode && pitch > 15) {
              const pillarWidth = 4 * baseP.scale;
              const colGrad = ctx.createLinearGradient(topP.x, topP.y, baseP.x, baseP.y);
              colGrad.addColorStop(0, isSelected ? '#38bdf8' : '#f97316');
              colGrad.addColorStop(1, 'rgba(15, 23, 42, 0.4)');

              ctx.fillStyle = colGrad;
              ctx.beginPath();
              ctx.moveTo(baseP.x - pillarWidth, baseP.y);
              ctx.lineTo(topP.x - pillarWidth * 0.7, topP.y);
              ctx.lineTo(topP.x + pillarWidth * 0.7, topP.y);
              ctx.lineTo(baseP.x + pillarWidth, baseP.y);
              ctx.closePath();
              ctx.fill();
            }

            // Glowing Beacon Orb atop Tower
            const beaconP = is3DMode && pitch > 15 ? topP : baseP;
            ctx.fillStyle = isSelected ? '#38bdf8' : '#f97316';
            ctx.beginPath();
            ctx.arc(beaconP.x, beaconP.y, (isSelected ? 7 : 5) * beaconP.scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Hub Label
            if (zoom >= 8.2 || isSelected) {
              ctx.fillStyle = '#ffffff';
              ctx.font = `700 ${isSelected ? '12px' : '10px'} "Chakra Petch", sans-serif`;
              ctx.fillText(language === 'ta' ? stop.nameTa : stop.nameEn, beaconP.x + 10, beaconP.y + 4);
            }
          } else if (zoom >= 11) {
            // Local Regular Stop Dot
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(baseP.x, baseP.y, 3.5 * baseP.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // 8. 3D Weather Risk Zones & Rain Particles
      if (showWeather) {
        weatherRisks.forEach((w) => {
          const p = project3D(w.center.lat, w.center.lng, 0, width, height);
          if (!p.visible) return;

          const radPixels = (w.radiusMeters / 1000) * (Math.pow(2, zoom) * 0.3) * p.scale;

          // Glowing storm vortex
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radPixels);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.32)');
          grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radPixels, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#06b6d4';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#67e8f9';
          ctx.font = '700 11px "Chakra Petch", sans-serif';
          ctx.fillText(`🌧 ${language === 'ta' ? w.areaNameTa : w.areaNameEn}`, p.x + 8, p.y - 8);
        });
      }

      // 9. District Headquarters Markers Across Tamil Nadu
      TAMIL_NADU_DISTRICTS.forEach((d) => {
        const p = project3D(d.lat, d.lng, 0, width, height);
        if (!p.visible || p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) return;

        if (d.hub || zoom >= 8.6) {
          ctx.fillStyle = d.hub ? '#38bdf8' : '#64748b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, (d.hub ? 4 : 2.5) * p.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = d.hub ? '#e2e8f0' : '#94a3b8';
          ctx.font = `${d.hub ? '700 11px' : '9px'} "Outfit", sans-serif`;
          ctx.fillText(language === 'ta' ? d.nameTa : d.nameEn, p.x + 7, p.y - 4);
        }
      });

      // 10. Traffic Incidents / Bottleneck Alerts
      if (showIncidents) {
        incidents.forEach((inc) => {
          if (!inc.active) return;
          const p = project3D(inc.location.lat, inc.location.lng, 0, width, height);
          if (!p.visible) return;

          // Pulsing hazard ripple
          const pulse = (Math.sin(t * 5) + 1) * 3;
          ctx.fillStyle = inc.severity === 'red' ? '#ef4444' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, (6 + pulse) * p.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '700 10px "Chakra Petch", sans-serif';
          ctx.fillText(`⚠️ +${inc.expectedDelayMinutes}m`, p.x + 12, p.y + 4);
        });
      }

      // 11. Fully Animated 3D Buses (Chassis, Headlight Beams, Cabin Glow, Floating 3D HUD)
      if (showBuses) {
        buses.forEach((bus) => {
          const elev = bus.telemetry?.elevationMeters || 0;
          const p = project3D(bus.latitude, bus.longitude, elev, width, height);

          if (!p.visible) return;

          const isSelected = selectedBus?.id === bus.id;
          const scale = p.scale;

          // Bus heading angle adjusted by camera bearing in 3D
          const screenAngleDeg = (bus.bearing - bearing);
          const screenAngleRad = (screenAngleDeg * Math.PI) / 180;

          // Vibration bounce from suspension
          const engineBounce = Math.sin(t * 14 + bus.speedKmh) * 0.8;

          ctx.save();
          ctx.translate(p.x, p.y + engineBounce);

          // A. 3D Road Projection: Forward Headlight Cones (Illuminating the Highway)
          ctx.save();
          ctx.rotate(screenAngleRad);

          // Headlight Beam Cone
          const beamLen = Math.max(35, bus.speedKmh * 0.75) * scale;
          const beamGrad = ctx.createRadialGradient(0, -12 * scale, 2, 0, -beamLen, 24 * scale);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
          beamGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.15)');
          beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(-5 * scale, -10 * scale);
          ctx.lineTo(-18 * scale, -beamLen);
          ctx.lineTo(18 * scale, -beamLen);
          ctx.lineTo(5 * scale, -10 * scale);
          ctx.closePath();
          ctx.fill();

          // B. 3D Ground Contact Shadow (Soft blurred elliptical footprint)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(0, 2 * scale, 9 * scale, 18 * scale, 0, 0, Math.PI * 2);
          ctx.fill();

          // C. 3D Extruded Bus Body
          const busL = 26 * scale;
          const busW = 12 * scale;
          const halfL = busL / 2;
          const halfW = busW / 2;

          // Authentic Livery Colors
          let bodyColor = '#0284c7'; // MTC Blue / Express
          if (bus.operator.includes('SETC')) bodyColor = '#be123c'; // SETC Crimson
          if (bus.operator.includes('TNSTC')) bodyColor = '#d97706'; // TNSTC Kongu/Madurai Amber
          if (bus.isAc) bodyColor = '#0891b2'; // AC Cyan
          if (bus.status === 'delayed') bodyColor = '#ef4444'; // Delayed Red

          // Lower Chassis Base
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(-halfW, -halfL, busW, busL, 4 * scale);
          ctx.fill();

          // Main Coach Body (with extruded highlight)
          ctx.fillStyle = bodyColor;
          ctx.beginPath();
          ctx.roundRect(-halfW + 1, -halfL + 1, busW - 2, busL - 2, 3 * scale);
          ctx.fill();

          // Glazed Windows Strip (Illuminated Cabin Light)
          ctx.fillStyle = bus.isAc ? '#67e8f9' : '#fef08a';
          ctx.fillRect(-halfW + 2, -halfL + 5, 2, busL - 10);
          ctx.fillRect(halfW - 4, -halfL + 5, 2, busL - 10);

          // Front Windshield
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-halfW + 2, -halfL + 2, busW - 4, 3 * scale);

          // Roof Aerodynamic AC Unit
          if (bus.isAc) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-halfW + 3, -halfL + 8, busW - 6, 7 * scale, 2);
            ctx.fill();
          }

          // Rear Brake Lights (Pulsing Red)
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-halfW + 1, halfL - 2, 3 * scale, 2 * scale);
          ctx.fillRect(halfW - 4 * scale, halfL - 2, 3 * scale, 2 * scale);

          ctx.restore(); // Restore bus local rotation

          // D. 3D Floating Holographic HUD Tag (Levitating with Sinusoidal Float)
          const floatBob = Math.sin(t * 3 + bus.speedKmh) * 3;
          const hudStalkHeight = (28 * scale) + floatBob;

          // Glowing Stalk Line from Bus to Floating HUD Plate
          ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -hudStalkHeight);
          ctx.stroke();

          // HUD Tag Pill
          const tagY = -hudStalkHeight;
          const badgeText = `${bus.routeNumber} • ${bus.speedKmh} km/h`;
          ctx.font = '700 10px "Chakra Petch", sans-serif';
          const textW = ctx.measureText(badgeText).width;
          const pillW = textW + 14;

          ctx.fillStyle = isSelected ? '#0284c7' : '#0f172a';
          ctx.strokeStyle = isSelected ? '#38bdf8' : '#334155';
          ctx.lineWidth = isSelected ? 2 : 1;

          ctx.beginPath();
          ctx.roundRect(-pillW / 2, tagY - 14, pillW, 18, 5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(badgeText, -pillW / 2 + 7, tagY);

          ctx.restore();
        });
      }

      // 12. Bottom Telemetry Bar in JetBrains Mono & Chakra Petch
      const camLat = center.lat.toFixed(4);
      const camLng = center.lng.toFixed(4);
      const zoomLevel = zoom.toFixed(1);
      const pitchDeg = Math.round(pitch);
      const bearingDeg = Math.round(bearing);

      ctx.fillStyle = 'rgba(10, 15, 26, 0.9)';
      ctx.fillRect(12, height - 38, width - 24, 26);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(12, height - 38, width - 24, 26);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 11px "Chakra Petch", sans-serif';
      ctx.fillText(
        language === 'ta' ? 'தமிழ்நாடு போக்குவரத்து நேரலை வரைபடம் (3D ENGINE)' : 'TN TRANSIT INTELLIGENCE 3D ENGINE',
        22,
        height - 21
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      const telemetryStr = `GPS: ${camLat}°N, ${camLng}°E • ZM: ${zoomLevel}x • PITCH: ${pitchDeg}° • AZI: ${bearingDeg}° • 60 FPS`;
      ctx.fillText(telemetryStr, width - 420, height - 21);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    center,
    zoom,
    pitch,
    bearing,
    is3DMode,
    buses,
    routes,
    stops,
    incidents,
    weatherRisks,
    eventZones,
    selectedBus,
    selectedRoute,
    selectedStop,
    showTraffic,
    showBuses,
    showStops,
    showIncidents,
    showWeather,
    showSafety,
    showHeatmap,
    highlightCorridor,
    language
  ]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse drag & click handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2 || e.shiftKey) {
      // Right click or Shift+drag: 3D Orbit / Tilt
      setIsRightDragging(true);
    } else {
      setIsDragging(true);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    if (isRightDragging) {
      // Rotate 3D bearing and adjust pitch
      setBearing((b) => (b + dx * 0.4) % 360);
      setPitch((p) => Math.max(0, Math.min(65, p - dy * 0.4)));
      return;
    }

    if (!isDragging) return;

    // Pan camera across ground plane
    const scale = Math.pow(2, zoom) * 32;
    const radB = (bearing * Math.PI) / 180;
    const cosB = Math.cos(radB);
    const sinB = Math.sin(radB);

    // Un-rotate delta by bearing
    const unrotatedDx = dx * cosB + dy * sinB;
    const unrotatedDy = -dx * sinB + dy * cosB;

    setCenter((prev) => ({
      lat: prev.lat + unrotatedDy / (scale * 1.05),
      lng: prev.lng - unrotatedDx / scale
    }));
    setFollowBusMode(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRightDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.35 : -0.35;
    setZoom((prev) => Math.max(6.5, Math.min(17, prev + zoomDelta)));
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Check if clicked near a bus
    for (const bus of buses) {
      const p = project3D(bus.latitude, bus.longitude, bus.telemetry?.elevationMeters || 0, width, height);
      const dist = Math.hypot(clickX - p.x, clickY - p.y);
      if (dist < 30) {
        onSelectBus(bus);
        return;
      }
    }

    // Check if clicked near a stop
    for (const stop of stops) {
      const p = project3D(stop.location.lat, stop.location.lng, 0, width, height);
      const dist = Math.hypot(clickX - p.x, clickY - p.y);
      if (dist < 22) {
        onSelectStop(stop);
        return;
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none font-sans">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top Left: Regional Corridor Navigation Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl overflow-x-auto max-w-[calc(100vw-180px)] scrollbar-none">
        {(Object.keys(regionPresets) as TamilNaduRegion[]).map((regKey) => {
          const item = regionPresets[regKey];
          const isAct = activeRegion === regKey;
          return (
            <button
              key={regKey}
              onClick={() => handleSelectRegion(regKey)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all font-display ${
                isAct
                  ? 'bg-sky-500 text-white shadow-lg font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {language === 'ta' ? item.labelTa : item.labelEn}
            </button>
          );
        })}
      </div>

      {/* Top Right: 3D Camera & Perspective Orbit Cockpit */}
      <div className="absolute top-3 right-4 flex flex-col items-end gap-2 z-20">
        {/* 3D / 2D Perspective Toggle Pill */}
        <button
          onClick={toggle3DMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-display text-xs font-bold transition-all shadow-xl backdrop-blur-md ${
            is3DMode
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400 shadow-sky-500/25'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
          title="Toggle 3D Isometric View"
        >
          <Box className="w-3.5 h-3.5" />
          <span>{is3DMode ? '3D CINEMATIC' : '2D PLAN VIEW'}</span>
        </button>

        {/* 3D Orbit Control Palette */}
        {is3DMode && (
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl">
            <button
              onClick={() => setBearing((b) => (b - 30) % 360)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Rotate Left (Bearing -30°)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBearing((b) => (b + 30) % 360)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Rotate Right (Bearing +30°)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
            <button
              onClick={() => setPitch((p) => Math.min(65, p + 10))}
              className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-display"
              title="Tilt Camera Lower"
            >
              Tilt +
            </button>
            <button
              onClick={() => setPitch((p) => Math.max(0, p - 10))}
              className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-display"
              title="Tilt Camera Higher"
            >
              Tilt -
            </button>
          </div>
        )}

        {/* Zoom & Reset North */}
        <div className="flex flex-col gap-1.5 mt-1">
          <button
            onClick={() => setZoom((z) => Math.min(17, z + 1))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 flex items-center justify-center font-bold text-lg border border-slate-800 shadow-xl backdrop-blur transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(6.5, z - 1))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 flex items-center justify-center font-bold text-lg border border-slate-800 shadow-xl backdrop-blur transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setBearing(0);
              setPitch(is3DMode ? 48 : 0);
            }}
            className="w-9 h-9 rounded-xl bg-slate-900/90 text-amber-400 hover:bg-slate-800 flex items-center justify-center border border-slate-800 shadow-xl backdrop-blur transition-colors"
            title="Reset True North"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
