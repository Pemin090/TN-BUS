import React, { useState } from 'react';
import { Bus, BusRoute, RouteCrewWarning, CrewWarningType, Language } from '../types';
import {
  AVAILABLE_STANDBY_CONDUCTORS,
  StandbyConductorOption,
  assignConductorToRoute,
  dispatchReliefCrewHandover,
  generateRouteCrewWarnings
} from '../data/crewShiftManager';
import {
  AlertTriangle,
  ShieldAlert,
  UserX,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Zap,
  MapPin,
  Building2,
  ExternalLink,
  ChevronRight,
  Phone,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface RouteCrewWarningSystemProps {
  routes: BusRoute[];
  buses: Bus[];
  language: Language;
  onSelectBus: (bus: Bus) => void;
}

export const RouteCrewWarningSystem: React.FC<RouteCrewWarningSystemProps> = ({
  routes,
  buses,
  language,
  onSelectBus
}) => {
  // Master state of route crew warnings
  const [warnings, setWarnings] = useState<RouteCrewWarning[]>(() =>
    generateRouteCrewWarnings(routes, buses)
  );

  // Active filter tab
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'warning_only' | 'missing_conductor' | 'shift_limit' | 'compliant'
  >('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Standby conductor assignment modal target
  const [assigningRoute, setAssigningRoute] = useState<RouteCrewWarning | null>(null);
  const [selectedStandby, setSelectedStandby] = useState<StandbyConductorOption>(
    AVAILABLE_STANDBY_CONDUCTORS[0]
  );

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // KPI Counts
  const countMissingConductor = warnings.filter(
    (w) => w.warningType === 'missing_conductor' && !w.isResolved
  ).length;

  const countShiftLimitImminent = warnings.filter(
    (w) => w.warningType === 'shift_limit_imminent' && !w.isResolved
  ).length;

  const countShiftBreached = warnings.filter(
    (w) => w.warningType === 'shift_exceeded' && !w.isResolved
  ).length;

  const countCompliant = warnings.filter(
    (w) => w.warningType === 'compliant' || w.isResolved
  ).length;

  const totalWarningsCount = countMissingConductor + countShiftLimitImminent + countShiftBreached;

  // Filtered warnings list
  const filteredWarnings = warnings.filter((item) => {
    // 1. Tab filter
    if (activeFilter === 'warning_only' && (item.warningType === 'compliant' || item.isResolved)) {
      return false;
    }
    if (activeFilter === 'missing_conductor' && (item.warningType !== 'missing_conductor' || item.isResolved)) {
      return false;
    }
    if (
      activeFilter === 'shift_limit' &&
      ((item.warningType !== 'shift_limit_imminent' && item.warningType !== 'shift_exceeded') || item.isResolved)
    ) {
      return false;
    }
    if (activeFilter === 'compliant' && item.warningType !== 'compliant' && !item.isResolved) {
      return false;
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoute =
        item.routeNumber.toLowerCase().includes(q) ||
        item.routeNameEn.toLowerCase().includes(q) ||
        item.routeNameTa.toLowerCase().includes(q);
      const matchBus = item.busRegistration.toLowerCase().includes(q);
      const matchDriver =
        item.driverNameEn.toLowerCase().includes(q) ||
        (item.conductorNameEn && item.conductorNameEn.toLowerCase().includes(q));
      const matchDepot = item.depotNameEn.toLowerCase().includes(q);
      return matchRoute || matchBus || matchDriver || matchDepot;
    }

    return true;
  });

  // Handle emergency conductor assignment
  const handleConfirmAssignment = () => {
    if (!assigningRoute) return;
    const updated = assignConductorToRoute(warnings, assigningRoute.routeId, selectedStandby);
    setWarnings(updated);
    showToast(
      language === 'ta'
        ? `வழித்தடம் ${assigningRoute.routeNumber}-க்கு மாற்று நடத்துனர் ${selectedStandby.nameTa} நியமிக்கப்பட்டார்!`
        : `Standby Conductor ${selectedStandby.nameEn} assigned to Route ${assigningRoute.routeNumber} successfully!`
    );
    setAssigningRoute(null);
  };

  // Handle relief crew handover dispatch
  const handleDispatchRelief = (item: RouteCrewWarning) => {
    const updated = dispatchReliefCrewHandover(warnings, item.routeId);
    setWarnings(updated);
    showToast(
      language === 'ta'
        ? `வழித்தடம் ${item.routeNumber}-ல் மாற்றுப் பணியாளர் பொறுப்பேற்பு உறுதி செய்யப்பட்டது. ஷிப்ட் புதுப்பிக்கப்பட்டது!`
        : `Relief crew handover confirmed for Route ${item.routeNumber}. Shift hours refreshed to 0h 20m!`
    );
  };

  // Simulate crew shift overrun alert scenario
  const handleSimulateAlert = () => {
    setWarnings((prev) =>
      prev.map((w, index) => {
        if (index === 0 && w.warningType === 'compliant') {
          return {
            ...w,
            warningType: 'shift_limit_imminent',
            severity: 'warning',
            driverDutyMinutes: 472,
            driverDutyFormatted: '7h 52m active',
            minutesToLimit: 8,
            percentOfShiftCompleted: 98,
            isResolved: false,
            issueTitleEn: 'Simulated Shift Limit Alert: 8m Remaining',
            issueTitleTa: 'பணி நேர எச்சரிக்கை: 8 நிமிடங்கள் மட்டுமே உள்ளது',
            issueDescriptionEn:
              'Simulated high congestion alert. Shift hours nearing statutory limit of 480 mins.',
            issueDescriptionTa: 'அதிக நெரிசலால் பணி நேரம் 8 மணி நேர வரம்பை நெருங்குகிறது.',
            lastUpdated: 'Just now (Simulated)'
          };
        }
        return w;
      })
    );
    showToast(
      language === 'ta'
        ? 'செயல்முறை எச்சரிக்கை இயக்கப்பட்டது: ஒரு வழித்தடத்தின் பணி நேரம் 8 மணி வரம்பை நெருங்குகிறது!'
        : 'Simulation triggered: Route crew shift nearing mandatory 8-hour statutory limit!'
    );
  };

  // Reset all warnings
  const handleResetAll = () => {
    setWarnings(generateRouteCrewWarnings(routes, buses));
    showToast(
      language === 'ta'
        ? 'பணியாளர் நிலை துவக்க நிலைக்கு மீட்டமைக்கப்பட்டது.'
        : 'Crew warnings and rosters reset to initial operational state.'
    );
  };

  // Locate bus
  const handleLocateBus = (item: RouteCrewWarning) => {
    const bus = buses.find((b) => b.id === item.busId || b.routeId === item.routeId);
    if (bus) {
      onSelectBus(bus);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Statutory Directive */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white tracking-tight">
              {language === 'ta'
                ? 'வழித்தட பணியாளர் எச்சரிக்கை & பணி நேர வரம்பு கண்காணிப்பு'
                : 'Route Crew Compliance & Statutory Shift Warning System'}
            </h3>
            {totalWarningsCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                {totalWarningsCount} {language === 'ta' ? 'கவனிக்க வேண்டிய வழித்தடங்கள்' : 'Routes Require Action'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {language === 'ta' ? 'அனைத்து வழித்தடங்களும் தயார்' : 'All Routes Fully Compliant'}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            {language === 'ta'
              ? 'தமிழ்நாடு மோட்டார் வாகன விதி 180 (கட்டாய நடத்துனர்) மற்றும் மோட்டார் போக்குவரத்து தொழிலாளர் சட்டம் 1961 (அதிகபட்ச 8 மணி நேர ஷிப்ட்) நேரலை கண்காணிப்பு.'
              : 'Real-time compliance monitoring under Motor Transport Workers Act, 1961 (8h Mandatory Shift Cap) and TN Motor Vehicles Rules (Mandatory Conductor Carriage).'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <button
            onClick={handleSimulateAlert}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Simulate a shift nearing mandatory limit warning"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ta' ? 'எச்சரிக்கை மாதிரி' : 'Simulate Shift Warning'}</span>
          </button>

          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/80 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Reset warnings to initial state"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'ta' ? 'மீட்டமை' : 'Reset Rosters'}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Alert Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Missing Conductor */}
        <div
          onClick={() => setActiveFilter('missing_conductor')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            countMissingConductor > 0
              ? 'bg-rose-950/40 border-rose-500/50 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'ta' ? 'நடத்துனர் இல்லாதவை' : 'Missing Conductor'}
            </span>
            <UserX className={`w-4 h-4 ${countMissingConductor > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-2xl font-black font-mono ${
                countMissingConductor > 0 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {countMissingConductor}
            </span>
            <span className="text-[10px] text-slate-500">{language === 'ta' ? 'வழித்தடங்கள்' : 'routes'}</span>
          </div>
          <p className="text-[10px] text-rose-300/80 mt-1 truncate">
            {countMissingConductor > 0
              ? language === 'ta'
                ? 'ஓட்டுநர் மட்டும் பயணம் — அவசர ஒதுக்கீடு தேவை'
                : 'Driver-only running — urgent dispatch'
              : language === 'ta'
              ? 'அனைத்து பேருந்துகளிலும் நடத்துனர் உள்ளனர்'
              : 'All scheduled buses staffed'}
          </p>
        </div>

        {/* Card 2: Shift Limit Imminent (<45m to 8h) */}
        <div
          onClick={() => setActiveFilter('shift_limit')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            countShiftLimitImminent > 0
              ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'ta' ? 'பணி நேரம் முடிய உள்ளது' : 'Shift Limit Imminent'}
            </span>
            <Clock className={`w-4 h-4 ${countShiftLimitImminent > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-2xl font-black font-mono ${
                countShiftLimitImminent > 0 ? 'text-amber-300' : 'text-slate-200'
              }`}
            >
              {countShiftLimitImminent}
            </span>
            <span className="text-[10px] text-slate-500">{language === 'ta' ? 'வழித்தடங்கள்' : 'routes'}</span>
          </div>
          <p className="text-[10px] text-amber-300/80 mt-1 truncate">
            {countShiftLimitImminent > 0
              ? language === 'ta'
                ? '8 மணி நேர வரம்புக்கு <45 நிமிடம் உள்ளது'
                : '<45 mins to 8h statutory limit'
              : language === 'ta'
              ? 'பணி நேரம் கட்டுப்பாட்டுக்குள் உள்ளது'
              : 'Crew fatigue risk low'}
          </p>
        </div>

        {/* Card 3: Shift Limit Breached (>8h) */}
        <div
          onClick={() => setActiveFilter('shift_limit')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            countShiftBreached > 0
              ? 'bg-purple-950/40 border-purple-500/50 hover:border-purple-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'ta' ? 'வரம்பு மீறிய பணி நேரம்' : 'Shift Limit Breached'}
            </span>
            <AlertTriangle className={`w-4 h-4 ${countShiftBreached > 0 ? 'text-purple-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-2xl font-black font-mono ${
                countShiftBreached > 0 ? 'text-purple-400' : 'text-slate-200'
              }`}
            >
              {countShiftBreached}
            </span>
            <span className="text-[10px] text-slate-500">{language === 'ta' ? 'வழித்தடங்கள்' : 'routes'}</span>
          </div>
          <p className="text-[10px] text-purple-300/80 mt-1 truncate">
            {countShiftBreached > 0
              ? language === 'ta'
                ? '8 மணி நேரத்திற்கு மேல் கூடுதல் பணி'
                : '>8h overtime — immediate swap'
              : language === 'ta'
              ? 'கூடுதல் பணி நேர மீறல் இல்லை'
              : 'Zero labor overtime violations'}
          </p>
        </div>

        {/* Card 4: Fully Compliant Routes */}
        <div
          onClick={() => setActiveFilter('compliant')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'compliant'
              ? 'bg-emerald-950/40 border-emerald-500/50'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'ta' ? 'முறையான பணியாளர்கள்' : 'Fully Compliant'}
            </span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{countCompliant}</span>
            <span className="text-[10px] text-slate-500">{language === 'ta' ? 'வழித்தடங்கள்' : 'routes'}</span>
          </div>
          <p className="text-[10px] text-emerald-400/80 mt-1 truncate">
            {language === 'ta' ? 'நடத்துனர் & ஓட்டுநர் தகுதி பெற்றவர்கள்' : 'Both crew certified & on duty'}
          </p>
        </div>
      </div>

      {/* 3. Search Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'வழித்தட எண், ஊர் அல்லது ஓட்டுநர் பெயர் தேடுக (எ.கா: 500, 172, தாம்பரம்)...'
                : 'Search by Route (e.g. 500, 172), Corridor, Bus Reg, or Crew name...'
            }
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-sky-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ta' ? 'அனைத்தும்' : 'All Routes'} ({warnings.length})
          </button>

          <button
            onClick={() => setActiveFilter('warning_only')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'warning_only'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ta' ? 'எச்சரிக்கைகள் மட்டும்' : '⚠️ Warnings Only'} ({totalWarningsCount})
          </button>

          <button
            onClick={() => setActiveFilter('missing_conductor')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'missing_conductor'
                ? 'bg-rose-700 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ta' ? 'நடத்துனர் இன்மை' : 'No Conductor'} ({countMissingConductor})
          </button>

          <button
            onClick={() => setActiveFilter('shift_limit')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'shift_limit'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ta' ? 'பணி நேரம் முடிவு' : 'Shift Near 8h'} ({countShiftLimitImminent + countShiftBreached})
          </button>

          <button
            onClick={() => setActiveFilter('compliant')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'compliant'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ta' ? 'முறையானவை' : 'Compliant'} ({countCompliant})
          </button>
        </div>
      </div>

      {/* 4. List of Route Warning Cards */}
      <div className="flex flex-col gap-3.5">
        {filteredWarnings.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              {language === 'ta' ? 'எவ்வித எச்சரிக்கைகளும் இல்லை' : 'No Route Crew Warnings Found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              {language === 'ta'
                ? 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டலில் அனைத்து பேருந்துகளும் தகுதி பெற்ற பணியாளர்களுடன் இயங்கி வருகின்றன.'
                : 'All bus routes under this filter criteria have assigned conductors and crew shifts operating safely within the 8-hour statutory limit.'}
            </p>
          </div>
        ) : (
          filteredWarnings.map((item) => {
            const isMissingConductor = item.warningType === 'missing_conductor' && !item.isResolved;
            const isShiftImminent = item.warningType === 'shift_limit_imminent' && !item.isResolved;
            const isShiftBreached = item.warningType === 'shift_exceeded' && !item.isResolved;
            const isResolvedOrCompliant = item.isResolved || item.warningType === 'compliant';

            // Card border styling based on warning severity
            const cardBorder = isMissingConductor
              ? 'border-rose-500/70 bg-slate-950/90 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
              : isShiftBreached
              ? 'border-purple-500/70 bg-slate-950/90 shadow-[0_0_20px_rgba(168,85,247,0.12)]'
              : isShiftImminent
              ? 'border-amber-500/70 bg-slate-950/90 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
              : 'border-slate-800 bg-slate-950/60';

            // Progress bar color
            const progressColor =
              item.percentOfShiftCompleted >= 100
                ? 'bg-purple-500 animate-pulse'
                : item.percentOfShiftCompleted >= 90
                ? 'bg-rose-500'
                : item.percentOfShiftCompleted >= 75
                ? 'bg-amber-400'
                : 'bg-emerald-400';

            return (
              <div
                key={item.id}
                className={`border-2 rounded-2xl p-4 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden ${cardBorder}`}
              >
                {/* Visual accent top line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isMissingConductor
                      ? 'bg-rose-500'
                      : isShiftBreached
                      ? 'bg-purple-500'
                      : isShiftImminent
                      ? 'bg-amber-400'
                      : 'bg-emerald-500/60'
                  }`}
                />

                {/* Route Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Route Number Badge */}
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-extrabold text-xs shadow-sm flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.operatorCategory === 'MTC'
                            ? 'bg-sky-400'
                            : item.operatorCategory === 'SETC'
                            ? 'bg-rose-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span>{item.routeNumber}</span>
                    </span>

                    {/* Route Origin ⇄ Destination */}
                    <span className="font-bold text-sm text-white">
                      {language === 'ta' ? item.routeNameTa : item.routeNameEn}
                    </span>

                    {/* Operator Division */}
                    <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {item.operatorCategory} • {item.depotCode}
                    </span>
                  </div>

                  {/* Warning Severity Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isMissingConductor && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                        <UserX className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? '🚨 நடத்துனர் நியமிக்கப்படவில்லை' : '🚨 NO CONDUCTOR ASSIGNED'}</span>
                      </span>
                    )}

                    {isShiftImminent && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {language === 'ta'
                            ? `⚠️ பணி நேரம் முடிவடைகிறது (${item.minutesToLimit} நிமிடம் மீதம்)`
                            : `⚠️ SHIFT LIMIT IMMINENT (${item.minutesToLimit}m Left to 8h)`}
                        </span>
                      </span>
                    )}

                    {isShiftBreached && (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>
                          {language === 'ta'
                            ? '🛑 8 மணி நேர வரம்பு மீறப்பட்டது (+15 நிமிடம்)'
                            : '🛑 MANDATORY LIMIT BREACHED (>8h)'}
                        </span>
                      </span>
                    )}

                    {isResolvedOrCompliant && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {item.isResolved
                            ? language === 'ta'
                              ? 'சரிசெய்யப்பட்டது'
                              : 'ACTION APPLIED / RESOLVED'
                            : language === 'ta'
                            ? 'பணியாளர்கள் சரியானது'
                            : 'CREW COMPLIANT'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Specific Bus & Assigned Crew Inspection Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                  {/* Driver Shift Monitor Column */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                          D
                        </span>
                        <div>
                          <span className="font-bold text-slate-200">
                            {language === 'ta' ? item.driverNameTa : item.driverNameEn}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-1.5 font-mono">
                            {item.driverEmpId} • {item.driverBadge}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono font-bold text-slate-300">
                        {item.driverDutyFormatted}
                      </span>
                    </div>

                    {/* Shift Progress Gauge Bar */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>
                          {language === 'ta' ? 'தொடர் பணி நேரம் (வரம்பு: 8 மணி)' : 'Active Shift (Statutory Cap: 8h)'}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            item.percentOfShiftCompleted >= 90 ? 'text-rose-400' : 'text-slate-300'
                          }`}
                        >
                          {item.percentOfShiftCompleted}% ({item.driverDutyMinutes} / 480m)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                          style={{ width: `${Math.min(item.percentOfShiftCompleted, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Operational Shift Status Tag */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>
                        Bus:{' '}
                        <button
                          onClick={() => handleLocateBus(item)}
                          className="font-mono text-sky-400 font-bold hover:underline inline-flex items-center gap-0.5"
                          title="Click to track this bus"
                        >
                          <span>{item.busRegistration}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </span>
                      {item.minutesToLimit > 0 ? (
                        <span className="text-amber-400/90 font-mono text-[10px]">
                          {item.minutesToLimit}m before 8h cutoff
                        </span>
                      ) : (
                        <span className="text-rose-400 font-mono text-[10px] font-bold">
                          +{Math.abs(item.minutesToLimit)}m overtime violation!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conductor Assignment Monitor Column */}
                  <div className="flex flex-col gap-2 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-2 lg:pt-0 lg:pl-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                            item.hasConductor ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          C
                        </span>
                        <div>
                          {item.hasConductor ? (
                            <>
                              <span className="font-bold text-slate-200">
                                {language === 'ta' ? item.conductorNameTa : item.conductorNameEn}
                              </span>
                              <span className="text-[10px] text-slate-500 ml-1.5 font-mono">
                                {item.conductorBadge}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-rose-400">
                              {language === 'ta' ? 'நடத்துனர் ஒதுக்கப்படவில்லை (காலியிடம்)' : 'UNASSIGNED / VACANT'}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-mono font-bold ${
                          item.hasConductor ? 'text-slate-300' : 'text-rose-400 animate-pulse'
                        }`}
                      >
                        {item.conductorDutyFormatted}
                      </span>
                    </div>

                    {/* Conductor ETM & Ticketing Status */}
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">
                          {language === 'ta' ? 'டிக்கெட் இயந்திர நிலை (ETM):' : 'ETM Machine Status:'}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold ${
                            item.hasConductor ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {item.etmDeviceId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.hasConductor ? (
                          <span>
                            {language === 'ta'
                              ? 'கட்டண வசூல் மற்றும் மகளிர் இலவச டிக்கெட் விநியோகம் சீராக இயங்குகிறது.'
                              : 'Ticketing synced; regular and Vidiyal Payanam tokens recorded.'}
                          </span>
                        ) : (
                          <span className="text-rose-300 font-semibold">
                            {language === 'ta'
                              ? '⚠️ டிக்கெட் இயந்திரம் இணைக்கப்படவில்லை! கட்டண வசூல் தடைபட்டுள்ளது.'
                              : '⚠️ Ticketing offline. Driver cannot manage fare collection alone.'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regulatory Impact & Recommended Mitigation */}
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                      <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{language === 'ta' ? item.issueTitleTa : item.issueTitleEn}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {language === 'ta' ? item.issueDescriptionTa : item.issueDescriptionEn}
                    </p>
                    <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                      <strong>Directive:</strong>{' '}
                      {language === 'ta' ? item.regulatoryImpactTa : item.regulatoryImpactEn}
                    </div>
                  </div>

                  {/* Interactive Operational Resolution Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Action 1: Assign Standby Conductor if missing */}
                    {isMissingConductor && (
                      <button
                        onClick={() => setAssigningRoute(item)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'மாற்று நடத்துனரை நியமி' : 'Assign Standby Conductor'}</span>
                      </button>
                    )}

                    {/* Action 2: Dispatch Relief Crew Handover if shift is nearing limit */}
                    {(isShiftImminent || isShiftBreached) && (
                      <button
                        onClick={() => handleDispatchRelief(item)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                        title={`Handover point: ${item.handoverPointEn}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'மாற்று பணியாளர் ஒப்படைப்பு' : 'Dispatch Relief Handover'}</span>
                      </button>
                    )}

                    {/* Action 3: Locate Bus on Live Map */}
                    <button
                      onClick={() => handleLocateBus(item)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>{language === 'ta' ? 'பேருந்து வரைபடம்' : 'Track Bus'}</span>
                    </button>
                  </div>
                </div>

                {/* Handover Point Indicator */}
                {item.handoverPointEn && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 px-1">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>
                      {language === 'ta' ? 'ஒதுக்கப்பட்ட ஒப்படைப்பு சந்திப்பு:' : 'Designated Relief Bay:'}{' '}
                      <strong className="text-slate-300">
                        {language === 'ta' ? item.handoverPointTa : item.handoverPointEn}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Emergency Standby Conductor Assignment Modal */}
      {assigningRoute && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {language === 'ta' ? 'அவசர மாற்று நடத்துனர் ஒதுக்கீடு' : 'Emergency Standby Conductor Assignment'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Route {assigningRoute.routeNumber}: {assigningRoute.routeNameEn} ({assigningRoute.busRegistration})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssigningRoute(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Directive notice */}
            <div className="bg-rose-950/40 border border-rose-500/40 p-3 rounded-xl text-xs flex items-start gap-2 text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {language === 'ta' ? 'கட்டாய மோட்டார் வாகன விதி 180' : 'Statutory Ticketing Rule Enforced'}
                </span>
                <span>
                  {language === 'ta'
                    ? 'தேர்ந்தெடுக்கப்படும் மாற்று நடத்துனருக்கு உடனடியாக மின்-டிக்கெட் இயந்திரம் (ETM) ஒதுக்கப்பட்டு, அடுத்த பேருந்து நிறுத்தத்தில் பொறுப்பேற்பார்.'
                    : 'The assigned conductor will be immediately synced to the bus ETM and boarded at the next designated terminal bay.'}
                </span>
              </div>
            </div>

            {/* Standby Conductors Roster List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300">
                {language === 'ta' ? 'கிடைக்கக்கூடிய மாற்று நடத்துனர்கள் (பணிமனை இருப்பு):' : 'Available Certified Standby Conductors in Depot:'}
              </span>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {AVAILABLE_STANDBY_CONDUCTORS.map((c) => {
                  const isSelected = selectedStandby.empId === c.empId;
                  return (
                    <div
                      key={c.empId}
                      onClick={() => setSelectedStandby(c)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-950/60 border-sky-400 text-white shadow-md'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          C
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">
                            {language === 'ta' ? c.nameTa : c.nameEn}
                            <span className="text-[10px] text-slate-400 font-mono ml-2">
                              {c.badgeNumber}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {c.depotName} • {c.experienceYears} yrs exp • {c.phone}
                          </div>
                          <div className="text-[9px] text-sky-400 font-mono mt-0.5">
                            {c.etmDeviceId}
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-sky-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Handover checkpoint */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">
                {language === 'ta' ? 'ஏறும் இடம் (Boarding Stop):' : 'Boarding Checkpoint:'}
              </span>
              <span className="font-bold text-amber-300">
                {language === 'ta' ? assigningRoute.handoverPointTa : assigningRoute.handoverPointEn}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setAssigningRoute(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                {language === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'ta'
                    ? `${selectedStandby.nameTa}-ஐ நியமி`
                    : `Confirm & Assign ${selectedStandby.nameEn}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
