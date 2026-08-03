import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowUp, Bug } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';

export const NouveautesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout
      currentPath="/dashboard/news"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
        {/* Header */}
        <div className="mb-6 pb-2 border-b border-[#E2E8F0]">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full inline-block font-sans mb-1.5">
            Nouveautés
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight font-sans">
            Ce qui a changé sur Métrio
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 font-sans">
            Suivez les mises à jour et les fonctionnalités à venir
          </p>
        </div>

        {/* Soon Banner */}
        <div
          style={{
            backgroundColor: '#4F46E5',
            borderRadius: '14px',
          }}
          className="p-5 sm:p-6 text-white mb-10 relative overflow-hidden shadow-md font-sans"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full mb-2.5">
                <Sparkles size={12} className="text-white" />
                <span>Bientôt</span>
              </div>

              <h2 className="font-sans font-extrabold text-[16px] sm:text-[20px] text-white mb-1">
                Rendu 3D IA intégré
              </h2>

              <p className="text-[12px] sm:text-[13px] text-white/85 font-medium leading-relaxed">
                Générez une visualisation 3D de votre bâtiment directement depuis vos plans, sans quitter Métrio.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-white/90">
                <Sparkles size={24} />
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold bg-white/15 text-white px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
                  Application mobile
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold bg-white/15 text-white px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
                  Collaboration d'équipe
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Entry 1: Juillet 2026 */}
        <div className="mb-10 pb-8 border-b border-[#E2E8F0]">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-8">
            {/* Left Rail (Sticky on Desktop) */}
            <div>
              <div className="lg:sticky lg:top-6 lg:self-start">
                <div className="flex items-center gap-2 lg:block mb-3 lg:mb-0">
                  <span className="font-sans font-black text-[13px] sm:text-[14px] text-[#1E293B] block">
                    Juillet 2026
                  </span>
                  <div className="flex-1 h-[1px] bg-[#E2E8F0] lg:hidden" />
                  <div className="hidden lg:block w-[2px] h-10 bg-[#4F46E5]/30 mt-2 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right Column: Items */}
            <div className="space-y-1">
              {/* Item 1 */}
              <div className="flex gap-3 py-2.5 border-b border-[#E2E8F0]">
                <div className="w-7 h-7 rounded-lg bg-[#EDFAF3] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-[#0A7A47]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#0A7A47] mb-1">
                    Nouveau
                  </span>
                  <h3 className="font-sans font-bold text-[13px] text-[#1E293B] mb-0.5">
                    Variantes de devis
                  </h3>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Créez plusieurs versions d'un devis et comparez-les côte à côte.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3 py-2.5 border-b border-[#E2E8F0]">
                <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowUp size={13} className="text-[#2A7BDE]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EBF3FF] text-[#1A5BA8] mb-1">
                    Amélioré
                  </span>
                  <h3 className="font-sans font-bold text-[13px] text-[#1E293B] mb-0.5">
                    Cahier de calcul plus détaillé
                  </h3>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Chaque quantité affiche maintenant sa source et sa formule complète.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FDF8EC] flex items-center justify-center shrink-0 mt-0.5">
                  <Bug size={13} className="text-[#D4960A]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#FDF8EC] text-[#8A6200] mb-1">
                    Corrigé
                  </span>
                  <h3 className="font-sans font-bold text-[13px] text-[#1E293B] mb-0.5">
                    Upload de fichiers DWG
                  </h3>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Correction d'un bug empêchant la conversion de certains plans DWG en PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Entry 2: Juin 2026 */}
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-8">
            {/* Left Rail (Sticky on Desktop) */}
            <div>
              <div className="lg:sticky lg:top-6 lg:self-start">
                <div className="flex items-center gap-2 lg:block mb-3 lg:mb-0">
                  <span className="font-sans font-black text-[13px] sm:text-[14px] text-[#1E293B] block">
                    Juin 2026
                  </span>
                  <div className="flex-1 h-[1px] bg-[#E2E8F0] lg:hidden" />
                  <div className="hidden lg:block w-[2px] h-10 bg-[#4F46E5]/30 mt-2 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right Column: Items */}
            <div className="space-y-1">
              {/* Item 1 */}
              <div className="flex gap-3 py-2.5 border-b border-[#E2E8F0]">
                <div className="w-7 h-7 rounded-lg bg-[#EDFAF3] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-[#0A7A47]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#0A7A47] mb-1">
                    Nouveau
                  </span>
                  <h3 className="font-sans font-bold text-[13px] text-[#1E293B] mb-0.5">
                    Mode devis B — prix au m² par pièce
                  </h3>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Chiffrez vos projets avec un prix tout inclus par pièce, adapté aux pratiques locales.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EDFAF3] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-[#0A7A47]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#0A7A47] mb-1">
                    Nouveau
                  </span>
                  <h3 className="font-sans font-bold text-[13px] text-[#1E293B] mb-0.5">
                    Historique des versions
                  </h3>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Toutes vos modifications sont sauvegardées automatiquement et restaurables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
