import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { Alert } from '../../components/ui/Alert';

export const AbonnementPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2800);
  };

  return (
    <AppLayout
      currentPath="/dashboard/subscription"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans relative">
        {/* Toast Feedback */}
        {showToast && (
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
            <span>{showToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full inline-block font-sans mb-1.5">
            Abonnement
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
            Choisissez votre plan
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
            Débloquez plus de projets et de fonctionnalités
          </p>
        </div>

        {/* Current Plan Banner */}
        <div
          style={{
            backgroundColor: '#EEF2FF',
            border: '1px solid rgba(108,94,207,0.2)',
            borderRadius: '12px',
          }}
          className="p-3.5 sm:px-5 sm:py-3.5 mb-5 flex items-center justify-between shadow-2xs font-sans"
        >
          <div className="text-[12px] font-semibold text-[#5348A8]">
            Plan actuel
          </div>
          <div className="font-extrabold text-[14px] text-[#4F46E5]">
            Découverte — 1 projet
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <span
            className={`text-[12px] font-bold font-sans transition-colors ${
              !isAnnual ? 'text-[#1E293B]' : 'text-[#475569]'
            }`}
          >
            Mensuel
          </span>

          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              backgroundColor: '#4F46E5',
            }}
            className="w-[40px] h-[22px] rounded-full p-[2px] relative cursor-pointer transition-all hover:ring-2 hover:ring-[#4F46E5]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
          >
            <div
              style={{
                transform: isAnnual ? 'translateX(18px)' : 'translateX(0)',
              }}
              className="w-[18px] h-[18px] rounded-full bg-white shadow-xs transition-transform duration-200 hover:shadow-md"
            />
          </button>

          <span
            className={`text-[12px] font-bold font-sans transition-colors ${
              isAnnual ? 'text-[#1E293B]' : 'text-[#475569]'
            }`}
          >
            Annuel
          </span>

          <span
            style={{
              backgroundColor: '#EDFAF3',
              color: '#0A7A47',
            }}
            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide font-sans ml-1"
          >
            Économisez 20%
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Card 1: Studio */}
          <div
            style={{
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
            }}
            className="p-4 sm:p-5 relative flex flex-col justify-between font-sans shadow-2xs hover:border-[#4F46E5]/30 transition-all"
          >
            <div>
              <h3 className="font-extrabold text-[15px] text-[#1E293B] font-sans">
                Studio
              </h3>
              <p className="text-[11px] text-[#475569] font-medium mb-3">
                Pour les grands cabinets
              </p>

              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="font-black text-[26px] text-[#1E293B] tracking-tight font-sans">
                  {isAnnual ? '240 000' : '25 000'}
                </span>
                <span className="text-[11px] font-semibold text-[#475569]">
                  FCFA / {isAnnual ? 'an' : 'mois'}
                </span>
              </div>

              <div className="text-[11px] text-[#475569] line-through font-medium h-[18px] mb-3">
                {isAnnual ? '300 000 FCFA / an' : '30 000 FCFA / mois'}
              </div>

              <div className="h-[1px] bg-[#E2E8F0] my-3" />

              <div className="space-y-2 mb-4 text-[11px] font-medium text-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Projets illimités</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Export illimité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Support dédié</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Redirection vers la passerelle de paiement Studio...')}
              className="w-full h-[38px] rounded-full font-sans font-bold text-[12px] bg-white text-[#1E293B] border border-[rgba(0,0,0,0.12)] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all cursor-pointer shadow-2xs mt-2"
            >
              S'abonner
            </button>
          </div>

          {/* Card 2: Pro (Featured) */}
          <div
            style={{
              border: '1.5px solid #4F46E5',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 24px rgba(108,94,207,0.12)',
            }}
            className="p-4 sm:p-5 relative flex flex-col justify-between font-sans md:scale-[1.02] z-10"
          >
            <div
              style={{ backgroundColor: '#4F46E5' }}
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xs"
            >
              Le plus choisi
            </div>

            <div>
              <h3 className="font-extrabold text-[15px] text-[#1E293B] font-sans mt-1">
                Pro
              </h3>
              <p className="text-[11px] text-[#475569] font-medium mb-3">
                Pour les professionnels actifs
              </p>

              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="font-black text-[26px] text-[#1E293B] tracking-tight font-sans">
                  {isAnnual ? '115 000' : '12 000'}
                </span>
                <span className="text-[11px] font-semibold text-[#475569]">
                  FCFA / {isAnnual ? 'an' : 'mois'}
                </span>
              </div>

              <div className="text-[11px] text-[#475569] line-through font-medium h-[18px] mb-3">
                {isAnnual ? '144 000 FCFA / an' : '15 000 FCFA / mois'}
              </div>

              <div className="h-[1px] bg-[#E2E8F0] my-3" />

              <div className="space-y-2 mb-4 text-[11px] font-medium text-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>10 projets / mois</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Export illimité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Variantes de devis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Historique des versions</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Redirection vers la passerelle de paiement Pro...')}
              style={{ backgroundColor: '#4F46E5' }}
              className="w-full h-[38px] rounded-full font-sans font-bold text-[12px] text-white hover:opacity-95 transition-all cursor-pointer shadow-xs mt-2"
            >
              S'abonner
            </button>
          </div>

          {/* Card 3: Découverte */}
          <div
            style={{
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
            }}
            className="p-4 sm:p-5 relative flex flex-col justify-between font-sans shadow-2xs"
          >
            <div>
              <h3 className="font-extrabold text-[15px] text-[#1E293B] font-sans">
                Découverte
              </h3>
              <p className="text-[11px] text-[#475569] font-medium mb-3">
                Pour démarrer votre premier projet
              </p>

              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="font-black text-[26px] text-[#1E293B] tracking-tight font-sans">
                  Gratuit
                </span>
              </div>

              <div className="text-[11px] text-[#475569] font-medium h-[18px] mb-3 opacity-0">
                —
              </div>

              <div className="h-[1px] bg-[#E2E8F0] my-3" />

              <div className="space-y-2 mb-4 text-[11px] font-medium text-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>1 projet complet offert</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-[#12B76A] shrink-0" />
                  <span>Export PDF & Excel inclus</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              style={{ backgroundColor: '#EDFAF3', color: '#0A7A47' }}
              className="w-full h-[38px] rounded-full font-sans font-extrabold text-[12px] cursor-default mt-2"
            >
              Plan actuel
            </button>
          </div>
        </div>

        {/* Quota Alert */}
        <div className="mb-6">
          <Alert variant="warning">
            Vous avez utilisé votre unique projet du plan Découverte. Passez au Pro pour continuer sans interruption.
          </Alert>
        </div>

        {/* Payment History Card */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
          className="shadow-2xs font-sans"
        >
          <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-[13px] text-[#1E293B] flex items-center gap-2">
            <CreditCard size={15} className="text-[#4F46E5]" />
            <span>Historique des paiements</span>
          </div>

          <div className="divide-y divide-[rgba(0,0,0,0.06)]">
            <div className="px-4 py-3 flex items-center justify-between text-[12px]">
              <div>
                <div className="font-semibold text-[#1E293B]">
                  Export — Villa résidentielle R+2
                </div>
                <div className="text-[10px] text-[#475569] mt-0.5">
                  24 juillet 2026
                </div>
              </div>
              <div className="font-extrabold text-[#12B76A]">
                Offert (1er export)
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
