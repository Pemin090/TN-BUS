import { Bus, BusRoute, RouteCrewWarning, CrewWarningType, OperatorCategory } from '../types';
import { getDepotAndCrewForBus } from './depotCrewRoster';

export interface StandbyConductorOption {
  nameEn: string;
  nameTa: string;
  empId: string;
  badgeNumber: string;
  depotCode: string;
  depotName: string;
  etmDeviceId: string;
  phone: string;
  experienceYears: number;
}

// Certified Standby Relief Conductors available across Tamil Nadu Regional Depots
export const AVAILABLE_STANDBY_CONDUCTORS: StandbyConductorOption[] = [
  {
    nameEn: 'K. Anbazhagan',
    nameTa: 'கே. அன்பழகன்',
    empId: 'MTC-29012',
    badgeNumber: 'COND-CHN-7821',
    depotCode: 'MTC-CL-04',
    depotName: 'MTC Chromepet Depot',
    etmDeviceId: 'Posiflex Smart ETM #MTC-STBY-04 (UPI Enabled)',
    phone: '+91 94441 23091',
    experienceYears: 11
  },
  {
    nameEn: 'P. Alagappan',
    nameTa: 'பி. அழகப்பன்',
    empId: 'TN-TRY-55011',
    badgeNumber: 'COND-TRY-5501',
    depotCode: 'TRY-CTR',
    depotName: 'TNSTC Trichy Central Depot',
    etmDeviceId: 'PineLabs Android ETM #TRY-STBY-07',
    phone: '+91 97871 44892',
    experienceYears: 8
  },
  {
    nameEn: 'T. Krishnan',
    nameTa: 'டி. கிருஷ்ணன்',
    empId: 'TN-CBE-40112',
    badgeNumber: 'COND-CBE-3981',
    depotCode: 'CBE-SNG',
    depotName: 'TNSTC Coimbatore Sungam Depot',
    etmDeviceId: 'Android ETM #CBE-STBY-08',
    phone: '+91 97500 81230',
    experienceYears: 9
  },
  {
    nameEn: 'M. Soundararajan',
    nameTa: 'எம். சௌந்தரராஜன்',
    empId: 'TN-MDU-59021',
    badgeNumber: 'COND-MDU-5902',
    depotCode: 'SETC-MDU',
    depotName: 'SETC Madurai Central Depot',
    etmDeviceId: 'Verifone ETM-MDU-STBY-12',
    phone: '+91 98421 77123',
    experienceYears: 13
  },
  {
    nameEn: 'V. Thangavel',
    nameTa: 'வி. தங்கவேல்',
    empId: 'TN-SLM-41120',
    badgeNumber: 'COND-SLM-4112',
    depotCode: 'SLM-MGR',
    depotName: 'TNSTC Salem MGR Central Depot',
    etmDeviceId: 'ETM-SLM-STBY-03',
    phone: '+91 94432 99014',
    experienceYears: 10
  }
];

// Helper to format minutes to "Xh Ym"
export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m < 10 ? '0' : ''}${m}m`;
}

// Generate real-time route crew warnings based on active routes and operating buses
export function generateRouteCrewWarnings(routes: BusRoute[], buses: Bus[]): RouteCrewWarning[] {
  const warnings: RouteCrewWarning[] = [];

  routes.forEach((route) => {
    // Find active bus for this route or fallback
    const bus = buses.find((b) => b.routeId === route.id || b.routeNumber === route.routeNumber) || buses[0];
    const roster = getDepotAndCrewForBus(bus);

    const busReg = bus.registrationNumber || 'TN 01 N 9921';
    const busId = bus.id;
    const depotCode = roster.depotDetails.depotCode;
    const depotNameEn = roster.depotDetails.depotNameEn;
    const depotNameTa = roster.depotDetails.depotNameTa;

    // Standard statutory shift limit per Motor Transport Workers Act, 1961: 8 hours = 480 minutes
    const mandatoryLimitMinutes = 480;

    // 1. SPECIFIC SCENARIO: Route MTC 500 AC - Lacks Assigned Conductor
    if (route.id === 'route-mtc-500' || route.routeNumber.includes('500')) {
      const driverMinutes = 245; // 4h 05m
      warnings.push({
        id: `crew-warn-${route.id}`,
        routeId: route.id,
        routeNumber: route.routeNumber,
        routeNameEn: route.nameEn,
        routeNameTa: route.nameTa,
        originEn: route.originEn,
        originTa: route.originTa,
        destinationEn: route.destinationEn,
        destinationTa: route.destinationTa,
        operatorCategory: 'MTC',
        serviceType: route.serviceType || 'AC Electric',
        busId,
        busRegistration: busReg,
        depotCode,
        depotNameEn,
        depotNameTa,
        warningType: 'missing_conductor',
        severity: 'critical',
        driverNameEn: 'G. Arumugam',
        driverNameTa: 'ஜி. ஆறுமுகம்',
        driverEmpId: 'MTC-18933',
        driverBadge: 'CHN-HPTV-1209',
        driverDutyMinutes: driverMinutes,
        driverDutyFormatted: formatMinutesToHours(driverMinutes),
        driverPhone: '+91 94441 55210',
        hasConductor: false,
        conductorNameEn: undefined,
        conductorNameTa: undefined,
        conductorEmpId: undefined,
        conductorBadge: undefined,
        conductorDutyMinutes: 0,
        conductorDutyFormatted: 'Unassigned / Vacant',
        conductorPhone: undefined,
        etmDeviceId: 'Offline / Not Logged In',
        mandatoryLimitMinutes,
        minutesToLimit: mandatoryLimitMinutes - driverMinutes,
        percentOfShiftCompleted: Math.round((driverMinutes / mandatoryLimitMinutes) * 100),
        issueTitleEn: 'No Conductor Assigned — Driver-Only Violation',
        issueTitleTa: 'நடத்துனர் நியமிக்கப்படவில்லை — ஓட்டுநர் மட்டும் பயணம் விதிமீறல்',
        issueDescriptionEn:
          'Bus is operating in high-demand GST Road corridor without an assigned conductor. Morning shift conductor reported absent at Chromepet depot with no replacement logged.',
        issueDescriptionTa:
          'ஜிஎஸ்டி சாலை நெரிசலில் நடத்துனர் இன்றி பேருந்து இயக்கப்படுகிறது. குரோம்பேட்டை பணிமனையில் காலை நடத்துனர் விடுப்பு எடுத்த நிலையில் மாற்று பணியாளர் ஒதுக்கப்படவில்லை.',
        regulatoryImpactEn:
          'Violation of TN Motor Vehicles Rules (Rule 180 - Mandatory Conductor Carriage). High revenue leakage and inability to verify passenger tickets or assist elderly passengers.',
        regulatoryImpactTa:
          'தமிழ்நாடு மோட்டார் வாகன விதி 180-ன் படி பேருந்தில் நடத்துனர் இருப்பது கட்டாயம். கட்டண இழப்பு மற்றும் முதியோர் உதவிக்கு ஆள் இல்லாமை.',
        recommendedActionEn:
          'Immediately dispatch Standby Relief Conductor from Chromepet Depot / KCBT Platform 4 to board at Tambaram junction.',
        recommendedActionTa:
          'குரோம்பேட்டை பணிமனை அல்லது கிளம்பாக்கம் தளம் 4-லிருந்து அவசர மாற்று நடத்துனரை உடனடியாக தாம்பரம் சந்திப்பில் ஏற்றவும்.',
        handoverPointEn: 'Tambaram MEPZ Terminal (Next immediate stop)',
        handoverPointTa: 'தாம்பரம் MEPZ பேருந்து நிறுத்தம்',
        lastUpdated: '2 mins ago'
      });
      return;
    }

    // 2. SPECIFIC SCENARIO: Route TNSTC 120 - Lacks Assigned Conductor (Madurai - Theni - Bodi)
    if (route.id === 'route-tnstc-120' || route.routeNumber.includes('120')) {
      const driverMinutes = 310; // 5h 10m
      warnings.push({
        id: `crew-warn-${route.id}`,
        routeId: route.id,
        routeNumber: route.routeNumber,
        routeNameEn: route.nameEn,
        routeNameTa: route.nameTa,
        originEn: route.originEn,
        originTa: route.originTa,
        destinationEn: route.destinationEn,
        destinationTa: route.destinationTa,
        operatorCategory: 'TNSTC',
        serviceType: route.serviceType || 'Express',
        busId,
        busRegistration: busReg,
        depotCode,
        depotNameEn,
        depotNameTa,
        warningType: 'missing_conductor',
        severity: 'critical',
        driverNameEn: 'P. Kalimuthu',
        driverNameTa: 'பி. காளிமுத்து',
        driverEmpId: 'TN-MDU-42190',
        driverBadge: 'MDU-HPTV-4819',
        driverDutyMinutes: driverMinutes,
        driverDutyFormatted: formatMinutesToHours(driverMinutes),
        driverPhone: '+91 94420 88312',
        hasConductor: false,
        conductorNameEn: undefined,
        conductorNameTa: undefined,
        conductorEmpId: undefined,
        conductorBadge: undefined,
        conductorDutyMinutes: 0,
        conductorDutyFormatted: 'Vacant at Depot Checkpoint',
        conductorPhone: undefined,
        etmDeviceId: 'ETM Unlinked (Zero Tickets Issued)',
        mandatoryLimitMinutes,
        minutesToLimit: mandatoryLimitMinutes - driverMinutes,
        percentOfShiftCompleted: Math.round((driverMinutes / mandatoryLimitMinutes) * 100),
        issueTitleEn: 'Conductor Absent at Intercity Terminal',
        issueTitleTa: 'விரைவுப் பேருந்தில் நடத்துனர் பணிக்கு வரவில்லை',
        issueDescriptionEn:
          'Electronic Ticketing Machine (ETM) is unlinked. Passenger fare collection halted between Usilampatti and Theni express corridor.',
        issueDescriptionTa:
          'மின்னணு டிக்கெட் இயந்திரம் இணைக்கப்படவில்லை. உசிலம்பட்டி மற்றும் தேனி இடையே கட்டண வசூல் தடைபட்டுள்ளது.',
        regulatoryImpactEn:
          'Section 29 Motor Vehicles Act (Public Passenger Vehicle Conductor License Requirement). State Transport Inspectorate breach penalty.',
        regulatoryImpactTa:
          'மோட்டார் வாகன சட்டம் பிரிவு 29-ன் படி நடத்துனர் உரிமம் இன்றி பொது பயணிகள் பேருந்து இயக்கக் கூடாது.',
        recommendedActionEn:
          'Assign Standby Conductor M. Soundararajan from Madurai MIBT or Theni Depot stand.',
        recommendedActionTa:
          'மதுரை மாட்டுத்தாவணி அல்லது தேனி பணிமனையில் உள்ள மாற்று நடத்துனர் எம். சௌந்தரராஜனை உடனடியாக நியமிக்கவும்.',
        handoverPointEn: 'Usilampatti Bypass Checkpoint (KM 36)',
        handoverPointTa: 'உசிலம்பட்டி புறவழிச்சாலை சோதனைச் சாவடி',
        lastUpdated: '4 mins ago'
      });
      return;
    }

    // 3. SPECIFIC SCENARIO: Route SETC 172-UD - Crew Shift Nearing Mandatory Limit (7h 45m / 8h cap!)
    if (route.id === 'route-setc-172' || route.routeNumber.includes('172')) {
      const driverMinutes = 465; // 7h 45m (15 mins to mandatory limit!)
      const condMinutes = 460; // 7h 40m
      warnings.push({
        id: `crew-warn-${route.id}`,
        routeId: route.id,
        routeNumber: route.routeNumber,
        routeNameEn: route.nameEn,
        routeNameTa: route.nameTa,
        originEn: route.originEn,
        originTa: route.originTa,
        destinationEn: route.destinationEn,
        destinationTa: route.destinationTa,
        operatorCategory: 'SETC',
        serviceType: route.serviceType || 'Ultra Deluxe',
        busId,
        busRegistration: busReg,
        depotCode,
        depotNameEn,
        depotNameTa,
        warningType: 'shift_limit_imminent',
        severity: 'warning',
        driverNameEn: 'K. Murugesan',
        driverNameTa: 'கே. முருகேசன்',
        driverEmpId: 'TN-SETC-48291',
        driverBadge: 'MDU-HPTV-9821',
        driverDutyMinutes: driverMinutes,
        driverDutyFormatted: formatMinutesToHours(driverMinutes),
        driverPhone: '+91 94432 10992',
        hasConductor: true,
        conductorNameEn: 'M. Palanichamy',
        conductorNameTa: 'எம். பழனிச்சாமி',
        conductorEmpId: 'TN-SETC-51042',
        conductorBadge: 'COND-MDU-4402',
        conductorDutyMinutes: condMinutes,
        conductorDutyFormatted: formatMinutesToHours(condMinutes),
        conductorPhone: '+91 98421 66201',
        etmDeviceId: 'Verifone ETM-MDU-402 (Active)',
        mandatoryLimitMinutes,
        minutesToLimit: mandatoryLimitMinutes - driverMinutes, // 15 mins
        percentOfShiftCompleted: Math.round((driverMinutes / mandatoryLimitMinutes) * 100), // 97%
        issueTitleEn: 'Crew Shift Nearing Mandatory 8h Limit (15m Left)',
        issueTitleTa: 'பணியாளர் ஷிப்ட் கட்டாய 8 மணிநேர வரம்பை நெருங்குகிறது (15 நிமிடம் உள்ளது)',
        issueDescriptionEn:
          'Driver K. Murugesan has been on active continuous steering duty for 7h 45m along NH 45. Mandatory statutory limit of 8 hours expires in 15 minutes before reaching Dindigul.',
        issueDescriptionTa:
          'ஓட்டுநர் கே. முருகேசன் தேசிய நெடுஞ்சாலை 45-ல் 7 மணி 45 நிமிடங்களாக தொடர்ந்து வண்டி ஓட்டி வருகிறார். சட்டப்பூர்வ 8 மணி நேர வரம்பு இன்னும் 15 நிமிடங்களில் முடிவடைகிறது.',
        regulatoryImpactEn:
          'Motor Transport Workers Act, 1961 (Section 13 - Daily Continuous Duty Limit: Max 8 Hours). Severe driver fatigue risk on night express corridor.',
        regulatoryImpactTa:
          'மோட்டார் போக்குவரத்து தொழிலாளர் சட்டம் 1961 பிரிவு 13-ன்படி ஒரு நாளில் 8 மணி நேரத்திற்கு மேல் தொடர் பணி அனுமதிக்கப்படாது. விபத்து அபாயம்.',
        recommendedActionEn:
          'Execute urgent crew interchange handover at Trichy Central Bus Stand Platform 4 with relief driver V. Senthil Kumar and conductor A. Velumani.',
        recommendedActionTa:
          'திருச்சி மத்திய பேருந்து நிலையம் தளம் 4-ல் மாற்று ஓட்டுநர் வி. செந்தில்குமார் மற்றும் நடத்துனர் ஏ. வேலுமணியிடம் உடனடி பொறுப்பு ஒப்படைப்பு செய்யவும்.',
        handoverPointEn: 'Trichy Central Junction Bay 4 (Relief Crew Ready)',
        handoverPointTa: 'திருச்சி மத்திய பேருந்து நிலையம் தளம் 4 (மாற்றுப் பணியாளர்கள் தயார்)',
        lastUpdated: '1 min ago'
      });
      return;
    }

    // 4. SPECIFIC SCENARIO: Route TNSTC 501 - Shift Limit Imminent (7h 50m / 8h cap!)
    if (route.id === 'route-tnstc-501' || route.routeNumber.includes('501')) {
      const driverMinutes = 470; // 7h 50m (10 mins to breach!)
      const condMinutes = 470;
      warnings.push({
        id: `crew-warn-${route.id}`,
        routeId: route.id,
        routeNumber: route.routeNumber,
        routeNameEn: route.nameEn,
        routeNameTa: route.nameTa,
        originEn: route.originEn,
        originTa: route.originTa,
        destinationEn: route.destinationEn,
        destinationTa: route.destinationTa,
        operatorCategory: 'TNSTC',
        serviceType: route.serviceType || 'Express',
        busId,
        busRegistration: busReg,
        depotCode,
        depotNameEn,
        depotNameTa,
        warningType: 'shift_limit_imminent',
        severity: 'warning',
        driverNameEn: 'S. Shanmugam',
        driverNameTa: 'எஸ். சண்முகம்',
        driverEmpId: 'TN-CBE-31940',
        driverBadge: 'CBE-HPTV-4180',
        driverDutyMinutes: driverMinutes,
        driverDutyFormatted: formatMinutesToHours(driverMinutes),
        driverPhone: '+91 98433 71092',
        hasConductor: true,
        conductorNameEn: 'R. Soundararajan',
        conductorNameTa: 'ஆர். சௌந்தரராஜன்',
        conductorEmpId: 'TN-CBE-38820',
        conductorBadge: 'COND-CBE-2291',
        conductorDutyMinutes: condMinutes,
        conductorDutyFormatted: formatMinutesToHours(condMinutes),
        conductorPhone: '+91 99440 23118',
        etmDeviceId: 'PineLabs ETM #CBE-SNG-109',
        mandatoryLimitMinutes,
        minutesToLimit: mandatoryLimitMinutes - driverMinutes, // 10 mins
        percentOfShiftCompleted: Math.round((driverMinutes / mandatoryLimitMinutes) * 100), // 98%
        issueTitleEn: 'Statutory Shift Cap Expiry in 10 Minutes',
        issueTitleTa: 'சட்டப்பூர்வ பணி நேரம் இன்னும் 10 நிமிடங்களில் முடிவடைகிறது',
        issueDescriptionEn:
          'Kongu Express crew has clocked 7h 50m of duty between Salem and Coimbatore. Shift limit of 480 mins will be exceeded before reaching Gandhipuram terminal.',
        issueDescriptionTa:
          'சேலம் முதல் கோவை வரை கொங்கு விரைவு பணியாளர்கள் 7 மணி 50 நிமிடங்கள் பணிபுரிந்துள்ளனர். காந்திபுரம் அடைவதற்குள் 8 மணிநேர வரம்பு மீறப்படும்.',
        regulatoryImpactEn:
          'Mandatory rest period violation under Transport Labor Welfare Standards. Automatic telematics warning flagged to Salem Depot Branch Manager.',
        regulatoryImpactTa:
          'போக்குவரத்து தொழிலாளர் நல விதிமீறல். சேலம் பணிமனை மேலாளருக்கு தானியங்கி எச்சரிக்கை அனுப்பப்பட்டுள்ளது.',
        recommendedActionEn:
          'Handover bus controls to Relief Driver M. Natarajan & Conductor T. Krishnan at Erode Central Stand Bay 3.',
        recommendedActionTa:
          'ஈரோடு மத்திய பேருந்து நிலையம் விரிகுடா 3-ல் மாற்று ஓட்டுநர் எம். நடராஜன் மற்றும் நடத்துனரிடம் ஒப்படைக்கவும்.',
        handoverPointEn: 'Erode Central Bus Stand Bay 3 (Approaching in 6 km)',
        handoverPointTa: 'ஈரோடு மத்திய பேருந்து நிலையம் விரிகுடா 3 (இன்னும் 6 கி.மீ)',
        lastUpdated: 'Just now'
      });
      return;
    }

    // 5. SPECIFIC SCENARIO: Route SETC 119 - Shift Limit Exceeded / Overrun (>8h)
    if (route.id === 'route-setc-119' || route.routeNumber.includes('119')) {
      const driverMinutes = 495; // 8h 15m (15 mins over limit!)
      const condMinutes = 490;
      warnings.push({
        id: `crew-warn-${route.id}`,
        routeId: route.id,
        routeNumber: route.routeNumber,
        routeNameEn: route.nameEn,
        routeNameTa: route.nameTa,
        originEn: route.originEn,
        originTa: route.originTa,
        destinationEn: route.destinationEn,
        destinationTa: route.destinationTa,
        operatorCategory: 'SETC',
        serviceType: route.serviceType || 'Ultra Deluxe',
        busId,
        busRegistration: busReg,
        depotCode,
        depotNameEn,
        depotNameTa,
        warningType: 'shift_exceeded',
        severity: 'critical',
        driverNameEn: 'M. Anthony Samy',
        driverNameTa: 'எம். அந்தோணி சாமி',
        driverEmpId: 'TN-SETC-41029',
        driverBadge: 'TIN-HPTV-8109',
        driverDutyMinutes: driverMinutes,
        driverDutyFormatted: formatMinutesToHours(driverMinutes),
        driverPhone: '+91 94430 89201',
        hasConductor: true,
        conductorNameEn: 'P. Muthuvel',
        conductorNameTa: 'பி. முத்துவேல்',
        conductorEmpId: 'TN-SETC-45812',
        conductorBadge: 'COND-TIN-3890',
        conductorDutyMinutes: condMinutes,
        conductorDutyFormatted: formatMinutesToHours(condMinutes),
        conductorPhone: '+91 98425 11928',
        etmDeviceId: 'ETM-SETC-TIN-204',
        mandatoryLimitMinutes,
        minutesToLimit: mandatoryLimitMinutes - driverMinutes, // -15 mins (breach)
        percentOfShiftCompleted: Math.round((driverMinutes / mandatoryLimitMinutes) * 100), // 103%
        issueTitleEn: 'Mandatory Shift Limit Breached (+15m Overtime)',
        issueTitleTa: 'கட்டாய பணி நேர வரம்பு மீறப்பட்டது (+15 நிமிடம் கூடுதல் நேரம்)',
        issueDescriptionEn:
          'Shift exceeded maximum 8-hour statutory limit due to heavy diversions at Madurai bypass. Crew has been on duty for 8h 15m without designated mandatory break.',
        issueDescriptionTa:
          'மதுரை புறவழிச்சாலையில் ஏற்பட்ட போக்குவரத்து நெரிசலால் 8 மணிநேர வரம்பு மீறப்பட்டு, 8 மணி 15 நிமிடங்களாக பணியில் உள்ளனர்.',
        regulatoryImpactEn:
          'Direct violation of statutory labor limit. Insurance liability and driver fatigue hazards on southern highway.',
        regulatoryImpactTa:
          'சட்டப்பூர்வ தொழிலாளர் வரம்பு நேரடி மீறல். நெடுஞ்சாலையில் ஓட்டுநர் சோர்வினால் விபத்து அபாயம்.',
        recommendedActionEn:
          'Mandate immediate driver swap at Kovilpatti Toll Rest Area with standby crew from Tirunelveli Division.',
        recommendedActionTa:
          'கோவில்பட்டி சுங்கச்சாவடி ஓய்வு பகுதியில் நெல்லை மண்டல மாற்று ஓட்டுநரை உடனடியாக வண்டியில் ஏற்றவும்.',
        handoverPointEn: 'Kovilpatti Toll Plaza Rest Bay (KM 88)',
        handoverPointTa: 'கோவில்பட்டி சுங்கச்சாவடி ஓய்வு பகுதி',
        lastUpdated: '1 min ago'
      });
      return;
    }

    // 6. DEFAULT SCENARIO: Compliant Routes (e.g. MTC 21G, MTC 18, TNSTC 301, TNSTC 402, MTC 45B)
    const healthyDutyMinutes = Math.floor(180 + Math.random() * 120); // 3h to 5h
    warnings.push({
      id: `crew-warn-${route.id}`,
      routeId: route.id,
      routeNumber: route.routeNumber,
      routeNameEn: route.nameEn,
      routeNameTa: route.nameTa,
      originEn: route.originEn,
      originTa: route.originTa,
      destinationEn: route.destinationEn,
      destinationTa: route.destinationTa,
      operatorCategory: (route.operatorCategory as OperatorCategory) || 'TNSTC',
      serviceType: route.serviceType || 'Express',
      busId,
      busRegistration: busReg,
      depotCode,
      depotNameEn,
      depotNameTa,
      warningType: 'compliant',
      severity: 'info',
      driverNameEn: roster.onDutyDriver?.name || 'R. Veeramani',
      driverNameTa: roster.onDutyDriver?.nameTa || 'ஆர். வீரமணி',
      driverEmpId: roster.onDutyDriver?.empId || 'TN-STAFF-1092',
      driverBadge: roster.onDutyDriver?.badgeNumber || 'HPTV-2201',
      driverDutyMinutes: healthyDutyMinutes,
      driverDutyFormatted: formatMinutesToHours(healthyDutyMinutes),
      driverPhone: roster.onDutyDriver?.phone || '+91 94420 •••••',
      hasConductor: true,
      conductorNameEn: roster.onDutyConductor?.name || 'K. Subburaj',
      conductorNameTa: roster.onDutyConductor?.nameTa || 'கே. சுப்புராஜ்',
      conductorEmpId: roster.onDutyConductor?.empId || 'COND-7712',
      conductorBadge: roster.onDutyConductor?.badgeNumber || 'COND-1092',
      conductorDutyMinutes: healthyDutyMinutes - 10,
      conductorDutyFormatted: formatMinutesToHours(healthyDutyMinutes - 10),
      conductorPhone: roster.onDutyConductor?.phone || '+91 98421 •••••',
      etmDeviceId: roster.onDutyConductor?.etmDeviceId || 'Smart ETM Active',
      mandatoryLimitMinutes,
      minutesToLimit: mandatoryLimitMinutes - healthyDutyMinutes,
      percentOfShiftCompleted: Math.round((healthyDutyMinutes / mandatoryLimitMinutes) * 100),
      issueTitleEn: 'Crew Roster Fully Compliant',
      issueTitleTa: 'பணியாளர்கள் விதிமுறைகளுக்கு உட்பட்டு உள்ளனர்',
      issueDescriptionEn:
        'Conductor on-board with active ticketing. Driver duty is well within the 8-hour statutory shift cap.',
      issueDescriptionTa:
        'நடத்துனர் பணியில் உள்ளார் மற்றும் டிக்கெட் வசூல் சீராக நடைபெறுகிறது. ஓட்டுநரின் பணி நேரம் 8 மணி நேரத்திற்குள் உள்ளது.',
      regulatoryImpactEn: 'Zero violations. Medical fitness, breathalyzer 0.00 BAC, and valid licenses verified.',
      regulatoryImpactTa: 'எவ்வித விதிமீறலும் இல்லை. மருத்துவ தகுதி மற்றும் உரிமங்கள் சரிபார்க்கப்பட்டுள்ளன.',
      recommendedActionEn: 'Continue regular route progression; relief crew scheduled on time at destination.',
      recommendedActionTa: 'வழக்கமான பயணத்தை தொடரவும்; இலக்கு நிலையத்தில் மாற்றுப் பணியாளர்கள் தயார் நிலையில் உள்ளனர்.',
      handoverPointEn: 'Destination Depot Terminal',
      handoverPointTa: 'இலக்கு பணிமனை முனையம்',
      lastUpdated: 'Synced'
    });
  });

  return warnings;
}

// Assign an emergency standby conductor to a flagged route
export function assignConductorToRoute(
  warnings: RouteCrewWarning[],
  routeId: string,
  standby: StandbyConductorOption
): RouteCrewWarning[] {
  return warnings.map((w) => {
    if (w.routeId === routeId) {
      return {
        ...w,
        hasConductor: true,
        conductorNameEn: standby.nameEn,
        conductorNameTa: standby.nameTa,
        conductorEmpId: standby.empId,
        conductorBadge: standby.badgeNumber,
        conductorPhone: standby.phone,
        conductorDutyMinutes: 15,
        conductorDutyFormatted: '0h 15m (Fresh Relief)',
        etmDeviceId: standby.etmDeviceId,
        warningType: 'compliant',
        severity: 'info',
        isResolved: true,
        resolutionNote: `Standby Conductor ${standby.nameEn} (${standby.badgeNumber}) dispatched & boarded via ETM sync.`,
        issueTitleEn: 'Conductor Dispatched & Assigned',
        issueTitleTa: 'மாற்று நடத்துனர் நியமிக்கப்பட்டு பணியில் சேர்ந்தார்',
        issueDescriptionEn: `Emergency relief conductor ${standby.nameEn} boarded at designated checkpoint. Ticketing restored.`,
        issueDescriptionTa: `அவசர மாற்று நடத்துனர் ${standby.nameTa} பணியில் சேர்ந்தார். பயணச்சீட்டு வசூல் சீரடைந்தது.`,
        recommendedActionEn: 'Monitor ETM transaction stream and verify passenger token counts.',
        recommendedActionTa: 'மின்னணு டிக்கெட் பரிவர்த்தனைகளை கண்காணித்து உறுதிப்படுத்தவும்.',
        lastUpdated: 'Just now (Action Applied)'
      };
    }
    return w;
  });
}

// Dispatch relief crew and reset shift duration at designated interchange handover point
export function dispatchReliefCrewHandover(
  warnings: RouteCrewWarning[],
  routeId: string
): RouteCrewWarning[] {
  return warnings.map((w) => {
    if (w.routeId === routeId) {
      return {
        ...w,
        driverDutyMinutes: 20,
        driverDutyFormatted: '0h 20m (Relief Driver Active)',
        conductorDutyMinutes: 20,
        conductorDutyFormatted: '0h 20m (Relief Conductor Active)',
        minutesToLimit: 480 - 20,
        percentOfShiftCompleted: 4,
        warningType: 'compliant',
        severity: 'info',
        isResolved: true,
        resolutionNote: 'Relief crew handover executed successfully at designated junction depot bay.',
        issueTitleEn: 'Relief Crew Handover Complete',
        issueTitleTa: 'மாற்றுப் பணியாளர்கள் பொறுப்பேற்பு நிறைவடைந்தது',
        issueDescriptionEn:
          'Fresh off-duty relief driver & conductor have taken over bus control. Off-going crew sent for mandatory rest.',
        issueDescriptionTa:
          'புதிய மாற்று ஓட்டுநர் மற்றும் நடத்துனர் பேருந்தின் பொறுப்பை ஏற்றுக்கொண்டனர். முந்தைய பணியாளர்கள் கட்டாய ஓய்வுக்கு அனுப்பப்பட்டனர்.',
        recommendedActionEn: 'Off-going crew logged into depot rest house. Zero overtime infractions recorded.',
        recommendedActionTa: 'முந்தைய பணியாளர்கள் ஓய்வறைக்கு சென்றுள்ளனர். கூடுதல் பணி நேர மீறல் தவிர்க்கப்பட்டது.',
        lastUpdated: 'Just now (Handover Completed)'
      };
    }
    return w;
  });
}
