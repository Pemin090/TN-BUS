import React, { useState, useEffect, useCallback } from 'react';
import {
  Bus,
  BusRoute,
  BusStop,
  TrafficIncident,
  Language,
  SimulationState,
  SmartNotification,
  ActiveGetDownAlert
} from './types';
import {
  BUS_ROUTES,
  BUS_STOPS,
  INITIAL_BUSES,
  INITIAL_INCIDENTS,
  WEATHER_RISK_ZONES,
  EVENT_TRAFFIC_ZONES
} from './data/tamilNaduData';
import { updateBusPositions, evaluateGetDownAlert } from './services/simulationEngine';
import { Header } from './components/Header';
import { MapContainer } from './components/Map/MapContainer';
import { SearchRouteComparison } from './components/SearchRouteComparison';
import { BusDetailsCard } from './components/BusDetailsCard';
import { StopDetailsCard } from './components/StopDetailsCard';
import { BestTimeToTravelCard } from './components/BestTimeToTravelCard';
import { AdminDashboard } from './components/AdminDashboard';
import { SafetyModeView } from './components/SafetyModeView';
import { TrafficAlertsDrawer } from './components/TrafficAlertsDrawer';
import { IncidentReportingModal } from './components/IncidentReportingModal';
import { SimulationControls } from './components/SimulationControls';
import { NotificationsModal } from './components/NotificationsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DistrictBusAvailabilityExplorer } from './components/DistrictBusAvailabilityExplorer';
import { RealisticBusBackdrop } from './components/RealisticBusBackdrop';
import { RealisticLedBoard } from './components/RealisticLedBoard';
import { BusCockpitCluster } from './components/BusCockpitCluster';
import { AiTravelAssistant } from './components/AiTravelAssistant';
import { HackathonDemoModal } from './components/HackathonDemoModal';
import { AiTransportAnalytics } from './components/AiTransportAnalytics';
import { BusLiveryTheme } from './types';
import { Sparkles, MapPin, Zap, AlertTriangle, Layers, Building2 } from 'lucide-react';

export default function App() {
  // Localization state
  const [language, setLanguage] = useState<Language>('en');

  // Realistic Bus Livery Theme & Backdrop Mode
  const [currentTheme, setCurrentTheme] = useState<BusLiveryTheme>('all');
  const [backdropMode, setBackdropMode] = useState<'cinematic' | 'subtle' | 'road_only'>('subtle');
  const [isCockpitOpen, setIsCockpitOpen] = useState(false);

  const handleCycleBackdropMode = () => {
    setBackdropMode((prev) => {
      if (prev === 'subtle') return 'cinematic';
      if (prev === 'cinematic') return 'road_only';
      return 'subtle';
    });
  };

  // Navigation tab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability' | 'analytics'
  const [activeTab, setActiveTab] = useState<'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability' | 'analytics'>('map');

  // AI Assistant & Hackathon Demo Modals
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isHackathonDemoOpen, setIsHackathonDemoOpen] = useState(false);

  // Core Data State
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes] = useState<BusRoute[]>(BUS_ROUTES);
  const [stops] = useState<BusStop[]>(BUS_STOPS);
  const [incidents, setIncidents] = useState<TrafficIncident[]>(INITIAL_INCIDENTS);

  // Selected Entities
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [highlightCorridor, setHighlightCorridor] = useState<string | null>(null);

  // Favorites
  const [favoriteBusIds, setFavoriteBusIds] = useState<string[]>(['bus-21g-1']);

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSimDrawerOpen, setIsSimDrawerOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Simulation State
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: true,
    speedMultiplier: 1,
    isTrafficSpikeActive: false,
    isRoadClosureActive: false,
    isRainSimulated: false,
    isBusBreakdownSimulated: false,
    isHighCrowdSimulated: false
  });

  // Active Get-Down Alerts & Notifications
  const [activeGetDownAlerts, setActiveGetDownAlerts] = useState<ActiveGetDownAlert[]>([]);
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: 'notif-1',
      severity: 'orange',
      titleEn: 'Traffic Bottleneck Alert: Pallavaram',
      titleTa: 'போக்குவரத்து நெரிசல் எச்சரிக்கை: பல்லாவரம்',
      messageEn: 'Metro line construction causing +8 min delay along GST Road corridor for 21G & 18.',
      messageTa: 'ஜிஎஸ்டி சாலையில் மெட்ரோ பணிகளால் 21G மற்றும் 18 பேருந்துகளுக்கு 8 நிமிடங்கள் தாமதம்.',
      timestamp: '2m ago',
      routeNumber: '21G',
      isRead: false
    },
    {
      id: 'notif-2',
      severity: 'green',
      titleEn: 'Green Commute Milestone',
      titleTa: 'சுற்றுச்சூழல் விழிப்புணர்வு மைல்கல்',
      messageEn: 'Chennai commuters avoided 4,200 kg CO₂ emissions today taking public transit!',
      messageTa: 'இன்று பொதுப் போக்குவரத்தைப் பயன்படுத்தியதன் மூலம் 4,200 கிலோ CO₂ உமிழ்வு குறைக்கப்பட்டுள்ளது!',
      timestamp: '15m ago',
      isRead: false
    }
  ]);

  // Handle Simulation Loop
  useEffect(() => {
    if (!simulationState.isRunning) return;

    const interval = setInterval(() => {
      // Update bus positions
      setBuses((prevBuses) => {
        const updated = updateBusPositions(
          prevBuses,
          routes,
          simulationState.speedMultiplier,
          simulationState.isTrafficSpikeActive
        );

        // Check get-down alerts
        if (activeGetDownAlerts.length > 0) {
          activeGetDownAlerts.forEach((alert) => {
            const { updatedAlert, newNotification } = evaluateGetDownAlert(alert, updated, routes);
            if (newNotification) {
              setNotifications((n) => [newNotification, ...n]);
            }
          });
        }

        // If selected bus is updated, keep selectedBus synced
        if (selectedBus) {
          const fresh = updated.find((b) => b.id === selectedBus.id);
          if (fresh) setSelectedBus(fresh);
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    simulationState.isRunning,
    simulationState.speedMultiplier,
    simulationState.isTrafficSpikeActive,
    activeGetDownAlerts,
    routes,
    selectedBus?.id
  ]);

  // Simulation Action Handlers
  const handleTogglePlay = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleChangeSpeed = (multiplier: number) => {
    setSimulationState((prev) => ({ ...prev, speedMultiplier: multiplier }));
  };

  const handleToggleTrafficSpike = () => {
    setSimulationState((prev) => {
      const next = !prev.isTrafficSpikeActive;
      if (next) {
        // Increase bus delays along GST Road
        setBuses((list) =>
          list.map((b) =>
            b.routeNumber === '21G' || b.routeNumber === '18'
              ? {
                  ...b,
                  delayMinutes: b.delayMinutes + 9,
                  predictedDelayMinutes: 14,
                  delayReasonEn: 'Severe traffic bottleneck spike triggered along Pallavaram / GST Road.'
                }
              : b
          )
        );
      }
      return { ...prev, isTrafficSpikeActive: next };
    });
  };

  const handleToggleRoadClosure = () => {
    setSimulationState((prev) => ({ ...prev, isRoadClosureActive: !prev.isRoadClosureActive }));
  };

  const handleToggleRain = () => {
    setSimulationState((prev) => ({ ...prev, isRainSimulated: !prev.isRainSimulated }));
  };

  const handleToggleBreakdown = () => {
    setSimulationState((prev) => {
      const next = !prev.isBusBreakdownSimulated;
      setBuses((list) =>
        list.map((b) =>
          b.routeNumber === '21G'
            ? {
                ...b,
                status: next ? 'breakdown' : 'on_time',
                speedKmh: next ? 0 : 32,
                stationaryDurationMinutes: next ? 9 : 0
              }
            : b
        )
      );
      return { ...prev, isBusBreakdownSimulated: next };
    });
  };

  const handleToggleCrowd = () => {
    setSimulationState((prev) => {
      const next = !prev.isHighCrowdSimulated;
      setBuses((list) =>
        list.map((b) => ({
          ...b,
          occupancy: next ? 'very_high' : b.occupancy === 'very_high' ? 'low' : 'medium'
        }))
      );
      return { ...prev, isHighCrowdSimulated: next };
    });
  };

  // Demo Scenario: Tambaram to Guindy (Feature 39)
  const handleTriggerDemoScenario = () => {
    setActiveTab('map');
    const bus = buses.find((b) => b.routeNumber === '21G') || buses[0];
    const r = routes.find((x) => x.routeNumber === '21G') || routes[0];
    setSelectedBus(bus);
    setSelectedRoute(r);
    setSelectedStop(null);
    setHighlightCorridor('GST Road');

    // Add notification
    const demoNotif: SmartNotification = {
      id: `demo-${Date.now()}`,
      severity: 'orange',
      titleEn: 'Demo Mode: Tambaram ⇄ Guindy Active',
      titleTa: 'செயல்முறை: தாம்பரம் ⇄ கிண்டி இயக்கப்படுகிறது',
      messageEn: 'Comparing Bus 21G (Fastest), Bus 18 (Low Crowd), and Bus 500 (AC). Bottleneck detected near Pallavaram.',
      messageTa: 'பேருந்து 21G, 18, மற்றும் 500 ஒப்பீடு. பல்லாவரம் நெரிசல் கணக்கிடப்பட்டுள்ளது.',
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications((n) => [demoNotif, ...n]);
  };

  // Favorite toggle
  const handleToggleFavorite = (busId: string) => {
    setFavoriteBusIds((prev) =>
      prev.includes(busId) ? prev.filter((id) => id !== busId) : [...prev, busId]
    );
  };

  // Track Bus On Map
  const handleTrackBusOnMap = (bus: Bus) => {
    setSelectedBus(bus);
    const r = routes.find((route) => route.id === bus.routeId);
    if (r) {
      setSelectedRoute(r);
    }
    setActiveTab('map');
  };

  // Get-Down Alert handler
  const handleSetGetDownAlert = (bus: Bus, destStopId: string) => {
    const destStop = stops.find((s) => s.id === destStopId);
    const newAlert: ActiveGetDownAlert = {
      busId: bus.id,
      originStopId: bus.nextStopId || 'stop-tambaram',
      destinationStopId: destStopId,
      destinationNameEn: destStop?.nameEn || 'Destination',
      destinationNameTa: destStop?.nameTa || 'சேருமிடம்',
      stopsRemaining: 3,
      etaMinutes: 12,
      stage: 'in_transit'
    };
    setActiveGetDownAlerts((prev) => [...prev, newAlert]);
  };

  // Incident submission
  const handleSubmitIncident = (newIncident: TrafficIncident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    const notif: SmartNotification = {
      id: `notif-inc-${Date.now()}`,
      severity: newIncident.severity,
      titleEn: `New Alert: ${newIncident.titleEn}`,
      titleTa: `புதிய எச்சரிக்கை: ${newIncident.titleTa}`,
      messageEn: `Expected delay +${newIncident.expectedDelayMinutes}m on ${newIncident.roadName}.`,
      messageTa: `${newIncident.roadName} பகுதியில் +${newIncident.expectedDelayMinutes} நிமிட தாமதம்.`,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications((n) => [notif, ...n]);
  };

  const handleVerifyIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isVerified: true, verificationCount: i.verificationCount + 1 } : i))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 relative">
      {/* Photorealistic Bus Terminal & Road Backdrop */}
      <RealisticBusBackdrop theme={currentTheme} backdropMode={backdropMode} />

      {/* Top Navigation Header with Livery Selector */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'ta' : 'en'))}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSimulationDrawer={() => setIsSimDrawerOpen(true)}
        onTriggerDemoScenario={handleTriggerDemoScenario}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenHackathonDemo={() => setIsHackathonDemoOpen(true)}
        currentTheme={currentTheme}
        onChangeTheme={setCurrentTheme}
        backdropMode={backdropMode}
        onCycleBackdropMode={handleCycleBackdropMode}
      />

      {/* Iconic Dot-Matrix Bus Front Destination Board LED Ticker */}
      <RealisticLedBoard language={language} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative pb-14 md:pb-0 z-10">
        {/* Tab 1: Live Interactive Map & Side Intelligence Panel */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
            {/* Left/Sidebar Intelligence Column (Desktop 420px, mobile collapsible) */}
            <div className="w-full lg:w-[440px] xl:w-[480px] bg-slate-900/90 border-r border-slate-800/80 p-3 sm:p-4 overflow-y-auto shrink-0 flex flex-col gap-4 shadow-xl z-10">
              {/* If a Bus is selected, prioritize Bus Details Card */}
              {selectedBus ? (
                <BusDetailsCard
                  bus={selectedBus}
                  route={routes.find((r) => r.id === selectedBus.routeId) || null}
                  stops={stops}
                  incidents={incidents}
                  weatherRisks={WEATHER_RISK_ZONES}
                  onClose={() => setSelectedBus(null)}
                  onSelectStop={(stop) => setSelectedStop(stop)}
                  onSetGetDownAlert={handleSetGetDownAlert}
                  isFavorite={favoriteBusIds.includes(selectedBus.id)}
                  onToggleFavorite={() => handleToggleFavorite(selectedBus.id)}
                  language={language}
                />
              ) : selectedStop ? (
                /* If a Stop is selected, show Arrival Predictions */
                <StopDetailsCard
                  stop={selectedStop}
                  buses={buses}
                  routes={routes}
                  incidents={incidents}
                  onClose={() => setSelectedStop(null)}
                  onSelectBus={(bus) => setSelectedBus(bus)}
                  language={language}
                />
              ) : (
                /* Default view: Smart Corridor Comparison + Best time to travel */
                <>
                  {/* District & Fleet Quick Access Card */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 rounded-2xl shadow-lg flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {language === 'ta' ? 'அனைத்து தமிழ்நாடு பேருந்துகள்' : '38 Districts Fleet'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">
                        {language === 'ta' ? 'TNSTC • SETC • MTC ஆசனங்கள் நிலவரம்' : 'TNSTC • SETC • MTC Bus Availability'}
                      </h4>
                      <p className="text-[10px] text-slate-300">
                        {language === 'ta' ? 'மாவட்ட வாரிய விரைவுத் தேடல் & ஆசன முன்பதிவு' : 'District-wise categorised availability & free seats'}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('availability')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all shrink-0 flex items-center gap-1"
                    >
                      <span>{language === 'ta' ? 'திறக்க' : 'Explore'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  <SearchRouteComparison
                    buses={buses}
                    routes={routes}
                    stops={stops}
                    incidents={incidents}
                    onSelectBus={(b) => setSelectedBus(b)}
                    onSelectRoute={(r) => setSelectedRoute(r)}
                    onTriggerDemoScenario={handleTriggerDemoScenario}
                    language={language}
                  />

                  <BestTimeToTravelCard language={language} />

                  {/* Active Simulation Status Banner */}
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>
                        {language === 'ta'
                          ? 'நேரலை ஜிபிஎஸ் டிராக்கிங் இயங்குகிறது'
                          : 'Live GPS Telemetry Active (1s interval)'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsSimDrawerOpen(true)}
                      className="text-amber-400 font-bold hover:underline"
                    >
                      {language === 'ta' ? 'அமைப்புகள்' : 'Tweak Sim'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Main Interactive Map Viewport */}
            <div className="flex-1 h-full relative">
              {/* Floating Driver Cockpit & Instrument Cluster */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto w-[92%] sm:w-auto">
                <BusCockpitCluster
                  bus={selectedBus}
                  language={language}
                  isOpen={isCockpitOpen}
                  onToggleOpen={() => setIsCockpitOpen((prev) => !prev)}
                />
              </div>

              <MapContainer
                buses={buses}
                routes={routes}
                stops={stops}
                incidents={incidents}
                weatherRisks={WEATHER_RISK_ZONES}
                eventZones={EVENT_TRAFFIC_ZONES}
                selectedBus={selectedBus}
                selectedRoute={selectedRoute}
                selectedStop={selectedStop}
                onSelectBus={(bus) => setSelectedBus(bus)}
                onSelectStop={(stop) => setSelectedStop(stop)}
                language={language}
                highlightCorridor={highlightCorridor}
              />
            </div>
          </div>
        )}

        {/* Tab 1.5: 38 Districts & Fleet Availability (TNSTC • SETC • MTC) */}
        {activeTab === 'availability' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            <DistrictBusAvailabilityExplorer
              buses={buses}
              routes={routes}
              language={language}
              onSelectBus={(bus) => {
                setSelectedBus(bus);
                const r = routes.find((route) => route.id === bus.routeId);
                if (r) setSelectedRoute(r);
              }}
              onTrackOnMap={handleTrackBusOnMap}
              onOpenGetDownAlert={(bus) => handleSetGetDownAlert(bus, bus.nextStopId || 'stop-tambaram')}
              favoriteBusIds={favoriteBusIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {/* Tab 2: Route Planner & Detailed Comparison */}
        {activeTab === 'routes' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full flex flex-col gap-5">
            <SearchRouteComparison
              buses={buses}
              routes={routes}
              stops={stops}
              incidents={incidents}
              onSelectBus={(b) => {
                setSelectedBus(b);
                setActiveTab('map');
              }}
              onSelectRoute={(r) => {
                setSelectedRoute(r);
                setActiveTab('map');
              }}
              onTriggerDemoScenario={handleTriggerDemoScenario}
              language={language}
            />

            <BestTimeToTravelCard language={language} />
          </div>
        )}

        {/* Tab 3: Dedicated Smart Traffic Alert Feed */}
        {activeTab === 'alerts' && (
          <TrafficAlertsDrawer
            incidents={incidents}
            weatherRisks={WEATHER_RISK_ZONES}
            eventZones={EVENT_TRAFFIC_ZONES}
            onSelectIncident={(inc) => {
              setActiveTab('map');
            }}
            language={language}
          />
        )}

        {/* Tab 4: Admin & Operational Command Center */}
        {activeTab === 'admin' && (
          <AdminDashboard
            buses={buses}
            routes={routes}
            incidents={incidents}
            onVerifyIncident={handleVerifyIncident}
            onSelectBus={(bus) => {
              setSelectedBus(bus);
              setActiveTab('map');
            }}
            language={language}
          />
        )}

        {/* Tab 5: Night & Women Safety Mode */}
        {activeTab === 'safety' && (
          <SafetyModeView
            stops={stops}
            routes={routes}
            buses={buses}
            onSelectStop={(stop) => {
              setSelectedStop(stop);
              setActiveTab('map');
            }}
            language={language}
          />
        )}

        {/* Tab 6: AI Transport Intelligence & Fleet Analytics (Phase 18) */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            <AiTransportAnalytics
              buses={buses}
              routes={routes}
              stops={stops}
              incidents={incidents}
              language={language}
            />
          </div>
        )}
      </div>

      {/* Floating Modals & Drawers */}
      <IncidentReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIncident={handleSubmitIncident}
        language={language}
      />

      <SimulationControls
        isOpen={isSimDrawerOpen}
        onClose={() => setIsSimDrawerOpen(false)}
        simulationState={simulationState}
        onTogglePlay={handleTogglePlay}
        onChangeSpeed={handleChangeSpeed}
        onToggleTrafficSpike={handleToggleTrafficSpike}
        onToggleRoadClosure={handleToggleRoadClosure}
        onToggleRain={handleToggleRain}
        onToggleBreakdown={handleToggleBreakdown}
        onToggleCrowd={handleToggleCrowd}
        language={language}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        }
        onClearAll={() => setNotifications([])}
        language={language}
      />

      {/* AI Travel Assistant Dialog (Phase 8 & Voice Search Phase 12) */}
      <AiTravelAssistant
        buses={buses}
        routes={routes}
        stops={stops}
        incidents={incidents}
        selectedBus={selectedBus}
        onSelectBus={(bus) => {
          setSelectedBus(bus);
          const r = routes.find((route) => route.id === bus.routeId);
          if (r) setSelectedRoute(r);
          setActiveTab('map');
          setIsAssistantOpen(false);
        }}
        onSelectRoute={(route) => {
          setSelectedRoute(route);
          setActiveTab('map');
          setIsAssistantOpen(false);
        }}
        language={language}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Hackathon Demo Presentation Scenario Modal (Phase 20) */}
      <HackathonDemoModal
        isOpen={isHackathonDemoOpen}
        onClose={() => setIsHackathonDemoOpen(false)}
        language={language}
        onSelectBus={(bus) => {
          setSelectedBus(bus);
          setActiveTab('map');
        }}
      />

      {/* Responsive Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSimControls={() => setIsSimDrawerOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        language={language}
      />
    </div>
  );
}
