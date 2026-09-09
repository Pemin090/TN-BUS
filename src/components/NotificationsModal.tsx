import React from 'react';
import { SmartNotification, Language } from '../types';
import { X, Bell, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SmartNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  language: Language;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">
                {language === 'ta' ? 'ஸ்மார்ட் அறிவிப்புகள்' : 'Passenger Alert Center'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'ta' ? 'நிகழ்நேர போக்குவரத்து & இறங்கும் நிறுத்த எச்சரிக்கைகள்' : 'Real-time traffic, bus delays & get-down alerts'}
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

        {/* Quick action buttons */}
        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={onMarkAllAsRead}
            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அனைத்தும் படித்தவை' : 'Mark all read'}</span>
          </button>
          <button
            onClick={onClearAll}
            className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'நீக்கு' : 'Clear all'}</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              {language === 'ta' ? 'புதிய அறிவிப்புகள் எதுவும் இல்லை.' : 'No active alerts at the moment.'}
            </div>
          ) : (
            notifications.map((n) => {
              const borderColors = {
                green: 'border-emerald-500/40 bg-emerald-950/20',
                yellow: 'border-amber-500/40 bg-amber-950/20',
                orange: 'border-orange-500/40 bg-orange-950/20',
                red: 'border-rose-500/40 bg-rose-950/20',
                blue: 'border-sky-500/40 bg-sky-950/20'
              }[n.severity];

              return (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border ${borderColors} flex flex-col gap-1 transition-all`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      {n.severity === 'red' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      ) : n.severity === 'green' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span>{language === 'ta' ? n.titleTa : n.titleEn}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'ta' ? n.messageTa : n.messageEn}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
