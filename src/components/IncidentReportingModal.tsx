import React, { useState } from 'react';
import { IncidentType, TrafficIncident, Language, TrafficSeverity } from '../types';
import { X, AlertTriangle, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { translations } from '../i18n/translations';

interface IncidentReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIncident: (newIncident: TrafficIncident) => void;
  language: Language;
}

export const IncidentReportingModal: React.FC<IncidentReportingModalProps> = ({
  isOpen,
  onClose,
  onSubmitIncident,
  language
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const [type, setType] = useState<IncidentType>('traffic_jam');
  const [severity, setSeverity] = useState<TrafficSeverity>('orange');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roadLocation, setRoadLocation] = useState('GST Road, Pallavaram');
  const [expectedDelay, setExpectedDelay] = useState(10);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const incident: TrafficIncident = {
      id: `incident-user-${Date.now()}`,
      type,
      titleEn: title || `Reported: ${t.incidentTypes[type]} on ${roadLocation}`,
      titleTa: title || `பதிவு செய்யப்பட்டது: ${roadLocation} பகுதியில் ${t.incidentTypes[type]}`,
      descriptionEn: description || 'Passenger reported road incident requiring caution.',
      descriptionTa: description || 'பயணிகளால் பதிவு செய்யப்பட்ட சாலை நெரிசல் எச்சரிக்கை.',
      severity,
      location: { lat: 12.9675 + (Math.random() - 0.5) * 0.02, lng: 80.1491 + (Math.random() - 0.5) * 0.02 },
      roadName: roadLocation,
      affectedRouteNumbers: ['21G', '18', '500'],
      expectedDelayMinutes: expectedDelay,
      reportedTime: 'Just now',
      verificationCount: 1,
      isVerified: false,
      active: true
    };

    onSubmitIncident(incident);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {language === 'ta' ? 'சாலை நிகழ்வு / தடை பதிவு செய்க' : 'Report Road Incident or Jam'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ta'
                  ? 'பயணிகளுக்கான நேரலை போக்குவரத்து எச்சரிக்கை'
                  : 'Crowdsourced passenger transport & traffic alert system'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center gap-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="font-extrabold text-lg text-white">
              {language === 'ta' ? 'வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Incident Reported Successfully!'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'ta'
                ? 'உங்கள் பதிவு வரைபடத்தில் சேர்க்கப்பட்டு பிற பயணிகளுக்கு அறிவிக்கப்பட்டுள்ளது.'
                : 'Your report is now visible on the live map and contributing to ETA predictions.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Type selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {language === 'ta' ? 'நிகழ்வு வகை' : 'Incident Type'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1.5">
                {(['traffic_jam', 'accident', 'breakdown', 'flooding', 'road_blocked', 'unsafe'] as IncidentType[]).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                        type === item
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t.incidentTypes[item]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Location input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {language === 'ta' ? 'இடம் / சாலை' : 'Location / Corridor'}
              </label>
              <div className="relative mt-1">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={roadLocation}
                  onChange={(e) => setRoadLocation(e.target.value)}
                  placeholder="e.g. GST Road near Chromepet Flyover"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Severity and delay */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  {language === 'ta' ? 'தீவிரம்' : 'Severity Level'}
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as TrafficSeverity)}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="yellow">Yellow: Moderate Delay</option>
                  <option value="orange">Orange: Heavy Congestion</option>
                  <option value="red">Red: Severe Road Block</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  {language === 'ta' ? 'எதிர்பார்க்கும் தாமதம்' : 'Expected Delay (mins)'}
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={expectedDelay}
                  onChange={(e) => setExpectedDelay(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {language === 'ta' ? 'விளக்கம் (விருப்பத்தேர்வு)' : 'Description (Optional)'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details like lane block, stalled vehicle, water accumulation..."
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all mt-1"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ta' ? 'பதிவு சமர்ப்பிக்கவும்' : 'Submit Report'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
