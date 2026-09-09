import React from 'react';
import { Bus, Language } from '../types';
import { getDepotAndCrewForBus } from '../data/depotCrewRoster';
import {
  Building2,
  UserCheck,
  UserX,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Fuel,
  Wrench,
  Armchair,
  CreditCard,
  MapPin,
  Calendar,
  Compass
} from 'lucide-react';

interface DepotAndCrewViewProps {
  bus: Bus;
  language: Language;
}

export const DepotAndCrewView: React.FC<DepotAndCrewViewProps> = ({ bus, language }) => {
  const roster = getDepotAndCrewForBus(bus);
  const { depotDetails, onDutyDriver, onDutyConductor, offDutyDriver, offDutyConductor } = roster;

  return (
    <div className="flex flex-col gap-4 text-slate-100">
      {/* 1. DEPOT DETAILS CARD */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-sky-600 p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold font-display text-white">
                  {language === 'ta' ? depotDetails.depotNameTa : depotDetails.depotNameEn}
                </h4>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-[10px] border border-sky-500/30">
                  {depotDetails.depotCode}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {depotDetails.division}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-slate-500 block text-[10px]">
              {language === 'ta' ? 'கிளை மேலாளர் (Branch Manager)' : 'Branch Manager'}
            </span>
            <span className="font-semibold text-slate-200">{depotDetails.branchManagerName}</span>
            <div className="flex items-center sm:justify-end gap-1 text-[11px] text-sky-400 font-mono mt-0.5">
              <Phone className="w-3 h-3" />
              <span>{depotDetails.contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Depot Location & Facilities */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">
                {language === 'ta' ? 'பணிமனை முகவரி' : 'Depot Complex Location'}
              </span>
              <span className="text-slate-200 text-[11px]">{depotDetails.locationAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
            <Fuel className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">
                {language === 'ta' ? 'எரிபொருள் வசதி' : 'Fueling & Charging Yard'}
              </span>
              <span className="text-slate-200 text-[11px]">{depotDetails.fuelingFacility}</span>
            </div>
          </div>
        </div>

        {/* Depot Fleet Allocation Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">
              {language === 'ta' ? 'மொத்த பேருந்துகள்' : 'Total Fleet'}
            </span>
            <span className="text-sm font-bold font-mono text-white">{depotDetails.totalBusesAllocated}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-emerald-400 block">
              {language === 'ta' ? 'இயக்கத்தில் உள்ளவை' : 'Active on Road'}
            </span>
            <span className="text-sm font-bold font-mono text-emerald-400">{depotDetails.activeOnRoad}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
            <span className="text-[10px] text-amber-400 block">
              {language === 'ta' ? 'பராமரிப்பில் உள்ளவை' : 'Maintenance Bays'}
            </span>
            <span className="text-sm font-bold font-mono text-amber-400">{depotDetails.underMaintenance}</span>
          </div>
        </div>
      </div>

      {/* 2. ON-DUTY CREW (DRIVER & CONDUCTOR) */}
      <div className="bg-gradient-to-b from-emerald-950/40 via-slate-950/90 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'தற்போது பணியில் உள்ள குழுவினர் (On-Duty Crew)' : 'Active On-Duty Crew'}</span>
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
            {language === 'ta' ? 'பணியில் உள்ளனர்' : 'Active On Duty'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* ON-DUTY DRIVER CARD */}
          <div className="bg-slate-900/90 border border-emerald-600/30 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase">
                    {language === 'ta' ? 'ஓட்டுநர் (Driver)' : 'On-Duty Driver'}
                  </span>
                  <h5 className="text-sm font-bold text-white mt-1">
                    {language === 'ta' ? onDutyDriver.nameTa : onDutyDriver.name}
                  </h5>
                  <span className="text-xs text-slate-400 font-mono">
                    Emp #{onDutyDriver.empId} • Badge: {onDutyDriver.badgeNumber}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                    <span>★</span>
                    <span>{onDutyDriver.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{onDutyDriver.experienceYears} yrs exp</span>
                </div>
              </div>

              {/* License & Shift */}
              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'பணி நேரம்:' : 'Shift Window:'}</span>
                  <span className="font-semibold text-slate-200">{onDutyDriver.shiftTiming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'பணி காலம்:' : 'Active Driving:'}</span>
                  <span className="font-mono text-emerald-400 font-bold">{onDutyDriver.hoursOnDuty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'உரிமம் வகை:' : 'License Class:'}</span>
                  <span className="font-medium text-slate-300">{onDutyDriver.licenseOrBadgeType}</span>
                </div>
              </div>
            </div>

            {/* Breathalyzer & Safety Record */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Breathalyzer: {onDutyDriver.breathalyzerStatus}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>{onDutyDriver.safetyRecord}</span>
              </div>
            </div>
          </div>

          {/* ON-DUTY CONDUCTOR CARD */}
          <div className="bg-slate-900/90 border border-emerald-600/30 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                    {language === 'ta' ? 'நடத்துநர் (Conductor)' : 'On-Duty Conductor'}
                  </span>
                  <h5 className="text-sm font-bold text-white mt-1">
                    {language === 'ta' ? onDutyConductor.nameTa : onDutyConductor.name}
                  </h5>
                  <span className="text-xs text-slate-400 font-mono">
                    Emp #{onDutyConductor.empId} • Badge: {onDutyConductor.badgeNumber}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                    <span>★</span>
                    <span>{onDutyConductor.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{onDutyConductor.experienceYears} yrs exp</span>
                </div>
              </div>

              {/* Conductor Machine & Shift */}
              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'பணி நேரம்:' : 'Shift Window:'}</span>
                  <span className="font-semibold text-slate-200">{onDutyConductor.shiftTiming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'பணி காலம்:' : 'Active Duty:'}</span>
                  <span className="font-mono text-emerald-400 font-bold">{onDutyConductor.hoursOnDuty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'டிக்கெட் இயந்திரம்:' : 'ETM Machine:'}</span>
                  <span className="font-mono text-cyan-300 font-semibold truncate max-w-[170px]">{onDutyConductor.etmDeviceId}</span>
                </div>
              </div>
            </div>

            {/* Breathalyzer & Safety Record */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Breathalyzer: {onDutyConductor.breathalyzerStatus}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{onDutyConductor.safetyRecord}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. OFF-DUTY & RELIEF CREW (DRIVER & CONDUCTOR) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold font-display text-white">
              {language === 'ta' ? 'பணி நிறைவு / அடுத்த முறை பணியாளர்கள் (Off-Duty / Relief Crew)' : 'Off-Duty & Next Shift Relief Crew'}
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
            {language === 'ta' ? 'ஓய்வில் உள்ளனர்' : 'Off-Duty / Standby'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* OFF-DUTY DRIVER */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                    {language === 'ta' ? 'ஓய்வு ஓட்டுநர் (Off-Duty Driver)' : 'Relief Driver'}
                  </span>
                  <h5 className="text-sm font-bold text-white mt-1">
                    {language === 'ta' ? offDutyDriver.nameTa : offDutyDriver.name}
                  </h5>
                  <span className="text-xs text-slate-500 font-mono">
                    Emp #{offDutyDriver.empId} • Badge: {offDutyDriver.badgeNumber}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                    <span>★</span>
                    <span>{offDutyDriver.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{offDutyDriver.experienceYears} yrs exp</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'அடுத்த பணி நேரம்:' : 'Next Shift:'}</span>
                  <span className="font-semibold text-slate-200">{offDutyDriver.shiftTiming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'ஓய்வு நிலை:' : 'Rest Period:'}</span>
                  <span className="font-mono text-amber-400 font-medium">{offDutyDriver.restHoursRemaining}</span>
                </div>
                {offDutyDriver.handoverPoint && (
                  <div className="pt-1 border-t border-slate-800 text-[10px] text-sky-300 flex items-start gap-1">
                    <Compass className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{offDutyDriver.handoverPoint}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{offDutyDriver.safetyRecord}</span>
            </div>
          </div>

          {/* OFF-DUTY CONDUCTOR */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                    {language === 'ta' ? 'ஓய்வு நடத்துநர் (Off-Duty Conductor)' : 'Relief Conductor'}
                  </span>
                  <h5 className="text-sm font-bold text-white mt-1">
                    {language === 'ta' ? offDutyConductor.nameTa : offDutyConductor.name}
                  </h5>
                  <span className="text-xs text-slate-500 font-mono">
                    Emp #{offDutyConductor.empId} • Badge: {offDutyConductor.badgeNumber}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                    <span>★</span>
                    <span>{offDutyConductor.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{offDutyConductor.experienceYears} yrs exp</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'அடுத்த பணி நேரம்:' : 'Next Shift:'}</span>
                  <span className="font-semibold text-slate-200">{offDutyConductor.shiftTiming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'ஓய்வு நிலை:' : 'Rest Period:'}</span>
                  <span className="font-mono text-amber-400 font-medium">{offDutyConductor.restHoursRemaining}</span>
                </div>
                {offDutyConductor.handoverPoint && (
                  <div className="pt-1 border-t border-slate-800 text-[10px] text-sky-300 flex items-start gap-1">
                    <Compass className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{offDutyConductor.handoverPoint}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{offDutyConductor.safetyRecord}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
