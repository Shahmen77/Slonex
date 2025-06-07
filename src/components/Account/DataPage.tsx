import React from 'react';
import { Check } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface DataPageProps {
  checks: Check[];
}

export function DataPage({ checks }: DataPageProps) {
  const { t } = useLanguage();
  const { currentLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{t('account.history')}</h2>
        <p className="text-muted-foreground mt-1">{t('History')}</p>
      </div>

      <div className="card-glass p-6 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">{currentLanguage === 'ru' ? 'Тип' : t('account.type')}</th>
                <th className="text-left py-3 px-4">{currentLanguage === 'ru' ? 'Статус' : t('account.status')}</th>
                <th className="text-left py-3 px-4">{currentLanguage === 'ru' ? 'Дата' : t('account.date')}</th>
                <th className="text-left py-3 px-4">{currentLanguage === 'ru' ? 'Результат' : t('account.result')}</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((check) => (
                <tr key={check.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">{check.id}</td>
                  <td className="py-3 px-4">{check.type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${check.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {check.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(check.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    {check.result ? JSON.stringify(check.result) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 