import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  Trash2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';

interface NotificationItem {
  id: string;
  type: 'analyse' | 'missing_data' | 'system' | 'quota';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'analyse',
    title: 'Analyse vision IA complétée',
    message: 'L\'extraction automatique pour "Villa résidentielle R+2 — Abidjan" est prête. Vous pouvez consulter les cotes et métrés.',
    date: 'Aujourd\'hui à 11:24',
    read: false,
    link: '/projects/1/cahier-de-calcul',
  },
  {
    id: 'n2',
    type: 'missing_data',
    title: 'Documents incomplets signalés',
    message: 'L\'épaisseur de chape est manquante sur la coupe A-A pour l\'École primaire de Kara.',
    date: 'Hier à 16:45',
    read: false,
    link: '/dashboard/projects/3',
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Bienvenue sur Métrio',
    message: 'Votre compte Découverte est actif. Profitez de 10 calculs automatisés de métré offerts ce mois-ci.',
    date: 'Il y a 3 jours',
    read: true,
  },
  {
    id: 'n4',
    type: 'quota',
    title: 'Mise à jour v1.2 disponible',
    message: 'Nouveau moteur de tarification estimative HT avec calcul des marges par lot.',
    date: 'Il y a 5 jours',
    read: true,
    link: '/dashboard/news',
  },
];

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredList = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout
      currentPath="/dashboard/notifications"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard/projects')}
    >
      <div className="space-y-6 font-sans max-w-4xl mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="font-bold text-[11px] text-[#475569] tracking-widest uppercase block mb-0.5">
              Actualités & Alertes
            </span>
            <div className="flex items-center gap-2.5">
              <h1 className="font-black text-[22px] tracking-tight text-[#1E293B] leading-none">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-[#4F46E5] text-white font-bold text-[11px] px-2 py-0.5 rounded-full">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#475569] mt-1">
              Retrouvez l'historique de vos analyses, alertes et mises à jour système
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="h-8 px-3 rounded-full border border-[#E2E8F0] bg-white text-[#1E293B] font-semibold text-[12px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Check size={14} className="text-[#12B76A]" />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] pb-2">
          <button
            onClick={() => setFilter('all')}
            style={{
              backgroundColor: filter === 'all' ? '#EEF2FF' : 'transparent',
              color: filter === 'all' ? '#4F46E5' : '#475569',
            }}
            className="px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer"
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              backgroundColor: filter === 'unread' ? '#EEF2FF' : 'transparent',
              color: filter === 'unread' ? '#4F46E5' : '#475569',
            }}
            className="px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer"
          >
            Non lues ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredList.length === 0 ? (
            <div className="bg-[#F8FAFC] border border-dashed border-[rgba(0,0,0,0.12)] rounded-2xl p-8 text-center">
              <Bell size={28} className="mx-auto text-[#A1A1AA] mb-2" />
              <h3 className="font-bold text-[14px] text-[#1E293B]">
                Aucune notification
              </h3>
              <p className="text-[12px] text-[#475569] mt-1">
                {filter === 'unread'
                  ? 'Vous avez lu toutes vos notifications.'
                  : 'Vous n\'avez aucune notification pour le moment.'}
              </p>
            </div>
          ) : (
            filteredList.map((notif) => {
              return (
                <div
                  key={notif.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    backgroundColor: notif.read ? '#FFFFFF' : '#EEF2FF/30',
                  }}
                  className={`rounded-xl p-4 flex items-start justify-between gap-3 transition-all ${
                    !notif.read ? 'border-l-4 border-l-[#4F46E5]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      style={{
                        backgroundColor: notif.type === 'missing_data' ? '#FEF0EC' : '#EEF2FF',
                        color: notif.type === 'missing_data' ? '#E8442A' : '#4F46E5',
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    >
                      {notif.type === 'missing_data' ? (
                        <AlertCircle size={16} />
                      ) : notif.type === 'analyse' ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Bell size={16} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[13.5px] text-[#1E293B]">
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                        )}
                      </div>
                      <p className="text-[12px] text-[#52525B] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="block text-[10.5px] text-[#475569] mt-1.5 font-medium">
                        {notif.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {notif.link && (
                      <button
                        onClick={() => {
                          markAsRead(notif.id);
                          navigate(notif.link!);
                        }}
                        style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                        className="h-7 px-2.5 rounded-lg text-[11.5px] font-bold flex items-center gap-1 hover:bg-[#4F46E5] hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Ouvrir</span>
                        <ArrowRight size={12} />
                      </button>
                    )}

                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] cursor-pointer"
                        title="Marquer comme lu"
                      >
                        <Check size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotif(notif.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#FEF0EC] hover:text-[#DC2626] text-[#475569] cursor-pointer transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};
