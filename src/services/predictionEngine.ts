import { Bus, BusRoute, BusStop, CrowdLevel, StopPrediction, TrafficIncident, TrafficSeverity } from '../types';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function calculateBusComfortScore(bus: {
  occupancy: CrowdLevel;
  delayMinutes: number;
  isAc: boolean;
  speedKmh: number;
}): number {
  let score = 50;

  // Occupancy impact
  if (bus.occupancy === 'low') score += 25;
  else if (bus.occupancy === 'medium') score += 15;
  else if (bus.occupancy === 'high') score -= 10;
  else if (bus.occupancy === 'very_high') score -= 25;

  // Delay impact
  if (bus.delayMinutes <= 2) score += 15;
  else if (bus.delayMinutes <= 5) score += 5;
  else if (bus.delayMinutes <= 10) score -= 10;
  else score -= 20;

  // AC comfort
  if (bus.isAc) score += 15;

  // Speed stability
  if (bus.speedKmh >= 25 && bus.speedKmh <= 45) score += 5;

  return Math.min(100, Math.max(25, score));
}

export function calculatePredictionConfidence(
  speedKmh: number,
  activeIncidentsCount: number,
  distanceKm: number
): number {
  let confidence = 94;

  if (distanceKm > 10) confidence -= 5;
  if (activeIncidentsCount > 0) confidence -= activeIncidentsCount * 4;
  if (speedKmh < 10) confidence -= 6; // Crawling in jam reduces certainty slightly

  return Math.max(68, Math.min(98, confidence));
}

export function predictArrivalForStop(
  bus: Bus,
  targetStop: BusStop,
  route: BusRoute,
  incidents: TrafficIncident[]
): StopPrediction {
  const dist = calculateDistanceKm(bus.latitude, bus.longitude, targetStop.location.lat, targetStop.location.lng);
  
  // Base travel time at current average bus speed (approx 25 km/h in urban TN)
  const effectiveSpeed = Math.max(12, bus.speedKmh || 22);
  let baseMinutes = Math.round((dist / effectiveSpeed) * 60);
  if (baseMinutes < 1) baseMinutes = 1;

  // Corridors check for active incidents
  const matchingIncident = incidents.find(
    (inc) => inc.active && inc.affectedRouteNumbers.includes(bus.routeNumber)
  );
  
  const additionalDelay = matchingIncident ? matchingIncident.expectedDelayMinutes : bus.delayMinutes;
  const totalEta = baseMinutes + additionalDelay;

  let trafficSeverity: TrafficSeverity = 'green';
  if (additionalDelay >= 10) trafficSeverity = 'red';
  else if (additionalDelay >= 5) trafficSeverity = 'orange';
  else if (additionalDelay >= 2) trafficSeverity = 'yellow';

  const confidence = calculatePredictionConfidence(bus.speedKmh, matchingIncident ? 1 : 0, dist);

  return {
    routeNumber: bus.routeNumber,
    busId: bus.id,
    regNumber: bus.registrationNumber,
    etaMinutes: totalEta,
    followingBusEtaMinutes: totalEta + (route.frequencyMinutes || 10),
    expectedDelayMinutes: additionalDelay,
    distanceKm: dist,
    trafficCondition: trafficSeverity,
    confidenceScore: confidence,
    crowdLevel: bus.occupancy,
    isAc: bus.isAc,
    comfortScore: bus.comfortScore
  };
}

export function calculateGreenTravelMetrics(distanceKm: number, passengersEstimate: number = 38) {
  // Average car emits ~150g CO2 per km; public transit emits ~35g per passenger-km.
  // Net avoided: ~115g (0.115 kg) per km per passenger.
  const co2AvoidedPerPassengerKg = Math.round(distanceKm * 0.115 * 10) / 10;
  const busTotalAvoidedKg = Math.round(co2AvoidedPerPassengerKg * passengersEstimate);
  const ecoScore = Math.min(99, Math.round(75 + (distanceKm * 1.5)));

  return {
    singleTripCo2Kg: Math.max(0.4, co2AvoidedPerPassengerKg),
    fleetTotalCo2Kg: busTotalAvoidedKg,
    ecoScore
  };
}

export function getBestTimeAdvice() {
  return {
    bestWindow: '2:00 PM – 3:30 PM',
    bestWindowTa: 'மதியம் 2:00 – 3:30 வரை',
    peakAvoidWindow: '5:30 PM – 8:00 PM',
    peakAvoidWindowTa: 'மாலை 5:30 – 8:00 வரை',
    peakSurchargeDelayPct: 28,
    hourlyPattern: [
      { hour: '6 AM', delayMin: 2, crowd: 40 },
      { hour: '7 AM', delayMin: 5, crowd: 65 },
      { hour: '8 AM', delayMin: 12, crowd: 90 },
      { hour: '9 AM', delayMin: 16, crowd: 95 },
      { hour: '10 AM', delayMin: 9, crowd: 70 },
      { hour: '12 PM', delayMin: 4, crowd: 50 },
      { hour: '2 PM', delayMin: 3, crowd: 42 },
      { hour: '4 PM', delayMin: 7, crowd: 68 },
      { hour: '6 PM', delayMin: 18, crowd: 98 },
      { hour: '7 PM', delayMin: 21, crowd: 96 },
      { hour: '8 PM', delayMin: 14, crowd: 80 },
      { hour: '10 PM', delayMin: 3, crowd: 35 }
    ]
  };
}
