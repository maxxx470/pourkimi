import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import {
  Save, CheckCircle2, Building2, SlidersHorizontal, User, Shield,
  Upload, Trash2, AlertTriangle, Moon, Sun, Monitor, ChevronRight
} from 'lucide-react';

/* ─── Types ─── */
interface CabinetData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  website: string;
  rccm: string;
  ifu: string;
  representative: string;
  representativeTitle: string;
  logo?: string;
}

interface AppPreferences {
  language: 'fr' | 'en';
  currency: 'XOF' | 'EUR' | 'USD';
  dateFormat: 'fr' | 'iso';
  theme: 'light' | 'dark' | 'system';
}

interface NotificationSettings {
  emailAnalysisDone: boolean;
  emailNewFeatures: boolean;
  emailMarketing: boolean;
  pushQuotaAlert: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface SettingsState {
  cabinet: CabinetData;
  preferences: AppPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
  profile: UserProfile;
}

/* ─── Default values ─── */
const defaultState: SettingsState = {
  cabinet: {
    name: '', email: '', phone: '', address: '', city: '',
    website: '', rccm: '', ifu: '', representative: '', representativeTitle: '',
  },
  preferences: { language: 'fr', currency: 'XOF', dateFormat: 'fr', theme: 'light' },
  notifications: { emailAnalysisDone: true, emailNewFeatures: true, emailMarketing: false, pushQuotaAlert: true },
  security: { twoFactorEnabled: false },
  profile: { name: '', email: '', avatar: undefined },
};

const STORAGE_KEY = 'metrio:settings';

/* ─── Component ─── */
export function SettingsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SettingsState>(defaultState);
  const [activeTab, setActiveTab] = useState<'cabinet' | 'app' | 'profile' | 'security'>('cabinet');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* Load */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch { /* ignore */ }
  }, []);

  /* Helpers */
  const updateCabinet = useCallback((field: keyof CabinetData, value: string) => {
    setData((p) => ({ ...p, cabinet: { ...p.cabinet, [field]: value } }));
    setSaved(false);
  }, []);

  const updatePreference = useCallback((field: keyof AppPreferences, value: string) => {
    setData((p) => ({ ...p, preferences: { ...p.preferences, [field]: value as any } }));
    setSaved(false);
  }, []);

  const updateNotification = useCallback((field: keyof NotificationSettings, value: boolean) => {
    setData((p) => ({ ...p, notifications: { ...p.notifications, [field]: value } }));
    setSaved(false);
  }, []);

  const updateProfile = useCallback((field: keyof UserProfile, value: string) => {
    setData((p) => ({ ...p, profile: { ...p.profile, [field]: value } }));
    setSaved(false);
  }, []);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setData((p) => ({ ...p, cabinet: { ...p.cabinet, logo: base64 } }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setData((p) => ({ ...p, profile: { ...p.profile, avatar: base64 } }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [data]);

  const handleDeleteAccount = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  /* Styles */
  const inputClass =
    'w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-[13px] text-[#1E293B] placeholder:text-[#A1A1AA] outline-none transition-colors focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/20';

  const tabs = [
    { id: 'cabinet' as const, label: 'Mon cabinet', icon: Building2 },
    { id: 'app' as const, label: 'Application', icon: SlidersHorizontal },
    { id: 'profile' as const, label: 'Profil', icon: User },
    { id: 'security' as const, label: 'Sécurité', icon: Shield },
  ];

  return (
    <AppLayout
      currentPath="/dashboard/settings"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="w-full animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]">Paramètres</p>
        <h3 className="font-urbanist text-[22px] font-extrabold tracking-tight text-[#1E293B]">
          Paramètres
        </h3>
        <p className="mt-1 text-[12px] text-[#475569]">
          Gérez votre cabinet, l'application et votre sécurité
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={
                'flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all cursor-pointer ' +
                (active
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'border border-black/10 bg-white text-[#475569] hover:border-black/20 hover:text-[#1E293B]')
              }
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── MON CABINET ── */}
      {activeTab === 'cabinet' && (
        <div className="rounded-2xl border border-black/5 bg-[#F8FAFC] p-6">
          <h2 className="mb-5 text-[14px] font-bold text-[#1E293B]">
            Informations du cabinet
          </h2>

          {/* Logo */}
          <div className="mb-6">
            <label className="mb-2 block text-[13px] font-medium text-[#1E293B]">Logo du cabinet</label>
            {data.cabinet.logo ? (
              <div className="flex items-center gap-4">
                <img
                  src={data.cabinet.logo}
                  alt="Logo"
                  className="h-16 w-16 rounded-xl object-contain border border-black/5 bg-white"
                />
                <button
                  onClick={() => updateCabinet('logo', '')}
                  className="flex items-center gap-1.5 rounded-full border border-[#E8442A]/20 px-3 py-2 text-[12px] font-semibold text-[#E8442A] transition-colors hover:bg-[#FEF0EC] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Supprimer
                </button>
              </div>
            ) : (
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-dashed border-black/15 bg-white transition-colors hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]/30">
                <Upload className="h-5 w-5 text-[#4F46E5]" strokeWidth={2} />
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Nom du cabinet</label>
              <input
                type="text"
                value={data.cabinet.name}
                onChange={(e) => updateCabinet('name', e.target.value)}
                placeholder="ex: Cabinet Architecture Diallo"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Email professionnel</label>
              <input
                type="email"
                value={data.cabinet.email}
                onChange={(e) => updateCabinet('email', e.target.value)}
                placeholder="ex: contact@diallo-archi.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Téléphone</label>
              <input
                type="tel"
                value={data.cabinet.phone}
                onChange={(e) => updateCabinet('phone', e.target.value)}
                placeholder="ex: +225 07 00 00 00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Adresse</label>
              <input
                type="text"
                value={data.cabinet.address}
                onChange={(e) => updateCabinet('address', e.target.value)}
                placeholder="ex: Cocody, Abidjan"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Ville</label>
              <input
                type="text"
                value={data.cabinet.city}
                onChange={(e) => updateCabinet('city', e.target.value)}
                placeholder="ex: Abidjan"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Site web</label>
              <input
                type="text"
                value={data.cabinet.website}
                onChange={(e) => updateCabinet('website', e.target.value)}
                placeholder="ex: www.diallo-archi.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">RCCM</label>
              <input
                type="text"
                value={data.cabinet.rccm}
                onChange={(e) => updateCabinet('rccm', e.target.value)}
                placeholder="ex: CI-ABJ-2018-B-12345"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">IFU</label>
              <input
                type="text"
                value={data.cabinet.ifu}
                onChange={(e) => updateCabinet('ifu', e.target.value)}
                placeholder="ex: 1234567890123"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Représentant</label>
              <input
                type="text"
                value={data.cabinet.representative}
                onChange={(e) => updateCabinet('representative', e.target.value)}
                placeholder="ex: Koffi Jean-Marc"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Titre du représentant</label>
              <select
                value={data.cabinet.representativeTitle}
                onChange={(e) => updateCabinet('representativeTitle', e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner...</option>
                <option value="Architecte DPLG">Architecte DPLG</option>
                <option value="Architecte DE">Architecte DE</option>
                <option value="Ingénieur Civil">Ingénieur Civil</option>
                <option value="Ingénieur BTP">Ingénieur BTP</option>
                <option value="Géomètre-Expert">Géomètre-Expert</option>
                <option value="Technicien">Technicien</option>
                <option value="Maître d'œuvre">Maître d&apos;œuvre</option>
              </select>
            </div>
          </div>

          <p className="mt-5 text-[12px] text-[#A1A1AA]">
            Ces informations apparaissent dans l&apos;en-tête de vos documents PDF et Excel exportés.
          </p>
        </div>
      )}

      {/* ── APPLICATION ── */}
      {activeTab === 'app' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-[#F8FAFC] p-6">
            <h2 className="mb-5 text-[14px] font-bold text-[#1E293B]">Langue et région</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Langue</label>
                <select
                  value={data.preferences.language}
                  onChange={(e) => updatePreference('language', e.target.value)}
                  className={inputClass}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Devise</label>
                <select
                  value={data.preferences.currency}
                  onChange={(e) => updatePreference('currency', e.target.value)}
                  className={inputClass}
                >
                  <option value="XOF">FCFA (XOF)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar (USD)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Format de date</label>
                <select
                  value={data.preferences.dateFormat}
                  onChange={(e) => updatePreference('dateFormat', e.target.value)}
                  className={inputClass}
                >
                  <option value="fr">JJ/MM/AAAA</option>
                  <option value="iso">AAAA-MM-JJ</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-[#F8FAFC] p-6">
            <h2 className="mb-5 text-[14px] font-bold text-[#1E293B]">Apparence</h2>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'light', label: 'Clair', icon: Sun },
                { value: 'dark', label: 'Sombre', icon: Moon },
                { value: 'system', label: 'Système', icon: Monitor },
              ] as const).map((t) => {
                const Icon = t.icon;
                const active = data.preferences.theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => updatePreference('theme', t.value)}
                    className={
                      'flex flex-col items-center gap-2 rounded-full border p-4 transition-all cursor-pointer ' +
                      (active
                        ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                        : 'border-black/10 bg-white text-[#475569] hover:border-black/20')
                    }
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                    <span className="text-[12px] font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-[#F8FAFC] p-6">
            <h2 className="mb-5 text-[14px] font-bold text-[#1E293B]">Notifications</h2>
            <div className="space-y-3">
              {([
                { key: 'emailAnalysisDone', label: 'Analyse terminée', desc: "Recevoir un email quand l'analyse IA est terminée" },
                { key: 'emailNewFeatures', label: 'Nouvelles fonctionnalités', desc: 'Être informé des mises à jour de Métrio' },
                { key: 'emailMarketing', label: 'Offres et promotions', desc: 'Recevoir nos offres spéciales et réductions' },
                { key: 'pushQuotaAlert', label: 'Alerte quota', desc: 'Être alerté quand vous approchez de votre limite de projets' },
              ] as const).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-[#1E293B]">{item.label}</p>
                    <p className="mt-0.5 text-[11px] text-[#A1A1AA]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => updateNotification(item.key, !data.notifications[item.key])}
                    className={
                      'relative h-6 w-11 rounded-full transition-colors cursor-pointer ' +
                      (data.notifications[item.key] ? 'bg-[#4F46E5]' : 'bg-[#E4E4E7]')
                    }
                  >
                    <span
                      className={
                        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ' +
                        (data.notifications[item.key] ? 'left-[22px]' : 'left-0.5')
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROFIL ── */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-black/5 bg-[#F8FAFC] p-6">
          <h2 className="mb-5 text-[14px] font-bold text-[#1E293B]">Profil utilisateur</h2>

          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            {data.profile.avatar ? (
              <img
                src={data.profile.avatar}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-[#EEF2FF]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF] ring-2 ring-[#EEF2FF]">
                <User className="h-7 w-7 text-[#4F46E5]" strokeWidth={1.5} />
              </div>
            )}
            <div className="flex gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-2 text-[12px] font-semibold text-[#4F46E5] transition-colors hover:bg-[#E8E4FF]">
                <Upload className="h-3.5 w-3.5" strokeWidth={2} />
                Changer
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              {data.profile.avatar && (
                <button
                  onClick={() => updateProfile('avatar', '')}
                  className="flex items-center gap-1.5 rounded-full border border-[#E8442A]/20 px-3 py-2 text-[12px] font-semibold text-[#E8442A] transition-colors hover:bg-[#FEF0EC] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Supprimer
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Nom complet</label>
              <input
                type="text"
                value={data.profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                placeholder="ex: Koffi Jean-Marc"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Adresse email</label>
              <input
                type="email"
                value={data.profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                placeholder="ex: contact@cabinet.ci"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SÉCURITÉ ── */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-[#F8FAFC] p-6">
            <h2 className="mb-5 text-[14px] font-bold text-[#1E293B]">Sécurité du compte</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <Shield className="h-5 w-5 text-[#4F46E5]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1E293B]">Authentification à deux facteurs</p>
                    <p className="text-[11px] text-[#A1A1AA]">Sécurisez votre compte avec un code supplémentaire</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setData((p) => ({ ...p, security: { ...p.security, twoFactorEnabled: !p.security.twoFactorEnabled } }));
                    setSaved(false);
                  }}
                  className={
                    'relative h-6 w-11 rounded-full transition-colors cursor-pointer ' +
                    (data.security.twoFactorEnabled ? 'bg-[#4F46E5]' : 'bg-[#E4E4E7]')
                  }
                >
                  <span
                    className={
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ' +
                      (data.security.twoFactorEnabled ? 'left-[22px]' : 'left-0.5')
                    }
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EBF3FF]">
                    <Shield className="h-5 w-5 text-[#2A7BDE]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1E293B]">Changer le mot de passe</p>
                    <p className="text-[11px] text-[#A1A1AA]">Mettez à jour votre mot de passe régulièrement</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[12px] font-semibold text-[#4F46E5] hover:underline cursor-pointer">
                  Modifier <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-[#E8442A]/15 bg-[#FEF0EC]/30 p-6">
            <h2 className="mb-4 text-[14px] font-bold text-[#E8442A]">Zone de danger</h2>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-full border border-[#E8442A]/20 px-4 py-2.5 text-[12px] font-semibold text-[#E8442A] transition-colors hover:bg-[#FEF0EC] cursor-pointer"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
                Supprimer mon compte
              </button>
            ) : (
              <div className="rounded-xl border border-[#E8442A]/20 bg-white p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E8442A]" strokeWidth={2} />
                  <div>
                    <p className="text-[13px] font-semibold text-[#1E293B]">
                      Êtes-vous sûr ? Cette action est irréversible.
                    </p>
                    <p className="mt-1 text-[11px] text-[#475569]">
                      Tous vos projets, devis et données seront définitivement supprimés.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        className="rounded-full bg-[#E8442A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#D13A22] cursor-pointer"
                      >
                        Oui, supprimer
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="rounded-full border border-black/10 px-4 py-2 text-[12px] font-semibold text-[#475569] transition-colors hover:bg-[#F1F5F9] cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {saved && (
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#12B76A]">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              Modifications enregistrées
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-[#5348A8] active:scale-[0.97] cursor-pointer"
        >
          <Save className="h-4 w-4" strokeWidth={2} />
          Enregistrer les modifications
        </button>
      </div>
    </div>
    </AppLayout>
  );
}
