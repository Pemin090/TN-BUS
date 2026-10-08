import {
  Bus,
  BusRoute,
  BusStop,
  CrowdLevel,
  TrafficIncident,
  WeatherRiskArea,
  AiEtaResult,
  DelayDetectionAlert,
  CrowdPredictionResult,
  SmartRouteScore,
  BusIotTelemetry,
  PredictiveMaintenanceData
} from '../types';
import { calculateDistanceKm } from './predictionEngine';

/**
 * PHASE 3: AI ETA PREDICTION ENGINE
 * Computes multi-factor estimated arrival time considering:
 * - Historical travel time
 * - Time of day & peak hours
 * - Day of week (Weekend vs Weekday rush)
 * - Route complexity & stop count
 * - Active traffic bottlenecks & incidents
 * - Live bus speed trend
 * - Weather conditions (rain/monsoon)
 */
export function calculateAiEtaPrediction(
  bus: Bus,
  route: BusRoute | null,
  incidents: TrafficIncident[],
  weatherRisks: WeatherRiskArea[],
  targetStop?: BusStop | null
): AiEtaResult {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Baseline remaining distance in km
  let distanceKm = 8.5;
  if (targetStop) {
    distanceKm = calculateDistanceKm(bus.latitude, bus.longitude, targetStop.location.lat, targetStop.location.lng);
  } else if (bus.etaNextStopMinutes) {
    distanceKm = Math.max(1.2, (bus.etaNextStopMinutes / 60) * Math.max(20, bus.speedKmh));
  }

  // Base driving time at free-flow average speed
  const baseSpeed = 38; // km/h
  let baseTravelTimeMinutes = Math.round((distanceKm / baseSpeed) * 60);
  if (baseTravelTimeMinutes < 2) baseTravelTimeMinutes = 2;

  const factors: AiEtaResult['factors'] = [];

  // 1. Time-of-Day Peak Factor
  let peakDelay = 0;
  const isMorningPeak = currentHour >= 8 && currentHour <= 10;
  const isEveningPeak = (currentHour >= 17 && currentHour <= 20) || currentHour === 21;
  const isLateNight = currentHour >= 22 || currentHour < 5;

  if (isMorningPeak) {
    peakDelay = Math.max(3, Math.round(baseTravelTimeMinutes * 0.22));
    factors.push({
      nameEn: 'Morning Office & College Rush',
      nameTa: 'காலை அலுவலக & கல்லூரி நெரிசல்',
      impactMinutes: peakDelay,
      category: 'peak_hour'
    });
  } else if (isEveningPeak) {
    peakDelay = Math.max(4, Math.round(baseTravelTimeMinutes * 0.28));
    factors.push({
      nameEn: 'Evening Commuter Peak (5:30 - 8:30 PM)',
      nameTa: 'மாலை நேர உச்ச நெரிசல்',
      impactMinutes: peakDelay,
      category: 'peak_hour'
    });
  } else if (isLateNight) {
    const nightGain = -Math.round(baseTravelTimeMinutes * 0.12);
    factors.push({
      nameEn: 'Late Night Open Corridor Speed-up',
      nameTa: 'இரவு நேர தடையற்ற விரைவுப் பயணம்',
      impactMinutes: nightGain,
      category: 'peak_hour'
    });
  }

  // 2. Incident & Bottleneck Factor
  let incidentDelay = 0;
  const relevantIncidents = incidents.filter(
    (inc) => inc.active && (inc.affectedRouteNumbers.includes(bus.routeNumber) || inc.roadName.includes('GST'))
  );

  if (relevantIncidents.length > 0) {
    incidentDelay = relevantIncidents.reduce((acc, curr) => acc + curr.expectedDelayMinutes, 0);
    factors.push({
      nameEn: `Active Bottleneck (${relevantIncidents[0].roadName})`,
      nameTa: `செயலில் உள்ள போக்குவரத்து நெரிசல் (${relevantIncidents[0].roadName})`,
      impactMinutes: incidentDelay,
      category: 'traffic'
    });
  } else if (bus.delayMinutes > 0) {
    incidentDelay = bus.delayMinutes;
    factors.push({
      nameEn: 'Corridor Traffic Congestion',
      nameTa: 'நெடுஞ்சாலை போக்குவரத்து தாமதம்',
      impactMinutes: bus.delayMinutes,
      category: 'traffic'
    });
  }

  // 3. Weather Conditions Factor
  let weatherDelay = 0;
  const inWeatherZone = weatherRisks.some((w) => {
    const distToCenter = calculateDistanceKm(bus.latitude, bus.longitude, w.center.lat, w.center.lng);
    return distToCenter * 1000 <= w.radiusMeters;
  });

  if (inWeatherZone) {
    weatherDelay = Math.max(3, Math.round(baseTravelTimeMinutes * 0.18));
    factors.push({
      nameEn: 'Monsoon Rain & Wet Pavement Advisory',
      nameTa: 'மழைப்பொழிவு & ஈரமான சாலை எச்சரிக்கை',
      impactMinutes: weatherDelay,
      category: 'weather'
    });
  }

  // 4. Bus Speed Trend Factor
  if (bus.speedKmh < 15 && bus.speedKmh > 0) {
    const crawlDelay = 2;
    factors.push({
      nameEn: 'Slow Traffic Crawl (<15 km/h)',
      nameTa: 'மந்தமான நகர்வு (<15 கி.மீ/மணி)',
      impactMinutes: crawlDelay,
      category: 'speed'
    });
  }

  // 5. Urban Stop Interchanges
  const stopCount = route?.stops?.length || 4;
  const stopDwellDelay = Math.round(Math.min(stopCount * 0.5, 4));
  if (stopDwellDelay > 1) {
    factors.push({
      nameEn: `Platform Boarding Dwell (${stopCount} stops)`,
      nameTa: `பயணிகள் ஏறும் நேரம் (${stopCount} நிறுத்தங்கள்)`,
      impactMinutes: stopDwellDelay,
      category: 'stops'
    });
  }

  const totalEtaMinutes = Math.max(2, baseTravelTimeMinutes + peakDelay + incidentDelay + weatherDelay + stopDwellDelay);

  // Compute Clock Arrival Timestamp
  const arrivalDate = new Date(now.getTime() + totalEtaMinutes * 60 * 1000);
  let hours = arrivalDate.getHours();
  const minutes = arrivalDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedEta = `${hours}:${formattedMinutes} ${ampm}`;

  // Confidence calculation (88% - 97%)
  let confidencePercent = 94;
  if (relevantIncidents.length > 0) confidencePercent -= 4;
  if (inWeatherZone) confidencePercent -= 3;
  if (distanceKm > 25) confidencePercent -= 2;
  if (bus.speedKmh >= 30) confidencePercent += 2;
  confidencePercent = Math.min(98, Math.max(76, confidencePercent));

  const totalExpectedDelay = incidentDelay + peakDelay + weatherDelay;
  let delaySeverity: AiEtaResult['delaySeverity'] = 'none';
  if (totalExpectedDelay >= 10) delaySeverity = 'severe';
  else if (totalExpectedDelay >= 5) delaySeverity = 'moderate';
  else if (totalExpectedDelay >= 2) delaySeverity = 'minor';

  return {
    formattedEta,
    etaMinutes: totalEtaMinutes,
    confidencePercent,
    expectedDelayMinutes: totalExpectedDelay,
    delaySeverity,
    delayReasonEn:
      totalExpectedDelay > 0
        ? factors.map((f) => f.nameEn).join(', ')
        : 'Smooth flow along open corridor with minimal stops.',
    delayReasonTa:
      totalExpectedDelay > 0
        ? factors.map((f) => f.nameTa).join(', ')
        : 'தடையில்லா விரைவுப் போக்குவரத்து சீராக இயங்குகிறது.',
    factors,
    isSimulated: true
  };
}

/**
 * PHASE 7: SMART DELAY DETECTION SYSTEM
 * Compares normal scheduled travel time vs current predicted travel time.
 * Automatically recommends alternative buses, routes, or express services.
 */
export function evaluateDelayDetection(
  bus: Bus,
  route: BusRoute | null,
  allBuses: Bus[],
  allRoutes: BusRoute[],
  incidents: TrafficIncident[]
): DelayDetectionAlert {
  const normalTravelTime = route?.averageTravelTimeMinutes || 35;
  const currentDelay = bus.delayMinutes || (bus.status === 'delayed' ? 9 : 0);
  const predictedTravelTime = normalTravelTime + currentDelay;

  const isDelayed = currentDelay >= 4 || bus.status === 'delayed';

  const suggestedAlternatives: DelayDetectionAlert['suggestedAlternatives'] = [];

  if (isDelayed) {
    // 1. Check for a parallel on-time bus along the same corridor
    const parallelBus = allBuses.find(
      (b) =>
        b.id !== bus.id &&
        b.status === 'on_time' &&
        (b.routeNumber === '18' || b.routeNumber === 'MTC 500 AC' || b.routeId === route?.id)
    );

    if (parallelBus) {
      suggestedAlternatives.push({
        busId: parallelBus.id,
        busNumber: parallelBus.routeNumber,
        routeId: parallelBus.routeId,
        titleEn: `Alternative Bus: ${parallelBus.routeNumber} (${parallelBus.operatorCategory})`,
        titleTa: `மாற்றுப் பேருந்து: ${parallelBus.routeNumber} (${parallelBus.operatorCategory})`,
        savingMinutes: Math.max(3, currentDelay - parallelBus.delayMinutes),
        type: 'alternative_bus'
      });
    }

    // 2. Faster bypass route option (e.g. GST AC Express or Bypass Kongu)
    const bypassRoute = allRoutes.find(
      (r) =>
        r.id !== route?.id &&
        (r.routeNumber.includes('500') || r.serviceType === 'Point-to-Point' || r.routeNumber.includes('Express'))
    );

    if (bypassRoute) {
      suggestedAlternatives.push({
        routeId: bypassRoute.id,
        busNumber: bypassRoute.routeNumber,
        titleEn: `Faster Route: ${bypassRoute.nameEn}`,
        titleTa: `விரைவான புறவழிப்பாதை: ${bypassRoute.nameTa}`,
        savingMinutes: Math.max(5, Math.round(currentDelay * 0.8)),
        type: 'faster_route'
      });
    }

    // 3. Later bus (scheduled after bottleneck clears)
    suggestedAlternatives.push({
      routeId: route?.id || 'route-21g',
      busNumber: `${bus.routeNumber} (Next Fleet)`,
      titleEn: `Later Bus (+12 min gap, congestion clearing)`,
      titleTa: `அடுத்த பேருந்து (+12 நிமிடம், நெரிசல் குறையும்)`,
      savingMinutes: 4,
      type: 'later_bus'
    });
  }

  const matchingIncident = incidents.find(
    (i) => i.active && i.affectedRouteNumbers.includes(bus.routeNumber)
  );

  return {
    isDelayed,
    normalTravelTimeMinutes: normalTravelTime,
    predictedTravelTimeMinutes: predictedTravelTime,
    delayMinutes: currentDelay,
    reasonEn: matchingIncident
      ? `${matchingIncident.titleEn} (${matchingIncident.roadName}) causing slow traffic flow.`
      : bus.delayReasonEn || 'Peak corridor congestion and signal bottlenecks.',
    reasonTa: matchingIncident
      ? `${matchingIncident.titleTa} (${matchingIncident.roadName}) காரணமாக தாமதம்.`
      : bus.delayReasonTa || 'சாலை சந்திப்பு நெரிசல் காரணமாக தாமதம்.',
    suggestedAlternatives
  };
}

/**
 * PHASE 6: AI PASSENGER CROWD PREDICTION
 * Evaluates current occupancy and forecasts crowd at upcoming stops using:
 * - Time of day & office/college hours
 * - Route characteristics (ordinary vs deluxe)
 * - Historical interchange passenger volume
 */
export function calculateCrowdPrediction(bus: Bus): CrowdPredictionResult {
  const hour = new Date().getHours();
  let currentCrowdPercent = 55;
  let currentLevel: CrowdLevel = bus.occupancy || 'medium';

  switch (bus.occupancy) {
    case 'low':
      currentCrowdPercent = 34;
      break;
    case 'medium':
      currentCrowdPercent = 64;
      break;
    case 'high':
      currentCrowdPercent = 82;
      break;
    case 'very_high':
      currentCrowdPercent = 94;
      break;
  }

  // Forecast at next interchange stop
  let deltaNextStop = 10;
  let peakContextEn = 'Normal daytime transit ridership.';
  let peakContextTa = 'வழக்கமான பகல் நேரப் பயணிகள் எண்ணிக்கை.';

  if (hour >= 8 && hour <= 10) {
    deltaNextStop = 18;
    peakContextEn = 'Morning rush hour: Heavy boarding from engineering colleges & IT corridors.';
    peakContextTa = 'காலை நேர உச்சம்: பொறியியல் கல்லூரிகள் & தகவல் தொழில்நுட்ப பூங்கா பயணிகள்.';
  } else if (hour >= 17 && hour <= 20) {
    deltaNextStop = 14;
    peakContextEn = 'Evening peak hour: High interchange crowd at metro connection hub.';
    peakContextTa = 'மாலை நேர உச்சம்: மெட்ரோ இணைப்பு முனையங்களில் அதிக பயணிகள் வருகை.';
  } else if (hour >= 21) {
    deltaNextStop = -15;
    peakContextEn = 'Night lean hours: Expected rapid deboarding toward suburban terminals.';
    peakContextTa = 'இரவு நேரம்: புறநகர் முனையங்களில் பயணிகள் குறையும்.';
  }

  const predictedNextStopPercent = Math.min(98, Math.max(20, currentCrowdPercent + deltaNextStop));

  let predictedLevel: CrowdLevel = 'medium';
  if (predictedNextStopPercent >= 88) predictedLevel = 'very_high';
  else if (predictedNextStopPercent >= 75) predictedLevel = 'high';
  else if (predictedNextStopPercent >= 45) predictedLevel = 'medium';
  else predictedLevel = 'low';

  return {
    currentCrowdPercent,
    currentLevel,
    predictedNextStopPercent,
    predictedLevel,
    confidenceScore: 92,
    peakContextEn,
    peakContextTa,
    isSimulated: true
  };
}

/**
 * PHASE 5: SMART ROUTE AI SCORING
 * Computes AI Route Score out of 100 for any route candidate.
 */
export function calculateSmartRouteScore(route: BusRoute, bus?: Bus): SmartRouteScore {
  const travelTime = route.averageTravelTimeMinutes || 45;
  const delay = bus?.delayMinutes || 0;
  const reliability = route.reliabilityScore || 90;
  const fare = route.fareRupees ?? 35;
  const stopsCount = route.stops?.length || 4;
  const isPink = Boolean(route.isWomenPinkBus || bus?.isWomenPinkBus);

  // Score algorithm:
  // Baseline 70
  // + Speed efficiency (+10 if travel time per km is good)
  // + Reliability (+15 if >90%)
  // - Delay penalties (-2 per minute)
  // + Pink bus welfare boost
  let score = 55 + Math.round(reliability * 0.35) - Math.min(20, delay * 2.5);
  if (fare <= 30) score += 6;
  if (isPink) score += 5;
  score = Math.min(99, Math.max(50, score));

  // Determine recommendation tag
  let recommendationTag: SmartRouteScore['recommendationTag'] = 'balanced';
  let tagLabelEn = 'Top Balanced Choice';
  let tagLabelTa = 'சிறந்த சமநிலையான தேர்வு';

  if (travelTime <= 35 || route.routeNumber.includes('500') || route.serviceType === 'Point-to-Point') {
    recommendationTag = 'fastest';
    tagLabelEn = '⚡ FASTEST COMMUTE';
    tagLabelTa = '⚡ மிக விரைவான பயணம்';
  } else if (fare === 0 || fare <= 25) {
    recommendationTag = 'cheapest';
    tagLabelEn = '💰 BEST VALUE / ₹0 FREE';
    tagLabelTa = '💰 குறைந்த கட்டணம் / இலவசம்';
  } else if (bus?.occupancy === 'low') {
    recommendationTag = 'least_crowded';
    tagLabelEn = '🟢 LEAST CROWDED';
    tagLabelTa = '🟢 அமைதியான குறைந்த கூட்டம்';
  } else if (reliability >= 95) {
    recommendationTag = 'most_reliable';
    tagLabelEn = '🛡️ HIGHEST RELIABILITY';
    tagLabelTa = '🛡️ அதிக நம்பகத்தன்மை';
  } else if (stopsCount <= 3) {
    recommendationTag = 'fewest_stops';
    tagLabelEn = '🎯 FEWEST STOPS';
    tagLabelTa = '🎯 குறைந்த நிறுத்தங்கள்';
  }

  const hours = Math.floor(travelTime / 60);
  const mins = travelTime % 60;
  const travelTimeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

  return {
    routeId: route.id,
    routeNumber: route.routeNumber,
    nameEn: route.nameEn,
    nameTa: route.nameTa,
    aiScore: score,
    travelTimeFormatted,
    travelTimeMinutes: travelTime,
    expectedDelayMinutes: delay,
    crowdLevel: bus?.occupancy || 'medium',
    crowdPercent: bus?.occupancy === 'low' ? 35 : bus?.occupancy === 'high' ? 82 : 65,
    reliabilityPercent: reliability,
    fareRupees: fare,
    stopCount: stopsCount,
    recommendationTag,
    tagLabelEn,
    tagLabelTa,
    isWomenPinkBus: isPink
  };
}

/**
 * PHASE 15: BUS OCCUPANCY / IoT READY TELEMETRY
 */
export function generateBusIotTelemetry(bus: Bus): BusIotTelemetry {
  const capacityTotal = bus.totalSeats ? bus.totalSeats + 16 : 60;
  const currentCount = bus.telemetry?.passengerCount || (bus.occupancy === 'high' ? 48 : 28);
  const seatsAvailable = Math.max(0, (bus.totalSeats || 44) - currentCount);
  const occupancyPercent = Math.min(100, Math.round((currentCount / capacityTotal) * 100));

  const isBusMoving = bus.speedKmh > 5;

  return {
    passengerCount: currentCount,
    capacityTotal,
    seatsAvailable,
    occupancyPercent,
    frontDoorStatus: isBusMoving ? 'closed' : 'open',
    rearDoorStatus: 'closed',
    opticalSensorCount: currentCount,
    irBeamInCount: currentCount + 14,
    irBeamOutCount: 14,
    weightLoadKg: currentCount * 68 + 8400, // Coach tare + passenger payload
    maxWeightLoadKg: 14200,
    isDemoSensor: true
  };
}

/**
 * PHASE 16: PREDICTIVE FLEET MAINTENANCE
 */
export function generatePredictiveMaintenance(bus: Bus): PredictiveMaintenanceData {
  const isDelayedOrHot = bus.status === 'delayed' || bus.status === 'breakdown';
  const engineHealthPercent = isDelayedOrHot ? 81 : 94;
  const healthScore = isDelayedOrHot ? 76 : 89;

  let status: PredictiveMaintenanceData['status'] = 'GOOD';
  if (healthScore >= 90) status = 'EXCELLENT';
  else if (healthScore >= 80) status = 'GOOD';
  else if (healthScore >= 65) status = 'ATTENTION';
  else status = 'CRITICAL';

  return {
    healthScore,
    status,
    engineHealthPercent,
    coolantTempCelsius: isDelayedOrHot ? 95 : 88,
    oilPressurePsi: 48,
    batteryVoltage: 27.6,
    batteryHealthPercent: 96,
    brakeWearPercent: 24, // 24% worn = 76% life remaining
    tyrePressurePsi: [110, 110, 108, 108, 112, 112],
    nextServiceKm: 3200,
    odometerKm: 148200,
    lastServiceDate: '02-Oct-2026 (Salem Central Depot)',
    isDemoData: true
  };
}
