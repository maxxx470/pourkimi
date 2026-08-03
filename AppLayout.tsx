import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Layers,
  Tag,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { MobileNav } from './MobileNav';
import { AssistantWidget } from '../components/AssistantWidget';

// Sparkle starburst 8-branch SVG icon component
export const SparkleIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07l-2.83 2.83M7.76 16.24l-2.83 2.83M4.34 4.93l2.83 2.83m7.07 7.07l2.83 2.83" />
  </svg>
);

export interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate?: (path: string) => void;
  onNewProject?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  onNewProject,
}) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    const handleOpenAssistant = () => setIsAssistantOpen(true);
    window.addEventListener('open-assistant', handleOpenAssistant);
    return () => window.removeEventListener('open-assistant', handleOpenAssistant);
  }, []);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('metrio:sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('metrio:sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const handleItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  // Nav categories and items
  const mainNavigation = [
    { id: 'nav-dashboard', name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'nav-projects', name: 'Mes projets', path: '/dashboard/projects', icon: FolderOpen },
    { id: 'nav-news', name: 'Nouveautés', path: '/dashboard/news', icon: Sparkles },
  ];

  const libraryNavigation = [
    { id: 'nav-materiaux', name: 'Matériaux', path: '/materiaux', icon: Layers },
    { id: 'nav-mes-prix', name: 'Mes prix', path: '/materiaux', icon: Tag },
  ];

  const accountNavigation = [
    { id: 'nav-settings', name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
    { id: 'nav-subscription', name: 'Abonnement', path: '/dashboard/subscription', icon: CreditCard },
    { id: 'nav-notifications', name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ];

  const isItemActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/dashboard/projects')) return 'Mes projets';
    if (path.startsWith('/dashboard/news')) return 'Nouveautés';
    if (path.startsWith('/materiaux')) return 'Matériaux';
    if (path.startsWith('/dashboard/settings')) return 'Paramètres';
    if (path.startsWith('/dashboard/subscription')) return 'Abonnement';
    if (path.startsWith('/dashboard/notifications')) return 'Notifications';
    if (path.startsWith('/projects')) return 'Projet';
    if (path.startsWith('/analyse')) return 'Analyse';
    if (path.startsWith('/cahier')) return 'Cahier de calcul';
    if (path.startsWith('/dqe')) return 'DQE';
    if (path.startsWith('/devis')) return 'Devis';
    if (path.startsWith('/recap')) return 'Récapitulatif';
    if (path.startsWith('/variantes')) return 'Variantes';
    if (path.startsWith('/historique')) return 'Historique';
    return 'Métrio';
  };

  const renderNavSection = (title: string, items: typeof mainNavigation, forceExpanded = false) => {
    const collapsed = isCollapsed && !forceExpanded;
    return (
      <div className="mb-5">
        {!collapsed ? (
          <span className="px-3 block font-sans font-medium text-[12px] text-[#64748B] uppercase tracking-wider mb-2">
            {title}
          </span>
        ) : (
          <div className="my-2 border-t border-[#E2E8F0]" />
        )}
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isItemActive(item.path);
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.path)}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center ${
                    collapsed
                      ? 'w-10 h-10 justify-center mx-auto rounded-full'
                      : 'w-full gap-2.5 px-3.5 py-2 rounded-full'
                  } text-[14px] font-sans transition-all duration-200 active:scale-[0.97] cursor-pointer text-left ${
                    active
                      ? 'bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA]'
                      : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] font-normal'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderSidebarContent = (isMobile = false) => {
    const collapsed = isCollapsed && !isMobile;
    return (
      <div className="flex flex-col justify-between h-full py-1">
        {/* Top Header & Collapse Toggle */}
        <div className="flex-1 overflow-y-auto pr-0.5 scrollbar-none">
          {/* Toggle Collapse Button Header - ONLY on desktop */}
          {!isMobile && (
            <div className={`hidden md:flex items-center ${collapsed ? 'justify-center mb-3' : 'justify-between px-1 mb-4'}`}>
              {!collapsed && (
                <span className="font-sans font-medium text-[12px] text-[#64748B] uppercase tracking-wider">
                  Navigation
                </span>
              )}
              <button
                onClick={toggleCollapsed}
                title={collapsed ? 'Agrandir le menu' : 'Réduire le menu'}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] transition-all duration-200 active:scale-[0.97] cursor-pointer"
              >
                {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              </button>
            </div>
          )}

          {renderNavSection('Principal', mainNavigation, isMobile)}
          {renderNavSection('Bibliothèque', libraryNavigation, isMobile)}
          {renderNavSection('Compte', accountNavigation, isMobile)}
        </div>

        {/* Assistant & Logout pinned at bottom */}
        <div className="pt-3 border-t border-[#E2E8F0] mt-auto space-y-2">
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            title={collapsed ? 'Assistant' : undefined}
            className={`flex items-center ${
              collapsed
                ? 'w-10 h-10 justify-center mx-auto rounded-full'
                : 'w-full gap-2.5 px-3.5 py-2.5 rounded-full'
            } text-[14px] font-sans font-medium text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#EEF2FF]/80 transition-all duration-200 active:scale-[0.97] cursor-pointer text-left border border-[#4F46E5]/15`}
          >
            <MessageSquare size={18} className="flex-shrink-0" />
            {!collapsed && <span>Assistant</span>}
          </button>

          <button
            onClick={() => handleItemClick('/')}
            title={collapsed ? 'Déconnexion' : undefined}
            className={`flex items-center ${
              collapsed
                ? 'w-10 h-10 justify-center mx-auto rounded-full'
                : 'w-full gap-2.5 px-3.5 py-2.5 rounded-full'
            } text-[14px] font-sans font-medium text-[#DC2626] bg-[#FEF0EC]/80 hover:bg-[#FEF0EC] transition-all duration-200 active:scale-[0.97] cursor-pointer text-left border border-[rgba(220,38,38,0.1)]`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white text-[#1E293B] font-sans selection:bg-[#EEF2FF] selection:text-[#4F46E5] flex flex-col">
      {/* Topbar / Header */}
      <header className="w-full h-16 bg-white sticky top-0 z-50 border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between px-6 select-none flex-shrink-0">
        {/* Left side: Logo, Page Title */}
        <div className="flex items-center gap-4">
          {/* Logo Métrio — texte seul, sans icône */}
          <div
            onClick={() => handleItemClick('/dashboard')}
            className="flex items-center cursor-pointer select-none"
          >
            <span className="font-sans font-black text-[20px] tracking-tight text-[#1E293B]">
              METRIO
              <span className="text-[#E8442A]">.</span>
            </span>
          </div>

          {/* Active Page Title */}
          <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-[#E2E8F0] h-6">
            <h1 className="font-sans font-semibold text-[20px] text-[#1E293B]">
              {getPageTitle(currentPath)}
            </h1>
          </div>
        </div>

        {/* Right side: Ghost icons, Separator, Profile, Nouveau Projet CTA */}
        <div className="flex items-center gap-3">
          {/* Settings Ghost button — masqué en mobile, l'avatar donne déjà accès aux réglages */}
          <button
            onClick={() => handleItemClick('/dashboard/settings')}
            title="Paramètres"
            className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-transparent hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <Settings size={18} />
          </button>

          {/* Bell Notification Button */}
          <div className="relative">
            <button
              onClick={() => handleItemClick('/dashboard/notifications')}
              title="Notifications"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              <Bell size={18} />
            </button>
            {/* Red badge dot */}
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#DC2626',
                border: '1.5px solid #ffffff',
              }}
              className="absolute top-0 right-0 rounded-full"
            />
          </div>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-[#E2E8F0] mx-1" />

          {/* User Profile Info */}
          <div
            onClick={() => handleItemClick('/dashboard/settings')}
            className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-2 rounded-full hover:bg-[#F1F5F9] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#F1F5F9] border-2 border-[#E2E8F0] flex items-center justify-center flex-shrink-0 text-[#4F46E5] font-semibold text-[13px]">
              TK
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-sans font-medium text-[14px] text-[#1E293B] leading-tight">
                Thomas K.
              </span>
              <span className="font-sans font-normal text-[12px] text-[#64748B] leading-tight">
                Économiste
              </span>
            </div>
          </div>

          {/* Plan/Credits Status Badge */}
          <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#92400E] font-sans font-semibold text-[11px] select-none shadow-2xs">
            <span>1 projet restant</span>
          </div>
        </div>
      </header>

      {/* Layout Body Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Desktop (Fixed left static height with collapse support) */}
        <aside
          style={{
            width: isCollapsed ? '64px' : '220px',
          }}
          className="hidden md:flex flex-col flex-shrink-0 h-full p-3 select-none overflow-y-auto bg-white border-r border-[#E2E8F0] transition-all duration-200"
        >
          {renderSidebarContent(false)}
        </aside>

        {/* Main Content Area (Scrollable right side) */}
        <main className="flex-1 h-full overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 pb-28 md:pb-6">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Nav Bar (Mobile only) */}
      <MobileNav
        currentPath={currentPath}
        onNavigate={handleItemClick}
        onNewProject={onNewProject || (() => {})}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onLogout={() => handleItemClick('/')}
      />

      <AssistantWidget
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};
