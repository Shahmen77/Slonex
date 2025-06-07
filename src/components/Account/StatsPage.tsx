import React from 'react';
import { Stats } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface StatsPageProps {
  stats: Stats;
}

export function StatsPage({ stats }: StatsPageProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{t('account.stats')}</h2>
        <p className="text-muted-foreground mt-1">{t('account.statsDesc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('account.totalChecks')}</h3>
          <p className="text-3xl font-bold">{stats.totalChecks}</p>
        </div>
        <div className="card-glass p-6 rounded-2xl flex flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">{t('account.successfulChecks')}</h3>
          <p className="text-3xl font-bold text-green-500">{stats.successfulChecks}</p>
        </div>
        <div className="card-glass p-6 rounded-2xl flex flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">{t('account.failedChecks')}</h3>
          <p className="text-3xl font-bold text-red-500">{stats.failedChecks}</p>
        </div>
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('account.averageTime')}</h3>
          <p className="text-3xl font-bold">{stats.averageResponseTime}с</p>
        </div>
      </div>

      {stats.lastCheckDate && (
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('account.lastCheck')}</h3>
          <p className="text-muted-foreground">
            {new Date(stats.lastCheckDate).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
} 