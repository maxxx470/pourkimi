import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinOff,
  AlertOctagon,
  Wrench,
  Lock,
  ArrowLeft,
  LayoutDashboard,
  RefreshCw,
  ArrowUp,
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';

export type ErrorType = '404' | '500' | 'maint' | 'quota';

interface ErrorPageProps {
  defaultTab?: ErrorType;
  standalone?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  defaultTab = '404',
  standalone = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ErrorType>(defaultTab);

  const content = (
    <div className="max-w-xl mx-auto px-4 py-8 font-sans">
      {/* Tabs Selector for previewing all error states */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] mb-8 bg-white pb-0">
        <button
          type="button"
          onClick={() => setActiveTab('404')}
          style={{
            backgroundColor: activeTab === '404' ? '#F8FAFC' : 'transparent',
            color: activeTab === '404' ? '#4F46E5' : '#475569',
            borderBottomColor: activeTab === '404' ? '#F8FAFC' : 'transparent',
          }}
          className={`px-3.5 py-2 rounded-t-lg font-sans font-bold text-[12px] border border-transparent transition-all cursor-pointer ${
            activeTab === '404' ? 'border-[#E2E8F0] -mb-[1px]' : ''
          }`}
        >
          404
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('500')}
          style={{
            backgroundColor: activeTab === '500' ? '#F8FAFC' : 'transparent',
            color: activeTab === '500' ? '#4F46E5' : '#475569',
            borderBottomColor: activeTab === '500' ? '#F8FAFC' : 'transparent',
          }}
          className={`px-3.5 py-2 rounded-t-lg font-sans font-bold text-[12px] border border-transparent transition-all cursor-pointer ${
            activeTab === '500' ? 'border-[#E2E8F0] -mb-[1px]' : ''
          }`}
        >
          500
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('maint')}
          style={{
            backgroundColor: activeTab === 'maint' ? '#F8FAFC' : 'transparent',
            color: activeTab === 'maint' ? '#4F46E5' : '#475569',
            borderBottomColor: activeTab === 'maint' ? '#F8FAFC' : 'transparent',
          }}
          className={`px-3.5 py-2 rounded-t-lg font-sans font-bold text-[12px] border border-transparent transition-all cursor-pointer ${
            activeTab === 'maint' ? 'border-[#E2E8F0] -mb-[1px]' : ''
          }`}
        >
          Maintenance
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quota')}
          style={{
            backgroundColor: activeTab === 'quota' ? '#F8FAFC' : 'transparent',
            color: activeTab === 'quota' ? '#4F46E5' : '#475569',
            borderBottomColor: activeTab === 'quota' ? '#F8FAFC' : 'transparent',
          }}
          className={`px-3.5 py-2 rounded-t-lg font-sans font-bold text-[12px] border border-transparent transition-all cursor-pointer ${
            activeTab === 'quota' ? 'border-[#E2E8F0] -mb-[1px]' : ''
          }`}
        >
          Quota atteint
        </button>
      </div>

      {/* 404 View */}
      {activeTab === '404' && (
        <div className="flex flex-col items-center text-center animate-fade-in py-6">
          <div
            style={{ backgroundColor: '#EEF2FF' }}
            className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-5"
          >
            <MapPinOff size={32} className="text-[#4F46E5]" />
          </div>

          <div className="font-sans font-extrabold text-[13px] tracking-widest text-[#4F46E5] uppercase mb-2">
            ERREUR 404
          </div>

          <h1 className="font-sans font-extrabold text-[22px] text-[#1E293B] tracking-tight mb-2">
            Page introuvable
          </h1>

          <p className="font-sans text-[13px] font-medium text-[#475569] max-w-sm leading-relaxed mb-6">
            Cette page n'existe pas ou a été déplacée. Vérifiez l'adresse ou retournez à votre tableau de bord.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-[38px] px-4 rounded-[9px] border border-[rgba(0,0,0,0.12)] bg-white text-[13px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Page précédente</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-[38px] px-4 rounded-[9px] text-white text-[13px] font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <LayoutDashboard size={14} />
              <span>Retour au dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* 500 View */}
      {activeTab === '500' && (
        <div className="flex flex-col items-center text-center animate-fade-in py-6">
          <div
            style={{ backgroundColor: '#FEF0EC' }}
            className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-5"
          >
            <AlertOctagon size={32} className="text-[#E8442A]" />
          </div>

          <div className="font-sans font-extrabold text-[13px] tracking-widest text-[#E8442A] uppercase mb-2">
            ERREUR 500
          </div>

          <h1 className="font-sans font-extrabold text-[22px] text-[#1E293B] tracking-tight mb-2">
            Une erreur est survenue
          </h1>

          <p className="font-sans text-[13px] font-medium text-[#475569] max-w-sm leading-relaxed mb-6">
            Nos équipes ont été notifiées automatiquement. Réessayez dans quelques instants.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="h-[38px] px-4 rounded-[9px] border border-[rgba(0,0,0,0.12)] bg-white text-[13px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <LayoutDashboard size={14} />
              <span>Retour au dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-[38px] px-4 rounded-[9px] text-white text-[13px] font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw size={14} />
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      )}

      {/* Maintenance View */}
      {activeTab === 'maint' && (
        <div className="flex flex-col items-center text-center animate-fade-in py-6">
          <div
            style={{ backgroundColor: '#FDF8EC' }}
            className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-5"
          >
            <Wrench size={32} className="text-[#D4960A]" />
          </div>

          <div className="font-sans font-extrabold text-[13px] tracking-widest text-[#D4960A] uppercase mb-2">
            MAINTENANCE
          </div>

          <h1 className="font-sans font-extrabold text-[22px] text-[#1E293B] tracking-tight mb-2">
            Métrio revient bientôt
          </h1>

          <p className="font-sans text-[13px] font-medium text-[#475569] max-w-sm leading-relaxed mb-6">
            Nous améliorons le service pour vous. L'application sera de retour d'ici quelques minutes.
          </p>

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
            className="p-4 w-full max-w-xs shadow-2xs text-center font-sans"
          >
            <div className="text-[12px] font-medium text-[#475569]">
              Retour estimé
            </div>
            <div className="font-black text-[20px] text-[#1E293B] mt-0.5">
              14h45
            </div>
          </div>
        </div>
      )}

      {/* Quota Atteint View */}
      {activeTab === 'quota' && (
        <div className="flex flex-col items-center text-center animate-fade-in py-6">
          <div
            style={{ backgroundColor: '#FEF0EC' }}
            className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-5"
          >
            <Lock size={32} className="text-[#E8442A]" />
          </div>

          <div className="font-sans font-extrabold text-[13px] tracking-widest text-[#E8442A] uppercase mb-2">
            QUOTA ATTEINT
          </div>

          <h1 className="font-sans font-extrabold text-[22px] text-[#1E293B] tracking-tight mb-2">
            Vous avez utilisé tout votre quota
          </h1>

          <p className="font-sans text-[13px] font-medium text-[#475569] max-w-sm leading-relaxed mb-6">
            Vos 10 projets de ce mois ont été utilisés. Passez au plan Studio pour continuer sans interruption.
          </p>

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
            className="p-4 w-full max-w-sm shadow-2xs text-left font-sans mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-medium text-[#475569]">
                Projets utilisés
              </span>
              <span className="font-black text-[12px] text-[#1E293B]">
                10 / 10
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden mb-2">
              <div className="h-full w-full bg-[#E8442A] rounded-full" />
            </div>

            <div className="text-[11px] font-medium text-[#475569] text-center">
              Renouvellement le 1er août 2026
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="h-[38px] px-4 rounded-[9px] border border-[rgba(0,0,0,0.12)] bg-white text-[13px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-2xs"
            >
              Attendre le renouvellement
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/subscription')}
              style={{ backgroundColor: '#4F46E5' }}
              className="h-[38px] px-4 rounded-[9px] text-white text-[13px] font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <ArrowUp size={14} />
              <span>Débloquer avec Studio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <AppLayout
      currentPath="/404"
      onNavigate={(path) => navigate(path)}
      onNewProject={() => navigate('/dashboard')}
    >
      {content}
    </AppLayout>
  );
};
