/**
 * PHASE 19: FUTURE API ARCHITECTURE & ENTERPRISE INTEGRATION INTERFACES
 * Defines clean, future-proof interfaces for integrating:
 * - Real-time AIS-140 GPS Telematics (MoRTH / TNSTC)
 * - Live Traffic APIs (Google Traffic / TomTom / OpenStreetMap)
 * - Weather Warning Services (IMD / OpenWeather)
 * - Fleet IoT Sensors (MQTT / WebSockets)
 * - Open Transit Data (ONDC / GTFS-Realtime / TN Transport Portal)
 * 
 * Note: When external APIs are unconfigured or keys not present,
 * the platform cleanly defaults to high-fidelity DEMO / SIMULATION mode with clear labels.
 */

import { Bus, BusRoute, BusStop, LatLng, TrafficIncident, WeatherRiskArea } from '../types';

export interface GpsFeedVehicle {
  vehicleId: string;
  registrationNumber: string;
  latitude: number;
  longitude: number;
  bearingDegrees: number;
  speedKmh: number;
  timestampUtc: string;
  isIgnitionOn: boolean;
  gpsFixQuality: '3D_FIX' | '2D_FIX' | 'NO_FIX';
}

export interface IGpsProviderService {
  providerName: string;
  isConnected: boolean;
  isSimulationMode: boolean;
  fetchLiveBuses(): Promise<GpsFeedVehicle[]>;
  subscribeVehicleStream?(callback: (vehicle: GpsFeedVehicle) => void): () => void;
}

export interface ITrafficIntelligenceService {
  providerName: string;
  fetchCongestionOnCorridor(start: LatLng, end: LatLng): Promise<{
    delayMinutes: number;
    congestionLevel: 'free' | 'moderate' | 'heavy' | 'jammed';
    averageSpeedKmh: number;
  }>;
  fetchActiveIncidents(): Promise<TrafficIncident[]>;
}

export interface IWeatherAlertService {
  providerName: string;
  fetchRegionalAlerts(district: string): Promise<{
    condition: 'clear' | 'rain' | 'heavy_monsoon' | 'fog';
    rainIntensityMmPerHr: number;
    recommendedSpeedCapKmh: number;
  }>;
}

export interface IIotSensorGateway {
  gatewayType: 'MQTT' | 'REST' | 'WEBSOCKET';
  subscribePassengerCounters(busId: string, onData: (inCount: number, outCount: number) => void): void;
  subscribeCanbusDiagnostics(busId: string, onDiag: (engineTemp: number, batteryVolt: number) => void): void;
}

export interface IOpenTransitDataClient {
  fetchGtfsRealtimeTripUpdates(): Promise<any[]>;
  fetchDistrictTimetables(districtCode: string): Promise<any[]>;
}

// Concrete Simulation / Demonstration Gateway Implementation
export class TamilNaduTransitGateway implements IGpsProviderService, ITrafficIntelligenceService {
  public providerName = 'TN-STC Smart Telematics Gateway (Simulation Engine)';
  public isConnected = true;
  public isSimulationMode = true;

  async fetchLiveBuses(): Promise<GpsFeedVehicle[]> {
    // Returns typed mock structure conforming to AIS-140 standard
    return [];
  }

  async fetchCongestionOnCorridor(start: LatLng, end: LatLng) {
    return {
      delayMinutes: 4,
      congestionLevel: 'moderate' as const,
      averageSpeedKmh: 34
    };
  }

  async fetchActiveIncidents(): Promise<TrafficIncident[]> {
    return [];
  }
}

export const activeTransitGateway = new TamilNaduTransitGateway();
