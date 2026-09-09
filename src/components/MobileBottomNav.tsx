import React from 'react';
import { Language } from '../types';
import { MapPin, Route, AlertTriangle, Shield, BarChart3, Sliders, Building2 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability';
  onSelectTab: (tab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability') => void;
  onOpenSimControls: () => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSimControls,
  language
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 shadow-2xl">
      <button
        onClick={() => onSelectTab('map')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'map' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span>{language === 'ta' ? 'வரைபடம்' : 'Map'}</span>
      </button>

      <button
        onClick={() => onSelectTab('availability')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'availability' ? 'text-emerald-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span>{language === 'ta' ? '38 மாவட்டம்' : '38 Dist'}</span>
      </button>

      <button
        onClick={() => onSelectTab('routes')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'routes' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Route className="w-4 h-4" />
        <span>{language === 'ta' ? 'ஒப்பீடு' : 'Routes'}</span>
      </button>

      <button
        onClick={() => onSelectTab('alerts')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'alerts' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <AlertTriangle className="w-4 h-4" />
        <span>{language === 'ta' ? 'எச்சரிக்கை' : 'Alerts'}</span>
      </button>

      <button
        onClick={() => onSelectTab('safety')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'safety' ? 'text-purple-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span>{language === 'ta' ? 'பாதுகாப்பு' : 'Safety'}</span>
      </button>

      <button
        onClick={() => onSelectTab('admin')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'admin' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span>{language === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
      </button>

      <button
        onClick={onOpenSimControls}
        className="flex flex-col items-center gap-1 p-1 text-amber-400 hover:text-amber-300 transition-colors"
      >
        <Sliders className="w-4 h-4" />
        <span>{language === 'ta' ? 'மாதிரி' : 'Sim'}</span>
      </button>
    </div>
  );
};
