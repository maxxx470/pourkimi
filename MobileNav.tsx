import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Plus,
  Layers,
  Tag,
  Settings,
  CreditCard,
  Bell,
  MessageSquare,
  LogOut,
} from 'lucide-react';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onNewProject: () => void;
  onOpenAssistant?: () => void;
  onLogout?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPath,
  onNavigate,
  onNewProject,
  onOpenAssistant,
  onLogout,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreOpen]);

  const isHomeActive = currentPath === '/dashboard' || currentPath === '/';
  const isProjectsActive =
    currentPath.startsWith('/dashboard/projects') ||
    currentPath.startsWith('/projects') ||
    currentPath.startsWith('/cahier') ||
    currentPath.startsWith('/dqe') ||
    currentPath.startsWith('/devis') ||
    currentPath.startsWith('/recap') ||
    currentPath.startsWith('/variantes') ||
    currentPath.startsWith('/historique') ||
    currentPath.startsWith('/analyse');

  const isNewsActive = currentPath.startsWith('/dashboard/news');

  // "Plus" couvre tout ce qui n'est pas Dashboard / Projets / Nouveautés
  const isMoreActive =
    currentPath.startsWith('/materiaux') ||
    currentPath.startsWith('/dashboard/settings') ||
    currentPath.startsWith('/dashboard/subscription') ||
    currentPath.startsWith('/dashboard/notifications') ||
    currentPath.startsWith('/dashboard/account') ||
    currentPath.startsWith('/dashboard/profile');

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      isActive: isHomeActive,
    },
    {
      id: 'projects',
      label: 'Projets',
      path: '/dashboard/projects',
      icon: FolderOpen,
      isActive: isProjectsActive,
    },
    {
      id: 'news',
      label: 'Nouveautés',
      path: '/dashboard/news',
      icon: Sparkles,
      isActive: isNewsActive,
    },
  ];

  // Le reste des pages, auparavant dans le menu hamburger du header
  const moreItems = [
    { id: 'materiaux', label: 'Matériaux', path: '/materiaux', icon: Layers },
    { id: 'mes-prix', label: 'Mes prix', path: '/materiaux', icon: Tag },
    { id: 'settings', label: 'Paramètres', path: '/dashboard/settings', icon: Settings },
    { id: 'subscription', label: 'Abonnement', path: '/dashboard/subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ];

  const handleMoreNavigate = (path: string) => {
    setIsMoreOpen(false);
    onNavigate(path);
  };

  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-end gap-2.5 max-w-full">
        {/* Floating Pill Container */}
        <nav
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderColor: 'rgba(226, 232, 240, 0.9)',
          }}
          className="rounded-full border p-1.5 flex items-center gap-1 shadow-[0_8px_30px_rgba(15,23,42,0.12)] font-['Urbanist']"
        >
          {navItems.map((item) => {
            const isActive = item.isActive;
            const Icon = item.icon;

            if (isActive) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#4F46E5] text-white font-['Urbanist'] font-semibold text-[13px] shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <Icon size={18} className="text-white shrink-0" />
                  <span className="whitespace-nowrap tracking-tight">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.path)}
                title={item.label}
                aria-label={item.label}
                className="flex items-center justify-center p-2.5 rounded-full text-[#71717A] hover:text-[#1E293B] hover:bg-[#F1F5F9]/60 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Icon size={19} className="text-[#71717A] shrink-0" />
              </button>
            );
          })}

          {/* Bouton "Plus" - remplace l'ancien bouton Compte, ouvre le dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              title="Plus"
              aria-label="Plus"
              className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                isMoreActive || isMoreOpen
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-[#71717A] hover:text-[#1E293B] hover:bg-[#F1F5F9]/60'
              }`}
            >
              <Plus
                size={19}
                className={`shrink-0 transition-transform duration-200 ${isMoreOpen ? 'rotate-45' : 'rotate-0'}`}
              />
            </button>

            {/* Dropdown avec le reste des pages */}
            {isMoreOpen && (
              <div
                className="absolute bottom-full right-0 mb-3 w-[220px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.16)] border border-[#E2E8F0] p-1.5 z-[60] animate-[dropdownEnter_180ms_cubic-bezier(0.23,1,0.32,1)_forward]"
              >
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentPath.startsWith(item.path);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleMoreNavigate(item.path)}
                      className={`w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[14px] font-medium transition-colors duration-150 cursor-pointer active:bg-[#F1F5F9] ${
                        active ? 'text-[#4F46E5] bg-[#EEF2FF]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {onOpenAssistant && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      onOpenAssistant();
                    }}
                    className="w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[14px] font-medium text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors duration-150 cursor-pointer"
                  >
                    <MessageSquare size={18} className="shrink-0" />
                    <span>Assistant</span>
                  </button>
                )}

                {onLogout && (
                  <>
                    <div className="my-1 border-t border-[#E2E8F0]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[14px] font-medium text-[#DC2626] hover:bg-[#FEF0EC] transition-colors duration-150 cursor-pointer"
                    >
                      <LogOut size={18} className="shrink-0" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Separate Round Plus Button — Nouveau projet */}
        <button
          type="button"
          onClick={() => {
            setIsPressed(true);
            onNewProject();
            setTimeout(() => setIsPressed(false), 250);
          }}
          title="Nouveau projet"
          aria-label="Nouveau projet"
          style={{
            backgroundColor: '#4F46E5',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
          }}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-[#4338CA] cursor-pointer shrink-0 ${
            isPressed ? 'scale-90 rotate-90' : 'scale-100 rotate-0'
          }`}
        >
          <Plus size={22} className="text-white transition-transform duration-200" />
        </button>
      </div>

      <style>{`
        @keyframes dropdownEnter {
          from { opacity: 0; transform: translateY(6px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
