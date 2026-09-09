import React from 'react';
import { Language } from '../types';
import { getBestTimeAdvice } from '../services/predictionEngine';
import { Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { translations } from '../i18n/translations';

interface BestTimeToTravelCardProps {
  language: Language;
}

export const BestTimeToTravelCard: React.FC<BestTimeToTravelCardProps> = ({ language }) => {
  const t = translations[language];
  const advice = getBestTimeAdvice();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-slate-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{language === 'ta' ? 'பயணிக்க உகந்த நேரம் (Best Time to Travel)' : 'Best Time to Travel & Crowd Trends'}</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold">AI Recommendation</span>
      </div>

      {/* Two Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">
              {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நேரம்' : 'Recommended Window'}
            </div>
            <div className="text-xs font-extrabold text-white mt-0.5">
              {language === 'ta' ? advice.bestWindowTa : advice.bestWindow}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">
              {language === 'ta' ? 'குறைந்த நெரிசல், சீரான வேகம்' : 'Minimal wait time, smooth cruising'}
            </div>
          </div>
        </div>

        <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase font-bold text-rose-300">
              {language === 'ta' ? 'தவிர்க்க வேண்டிய உச்ச நேரம்' : 'Avoid Peak Rush Window'}
            </div>
            <div className="text-xs font-extrabold text-white mt-0.5">
              {language === 'ta' ? advice.peakAvoidWindowTa : advice.peakAvoidWindow}
            </div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">
              {language === 'ta' ? '+28% கூடுதல் தாமதம் மற்றும் கடும் கூட்டம்' : '+28% delay spike & crowded buses'}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Hourly Pattern Bars */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
          {language === 'ta' ? 'மணிநேர போக்குவரத்து நெரிசல் வரைபடம்' : 'Hourly Congestion & Delay Curve'}
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 text-center">
          {advice.hourlyPattern.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-full bg-slate-950 rounded-t h-12 flex items-end justify-center p-0.5">
                <div
                  style={{ height: `${Math.min(100, h.delayMin * 4.5)}%` }}
                  className={`w-full rounded-sm transition-all ${
                    h.delayMin > 15
                      ? 'bg-rose-500'
                      : h.delayMin > 8
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  title={`${h.hour}: +${h.delayMin} min delay`}
                />
              </div>
              <span className="text-[9px] text-slate-400 font-semibold">{h.hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
