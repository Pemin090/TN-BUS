import { BusStop, BusRoute, Bus, TrafficIncident, WeatherRiskArea, EventTrafficZone, FavoriteItem, LatLng } from '../types';
import { EXTENDED_ROUTES, EXTENDED_BUSES } from './extendedFleet';
import { TAMIL_NADU_38_DISTRICTS, DistrictInfo } from './districtFleetData';

export { TAMIL_NADU_38_DISTRICTS };
export type { DistrictInfo };

export const TN_STATE_CENTER: LatLng = { lat: 11.1271, lng: 78.6569 }; // Center of Tamil Nadu State (near Karur / Trichy)

// Precise Tamil Nadu State Outline Coordinates for Custom Map Canvas
export const TAMIL_NADU_BORDER: LatLng[] = [
  // North Coast to South Coast (Bay of Bengal & Palk Strait)
  { lat: 13.42, lng: 80.32 }, // Pulicat
  { lat: 13.08, lng: 80.28 }, // Chennai Marina
  { lat: 12.62, lng: 80.19 }, // Mahabalipuram
  { lat: 12.20, lng: 79.95 }, // Marakkanam
  { lat: 11.93, lng: 79.83 }, // Puducherry
  { lat: 11.75, lng: 79.77 }, // Cuddalore
  { lat: 11.41, lng: 79.78 }, // Parangipettai
  { lat: 11.14, lng: 79.85 }, // Poompuhar
  { lat: 10.92, lng: 79.84 }, // Karaikal
  { lat: 10.76, lng: 79.84 }, // Nagapattinam
  { lat: 10.68, lng: 79.84 }, // Velankanni
  { lat: 10.29, lng: 79.86 }, // Point Calimere (Kodikkarai)
  { lat: 10.34, lng: 79.38 }, // Adirampattinam
  { lat: 9.95, lng: 79.13 },  // Manamelkudi
  { lat: 9.84, lng: 79.05 },  // Mimisal
  { lat: 9.48, lng: 78.90 },  // Devipattinam
  { lat: 9.28, lng: 79.15 },  // Mandapam (Pamban)
  { lat: 9.28, lng: 79.31 },  // Rameswaram
  { lat: 9.18, lng: 79.42 },  // Dhanushkodi tip
  { lat: 9.23, lng: 78.78 },  // Kilakarai
  { lat: 9.19, lng: 78.43 },  // Sayalgudi
  { lat: 8.76, lng: 78.16 },  // Thoothukudi (Tuticorin)
  { lat: 8.49, lng: 78.12 },  // Tiruchendur
  { lat: 8.40, lng: 78.05 },  // Kulasekharapatnam
  { lat: 8.28, lng: 77.89 },  // Uvari
  { lat: 8.08, lng: 77.55 },  // Kanyakumari (Southernmost Tip of India)

  // Western Boundary (Western Ghats & Kerala Border)
  { lat: 8.18, lng: 77.41 },  // Nagercoil West
  { lat: 8.31, lng: 77.22 },  // Marthandam
  { lat: 8.98, lng: 77.24 },  // Shenkottai Pass / Tenkasi
  { lat: 9.45, lng: 77.55 },  // Rajapalayam foothills
  { lat: 9.73, lng: 77.28 },  // Cumbum Valley
  { lat: 10.01, lng: 77.47 }, // Theni / Bodinayakkanur
  { lat: 10.23, lng: 77.48 }, // Kodaikanal
  { lat: 10.32, lng: 76.95 }, // Valparai Anaimalai
  { lat: 10.65, lng: 76.99 }, // Pollachi
  { lat: 10.84, lng: 76.85 }, // Walayar Gap (Coimbatore)
  { lat: 11.41, lng: 76.70 }, // Nilgiris / Ooty
  { lat: 11.50, lng: 76.49 }, // Gudalur (NW corner)

  // Northern Boundary (Karnataka & Andhra Pradesh Borders)
  { lat: 11.60, lng: 77.05 }, // Mudumalai / Sathyamangalam
  { lat: 12.11, lng: 77.77 }, // Pennagaram / Hogenakkal
  { lat: 12.74, lng: 77.82 }, // Hosur (Bengaluru border)
  { lat: 12.52, lng: 78.21 }, // Krishnagiri
  { lat: 12.68, lng: 78.61 }, // Vaniyambadi
  { lat: 12.92, lng: 79.13 }, // Vellore
  { lat: 13.08, lng: 79.67 }, // Arakkonam
  { lat: 13.18, lng: 79.63 }, // Tiruttani
  { lat: 13.41, lng: 80.13 }, // Gummidipoondi
  { lat: 13.42, lng: 80.32 }  // Close loop back to Pulicat
];

// Major National Highway Corridors across Tamil Nadu
export const MAJOR_HIGHWAY_CORRIDORS: { id: string; name: string; nameTa: string; polyline: LatLng[] }[] = [
  {
    id: 'nh-44',
    name: 'NH 44 (Hosur – Salem – Madurai – Tirunelveli – Kanyakumari)',
    nameTa: 'தேசிய நெடுஞ்சாலை 44 (ஓசூர் – சேலம் – மதுரை – நெல்லை – கன்னியாகுமரி)',
    polyline: [
      { lat: 12.74, lng: 77.82 }, // Hosur
      { lat: 12.52, lng: 78.21 }, // Krishnagiri
      { lat: 12.13, lng: 78.16 }, // Dharmapuri
      { lat: 11.66, lng: 78.14 }, // Salem
      { lat: 11.22, lng: 78.16 }, // Namakkal
      { lat: 10.96, lng: 78.08 }, // Karur
      { lat: 10.36, lng: 77.98 }, // Dindigul
      { lat: 9.92, lng: 78.11 },  // Madurai
      { lat: 9.58, lng: 77.95 },  // Virudhunagar
      { lat: 9.17, lng: 77.88 },  // Kovilpatti
      { lat: 8.71, lng: 77.75 },  // Tirunelveli
      { lat: 8.44, lng: 77.62 },  // Valliyur
      { lat: 8.08, lng: 77.55 }   // Kanyakumari
    ]
  },
  {
    id: 'nh-45',
    name: 'NH 45 / NH 32 (Chennai – Tindivanam – Trichy – Dindigul)',
    nameTa: 'தேசிய நெடுஞ்சாலை 45 (சென்னை – திண்டிவனம் – திருச்சி – திண்டுக்கல்)',
    polyline: [
      { lat: 13.08, lng: 80.27 }, // Chennai
      { lat: 12.92, lng: 80.10 }, // Tambaram
      { lat: 12.86, lng: 80.05 }, // Kilambakkam (KCBT)
      { lat: 12.69, lng: 79.97 }, // Chengalpattu
      { lat: 12.22, lng: 79.65 }, // Tindivanam
      { lat: 11.94, lng: 79.49 }, // Villupuram
      { lat: 11.45, lng: 79.08 }, // Ulundurpet
      { lat: 11.23, lng: 78.88 }, // Perambalur
      { lat: 10.79, lng: 78.70 }, // Trichy
      { lat: 10.55, lng: 78.30 }, // Manapparai
      { lat: 10.36, lng: 77.98 }  // Dindigul
    ]
  },
  {
    id: 'nh-544',
    name: 'NH 544 (Salem – Erode – Tiruppur – Coimbatore)',
    nameTa: 'தேசிய நெடுஞ்சாலை 544 (சேலம் – ஈரோடு – திருப்பூர் – கோவை)',
    polyline: [
      { lat: 11.66, lng: 78.14 }, // Salem
      { lat: 11.48, lng: 77.86 }, // Sankari
      { lat: 11.34, lng: 77.71 }, // Erode
      { lat: 11.23, lng: 77.45 }, // Perundurai
      { lat: 11.10, lng: 77.34 }, // Tiruppur
      { lat: 11.19, lng: 77.16 }, // Avinashi
      { lat: 11.01, lng: 76.95 }  // Coimbatore
    ]
  },
  {
    id: 'nh-48',
    name: 'NH 48 (Chennai – Kanchipuram – Vellore – Hosur)',
    nameTa: 'தேசிய நெடுஞ்சாலை 48 (சென்னை – காஞ்சிபுரம் – வேலூர் – ஓசூர்)',
    polyline: [
      { lat: 13.08, lng: 80.27 }, // Chennai
      { lat: 12.96, lng: 79.94 }, // Sriperumbudur
      { lat: 12.83, lng: 79.70 }, // Kanchipuram
      { lat: 12.92, lng: 79.33 }, // Ranipet / Walajapet
      { lat: 12.92, lng: 79.13 }, // Vellore
      { lat: 12.78, lng: 78.71 }, // Ambur
      { lat: 12.68, lng: 78.61 }, // Vaniyambadi
      { lat: 12.52, lng: 78.21 }, // Krishnagiri
      { lat: 12.74, lng: 77.82 }  // Hosur
    ]
  },
  {
    id: 'nh-83',
    name: 'NH 83 (Coimbatore – Pollachi – Dindigul – Trichy – Thanjavur)',
    nameTa: 'தேசிய நெடுஞ்சாலை 83 (கோவை – பொள்ளாச்சி – திண்டுக்கல் – திருச்சி – தஞ்சாவூர்)',
    polyline: [
      { lat: 11.01, lng: 76.95 }, // Coimbatore
      { lat: 10.65, lng: 76.99 }, // Pollachi
      { lat: 10.58, lng: 77.24 }, // Udumalpet
      { lat: 10.45, lng: 77.51 }, // Palani
      { lat: 10.36, lng: 77.98 }, // Dindigul
      { lat: 10.79, lng: 78.70 }, // Trichy
      { lat: 10.78, lng: 79.13 }  // Thanjavur
    ]
  },
  {
    id: 'ecr',
    name: 'ECR (Chennai – Mahabalipuram – Puducherry – Nagapattinam)',
    nameTa: 'கிழக்கு கடற்கரை சாலை (சென்னை – மாமல்லபுரம் – பாண்டிச்சேரி – நாகை)',
    polyline: [
      { lat: 13.08, lng: 80.27 }, // Chennai
      { lat: 12.62, lng: 80.19 }, // Mahabalipuram
      { lat: 12.20, lng: 79.95 }, // Marakkanam
      { lat: 11.93, lng: 79.83 }, // Puducherry
      { lat: 11.75, lng: 79.77 }, // Cuddalore
      { lat: 11.41, lng: 79.78 }, // Chidambaram
      { lat: 10.76, lng: 79.84 }  // Nagapattinam
    ]
  }
];

// All 38 Districts and Key Cities of Tamil Nadu
export const TAMIL_NADU_DISTRICTS = [
  { nameEn: 'Chennai', nameTa: 'சென்னை', lat: 13.0827, lng: 80.2707, region: 'chennai', hub: true },
  { nameEn: 'Chengalpattu', nameTa: 'செங்கல்பட்டு', lat: 12.6939, lng: 79.9757, region: 'chennai', hub: true },
  { nameEn: 'Kanchipuram', nameTa: 'காஞ்சிபுரம்', lat: 12.8342, lng: 79.7036, region: 'chennai', hub: true },
  { nameEn: 'Tiruvallur', nameTa: 'திருவள்ளூர்', lat: 13.1438, lng: 79.9079, region: 'chennai', hub: false },
  { nameEn: 'Vellore', nameTa: 'வேலூர்', lat: 12.9165, lng: 79.1325, region: 'chennai', hub: true },
  { nameEn: 'Ranipet', nameTa: 'இராணிப்பேட்டை', lat: 12.9229, lng: 79.3328, region: 'chennai', hub: false },
  { nameEn: 'Tirupattur', nameTa: 'திருப்பத்தூர்', lat: 12.4958, lng: 78.5678, region: 'chennai', hub: false },
  { nameEn: 'Tiruvannamalai', nameTa: 'திருவண்ணாமலை', lat: 12.2253, lng: 79.0747, region: 'chennai', hub: true },
  { nameEn: 'Villupuram', nameTa: 'விழுப்புரம்', lat: 11.9401, lng: 79.4861, region: 'trichy', hub: true },
  { nameEn: 'Kallakurichi', nameTa: 'கள்ளக்குறிச்சி', lat: 11.7375, lng: 78.9634, region: 'trichy', hub: false },
  { nameEn: 'Cuddalore', nameTa: 'கடலூர்', lat: 11.7480, lng: 79.7714, region: 'trichy', hub: true },

  // Kongu / Western Tamil Nadu
  { nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', lat: 11.0168, lng: 76.9558, region: 'coimbatore', hub: true },
  { nameEn: 'Tiruppur', nameTa: 'திருப்பூர்', lat: 11.1085, lng: 77.3411, region: 'coimbatore', hub: true },
  { nameEn: 'Erode', nameTa: 'ஈரோடு', lat: 11.3410, lng: 77.7172, region: 'coimbatore', hub: true },
  { nameEn: 'Salem', nameTa: 'சேலம்', lat: 11.6643, lng: 78.1460, region: 'salem', hub: true },
  { nameEn: 'Namakkal', nameTa: 'நாமக்கல்', lat: 11.2189, lng: 78.1674, region: 'salem', hub: true },
  { nameEn: 'Dharmapuri', nameTa: 'தருமபுரி', lat: 12.1211, lng: 78.1582, region: 'salem', hub: true },
  { nameEn: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி', lat: 12.5186, lng: 78.2137, region: 'salem', hub: true },
  { nameEn: 'Hosur', nameTa: 'ஓசூர்', lat: 12.7409, lng: 77.8253, region: 'salem', hub: true },
  { nameEn: 'Nilgiris (Ooty)', nameTa: 'நீலகிரி (ஊட்டி)', lat: 11.4102, lng: 76.6950, region: 'coimbatore', hub: true },

  // Central Delta Region
  { nameEn: 'Tiruchirappalli', nameTa: 'திருச்சிராப்பள்ளி', lat: 10.7905, lng: 78.7047, region: 'trichy', hub: true },
  { nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்', lat: 10.7870, lng: 79.1378, region: 'trichy', hub: true },
  { nameEn: 'Kumbakonam', nameTa: 'கும்பகோணம்', lat: 10.9602, lng: 79.3845, region: 'trichy', hub: true },
  { nameEn: 'Nagapattinam', nameTa: 'நாகப்பட்டினம்', lat: 10.7672, lng: 79.8449, region: 'trichy', hub: true },
  { nameEn: 'Mayiladuthurai', nameTa: 'மயிலாடுதுறை', lat: 11.1075, lng: 79.6523, region: 'trichy', hub: false },
  { nameEn: 'Tiruvarur', nameTa: 'திருவாரூர்', lat: 10.7725, lng: 79.6365, region: 'trichy', hub: false },
  { nameEn: 'Karur', nameTa: 'கரூர்', lat: 10.9601, lng: 78.0766, region: 'trichy', hub: true },
  { nameEn: 'Perambalur', nameTa: 'பெரம்பலூர்', lat: 11.2342, lng: 78.8817, region: 'trichy', hub: false },
  { nameEn: 'Ariyalur', nameTa: 'அரியலூர்', lat: 11.1401, lng: 79.0786, region: 'trichy', hub: false },
  { nameEn: 'Pudukkottai', nameTa: 'புதுக்கோட்டை', lat: 10.3797, lng: 78.8208, region: 'trichy', hub: true },

  // Southern Tamil Nadu
  { nameEn: 'Madurai', nameTa: 'மதுரை', lat: 9.9252, lng: 78.1198, region: 'madurai', hub: true },
  { nameEn: 'Dindigul', nameTa: 'திண்டுக்கல்', lat: 10.3673, lng: 77.9803, region: 'madurai', hub: true },
  { nameEn: 'Theni', nameTa: 'தேனி', lat: 10.0104, lng: 77.4768, region: 'madurai', hub: true },
  { nameEn: 'Virudhunagar', nameTa: 'விருதுநகர்', lat: 9.5872, lng: 77.9514, region: 'madurai', hub: true },
  { nameEn: 'Sivaganga', nameTa: 'சிவகங்கை', lat: 9.8433, lng: 78.4809, region: 'madurai', hub: false },
  { nameEn: 'Ramanathapuram', nameTa: 'இராமநாதபுரம்', lat: 9.3639, lng: 78.8395, region: 'madurai', hub: true },
  { nameEn: 'Rameswaram', nameTa: 'இராமேஸ்வரம்', lat: 9.2876, lng: 79.3129, region: 'madurai', hub: true },

  // Deep South
  { nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி', lat: 8.7139, lng: 77.7567, region: 'tirunelveli', hub: true },
  { nameEn: 'Tenkasi', nameTa: 'தென்காசி', lat: 8.9594, lng: 77.3150, region: 'tirunelveli', hub: true },
  { nameEn: 'Thoothukudi', nameTa: 'தூத்துக்குடி', lat: 8.7642, lng: 78.1348, region: 'tirunelveli', hub: true },
  { nameEn: 'Kanniyakumari / Nagercoil', nameTa: 'கன்னியாகுமரி / நாகர்கோவில்', lat: 8.0883, lng: 77.5385, region: 'tirunelveli', hub: true }
];

// Major Bus Terminals Across All of Tamil Nadu
export const BUS_STOPS: BusStop[] = [
  // --- CHENNAI & NORTH METRO HUBS ---
  {
    id: 'stop-kcbt-kilambakkam',
    nameEn: 'Kilambakkam (KCBT) Kalaignar Centenary Terminus',
    nameTa: 'கிளம்பாக்கம் கலைஞர் நூற்றாண்டு பேருந்து முனையம்',
    district: 'Chengalpattu',
    districtTa: 'செங்கல்பட்டு',
    location: { lat: 12.8624, lng: 80.0573 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 94,
    connectingRoutes: ['SETC-101', 'SETC-118', 'TNSTC-301', '21G', '18', '500']
  },
  {
    id: 'stop-cmbt-koyambedu',
    nameEn: 'Koyambedu (CMBT) Integrated Terminus',
    nameTa: 'கோயம்பேடு (CMBT) ஒருங்கிணைந்த பேருந்து முனையம்',
    district: 'Chennai',
    districtTa: 'சென்னை',
    location: { lat: 13.0694, lng: 80.1948 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 96,
    connectingRoutes: ['TNSTC-301', 'TNSTC-705', '70V', '570', 'M1']
  },
  {
    id: 'stop-tambaram',
    nameEn: 'Tambaram MEPZ & Bus Terminus',
    nameTa: 'தாம்பரம் பேருந்து நிலையம்',
    district: 'Chengalpattu',
    districtTa: 'செங்கல்பட்டு',
    location: { lat: 12.9249, lng: 80.1000 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 90,
    connectingRoutes: ['21G', '18', '500', '70V']
  },
  {
    id: 'stop-broadway-central',
    nameEn: 'Chennai Central / Broadway Terminus',
    nameTa: 'சென்னை சென்ட்ரல் / பிராட்வே முனையம்',
    district: 'Chennai',
    districtTa: 'சென்னை',
    location: { lat: 13.0827, lng: 80.2810 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 88,
    connectingRoutes: ['21G', '18', 'MTC-1A']
  },
  {
    id: 'stop-guindy',
    nameEn: 'Guindy Industrial Estate & Metro Hub',
    nameTa: 'கிண்டி தொழில்பேட்டை & மெட்ரோ முனையம்',
    district: 'Chennai',
    districtTa: 'சென்னை',
    location: { lat: 13.0067, lng: 80.2023 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 86,
    connectingRoutes: ['21G', '18', '70V', '570']
  },
  {
    id: 'stop-pallavaram',
    nameEn: 'Pallavaram Bus Stand (GST Corridor)',
    nameTa: 'பல்லாவரம் பேருந்து நிறுத்தம்',
    district: 'Chengalpattu',
    districtTa: 'செங்கல்பட்டு',
    location: { lat: 12.9675, lng: 80.1491 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 92,
    connectingRoutes: ['21G', '18', '500']
  },
  {
    id: 'stop-vellore-new',
    nameEn: 'Vellore New Bus Stand (Selliamman Nagar)',
    nameTa: 'வேலூர் புதிய பேருந்து நிலையம்',
    district: 'Vellore',
    districtTa: 'வேலூர்',
    location: { lat: 12.9279, lng: 79.1368 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 82,
    connectingRoutes: ['TNSTC-705', 'SETC-101']
  },

  // --- COIMBATORE & KONGU WEST HUBS ---
  {
    id: 'stop-cbe-gandhipuram',
    nameEn: 'Coimbatore Gandhipuram Central Bus Stand',
    nameTa: 'கோவை காந்திபுரம் மத்திய பேருந்து நிலையம்',
    district: 'Coimbatore',
    districtTa: 'கோயம்புத்தூர்',
    location: { lat: 11.0183, lng: 76.9667 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 92,
    connectingRoutes: ['TNSTC-301', 'TNSTC-501', 'SETC-CBE-1']
  },
  {
    id: 'stop-cbe-singanallur',
    nameEn: 'Coimbatore Singanallur Bus Stand',
    nameTa: 'கோவை சிங்காநல்லூர் பேருந்து நிலையம் (தெற்கு & டெல்டா)',
    district: 'Coimbatore',
    districtTa: 'கோயம்புத்தூர்',
    location: { lat: 11.0022, lng: 77.0256 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 88,
    connectingRoutes: ['TNSTC-204', 'NH-83']
  },
  {
    id: 'stop-pollachi-central',
    nameEn: 'Pollachi Central Bus Stand',
    nameTa: 'பொள்ளாச்சி மத்திய பேருந்து நிலையம்',
    district: 'Coimbatore',
    districtTa: 'கோயம்புத்தூர்',
    location: { lat: 10.6580, lng: 77.0080 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 85,
    connectingRoutes: ['101', '205', 'TNSTC-204']
  },
  {
    id: 'stop-udumalpet-central',
    nameEn: 'Udumalpet Central Bus Stand',
    nameTa: 'உடுமலைப்பேட்டை மத்திய பேருந்து நிலையம்',
    district: 'Tiruppur',
    districtTa: 'திருப்பூர்',
    location: { lat: 10.5850, lng: 77.2480 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 78,
    connectingRoutes: ['205', 'TNSTC-204']
  },
  {
    id: 'stop-tiruppur-new',
    nameEn: 'Tiruppur New Bus Stand (Avinashi Road)',
    nameTa: 'திருப்பூர் புதிய பேருந்து நிலையம்',
    district: 'Tiruppur',
    districtTa: 'திருப்பூர்',
    location: { lat: 11.1150, lng: 77.3490 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 84,
    connectingRoutes: ['TNSTC-301', 'TNSTC-501']
  },
  {
    id: 'stop-erode-central',
    nameEn: 'Erode Central Bus Stand',
    nameTa: 'ஈரோடு மத்திய பேருந்து நிலையம்',
    district: 'Erode',
    districtTa: 'ஈரோடு',
    location: { lat: 11.3410, lng: 77.7172 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 86,
    connectingRoutes: ['TNSTC-301', 'TNSTC-501']
  },
  {
    id: 'stop-salem-new',
    nameEn: 'Salem MGR Central Bus Stand (Meyyanur)',
    nameTa: 'சேலம் எம்.ஜி.ஆர் புதிய பேருந்து நிலையம்',
    district: 'Salem',
    districtTa: 'சேலம்',
    location: { lat: 11.6643, lng: 78.1460 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 89,
    connectingRoutes: ['SETC-101', 'TNSTC-301', 'TNSTC-501', 'NH-44']
  },
  {
    id: 'stop-hosur-central',
    nameEn: 'Hosur Central Bus Stand (TN-KA Gateway)',
    nameTa: 'ஓசூர் மத்திய பேருந்து நிலையம்',
    district: 'Krishnagiri',
    districtTa: 'கிருஷ்ணகிரி',
    location: { lat: 12.7380, lng: 77.8280 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 87,
    connectingRoutes: ['NH-44', 'TNSTC-HSR']
  },

  // --- CENTRAL TRICHY & DELTA HUBS ---
  {
    id: 'stop-trichy-central',
    nameEn: 'Tiruchirappalli (Trichy) Central Bus Stand',
    nameTa: 'திருச்சிராப்பள்ளி மத்திய பேருந்து நிலையம்',
    district: 'Tiruchirappalli',
    districtTa: 'திருச்சிராப்பள்ளி',
    location: { lat: 10.7905, lng: 78.7047 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 95,
    connectingRoutes: ['SETC-101', 'SETC-118', 'TNSTC-402', 'NH-45']
  },
  {
    id: 'stop-thanjavur-new',
    nameEn: 'Thanjavur New Bus Stand (Trichy Road)',
    nameTa: 'தஞ்சாவூர் புதிய பேருந்து நிலையம்',
    district: 'Thanjavur',
    districtTa: 'தஞ்சாவூர்',
    location: { lat: 10.7760, lng: 79.1190 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 84,
    connectingRoutes: ['TNSTC-402', 'NH-83']
  },
  {
    id: 'stop-villupuram-central',
    nameEn: 'Villupuram Central Bus Stand',
    nameTa: 'விழுப்புரம் மத்திய பேருந்து நிலையம்',
    district: 'Villupuram',
    districtTa: 'விழுப்புரம்',
    location: { lat: 11.9401, lng: 79.4861 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 81,
    connectingRoutes: ['SETC-101', 'SETC-118', 'NH-45']
  },

  // --- SOUTHERN MADURAI & TIRUNELVELI HUBS ---
  {
    id: 'stop-madurai-mattuthavani',
    nameEn: 'Madurai Mattuthavani (M.G.R.) Integrated Terminus (MIBT)',
    nameTa: 'மதுரை மாட்டுத்தாவணி எம்.ஜி.ஆர் ஒருங்கிணைந்த பேருந்து நிலையம்',
    district: 'Madurai',
    districtTa: 'மதுரை',
    location: { lat: 9.9450, lng: 78.1560 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 97,
    connectingRoutes: ['SETC-101', 'SETC-118', 'TNSTC-204', 'TNSTC-601']
  },
  {
    id: 'stop-madurai-arappalayam',
    nameEn: 'Madurai Arappalayam Bus Stand (West & Kongu)',
    nameTa: 'மதுரை ஆரப்பாளையம் பேருந்து நிலையம் (கோவை/திண்டுக்கல்)',
    district: 'Madurai',
    districtTa: 'மதுரை',
    location: { lat: 9.9320, lng: 78.1060 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 86,
    connectingRoutes: ['TNSTC-204']
  },
  {
    id: 'stop-dindigul-central',
    nameEn: 'Dindigul Kamarajar Bus Stand',
    nameTa: 'திண்டுக்கல் காமராஜர் பேருந்து நிலையம்',
    district: 'Dindigul',
    districtTa: 'திண்டுக்கல்',
    location: { lat: 10.3673, lng: 77.9803 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 83,
    connectingRoutes: ['SETC-101', 'TNSTC-204', 'NH-44']
  },
  {
    id: 'stop-tirunelveli-new',
    nameEn: 'Tirunelveli Vaeinthaankulam (Bharathiyar) New Terminus',
    nameTa: 'திருநெல்வேலி புதிய பேருந்து நிலையம் (வேய்ந்தான்குளம்)',
    district: 'Tirunelveli',
    districtTa: 'திருநெல்வேலி',
    location: { lat: 8.7139, lng: 77.7567 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 91,
    connectingRoutes: ['SETC-118', 'TNSTC-601', 'NH-44']
  },
  {
    id: 'stop-thoothukudi-new',
    nameEn: 'Thoothukudi New Bus Stand',
    nameTa: 'தூத்துக்குடி புதிய பேருந்து நிலையம்',
    district: 'Thoothukudi',
    districtTa: 'தூத்துக்குடி',
    location: { lat: 8.7642, lng: 78.1348 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 80,
    connectingRoutes: ['TNSTC-TUT-1']
  },
  {
    id: 'stop-nagercoil-christopher',
    nameEn: 'Nagercoil Christopher Bus Stand (Kanniyakumari Hub)',
    nameTa: 'நாகர்கோவில் கிறிஸ்டோபர் பேருந்து நிலையம்',
    district: 'Kanniyakumari',
    districtTa: 'கன்னியாகுமரி',
    location: { lat: 8.1833, lng: 77.4333 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 85,
    connectingRoutes: ['SETC-118', 'TNSTC-601']
  },
  {
    id: 'stop-kanyakumari-beach',
    nameEn: 'Kanniyakumari Cape Comorin Beach Terminal',
    nameTa: 'கன்னியாகுமரி முக்கடல் முனையம்',
    district: 'Kanniyakumari',
    districtTa: 'கன்னியாகுமரி',
    location: { lat: 8.0883, lng: 77.5385 },
    isMajorHub: true,
    isSafeNightStop: true,
    hasShelter: true,
    lightingQuality: 'high',
    currentCrowdScore: 89,
    connectingRoutes: ['SETC-118', 'TNSTC-601']
  }
];

// Major Bus Corridors Across All of Tamil Nadu
const BASE_BUS_ROUTES: BusRoute[] = [
  // 1. SETC 101: Chennai (KCBT) to Madurai (MIBT) via GST NH 45 (Grand Trunk)
  {
    id: 'route-setc-101',
    routeNumber: 'SETC 101',
    nameEn: 'Chennai (KCBT) ⇄ Madurai (MIBT) Super Deluxe',
    nameTa: 'சென்னை (கிளம்பாக்கம்) ⇄ மதுரை (மாட்டுத்தாவணி) அதிவிரைவு',
    originEn: 'Chennai Kilambakkam (KCBT)',
    originTa: 'சென்னை கிளம்பாக்கம்',
    destinationEn: 'Madurai Mattuthavani (MIBT)',
    destinationTa: 'மதுரை மாட்டுத்தாவணி',
    color: '#0284c7', // Sky Blue
    averageTravelTimeMinutes: 440, // ~7.3 hours
    reliabilityScore: 92,
    fareRupees: 520,
    isWomenPinkBus: false,
    frequencyMinutes: 20,
    stops: [
      { stopId: 'stop-kcbt-kilambakkam', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-villupuram-central', distanceFromStartKm: 132, scheduledMinutesFromStart: 120 },
      { stopId: 'stop-trichy-central', distanceFromStartKm: 298, scheduledMinutesFromStart: 280 },
      { stopId: 'stop-dindigul-central', distanceFromStartKm: 382, scheduledMinutesFromStart: 360 },
      { stopId: 'stop-madurai-mattuthavani', distanceFromStartKm: 442, scheduledMinutesFromStart: 440 }
    ],
    polyline: [
      { lat: 12.8624, lng: 80.0573 }, // KCBT
      { lat: 12.6939, lng: 79.9757 }, // Chengalpattu
      { lat: 12.2200, lng: 79.6500 }, // Tindivanam
      { lat: 11.9401, lng: 79.4861 }, // Villupuram
      { lat: 11.4500, lng: 79.0800 }, // Ulundurpet
      { lat: 11.2342, lng: 78.8817 }, // Perambalur
      { lat: 10.7905, lng: 78.7047 }, // Trichy
      { lat: 10.5500, lng: 78.3000 }, // Manapparai
      { lat: 10.3673, lng: 77.9803 }, // Dindigul
      { lat: 9.9450, lng: 78.1560 }   // Madurai MIBT
    ]
  },

  // 2. TNSTC 301: Chennai (CMBT) to Coimbatore (Gandhipuram) via Salem NH 544
  {
    id: 'route-tnstc-301',
    routeNumber: 'TNSTC 301',
    nameEn: 'Chennai (CMBT) ⇄ Coimbatore (Gandhipuram) Kongu Express',
    nameTa: 'சென்னை (கோயம்பேடு) ⇄ கோவை (காந்திபுரம்) விரைவு',
    originEn: 'Chennai Koyambedu (CMBT)',
    originTa: 'சென்னை கோயம்பேடு',
    destinationEn: 'Coimbatore Gandhipuram',
    destinationTa: 'கோவை காந்திபுரம்',
    color: '#10b981', // Emerald
    averageTravelTimeMinutes: 480, // 8 hours
    reliabilityScore: 89,
    fareRupees: 550,
    isWomenPinkBus: false,
    frequencyMinutes: 30,
    stops: [
      { stopId: 'stop-cmbt-koyambedu', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-vellore-new', distanceFromStartKm: 135, scheduledMinutesFromStart: 130 },
      { stopId: 'stop-salem-new', distanceFromStartKm: 340, scheduledMinutesFromStart: 320 },
      { stopId: 'stop-erode-central', distanceFromStartKm: 405, scheduledMinutesFromStart: 390 },
      { stopId: 'stop-tiruppur-new', distanceFromStartKm: 450, scheduledMinutesFromStart: 435 },
      { stopId: 'stop-cbe-gandhipuram', distanceFromStartKm: 500, scheduledMinutesFromStart: 480 }
    ],
    polyline: [
      { lat: 13.0694, lng: 80.1948 }, // CMBT
      { lat: 12.9600, lng: 79.9400 }, // Sriperumbudur
      { lat: 12.9279, lng: 79.1368 }, // Vellore
      { lat: 12.6800, lng: 78.6100 }, // Vaniyambadi
      { lat: 12.1211, lng: 78.1582 }, // Dharmapuri
      { lat: 11.6643, lng: 78.1460 }, // Salem
      { lat: 11.3410, lng: 77.7172 }, // Erode
      { lat: 11.1150, lng: 77.3490 }, // Tiruppur
      { lat: 11.0183, lng: 76.9667 }  // Coimbatore
    ]
  },

  // 3. TNSTC 204: Coimbatore (Singanallur) to Madurai (Arappalayam) via Dindigul
  {
    id: 'route-tnstc-204',
    routeNumber: 'TNSTC 204',
    nameEn: 'Coimbatore (Singanallur) ⇄ Madurai (Arappalayam)',
    nameTa: 'கோவை (சிங்காநல்லூர்) ⇄ மதுரை (ஆரப்பாளையம்) விரைவு',
    originEn: 'Coimbatore Singanallur',
    originTa: 'கோவை சிங்காநல்லூர்',
    destinationEn: 'Madurai Arappalayam',
    destinationTa: 'மதுரை ஆரப்பாளையம்',
    color: '#8b5cf6', // Purple
    averageTravelTimeMinutes: 240, // 4 hours
    reliabilityScore: 94,
    fareRupees: 215,
    isWomenPinkBus: false,
    frequencyMinutes: 15,
    stops: [
      { stopId: 'stop-cbe-singanallur', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-dindigul-central', distanceFromStartKm: 155, scheduledMinutesFromStart: 160 },
      { stopId: 'stop-madurai-arappalayam', distanceFromStartKm: 215, scheduledMinutesFromStart: 240 }
    ],
    polyline: [
      { lat: 11.0022, lng: 77.0256 }, // Singanallur
      { lat: 10.6500, lng: 76.9900 }, // Pollachi
      { lat: 10.5800, lng: 77.2400 }, // Udumalpet
      { lat: 10.4500, lng: 77.5100 }, // Palani
      { lat: 10.3673, lng: 77.9803 }, // Dindigul
      { lat: 9.9320, lng: 78.1060 }   // Madurai Arappalayam
    ]
  },

  // 4. SETC 118: Chennai (KCBT) to Tirunelveli & Kanniyakumari
  {
    id: 'route-setc-118',
    routeNumber: 'SETC 118 AC',
    nameEn: 'Chennai (KCBT) ⇄ Tirunelveli ⇄ Kanniyakumari AC Sleeper',
    nameTa: 'சென்னை (கிளம்பாக்கம்) ⇄ நெல்லை ⇄ கன்னியாகுமரி குளிர்சாதன படுக்கை',
    originEn: 'Chennai Kilambakkam (KCBT)',
    originTa: 'சென்னை கிளம்பாக்கம்',
    destinationEn: 'Kanniyakumari Cape Terminal',
    destinationTa: 'கன்னியாகுமரி முக்கடல்',
    color: '#f59e0b', // Amber
    averageTravelTimeMinutes: 660, // 11 hours
    reliabilityScore: 95,
    fareRupees: 890,
    isWomenPinkBus: false,
    frequencyMinutes: 45,
    stops: [
      { stopId: 'stop-kcbt-kilambakkam', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-trichy-central', distanceFromStartKm: 298, scheduledMinutesFromStart: 280 },
      { stopId: 'stop-madurai-mattuthavani', distanceFromStartKm: 442, scheduledMinutesFromStart: 440 },
      { stopId: 'stop-tirunelveli-new', distanceFromStartKm: 598, scheduledMinutesFromStart: 580 },
      { stopId: 'stop-nagercoil-christopher', distanceFromStartKm: 672, scheduledMinutesFromStart: 640 },
      { stopId: 'stop-kanyakumari-beach', distanceFromStartKm: 692, scheduledMinutesFromStart: 660 }
    ],
    polyline: [
      { lat: 12.8624, lng: 80.0573 }, // KCBT
      { lat: 11.9401, lng: 79.4861 }, // Villupuram
      { lat: 10.7905, lng: 78.7047 }, // Trichy
      { lat: 9.9450, lng: 78.1560 },  // Madurai
      { lat: 9.5872, lng: 77.9514 },  // Virudhunagar
      { lat: 8.7139, lng: 77.7567 },  // Tirunelveli
      { lat: 8.1833, lng: 77.4333 },  // Nagercoil
      { lat: 8.0883, lng: 77.5385 }   // Kanyakumari
    ]
  },

  // 5. TNSTC 402: Trichy Central to Thanjavur & Delta
  {
    id: 'route-tnstc-402',
    routeNumber: 'TNSTC 402',
    nameEn: 'Trichy Central ⇄ Thanjavur (Delta Fast Passenger)',
    nameTa: 'திருச்சி மத்திய பேருந்து நிலையம் ⇄ தஞ்சாவூர் விரைவு',
    originEn: 'Trichy Central',
    originTa: 'திருச்சி',
    destinationEn: 'Thanjavur New Bus Stand',
    destinationTa: 'தஞ்சாவூர்',
    color: '#06b6d4', // Cyan
    averageTravelTimeMinutes: 65,
    reliabilityScore: 96,
    fareRupees: 55,
    isWomenPinkBus: true,
    frequencyMinutes: 10,
    stops: [
      { stopId: 'stop-trichy-central', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-thanjavur-new', distanceFromStartKm: 56, scheduledMinutesFromStart: 65 }
    ],
    polyline: [
      { lat: 10.7905, lng: 78.7047 },
      { lat: 10.7800, lng: 78.8500 },
      { lat: 10.7760, lng: 79.1190 }
    ]
  },

  // 6. TNSTC 501: Salem to Erode to Coimbatore (Kongu Corridor)
  {
    id: 'route-tnstc-501',
    routeNumber: 'TNSTC 501',
    nameEn: 'Salem New ⇄ Erode ⇄ Coimbatore Express',
    nameTa: 'சேலம் ⇄ ஈரோடு ⇄ கோவை கொங்கு விரைவு',
    originEn: 'Salem MGR Central',
    originTa: 'சேலம்',
    destinationEn: 'Coimbatore Gandhipuram',
    destinationTa: 'கோவை',
    color: '#ec4899', // Pink
    averageTravelTimeMinutes: 195,
    reliabilityScore: 91,
    fareRupees: 180,
    isWomenPinkBus: false,
    frequencyMinutes: 15,
    stops: [
      { stopId: 'stop-salem-new', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-erode-central', distanceFromStartKm: 65, scheduledMinutesFromStart: 70 },
      { stopId: 'stop-tiruppur-new', distanceFromStartKm: 115, scheduledMinutesFromStart: 125 },
      { stopId: 'stop-cbe-gandhipuram', distanceFromStartKm: 165, scheduledMinutesFromStart: 195 }
    ],
    polyline: [
      { lat: 11.6643, lng: 78.1460 },
      { lat: 11.4800, lng: 77.8600 },
      { lat: 11.3410, lng: 77.7172 },
      { lat: 11.1150, lng: 77.3490 },
      { lat: 11.0183, lng: 76.9667 }
    ]
  },

  // 7. MTC 21G: Chennai Urban Express GST Road Corridor
  {
    id: 'route-21g',
    routeNumber: '21G',
    nameEn: 'Tambaram ⇄ Broadway via GST Road Corridor',
    nameTa: 'தாம்பரம் ⇄ பிராட்வே (ஜிஎஸ்டி சாலை விரைவு)',
    originEn: 'Tambaram',
    originTa: 'தாம்பரம்',
    destinationEn: 'Broadway / Central',
    destinationTa: 'பிராட்வே / சென்ட்ரல்',
    color: '#0284c7',
    averageTravelTimeMinutes: 34,
    reliabilityScore: 89,
    fareRupees: 25,
    isWomenPinkBus: true,
    frequencyMinutes: 6,
    stops: [
      { stopId: 'stop-tambaram', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-pallavaram', distanceFromStartKm: 7.2, scheduledMinutesFromStart: 18 },
      { stopId: 'stop-guindy', distanceFromStartKm: 15.2, scheduledMinutesFromStart: 34 },
      { stopId: 'stop-broadway-central', distanceFromStartKm: 28.0, scheduledMinutesFromStart: 62 }
    ],
    polyline: [
      { lat: 12.9249, lng: 80.1000 },
      { lat: 12.9516, lng: 80.1408 },
      { lat: 12.9675, lng: 80.1491 },
      { lat: 12.9822, lng: 80.1636 },
      { lat: 13.0067, lng: 80.2023 },
      { lat: 13.0827, lng: 80.2810 }
    ]
  },

  // 8. TNSTC 101: Coimbatore Gandhipuram to Pollachi Central Point-to-Point
  {
    id: 'route-cbe-101',
    routeNumber: '101',
    nameEn: 'Coimbatore (Gandhipuram) ⇄ Pollachi Central Point-to-Point',
    nameTa: 'கோவை (காந்திபுரம்) ⇄ பொள்ளாச்சி இடைநில்லா விரைவு',
    originEn: 'Coimbatore Gandhipuram',
    originTa: 'கோவை காந்திபுரம்',
    destinationEn: 'Pollachi Central',
    destinationTa: 'பொள்ளாச்சி',
    color: '#10b981',
    averageTravelTimeMinutes: 52,
    reliabilityScore: 96,
    fareRupees: 42,
    isWomenPinkBus: false,
    frequencyMinutes: 10,
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    serviceType: 'Point-to-Point',
    districtsTraversed: ['Coimbatore'],
    stops: [
      { stopId: 'stop-cbe-gandhipuram', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-pollachi-central', distanceFromStartKm: 42, scheduledMinutesFromStart: 52 }
    ],
    polyline: [
      { lat: 11.0183, lng: 76.9667 }, // Gandhipuram
      { lat: 10.9800, lng: 76.9700 }, // Ukkadam
      { lat: 10.8700, lng: 76.9850 }, // Kinathukadavu
      { lat: 10.6580, lng: 77.0080 }  // Pollachi
    ]
  },

  // 9. TNSTC 205: Coimbatore Gandhipuram to Pollachi to Udumalpet
  {
    id: 'route-cbe-205',
    routeNumber: '205',
    nameEn: 'Coimbatore (Gandhipuram) ⇄ Pollachi ⇄ Udumalpet Express',
    nameTa: 'கோவை (காந்திபுரம்) ⇄ பொள்ளாச்சி ⇄ உடுமலைப்பேட்டை விரைவு',
    originEn: 'Coimbatore Gandhipuram',
    originTa: 'கோவை காந்திபுரம்',
    destinationEn: 'Udumalpet Central',
    destinationTa: 'உடுமலைப்பேட்டை',
    color: '#06b6d4',
    averageTravelTimeMinutes: 76,
    reliabilityScore: 93,
    fareRupees: 65,
    isWomenPinkBus: false,
    frequencyMinutes: 15,
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    serviceType: 'Express',
    districtsTraversed: ['Coimbatore', 'Tiruppur'],
    stops: [
      { stopId: 'stop-cbe-gandhipuram', distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-pollachi-central', distanceFromStartKm: 42, scheduledMinutesFromStart: 50 },
      { stopId: 'stop-udumalpet-central', distanceFromStartKm: 70, scheduledMinutesFromStart: 76 }
    ],
    polyline: [
      { lat: 11.0183, lng: 76.9667 }, // Gandhipuram
      { lat: 10.9800, lng: 76.9700 }, // Ukkadam
      { lat: 10.6580, lng: 77.0080 }, // Pollachi
      { lat: 10.5850, lng: 77.2480 }  // Udumalpet
    ]
  }
];

export const BUS_ROUTES: BusRoute[] = [...BASE_BUS_ROUTES, ...EXTENDED_ROUTES];

// Live Simulated Buses Operating Across Tamil Nadu
const BASE_INITIAL_BUSES: Bus[] = [
  // Bus 101: Gandhipuram to Pollachi (6 min ETA, Medium crowd)
  {
    id: 'bus-cbe-101-01',
    registrationNumber: 'TN 38 N 2101',
    routeId: 'route-cbe-101',
    routeNumber: '101',
    operator: 'TNSTC Coimbatore (Sungam Depot)',
    operatorTa: 'அரசுப் போக்குவரத்துக் கழகம் (கோவை சுங்கம்)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    serviceType: 'Point-to-Point',
    district: 'Coimbatore',
    districtTa: 'கோயம்புத்தூர்',
    districtsTraversed: ['Coimbatore'],
    availableSeats: 14,
    totalSeats: 52,
    availabilityStatus: 'available',
    fareRupees: 42,
    isWomenPinkBus: false,
    latitude: 10.7400,
    longitude: 76.9950,
    bearing: 175,
    speedKmh: 46,
    occupancy: 'medium',
    comfortScore: 88,
    reliabilityScore: 96,
    status: 'on_time',
    currentStopIndex: 0,
    nextStopId: 'stop-pollachi-central',
    etaNextStopMinutes: 6,
    delayMinutes: 0,
    predictedDelayMinutes: 1,
    delayReasonEn: 'Express cruising via Kinathukadavu bypass',
    delayReasonTa: 'கிணத்துக்கடவு புறவழிச்சாலையில் சீரான வேகம்',
    isAc: false,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.82,
    telemetry: {
      vehicleModel: 'Ashok Leyland 12M Kongu Fast Passenger',
      depotName: 'Sungam-II Depot [CBE-04]',
      depotNameTa: 'சுங்கம்-2 பணிமனை [CBE-04]',
      depotCode: 'CBE-SNG',
      driverName: 'S. Shanmugam',
      driverEmpId: 'TN-CBE-31940',
      driverRating: 4.8,
      passengerCount: 38,
      totalSeats: 52,
      fuelOrBatteryPercent: 78,
      fuelType: 'diesel',
      remainingRangeKm: 380,
      engineTempCelsius: 87,
      elevationMeters: 410
    }
  },

  // Bus 205: Gandhipuram to Udumalpet via Pollachi (12 min ETA, Low crowd)
  {
    id: 'bus-cbe-205-01',
    registrationNumber: 'TN 38 N 2205',
    routeId: 'route-cbe-205',
    routeNumber: '205',
    operator: 'TNSTC Coimbatore (Pollachi Unit)',
    operatorTa: 'அரசுப் போக்குவரத்துக் கழகம் (பொள்ளாச்சி பிரிவு)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    serviceType: 'Express',
    district: 'Coimbatore',
    districtTa: 'கோயம்புத்தூர்',
    districtsTraversed: ['Coimbatore', 'Tiruppur'],
    availableSeats: 26,
    totalSeats: 52,
    availabilityStatus: 'available',
    fareRupees: 65,
    isWomenPinkBus: false,
    latitude: 10.6650,
    longitude: 77.0150,
    bearing: 110,
    speedKmh: 48,
    occupancy: 'low',
    comfortScore: 94,
    reliabilityScore: 95,
    status: 'on_time',
    currentStopIndex: 1,
    nextStopId: 'stop-udumalpet-central',
    etaNextStopMinutes: 12,
    delayMinutes: 0,
    predictedDelayMinutes: 0,
    delayReasonEn: 'On time, approaching Pollachi outbound junction',
    delayReasonTa: 'நேரத்திற்கு இயக்கப்படுகிறது, பொள்ளாச்சி சந்திப்பு அருகில்',
    isAc: false,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.60,
    telemetry: {
      vehicleModel: 'Tata 1618 LPO AC Deluxe',
      depotName: 'Pollachi Central Depot [POL-01]',
      depotNameTa: 'பொள்ளாச்சி மத்திய பணிமனை [POL-01]',
      depotCode: 'CBE-POL',
      driverName: 'M. Arumugam',
      driverEmpId: 'TN-CBE-40112',
      driverRating: 4.9,
      passengerCount: 26,
      totalSeats: 52,
      fuelOrBatteryPercent: 84,
      fuelType: 'diesel',
      remainingRangeKm: 460,
      engineTempCelsius: 86,
      elevationMeters: 360
    }
  },

  // Bus 1: SETC 101 on GST Highway (Cruising near Villupuram)
  {
    id: 'bus-setc-101-01',
    registrationNumber: 'TN 01 AN 0101',
    routeId: 'route-setc-101',
    routeNumber: 'SETC 101',
    operator: 'SETC Tamil Nadu (Madurai Central Depot)',
    operatorTa: 'அரசு விரைவுப் போக்குவரத்துக் கழகம் (மதுரை பணிமனை)',
    operatorCategory: 'SETC',
    serviceType: 'Ultra Deluxe',
    district: 'Villupuram',
    districtTa: 'விழுப்புரம்',
    districtsTraversed: ['Chengalpattu', 'Villupuram', 'Tiruchirappalli', 'Dindigul', 'Madurai'],
    availableSeats: 6,
    totalSeats: 44,
    availabilityStatus: 'filling_fast',
    fareRupees: 520,
    isWomenPinkBus: false,
    latitude: 11.9401,
    longitude: 79.4861,
    bearing: 215,
    speedKmh: 68,
    occupancy: 'medium',
    comfortScore: 92,
    reliabilityScore: 94,
    status: 'on_time',
    currentStopIndex: 1,
    nextStopId: 'stop-trichy-central',
    etaNextStopMinutes: 75,
    delayMinutes: 3,
    predictedDelayMinutes: 5,
    delayReasonEn: 'NH 45 toll plaza queue near Ulundurpet',
    delayReasonTa: 'உளுந்தூர்பேட்டை சுங்கச்சாவடி அருகே மிதமான வரிசை',
    isAc: true,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.35,
    telemetry: {
      vehicleModel: 'Ashok Leyland 222" Viking Euro-VI AC Sleeper',
      depotName: 'SETC Madurai Bye-pass Depot [MDU-01]',
      depotNameTa: 'மதுரை புறவழிச்சாலை பணிமனை [MDU-01]',
      depotCode: 'SETC-MDU',
      driverName: 'K. Murugesan (Emp #48291)',
      driverEmpId: 'TN-SETC-48291',
      driverRating: 4.9,
      passengerCount: 38,
      totalSeats: 44,
      fuelOrBatteryPercent: 74,
      fuelType: 'diesel',
      remainingRangeKm: 520,
      engineTempCelsius: 86,
      elevationMeters: 62,
      nextTollGate: {
        nameEn: 'Ulundurpet Toll Plaza (NH 45)',
        nameTa: 'உளுந்தூர்பேட்டை சுங்கச்சாவடி',
        distanceKm: 28,
        feeRupees: 95,
        fastagStatus: 'active',
        delayMin: 4
      }
    }
  },

  // Bus 2: TNSTC 301 on NH 544 (Near Salem Sankari bypass)
  {
    id: 'bus-tnstc-301-01',
    registrationNumber: 'TN 38 N 2408',
    routeId: 'route-tnstc-301',
    routeNumber: 'TNSTC 301',
    operator: 'TNSTC Coimbatore (Ukkadam Depot)',
    operatorTa: 'அரசுப் போக்குவரத்துக் கழகம் கோவை (உக்கடம் பணிமனை)',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Coimbatore',
    serviceType: 'Express',
    district: 'Salem',
    districtTa: 'சேலம்',
    districtsTraversed: ['Coimbatore', 'Tiruppur', 'Erode', 'Salem', 'Vellore', 'Chennai'],
    availableSeats: 22,
    totalSeats: 48,
    availabilityStatus: 'available',
    fareRupees: 380,
    isWomenPinkBus: false,
    latitude: 11.5500,
    longitude: 77.9500,
    bearing: 240,
    speedKmh: 62,
    occupancy: 'low',
    comfortScore: 88,
    reliabilityScore: 91,
    status: 'on_time',
    currentStopIndex: 2,
    nextStopId: 'stop-erode-central',
    etaNextStopMinutes: 42,
    delayMinutes: 2,
    predictedDelayMinutes: 4,
    delayReasonEn: 'Clear 4-lane expressway cruising on NH 544',
    delayReasonTa: 'தேசிய நெடுஞ்சாலை 544-ல் சீரான பயணம்',
    isAc: false,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.58,
    telemetry: {
      vehicleModel: 'Tata 1618 LP Kongu Deluxe Express',
      depotName: 'TNSTC Coimbatore Sungam-2 Depot',
      depotNameTa: 'கோவை சுங்கம்-2 பணிமனை',
      depotCode: 'CBE-SNG',
      driverName: 'S. Shanmugam (Emp #31940)',
      driverEmpId: 'TN-CBE-31940',
      driverRating: 4.8,
      passengerCount: 26,
      totalSeats: 48,
      fuelOrBatteryPercent: 68,
      fuelType: 'diesel',
      remainingRangeKm: 410,
      engineTempCelsius: 89,
      elevationMeters: 245,
      nextTollGate: {
        nameEn: 'Sankari Toll Plaza (NH 544)',
        nameTa: 'சங்ககிரி சுங்கச்சாவடி',
        distanceKm: 18,
        feeRupees: 70,
        fastagStatus: 'cleared',
        delayMin: 1
      }
    }
  },

  // Bus 3: TNSTC 204 (Near Dindigul heading to Madurai)
  {
    id: 'bus-tnstc-204-01',
    registrationNumber: 'TN 57 N 3302',
    routeId: 'route-tnstc-204',
    routeNumber: 'TNSTC 204',
    operator: 'TNSTC Dindigul / Madurai Division',
    operatorTa: 'அரசுப் போக்குவரத்துக் கழகம் திண்டுக்கல்/மதுரை',
    operatorCategory: 'TNSTC',
    tnstcDivision: 'Madurai',
    serviceType: 'Point-to-Point',
    district: 'Dindigul',
    districtTa: 'திண்டுக்கல்',
    districtsTraversed: ['Coimbatore', 'Dindigul', 'Madurai'],
    availableSeats: 4,
    totalSeats: 50,
    availabilityStatus: 'filling_fast',
    fareRupees: 185,
    isWomenPinkBus: false,
    latitude: 10.2200,
    longitude: 78.0200,
    bearing: 155,
    speedKmh: 54,
    occupancy: 'high',
    comfortScore: 78,
    reliabilityScore: 95,
    status: 'on_time',
    currentStopIndex: 1,
    nextStopId: 'stop-madurai-arappalayam',
    etaNextStopMinutes: 38,
    delayMinutes: 4,
    predictedDelayMinutes: 6,
    delayReasonEn: 'Dense passenger boarding at Dindigul junction',
    delayReasonTa: 'திண்டுக்கல் சந்திப்பில் அதிக பயணிகள் கூட்டம்',
    isAc: false,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.72,
    telemetry: {
      vehicleModel: 'Ashok Leyland 12M Air-Suspension Point-to-Point',
      depotName: 'Dindigul Central Depot [DGL-01]',
      depotNameTa: 'திண்டுக்கல் மத்திய பணிமனை [DGL-01]',
      depotCode: 'DGL-CTR',
      driverName: 'R. Veeramani (Emp #55120)',
      driverEmpId: 'TN-DGL-55120',
      driverRating: 4.7,
      passengerCount: 46,
      totalSeats: 50,
      fuelOrBatteryPercent: 52,
      fuelType: 'diesel',
      remainingRangeKm: 310,
      engineTempCelsius: 91,
      elevationMeters: 285,
      nextTollGate: {
        nameEn: 'Kodai Road Toll Plaza (NH 44)',
        nameTa: 'கொடை ரோடு சுங்கச்சாவடி',
        distanceKm: 22,
        feeRupees: 65,
        fastagStatus: 'active',
        delayMin: 3
      }
    }
  },

  // Bus 4: SETC 118 AC Sleeper (Near Madurai heading to Tirunelveli)
  {
    id: 'bus-setc-118-01',
    registrationNumber: 'TN 01 AN 7788',
    routeId: 'route-setc-118',
    routeNumber: 'SETC 118 AC',
    operator: 'SETC Tamil Nadu (Tirunelveli Unit)',
    operatorTa: 'அரசு விரைவுப் போக்குவரத்துக் கழகம் (நெல்லை பிரிவு)',
    operatorCategory: 'SETC',
    serviceType: 'AC Sleeper',
    district: 'Virudhunagar',
    districtTa: 'விருதுநகர்',
    districtsTraversed: ['Chengalpattu', 'Villupuram', 'Tiruchirappalli', 'Madurai', 'Virudhunagar', 'Tirunelveli', 'Kanniyakumari'],
    availableSeats: 4,
    totalSeats: 36,
    availabilityStatus: 'filling_fast',
    fareRupees: 920,
    isWomenPinkBus: false,
    latitude: 9.3500,
    longitude: 77.9200,
    bearing: 195,
    speedKmh: 74,
    occupancy: 'medium',
    comfortScore: 96,
    reliabilityScore: 96,
    status: 'on_time',
    currentStopIndex: 2,
    nextStopId: 'stop-tirunelveli-new',
    etaNextStopMinutes: 52,
    delayMinutes: 1,
    predictedDelayMinutes: 2,
    delayReasonEn: 'Express cruising on NH 44 four-lane',
    delayReasonTa: 'நெடுஞ்சாலை 44-ல் அதிவிரைவு பயணம்',
    isAc: true,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.65,
    telemetry: {
      vehicleModel: 'BharatBenz 2428 Multi-Axle AC Sleeper Ultra',
      depotName: 'SETC Tirunelveli Vannarpettai Unit',
      depotNameTa: 'திருநெல்வேலி வண்ணார்பேட்டை பணிமனை',
      depotCode: 'SETC-TIN',
      driverName: 'M. Anthony Samy (Emp #41029)',
      driverEmpId: 'TN-SETC-41029',
      driverRating: 4.95,
      passengerCount: 32,
      totalSeats: 36,
      fuelOrBatteryPercent: 82,
      fuelType: 'diesel',
      remainingRangeKm: 640,
      engineTempCelsius: 85,
      elevationMeters: 110,
      nextTollGate: {
        nameEn: 'Etturvattam Toll Plaza (Kovilpatti)',
        nameTa: 'எட்டூர்வட்டம் சுங்கச்சாவடி',
        distanceKm: 34,
        feeRupees: 90,
        fastagStatus: 'cleared',
        delayMin: 1
      }
    }
  },

  // Bus 5: MTC 21G (Chennai Urban GST corridor near Pallavaram)
  {
    id: 'bus-21g-1',
    registrationNumber: 'TN 01 N 9821',
    routeId: 'route-21g',
    routeNumber: '21G',
    operator: 'MTC Chennai (Chromepet Depot)',
    operatorTa: 'எம்டிசி சென்னை (குரோம்பேட்டை பணிமனை)',
    operatorCategory: 'MTC',
    serviceType: 'Ordinary (Women Free)',
    district: 'Chennai',
    districtTa: 'சென்னை',
    districtsTraversed: ['Chengalpattu', 'Chennai'],
    availableSeats: 2,
    totalSeats: 48,
    availabilityStatus: 'full',
    fareRupees: 0,
    isWomenPinkBus: true,
    latitude: 12.9675,
    longitude: 80.1491,
    bearing: 42,
    speedKmh: 22,
    occupancy: 'high',
    comfortScore: 74,
    reliabilityScore: 89,
    status: 'delayed',
    currentStopIndex: 1,
    nextStopId: 'stop-guindy',
    etaNextStopMinutes: 16,
    delayMinutes: 8,
    predictedDelayMinutes: 12,
    delayReasonEn: 'Heavy traffic slowdown near Pallavaram metro work',
    delayReasonTa: 'பல்லாவரம் மெட்ரோ பணிகளால் கடும் போக்குவரத்து நெரிசல்',
    isAc: false,
    lastUpdated: 'Just now',
    stationaryDurationMinutes: 0,
    routeProgressRatio: 0.42,
    telemetry: {
      vehicleModel: 'Ashok Leyland BS-VI "Vidiyal Payanam" Low Floor',
      depotName: 'MTC Chromepet Depot [CL]',
      depotNameTa: 'எம்டிசி குரோம்பேட்டை பணிமனை [CL]',
      depotCode: 'MTC-CL',
      driverName: 'G. Arumugam (Emp #18933)',
      driverEmpId: 'MTC-18933',
      driverRating: 4.6,
      passengerCount: 62,
      totalSeats: 48,
      fuelOrBatteryPercent: 58,
      fuelType: 'diesel',
      remainingRangeKm: 210,
      engineTempCelsius: 93,
      elevationMeters: 18,
      nextTollGate: {
        nameEn: 'Kathipara Junction Grade Separator',
        nameTa: 'கத்திப்பாரா சந்திப்பு',
        distanceKm: 5.4,
        feeRupees: 0,
        fastagStatus: 'active',
        delayMin: 6
      }
    }
  }
];

export const INITIAL_BUSES: Bus[] = [...BASE_INITIAL_BUSES, ...EXTENDED_BUSES];

// Active Incidents Across Tamil Nadu Corridors
export const INITIAL_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-gst-pallavaram',
    type: 'traffic_jam',
    titleEn: 'Severe Congestion near Pallavaram Flyover (GST Road)',
    titleTa: 'பல்லாவரம் மேம்பாலம் அருகே கடும் போக்குவரத்து நெரிசல்',
    descriptionEn: 'Metro Phase-2 construction narrowed roadway to single lane. Delays of 8-12 minutes for Chennai-bound buses.',
    descriptionTa: 'மெட்ரோ இரண்டாம் கட்ட பணிகளால் சாலை குறுகலாகி 8 முதல் 12 நிமிடங்கள் வரை தாமதம்.',
    severity: 'orange',
    location: { lat: 12.9675, lng: 80.1491 },
    roadName: 'NH 45 / GST Road, Pallavaram',
    affectedRouteNumbers: ['21G', 'SETC 101', 'SETC 118'],
    expectedDelayMinutes: 8,
    reportedTime: '12m ago',
    verificationCount: 9,
    isVerified: true,
    active: true
  },
  {
    id: 'inc-salem-toll',
    type: 'traffic_jam',
    titleEn: 'Slowdown near Sankari Toll Plaza (NH 544)',
    titleTa: 'சங்ககிரி சுங்கச்சாவடி அருகே மிதமான நெரிசல்',
    descriptionEn: 'Long vehicle queue on Salem - Coimbatore highway due to FASTag scanner recalibration.',
    descriptionTa: 'சுங்கச்சாவடி சென்சார் சீரமைப்பால் சேலம் - கோவை வழித்தடத்தில் வாகன நெரிசல்.',
    severity: 'yellow',
    location: { lat: 11.4800, lng: 77.8600 },
    roadName: 'NH 544, Sankari Toll Plaza',
    affectedRouteNumbers: ['TNSTC 301', 'TNSTC 501'],
    expectedDelayMinutes: 14,
    reportedTime: '24m ago',
    verificationCount: 6,
    isVerified: true,
    active: true
  },
  {
    id: 'inc-madurai-mattuthavani',
    type: 'traffic_jam',
    titleEn: 'Junction Traffic Surge at Madurai MIBT Entrance',
    titleTa: 'மதுரை மாட்டுத்தாவணி நுழைவுப் பகுதியில் போக்குவரத்து நெரிசல்',
    descriptionEn: 'Heavy bus movement and local traffic merge causing slowdown on Melur road approach.',
    descriptionTa: 'மேலூர் சாலை சந்திப்பில் பேருந்துகள் வருகை அதிகரிப்பால் மிதமான வேகம்.',
    severity: 'yellow',
    location: { lat: 9.9450, lng: 78.1560 },
    roadName: 'MIBT Main Access Road, Madurai',
    affectedRouteNumbers: ['SETC 101', 'SETC 118', 'TNSTC 204'],
    expectedDelayMinutes: 10,
    reportedTime: '30m ago',
    verificationCount: 12,
    isVerified: true,
    active: true
  }
];

// Active Weather Risks Across Tamil Nadu
export const WEATHER_RISK_ZONES: WeatherRiskArea[] = [
  {
    id: 'weather-coastal-cuddalore',
    areaNameEn: 'Cuddalore & Chidambaram Coastal Rain Alert',
    areaNameTa: 'கடலூர் & சிதம்பரம் கடலோர கனமழை எச்சரிக்கை',
    center: { lat: 11.7500, lng: 79.7700 },
    radiusMeters: 18000,
    riskType: 'flooding',
    severity: 'moderate',
    advisoryEn: 'Thunderstorm activity along ECR / NH 32. Buses operating with headlights on at reduced speed.',
    advisoryTa: 'கடலோரப் பகுதிகளில் இடியுடன் கூடிய மழை. பேருந்துகள் குறைந்த வேகத்தில் இயக்கப்படுகின்றன.'
  },
  {
    id: 'weather-ghats-nilgiris',
    areaNameEn: 'Nilgiris / Ooty Ghat Road Dense Mist & Wet Asphalt',
    areaNameTa: 'நீலகிரி மலைப்பாதை அடர் பனிமூட்டம் & வழுக்கும் சாலை',
    center: { lat: 11.4102, lng: 76.6950 },
    radiusMeters: 25000,
    riskType: 'fog',
    severity: 'moderate',
    advisoryEn: 'Low visibility on Kallar - Coonoor - Ooty hairpin bends. Drive in low gear.',
    advisoryTa: 'மலைப்பாதையில் அடர் பனிமூட்டம் காரணமாக வாகனங்கள் குறைந்த கியரில் இயக்கப்படுகின்றன.'
  }
];

// Active Event Traffic Zones
export const EVENT_TRAFFIC_ZONES: EventTrafficZone[] = [
  {
    id: 'event-madurai-chithirai',
    eventNameEn: 'Madurai Meenakshi & Vaigai Pilgrimage Rush',
    eventNameTa: 'மதுரை மீனாட்சி அம்மன் & வைகை ஆற்றுத் திருவிழா நெரிசல்',
    center: { lat: 9.9252, lng: 78.1198 },
    radiusMeters: 4000,
    expectedDelayMinutes: 18,
    recommendedAlternativeEn: 'Use Madurai Ring Road bypass via Mattuthavani to avoid inner city gridlock.',
    recommendedAlternativeTa: 'நகர உள்நெரிசலைத் தவிர்க்க மாட்டுத்தாவணி ரிங் ரோடு பைபாஸ் பயன்படுத்தவும்.',
    active: true
  }
];

export const DEFAULT_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-1',
    type: 'route',
    labelEn: 'SETC 101 (Chennai ⇄ Madurai Super Deluxe)',
    labelTa: 'SETC 101 (சென்னை ⇄ மதுரை அதிவிரைவு)',
    referenceId: 'route-setc-101',
    subText: 'NH 45 Grand Corridor'
  },
  {
    id: 'fav-2',
    type: 'stop',
    labelEn: 'Kilambakkam (KCBT) Kalaignar Terminus',
    labelTa: 'கிளம்பாக்கம் (KCBT) முனையம்',
    referenceId: 'stop-kcbt-kilambakkam',
    subText: 'Grand Southern Hub'
  },
  {
    id: 'fav-3',
    type: 'stop',
    labelEn: 'Madurai Mattuthavani Terminus (MIBT)',
    labelTa: 'மதுரை மாட்டுத்தாவணி முனையம்',
    referenceId: 'stop-madurai-mattuthavani',
    subText: 'South Tamil Nadu Interchange'
  }
];
