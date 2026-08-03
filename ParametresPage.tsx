import React, { useState, useRef } from 'react';
import { Upload, Check, Shield, User, Sliders, Building2, Lock, Smartphone, Save, X } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../../store/ProjectDataContext';

export const ParametresPage: React.FC = () => {
  const navigate = useNavigate();
  const { cabinetInfo, updateCabinetInfo } = useProjectData();
  const [activeTab, setActiveTab] = useState<'cabinet' | 'application' | 'profil' | 'securite'>('cabinet');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State - Application
  const [devise, setDevise] = useState('FCFA');
  const [unite, setUnite] = useState('metrique');
  const [langue, setLangue] = useState('fr');
  const [modeCalcul, setModeCalcul] = useState('mode_a');
  const [autoSave, setAutoSave] = useState(true);

  // Form State - Profil
  const [userName, setUserName] = useState('Amadou Diallo');
  const [userRole, setUserRole] = useState('Architecte DPLG / Gérant');
  const [userEmail, setUserEmail] = useState('a.diallo@diallo-archi.com');

  // Form State - Sécurité
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  // Feedback Toast
  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 2500);
  };

  return (
    <AppLayout
      currentPath="/dashboard/settings"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans relative">
        {/* Save Confirmation Toast */}
        {showSaveToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 60,
              backgroundColor: '#1E293B',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '10px 16px',
            }}
            className="flex items-center gap-2 shadow-2xl animate-fade-in text-[12px] font-semibold font-sans"
          >
            <Check size={14} style={{ color: '#12B76A' }} />
            <span>Modifications enregistrées avec succès</span>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Paramètres
          </div>
          <h1 className="font-sans font-black text-[22px] tracking-tight text-[#1E293B] leading-tight">
            Paramètres
          </h1>
          <p className="font-sans text-[12px] font-medium text-[#475569] mt-0.5">
            Gérez votre cabinet, l'application et votre sécurité
          </p>
        </div>

        {/* Tabs Row */}
        <div className="flex items-center gap-1.5 mb-6 overflow-x-auto scrollbar-none pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('cabinet')}
            style={{
              backgroundColor: activeTab === 'cabinet' ? '#4F46E5' : '#ffffff',
              color: activeTab === 'cabinet' ? '#ffffff' : '#475569',
              borderColor: activeTab === 'cabinet' ? '#4F46E5' : '#E2E8F0',
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold font-sans border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Building2 size={13} />
            <span>Mon cabinet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('application')}
            style={{
              backgroundColor: activeTab === 'application' ? '#4F46E5' : '#ffffff',
              color: activeTab === 'application' ? '#ffffff' : '#475569',
              borderColor: activeTab === 'application' ? '#4F46E5' : '#E2E8F0',
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold font-sans border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Sliders size={13} />
            <span>Application</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            style={{
              backgroundColor: activeTab === 'profil' ? '#4F46E5' : '#ffffff',
              color: activeTab === 'profil' ? '#ffffff' : '#475569',
              borderColor: activeTab === 'profil' ? '#4F46E5' : '#E2E8F0',
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold font-sans border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <User size={13} />
            <span>Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('securite')}
            style={{
              backgroundColor: activeTab === 'securite' ? '#4F46E5' : '#ffffff',
              color: activeTab === 'securite' ? '#ffffff' : '#475569',
              borderColor: activeTab === 'securite' ? '#4F46E5' : '#E2E8F0',
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold font-sans border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Shield size={13} />
            <span>Sécurité</span>
          </button>
        </div>

        {/* Tab 1: Mon Cabinet */}
        {activeTab === 'cabinet' && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
            className="p-5 max-w-2xl shadow-2xs font-sans"
          >
            <h2 className="font-sans font-bold text-[13px] text-[#1E293B] mb-3.5">
              Informations du cabinet
            </h2>

            {/* Logo Upload Box */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#1E293B] mb-1.5">
                Logo du cabinet
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        updateCabinetInfo({
                          ...cabinetInfo,
                          logoUrl: event.target.result as string,
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              {!cabinetInfo.logoUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: '#EEF2FF' }}
                  className="w-[48px] h-[48px] rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity border border-[#4F46E5]/20"
                  title="Cliquer pour télécharger un logo"
                >
                  <Upload size={18} className="text-[#4F46E5]" />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] p-2 rounded-xl w-fit">
                  <img
                    src={cabinetInfo.logoUrl}
                    alt="Logo cabinet"
                    className="w-10 h-10 object-cover rounded-lg border border-[#E2E8F0]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#1E293B]">Logo importé</span>
                    <button
                      type="button"
                      onClick={() => {
                        updateCabinetInfo({ ...cabinetInfo, logoUrl: null });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[10px] text-[#E8442A] hover:underline font-medium text-left cursor-pointer"
                    >
                      Supprimer le logo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Form */}
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Nom du cabinet
                  </label>
                  <input
                    type="text"
                    value={cabinetInfo.nom}
                    onChange={(e) => updateCabinetInfo({ ...cabinetInfo, nom: e.target.value })}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    value={cabinetInfo.email}
                    onChange={(e) => updateCabinetInfo({ ...cabinetInfo, email: e.target.value })}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={cabinetInfo.telephone}
                    onChange={(e) => updateCabinetInfo({ ...cabinetInfo, telephone: e.target.value })}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={cabinetInfo.adresse}
                    onChange={(e) => updateCabinetInfo({ ...cabinetInfo, adresse: e.target.value })}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#475569] leading-relaxed mb-4">
                Ces informations apparaissent dans l'en-tête de vos documents PDF et Excel exportés.
              </p>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-8 px-4 rounded-full text-white font-bold text-[12px] flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  <Save size={13} />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Application */}
        {activeTab === 'application' && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
            className="p-5 max-w-2xl shadow-2xs font-sans"
          >
            <h2 className="font-sans font-bold text-[13px] text-[#1E293B] mb-3.5">
              Préférences de l'application
            </h2>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Devise par défaut
                  </label>
                  <select
                    value={devise}
                    onChange={(e) => setDevise(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  >
                    <option value="FCFA">FCFA (XOF)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Unités de mesure
                  </label>
                  <select
                    value={unite}
                    onChange={(e) => setUnite(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  >
                    <option value="metrique">Système Métrique (m, m², m³)</option>
                    <option value="imperial">Système Impérial (ft, sq ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Langue d'interface
                  </label>
                  <select
                    value={langue}
                    onChange={(e) => setLangue(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  >
                    <option value="fr">Français (France)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Mode de tarification par défaut
                  </label>
                  <select
                    value={modeCalcul}
                    onChange={(e) => setModeCalcul(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  >
                    <option value="mode_a">Mode A (Prix unitaires)</option>
                    <option value="mode_b">Mode B (Prix au m²)</option>
                  </select>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="pt-2 pb-4 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                <div>
                  <span className="block text-[12px] font-bold text-[#1E293B]">
                    Sauvegarde automatique en direct
                  </span>
                  <span className="block text-[11px] text-[#475569]">
                    Synchroniser immédiatement les calculs lors de vos éditions
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSave(!autoSave)}
                  style={{
                    backgroundColor: autoSave ? '#4F46E5' : '#E4E4E7',
                  }}
                  className="w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer"
                >
                  <div
                    style={{
                      transform: autoSave ? 'translateX(20px)' : 'translateX(0)',
                    }}
                    className="w-4 h-4 rounded-full bg-white transition-transform shadow-2xs"
                  />
                </button>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-8 px-4 rounded-full text-white font-bold text-[12px] flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  <Save size={13} />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Profil */}
        {activeTab === 'profil' && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
            className="p-5 max-w-2xl shadow-2xs font-sans"
          >
            <h2 className="font-sans font-bold text-[13px] text-[#1E293B] mb-3.5">
              Profil utilisateur
            </h2>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-black text-[16px] border border-[#4F46E5]/30">
                AD
              </div>
              <div>
                <h3 className="font-bold text-[13px] text-[#1E293B]">{userName}</h3>
                <p className="text-[11px] text-[#475569]">{userRole}</p>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Rôle / Fonction
                  </label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Email personnel de connexion
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-8 px-4 rounded-full text-white font-bold text-[12px] flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  <Save size={13} />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Sécurité */}
        {activeTab === 'securite' && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
            className="p-5 max-w-2xl shadow-2xs font-sans"
          >
            <h2 className="font-sans font-bold text-[13px] text-[#1E293B] mb-3.5 flex items-center gap-2">
              <Lock size={15} className="text-[#4F46E5]" />
              <span>Changer le mot de passe</span>
            </h2>

            <form onSubmit={handleSave}>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      height: '34px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '7px',
                    }}
                    className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        height: '34px',
                        border: '1px solid rgba(0,0,0,0.10)',
                        borderRadius: '7px',
                      }}
                      className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        height: '34px',
                        border: '1px solid rgba(0,0,0,0.10)',
                        borderRadius: '7px',
                      }}
                      className="w-full px-2.5 text-[12px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2FA Section */}
              <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-[#1E293B]">
                      Double authentification (2FA)
                    </span>
                    <span className="block text-[11px] text-[#475569]">
                      Sécurisez l'accès à votre compte via SMS ou application d'authentification
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  style={{
                    backgroundColor: twoFactor ? '#4F46E5' : '#E4E4E7',
                  }}
                  className="w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer shrink-0"
                >
                  <div
                    style={{
                      transform: twoFactor ? 'translateX(20px)' : 'translateX(0)',
                    }}
                    className="w-4 h-4 rounded-full bg-white transition-transform shadow-2xs"
                  />
                </button>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  style={{ backgroundColor: '#4F46E5' }}
                  className="h-8 px-4 rounded-full text-white font-bold text-[12px] flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  <Save size={13} />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
