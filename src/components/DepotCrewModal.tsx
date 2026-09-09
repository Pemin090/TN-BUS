import React from 'react';
import { Bus, Language } from '../types';
import { DepotAndCrewView } from './DepotAndCrewView';
import { X, Building2, UserCheck, ShieldCheck } from 'lucide-react';

interface DepotCrewModalProps {
  bus: Bus | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DepotCrewModal: React.FC<DepotCrewModalProps> = ({
  bus,
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen || !bus) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-display text-base">
              {bus.routeNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono-transit">
                  {bus.registrationNumber}
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold">
                  {bus.operatorCategory}
                  {bus.tnstcDivision ? ` • ${bus.tnstcDivision}` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ta'
                  ? 'பணிமனை, பணியில் உள்ள & ஓய்வு பணியாளர்கள் விவரம்'
                  : 'Depot Allocation, On-Duty & Off-Duty Crew Roster'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 font-sans">
          <DepotAndCrewView bus={bus} language={language} />
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ta'
                ? 'தமிழ்நாடு அரசுப் போக்குவரத்துக் கழகம் - நேரலை பணிப் பதிவேடு'
                : 'TNSTC / SETC / MTC Live Biometric Crew & Depot Registry'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700"
          >
            {language === 'ta' ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
