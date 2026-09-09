import React from 'react';
import { Language, BusLiveryTheme } from '../types';
import { translations } from '../i18n/translations';
import { Bell, PlayCircle, Shield, AlertTriangle, BarChart3, Sliders, Globe, Bus, Image as ImageIcon } from 'lucide-react';
import { BusLiverySelector } from './BusLiverySelector';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  activeTab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability';
  onSelectTab: (tab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability') => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenReportModal: () => void;
  onOpenSimulationDrawer: () => void;
  onTriggerDemoScenario: () => void;
  currentTheme: BusLiveryTheme;
  onChangeTheme: (theme: BusLiveryTheme) => void;
  backdropMode: 'cinematic' | 'subtle' | 'road_only';
  onCycleBackdropMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenReportModal,
  onOpenSimulationDrawer,
  onTriggerDemoScenario,
  currentTheme,
  onChangeTheme,
  backdropMode,
  onCycleBackdropMode
}) => {
  const t = translations[language];

  // Livery-specific header glow
  const liveryBorderGlow = {
    all: 'border-slate-800/80',
    tnstc: 'border-emerald-500/40 shadow-[0_4px_20px_rgba(5,150,105,0.15)]',
    setc: 'border-rose-500/40 shadow-[0_4px_20px_rgba(225,29,72,0.15)]',
    mtc: 'border-blue-500/40 shadow-[0_4px_20px_rgba(37,99,235,0.15)]',
    pink: 'border-pink-500/40 shadow-[0_4px_20px_rgba(219,39,119,0.15)]'
  }[currentTheme];

  return (
    <header className={`w-full bg-slate-950/90 border-b backdrop-blur-md px-4 py-2 z-30 sticky top-0 flex items-center justify-between gap-3 shadow-xl transition-all duration-500 ${liveryBorderGlow}`}>
      {/* Brand & Emblem */}
      <div className="flex items-center gap-2.5">
        {/* Tamil Nadu State Transit Emblem Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Bus className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-display font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>{language === 'ta' ? 'தமிழ்நாடு பேருந்து நேரலை' : 'TN Bus Traffic Alert & Arrival'}</span>
            </h1>
            <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
              MTC / TNSTC / SETC
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block font-sans">
            {language === 'ta'
              ? 'தமிழ்நாடு முழுவதும் நேரலை வருகைக் கணிப்பு & 3D போக்குவரத்து நுண்ணறிவு தளம்'
              : 'Real-time 3D transit intelligence & predictive arrivals across all Tamil Nadu corridors'}
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs">
        <button
          onClick={() => onSelectTab('map')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'map'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ta' ? 'வரைபடம் & நேரலை' : 'Live Map'}
        </button>
        <button
          onClick={() => onSelectTab('availability')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'availability'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow ring-1 ring-emerald-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>{language === 'ta' ? '38 மாவட்டங்கள் & பேருந்துகள்' : '38 Districts & Fleet'}</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
            TNSTC/SETC
          </span>
        </button>
        <button
          onClick={() => onSelectTab('routes')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'routes'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ta' ? 'வழித்தட ஒப்பீடு' : 'Route Compare'}
        </button>
        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'alerts'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ta' ? 'எச்சரிக்கைகள்' : 'Traffic Alerts'}
        </button>
        <button
          onClick={() => onSelectTab('admin')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'admin'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ta' ? 'நிர்வாக மையம்' : 'Admin Center'}
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Realistic Livery Switcher */}
        <BusLiverySelector
          currentTheme={currentTheme}
          onChangeTheme={onChangeTheme}
          language={language}
        />

        {/* Realistic Background Ambience Toggle */}
        <button
          onClick={onCycleBackdropMode}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs rounded-xl transition-all"
          title={`Background: ${backdropMode.toUpperCase()} (Click to toggle Cinematic Terminal, Subtle Depth, or Road Only)`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden xl:inline text-[11px] font-mono">
            {backdropMode === 'cinematic' ? 'Terminal' : backdropMode === 'subtle' ? 'Subtle' : 'Road'}
          </span>
        </button>

        {/* Run Tambaram -> Guindy Demo Button */}
        <button
          onClick={onTriggerDemoScenario}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
          title="Simulate Tambaram to Guindy route comparison and Pallavaram bottleneck"
        >
          <PlayCircle className="w-4 h-4 fill-slate-950 text-amber-400" />
          <span>{language === 'ta' ? 'செயல்முறை' : 'Demo'}</span>
        </button>

        {/* Report Incident */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
          title="Report Accident, Breakdown, or Flooding"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{language === 'ta' ? 'தடை' : 'Report'}</span>
        </button>

        {/* Simulation Controls */}
        <button
          onClick={onOpenSimulationDrawer}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition-colors"
          title="Simulation Engine (Rain, Traffic Spikes, Breakdown)"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{language === 'ta' ? 'மாதிரி' : 'Sim'}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-colors"
          title="Switch Language / மொழியை மாற்றுக"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
