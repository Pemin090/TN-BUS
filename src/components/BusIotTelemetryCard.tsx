import React, { useState } from 'react';
import { Bus, Language } from '../types';
import { generateBusIotTelemetry, generatePredictiveMaintenance } from '../services/aiEtaEngine';
import {
  Cpu,
  Activity,
  Users,
  Gauge,
  Thermometer,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Wrench,
  Radio,
  DoorClosed,
  DoorOpen,
  Sparkles,
  Info
} from 'lucide-react';

interface BusIotTelemetryCardProps {
  bus: Bus;
  language: Language;
}

export const BusIotTelemetryCard: React.FC<BusIotTelemetryCardProps> = ({ bus, language }) => {
  const [activeTab, setActiveTab] = useState<'occupancy' | 'health'>('occupancy');

  const iot = generateBusIotTelemetry(bus);
  const health = generatePredictiveMaintenance(bus);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-slate-100 flex flex-col gap-3 font-sans">
      {/* Header with IoT Simulator Tag */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>{language === 'ta' ? 'வாகன IoT & பராமரிப்பு நுண்ணறிவு' : 'IoT Telemetry & Fleet Health'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Vehicle {bus.registrationNumber} • {bus.routeNumber}
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('occupancy')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeTab === 'occupancy' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ta' ? 'பயணிகள் எண்ணிக்கை' : 'Occupancy Sensors'}
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeTab === 'health' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ta' ? 'வாகன நலம்' : 'Vehicle Health'}
          </button>
        </div>
      </div>

      {/* Mandatory Demo Label Notice */}
      <div className="p-1.5 px-2 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[10px] text-amber-300 font-mono">
        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
          {language === 'ta' ? 'IoT உணரிகள் மாதிரி முறைமை' : 'DEMO DATA / IoT HARDWARE SIMULATOR'}
        </span>
        <span className="text-slate-400">MQTT • CANBUS 2.0B</span>
      </div>

      {/* Tab 1: IoT Occupancy Sensors */}
      {activeTab === 'occupancy' && (
        <div className="flex flex-col gap-3">
          {/* Live Progress Bar */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                {language === 'ta' ? 'நேரலை பயணிகள் கொள்ளளவு' : 'Passenger Capacity Load'}
              </span>
              <span className="font-bold text-white font-mono">
                {iot.passengerCount} / {iot.capacityTotal} seats ({iot.occupancyPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  iot.occupancyPercent >= 85
                    ? 'bg-rose-500'
                    : iot.occupancyPercent >= 65
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${iot.occupancyPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>Available Seats: <strong className="text-emerald-400">{iot.seatsAvailable}</strong></span>
              <span>Weight: {Math.round(iot.weightLoadKg / 1000)} T / 14.2 T max</span>
            </div>
          </div>

          {/* Sub-Sensors Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Front Door Beam */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Front IR Beam</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1 font-mono">
                <span>+{iot.irBeamInCount} In</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Door: <strong className={iot.frontDoorStatus === 'closed' ? 'text-slate-300' : 'text-amber-400'}>{iot.frontDoorStatus.toUpperCase()}</strong>
              </span>
            </div>

            {/* Rear Door Beam */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Rear IR Beam</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1 font-mono">
                <span>-{iot.irBeamOutCount} Out</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Door: <strong className="text-slate-300">CLOSED</strong>
              </span>
            </div>

            {/* Overhead Optical AI Counter */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Overhead AI Cam</span>
                <span className="text-sky-400">30 FPS</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 font-mono">
                {iot.opticalSensorCount} Detected
              </div>
              <span className="text-[10px] text-emerald-400 block mt-0.5">99.2% accuracy</span>
            </div>

            {/* Strain Gauge Floor Sensors */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Strain Load Cell</span>
                <span className="text-emerald-400">Nominal</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 font-mono">
                {(iot.weightLoadKg / 1000).toFixed(1)} Tons
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Suspension OK</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Predictive Maintenance & Vehicle Health */}
      {activeTab === 'health' && (
        <div className="flex flex-col gap-3">
          {/* Health Score Overview */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg font-mono border ${
                health.healthScore >= 85
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {health.healthScore}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">BUS HEALTH SCORE</span>
                <h5 className="font-extrabold text-sm text-white">
                  STATUS: <span className="text-emerald-400">{health.status}</span>
                </h5>
                <p className="text-[10px] text-slate-400">
                  Next Depot Inspection in {health.nextServiceKm} km
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[10px] text-slate-400 block font-mono">Odometer</span>
              <span className="font-bold text-slate-200 font-mono">{(health.odometerKm).toLocaleString()} km</span>
            </div>
          </div>

          {/* Diagnostic Sub-Components */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Coolant Temp</span>
              <span className="font-bold text-white font-mono text-sm">{health.coolantTempCelsius}°C</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Optimal Range</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Battery Voltage</span>
              <span className="font-bold text-white font-mono text-sm">{health.batteryVoltage} V</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">{health.batteryHealthPercent}% Health</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Brake Pad Life</span>
              <span className="font-bold text-white font-mono text-sm">{100 - health.brakeWearPercent}%</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Air Brakes OK</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">TPMS Tyres</span>
              <span className="font-bold text-white font-mono text-sm">110 PSI</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">6 Wheels Balanced</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 px-1 font-mono">
            Last Service Log: {health.lastServiceDate}
          </p>
        </div>
      )}
    </div>
  );
};
