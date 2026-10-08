import React from 'react';
import { Language } from '../types';
import { MapPin, Route, AlertTriangle, Shield, BarChart3, Sliders, Building2 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability' | 'analytics';
  onSelectTab: (tab: 'map' | 'routes' | 'alerts' | 'admin' | 'safety' | 'availability' | 'analytics') => void;
  onOpenSimControls: () => void;
  onOpenAssistant?: () => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSimControls,
  onOpenAssistant,
  language
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1 flex items-center justify-around text-[10px] text-slate-400 shadow-2xl">
      <button
        onClick={() => onSelectTab('map')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activeTab === 'map' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span>{language === 'ta' ? 'வரைபடம்' : 'Map'}</span>
      </button>

      <button
        onClick={() => onSelectTab('availability')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activeTab === 'availability' ? 'text-emerald-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span>{language === 'ta' ? '38 மாவட்டம்' : '38 Dist'}</span>
      </button>

      <button
        onClick={() => onSelectTab('routes')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activeTab === 'routes' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Route className="w-4 h-4" />
        <span>{language === 'ta' ? 'ஒப்பீடு' : 'Routes'}</span>
      </button>

      {onOpenAssistant && (
        <button
          onClick={onOpenAssistant}
          className="flex flex-col items-center gap-0.5 p-1 text-purple-400 hover:text-purple-300 font-bold transition-colors"
        >
          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 flex items-center justify-center text-[9px] text-white font-extrabold shadow">
            AI
          </span>
          <span>{language === 'ta' ? 'உதவி' : 'AI Help'}</span>
        </button>
      )}

      <button
        onClick={() => onSelectTab('analytics')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activeTab === 'analytics' ? 'text-purple-400 font-bold' : 'hover:text-white'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span>{language === 'ta' ? 'பகுப்பாய்வு' : 'Analytics'}</span>
      </button>

      <button
        onClick={() => onSelectTab('admin')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activeTab === 'admin' ? 'text-sky-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span>{language === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
      </button>

      <button
        onClick={onOpenSimControls}
        className="flex flex-col items-center gap-0.5 p-1 text-amber-400 hover:text-amber-300 transition-colors"
      >
        <Sliders className="w-4 h-4" />
        <span>{language === 'ta' ? 'மாதிரி' : 'Sim'}</span>
      </button>
    </div>
  );
};
