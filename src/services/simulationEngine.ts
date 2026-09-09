import { Bus, BusRoute, LatLng, ActiveGetDownAlert, SmartNotification, TrafficIncident } from '../types';
import { calculateDistanceKm } from './predictionEngine';

export function interpolatePolyline(polyline: LatLng[], progress: number): { lat: number; lng: number; bearing: number } {
  if (!polyline || polyline.length === 0) {
    return { lat: 13.0067, lng: 80.2023, bearing: 0 };
  }
  if (polyline.length === 1) {
    return { lat: polyline[0].lat, lng: polyline[0].lng, bearing: 0 };
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const totalSegments = polyline.length - 1;
  const segmentFraction = 1 / totalSegments;

  const segmentIndex = Math.min(
    totalSegments - 1,
    Math.floor(clampedProgress / segmentFraction)
  );
  const segmentProgress = (clampedProgress - segmentIndex * segmentFraction) / segmentFraction;

  const p1 = polyline[segmentIndex];
  const p2 = polyline[segmentIndex + 1];

  const lat = p1.lat + (p2.lat - p1.lat) * segmentProgress;
  const lng = p1.lng + (p2.lng - p1.lng) * segmentProgress;

  // Bearing calculation
  const y = Math.sin(((p2.lng - p1.lng) * Math.PI) / 180) * Math.cos((p2.lat * Math.PI) / 180);
  const x =
    Math.cos((p1.lat * Math.PI) / 180) * Math.sin((p2.lat * Math.PI) / 180) -
    Math.sin((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.cos(((p2.lng - p1.lng) * Math.PI) / 180);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  return { lat, lng, bearing };
}

export function updateBusPositions(
  buses: Bus[],
  routes: BusRoute[],
  speedMultiplier: number,
  isTrafficSpike: boolean
): Bus[] {
  return buses.map((bus) => {
    // If bus is in breakdown or stationary, don't move
    if (bus.status === 'breakdown') {
      return {
        ...bus,
        speedKmh: 0,
        stationaryDurationMinutes: (bus.stationaryDurationMinutes || 0) + 1,
        lastUpdated: 'Just now'
      };
    }

    const route = routes.find((r) => r.id === bus.routeId);
    if (!route || !route.polyline.length) return bus;

    // Movement speed step
    let step = 0.008 * speedMultiplier;
    let actualSpeed = bus.speedKmh;

    if (isTrafficSpike) {
      step *= 0.35; // Slow down substantially in traffic spike
      actualSpeed = Math.max(6, Math.round(bus.speedKmh * 0.4));
    }

    let newProgress = bus.routeProgressRatio + step;
    if (newProgress > 0.98) {
      // Loop or bounce back
      newProgress = 0.02;
    }

    const newPos = interpolatePolyline(route.polyline, newProgress);

    // Update stop index based on progress
    const totalStops = route.stops.length;
    const currentStopIdx = Math.min(totalStops - 1, Math.floor(newProgress * totalStops));
    const nextStopPoint = route.stops[Math.min(totalStops - 1, currentStopIdx + 1)] || route.stops[totalStops - 1];

    return {
      ...bus,
      latitude: newPos.lat,
      longitude: newPos.lng,
      bearing: Math.round(newPos.bearing),
      speedKmh: actualSpeed,
      routeProgressRatio: newProgress,
      currentStopIndex: currentStopIdx,
      nextStopId: nextStopPoint.stopId,
      etaNextStopMinutes: Math.max(1, Math.round(5 * (1 - (newProgress % (1 / totalStops)) * totalStops))),
      lastUpdated: 'Just now'
    };
  });
}

export function evaluateGetDownAlert(
  alert: ActiveGetDownAlert,
  buses: Bus[],
  routes: BusRoute[]
): { updatedAlert: ActiveGetDownAlert; newNotification?: SmartNotification } {
  const bus = buses.find((b) => b.id === alert.busId);
  if (!bus) return { updatedAlert: alert };

  const route = routes.find((r) => r.id === bus.routeId);
  if (!route) return { updatedAlert: alert };

  const destIndex = route.stops.findIndex((s) => s.stopId === alert.destinationStopId);
  if (destIndex === -1) return { updatedAlert: alert };

  const currentIdx = bus.currentStopIndex;
  const remaining = Math.max(0, destIndex - currentIdx);
  const etaMinutes = remaining * 4 + bus.delayMinutes;

  let stage = alert.stage;
  let newNotification: SmartNotification | undefined;

  if (remaining === 2 && stage !== 'two_stops_away') {
    stage = 'two_stops_away';
    newNotification = {
      id: `alert-${Date.now()}`,
      severity: 'blue',
      titleEn: 'Your Stop is 2 Stops Away',
      titleTa: 'உங்கள் நிறுத்தம் 2 நிறுத்தங்களுக்கு அப்பால் உள்ளது',
      messageEn: `Bus ${bus.routeNumber} is 2 stops away from ${alert.destinationNameEn}. Prepare your belongings.`,
      messageTa: `பேருந்து ${bus.routeNumber} ${alert.destinationNameTa} நிறுத்தத்திலிருந்து 2 நிறுத்தங்கள் தொலைவில் உள்ளது.`,
      timestamp: 'Just now',
      routeNumber: bus.routeNumber,
      isRead: false
    };
  } else if (remaining === 1 && stage !== 'approaching') {
    stage = 'approaching';
    newNotification = {
      id: `alert-${Date.now()}`,
      severity: 'yellow',
      titleEn: 'Your Stop is Approaching!',
      titleTa: 'உங்கள் நிறுத்தம் நெருங்குகிறது!',
      messageEn: `Approaching ${alert.destinationNameEn} in approx. 2-3 minutes. Move towards the exit.`,
      messageTa: `${alert.destinationNameTa} நிறுத்தம் இன்னும் 2-3 நிமிடங்களில் வரும். வாசலை நோக்கி செல்லவும்.`,
      timestamp: 'Just now',
      routeNumber: bus.routeNumber,
      isRead: false
    };
  } else if (remaining === 0 && stage !== 'get_ready') {
    stage = 'get_ready';
    newNotification = {
      id: `alert-${Date.now()}`,
      severity: 'green',
      titleEn: `Get Ready to Exit at ${alert.destinationNameEn}!`,
      titleTa: `${alert.destinationNameTa} நிறுத்தத்தில் இறங்க தயாராகுங்கள்!`,
      messageEn: `Bus is pulling into ${alert.destinationNameEn} now. Safe travels!`,
      messageTa: `பேருந்து இப்போது ${alert.destinationNameTa} நிறுத்தத்தை அடைகிறது. பாதுகாப்பாக இறங்கவும்!`,
      timestamp: 'Just now',
      routeNumber: bus.routeNumber,
      isRead: false
    };
  }

  return {
    updatedAlert: {
      ...alert,
      stopsRemaining: remaining,
      etaMinutes,
      stage
    },
    newNotification
  };
}
