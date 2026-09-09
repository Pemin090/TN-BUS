import React, { useState, useMemo } from 'react';
import {
  Bus,
  BusRoute,
  Language,
  OperatorCategory,
  TnstcDivision,
  ServiceType,
  AvailabilityStatus
} from '../types';
import { TAMIL_NADU_38_DISTRICTS, DistrictInfo } from '../data/districtFleetData';
import { DepotCrewModal } from './DepotCrewModal';
import {
  Bus as BusIcon,
  Building2,
  MapPin,
  Compass,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Armchair,
  Sparkles,
  Search,
  Gauge,
  Zap,
  Fuel,
  ShieldCheck,
  Ticket,
  ChevronRight,
  RefreshCw,
  Heart,
  SlidersHorizontal,
  Navigation,
  Info,
  UserCheck
} from 'lucide-react';

interface DistrictBusAvailabilityExplorerProps {
  buses: Bus[];
  routes: BusRoute[];
  language: Language;
  onSelectBus: (bus: Bus) => void;
  onTrackOnMap: (bus: Bus) => void;
  onOpenGetDownAlert: (bus: Bus) => void;
  favoriteBusIds: string[];
  onToggleFavorite: (busId: string) => void;
}

type ZoneFilter = 'All' | 'Chennai & North' | 'Kongu & West' | 'Central Delta' | 'Madurai & South' | 'Deep South';

export const DistrictBusAvailabilityExplorer: React.FC<DistrictBusAvailabilityExplorerProps> = ({
  buses,
  routes,
  language,
  onSelectBus,
  onTrackOnMap,
  onOpenGetDownAlert,
  favoriteBusIds,
  onToggleFavorite
}) => {
  // Filters State
  const [selectedOperatorCategory, setSelectedOperatorCategory] = useState<OperatorCategory | 'ALL'>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<TnstcDivision | 'ALL'>('ALL');
  const [selectedZone, setSelectedZone] = useState<ZoneFilter>('All');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'filling_fast' | 'women_free' | 'ac_only' | 'point_to_point'>('all');
  
  // Seat Reservation Modal State
  const [bookingBus, setBookingBus] = useState<Bus | null>(null);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<number | null>(null);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  // Depot and Crew Roster Modal State
  const [selectedDepotCrewBus, setSelectedDepotCrewBus] = useState<Bus | null>(null);

  // Selected district info object
  const selectedDistrictInfo = useMemo(() => {
    if (selectedDistrictId === 'all') return null;
    return TAMIL_NADU_38_DISTRICTS.find(d => d.id === selectedDistrictId) || null;
  }, [selectedDistrictId]);

  // Filter districts by zone and search
  const filteredDistricts = useMemo(() => {
    return TAMIL_NADU_38_DISTRICTS.filter(dist => {
      const matchesZone = selectedZone === 'All' || dist.zone === selectedZone;
      const matchesSearch =
        dist.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dist.nameTa.includes(searchQuery) ||
        dist.headquartersEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesZone && (searchQuery.length < 2 || matchesSearch);
    });
  }, [selectedZone, searchQuery]);

  // Filter buses based on all active criteria
  const filteredBuses = useMemo(() => {
    return buses.filter(bus => {
      // 1. Operator category filter (TNSTC, SETC, MTC)
      if (selectedOperatorCategory !== 'ALL' && bus.operatorCategory !== selectedOperatorCategory) {
        return false;
      }

      // 2. TNSTC Division filter
      if (selectedOperatorCategory === 'TNSTC' && selectedDivision !== 'ALL') {
        if (bus.tnstcDivision !== selectedDivision) {
          return false;
        }
      }

      // 3. District filter
      if (selectedDistrictId !== 'all') {
        const distObj = TAMIL_NADU_38_DISTRICTS.find(d => d.id === selectedDistrictId);
        if (distObj) {
          const nameEn = distObj.nameEn.toLowerCase();
          const matchesBusDistrict =
            (bus.district && bus.district.toLowerCase().includes(nameEn)) ||
            (bus.districtsTraversed && bus.districtsTraversed.some(d => d.toLowerCase().includes(nameEn))) ||
            bus.operator.toLowerCase().includes(nameEn) ||
            bus.routeNumber.toLowerCase().includes(nameEn);
          if (!matchesBusDistrict) return false;
        }
      }

      // 4. Availability filter
      if (availabilityFilter === 'available' && bus.availableSeats <= 5) return false;
      if (availabilityFilter === 'filling_fast' && bus.availabilityStatus !== 'filling_fast') return false;
      if (availabilityFilter === 'women_free' && !bus.isWomenPinkBus && bus.fareRupees > 0) return false;
      if (availabilityFilter === 'ac_only' && !bus.isAc) return false;
      if (availabilityFilter === 'point_to_point' && bus.serviceType !== 'Point-to-Point') return false;

      // 5. Text Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          bus.routeNumber.toLowerCase().includes(q) ||
          bus.registrationNumber.toLowerCase().includes(q) ||
          bus.operator.toLowerCase().includes(q) ||
          bus.district.toLowerCase().includes(q) ||
          (bus.serviceType && bus.serviceType.toLowerCase().includes(q)) ||
          (bus.telemetry?.depotName && bus.telemetry.depotName.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [buses, selectedOperatorCategory, selectedDivision, selectedDistrictId, availabilityFilter, searchQuery]);

  // Operator Category Counts
  const categoryCounts = useMemo(() => {
    return {
      all: buses.length,
      tnstc: buses.filter(b => b.operatorCategory === 'TNSTC').length,
      setc: buses.filter(b => b.operatorCategory === 'SETC').length,
      mtc: buses.filter(b => b.operatorCategory === 'MTC').length
    };
  }, [buses]);

  // Calculate live district metrics
  const districtStats = useMemo(() => {
    const totalBuses = filteredBuses.length;
    const totalFreeSeats = filteredBuses.reduce((acc, b) => acc + (b.availableSeats || 0), 0);
    const onTimeBuses = filteredBuses.filter(b => b.status === 'on_time').length;
    const onTimePercent = totalBuses > 0 ? Math.round((onTimeBuses / totalBuses) * 100) : 100;
    const pinkBuses = filteredBuses.filter(b => b.isWomenPinkBus || b.fareRupees === 0).length;

    return { totalBuses, totalFreeSeats, onTimePercent, pinkBuses };
  }, [filteredBuses]);

  // Helper: Operator badge color
  const getOperatorBadgeStyle = (category: OperatorCategory, isPink?: boolean) => {
    if (isPink) {
      return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
    }
    switch (category) {
      case 'SETC':
        return 'bg-rose-950/70 text-rose-300 border-rose-600/50';
      case 'TNSTC':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50';
      case 'MTC':
        return 'bg-sky-950/70 text-sky-300 border-sky-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Helper: Seat availability bar styling
  const getSeatBarColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio >= 0.3) return 'bg-emerald-500';
    if (ratio >= 0.1) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-20">
      {/* Hero Banner with Operator Categorisation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {language === 'ta' ? 'அனைத்து தமிழ்நாடு அரசுப் பேருந்துகள்' : 'All Tamil Nadu State Fleet'}
              </span>
              <span className="text-xs text-slate-400 font-mono-transit">
                38 {language === 'ta' ? 'மாவட்டங்கள்' : 'Districts'} • {buses.length} {language === 'ta' ? 'பேருந்துகள் நேரலை' : 'Buses Live'}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-display font-extrabold text-white tracking-tight">
              {language === 'ta' ? 'மாவட்ட வாரிய TNSTC • SETC • MTC பேருந்து கிடைக்கும் விவரம்' : 'District-Wise TNSTC • SETC • MTC Bus Availability Directory'}
            </h2>
            <p className="text-xs lg:text-sm text-slate-400 mt-1 max-w-3xl">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் 38 மாவட்டங்களுக்கும் உட்பட்ட அரசு விரைவு (SETC), மாவட்டப் போக்குவரத்துக் கழகங்கள் (TNSTC 6 மண்டலங்கள்), மற்றும் சென்னை மாநகரப் பேருந்துகள் (MTC) கிடைக்கும் இடங்கள், நேரலை ஆசனங்கள் மற்றும் கட்டண விவரங்கள்.'
                : 'Browse live bus availability, vacant seats, routes, and departure schedules across all 38 districts of Tamil Nadu for SETC, TNSTC (all 6 divisions), and MTC.'}
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[260px] lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'மாவட்டம், வழி எண், ஊர் தேடுக...' : 'Search district, route, city, depot...'}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY CATEGORY TABS: ALL / TNSTC / SETC / MTC */}
        <div className="pt-4 flex flex-col gap-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ta' ? 'போக்குவரத்துக் கழகத் தேர்வு (Operator Category):' : 'Select Corporation / Category:'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* ALL */}
            <button
              onClick={() => {
                setSelectedOperatorCategory('ALL');
                setSelectedDivision('ALL');
              }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedOperatorCategory === 'ALL'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400 shadow-md ring-2 ring-sky-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-left">
                <div className="text-xs font-bold font-display">
                  {language === 'ta' ? 'அனைத்து கழகங்கள்' : 'All Corporations'}
                </div>
                <div className="text-[10px] text-slate-300/80">
                  {language === 'ta' ? 'தமிழ்நாடு முழுவதும்' : 'All Tamil Nadu'}
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${selectedOperatorCategory === 'ALL' ? 'bg-white/20' : 'bg-slate-800 text-slate-300'}`}>
                {categoryCounts.all}
              </span>
            </button>

            {/* TNSTC */}
            <button
              onClick={() => {
                setSelectedOperatorCategory('TNSTC');
                setSelectedDivision('ALL');
              }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedOperatorCategory === 'TNSTC'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-left">
                <div className="text-xs font-bold font-display flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  TNSTC
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  {language === 'ta' ? '6 மண்டலப் பிரிவுகள்' : '6 District Divisions'}
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${selectedOperatorCategory === 'TNSTC' ? 'bg-white/20' : 'bg-emerald-950 text-emerald-300'}`}>
                {categoryCounts.tnstc}
              </span>
            </button>

            {/* SETC */}
            <button
              onClick={() => {
                setSelectedOperatorCategory('SETC');
                setSelectedDivision('ALL');
              }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedOperatorCategory === 'SETC'
                  ? 'bg-gradient-to-r from-rose-700 to-pink-800 text-white border-rose-400 shadow-md ring-2 ring-rose-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-left">
                <div className="text-xs font-bold font-display flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  SETC
                </div>
                <div className="text-[10px] text-rose-300/80">
                  {language === 'ta' ? 'விரைவுப் போக்குவரத்து (Express)' : 'Intercity AC Sleeper'}
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${selectedOperatorCategory === 'SETC' ? 'bg-white/20' : 'bg-rose-950 text-rose-300'}`}>
                {categoryCounts.setc}
              </span>
            </button>

            {/* MTC */}
            <button
              onClick={() => {
                setSelectedOperatorCategory('MTC');
                setSelectedDivision('ALL');
              }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedOperatorCategory === 'MTC'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-400 shadow-md ring-2 ring-sky-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-left">
                <div className="text-xs font-bold font-display flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  MTC Chennai
                </div>
                <div className="text-[10px] text-sky-300/80">
                  {language === 'ta' ? 'சென்னை பெருநகரம்' : 'Chennai Metro / Pink Bus'}
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${selectedOperatorCategory === 'MTC' ? 'bg-white/20' : 'bg-sky-950 text-sky-300'}`}>
                {categoryCounts.mtc}
              </span>
            </button>
          </div>

          {/* SUB-CATEGORY: TNSTC 6 DIVISIONS */}
          {selectedOperatorCategory === 'TNSTC' && (
            <div className="mt-2 p-3 bg-slate-950/70 rounded-xl border border-emerald-900/40 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {language === 'ta' ? 'TNSTC மண்டல வாரியத் தேர்வு (Select TNSTC Operating Division):' : 'Select TNSTC Operating Division:'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', labelEn: 'All 6 Divisions', labelTa: 'அனைத்து 6 மண்டலங்கள்' },
                  { id: 'Coimbatore', labelEn: 'TNSTC Coimbatore (Kongu)', labelTa: 'TNSTC கோவை' },
                  { id: 'Madurai', labelEn: 'TNSTC Madurai (South)', labelTa: 'TNSTC மதுரை' },
                  { id: 'Salem', labelEn: 'TNSTC Salem (North-West)', labelTa: 'TNSTC சேலம்' },
                  { id: 'Kumbakonam', labelEn: 'TNSTC Kumbakonam (Delta)', labelTa: 'TNSTC கும்பகோணம்' },
                  { id: 'Villupuram', labelEn: 'TNSTC Villupuram (North)', labelTa: 'TNSTC விழுப்புரம்' },
                  { id: 'Tirunelveli', labelEn: 'TNSTC Tirunelveli (Deep South)', labelTa: 'TNSTC திருநெல்வேலி' }
                ].map((div) => (
                  <button
                    key={div.id}
                    onClick={() => setSelectedDivision(div.id as TnstcDivision | 'ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDivision === div.id
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {language === 'ta' ? div.labelTa : div.labelEn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 38 DISTRICT SELECTOR & REGIONAL ZONES */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-display">
              {language === 'ta' ? 'தமிழ்நாட்டின் 38 மாவட்டங்கள் தேர்வு' : 'Tamil Nadu 38 Districts Filter'}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filteredDistricts.length} {language === 'ta' ? 'மாவட்டங்கள்' : 'Districts'}
            </span>
          </div>

          {/* Regional Zone Pills */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {(['All', 'Chennai & North', 'Kongu & West', 'Central Delta', 'Madurai & South', 'Deep South'] as ZoneFilter[]).map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  selectedZone === zone
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {zone === 'All'
                  ? (language === 'ta' ? 'அனைத்து மண்டலங்கள்' : 'All Zones')
                  : zone}
              </button>
            ))}
          </div>
        </div>

        {/* District Pills Grid (Horizontal or Wrapped Grid) */}
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {/* ALL DISTRICTS BUTTON */}
          <button
            onClick={() => setSelectedDistrictId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedDistrictId === 'all'
                ? 'bg-sky-600 text-white shadow ring-2 ring-sky-400/40'
                : 'bg-slate-950/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span>{language === 'ta' ? 'தமிழ்நாடு முழுவதும் (All Districts)' : 'All 38 Districts'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {buses.length}
            </span>
          </button>

          {/* 38 INDIVIDUAL DISTRICT PILLS */}
          {filteredDistricts.map((district) => {
            const isSelected = selectedDistrictId === district.id;
            // Count buses serving this district
            const busCount = buses.filter(b =>
              b.district?.toLowerCase().includes(district.nameEn.toLowerCase()) ||
              b.districtsTraversed?.some(d => d.toLowerCase().includes(district.nameEn.toLowerCase()))
            ).length;

            return (
              <button
                key={district.id}
                onClick={() => setSelectedDistrictId(district.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-400'
                    : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>{language === 'ta' ? district.nameTa : district.nameEn}</span>
                {busCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950 font-mono' : 'bg-slate-800/90 text-emerald-400 font-mono'}`}>
                    {busCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DISTRICT HIGHLIGHT CARD (IF SINGLE DISTRICT CHOSEN) */}
      {selectedDistrictInfo && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                  {selectedDistrictInfo.zone}
                </span>
                <span className="text-xs text-slate-400">
                  HQ: <strong className="text-slate-200">{selectedDistrictInfo.headquartersEn}</strong>
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span>{selectedDistrictInfo.nameEn}</span>
                <span className="text-slate-400 text-sm font-normal">({selectedDistrictInfo.nameTa})</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {language === 'ta' ? selectedDistrictInfo.descriptionTa : selectedDistrictInfo.descriptionEn}
              </p>
            </div>

            {/* Quick District Live Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">{language === 'ta' ? 'நேரலை பேருந்துகள்' : 'Active Buses'}</div>
                <div className="text-base font-bold font-mono text-white">{districtStats.totalBuses}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">{language === 'ta' ? 'காலி ஆசனங்கள்' : 'Free Seats'}</div>
                <div className="text-base font-bold font-mono text-emerald-400">{districtStats.totalFreeSeats}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">{language === 'ta' ? 'சரியான நேரம்' : 'On-Time'}</div>
                <div className="text-base font-bold font-mono text-sky-400">{districtStats.onTimePercent}%</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-pink-300">{language === 'ta' ? 'மகளிர் இலவசம்' : 'Pink Bus (₹0)'}</div>
                <div className="text-base font-bold font-mono text-pink-400">{districtStats.pinkBuses}</div>
              </div>
            </div>
          </div>

          {/* Major Terminals in this district */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">{language === 'ta' ? 'முக்கிய பேருந்து நிலையங்கள்:' : 'Key Terminals:'}</span>
            {selectedDistrictInfo.majorBusStands.map((stand, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700/60 text-[11px]">
                {language === 'ta' ? stand.nameTa : stand.nameEn}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AVAILABILITY STATUS FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 border border-slate-800/70 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {language === 'ta' ? 'நிலை வடிப்பி:' : 'Availability Filter:'}
          </span>
          {[
            { id: 'all', labelEn: 'All Buses', labelTa: 'அனைத்து பேருந்துகள்' },
            { id: 'available', labelEn: 'Seats Available (>5 Free)', labelTa: 'ஆசனங்கள் உள்ளன' },
            { id: 'filling_fast', labelEn: 'Filling Fast (Few Left)', labelTa: 'விரைவில் நிரம்புகிறது' },
            { id: 'women_free', labelEn: 'Women Free (₹0 Vidiyal)', labelTa: 'மகளிர் இலவசம் (₹0)' },
            { id: 'ac_only', labelEn: 'AC Buses Only', labelTa: 'குளிர்சாதனம் (AC)' },
            { id: 'point_to_point', labelEn: '1-to-1 Point-to-Point', labelTa: 'இடைநில்லா விரைவு' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setAvailabilityFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                availabilityFilter === f.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {language === 'ta' ? f.labelTa : f.labelEn}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredBuses.length}</span> matching buses
        </div>
      </div>

      {/* BUSES LIST GRID */}
      {filteredBuses.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <BusIcon className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'ta' ? 'தேடலுக்குரிய பேருந்துகள் காணப்படவில்லை' : 'No buses match your current filters'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md">
            {language === 'ta'
              ? 'வேறு மாவட்டத்தை அல்லது அனைத்து போக்குவரத்துக் கழகங்களைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.'
              : 'Try selecting "All Districts" or reset the corporation filters to see the full fleet.'}
          </p>
          <button
            onClick={() => {
              setSelectedOperatorCategory('ALL');
              setSelectedDivision('ALL');
              setSelectedDistrictId('all');
              setSelectedZone('All');
              setAvailabilityFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 shadow-md"
          >
            {language === 'ta' ? 'அனைத்து வடிப்பிகளையும் மீட்டமைக்க' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.map((bus) => {
            const isFav = favoriteBusIds.includes(bus.id);
            const route = routes.find(r => r.id === bus.routeId);
            const totalSeats = bus.totalSeats || 48;
            const availableSeats = bus.availableSeats ?? Math.max(2, totalSeats - (bus.telemetry?.passengerCount || 30));
            const occupancyRatio = 1 - (availableSeats / totalSeats);

            return (
              <div
                key={bus.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-4 shadow-lg transition-all duration-200 flex flex-col justify-between gap-3 group"
              >
                {/* Top Header: Operator Category & Route Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Operator Category Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getOperatorBadgeStyle(bus.operatorCategory, bus.isWomenPinkBus)}`}>
                        {bus.isWomenPinkBus ? 'MTC PINK BUS (₹0)' : bus.operatorCategory}
                        {bus.tnstcDivision ? ` • ${bus.tnstcDivision}` : ''}
                      </span>

                      {/* Service Type */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {bus.serviceType}
                      </span>

                      {bus.isAc && (
                        <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">
                          AC
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => onToggleFavorite(bus.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav ? 'text-rose-400 bg-rose-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Save as Favorite"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Route Number & Bus Name */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold font-display text-white group-hover:text-sky-300 transition-colors">
                        {bus.routeNumber}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {bus.registrationNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        {bus.isWomenPinkBus || bus.fareRupees === 0 ? (
                          <span className="text-pink-400 font-extrabold">₹0 (Free)</span>
                        ) : (
                          `₹${bus.fareRupees}`
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {bus.isWomenPinkBus ? 'Vidiyal Payanam' : 'Standard Fare'}
                      </div>
                    </div>
                  </div>

                  {/* Route Origin & Destination */}
                  <div className="mt-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="truncate max-w-[45%]">
                        {route?.originEn || bus.district}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[45%] text-right">
                        {route?.destinationEn || 'Intercity Central'}
                      </span>
                    </div>
                    {language === 'ta' && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                        <span className="truncate max-w-[45%]">{route?.originTa || bus.districtTa}</span>
                        <span className="truncate max-w-[45%] text-right">{route?.destinationTa || 'மத்திய நிலையம்'}</span>
                      </div>
                    )}
                  </div>

                  {/* Operating Depot & District */}
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1 truncate max-w-[55%]">
                      <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{bus.telemetry?.depotName || bus.operator}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDepotCrewBus(bus);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold transition-colors"
                      title="View On-Duty and Off-Duty Driver & Conductor details"
                    >
                      <UserCheck className="w-3 h-3 text-amber-400" />
                      <span>{language === 'ta' ? 'பணிமனை & பணியாளர்கள்' : 'Depot & Crew'}</span>
                    </button>
                  </div>
                </div>

                {/* Middle: Live Availability Progress Bar */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Armchair className="w-3.5 h-3.5 text-sky-400" />
                      {language === 'ta' ? 'ஆசனங்கள் நிலை:' : 'Seat Availability:'}
                    </span>
                    <span className="font-mono font-bold text-slate-100">
                      <strong className={availableSeats > 5 ? 'text-emerald-400' : 'text-amber-400'}>
                        {availableSeats}
                      </strong>
                      <span className="text-slate-500"> / {totalSeats} Free</span>
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getSeatBarColor(availableSeats, totalSeats)}`}
                      style={{ width: `${Math.round((availableSeats / totalSeats) * 100)}%` }}
                    />
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center justify-between text-[10px] mt-1.5 text-slate-400">
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          availableSeats > 10
                            ? 'bg-emerald-400'
                            : availableSeats > 3
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      {availableSeats > 10
                        ? (language === 'ta' ? 'தாராளமாக உள்ளது' : 'Plenty Available')
                        : availableSeats > 3
                        ? (language === 'ta' ? 'விரைவில் நிரம்புகிறது' : 'Filling Fast')
                        : (language === 'ta' ? 'கடைசி ஆசனங்கள்' : 'Last Few Seats')}
                    </span>
                    <span className="font-mono text-slate-300">
                      {bus.status === 'on_time' ? (
                        <span className="text-emerald-400">✓ On-Time</span>
                      ) : (
                        <span className="text-amber-400">+{bus.delayMinutes}m delay</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Telemetry Strip: Speed, Next Stop ETA, Comfort */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'வேகம்' : 'Live Speed'}</span>
                    <span className="font-mono font-bold text-slate-200">{bus.speedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'அடுத்த நிறுத்தம்' : 'Next ETA'}</span>
                    <span className="font-mono font-bold text-sky-400">{bus.etaNextStopMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'வசதித் தரம்' : 'Comfort'}</span>
                    <span className="font-mono font-bold text-emerald-400">{bus.comfortScore}/100</span>
                  </div>
                </div>

                {/* Actions: Track Live on 3D Map, Depot & Crew, Book Seat Preview */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onSelectBus(bus);
                      onTrackOnMap(bus);
                    }}
                    className="py-2 px-1.5 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all shadow"
                    title="Track bus in live 3D terrain"
                  >
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{language === 'ta' ? '3D வரைபடம்' : '3D Track'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedDepotCrewBus(bus)}
                    className="py-2 px-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 border border-amber-500/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                    title="View On-Duty & Off-Duty Driver and Conductor details"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{language === 'ta' ? 'பணியாளர்கள்' : 'Crew Roster'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setBookingBus(bus);
                      setSelectedSeatNumber(null);
                      setIsBookedSuccess(false);
                    }}
                    className="py-2 px-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-700 transition-all"
                    title="View simulated seat availability and book"
                  >
                    <Ticket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{language === 'ta' ? 'ஆசனப் பார்வை' : 'Reserve'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEAT RESERVATION / PREVIEW MODAL */}
      {bookingBus && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setBookingBus(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white text-sm w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-sky-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-400">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {bookingBus.routeNumber} • {bookingBus.operatorCategory}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {bookingBus.telemetry?.vehicleModel || 'Express Cruiser'} • {bookingBus.registrationNumber}
                </p>
              </div>
            </div>

            {/* Fare & Depot info */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">{language === 'ta' ? 'பயணக் கட்டணம்' : 'Ticket Fare'}</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {bookingBus.isWomenPinkBus || bookingBus.fareRupees === 0 ? '₹0 (Women Free)' : `₹${bookingBus.fareRupees}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">{language === 'ta' ? 'பணிமனை' : 'Operating Depot'}</span>
                <span className="font-semibold text-slate-200">{bookingBus.telemetry?.depotName || bookingBus.operator}</span>
              </div>
            </div>

            {/* Simulated 2+2 or 2+1 Seat Layout Grid */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{language === 'ta' ? 'ஆசனத்தைத் தேர்வு செய்க (Select Seat):' : 'Select a seat from layout:'}</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> {language === 'ta' ? 'கிடைக்கும்' : 'Available'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-slate-800 inline-block" /> {language === 'ta' ? 'நிரம்பியது' : 'Occupied'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> {language === 'ta' ? 'தேர்வு' : 'Selected'}
                  </span>
                </div>
              </div>

              {/* Front Cabin Indicator */}
              <div className="w-full py-1 bg-slate-950 rounded-lg text-center text-[10px] text-slate-500 font-mono mb-3 border border-slate-800">
                ▲ DRIVER CABIN & ENTRANCE ▲
              </div>

              {/* Seat Matrix: 7 rows of 4 seats (28 sample seats) */}
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                {Array.from({ length: 28 }, (_, i) => {
                  const seatNum = i + 1;
                  // Deterministic pseudo-random occupancy based on seatNum and availableSeats
                  const isOccupied = (seatNum * 7) % (bookingBus.totalSeats || 48) > (bookingBus.availableSeats || 10);
                  const isSelected = selectedSeatNumber === seatNum;

                  // Middle column (index 2) is gangway aisle
                  return (
                    <React.Fragment key={seatNum}>
                      {i % 4 === 2 && (
                        <div className="flex items-center justify-center text-[10px] text-slate-600 font-mono">
                          |
                        </div>
                      )}
                      <button
                        disabled={isOccupied}
                        onClick={() => {
                          setSelectedSeatNumber(seatNum);
                          setIsBookedSuccess(false);
                        }}
                        className={`p-2 rounded-lg text-xs font-mono font-bold transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow ring-2 ring-amber-300'
                            : isOccupied
                            ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800/50'
                            : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800 hover:text-white border border-emerald-700/60'
                        }`}
                      >
                        <Armchair className="w-3 h-3 mb-0.5" />
                        <span>{seatNum}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Selected Seat Confirmation Banner */}
            {selectedSeatNumber && !isBookedSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl mb-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-300 font-semibold">Seat #{selectedSeatNumber} Selected</span>
                  <p className="text-[11px] text-slate-400">Boarding at {bookingBus.district} terminal</p>
                </div>
                <button
                  onClick={() => setIsBookedSuccess(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow transition-all"
                >
                  {language === 'ta' ? 'பதிவு செய்க' : 'Confirm Seat'}
                </button>
              </div>
            )}

            {isBookedSuccess && (
              <div className="p-4 bg-emerald-950 border border-emerald-500 rounded-xl mb-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <h4 className="text-sm font-bold text-white">
                  {language === 'ta' ? 'ஆசனம் வெற்றிகரமாக உறுதி செய்யப்பட்டது!' : 'Seat Reserved Successfully!'}
                </h4>
                <p className="text-xs text-emerald-300 mt-0.5 font-mono">
                  Ticket #{bookingBus.routeNumber}-SEAT-{selectedSeatNumber}
                </p>
                <div className="text-[11px] text-slate-400 mt-2">
                  Show this e-token to conductor at boarding. Real-time GPS tracking active.
                </div>
              </div>
            )}

            {/* Quick Crew & Depot info strip in reservation modal */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-slate-200 font-bold">
                    {language === 'ta' ? 'ஓட்டுநர்:' : 'Driver:'} {bookingBus.telemetry?.driverName || 'K. Murugesan'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'ta' ? 'பணிமனை:' : 'Depot:'} {bookingBus.telemetry?.depotName || bookingBus.district}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDepotCrewBus(bookingBus);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-[11px] font-semibold"
              >
                {language === 'ta' ? 'பணியாளர் விவரம் →' : 'Full Crew Details →'}
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setBookingBus(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {language === 'ta' ? 'மூடுக' : 'Close'}
              </button>
              <button
                onClick={() => {
                  onSelectBus(bookingBus);
                  onTrackOnMap(bookingBus);
                  setBookingBus(null);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'நேரலை வரைபடத்திற்குச் செல்க' : 'Track Bus Live on Map'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Master Depot & Crew Details Modal */}
      <DepotCrewModal
        bus={selectedDepotCrewBus}
        isOpen={!!selectedDepotCrewBus}
        onClose={() => setSelectedDepotCrewBus(null)}
        language={language}
      />
    </div>
  );
};
