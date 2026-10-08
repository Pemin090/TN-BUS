export type Language = 'en' | 'ta';

export type TrafficSeverity = 'green' | 'yellow' | 'orange' | 'red';

export type CrowdLevel = 'low' | 'medium' | 'high' | 'very_high';

export type IncidentType =
  | 'accident'
  | 'breakdown'
  | 'road_blocked'
  | 'flooding'
  | 'traffic_jam'
  | 'missing_bus'
  | 'unsafe';

export type TamilNaduRegion = 'all' | 'chennai' | 'coimbatore' | 'madurai' | 'trichy' | 'salem' | 'tirunelveli';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  nameEn: string;
  nameTa: string;
  district?: string;
  districtTa?: string;
  location: LatLng;
  isMajorHub?: boolean;
  isSafeNightStop?: boolean;
  hasShelter?: boolean;
  lightingQuality?: 'high' | 'medium' | 'low';
  currentCrowdScore?: number; // 0 - 100 for heatmap
  connectingRoutes: string[];
}

export interface RouteStopPoint {
  stopId: string;
  distanceFromStartKm: number;
  scheduledMinutesFromStart: number;
}

export type OperatorCategory = 'MTC' | 'TNSTC' | 'SETC';

export type BusLiveryTheme = 'all' | 'tnstc' | 'setc' | 'mtc' | 'pink';

export type TnstcDivision =
  | 'Coimbatore'
  | 'Madurai'
  | 'Salem'
  | 'Kumbakonam'
  | 'Villupuram'
  | 'Tirunelveli';

export type ServiceType =
  | 'AC Sleeper'
  | 'Non-AC Sleeper'
  | 'Ultra Deluxe'
  | 'Deluxe'
  | 'Express'
  | 'Ordinary (Women Free)'
  | 'Point-to-Point'
  | 'AC Electric';

export type AvailabilityStatus = 'available' | 'filling_fast' | 'full' | 'departing_soon';

export interface BusRoute {
  id: string;
  routeNumber: string;
  nameEn: string;
  nameTa: string;
  originEn: string;
  originTa: string;
  destinationEn: string;
  destinationTa: string;
  color: string;
  polyline: LatLng[];
  stops: RouteStopPoint[];
  averageTravelTimeMinutes: number;
  reliabilityScore: number; // 0 - 100%
  fareRupees: number;
  isWomenPinkBus?: boolean;
  frequencyMinutes: number;
  operatorCategory?: OperatorCategory;
  tnstcDivision?: TnstcDivision;
  serviceType?: ServiceType;
  districtsTraversed?: string[];
}

export interface Bus {
  id: string;
  registrationNumber: string;
  routeId: string;
  routeNumber: string;
  operator: string;
  operatorTa: string;
  operatorCategory: OperatorCategory;
  tnstcDivision?: TnstcDivision;
  serviceType: ServiceType;
  district: string; // Current or primary operating district
  districtTa: string;
  districtsTraversed: string[];
  availableSeats: number;
  totalSeats: number;
  availabilityStatus: AvailabilityStatus;
  fareRupees: number;
  isWomenPinkBus?: boolean;
  latitude: number;
  longitude: number;
  bearing: number; // direction degrees
  speedKmh: number;
  occupancy: CrowdLevel;
  comfortScore: number; // 0 - 100
  reliabilityScore: number; // 0 - 100
  status: 'on_time' | 'delayed' | 'approaching_stop' | 'stationary' | 'breakdown' | 'deviated';
  currentStopIndex: number;
  nextStopId: string;
  etaNextStopMinutes: number;
  delayMinutes: number;
  predictedDelayMinutes: number;
  delayReasonEn?: string;
  delayReasonTa?: string;
  isAc: boolean;
  lastUpdated: string;
  stationaryDurationMinutes?: number;
  routeProgressRatio: number; // 0.0 to 1.0 along route
  telemetry?: BusTelemetry;
}

export interface DepotDetails {
  depotNameEn: string;
  depotNameTa: string;
  depotCode: string;
  division: string;
  branchManagerName: string;
  contactNumber: string;
  locationAddress: string;
  totalBusesAllocated: number;
  activeOnRoad: number;
  underMaintenance: number;
  fuelingFacility: string;
}

export interface CrewMember {
  name: string;
  nameTa: string;
  empId: string;
  badgeNumber: string;
  role: 'driver' | 'conductor';
  status: 'on_duty' | 'off_duty' | 'standby' | 'resting';
  shiftTiming: string; // e.g. "06:00 - 14:00"
  hoursOnDuty?: string; // e.g. "4h 20m active"
  restHoursRemaining?: string; // e.g. "5h 40m rest remaining"
  rating: number; // e.g. 4.9
  experienceYears: number;
  phone?: string;
  licenseOrBadgeType?: string;
  medicalFitnessDate?: string;
  breathalyzerStatus?: string;
  safetyRecord?: string;
  etmDeviceId?: string; // For conductors
  handoverPoint?: string; // Relief interchange station
}

export interface BusTelemetry {
  vehicleModel: string;
  depotName: string;
  depotNameTa: string;
  depotCode: string;
  driverName: string;
  driverEmpId: string;
  driverRating: number;
  passengerCount: number;
  totalSeats: number;
  fuelOrBatteryPercent: number;
  fuelType: 'diesel' | 'electric' | 'cng';
  remainingRangeKm: number;
  engineTempCelsius: number;
  elevationMeters: number;
  nextTollGate?: {
    nameEn: string;
    nameTa: string;
    distanceKm: number;
    feeRupees: number;
    fastagStatus: 'active' | 'queued' | 'cleared';
    delayMin: number;
  };
  depotDetails?: DepotDetails;
  onDutyDriver?: CrewMember;
  onDutyConductor?: CrewMember;
  offDutyDriver?: CrewMember;
  offDutyConductor?: CrewMember;
}

export interface TrafficIncident {
  id: string;
  type: IncidentType;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  severity: TrafficSeverity;
  location: LatLng;
  roadName: string;
  affectedRouteNumbers: string[];
  expectedDelayMinutes: number;
  reportedTime: string;
  verificationCount: number;
  isVerified: boolean;
  active: boolean;
}

export interface WeatherRiskArea {
  id: string;
  areaNameEn: string;
  areaNameTa: string;
  center: LatLng;
  radiusMeters: number;
  riskType: 'flooding' | 'waterlogging' | 'heavy_rain' | 'wind' | 'fog';
  severity: 'moderate' | 'high' | 'severe';
  advisoryEn: string;
  advisoryTa: string;
}

export interface EventTrafficZone {
  id: string;
  eventNameEn: string;
  eventNameTa: string;
  center: LatLng;
  radiusMeters: number;
  expectedDelayMinutes: number;
  recommendedAlternativeEn: string;
  recommendedAlternativeTa: string;
  active: boolean;
}

export interface SmartNotification {
  id: string;
  severity: TrafficSeverity | 'blue';
  titleEn: string;
  titleTa: string;
  messageEn: string;
  messageTa: string;
  timestamp: string;
  routeNumber?: string;
  isRead: boolean;
}

export interface FavoriteItem {
  id: string;
  type: 'bus' | 'route' | 'stop' | 'place';
  labelEn: string;
  labelTa: string;
  referenceId: string;
  subText?: string;
}

export interface StopPrediction {
  routeNumber: string;
  busId: string;
  regNumber: string;
  etaMinutes: number;
  followingBusEtaMinutes: number;
  expectedDelayMinutes: number;
  distanceKm: number;
  trafficCondition: TrafficSeverity;
  confidenceScore: number;
  crowdLevel: CrowdLevel;
  isAc: boolean;
  comfortScore: number;
}

export interface ActiveGetDownAlert {
  busId: string;
  originStopId: string;
  destinationStopId: string;
  destinationNameEn: string;
  destinationNameTa: string;
  stopsRemaining: number;
  etaMinutes: number;
  stage: 'waiting' | 'in_transit' | 'two_stops_away' | 'approaching' | 'get_ready';
  lastNotifiedTime?: string;
}

export interface SimulationState {
  isRunning: boolean;
  speedMultiplier: number;
  isTrafficSpikeActive: boolean;
  isRoadClosureActive: boolean;
  isRainSimulated: boolean;
  isBusBreakdownSimulated: boolean;
  isHighCrowdSimulated: boolean;
}

export type CrewWarningType = 'missing_conductor' | 'shift_limit_imminent' | 'shift_exceeded' | 'compliant';

export interface RouteCrewWarning {
  id: string;
  routeId: string;
  routeNumber: string;
  routeNameEn: string;
  routeNameTa: string;
  originEn: string;
  originTa: string;
  destinationEn: string;
  destinationTa: string;
  operatorCategory: OperatorCategory;
  serviceType: ServiceType;
  busId: string;
  busRegistration: string;
  depotCode: string;
  depotNameEn: string;
  depotNameTa: string;
  warningType: CrewWarningType;
  severity: 'critical' | 'warning' | 'info';
  // Driver stats
  driverNameEn: string;
  driverNameTa: string;
  driverEmpId: string;
  driverBadge: string;
  driverDutyMinutes: number; // e.g. 455 mins
  driverDutyFormatted: string; // e.g. "7h 35m"
  driverPhone: string;
  // Conductor stats
  hasConductor: boolean;
  conductorNameEn?: string;
  conductorNameTa?: string;
  conductorEmpId?: string;
  conductorBadge?: string;
  conductorDutyMinutes?: number;
  conductorDutyFormatted?: string;
  conductorPhone?: string;
  etmDeviceId?: string;
  // Statutory limits (Motor Transport Workers Act, 1961 - 8hr cap)
  mandatoryLimitMinutes: number; // default 480 (8 hours)
  minutesToLimit: number; // difference (can be negative if breached)
  percentOfShiftCompleted: number; // 0 - 100+
  // Descriptions & Recommendations
  issueTitleEn: string;
  issueTitleTa: string;
  issueDescriptionEn: string;
  issueDescriptionTa: string;
  regulatoryImpactEn: string;
  regulatoryImpactTa: string;
  recommendedActionEn: string;
  recommendedActionTa: string;
  handoverPointEn?: string;
  handoverPointTa?: string;
  isResolved?: boolean;
  resolutionNote?: string;
  lastUpdated: string;
}

export interface AiEtaResult {
  formattedEta: string; // e.g. "8:42 AM"
  etaMinutes: number;
  confidencePercent: number; // e.g. 92%
  expectedDelayMinutes: number; // e.g. +4 min
  delaySeverity: 'none' | 'minor' | 'moderate' | 'severe';
  delayReasonEn: string;
  delayReasonTa: string;
  factors: {
    nameEn: string;
    nameTa: string;
    impactMinutes: number;
    category: 'traffic' | 'weather' | 'stops' | 'peak_hour' | 'speed';
  }[];
  isSimulated: boolean;
}

export interface SmartRouteScore {
  routeId: string;
  routeNumber: string;
  nameEn: string;
  nameTa: string;
  aiScore: number; // /100 e.g. 94/100
  travelTimeFormatted: string; // e.g. "1h 38m"
  travelTimeMinutes: number;
  expectedDelayMinutes: number;
  crowdLevel: CrowdLevel;
  crowdPercent: number;
  reliabilityPercent: number; // e.g. 93%
  fareRupees: number;
  stopCount: number;
  recommendationTag: 'fastest' | 'cheapest' | 'least_crowded' | 'most_reliable' | 'fewest_stops' | 'balanced';
  tagLabelEn: string;
  tagLabelTa: string;
  isWomenPinkBus?: boolean;
}

export interface CrowdPredictionResult {
  currentCrowdPercent: number; // e.g. 72%
  currentLevel: CrowdLevel; // 'low' | 'medium' | 'high' | 'very_high'
  predictedNextStopPercent: number; // e.g. 84%
  predictedLevel: CrowdLevel;
  confidenceScore: number;
  peakContextEn: string;
  peakContextTa: string;
  isSimulated: boolean;
}

export interface DelayDetectionAlert {
  isDelayed: boolean;
  normalTravelTimeMinutes: number;
  predictedTravelTimeMinutes: number;
  delayMinutes: number;
  reasonEn: string;
  reasonTa: string;
  suggestedAlternatives: {
    busId?: string;
    busNumber: string;
    routeId: string;
    titleEn: string;
    titleTa: string;
    savingMinutes: number;
    type: 'alternative_bus' | 'alternative_route' | 'later_bus' | 'faster_route';
  }[];
}

export interface BusIotTelemetry {
  passengerCount: number;
  capacityTotal: number;
  seatsAvailable: number;
  occupancyPercent: number;
  frontDoorStatus: 'closed' | 'open';
  rearDoorStatus: 'closed' | 'open';
  opticalSensorCount: number;
  irBeamInCount: number;
  irBeamOutCount: number;
  weightLoadKg: number;
  maxWeightLoadKg: number;
  isDemoSensor: boolean;
}

export interface PredictiveMaintenanceData {
  healthScore: number; // 0-100 e.g. 87
  status: 'EXCELLENT' | 'GOOD' | 'ATTENTION' | 'CRITICAL';
  engineHealthPercent: number;
  coolantTempCelsius: number;
  oilPressurePsi: number;
  batteryVoltage: number;
  batteryHealthPercent: number;
  brakeWearPercent: number;
  tyrePressurePsi: number[]; // 6 wheels
  nextServiceKm: number;
  odometerKm: number;
  lastServiceDate: string;
  isDemoData: boolean;
}
