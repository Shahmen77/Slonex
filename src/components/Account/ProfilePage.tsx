import React, { useState } from 'react';
import { Button } from '../ui';
import { User } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface ProfilePageProps {
  user: User;
  onUpdate: (data: Partial<User>) => void;
}

export function ProfilePage({ user, onUpdate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || '',
  });
  const { t, currentLanguage } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{currentLanguage === 'en' ? t('account.profile') : 'Профиль'}</h2>
          <p className="text-muted-foreground mt-1">{currentLanguage === 'en' ? t('account.personalData') : 'Управление личными данными'}</p>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className="w-full md:w-auto"
        >
          {isEditing ? (currentLanguage === 'en' ? t('account.cancel') : 'Отмена') : (currentLanguage === 'en' ? t('account.edit') : 'Редактировать')}
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="card-glass p-6 md:p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  {currentLanguage === 'en' ? t('account.firstName') : 'Имя'}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  {currentLanguage === 'en' ? t('account.lastName') : 'Фамилия'}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {currentLanguage === 'en' ? t('account.email') : 'E-mail'}
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {currentLanguage === 'en' ? t('account.phone') : 'Телефон'}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  {currentLanguage === 'en' ? t('account.save') : 'Сохранить'}
                </Button>
              </div>
            )}
          </form>
        </div>

        <div className="card-glass p-6 md:p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">{currentLanguage === 'en' ? t('account.accountInfo') : 'Информация об аккаунте'}</h3>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{currentLanguage === 'en' ? t('account.userId') : 'ID пользователя'}</span>
              <span className="font-medium">{user.id}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{currentLanguage === 'en' ? t('account.role') : 'Роль'}</span>
              <span className="font-medium">{user.role}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{currentLanguage === 'en' ? t('account.registrationDate') : 'Дата регистрации'}</span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            {user.lastLogin && (
              <div className="flex flex-col md:flex-row justify-between py-3">
                <span className="text-muted-foreground">{currentLanguage === 'en' ? t('account.lastLogin') : 'Последний вход'}</span>
                <span className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 