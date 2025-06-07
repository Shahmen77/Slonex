import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { User, Check, Stats } from '../../types';
import { ProfilePage } from './ProfilePage';
import { StatsPage } from './StatsPage';
import { DataPage } from './DataPage';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../client/api';

function AccountSecurityPage() {
  const { t, currentLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // TODO: заменить на реальный API вызов
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setSuccess('');
    setTimeout(() => {
      setCodeSent(true);
      setSuccess(t('account.success'));
      setIsSending(false);
    }, 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    setError('');
    setSuccess('');
    setTimeout(() => {
      setSuccess(t('account.success'));
      setOldPassword('');
      setNewPassword('');
      setCode('');
      setIsChanging(false);
    }, 1000);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch">
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left bg-transparent rounded-3xl p-0 md:p-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-2">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.2"><path d="M12 3L4 6v5c0 5.25 3.75 10.5 8 12 4.25-1.5 8-6.75 8-12V6l-8-3z"/><path d="M12 3v18"/></svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-1" style={{letterSpacing: '-0.03em'}}>{currentLanguage === 'ru' ? 'Безопасность аккаунта' : t('account.security')}</h2>
          {currentLanguage === 'ru' ? (
            <>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md mb-1">Смените пароль для защиты вашего профиля. Подтверждение через e-mail.</p>
              <span className="text-xs md:text-sm block mt-2 text-muted-foreground">Ваши данные защищены и не передаются третьим лицам</span>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md mb-1">{t('account.securityDesc')}</p>
              <span className="text-xs md:text-sm block mt-2 text-muted-foreground">{t('account.securityNote')}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center md:items-start bg-white/80 dark:bg-card/80 rounded-3xl shadow-xl p-6 md:p-10 border border-border w-full max-w-xl mx-auto">
        <form className="space-y-5 w-full" onSubmit={handleChangePassword}>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">{currentLanguage === 'ru' ? 'Email' : t('account.email')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#f6fafd] border border-[#e5eaf2] rounded-xl px-4 py-3 text-base placeholder:text-[#b0b8c9]" placeholder={currentLanguage === 'ru' ? 'Введите ваш email' : t('account.email_placeholder')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <label className="block text-sm font-semibold mb-1 text-foreground">{currentLanguage === 'ru' ? 'Старый пароль' : t('Old password')}</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full h-[48px] px-5 py-3 bg-[#f6fafd] border border-[#e5eaf2] rounded-2xl text-[18px] placeholder:text-[#b0b8c9] min-w-0" placeholder="••••••••" />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <label className="block text-sm font-semibold mb-1 text-foreground">{currentLanguage === 'ru' ? 'Новый пароль' : t('New password')}</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full h-[48px] px-5 py-3 bg-[#f6fafd] border border-[#e5eaf2] rounded-2xl text-[18px] placeholder:text-[#b0b8c9] min-w-0" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full mt-2">
            <div className="flex flex-col flex-1 min-w-0">
              <label className="block text-sm font-semibold mb-1 text-foreground whitespace-nowrap">{currentLanguage === 'ru' ? 'Код из e-mail' : t('Code from e-mail')}</label>
              <input value={code} onChange={e => setCode(e.target.value)} required className="w-full h-[48px] px-5 py-3 bg-[#f6fafd] border border-[#e5eaf2] rounded-2xl text-[16px] placeholder:text-[#b0b8c9] min-w-0" placeholder={currentLanguage === 'ru' ? '6 цифр' : '6 digits'} />
            </div>
            <div className="flex items-end flex-1 min-w-0">
              <button type="button" onClick={handleSendCode} disabled={isSending || !email} className="w-full h-[48px] rounded-2xl text-[16px] font-semibold bg-gradient-to-r from-[#2563eb] to-[#478bff] text-white font-bold border-none flex items-center justify-center gap-1 hover:from-[#478bff] hover:to-[#2563eb] transition-colors duration-150 shadow-none">
                {isSending ? (currentLanguage === 'ru' ? 'Отправка...' : t('account.sending')) : (currentLanguage === 'ru' ? 'Получить код' : t('account.get_code'))}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isChanging} className="w-full flex items-center justify-center gap-2 font-bold shadow-lg text-lg h-[48px] rounded-xl bg-gradient-to-r from-[#2563eb] to-[#478bff] text-white mt-8 mb-0">
            {isChanging ? (currentLanguage === 'ru' ? 'Отправка...' : t('account.sending')) : (currentLanguage === 'ru' ? 'Сменить пароль' : t('Change password'))}
          </button>
          {success && <div className="text-green-600 text-sm text-center font-medium">{success}</div>}
          {error && <div className="text-destructive text-sm text-center font-medium">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export function AccountPage() {
  const { t, currentLanguage } = useLanguage();
  const [currentTab, setCurrentTab] = useState('profile');
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
    firstName: 'John',
    lastName: 'Doe',
    phone: '+7 (999) 545-72-63'
  });
  const [stats, setStats] = useState<Stats>({
    totalChecks: 150,
    successfulChecks: 120,
    failedChecks: 30,
    averageResponseTime: 2.5,
    lastCheckDate: new Date().toISOString()
  });
  const [checks, setChecks] = useState<Check[]>([
    {
      id: '1',
      userId: '1',
      type: 'security',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result: { score: 85 }
    }
  ]);
  const navigate = useNavigate();

  const handleUpdateProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">{t('account.profile')}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <div className="md:col-span-1">
            <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />
          </div>
          <div className="md:col-span-3 space-y-4 md:space-y-6">
            {currentTab === 'profile' && (
              <>
                <ProfilePage user={user} onUpdate={handleUpdateProfile} />
                <button
                  className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-colors"
                  onClick={handleLogout}
                >
                  {currentLanguage === 'ru' ? 'Выйти' : t('account.logout')}
                </button>
              </>
            )}
            {currentTab === 'security' && <AccountSecurityPage />}
            {currentTab === 'stats' && <StatsPage stats={stats} />}
            {currentTab === 'data' && <DataPage checks={checks} />}
          </div>
        </div>
      </div>
    </div>
  );
} 