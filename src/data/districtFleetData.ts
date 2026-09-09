import { Bus, BusRoute, OperatorCategory, TnstcDivision, ServiceType, AvailabilityStatus } from '../types';

export interface DistrictInfo {
  id: string;
  nameEn: string;
  nameTa: string;
  zone: 'Chennai & North' | 'Kongu & West' | 'Central Delta' | 'Madurai & South' | 'Deep South';
  zoneTa: string;
  headquartersEn: string;
  headquartersTa: string;
  lat: number;
  lng: number;
  primaryCorporation: string;
  primaryCorporationTa: string;
  operatorCategory: OperatorCategory;
  tnstcDivision?: TnstcDivision;
  majorBusStands: { nameEn: string; nameTa: string }[];
  keyHighways: string[];
  descriptionEn: string;
  descriptionTa: string;
}

// All 38 Official Districts of Tamil Nadu mapped to transport zones and divisions
export const TAMIL_NADU_38_DISTRICTS: DistrictInfo[] = [
  // --- CHENNAI & NORTH METRO (8 Districts) ---
  {
    id: 'chennai',
    nameEn: 'Chennai',
    nameTa: 'சென்னை',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Chennai',
    headquartersTa: 'சென்னை',
    lat: 13.0827,
    lng: 80.2707,
    primaryCorporation: 'MTC & SETC Hub',
    primaryCorporationTa: 'மாநகரப் போக்குவரத்துக் கழகம் & அரசு விரைவுப் போக்குவரத்துக் கழகம்',
    operatorCategory: 'MTC',
    majorBusStands: [
      { nameEn: 'Koyambedu CMBT Integrated Terminus', nameTa: 'கோயம்பேடு பேருந்து முனையம்' },
      { nameEn: 'Chennai Central / Broadway', nameTa: 'சென்னை சென்ட்ரல் / பிராட்வே' },
      { nameEn: 'Guindy Industrial Metro Hub', nameTa: 'கிண்டி மெட்ரோ பேருந்து நிலையம்' }
    ],
    keyHighways: ['GST Road (NH 45)', 'NH 48', 'ECR (NH 32)', 'OMR IT Expressway'],
    descriptionEn: 'Capital metropolis of Tamil Nadu with multi-modal bus hubs connecting suburban and intercity lines.',
    descriptionTa: 'தமிழ்நாட்டின் தலைநகரம், புறநகர் மற்றும் தொலைதூர விரைவுப் பேருந்துகளின் முதன்மை மையம்.'
  },
  {
    id: 'chengalpattu',
    nameEn: 'Chengalpattu',
    nameTa: 'செங்கல்பட்டு',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Chengalpattu',
    headquartersTa: 'செங்கல்பட்டு',
    lat: 12.6939,
    lng: 79.9757,
    primaryCorporation: 'TNSTC Villupuram & MTC',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம் & எம்டிசி',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Kilambakkam (KCBT) Kalaignar Centenary Terminus', nameTa: 'கிளம்பாக்கம் கலைஞர் நூற்றாண்டு பேருந்து முனையம்' },
      { nameEn: 'Tambaram MEPZ Terminus', nameTa: 'தாம்பரம் பேருந்து நிலையம்' },
      { nameEn: 'Chengalpattu Old Bus Stand', nameTa: 'செங்கல்பட்டு பேருந்து நிலையம்' }
    ],
    keyHighways: ['Grand Southern Trunk Road (NH 45)', 'OMR Extension'],
    descriptionEn: 'Home to Asia’s largest modern bus terminal at Kilambakkam (KCBT), gateway to South Tamil Nadu.',
    descriptionTa: 'தென் மாவட்டங்களுக்கான பிரம்மாண்ட கிளம்பாக்கம் (KCBT) முனையத்தைக் கொண்ட முதன்மை மாவட்டம்.'
  },
  {
    id: 'kanchipuram',
    nameEn: 'Kanchipuram',
    nameTa: 'காஞ்சிபுரம்',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Kanchipuram',
    headquartersTa: 'காஞ்சிபுரம்',
    lat: 12.8342,
    lng: 79.7036,
    primaryCorporation: 'TNSTC Villupuram',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Kanchipuram Central Bus Stand', nameTa: 'காஞ்சிபுரம் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Sriperumbudur Industrial Hub', nameTa: 'ஸ்ரீபெரும்புதூர் பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['NH 48 (Chennai - Bengaluru Highway)', 'State Highway 58'],
    descriptionEn: 'Historical temple and silk city, connected with dense Mofussil and intercity services to Chennai and Vellore.',
    descriptionTa: 'வரலாற்று சிறப்புமிக்க பட்டு நகரம், சென்னை மற்றும் வேலூருடன் தொடர் விரைவு பேருந்து இணைப்பு.'
  },
  {
    id: 'tiruvallur',
    nameEn: 'Tiruvallur',
    nameTa: 'திருவள்ளூர்',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Tiruvallur',
    headquartersTa: 'திருவள்ளூர்',
    lat: 13.1438,
    lng: 79.9079,
    primaryCorporation: 'MTC & TNSTC Villupuram',
    primaryCorporationTa: 'எம்டிசி & அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம்',
    operatorCategory: 'MTC',
    majorBusStands: [
      { nameEn: 'Tiruvallur Head Post Bus Stand', nameTa: 'திருவள்ளூர் பேருந்து நிலையம்' },
      { nameEn: 'Avadi Bus Terminus', nameTa: 'ஆவடி பேருந்து முனையம்' },
      { nameEn: 'Poonamallee Terminus', nameTa: 'பூந்தமல்லி பேருந்து முனையம்' }
    ],
    keyHighways: ['NH 716 (Chennai - Tirupati)', 'Chennai Outer Ring Road'],
    descriptionEn: 'Northern industrial and pilgrim gate connecting Andhra Pradesh and Tirupati routes.',
    descriptionTa: 'திருப்பதி மற்றும் ஆந்திர எல்லையை இணைக்கும் வட மாவட்டப் போக்குவரத்து வாயில்.'
  },
  {
    id: 'vellore',
    nameEn: 'Vellore',
    nameTa: 'வேலூர்',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Vellore',
    headquartersTa: 'வேலூர்',
    lat: 12.9165,
    lng: 79.1325,
    primaryCorporation: 'TNSTC Villupuram (Vellore Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம் (வேலூர் மண்டலம்)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Vellore New Bus Stand (Selliamman Nagar)', nameTa: 'வேலூர் புதிய பேருந்து நிலையம்' },
      { nameEn: 'Katpadi Railway Feeder Stand', nameTa: 'காட்பாடி இணைப்புப் பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['NH 48', 'NH 234', 'SH 9'],
    descriptionEn: 'Education and medical hub (CMC/VIT) with high frequency point-to-point buses to Chennai and Bengaluru.',
    descriptionTa: 'கல்வி மற்றும் மருத்துவ நகரம், சென்னை மற்றும் பெங்களூருவுக்கு நேரடி விரைவுப் பேருந்துகள்.'
  },
  {
    id: 'ranipet',
    nameEn: 'Ranipet',
    nameTa: 'இராணிப்பேட்டை',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Ranipet',
    headquartersTa: 'இராணிப்பேட்டை',
    lat: 12.9229,
    lng: 79.3328,
    primaryCorporation: 'TNSTC Villupuram',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Walajapet Bus Stand', nameTa: 'வாலாஜாபேட்டை பேருந்து நிலையம்' },
      { nameEn: 'Ranipet SIPCOT Terminus', nameTa: 'இராணிப்பேட்டை சிப்காட் பேருந்து நிறுத்தம்' },
      { nameEn: 'Arcot Bus Stand', nameTa: 'ஆற்காடு பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 48', 'SH 61'],
    descriptionEn: 'Leather and industrial corridor situated right on the Chennai-Bengaluru highway artery.',
    descriptionTa: 'தோல் தொழில் வளம் மிக்க சென்னை - பெங்களூரு நெடுஞ்சாலை வழித்தடப் பகுதி.'
  },
  {
    id: 'tirupattur',
    nameEn: 'Tirupattur',
    nameTa: 'திருப்பத்தூர்',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Tirupattur',
    headquartersTa: 'திருப்பத்தூர்',
    lat: 12.4958,
    lng: 78.5678,
    primaryCorporation: 'TNSTC Villupuram',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Tirupattur Central Bus Stand', nameTa: 'திருப்பத்தூர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Ambur Bypass Terminal', nameTa: 'ஆம்பூர் பைபாஸ் பேருந்து நிறுத்தம்' },
      { nameEn: 'Vaniyambadi Stand', nameTa: 'வாணியம்பாடி பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 48', 'SH 18'],
    descriptionEn: 'Palar valley hub with Yelagiri Hills hill-route buses and Palar valley transit lines.',
    descriptionTa: 'ஏலகிரி மலை வழித்தடம் மற்றும் பாலாற்றுப் பள்ளத்தாக்கு விரைவுப் போக்குவரத்து மையம்.'
  },
  {
    id: 'tiruvannamalai',
    nameEn: 'Tiruvannamalai',
    nameTa: 'திருவண்ணாமலை',
    zone: 'Chennai & North',
    zoneTa: 'சென்னை & வட மண்டலம்',
    headquartersEn: 'Tiruvannamalai',
    headquartersTa: 'திருவண்ணாமலை',
    lat: 12.2253,
    lng: 79.0747,
    primaryCorporation: 'TNSTC Villupuram',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Tiruvannamalai Central Bus Stand', nameTa: 'திருவண்ணாமலை மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Girivalam Temporary Outer Terminus', nameTa: 'கிரிவல வெளிவட்டப் பேருந்து முனையம்' }
    ],
    keyHighways: ['NH 234', 'SH 9'],
    descriptionEn: 'Renowned spiritual destination with round-the-clock Girivalam special buses connecting every corner of TN.',
    descriptionTa: 'பௌர்ணமி கிரிவல சிறப்புப் பேருந்துகள் மூலம் மாநிலம் முழுவதும் இணைக்கப்படும் ஆன்மீகத் தலைநகர்.'
  },

  // --- KONGU & WEST TAMIL NADU (6 Districts) ---
  {
    id: 'coimbatore',
    nameEn: 'Coimbatore',
    nameTa: 'கோயம்புத்தூர்',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Coimbatore',
    headquartersTa: 'கோயம்புத்தூர்',
    lat: 11.0168,
    lng: 76.9558,
    primaryCorporation: 'TNSTC Coimbatore Division',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கோவை மண்டலம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    majorBusStands: [
      { nameEn: 'Gandhipuram Central Bus Stand (Mofussil & Intercity)', nameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Singanallur Bus Stand (Madurai, Trichy, Delta routes)', nameTa: 'சிங்காநல்லூர் பேருந்து நிலையம் (தெற்கு/டெல்டா)' },
      { nameEn: 'Ukkadam Bus Stand (Pollachi & Kerala)', nameTa: 'உக்கடம் பேருந்து நிலையம் (பொள்ளாச்சி/கேரளா)' },
      { nameEn: 'Mettupalayam Road Bus Stand (Ooty Ghats)', nameTa: 'மேட்டுப்பாளையம் ரோடு பேருந்து நிலையம் (நீலகிரி)' }
    ],
    keyHighways: ['NH 544 (Salem - Kochi Highway)', 'NH 83 (Dindigul Highway)', 'NH 948'],
    descriptionEn: 'Manchester of South India, major transport hub with dedicated terminals for each directional corridor.',
    descriptionTa: 'தென்னிந்தியாவின் மான்செஸ்டர், நான்கு திசைகளுக்கும் தனித்தனி நவீன பேருந்து நிலையங்கள் கொண்ட மையம்.'
  },
  {
    id: 'tiruppur',
    nameEn: 'Tiruppur',
    nameTa: 'திருப்பூர்',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Tiruppur',
    headquartersTa: 'திருப்பூர்',
    lat: 11.1085,
    lng: 77.3411,
    primaryCorporation: 'TNSTC Coimbatore (Tiruppur Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கோவை (திருப்பூர் பகுதி)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    majorBusStands: [
      { nameEn: 'Tiruppur New Bus Stand (Avinashi Road)', nameTa: 'திருப்பூர் புதிய பேருந்து நிலையம்' },
      { nameEn: 'Tiruppur Old Bus Stand (Town & Suburban)', nameTa: 'திருப்பூர் பழைய பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 544 (Avinashi Bypass)', 'SH 19'],
    descriptionEn: 'Knitwear capital with massive worker commute networks and high-frequency express buses along NH 544.',
    descriptionTa: 'பின்னலாடை நகரம், பல்லாயிரக்கணக்கான தொழிலாளர்கள் பயன்பெறும் விரிவான போக்குவரத்து வலைப்பின்னல்.'
  },
  {
    id: 'erode',
    nameEn: 'Erode',
    nameTa: 'ஈரோடு',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Erode',
    headquartersTa: 'ஈரோடு',
    lat: 11.3410,
    lng: 77.7172,
    primaryCorporation: 'TNSTC Coimbatore (Erode Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கோவை (ஈரோடு பகுதி)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    majorBusStands: [
      { nameEn: 'Erode Central Bus Stand', nameTa: 'ஈரோடு மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Bhavani Kooduthurai Bus Stop', nameTa: 'பவானி கூடுதுறை பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['NH 544', 'SH 15', 'SH 84'],
    descriptionEn: 'Turmeric city and textile trade center connecting Coimbatore, Salem, and Karur corridors.',
    descriptionTa: 'மஞ்சள் மாநகரம், கோவை மற்றும் சேலம் வழித்தடங்களின் முக்கிய சந்திப்புப் புள்ளி.'
  },
  {
    id: 'salem',
    nameEn: 'Salem',
    nameTa: 'சேலம்',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Salem',
    headquartersTa: 'சேலம்',
    lat: 11.6643,
    lng: 78.1460,
    primaryCorporation: 'TNSTC Salem Division',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் சேலம் மண்டலம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Salem',
    majorBusStands: [
      { nameEn: 'Salem MGR Central Bus Stand (New Bus Stand)', nameTa: 'சேலம் எம்.ஜி.ஆர் புதிய பேருந்து நிலையம்' },
      { nameEn: 'Salem Town Bus Stand (Old Bus Stand)', nameTa: 'சேலம் பழைய பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 44 (Kashmir to Kanyakumari)', 'NH 544', 'NH 79'],
    descriptionEn: 'The Steel and Mango City, premier transit intersection connecting North, South, and West Tamil Nadu.',
    descriptionTa: 'தமிழ்நாட்டின் மைய சந்திப்பு, வடக்கு-தெற்கு மற்றும் கொங்கு மண்டலங்களை இணைக்கும் மகா பேருந்து முனையம்.'
  },
  {
    id: 'namakkal',
    nameEn: 'Namakkal',
    nameTa: 'நாமக்கல்',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Namakkal',
    headquartersTa: 'நாமக்கல்',
    lat: 11.2189,
    lng: 78.1674,
    primaryCorporation: 'TNSTC Salem',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் சேலம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Salem',
    majorBusStands: [
      { nameEn: 'Namakkal Central Bus Stand', nameTa: 'நாமக்கல் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Rasipuram Bus Stand', nameTa: 'இராசிபுரம் பேருந்து நிலையம்' },
      { nameEn: 'Tiruchengode Bus Stand', nameTa: 'திருச்செங்கோடு பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 44 (GST Southern Expressway)'],
    descriptionEn: 'Poultry and transport hub situated on NH 44 with Kolli Hills ghat bus connectivity.',
    descriptionTa: 'முட்டை மற்றும் லாரி தொழில் நகரம், கொல்லிமலை கொண்டைஊசி வளைவு மலைப்பாதை பேருந்து வசதி.'
  },
  {
    id: 'nilgiris',
    nameEn: 'Nilgiris (Ooty)',
    nameTa: 'நீலகிரி (ஊட்டி)',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Udhagamandalam',
    headquartersTa: 'உதகமண்டலம்',
    lat: 11.4102,
    lng: 76.6950,
    primaryCorporation: 'TNSTC Coimbatore (Ooty Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கோவை (நீலகிரி பிரிவு)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    majorBusStands: [
      { nameEn: 'Udhagamandalam (Ooty) Central Bus Stand', nameTa: 'ஊட்டி மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Coonoor Bus Stand', nameTa: 'குன்னூர் பேருந்து நிலையம்' },
      { nameEn: 'Kotagiri Bus Stand', nameTa: 'கோத்தகிரி பேருந்து நிலையம்' },
      { nameEn: 'Gudalur Gateway Stand', nameTa: 'கூடலூர் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 181 (Ooty Ghat Road)'],
    descriptionEn: 'Queen of Hill Stations with specialized heavy-chassis mountain buses maneuvering 36 hairpin bends.',
    descriptionTa: 'மலைகளின் அரசி, 36 கொண்டைஊசி வளைவுகளில் லாவகமாக இயங்கும் பிரத்யேக மலைப்பாதை பேருந்துகள்.'
  },
  {
    id: 'dharmapuri',
    nameEn: 'Dharmapuri',
    nameTa: 'தருமபுரி',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Dharmapuri',
    headquartersTa: 'தருமபுரி',
    lat: 12.1211,
    lng: 78.1582,
    primaryCorporation: 'TNSTC Salem',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் சேலம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Salem',
    majorBusStands: [
      { nameEn: 'Dharmapuri Central Bus Stand', nameTa: 'தருமபுரி மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Harur Bus Stand', nameTa: 'அரூர் பேருந்து நிலையம்' },
      { nameEn: 'Pennagaram (Hogenakkal route)', nameTa: 'பென்னாகரம் பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['NH 44 (Bengaluru - Salem Expressway)', 'SH 60'],
    descriptionEn: 'Connecting Hogenakkal waterfalls with high-speed corridor buses along NH 44.',
    descriptionTa: 'ஒகேனக்கல் நீர்வீழ்ச்சி சுற்றுலாப் பாதை மற்றும் சேலம்-பெங்களூரு நெடுஞ்சாலை முக்கிய தளம்.'
  },
  {
    id: 'krishnagiri',
    nameEn: 'Krishnagiri',
    nameTa: 'கிருஷ்ணகிரி',
    zone: 'Kongu & West',
    zoneTa: 'கொங்கு & மேற்கு மண்டலம்',
    headquartersEn: 'Krishnagiri',
    headquartersTa: 'கிருஷ்ணகிரி',
    lat: 12.5186,
    lng: 78.2137,
    primaryCorporation: 'TNSTC Salem',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் சேலம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Salem',
    majorBusStands: [
      { nameEn: 'Krishnagiri New Bus Stand', nameTa: 'கிருஷ்ணகிரி புதிய பேருந்து நிலையம்' },
      { nameEn: 'Hosur Central Bus Stand', nameTa: 'ஓசூர் மத்திய பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 44', 'NH 48'],
    descriptionEn: 'Border gateway district housing industrial metropolis Hosur with extensive interstate bus networks.',
    descriptionTa: 'ஓசூர் தொழில் நகரத்தை உள்ளடக்கிய தமிழ்நாடு - கர்நாடகா முதன்மை எல்லைப் போக்குவரத்து வாயில்.'
  },

  // --- CENTRAL DELTA (8 Districts) ---
  {
    id: 'tiruchirappalli',
    nameEn: 'Tiruchirappalli (Trichy)',
    nameTa: 'திருச்சிராப்பள்ளி',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Tiruchirappalli',
    headquartersTa: 'திருச்சிராப்பள்ளி',
    lat: 10.7905,
    lng: 78.7047,
    primaryCorporation: 'TNSTC Kumbakonam (Trichy Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம் (திருச்சி பகுதி)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Trichy Central Bus Stand (Cantonment)', nameTa: 'திருச்சி மத்திய பேருந்து நிலையம் (கன்டோன்மென்ட்)' },
      { nameEn: 'Chatram Bus Stand (North & Town lines)', nameTa: 'சத்திரம் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 45 (Grand Trunk)', 'NH 83', 'NH 336'],
    descriptionEn: 'Geographical heart of Tamil Nadu with 24/7 buses radiating to all 38 districts.',
    descriptionTa: 'தமிழ்நாட்டின் புவியியல் இதயம், 38 மாவட்டங்களுக்கும் 24 மணி நேரமும் பேருந்து சேவை இயங்கும் மையம்.'
  },
  {
    id: 'thanjavur',
    nameEn: 'Thanjavur',
    nameTa: 'தஞ்சாவூர்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Thanjavur',
    headquartersTa: 'தஞ்சாவூர்',
    lat: 10.7870,
    lng: 79.1378,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Thanjavur New Bus Stand (Trichy Road)', nameTa: 'தஞ்சாவூர் புதிய பேருந்து நிலையம்' },
      { nameEn: 'Thanjavur Old Bus Stand (Town services)', nameTa: 'தஞ்சாவூர் பழைய பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 83', 'SH 26'],
    descriptionEn: 'Granary of South India, connecting Cauvery delta farming hubs and temple tourism circuits.',
    descriptionTa: 'நெற்களஞ்சியம், காவேரி டெல்டா நகரங்களையும் புகழ்பெற்ற தஞ்சை பெரியகோயிலையும் இணைக்கும் தளம்.'
  },
  {
    id: 'kumbakonam',
    nameEn: 'Kumbakonam / Thanjavur North',
    nameTa: 'கும்பகோணம்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Kumbakonam',
    headquartersTa: 'கும்பகோணம்',
    lat: 10.9602,
    lng: 79.3845,
    primaryCorporation: 'TNSTC Kumbakonam Corporate Headquarters',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம் தலைமை மையம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Kumbakonam Central Bus Stand', nameTa: 'கும்பகோணம் மத்திய பேருந்து நிலையம்' }
    ],
    keyHighways: ['SH 64', 'SH 66'],
    descriptionEn: 'Headquarters of TNSTC Kumbakonam division with extensive rural and interdistrict routes.',
    descriptionTa: 'கும்பகோணம் அரசுப் போக்குவரத்துக் கழகத்தின் தலைமைப் பீடம், டெல்டாவின் ஆன்மீகத் தலைநகர்.'
  },
  {
    id: 'nagapattinam',
    nameEn: 'Nagapattinam',
    nameTa: 'நாகப்பட்டினம்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Nagapattinam',
    headquartersTa: 'நாகப்பட்டினம்',
    lat: 10.7672,
    lng: 79.8449,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Nagapattinam New Bus Stand', nameTa: 'நாகப்பட்டினம் புதிய பேருந்து நிலையம்' },
      { nameEn: 'Velankanni Pilgrim Bus Stand', nameTa: 'வேளாங்கண்ணி புனித ஆரோக்கிய அன்னை பேருந்து நிலையம்' },
      { nameEn: 'Nagore Dargah Terminal', nameTa: 'நாகூர் தர்கா பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['East Coast Road (NH 32)', 'NH 83'],
    descriptionEn: 'Coastal port and world-famous pilgrimage center (Velankanni / Nagore) with direct SETC luxury coaches.',
    descriptionTa: 'கடலோரத் துறைமுகம் மற்றும் உலகப் புகழ்பெற்ற வேளாங்கண்ணி-நாகூர் ஆன்மீக விரைவுப் பேருந்து மையம்.'
  },
  {
    id: 'mayiladuthurai',
    nameEn: 'Mayiladuthurai',
    nameTa: 'மயிலாடுதுறை',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Mayiladuthurai',
    headquartersTa: 'மயிலாடுதுறை',
    lat: 11.1075,
    lng: 79.6523,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Mayiladuthurai New Bus Stand', nameTa: 'மயிலாடுதுறை புதிய பேருந்து நிலையம்' },
      { nameEn: 'Sirkazhi Bus Stand', nameTa: 'சீர்காழி பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 32', 'SH 23'],
    descriptionEn: 'Delta temple hub connecting Poompuhar and Navagraha temples with frequent regional services.',
    descriptionTa: 'பூம்புகார் மற்றும் நவக்கிரக தலங்களை இணைக்கும் முக்கிய காவேரி கரைப் போக்குவரத்து மையம்.'
  },
  {
    id: 'tiruvarur',
    nameEn: 'Tiruvarur',
    nameTa: 'திருவாரூர்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Tiruvarur',
    headquartersTa: 'திருவாரூர்',
    lat: 10.7725,
    lng: 79.6365,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Tiruvarur Central Bus Stand', nameTa: 'திருவாரூர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Mannargudi Rajagopalaswamy Stand', nameTa: 'மன்னார்குடி பேருந்து நிலையம்' }
    ],
    keyHighways: ['SH 23', 'SH 65'],
    descriptionEn: 'Cultural delta hub known for Thyagaraja Temple chariot festival special transport operations.',
    descriptionTa: 'ஆழித்தேர் திருவிழா மற்றும் டெல்டா கிராமப்புற வழித்தடங்களை இணைக்கும் பாரம்பரிய தளம்.'
  },
  {
    id: 'karur',
    nameEn: 'Karur',
    nameTa: 'கரூர்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Karur',
    headquartersTa: 'கரூர்',
    lat: 10.9601,
    lng: 78.0766,
    primaryCorporation: 'TNSTC Kumbakonam / Salem',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம் / சேலம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Karur Central Bus Stand', nameTa: 'கரூர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Kulithalai Bus Stand', nameTa: 'குளித்தலை பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['NH 44', 'NH 81'],
    descriptionEn: 'Textile export and bus-body building capital, crucial link between Coimbatore, Trichy, and Dindigul.',
    descriptionTa: 'பேருந்து கூண்டு கட்டும் தொழிற்சாலைகளின் தலைநகரம், திருச்சி-கோவை வழித்தட இணைப்பு.'
  },
  {
    id: 'perambalur',
    nameEn: 'Perambalur',
    nameTa: 'பெரம்பலூர்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Perambalur',
    headquartersTa: 'பெரம்பலூர்',
    lat: 11.2342,
    lng: 78.8817,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Perambalur New Bus Stand', nameTa: 'பெரம்பலூர் புதிய பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 45 (Chennai - Trichy Expressway)'],
    descriptionEn: 'Major mid-way staging point on the Grand Trunk NH 45 with highway motels and express stops.',
    descriptionTa: 'சென்னை-திருச்சி தேசிய நெடுஞ்சாலை 45-ன் மிக முக்கிய நடுவழி விரைவுப் பேருந்து நிறுத்தம்.'
  },
  {
    id: 'ariyalur',
    nameEn: 'Ariyalur',
    nameTa: 'அரியலூர்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Ariyalur',
    headquartersTa: 'அரியலூர்',
    lat: 11.1401,
    lng: 79.0786,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Ariyalur Central Bus Stand', nameTa: 'அரியலூர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Jayankondam Bus Stand', nameTa: 'ஜெயங்கொண்டம் பேருந்து நிலையம்' }
    ],
    keyHighways: ['SH 139', 'SH 27'],
    descriptionEn: 'Cement manufacturing hub with frequent services connecting Gangaikonda Cholapuram heritage sites.',
    descriptionTa: 'சிமெண்ட் தொழில் நகரம், கங்கைகொண்ட சோழபுரம் பாரம்பரிய தளத்திற்கான பேருந்து வசதிகள்.'
  },
  {
    id: 'pudukkottai',
    nameEn: 'Pudukkottai',
    nameTa: 'புதுக்கோட்டை',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Pudukkottai',
    headquartersTa: 'புதுக்கோட்டை',
    lat: 10.3797,
    lng: 78.8208,
    primaryCorporation: 'TNSTC Kumbakonam',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Kumbakonam',
    majorBusStands: [
      { nameEn: 'Pudukkottai New Bus Stand', nameTa: 'புதுக்கோட்டை புதிய பேருந்து நிலையம்' },
      { nameEn: 'Aranthangi Bus Stand', nameTa: 'அறந்தாங்கி பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 336', 'SH 71'],
    descriptionEn: 'Princely state heritage town connecting Trichy, Chettinad, and coastal Rameswaram routes.',
    descriptionTa: 'சமஸ்தான வரலாற்று நகரம், திருச்சி-செட்டிநாடு வழித்தடத்தின் முதன்மைப் பேருந்து நிலையம்.'
  },
  {
    id: 'cuddalore',
    nameEn: 'Cuddalore',
    nameTa: 'கடலூர்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Cuddalore',
    headquartersTa: 'கடலூர்',
    lat: 11.7480,
    lng: 79.7714,
    primaryCorporation: 'TNSTC Villupuram (Cuddalore Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம் (கடலூர் மண்டலம்)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Cuddalore Central Bus Stand', nameTa: 'கடலூர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Chidambaram Annamalai Stand', nameTa: 'சிதம்பரம் அண்ணாமலை பேருந்து நிலையம்' },
      { nameEn: 'Neyveli Township Bus Stand', nameTa: 'நெய்வேலி டவுன்ஷிப் பேருந்து நிலையம்' }
    ],
    keyHighways: ['East Coast Road (NH 32)', 'NH 45A'],
    descriptionEn: 'Coastal port and industrial nexus with direct coastal express routes via ECR to Chennai.',
    descriptionTa: 'கிழக்கு கடற்கரை சாலை வழியாக சென்னைக்கு தொடர் விரைவு பேருந்துகள் இயங்கும் துறைமுக நகரம்.'
  },
  {
    id: 'villupuram',
    nameEn: 'Villupuram',
    nameTa: 'விழுப்புரம்',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Villupuram',
    headquartersTa: 'விழுப்புரம்',
    lat: 11.9401,
    lng: 79.4861,
    primaryCorporation: 'TNSTC Villupuram Corporate Headquarters',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம் தலைமை மையம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Villupuram Central Bus Stand', nameTa: 'விழுப்புரம் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Tindivanam Junction Stand', nameTa: 'திண்டிவனம் சந்திப்பு பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 45 (Grand Southern Trunk Road)', 'NH 332'],
    descriptionEn: 'Headquarters of TNSTC Villupuram division, junction of all northern and southern Tamil Nadu express corridors.',
    descriptionTa: 'விழுப்புரம் அரசுப் போக்குவரத்துக் கழகத்தின் தலைமைப் பீடம், வட-தென் தமிழகத்தின் மாபெரும் சந்திப்பு.'
  },
  {
    id: 'kallakurichi',
    nameEn: 'Kallakurichi',
    nameTa: 'கள்ளக்குறிச்சி',
    zone: 'Central Delta',
    zoneTa: 'மத்திய டெல்டா மண்டலம்',
    headquartersEn: 'Kallakurichi',
    headquartersTa: 'கள்ளக்குறிச்சி',
    lat: 11.7375,
    lng: 78.9634,
    primaryCorporation: 'TNSTC Villupuram',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் விழுப்புரம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Villupuram',
    majorBusStands: [
      { nameEn: 'Kallakurichi Central Bus Stand', nameTa: 'கள்ளக்குறிச்சி மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Ulundurpet Toll Junction Stand', nameTa: 'உளுந்தூர்பேட்டை சுங்கச்சாவடி சந்திப்பு' }
    ],
    keyHighways: ['NH 79 (Salem - Ulundurpet Expressway)', 'NH 45'],
    descriptionEn: 'Agricultural belt connecting Salem and Villupuram with Kalrayan Hills ghat services.',
    descriptionTa: 'சேலம்-உளுந்தூர்பேட்டை நெடுஞ்சாலை மற்றும் கல்வராயன் மலைப்பாதை பேருந்து இணைப்பு மையம்.'
  },

  // --- MADURAI & SOUTH (7 Districts) ---
  {
    id: 'madurai',
    nameEn: 'Madurai',
    nameTa: 'மதுரை',
    zone: 'Madurai & South',
    zoneTa: 'மதுரை & தென் மண்டலம்',
    headquartersEn: 'Madurai',
    headquartersTa: 'மதுரை',
    lat: 9.9252,
    lng: 78.1198,
    primaryCorporation: 'TNSTC Madurai Division & SETC South Hub',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் மதுரை மண்டலம் & அரசு விரைவுப் போக்குவரத்துக் கழகம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    majorBusStands: [
      { nameEn: 'Madurai Mattuthavani Integrated Terminus (MIBT)', nameTa: 'மாட்டுத்தாவணி ஒருங்கிணைந்த பேருந்து முனையம்' },
      { nameEn: 'Arappalayam Bus Stand (Coimbatore/Salem routes)', nameTa: 'ஆரப்பாளையம் பேருந்து நிலையம் (கோவை/சேலம்)' },
      { nameEn: 'Periyar Bus Stand (City & Tirupparankunram)', nameTa: 'பெரியார் பேருந்து நிலையம் (நகரப் பேருந்துகள்)' }
    ],
    keyHighways: ['NH 44', 'NH 85', 'NH 38'],
    descriptionEn: 'The sleepless cultural capital with the massive Mattuthavani (MIBT) terminus operating 24/7 super-express lines.',
    descriptionTa: 'தூங்கா நகரம், தென் தமிழகத்தின் இதயப்பகுதி, பிரம்மாண்ட மாட்டுத்தாவணி முனையத்திலிருந்து இடைவிடா சேவைகள்.'
  },
  {
    id: 'dindigul',
    nameEn: 'Dindigul',
    nameTa: 'திண்டுக்கல்',
    zone: 'Madurai & South',
    zoneTa: 'மதுரை & தென் மண்டலம்',
    headquartersEn: 'Dindigul',
    headquartersTa: 'திண்டுக்கல்',
    lat: 10.3673,
    lng: 77.9803,
    primaryCorporation: 'TNSTC Madurai (Dindigul Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் மதுரை (திண்டுக்கல் மண்டலம்)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    majorBusStands: [
      { nameEn: 'Dindigul Kamarajar Central Bus Stand', nameTa: 'திண்டுக்கல் காமராஜர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Palani Temple Town Bus Stand', nameTa: 'பழனி முருகன் கோவில் பேருந்து நிலையம்' },
      { nameEn: 'Kodaikanal Hill Station Terminal', nameTa: 'கொடைக்கானல் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 44', 'NH 83', 'SH 156 (Kodaikanal Ghat Road)'],
    descriptionEn: 'Gateway to Kodaikanal and Palani with high frequency non-stop point-to-point buses to Madurai and Trichy.',
    descriptionTa: 'கொடைக்கானல் மலை மற்றும் பழனி ஆன்மீகத் தலம், மதுரை மற்றும் திருச்சிக்கு நேரடி புல்லட் பேருந்துகள்.'
  },
  {
    id: 'theni',
    nameEn: 'Theni',
    nameTa: 'தேனி',
    zone: 'Madurai & South',
    zoneTa: 'மதுரை & தென் மண்டலம்',
    headquartersEn: 'Theni',
    headquartersTa: 'தேனி',
    lat: 10.0104,
    lng: 77.4768,
    primaryCorporation: 'TNSTC Madurai',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் மதுரை',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    majorBusStands: [
      { nameEn: 'Theni Central Bus Stand', nameTa: 'தேனி மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Bodinayakanur Cardamom Stand', nameTa: 'போடிநாயக்கனூர் ஏலக்காய் நகர் பேருந்து நிலையம்' },
      { nameEn: 'Periyakulam Bus Stand', nameTa: 'பெரியகுளம் பேருந்து நிலையம்' },
      { nameEn: 'Cumbum Kerala Gateway Stand', nameTa: 'கம்பம் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 85 (Kochi - Dhanushkodi Highway)', 'Bodi Ghat Road'],
    descriptionEn: 'Scenic Western Ghats valley connecting Munnar, Kumily, and Kerala border checkposts.',
    descriptionTa: 'மேற்குத் தொடர்ச்சி மலை எழில் கொஞ்சும் கம்பம் பள்ளத்தாக்கு, மூணார்-தேக்கடி சுற்றுலா இணைப்பு.'
  },
  {
    id: 'virudhunagar',
    nameEn: 'Virudhunagar',
    nameTa: 'விருதுநகர்',
    zone: 'Madurai & South',
    zoneTa: 'மதுரை & தென் மண்டலம்',
    headquartersEn: 'Virudhunagar',
    headquartersTa: 'விருதுநகர்',
    lat: 9.5872,
    lng: 77.9514,
    primaryCorporation: 'TNSTC Madurai',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் மதுரை',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    majorBusStands: [
      { nameEn: 'Virudhunagar Central Bus Stand', nameTa: 'விருதுநகர் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Sivakasi Printing Capital Stand', nameTa: 'சிவகாசி பேருந்து நிலையம்' },
      { nameEn: 'Rajapalayam Cotton Stand', nameTa: 'ராஜபாளையம் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 44 (Madurai - Tirunelveli Corridor)', 'NH 744'],
    descriptionEn: 'Industrial hub connecting Sivakasi fireworks capital and Rajapalayam handloom centers.',
    descriptionTa: 'சிவகாசி மற்றும் ராஜபாளையம் தொழில்துறை நகரங்களை இணைக்கும் தென் தமிழகத்தின் வர்த்தக மையம்.'
  },
  {
    id: 'sivaganga',
    nameEn: 'Sivaganga',
    nameTa: 'சிவகங்கை',
    zone: 'Madurai & South',
    zoneTa: 'மதுரை & தென் மண்டலம்',
    headquartersEn: 'Sivaganga',
    headquartersTa: 'சிவகங்கை',
    lat: 9.8433,
    lng: 78.4809,
    primaryCorporation: 'TNSTC Kumbakonam / Madurai',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் கும்பகோணம் / மதுரை',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    majorBusStands: [
      { nameEn: 'Sivaganga Central Bus Stand', nameTa: 'சிவகங்கை மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Karaikudi Chettinad Terminus', nameTa: 'காரைக்குடி செட்டிநாடு பேருந்து நிலையம்' },
      { nameEn: 'Devakottai Bus Stand', nameTa: 'தேவகோட்டை பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 85', 'SH 33'],
    descriptionEn: 'Chettinad cultural territory renowned for heritage mansions, connecting Madurai and coastal Karaikal.',
    descriptionTa: 'செட்டிநாட்டுப் பாரம்பரிய அரண்மனைகள் நிறைந்த பகுதி, காரைக்குடி மற்றும் காரைக்கால் வழித்தடங்கள்.'
  },
  {
    id: 'ramanathapuram',
    nameEn: 'Ramanathapuram',
    nameTa: 'இராமநாதபுரம்',
    zone: 'Madurai & South',
    zoneTa: 'மதுரை & தென் மண்டலம்',
    headquartersEn: 'Ramanathapuram',
    headquartersTa: 'இராமநாதபுரம்',
    lat: 9.3639,
    lng: 78.8395,
    primaryCorporation: 'TNSTC Madurai',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் மதுரை',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    majorBusStands: [
      { nameEn: 'Ramanathapuram Central Bus Stand', nameTa: 'இராமநாதபுரம் மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Paramakudi Bus Stand', nameTa: 'பரமக்குடி பேருந்து நிலையம்' },
      { nameEn: 'Rameswaram Island Bus Stand', nameTa: 'இராமேஸ்வரம் தீவுப் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 85 (Madurai - Rameswaram Highway)', 'East Coast Road'],
    descriptionEn: 'Coastal gateway to the holy island of Rameswaram across Pamban bridge with all-night SETC specials.',
    descriptionTa: 'பாம்பன் பாலம் கடந்து செல்லும் இராமேஸ்வரம் தீவின் முதன்மை வாயில், தமிழகமெங்கும் நேரடி சொகுசு பேருந்துகள்.'
  },

  // --- DEEP SOUTH (5 Districts) ---
  {
    id: 'tirunelveli',
    nameEn: 'Tirunelveli',
    nameTa: 'திருநெல்வேலி',
    zone: 'Deep South',
    zoneTa: 'தென்முனை மண்டலம்',
    headquartersEn: 'Tirunelveli',
    headquartersTa: 'திருநெல்வேலி',
    lat: 8.7139,
    lng: 77.7567,
    primaryCorporation: 'TNSTC Tirunelveli Corporate Headquarters',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் திருநெல்வேலி தலைமை மையம்',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Tirunelveli',
    majorBusStands: [
      { nameEn: 'Tirunelveli New Bus Stand (Vepery / Perumalpuram)', nameTa: 'திருநெல்வேலி புதிய பேருந்து நிலையம் (வேப்பங்குளம்)' },
      { nameEn: 'Tirunelveli Junction Old Bus Stand', nameTa: 'திருநெல்வேலி சந்திப்பு பழைய பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 44 (Southern Terminal Expressway)', 'NH 138'],
    descriptionEn: 'Headquarters of TNSTC Tirunelveli division on the banks of perennial Tamirabarani, key hub for deep south lines.',
    descriptionTa: 'தாமிரபரணி ஆற்றங்கரை மாநகரம், நெல்லை அரசுப் போக்குவரத்துக் கழக தலைமைப் பீடம்.'
  },
  {
    id: 'tenkasi',
    nameEn: 'Tenkasi',
    nameTa: 'தென்காசி',
    zone: 'Deep South',
    zoneTa: 'தென்முனை மண்டலம்',
    headquartersEn: 'Tenkasi',
    headquartersTa: 'தென்காசி',
    lat: 8.9594,
    lng: 77.3150,
    primaryCorporation: 'TNSTC Tirunelveli',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் திருநெல்வேலி',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Tirunelveli',
    majorBusStands: [
      { nameEn: 'Tenkasi Central Bus Stand', nameTa: 'தென்காசி மத்திய பேருந்து நிலையம்' },
      { nameEn: 'Courtallam Falls Special Terminal', nameTa: 'குற்றாலம் அருவி சிறப்புப் பேருந்து முனையம்' },
      { nameEn: 'Sankarankovil Gomathi Stand', nameTa: 'சங்கரன்கோவில் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 744 (Kollam - Madurai Corridor)', 'SH 40'],
    descriptionEn: 'Famous Courtallam spa and waterfall territory bordering Kerala’s Western Ghats.',
    descriptionTa: 'தென்னகத்தின் ஸ்பா குற்றால அருவிகள் மற்றும் மேற்குத் தொடர்ச்சி மலைப்பாதை பேருந்து சந்திப்பு.'
  },
  {
    id: 'thoothukudi',
    nameEn: 'Thoothukudi (Tuticorin)',
    nameTa: 'தூத்துக்குடி',
    zone: 'Deep South',
    zoneTa: 'தென்முனை மண்டலம்',
    headquartersEn: 'Thoothukudi',
    headquartersTa: 'தூத்துக்குடி',
    lat: 8.7642,
    lng: 78.1348,
    primaryCorporation: 'TNSTC Tirunelveli (Thoothukudi Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் திருநெல்வேலி (தூத்துக்குடி பகுதி)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Tirunelveli',
    majorBusStands: [
      { nameEn: 'Thoothukudi Central Bus Stand', nameTa: 'தூத்துக்குடி புதிய பேருந்து நிலையம்' },
      { nameEn: 'Kovilpatti Kadalai Mittai Stand', nameTa: 'கோவில்பட்டி பேருந்து நிலையம்' },
      { nameEn: 'Tiruchendur Murugan Temple Stand', nameTa: 'திருச்செந்தூர் கோவில் பேருந்து நிலையம்' }
    ],
    keyHighways: ['NH 138 (Tirunelveli Port Highway)', 'NH 38', 'East Coast Road'],
    descriptionEn: 'Major sea container port and Pearl City with 1-to-1 Point-to-Point non-stop express buses to Tirunelveli & Madurai.',
    descriptionTa: 'முத்து மாநகரம் மற்றும் பெருந்துறைமுகம், திருநெல்வேலி-தூத்துக்குடி இடையே 1-to-1 இடைநில்லா அதிவேகப் பேருந்துகள்.'
  },
  {
    id: 'kanniyakumari',
    nameEn: 'Kanniyakumari / Nagercoil',
    nameTa: 'கன்னியாகுமரி / நாகர்கோவில்',
    zone: 'Deep South',
    zoneTa: 'தென்முனை மண்டலம்',
    headquartersEn: 'Nagercoil',
    headquartersTa: 'நாகர்கோவில்',
    lat: 8.0883,
    lng: 77.5385,
    primaryCorporation: 'TNSTC Tirunelveli (Kanyakumari Region)',
    primaryCorporationTa: 'அரசுப் போக்குவரத்துக் கழகம் திருநெல்வேலி (குமரி பகுதி)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Tirunelveli',
    majorBusStands: [
      { nameEn: 'Nagercoil Christopher Bus Stand', nameTa: 'நாகர்கோவில் கிறிஸ்டோபர் பேருந்து நிலையம்' },
      { nameEn: 'Kanniyakumari Cape Bus Stand (Tri-Sea)', nameTa: 'கன்னியாகுமரி முக்கடல் பேருந்து நிலையம்' },
      { nameEn: 'Marthandam Flyover Bus Stand', nameTa: 'மார்த்தாண்டம் மேம்பால பேருந்து நிறுத்தம்' }
    ],
    keyHighways: ['NH 44 (Southernmost Mile Zero)', 'NH 66 (Kanyakumari - Trivandrum)'],
    descriptionEn: 'Southern tip of India where three oceans meet, terminal point for national long-distance SETC sleeper services.',
    descriptionTa: 'இந்தியாவின் தென்முனை முக்கடல் சங்கமம், தேசிய நெடுஞ்சாலை 44-ன் தொடக்க மற்றும் முடிவுப் புள்ளி.'
  }
];
