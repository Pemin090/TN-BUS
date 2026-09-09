import React, { useState } from 'react';
import { Bus, BusRoute, BusStop, Language } from '../types';
import { Shield, PhoneCall, Share2, Check, Video, Lightbulb, Heart, Eye } from 'lucide-react';
import { translations } from '../i18n/translations';

interface SafetyModeViewProps {
  stops: BusStop[];
  routes: BusRoute[];
  buses: Bus[];
  onSelectStop: (stop: BusStop) => void;
  language: Language;
}

export const SafetyModeView: React.FC<SafetyModeViewProps> = ({
  stops,
  routes,
  buses,
  onSelectStop,
  language
}) => {
  const t = translations[language];
  const [copiedLink, setCopiedLink] = useState(false);

  const safeStops = stops.filter((s) => s.isSafeNightStop);
  const pinkRoutes = routes.filter((r) => r.isWomenPinkBus);

  const handleShareTrip = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto text-slate-100 flex flex-col gap-5">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-black text-white">
              {language === 'ta' ? 'இரவுப் பாதுகாப்பு & மகளிர் பயணம்' : 'Night Safety & Women Transit Mode'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            {language === 'ta'
              ? 'வெளிச்சம் உள்ள சிசிடிவி பேருந்து நிறுத்தங்கள், மகளிர் இலவச பிங்க் பேருந்துகள் மற்றும் அவசர உதவி எண்கள்.'
              : 'Verified well-lit stops with CCTV coverage, MTC free ordinary buses for women, and instant trip sharing.'}
          </p>
        </div>

        {/* SOS Emergency Helpline */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:1091"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS 1091 (Women Helpline)</span>
          </a>
          <button
            onClick={handleShareTrip}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? (language === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Live Link Copied!') : (language === 'ta' ? 'பயணத்தைப் பகிர்' : 'Share Live Trip')}</span>
          </button>
        </div>
      </div>

      {/* Emergency Speed Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Tamil Nadu Police</div>
            <div className="text-lg font-black text-white">112</div>
          </div>
          <a href="tel:112" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold">
            Call
          </a>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">MTC Commuter Helpline</div>
            <div className="text-lg font-black text-white">1800-425-4424</div>
          </div>
          <a href="tel:18004254424" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold">
            Call
          </a>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">TN Emergency Medical</div>
            <div className="text-lg font-black text-white">108</div>
          </div>
          <a href="tel:108" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold">
            Call
          </a>
        </div>
      </div>

      {/* Women Free Bus (Pink Bus) Section */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
              <Heart className="w-4 h-4 fill-pink-400" />
            </span>
            <h3 className="font-extrabold text-sm text-white">
              {language === 'ta' ? 'மகளிர் கட்டணமில்லா விடியல் பயணப் பேருந்துகள் (MTC Pink Bus)' : 'Women Free Travel Transit Network (Ordinary White/Pink Buses)'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
            Zero Fare for Women
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {language === 'ta'
            ? 'தமிழ்நாடு அரசின் விடியல் பயணத் திட்டத்தின் கீழ் பெண்கள், திருநங்கைகள் மற்றும் மாற்றுத்திறனாளிகளுக்கு கட்டணமில்லா பயணம் வழங்கும் பேருந்து வழித்தடங்கள்.'
            : 'Ordinary fare service corridors where women commuters travel free under the Government of Tamil Nadu Vidiyal Payanam initiative.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-1">
          {pinkRoutes.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-slate-950/80 border border-slate-800 hover:border-pink-500/60 rounded-xl transition-all flex items-center justify-between"
            >
              <div>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 font-black text-xs rounded border border-pink-500/40">
                  {r.routeNumber}
                </span>
                <div className="font-bold text-xs text-white mt-1">
                  {language === 'ta' ? r.originTa : r.origin} ⇄ {language === 'ta' ? r.destinationTa : r.destination}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Every {r.frequencyMinutes} mins</div>
              </div>
              <span className="text-xs font-bold text-pink-400">FREE</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Safe Night Bus Stops */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட இரவுப் பாதுகாப்பான பேருந்து நிறுத்தங்கள்' : 'Verified Safe Night Hubs (High Lighting & Surveillance)'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {safeStops.map((stop) => (
            <div
              key={stop.id}
              onClick={() => onSelectStop(stop)}
              className="p-3 bg-slate-950/80 border border-slate-800 hover:border-purple-500 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-white">
                    {language === 'ta' ? stop.nameTa : stop.nameEn}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    Safe Hub
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Routes: {stop.connectingRoutes.join(', ')}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Video className="w-3 h-3" />
                  <span>24/7 CCTV Active</span>
                </span>
                <span className="text-amber-400">High Lumens Lighting</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
