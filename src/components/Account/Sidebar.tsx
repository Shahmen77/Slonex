import React from 'react';
import { Button } from '../ui';
import { UserIcon, Shield, BarChart, Database } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const { t, currentLanguage } = useLanguage();
  const tabs = [
    { id: 'profile', label: currentLanguage === 'en' ? t('account.profile') : 'Профиль', icon: <UserIcon className="h-5 w-5" /> },
    { id: 'security', label: currentLanguage === 'en' ? t('account.security') : 'Безопасность', icon: <Shield className="h-5 w-5" /> },
    { id: 'stats', label: currentLanguage === 'en' ? t('account.stats') : 'Статистика', icon: <BarChart className="h-5 w-5" /> },
    { id: 'data', label: currentLanguage === 'en' ? t('account.history') : 'История', icon: <Database className="h-5 w-5" /> },
  ];

  return (
    <div className="md:block">
      {/* Мобильные табы */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-4 -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
              ${currentTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Десктопное меню */}
      <div className="hidden md:flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
              ${currentTab === tab.id
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
} 