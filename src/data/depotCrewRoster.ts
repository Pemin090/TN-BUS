import { DepotDetails, CrewMember, Bus } from '../types';

export interface BusCrewAndDepotRoster {
  depotDetails: DepotDetails;
  onDutyDriver: CrewMember;
  onDutyConductor: CrewMember;
  offDutyDriver: CrewMember;
  offDutyConductor: CrewMember;
}

// Master Roster of Tamil Nadu State Transport Depots & Staff
export const KNOWN_DEPOT_ROSTERS: Record<string, BusCrewAndDepotRoster> = {
  // 1. SETC Madurai Central Depot (MDU-01)
  'SETC-MDU': {
    depotDetails: {
      depotNameEn: 'SETC Madurai Central Depot [MDU-01]',
      depotNameTa: 'அரசு விரைவுப் போக்குவரத்துக் கழகம் மதுரை மத்திய பணிமனை [MDU-01]',
      depotCode: 'SETC-MDU-01',
      division: 'SETC Southern Operations Division',
      branchManagerName: 'Er. S. Rajendran, B.E., M.I.E.',
      contactNumber: '+91 452 256 8201 / 94450 30101',
      locationAddress: 'Mattuthavani Integrated Bus Terminal Complex, Madurai 625007',
      totalBusesAllocated: 146,
      activeOnRoad: 122,
      underMaintenance: 7,
      fuelingFacility: 'IOCL Dedicated High-Speed Diesel Depot Yard (3 × 25,000L Underground Tanks)'
    },
    onDutyDriver: {
      name: 'K. Murugesan',
      nameTa: 'கே. முருகேசன்',
      empId: 'TN-SETC-48291',
      badgeNumber: 'MDU-HPTV-9821',
      role: 'driver',
      status: 'on_duty',
      shiftTiming: '06:00 - 14:00 (Morning Express Shift)',
      hoursOnDuty: '4h 45m driving active',
      rating: 4.95,
      experienceYears: 18,
      phone: '+91 94432 •••••',
      licenseOrBadgeType: 'Heavy Passenger Transport (HPTV) Grade-A',
      medicalFitnessDate: '08-Jan-2026 (Valid till 2027)',
      breathalyzerStatus: 'Passed (0.00 BAC at Departure 05:45 AM)',
      safetyRecord: '16 Years Accident-Free • Tamil Nadu State CM Gold Medalist'
    },
    onDutyConductor: {
      name: 'M. Palanichamy',
      nameTa: 'எம். பழனிச்சாமி',
      empId: 'TN-SETC-51042',
      badgeNumber: 'COND-MDU-4402',
      role: 'conductor',
      status: 'on_duty',
      shiftTiming: '06:00 - 14:00 (Morning Express Shift)',
      hoursOnDuty: '4h 45m active',
      rating: 4.88,
      experienceYears: 14,
      phone: '+91 98421 •••••',
      licenseOrBadgeType: 'TN Transport Conductor License #C-9912',
      medicalFitnessDate: '14-Nov-2025 (Annual Fitness Cleared)',
      breathalyzerStatus: 'Passed (0.00 BAC)',
      safetyRecord: 'Certified First-Aid Responder & Women Safety Marshal',
      etmDeviceId: 'Verifone ETM-MDU-402 (UPI & NCMC Smartcard Enabled)'
    },
    offDutyDriver: {
      name: 'V. Senthil Kumar',
      nameTa: 'வி. செந்தில்குமார்',
      empId: 'TN-SETC-52119',
      badgeNumber: 'MDU-HPTV-7740',
      role: 'driver',
      status: 'off_duty',
      shiftTiming: '14:00 - 22:00 (Evening Relief Shift)',
      restHoursRemaining: '1h 15m rest remaining (Mandatory 8h Dormitory Rest)',
      rating: 4.84,
      experienceYears: 12,
      phone: '+91 97890 •••••',
      licenseOrBadgeType: 'HPTV Grade-A Heavy Duty',
      medicalFitnessDate: '22-Oct-2025',
      breathalyzerStatus: 'Pre-Shift Check Scheduled at 13:40',
      safetyRecord: 'Zero Violations • Certified Eco-Driver Fuel Champion',
      handoverPoint: 'Trichy Central Junction Platform 4 (14:30 PM Interchange)'
    },
    offDutyConductor: {
      name: 'A. Velumani',
      nameTa: 'ஏ. வேலுமணி',
      empId: 'TN-SETC-53890',
      badgeNumber: 'COND-MDU-6102',
      role: 'conductor',
      status: 'off_duty',
      shiftTiming: '14:00 - 22:00 (Evening Relief Shift)',
      restHoursRemaining: '1h 15m rest remaining',
      rating: 4.79,
      experienceYears: 10,
      phone: '+91 94862 •••••',
      licenseOrBadgeType: 'TN Conductor License #C-11409',
      medicalFitnessDate: '05-Dec-2025',
      safetyRecord: 'Merit Award for High Passenger Satisfaction (4.8+ Rating)',
      etmDeviceId: 'ETM-TRY-882 (Standby Unit at Trichy Depot)',
      handoverPoint: 'Trichy Central Junction Platform 4 (14:30 PM Interchange)'
    }
  },

  // 2. TNSTC Coimbatore Sungam-2 Depot (CBE-SNG)
  'CBE-SNG': {
    depotDetails: {
      depotNameEn: 'TNSTC Coimbatore Sungam-2 Depot',
      depotNameTa: 'அரசுப் போக்குவரத்துக் கழகம் கோவை சுங்கம்-2 பணிமனை',
      depotCode: 'TNSTC-CBE-SNG-02',
      division: 'TNSTC Coimbatore Division (Kongu Region)',
      branchManagerName: 'Thiru. N. Dharmaraj, B.Tech.',
      contactNumber: '+91 422 231 4455 / 94450 32112',
      locationAddress: 'Sungam Bypass Road, Ramanathapuram, Coimbatore 641045',
      totalBusesAllocated: 112,
      activeOnRoad: 96,
      underMaintenance: 5,
      fuelingFacility: 'Dedicated Bharat Petroleum Fuel Farm (50,000L Storage)'
    },
    onDutyDriver: {
      name: 'S. Shanmugam',
      nameTa: 'எஸ். சண்முகம்',
      empId: 'TN-CBE-31940',
      badgeNumber: 'CBE-HPTV-4180',
      role: 'driver',
      status: 'on_duty',
      shiftTiming: '05:30 - 13:30 (Kongu Intercity Express)',
      hoursOnDuty: '5h 10m driving active',
      rating: 4.88,
      experienceYears: 16,
      phone: '+91 98433 •••••',
      licenseOrBadgeType: 'HPTV Kongu Heavy License',
      medicalFitnessDate: '19-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC Verified at Sungam Gate)',
      safetyRecord: '14 Years Accident-Free • 100% On-Time Record'
    },
    onDutyConductor: {
      name: 'R. Soundararajan',
      nameTa: 'ஆர். சௌந்தரராஜன்',
      empId: 'TN-CBE-38820',
      badgeNumber: 'COND-CBE-2291',
      role: 'conductor',
      status: 'on_duty',
      shiftTiming: '05:30 - 13:30',
      hoursOnDuty: '5h 10m active',
      rating: 4.82,
      experienceYears: 13,
      phone: '+91 99440 •••••',
      licenseOrBadgeType: 'TNSTC Conductor License #C-8012',
      medicalFitnessDate: '11-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC)',
      safetyRecord: 'Special Commendation for Prompt Emergency First-Aid',
      etmDeviceId: 'PineLabs Android ETM #CBE-SNG-109'
    },
    offDutyDriver: {
      name: 'M. Natarajan',
      nameTa: 'எம். நடராஜன்',
      empId: 'TN-CBE-34201',
      badgeNumber: 'CBE-HPTV-5102',
      role: 'driver',
      status: 'off_duty',
      shiftTiming: '13:30 - 21:30 (Afternoon Shift)',
      restHoursRemaining: '45m rest remaining at Salem Old Bus Stand Dormitory',
      rating: 4.79,
      experienceYears: 11,
      phone: '+91 94420 •••••',
      licenseOrBadgeType: 'HPTV Grade-A',
      medicalFitnessDate: '03-Dec-2025',
      safetyRecord: 'Zero Violations • High Fuel Economy Award',
      handoverPoint: 'Salem Central Bus Stand Bay 3 (13:30 PM Shift Interchange)'
    },
    offDutyConductor: {
      name: 'T. Krishnan',
      nameTa: 'டி. கிருஷ்ணன்',
      empId: 'TN-CBE-40112',
      badgeNumber: 'COND-CBE-3981',
      role: 'conductor',
      status: 'off_duty',
      shiftTiming: '13:30 - 21:30',
      restHoursRemaining: '45m rest remaining',
      rating: 4.75,
      experienceYears: 9,
      phone: '+91 97500 •••••',
      licenseOrBadgeType: 'TN Conductor License #C-9041',
      medicalFitnessDate: '18-Nov-2025',
      safetyRecord: 'Courteous Passenger Commendation',
      etmDeviceId: 'ETM-SLM-304 (Standby)',
      handoverPoint: 'Salem Central Bus Stand Bay 3 (13:30 PM Shift Interchange)'
    }
  },

  // 3. MTC Chromepet Depot (MTC-CL)
  'MTC-CL': {
    depotDetails: {
      depotNameEn: 'MTC Chromepet Depot [CL]',
      depotNameTa: 'மாநகரப் போக்குவரத்துக் கழகம் குரோம்பேட்டை பணிமனை [CL]',
      depotCode: 'MTC-CL-04',
      division: 'MTC South Chennai Zone (GST Corridor)',
      branchManagerName: 'Tmt. P. Gomathi, M.E., Branch Manager',
      contactNumber: '+91 44 2238 1244 / 94450 30440',
      locationAddress: 'GST Road, Chromepet, Chennai 600044',
      totalBusesAllocated: 168,
      activeOnRoad: 148,
      underMaintenance: 9,
      fuelingFacility: 'High-Capacity Auto-Diesel Dispenser & Fast EV Bus Charger Bay (180kW)'
    },
    onDutyDriver: {
      name: 'G. Arumugam',
      nameTa: 'ஜி. ஆறுமுகம்',
      empId: 'MTC-18933',
      badgeNumber: 'CHN-HPTV-1209',
      role: 'driver',
      status: 'on_duty',
      shiftTiming: '06:30 - 14:30 (Morning City Peak Shift)',
      hoursOnDuty: '3h 25m driving active',
      rating: 4.72,
      experienceYears: 15,
      phone: '+91 94441 •••••',
      licenseOrBadgeType: 'MTC Urban Heavy Vehicle Specialist',
      medicalFitnessDate: '02-Feb-2026',
      breathalyzerStatus: 'Passed (0.00 BAC Checked at Chromepet Gate)',
      safetyRecord: '12 Years Dense Urban Accident-Free'
    },
    onDutyConductor: {
      name: 'S. Jayakumar',
      nameTa: 'எஸ். ஜெயக்குமார்',
      empId: 'MTC-22104',
      badgeNumber: 'COND-MTC-8812',
      role: 'conductor',
      status: 'on_duty',
      shiftTiming: '06:30 - 14:30 (Vidiyal Payanam Duty)',
      hoursOnDuty: '3h 25m active',
      rating: 4.85,
      experienceYears: 12,
      phone: '+91 98409 •••••',
      licenseOrBadgeType: 'MTC Gold Conductor License #MTC-5401',
      medicalFitnessDate: '15-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC)',
      safetyRecord: 'Zero Passenger Complaints • 100% Vidiyal Payanam Free Token Accuracy',
      etmDeviceId: 'Posiflex Smart ETM #MTC-CL-880 (Singara Chennai App Synced)'
    },
    offDutyDriver: {
      name: 'K. Balaji',
      nameTa: 'கே. பாலாஜி',
      empId: 'MTC-20188',
      badgeNumber: 'CHN-HPTV-3301',
      role: 'driver',
      status: 'off_duty',
      shiftTiming: '14:30 - 22:30 (Evening Peak Shift)',
      restHoursRemaining: '1h 35m rest remaining at Broadway Rest Lounge',
      rating: 4.68,
      experienceYears: 9,
      phone: '+91 94448 •••••',
      licenseOrBadgeType: 'MTC Urban Heavy Duty',
      medicalFitnessDate: '20-Nov-2025',
      safetyRecord: 'Zero Safety Violations',
      handoverPoint: 'Broadway Central Bus Terminus Platform 6 (14:30 PM Interchange)'
    },
    offDutyConductor: {
      name: 'D. Elangovan',
      nameTa: 'டி. இளங்கோவன்',
      empId: 'MTC-24890',
      badgeNumber: 'COND-MTC-9044',
      role: 'conductor',
      status: 'off_duty',
      shiftTiming: '14:30 - 22:30',
      restHoursRemaining: '1h 35m rest remaining',
      rating: 4.71,
      experienceYears: 8,
      phone: '+91 98842 •••••',
      licenseOrBadgeType: 'MTC Conductor License #MTC-6922',
      medicalFitnessDate: '10-Oct-2025',
      safetyRecord: 'Certified First Aider',
      etmDeviceId: 'ETM-MTC-BW-201',
      handoverPoint: 'Broadway Central Bus Terminus Platform 6 (14:30 PM Interchange)'
    }
  },

  // 4. TNSTC Dindigul Central Depot (DGL-CTR)
  'DGL-CTR': {
    depotDetails: {
      depotNameEn: 'TNSTC Dindigul Central Depot [DGL-01]',
      depotNameTa: 'அரசுப் போக்குவரத்துக் கழகம் திண்டுக்கல் மத்திய பணிமனை [DGL-01]',
      depotCode: 'TNSTC-DGL-01',
      division: 'TNSTC Madurai Division (Dindigul Region)',
      branchManagerName: 'Er. P. Karuppasamy, B.E.',
      contactNumber: '+91 451 242 3311 / 94450 31080',
      locationAddress: 'Madurai Road, Chettinaickenpatti, Dindigul 624004',
      totalBusesAllocated: 98,
      activeOnRoad: 84,
      underMaintenance: 4,
      fuelingFacility: 'HPCL Dedicated Transit Depot Pump (30,000L Storage)'
    },
    onDutyDriver: {
      name: 'R. Veeramani',
      nameTa: 'ஆர். வீரமணி',
      empId: 'TN-DGL-55120',
      badgeNumber: 'DGL-HPTV-6110',
      role: 'driver',
      status: 'on_duty',
      shiftTiming: '07:00 - 15:00 (Point-to-Point Non-Stop)',
      hoursOnDuty: '3h 50m driving active',
      rating: 4.86,
      experienceYears: 14,
      phone: '+91 94426 •••••',
      licenseOrBadgeType: 'HPTV Express Master',
      medicalFitnessDate: '25-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC at Dindigul Gate)',
      safetyRecord: '12 Years Accident-Free'
    },
    onDutyConductor: {
      name: 'K. Subburaj',
      nameTa: 'கே. சுப்புராஜ்',
      empId: 'TN-DGL-58201',
      badgeNumber: 'COND-DGL-3118',
      role: 'conductor',
      status: 'on_duty',
      shiftTiming: '07:00 - 15:00',
      hoursOnDuty: '3h 50m active',
      rating: 4.81,
      experienceYears: 11,
      phone: '+91 98424 •••••',
      licenseOrBadgeType: 'TN Conductor License #C-6620',
      medicalFitnessDate: '07-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC)',
      safetyRecord: 'Zero Audit Deficits • High UPI Adoption Award',
      etmDeviceId: 'Android ETM #DGL-CTR-441'
    },
    offDutyDriver: {
      name: 'C. Muruganantham',
      nameTa: 'சி. முருகானந்தம்',
      empId: 'TN-DGL-56402',
      badgeNumber: 'DGL-HPTV-8890',
      role: 'driver',
      status: 'off_duty',
      shiftTiming: '15:00 - 23:00 (Evening Shift)',
      restHoursRemaining: '2h 10m rest remaining',
      rating: 4.77,
      experienceYears: 10,
      phone: '+91 94435 •••••',
      licenseOrBadgeType: 'HPTV Heavy Duty',
      medicalFitnessDate: '12-Nov-2025',
      safetyRecord: 'Zero Violations',
      handoverPoint: 'Madurai Arappalayam Bus Stand Bay 4 (15:00 PM Interchange)'
    },
    offDutyConductor: {
      name: 'P. Alagappan',
      nameTa: 'பி. அழகப்பன்',
      empId: 'TN-DGL-59910',
      badgeNumber: 'COND-DGL-4209',
      role: 'conductor',
      status: 'off_duty',
      shiftTiming: '15:00 - 23:00',
      restHoursRemaining: '2h 10m rest remaining',
      rating: 4.74,
      experienceYears: 8,
      phone: '+91 97871 •••••',
      licenseOrBadgeType: 'TN Conductor License #C-7811',
      medicalFitnessDate: '16-Dec-2025',
      safetyRecord: 'Courteous Passenger Commendation',
      etmDeviceId: 'ETM-MDU-ARP-112',
      handoverPoint: 'Madurai Arappalayam Bus Stand Bay 4 (15:00 PM Interchange)'
    }
  },

  // 5. SETC Tirunelveli Vannarpettai Unit (SETC-TIN)
  'SETC-TIN': {
    depotDetails: {
      depotNameEn: 'SETC Tirunelveli Vannarpettai Unit',
      depotNameTa: 'அரசு விரைவுப் போக்குவரத்துக் கழகம் திருநெல்வேலி வண்ணார்பேட்டை பணிமனை',
      depotCode: 'SETC-TIN-01',
      division: 'SETC Deep South Operations Division',
      branchManagerName: 'Er. M. Thangavel, B.E., Branch Manager',
      contactNumber: '+91 462 250 1199 / 94450 30700',
      locationAddress: 'Vannarpettai Bypass Road, Tirunelveli 627003',
      totalBusesAllocated: 84,
      activeOnRoad: 72,
      underMaintenance: 3,
      fuelingFacility: 'IOCL Ultra-Low Sulfur Diesel Automated Station (40,000L)'
    },
    onDutyDriver: {
      name: 'M. Anthony Samy',
      nameTa: 'எம். அந்தோணி சாமி',
      empId: 'TN-SETC-41029',
      badgeNumber: 'TIN-HPTV-1890',
      role: 'driver',
      status: 'on_duty',
      shiftTiming: '21:00 - 05:00 (Overnight Multi-Axle AC Sleeper)',
      hoursOnDuty: '6h 20m cruising active',
      rating: 4.96,
      experienceYears: 20,
      phone: '+91 94431 •••••',
      licenseOrBadgeType: 'Multi-Axle Heavy Sleeper Certified',
      medicalFitnessDate: '15-Feb-2026',
      breathalyzerStatus: 'Passed (0.00 BAC Checked at Vannarpettai Yard)',
      safetyRecord: '19 Years Long-Distance Night Driving Accident-Free (CM Awardee)'
    },
    onDutyConductor: {
      name: 'T. Esakkimuthu',
      nameTa: 'டி. இசக்கிமுத்து',
      empId: 'TN-SETC-44190',
      badgeNumber: 'COND-TIN-2910',
      role: 'conductor',
      status: 'on_duty',
      shiftTiming: '21:00 - 05:00 (Night AC Sleeper Duty)',
      hoursOnDuty: '6h 20m active',
      rating: 4.91,
      experienceYears: 16,
      phone: '+91 98428 •••••',
      licenseOrBadgeType: 'SETC Senior Conductor Grade-1',
      medicalFitnessDate: '28-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC)',
      safetyRecord: '100% Passenger Sleeper Bedding & AC Hygiene Audit Score',
      etmDeviceId: 'Verifone Touch ETM #SETC-TIN-301'
    },
    offDutyDriver: {
      name: 'J. Joseph Raj',
      nameTa: 'ஜே. ஜோசப் ராஜ்',
      empId: 'TN-SETC-43891',
      badgeNumber: 'TIN-HPTV-3104',
      role: 'driver',
      status: 'off_duty',
      shiftTiming: '05:00 - 13:00 (Return Day Shift)',
      restHoursRemaining: '6h 30m rest completed (Resting at Kanniyakumari SETC Rest House)',
      rating: 4.85,
      experienceYears: 13,
      phone: '+91 94438 •••••',
      licenseOrBadgeType: 'Multi-Axle Heavy Sleeper Certified',
      medicalFitnessDate: '10-Dec-2025',
      safetyRecord: 'Zero Infractions • Fuel Efficiency Leader',
      handoverPoint: 'Tirunelveli New Bus Stand (05:00 AM Intercity Gate)'
    },
    offDutyConductor: {
      name: 'S. Paramasivam',
      nameTa: 'எஸ். பரமசிவம்',
      empId: 'TN-SETC-46022',
      badgeNumber: 'COND-TIN-4011',
      role: 'conductor',
      status: 'off_duty',
      shiftTiming: '05:00 - 13:00',
      restHoursRemaining: '6h 30m rest completed',
      rating: 4.80,
      experienceYears: 11,
      phone: '+91 97899 •••••',
      licenseOrBadgeType: 'TN Conductor License #C-9014',
      medicalFitnessDate: '04-Nov-2025',
      safetyRecord: 'Courteous Sleeper Host Commendation',
      etmDeviceId: 'ETM-SETC-TIN-302 (Standby)',
      handoverPoint: 'Tirunelveli New Bus Stand (05:00 AM Intercity Gate)'
    }
  }
};

// Procedural Dynamic Depot and Crew Generator for ANY Bus across all 38 districts
export function getDepotAndCrewForBus(bus: Bus): BusCrewAndDepotRoster {
  const code = bus.telemetry?.depotCode || '';
  if (KNOWN_DEPOT_ROSTERS[code]) {
    return KNOWN_DEPOT_ROSTERS[code];
  }

  // Derive realistic depot name and division based on bus operator and district
  const districtName = bus.district || 'Chennai';
  const opCategory = bus.operatorCategory || 'TNSTC';
  const division = bus.tnstcDivision
    ? `TNSTC ${bus.tnstcDivision} Division`
    : opCategory === 'SETC'
    ? 'SETC Intercity Express Division'
    : 'MTC Chennai Urban Division';

  const depotCodeClean = `${opCategory}-${districtName.substring(0, 3).toUpperCase()}-01`;
  const depotName = `${opCategory} ${districtName} Central Depot [${depotCodeClean}]`;
  const depotNameTa = `${bus.operatorTa || opCategory} ${bus.districtTa || districtName} மத்திய பணிமனை`;

  return {
    depotDetails: {
      depotNameEn: depotName,
      depotNameTa: depotNameTa,
      depotCode: depotCodeClean,
      division: division,
      branchManagerName: `Er. K. Sivakumar, B.E., Branch Manager`,
      contactNumber: `+91 44 2400 •••• / 94450 ${Math.floor(10000 + Math.random() * 89999)}`,
      locationAddress: `State Transport Corporation Depot Complex, ${districtName} Headquarters`,
      totalBusesAllocated: 110,
      activeOnRoad: 94,
      underMaintenance: 6,
      fuelingFacility: 'State Transport Fuel Depot (30,000L Underground Tank)'
    },
    onDutyDriver: {
      name: bus.telemetry?.driverName || 'P. Kalimuthu',
      nameTa: 'பி. காளிமுத்து',
      empId: bus.telemetry?.driverEmpId || `TN-${opCategory}-42190`,
      badgeNumber: `${districtName.substring(0, 3).toUpperCase()}-HPTV-4819`,
      role: 'driver',
      status: 'on_duty',
      shiftTiming: '06:00 - 14:00 (Standard Shift)',
      hoursOnDuty: '4h 15m active driving',
      rating: bus.telemetry?.driverRating || 4.8,
      experienceYears: 14,
      phone: '+91 94420 •••••',
      licenseOrBadgeType: 'HPTV Heavy Duty Transport',
      medicalFitnessDate: '10-Jan-2026',
      breathalyzerStatus: 'Passed (0.00 BAC at Gate Check)',
      safetyRecord: '11 Years Accident-Free Commercial Driving'
    },
    onDutyConductor: {
      name: 'V. Ramanathan',
      nameTa: 'வி. இராமநாதன்',
      empId: `TN-${opCategory}-58102`,
      badgeNumber: `COND-${districtName.substring(0, 3).toUpperCase()}-2201`,
      role: 'conductor',
      status: 'on_duty',
      shiftTiming: '06:00 - 14:00 (Standard Shift)',
      hoursOnDuty: '4h 15m active',
      rating: 4.82,
      experienceYears: 12,
      phone: '+91 98425 •••••',
      licenseOrBadgeType: 'TN State Conductor License Grade-1',
      medicalFitnessDate: '18-Dec-2025',
      breathalyzerStatus: 'Passed (0.00 BAC)',
      safetyRecord: 'Certified First-Aid & Passenger Assistance Marshal',
      etmDeviceId: `Android ETM #${opCategory}-${districtName.substring(0, 3).toUpperCase()}-104`
    },
    offDutyDriver: {
      name: 'M. Gunasekaran',
      nameTa: 'எம். குணசேகரன்',
      empId: `TN-${opCategory}-49021`,
      badgeNumber: `${districtName.substring(0, 3).toUpperCase()}-HPTV-5520`,
      role: 'driver',
      status: 'off_duty',
      shiftTiming: '14:00 - 22:00 (Afternoon Relief Shift)',
      restHoursRemaining: '1h 45m rest remaining at Depot Rest House',
      rating: 4.76,
      experienceYears: 10,
      phone: '+91 94438 •••••',
      licenseOrBadgeType: 'HPTV Heavy Duty Commercial',
      medicalFitnessDate: '04-Nov-2025',
      safetyRecord: 'Zero Safety Violations',
      handoverPoint: `${districtName} Central Bus Terminal (14:00 PM Interchange)`
    },
    offDutyConductor: {
      name: 'S. Rajendran',
      nameTa: 'எஸ். ராஜேந்திரன்',
      empId: `TN-${opCategory}-61044`,
      badgeNumber: `COND-${districtName.substring(0, 3).toUpperCase()}-3890`,
      role: 'conductor',
      status: 'off_duty',
      shiftTiming: '14:00 - 22:00 (Afternoon Relief Shift)',
      restHoursRemaining: '1h 45m rest remaining',
      rating: 4.74,
      experienceYears: 9,
      phone: '+91 97892 •••••',
      licenseOrBadgeType: 'TN State Conductor License',
      medicalFitnessDate: '12-Oct-2025',
      safetyRecord: 'Courteous Passenger Commendation',
      etmDeviceId: `ETM-${opCategory}-STBY-09`,
      handoverPoint: `${districtName} Central Bus Terminal (14:00 PM Interchange)`
    }
  };
}
