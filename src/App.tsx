import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Globe,
  Mail,
  MapPin,
  Building,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Users,
  BarChart3,
  Database,
  Search,
  Info,
  Send,
  Sun,
  Moon,
  User as UserIcon,
  BarChart,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, authAPI, userAPI } from "./client/api";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui";
import ru from "./locales/ru";
import en from "./locales/en";
import { FeaturesSection } from "./components/FeaturesSection";
import { PlansSection } from "./components/PlansSection";
import { ContactSection } from "./components/ContactSection";
import { FeatureCard } from "./components/FeatureCard";
import { User, Check, Stats } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { useLanguage } from './hooks/useLanguage';
import { useGoogleLogin } from '@react-oauth/google';
import { AccountPage } from './components/Account/AccountPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleIcon from './components/GoogleIcon';
// import './google-login-custom.css';

// Добавить в начало файла:
declare global {
  interface Window {
    google?: any;
  }
}

interface NavItem {
  path: string;
  label: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Plan {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormState extends ContactFormData {
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
}

// Theme Context
const ThemeContext = React.createContext({ theme: 'light', setTheme: (theme: string) => {} });
export const useTheme = () => React.useContext(ThemeContext);

const languages = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

  const navItems = [
  { path: "/", label: "main" },
  { path: "/features", label: "features" },
  { path: "/plans", label: "pricing" },
  { path: "/contact", label: "contact" },
  { path: "/account", label: "account" },
];

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Переключить тему"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="ml-2"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const location = useLocation();
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/icons/darklogo.png' : '/icons/logo.png';
  return (
    <nav className="nav-glass border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          {/* Бургер-меню строго влево */}
          <div className="absolute left-0 top-0 h-full flex items-center md:static md:mr-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
              </div>
          {/* Логотип и название по центру на мобильных */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/" className="flex flex-col items-center md:flex-row md:items-center logo-group select-none cursor-pointer gap-1 md:gap-2">
              <span style={{width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <img src={logoSrc} style={{ width: '64px', height: '64px', objectFit: 'contain', display: 'block' }} alt="Slonex logo" />
              </span>
              <span className="text-[2.2rem] font-bold tracking-tight transition-colors cursor-pointer" style={{lineHeight: 1, display: 'flex', alignItems: 'center', marginTop: '1mm'}}>
                <span className="slonix-slon">Slon</span><span className="slonix-ix">ex</span>
            </span>
          </Link>
          </div>
          {/* Десктопное меню */}
          <div className="hidden md:flex items-center gap-10 ml-8">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                to={item.path}
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 relative
                    ${location.pathname === item.path
                      ? 'text-primary after:absolute after:left-2 after:right-2 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-primary after:shadow-md'
                      : 'text-foreground hover:text-primary'}
                  `}
                  style={{ minWidth: 100, display: 'inline-block', textAlign: 'center' }}
                >
                  {t(`nav.${item.label}`) || item.label}
              </Link>
              </motion.div>
            ))}
            <ThemeSwitcher />
            {/* Языковое меню */}
            <div className="relative lang-menu-root flex flex-col items-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border bg-[#f5f7fa] hover:bg-[#e8f0fe] shadow-md rounded-xl min-w-[8rem] justify-center transition-colors duration-150 py-3 min-h-[48px] text-lg font-bold"
                style={{ boxShadow: '0 2px 8px 0 rgba(30, 64, 175, 0.06)' }}
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
              >
                <span className="text-lg">{languages.find((lang) => lang.code === currentLanguage)?.flag}&nbsp;</span>
                <span className="inline">{languages.find((lang) => lang.code === currentLanguage)?.name}</span>
                </Button>
              {langMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[8rem] rounded-2xl border bg-[#f3f4f6] dark:bg-[#23272f] p-1 text-foreground shadow-lg z-50 transition-colors duration-200">
                {languages.map((language) => (
                    <button
                    key={language.code}
                      onClick={() => {
                        setCurrentLanguage(language.code);
                        setLangMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-2 py-3 min-h-[48px] rounded-xl text-left text-lg font-bold transition-colors duration-100
                        ${currentLanguage === language.code ? 'bg-primary/10 font-bold' : 'hover:bg-primary/10'}
                      `}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                    </button>
                ))}
          </div>
              )}
            </div>
          </div>
        </div>

        {/* Мобильное меню - выезжает сбоку */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-[340px] bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl z-50 md:hidden rounded-tr-3xl rounded-br-3xl"
              style={{boxShadow: '0 8px 40px 0 rgba(30,64,175,0.13)'}}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="text-lg font-semibold">Меню</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                      onClick={() => {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                        ${location.pathname === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-primary/5 hover:text-primary'}
                      `}
                    >
                      {t(`nav.${item.label}`) || item.label}
                  </Link>
                ))}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex gap-2">
                    {languages.map((language) => (
                        <Button
                        key={language.code}
                          variant={currentLanguage === language.code ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => setCurrentLanguage(language.code)}
                        >
                          <span className="text-lg">{language.flag}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function AnimatedInfoCard() {
  return (
    <div className="bg-white/90 dark:bg-card/80 rounded-2xl p-8 shadow-2xl w-full max-w-md backdrop-blur-md flex flex-col items-center">
      <div className="mb-2 flex items-center gap-2 text-xl font-bold">
        {/* Иконка i из фото 3 */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-adaptive"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="11" r="1.5" fill="currentColor"/><rect x="15" y="15" width="2" height="7" rx="1" fill="currentColor"/></svg>
        <span className="text-2xl font-extrabold text-black dark:text-white align-middle">Информация</span>
      </div>
      <div className="text-base text-foreground text-center font-medium mb-6">
        Аналитическая система для сбора информации о юридических лицах из всех открытых источников.
          </div>
      {/* Точная копия анимированной карточки */}
      <div className="w-64 h-64 modern-card rounded-3xl flex items-center justify-center relative animate-float-slow">
                <div className="relative">
          {/* Документ */}
          <div className="w-32 h-40 bg-white/90 rounded-lg shadow-2xl relative overflow-hidden flex flex-col justify-center items-center pt-7 pb-4">
            {/* Синяя полоса */}
            <div className="h-3 w-24 rounded-full bg-blue-400/70 mb-3 mx-auto" />
            {/* Тёмные полосы */}
            <div className="h-2 w-28 rounded bg-gray-500/80 mb-2 mx-auto" />
            <div className="h-2 w-24 rounded bg-gray-500/80 mb-2 mx-auto" />
            <div className="h-2 w-28 rounded bg-gray-500/80 mb-2 mx-auto" />
            <div className="h-2 w-28 rounded bg-gray-400/80 mb-2 mx-auto" />
            <div className="h-2 w-20 rounded bg-gray-400/80 mx-auto" />
                      </div>
          {/* Щит */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-100/80 dark:bg-blue-900/30 rounded-full flex items-center justify-center backdrop-blur-sm animate-float" style={{animationDelay: '0s'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-6 w-6 text-green-400">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            </svg>
                    </div>
          {/* График */}
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float-blue" style={{animationDelay: '1.6s'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column h-6 w-6 text-blue-400">
              <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
                  </div>
          {/* База данных */}
          <div className="absolute top-1/2 -left-8 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float" style={{animationDelay: '0.8s'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database h-5 w-5 text-purple-400">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
              <path d="M3 12A9 3 0 0 0 21 12"></path>
            </svg>
                </div>
              </div>
          </div>
      </div>
  );
}

function HeroSection() {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const telegramText = t('hero.telegram_bot') || 'Телеграм бот';
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [btnSize, setBtnSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setBtnSize({ width: rect.width, height: rect.height });
    }
  }, []);
  return (
    <section className="relative text-foreground py-32 md:py-44 overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80vw] h-[24vw] max-w-5xl rounded-full blur-3xl opacity-60 saturate-150 dark:opacity-40 dark:saturate-100 bg-gradient-to-br from-blue-200 via-blue-100 to-transparent dark:from-blue-900 dark:via-slate-900 dark:to-transparent z-0" />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[80vw] h-[60vw] max-w-5xl max-h-[700px] rounded-full blur-3xl opacity-40 dark:opacity-30 bg-gradient-to-br from-blue-200 via-white to-transparent dark:from-blue-900 dark:via-slate-900 dark:to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-16 z-10">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-10 leading-tight drop-shadow-lg">
            {t('hero.title').split(' ').map((word, i) => (
              <span key={i} style={{ display: 'block' }}>{word}</span>
            ))}
          </h1>
          <p className="text-2xl md:text-3xl mb-10 text-muted-foreground -medium max-w-xl mx-auto md:mx-0">{t('hero.description')}</p>
          <motion.a
            href="https://t.me/sherlock_TQX_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg bg-white transition-all duration-200 shadow-md w-full max-w-[90vw] md:max-w-fit md:w-auto mx-auto md:mx-0"
            style={{ willChange: 'transform', border: 'none' }}
            whileHover={{ scale: 1.045, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke={hovered ? '#2563eb' : '#111'} strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' className='mr-1 icon-adaptive' style={{ transition: 'stroke 0.25s' }}>
              <path d='M22 2L11 13'/><path d='M22 2L15 22L11 13L2 9L22 2Z'/>
            </svg>
            <span className="flex font-semibold text-lg" style={{letterSpacing: '0.01em', color: hovered ? '#2563eb' : '#111', transition: 'color 0.25s'}}>
              {telegramText}
            </span>
          </motion.a>
          </div>
              <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 flex items-center justify-center md:justify-end mt-12 md:mt-0"
        >
          <AnimatedDataBlock />
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedDataBlock() {
  // Более реалистичные вымышленные данные
  const fakeData = [
    { key: 'name', value: 'ООО "ТехноПлюс"' },
    { key: 'inn', value: '7701234567' },
    { key: 'ogrn', value: '1157746000000' },
    { key: 'kpp', value: '770101001' },
    { key: 'director', value: 'Петров Петр Петрович' },
    { key: 'email', value: 'info@technoplus.ru' },
    { key: 'phone', value: '+7 495 123-45-67' },
    { key: 'address', value: 'г. Москва, ул. Примерная, д. 1' },
    { key: 'status', value: 'Действующее' },
    { key: 'registration_date', value: '2015-04-15' },
  ];

  // Typewriter effect state
  const [typedLines, setTypedLines] = useState<string[]>(Array(fakeData.length).fill(''));
  const [isTyping, setIsTyping] = useState(true);
  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let lines = Array(fakeData.length).fill('');
    let timeout: number;
    let isUnmounted = false;
    function typeNext() {
      if (isUnmounted) return;
      if (currentLine >= fakeData.length) {
        setIsTyping(false);
        timeout = window.setTimeout(() => {
          setTypedLines(Array(fakeData.length).fill(''));
          setIsTyping(true);
        }, 1200);
        return;
      }
      const line = `  "${fakeData[currentLine].key}": "${fakeData[currentLine].value}",`;
      if (currentChar < line.length) {
        lines[currentLine] += line[currentChar];
        setTypedLines([...lines]);
        currentChar++;
        timeout = window.setTimeout(typeNext, 12 + Math.random() * 30);
      } else {
        currentLine++;
        currentChar = 0;
        timeout = window.setTimeout(typeNext, 120);
      }
    }
    if (isTyping) {
      typeNext();
    } else {
      timeout = window.setTimeout(() => {
        setTypedLines(Array(fakeData.length).fill(''));
        setIsTyping(true);
      }, 1200);
    }
    return () => {
      isUnmounted = true;
      clearTimeout(timeout);
    };
  }, [isTyping]);

  // Для анимации линий
  const lineCount = fakeData.length;
  const codeLineProgress = typedLines.map((line, i) => {
    const fullLine = i < fakeData.length ? `  "${fakeData[i].key}": "${fakeData[i].value}",` : '';
    return fullLine.length === 0 ? 0 : Math.min(1, line.length / fullLine.length);
  });
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center min-h-[340px] h-[340px]">
      {/* Удалён белый лист */}
      {/* Код поверх */}
      <div className="relative z-10 w-full">
        <div className="bg-[#101827]/95 rounded-xl p-6 shadow-xl text-[#4976d1] font-mono text-[15px] leading-normal min-h-[320px] h-[320px] w-full max-w-lg overflow-hidden">
          <span className="text-[#7ea6f7]">{'{'}</span>
          <ul>
            {typedLines.map((line, idx) => {
              const whiteKeys = [
                'name', 'inn', 'ogrn', 'kpp', 'registration_date',
                'director', 'email', 'phone', 'address', 'status'
              ];
              // Найти ключ в начале строки (даже если не полностью напечатан)
              const match = line.match(/^(\s*)"([a-zA-Z_]{0,20})"?(:?)/);
              if (match && whiteKeys.some(k => k.startsWith(match[2]))) {
                // Определяем, какой ключ сейчас печатается
                const key = whiteKeys.find(k => match[2] && k.startsWith(match[2]));
                if (key) {
                  // Длина белой части: пробелы + " + ключ + " + : (если есть)
                  const whiteLen = match[0].length;
                  return (
                    <li key={idx} className="pl-4 whitespace-pre text-[#4976d1]">
                      <span className="text-white">{line.slice(0, whiteLen)}</span>{line.slice(whiteLen)}
                    </li>
                  );
                }
              }
              return <li key={idx} className="pl-4 whitespace-pre text-[#4976d1]">{line}</li>;
            })}
          </ul>
          <span className="text-[#7ea6f7]">{'}'}</span>
                      </div>
                    </div>
    </div>
  );
}

function ContactPage() {
  const { t } = useLanguage();
  const [formState, setFormState] = React.useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
    isSubmitting: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isSubmitting: true, error: undefined }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        success: true,
        name: "",
        email: "",
        message: "",
      }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: "Не удалось отправить сообщение. Пожалуйста, попробуйте снова.",
      }));
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-16 relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60vw] h-[18vw] max-w-3xl rounded-full blur-3xl opacity-40 dark:opacity-30 bg-gradient-to-br from-blue-200 via-white to-transparent dark:from-blue-900 dark:via-slate-900 dark:to-transparent z-0" />
          </div>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
        {/* Левая колонка */}
        <div className="w-full md:w-72 flex-shrink-0 mb-6 md:mb-0 md:sticky md:top-28 flex flex-col items-center md:items-start">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg mb-4 bg-blue-100/80 dark:bg-blue-900/30">
            <Mail className="h-8 w-8 md:h-12 md:w-12 icon-adaptive" />
                    </div>
          <div className="text-xl md:text-2xl font-extrabold text-foreground mb-1 text-center md:text-left tracking-tight">Связаться с нами</div>
          <div className="text-sm text-muted-foreground text-center md:text-left max-w-xs mb-1">Оставьте заявку — мы ответим в течение 1 рабочего дня.</div>
                      </div>
        {/* Правая часть */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8">
          <form className="w-full max-w-md flex flex-col gap-4 mx-auto" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">Имя</label>
              <input 
                id="name" 
                value={formState.name} 
                onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))} 
                required 
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40" 
              />
                      </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">Email</label>
              <input 
                id="email" 
                type="email" 
                value={formState.email} 
                onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))} 
                required 
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40" 
              />
                    </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1 text-foreground">Сообщение</label>
              <textarea 
                id="message" 
                value={formState.message} 
                onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))} 
                required 
                className="w-full min-h-[120px] rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/40" 
              />
          </div>
            <button 
              type="submit" 
              disabled={formState.isSubmitting} 
              className="btn w-full mt-2 h-12 rounded-xl text-base font-semibold"
            >
              {formState.isSubmitting ? "Отправка..." : "Отправить сообщение"}
            </button>
            {formState.error && <p className="text-destructive text-sm">{formState.error}</p>}
            {formState.success && <p className="text-green-500 text-sm">Сообщение успешно отправлено!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

// Новый компонент бокового меню
function AccountSidebar({ currentTab, onTabChange }: { currentTab: string; onTabChange: (tab: string) => void }) {
  const { t } = useLanguage();
  const tabs = [
    { id: 'profile', label: t('account.profile'), icon: <UserIcon className="h-5 w-5" /> },
    { id: 'security', label: t('account.security'), icon: <Shield className="h-5 w-5" /> },
    { id: 'stats', label: t('account.stats'), icon: <BarChart className="h-5 w-5" /> },
    { id: 'data', label: t('account.history'), icon: <Database className="h-5 w-5" /> },
  ];

  return (
    <div className="md:block">
      {/* Мобильные табы */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-4 -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
            onClick={() => onTabChange(tab.id)}
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

interface AccountSectionLayoutProps {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  note?: string;
  children: React.ReactNode;
}

function AccountSectionLayout({ icon, iconColor, title, description, note, children }: AccountSectionLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <label className="block text-sm font-semibold mb-1 text-foreground">{title}</label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
          </div>
      <div className="flex items-center gap-4">
        {icon}
        {children}
      </div>
    </div>
  );
}

// 1. Профиль
function AccountProfilePage({ user, onUpdate }: { user: User; onUpdate: (data: Partial<User>) => void }) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{t('account.profile')}</h2>
          <p className="text-muted-foreground mt-1">{t('account.personalData')}</p>
        </div>
        <Button
          variant={isEditing ? "outline" : "ghost"}
          onClick={() => setIsEditing(!isEditing)}
          className="w-12 h-12 flex items-center justify-center rounded-full"
          aria-label={isEditing ? t('account.cancel') : t('account.edit')}
        >
          {isEditing ? (
            <span className="font-semibold text-base">{t('account.cancel')}</span>
          ) : (
            <Pencil className="h-6 w-6" />
          )}
        </Button>
              </div>

      <div className="grid gap-6">
        <div className="card-glass p-6 md:p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  {t('account.firstName')}
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
                  {t('account.lastName')}
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
                  {t('account.email')}
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
                  {t('account.phone')}
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
              <Button type="submit" className="w-full md:w-auto">
                {t('account.save')}
                    </Button>
            )}
          </form>
                  </div>

        <div className="card-glass p-6 md:p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">{t('account.accountInfo')}</h3>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{t('account.userId')}</span>
              <span className="font-medium">{user.id}</span>
                  </div>
            <div className="flex flex-col md:flex-row justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{t('account.role')}</span>
              <span className="font-medium">{user.role}</span>
                </div>
            <div className="flex flex-col md:flex-row justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{t('account.registrationDate')}</span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            {user.lastLogin && (
              <div className="flex flex-col md:flex-row justify-between py-3">
                <span className="text-muted-foreground">{t('account.lastLogin')}</span>
                <span className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Статистика
function AccountStatsPage({ stats }: { stats: Stats }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{t('account.stats')}</h2>
        <p className="text-muted-foreground mt-1">{t('account.statsDesc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('Total')}</h3>
          <p className="text-3xl font-bold">{stats.totalChecks}</p>
        </div>
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('Successful')}</h3>
          <p className="text-3xl font-bold text-green-500">{stats.successfulChecks}</p>
        </div>
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('Failed')}</h3>
          <p className="text-3xl font-bold text-red-500">{stats.failedChecks}</p>
        </div>
        <div className="card-glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">{t('Average Time')}</h3>
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

// 3. Мои данные
function AccountDataPage({ checks }: { checks: Check[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">История проверок</h2>
        <p className="text-muted-foreground mt-1">Список всех выполненных проверок</p>
          </div>

      <div className="card-glass p-6 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Тип</th>
                <th className="text-left py-3 px-4">Статус</th>
                <th className="text-left py-3 px-4">Дата</th>
                <th className="text-left py-3 px-4">Результат</th>
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

// 4. Безопасность (оживлённая)
function AccountSecurityPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Отправка кода на e-mail через authAPI
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setSuccess('');
    try {
      await authAPI.sendVerificationCode(email);
      setCodeSent(true);
      setSuccess('Код отправлен на e-mail');
    } catch (e) {
      setError('Ошибка при отправке кода');
    } finally {
      setIsSending(false);
    }
  };

  // Смена пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    setError('');
    setSuccess('');
    try {
      // TODO: заменить на реальный API вызов
      await new Promise(res => setTimeout(res, 1000));
      setSuccess('Пароль успешно изменён!');
      setOldPassword('');
      setNewPassword('');
      setCode('');
    } catch (e) {
      setError('Ошибка при смене пароля');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch">
      {/* Левая часть: иконка, заголовок, описание */}
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left bg-transparent md:bg-transparent rounded-3xl p-0 md:p-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            <Shield className="h-10 w-10 text-blue-500 dark:text-blue-300" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Безопасность аккаунта</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-md">
            {t('account.securityDesc')}<br />
            <span className="text-xs md:text-sm block mt-2">{t('account.securityNote')}</span>
          </p>
          </div>
      </div>
      {/* Правая часть: форма */}
      <div className="flex flex-col justify-center items-center md:items-start bg-white/80 dark:bg-card/80 rounded-3xl shadow-xl p-6 md:p-10 border border-border w-full max-w-xl mx-auto">
        <form className="space-y-5 w-full" onSubmit={handleChangePassword}>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">{t('account.email')}</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#f6fafd] border border-[#e5eaf2] rounded-xl px-4 py-3 text-base placeholder:text-[#b0b8c9]" placeholder={t('account.email_placeholder')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <label className="block text-sm font-semibold mb-1 text-foreground">{t('Old password')}</label>
              <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full h-[48px] px-5 py-3 bg-[#f6fafd] border border-[#e5eaf2] rounded-2xl text-[18px] placeholder:text-[#b0b8c9] min-w-0" placeholder="••••••••" />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <label className="block text-sm font-semibold mb-1 text-foreground">{t('New password')}</label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full h-[48px] px-5 py-3 bg-[#f6fafd] border border-[#e5eaf2] rounded-2xl text-[18px] placeholder:text-[#b0b8c9] min-w-0" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full mt-2">
            <div className="flex flex-col flex-1 min-w-0">
              <label className="block text-sm font-semibold mb-1 text-foreground whitespace-nowrap">{t('Code from e-mail')}</label>
              <Input value={code} onChange={e => setCode(e.target.value)} required className="w-full h-[48px] px-5 py-3 bg-[#f6fafd] border border-[#e5eaf2] rounded-2xl text-[16px] placeholder:text-[#b0b8c9] min-w-0" placeholder="6 digits" />
            </div>
            <div className="flex items-end flex-1 min-w-0">
              <Button type="button" onClick={handleSendCode} disabled={isSending || !email} className="w-full h-[48px] rounded-2xl text-[16px] font-semibold bg-gradient-to-r from-[#2563eb] to-[#478bff] text-white font-bold border-none flex items-center justify-center gap-1 hover:from-[#478bff] hover:to-[#2563eb] transition-colors duration-150 shadow-none">
                <Send className="h-5 w-5 text-white" />{isSending ? t('account.sending') : t('account.get_code')}
                  </Button>
                </div>
          </div>
          <Button type="submit" disabled={isChanging} className="w-full flex items-center justify-center gap-2 font-bold shadow-lg text-lg h-[48px] rounded-xl bg-gradient-to-r from-[#2563eb] to-[#478bff] text-white mt-8 mb-0">
            <Shield className="h-6 w-6 text-white" />
            {isChanging ? t('account.sending') : t('account.change password')}
          </Button>
          {success && <div className="text-green-600 text-sm text-center font-medium">{t('account.success')}</div>}
          {error && <div className="text-destructive text-sm text-center font-medium">{t('account.error')}</div>}
              </form>
      </div>
    </div>
  );
}

function UserAgreementPage() {
  const { currentLanguage } = useLanguage();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (currentLanguage === 'en') {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <iframe src="/documents/user-agreement-en.html" title="User Agreement" style={{ flex: 1, width: '100%', border: 'none' }} />
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Пользовательское соглашение</h1>
          <div className="prose prose-lg max-w-none text-foreground">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Общие положения</h2>
            <p className="mb-4">
              1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между пользователем (далее — «Пользователь») и PT Dewata Global Group (далее — «Компания») в отношении использования интернет-сервиса Slonex (https://slonex.com) и всех связанных с ним сервисов, программ и продуктов Компании (далее — «Сервисы»).
            </p>
            <p className="mb-4">
              1.2. Используя Сервисы, Пользователь подтверждает свое согласие с условиями настоящего Соглашения. В случае несогласия с условиями Соглашения, Пользователь должен воздержаться от использования Сервисов.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Предмет Соглашения</h2>
            <p className="mb-4">
              2.1. Компания предоставляет Пользователю доступ к Сервисам на условиях, изложенных в настоящем Соглашении.
            </p>
            <p className="mb-4">
              2.2. Пользователь обязуется использовать Сервисы исключительно в соответствии с настоящим Соглашением и действующим законодательством.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Регистрация и учетная запись</h2>
            <p className="mb-4">
              3.1. Для использования некоторых функций Сервисов может потребоваться регистрация и создание учетной записи.
            </p>
            <p className="mb-4">
              3.2. Пользователь обязуется предоставлять достоверную и актуальную информацию при регистрации и поддерживать ее в актуальном состоянии.
            </p>
            <p className="mb-4">
              3.3. Пользователь несет ответственность за сохранение конфиденциальности своих учетных данных и за все действия, совершенные под его учетной записью.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Права и обязанности сторон</h2>
            <p className="mb-4">
              4.1. Пользователь имеет право:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>использовать Сервисы в соответствии с условиями настоящего Соглашения;</li>
              <li>обращаться в службу поддержки Компании по вопросам, связанным с использованием Сервисов.</li>
            </ul>
            <p className="mb-4">
              4.2. Пользователь обязуется:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>не использовать Сервисы для противоправных целей;</li>
              <li>не предпринимать действий, нарушающих работу Сервисов;</li>
              <li>соблюдать авторские и иные права третьих лиц.</li>
            </ul>
            <p className="mb-4">
              4.3. Компания имеет право:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>изменять функциональность Сервисов;</li>
              <li>приостанавливать или прекращать предоставление Сервисов в случае нарушения Пользователем условий Соглашения;</li>
              <li>направлять Пользователю информационные сообщения, связанные с использованием Сервисов.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Ограничение ответственности</h2>
            <p className="mb-4">
              5.1. Сервисы предоставляются «как есть». Компания не гарантирует, что Сервисы будут соответствовать ожиданиям Пользователя или работать без сбоев и ошибок.
            </p>
            <p className="mb-4">
              5.2. Компания не несет ответственности за убытки, возникшие у Пользователя в результате использования или невозможности использования Сервисов.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Обработка персональных данных</h2>
            <p className="mb-4">
              6.1. Компания обрабатывает персональные данные Пользователя в соответствии с Политикой конфиденциальности, размещенной на сайте Slonex.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Изменение условий Соглашения</h2>
            <p className="mb-4">
              7.1. Компания вправе вносить изменения в настоящее Соглашение. Новая редакция Соглашения вступает в силу с момента ее размещения на сайте Slonex, если иное не предусмотрено новой редакцией Соглашения.
            </p>
            <p className="mb-4">
              7.2. Продолжение использования Сервисов после внесения изменений в Соглашение означает согласие Пользователя с такими изменениями.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Прочие условия</h2>
            <p className="mb-4">
              8.1. Настоящее Соглашение регулируется законодательством Индонезии.
            </p>
            <p className="mb-4">
              8.2. Все споры, возникающие в связи с настоящим Соглашением, подлежат разрешению в соответствии с законодательством Индонезии.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Реквизиты Компании</h2>
            <p className="mb-4">
              PT Dewata Global Group<br />
              Номер регистрации: 2111220138409<br />
              ИНН: 9909677607<br />
              Адрес: Jl. Dewi Saraswati No.22, Kerobokan Kelod, Kec. Kuta Utara, Kabupaten Badung, Bali 80361<br />
              Электронная почта: support@slonex.com
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function PrivacyPolicyPage() {
  const { currentLanguage } = useLanguage();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (currentLanguage === 'en') {
  return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <iframe src="/documents/privacy-policy-en.html" title="Privacy Policy" style={{ flex: 1, width: '100%', border: 'none' }} />
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>
          <div className="prose prose-lg max-w-none text-foreground">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Общие положения</h2>
            <p className="mb-4">
              1.1. Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок получения, хранения, обработки и защиты персональных данных пользователей (далее — «Пользователь») при использовании интернет-сервиса Slonex (https://slonex.com) и всех связанных с ним сервисов, программ и продуктов PT Dewata Global Group (далее — «Компания»).
            </p>
            <p className="mb-4">
              1.2. Используя сервис Slonex, Пользователь подтверждает согласие с настоящей Политикой. Если Пользователь не согласен с условиями Политики, он должен воздержаться от использования сервиса.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Термины и определения</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Сервис — интернет-платформа Slonex и все её функции.</li>
              <li>Пользователь — физическое лицо, использующее сервис.</li>
              <li>Персональные данные — любая информация, позволяющая прямо или косвенно идентифицировать пользователя.</li>
              <li>Обработка персональных данных — любые действия с персональными данными: сбор, запись, систематизация, хранение, уточнение, использование, передача, обезличивание, блокирование, удаление и уничтожение.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Цели обработки персональных данных</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Идентификация пользователя при регистрации и входе в сервис.</li>
              <li>Предоставление доступа к функционалу сервиса и исполнение обязательств перед пользователем.</li>
              <li>Связь с пользователем, включая информирование о работе сервиса.</li>
              <li>Обеспечение безопасности сервиса и предотвращение мошенничества.</li>
              <li>Анализ и совершенствование качества работы сервиса.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Состав обрабатываемых персональных данных</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Имя, фамилия, отчество пользователя.</li>
              <li>Адрес электронной почты.</li>
              <li>Номер телефона.</li>
              <li>IP-адрес, данные о браузере и операционной системе.</li>
              <li>Данные о действиях пользователя на сервисе (логи, история посещений и т.д.).</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Правовые основания обработки данных</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Согласие пользователя на обработку его персональных данных.</li>
              <li>Необходимость исполнения договора, стороной которого выступает пользователь.</li>
              <li>Соблюдение требований законодательства.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Условия обработки и хранения данных</h2>
            <p className="mb-4">
              6.1. Обработка персональных данных производится с соблюдением всех норм действующего законодательства Индонезии.
            </p>
            <p className="mb-4">
              6.2. Компания применяет необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, утраты, уничтожения и иных неправомерных действий.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Передача персональных данных третьим лицам</h2>
            <p className="mb-4">
              7.1. Компания не передает персональные данные третьим лицам без согласия пользователя, за исключением случаев, предусмотренных законодательством или необходимостью защиты прав и законных интересов Компании.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>По требованию государственных органов в установленном законом порядке.</li>
              <li>Для защиты прав и интересов Компании или третьих лиц, если это необходимо по закону.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Срок хранения и уничтожение персональных данных</h2>
            <p className="mb-4">
              8.1. Персональные данные хранятся не дольше, чем это необходимо для достижения целей их обработки или в течение срока, установленного законодательством.
            </p>
            <p className="mb-4">
              8.2. После достижения целей обработки или в случае отзыва согласия пользователя на обработку данных, информация подлежит удалению или обезличиванию, если иное не предусмотрено законом.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Права пользователя</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Получать информацию о своих персональных данных и порядке их обработки.</li>
              <li>Требовать уточнения, блокировки или удаления своих персональных данных, если они являются неполными, неточными или обрабатываются с нарушениями.</li>
              <li>Отзывать согласие на обработку персональных данных.</li>
              <li>Обжаловать действия или бездействие Компании по вопросам обработки персональных данных в компетентные органы или суд.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Изменения политики конфиденциальности</h2>
            <p className="mb-4">
              10.1. Компания оставляет за собой право изменять настоящую Политику в любое время. Актуальная версия Политики размещается на сайте Slonex.
            </p>
            <p className="mb-4">
              10.2. Рекомендуем периодически проверять текст Политики на наличие изменений.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Вопросы, запросы и обращения пользователей</h2>
            <p className="mb-4">
              Пользователь или его официальный представитель вправе направить любые обращения, связанные с обработкой персональных данных, а также запросы о предоставлении информации или отзыв согласия, отправив электронное письмо по адресу: [указать e-mail компании].
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Информацию о документе, подтверждающем личность пользователя.</li>
              <li>Сведения, подтверждающие право пользователя взаимодействовать с Компанией (контактные данные: телефон, e-mail и пр.).</li>
              <li>Данные и подтверждающие документы, если обращается представитель пользователя.</li>
              <li>Подпись пользователя или его представителя (допускается электронная).</li>
            </ul>
            <p className="mb-4">
              Компания рассматривает обращения и предоставляет официальный ответ в течение 10 рабочих дней с даты поступления запроса.
            </p>
            <p className="mb-4">
              Вся корреспонденция с Компанией (независимо от формы) является информацией ограниченного доступа и не раскрывается третьим лицам без согласия пользователя.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Заключительные положения</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Действие настоящей Политики распространяется только на сервис Slonex и не применяется к сторонним интернет-ресурсам.</li>
              <li>Компания не несет ответственности за действия третьих лиц, получивших доступ к персональным данным пользователя по причинам, не зависящим от Компании.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function PaymentSecurityPage() {
  const { currentLanguage } = useLanguage();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (currentLanguage === 'en') {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <iframe src="/documents/payment-security-en.html" title="Payment Security" style={{ flex: 1, width: '100%', border: 'none' }} />
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Безопасность платежей</h1>
          <div className="prose prose-lg max-w-none text-foreground">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Общие положения</h2>
            <p className="mb-4">
              1.1. Настоящая Политика безопасности платежей (далее — «Политика») определяет основные принципы и меры защиты данных пользователей (далее — «Пользователь») при проведении платежей с использованием интернет-сервиса Slonex (https://slonex.com), предоставляемого PT Dewata Global Group (далее — «Компания»).
            </p>
            <p className="mb-4">
              1.2. Используя сервис для совершения платежей, Пользователь подтверждает согласие с условиями настоящей Политики. В случае несогласия с условиями Пользователь обязан воздержаться от использования платёжных функций сервиса.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Защита персональных данных при оплате</h2>
            <p className="mb-4">
              2.1. При обработке платежей Компания обеспечивает безопасность персональных данных Пользователей в соответствии с законодательством Индонезии и международными стандартами.
            </p>
            <p className="mb-4">
              2.2. Все данные, предоставляемые Пользователем при оплате, передаются по защищённым каналам с использованием современных средств шифрования.
            </p>
            <p className="mb-4">
              2.3. Доступ к платёжным данным имеют только специально уполномоченные сотрудники и/или партнёры Компании, и исключительно в объёме, необходимом для осуществления платежа или возврата средств.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Использование платёжных карт и электронных средств</h2>
            <p className="mb-4">
              3.1. Для оплаты услуг на сайте Slonex принимаются к использованию только те платёжные карты и электронные средства, которые соответствуют требованиям международных платёжных систем и законодательства.
            </p>
            <p className="mb-4">
              3.2. При оформлении оплаты Пользователь перенаправляется на защищённую платёжную страницу платёжного партнёра, где непосредственно вводятся реквизиты платёжной карты или иного средства оплаты.
            </p>
            <p className="mb-4">
              3.3. Компания не хранит и не обрабатывает полные данные банковских карт Пользователей на своих серверах.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Возврат средств</h2>
            <p className="mb-4">
              4.1. Вопросы возврата денежных средств регулируются в соответствии с пользовательским соглашением и политикой возвратов, размещёнными на сайте Slonex.
            </p>
            <p className="mb-4">
              4.2. Для возврата средств Пользователь должен направить соответствующий запрос в службу поддержки, предоставив информацию, необходимую для идентификации платежа и возврата.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Вопросы и обращения</h2>
            <p className="mb-4">
              5.1. Если у Пользователя возникли вопросы относительно безопасности платёжных операций или требуется дополнительная информация, он может обратиться в Компанию по адресу электронной почты: [указать e-mail для связи].
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>ФИО и контактные данные;</li>
              <li>Суть вопроса или проблему;</li>
              <li>Документы, подтверждающие факт совершения платежа</li>
            </ul>
            <p className="mb-4">
              5.3. Ответ на обращение предоставляется в течение 10 рабочих дней с момента получения запроса.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Изменение политики</h2>
            <p className="mb-4">
              6.1. Компания оставляет за собой право вносить изменения в настоящую Политику в любое время. Новая редакция вступает в силу с момента её публикации на сайте Slonex.
            </p>
            <p className="mb-4">
              6.2. Рекомендуем Пользователям периодически знакомиться с актуальной редакцией политики.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Контактные данные</h2>
            <p className="mb-4">
              PT Dewata Global Group<br />
              Регистрационный номер: 2111220138409<br />
              ИНН: 9909677607<br />
              Адрес: Jl. Dewi Saraswati No.22, Kerobokan Kelod, Kec. Kuta Utara, Kabupaten Badung, Bali 80361<br />
              Электронная почта: support@slonex.com
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Move Footer above document pages
function Footer() {
  const { t, currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/icons/darklogo.png' : '/icons/logo.png';
  return (
    <footer className="relative w-full bg-gradient-to-t from-background/90 to-background/60 border-t border-border py-6 mt-6">
      <div className="max-w-7xl mx-auto px-2 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-4 items-center md:items-start">
        {/* Левая колонка */}
        <div className="flex flex-col items-center md:items-start gap-2 md:gap-1 md:pt-0 md:mt-0 w-full">
          <div className="flex flex-col items-center md:flex-row md:items-center w-full logo-group gap-2 md:gap-2" style={{marginTop: '-16px'}}>
            <span style={{width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <img src={logoSrc} style={{ width: '64px', height: '64px', objectFit: 'contain', display: 'block' }} alt="Slonex logo" />
            </span>
            <span className="text-[2.2rem] font-bold tracking-tight" style={{lineHeight: 1, display: 'flex', alignItems: 'center', marginTop: '1mm'}}>
              <span className="slonix-slon">Slon</span><span className="slonix-ix">ex</span>
            </span>
          </div>
          <span className="text-muted-foreground text-xs">© {new Date().getFullYear()} PT Dewata Global Group</span>
          <div className="text-[11px] text-muted-foreground mt-1">
            <span className="font-semibold">{currentLanguage === 'ru' ? 'Регистрационный номер:' : t('company.registration')}</span> 2111220138409<br />
            <span className="font-semibold">{currentLanguage === 'ru' ? 'ИНН:' : t('company.inn')}</span> 9909677607
          </div>
          {/* Соцсети под ИНН */}
          <div className="flex gap-4 mt-2 justify-center md:justify-start">
            <a href="https://t.me/sherlock_TQX_bot" target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary/10 hover:bg-primary/20 p-2 transition-colors flex items-center justify-center">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            </a>
            <a href="mailto:support@slonex.com" className="rounded-full bg-primary/10 hover:bg-primary/20 p-2 transition-colors flex items-center justify-center">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary"><rect x="2" y="4" width="20" height="16" rx="4"/><path d="m22 6-10 7L2 6"/></svg>
            </a>
          </div>
        </div>
        {/* Центр: Ссылки */}
        <div className="flex flex-col items-center gap-1 mt-10 md:mt-10 w-full"> {/* mt-10 = ~1см */}
          <Link to="/user-agreement" className="text-xs text-muted-foreground hover:text-primary transition-colors">{currentLanguage === 'en' ? t('footer.user_agreement') : 'Пользовательское соглашение'}</Link>
          <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">{currentLanguage === 'en' ? t('footer.privacy_policy') : 'Политика конфиденциальности'}</Link>
          <Link to="/payment-security" className="text-xs text-muted-foreground hover:text-primary transition-colors">{currentLanguage === 'en' ? t('footer.payment_security') : 'Безопасность платежей'}</Link>
        </div>
        {/* Правая колонка */}
        <div className="flex flex-col items-center md:items-end gap-1 mt-10 md:mt-10 w-full"> {/* mt-10 = ~1см */}
          <div className="text-[11px] text-muted-foreground text-center md:text-right">
            <span className="font-semibold">{t('Аddress') || ''}</span> Jl. Dewi Saraswati No.22, Kerobokan Kelod, Kec. Kuta Utara, Kabupaten Badung, Bali 80361<br />
            <span className="font-semibold">E-mail:</span> support@slonex.com
          </div>
          {/* Логотипы платёжных систем справа */}
          <div className="flex gap-2 mt-1 items-center justify-center md:justify-end md:ml-8">
            <img src="/icons/visa.svg" alt="Visa" className="h-6 w-auto object-contain" />
            <img src="/icons/mastercard.svg" alt="Mastercard" className="h-6 w-auto object-contain" />
            <img src="/icons/mir.svg" alt="Mir" className="h-6 w-auto object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceFeaturesSection />
    </>
  );
}

function RegistrationPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1 - регистрация, 2 - код
  const [isSending, setIsSending] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Отправка кода
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true); setError(''); setSuccess('');
    try {
      // TODO: заменить на реальный API вызов
      await new Promise(res => setTimeout(res, 1000));
      setStep(2);
      setSuccess(t('register.codeSent') || 'Код отправлен на e-mail');
    } catch {
      setError(t('register.sendError') || 'Ошибка при отправке кода');
    } finally {
      setIsSending(false);
    }
  };

  // Регистрация
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true); setError(''); setSuccess('');
    try {
      // TODO: заменить на реальный API вызов
      await new Promise(res => setTimeout(res, 1000));
      setSuccess(t('register.success') || 'Регистрация успешна!');
    } catch {
      setError(t('register.registerError') || 'Ошибка при регистрации');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white/80 dark:bg-card/80 rounded-2xl shadow-2xl max-w-md w-full p-8 backdrop-blur-xl border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">{t('register.title') || 'Регистрация'}</h2>
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendCode}>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contact.email') || 'E-mail'}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contact.name') || 'Имя'}</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('register.lastName') || 'Фамилия'}</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('register.password') || 'Пароль'}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus:ring-2 focus:ring-primary/40" />
            </div>
            <Button type="submit" className="w-full" disabled={isSending}>{isSending ? t('register.sending') || 'Отправка...' : t('register.getCode') || 'Получить код'}</Button>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-destructive text-sm">{error}</div>}
          </form>
        )}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium mb-1">{t('register.code') || 'Код из e-mail'}</label>
              <input value={code} onChange={e => setCode(e.target.value)} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus:ring-2 focus:ring-primary/40" />
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>{isRegistering ? t('register.registering') || 'Регистрация...' : t('register.finish') || 'Завершить регистрацию'}</Button>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-destructive text-sm">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

const bounceTight = {
  animate: {
    y: ["0%", "-12%", "0%"],
    transition: { duration: 2.08, repeat: Infinity, ease: "easeInOut" },
  },
};
function ServiceFeaturesSection(): React.ReactElement {
  const { t } = useLanguage();
  const features = [
    {
      icon: (
        <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-[#eaf1fb] dark:bg-[#eaf1fb] overflow-hidden shadow-md">
          <motion.div className="w-12 h-12 flex items-center justify-center" variants={bounceTight} animate="animate">
            <img src="/icons/1.svg" alt="icon 1" className="w-12 h-12 object-contain icon-adaptive" />
          </motion.div>
        </div>
      ),
      title: t('features.social.title'),
      content: (
        <>
          <div className="font-bold text-lg mb-1 leading-tight">{t('features.social.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug mb-2">
            {t('features.social.desc')}
          </div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.social.fio.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug mb-1">{t('features.social.fio.desc')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.social.email.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug">{t('features.social.email.desc')}</div>
        </>
      ),
    },
    {
      icon: (
        <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-[#eaf1fb] dark:bg-[#eaf1fb] overflow-hidden shadow-md">
          <motion.div className="w-12 h-12 flex items-center justify-center" variants={bounceTight} animate="animate">
            <img src="/icons/2.svg" alt="icon 2" className="w-12 h-12 object-contain icon-adaptive" />
          </motion.div>
        </div>
      ),
      title: t('features.cars.title'),
      content: (
        <>
          <div className="font-bold text-lg mb-1 leading-tight">{t('features.cars.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug mb-1">{t('features.cars.desc')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.cars.phone.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug mb-1">{t('features.cars.phone.desc')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.cars.more')}</div>
        </>
      ),
    },
    {
      icon: (
        <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-[#eaf1fb] dark:bg-[#eaf1fb] overflow-hidden shadow-md">
          <motion.div className="w-12 h-12 flex items-center justify-center" variants={bounceTight} animate="animate">
            <img src="/icons/3.svg" alt="icon 3" className="w-12 h-12 object-contain icon-adaptive" />
          </motion.div>
        </div>
      ),
      title: t('features.tax.title'),
      content: (
        <>
          <div className="font-bold text-lg mb-1 leading-tight">{t('features.tax.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug mb-1">{t('features.tax.desc')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.tax.bankruptcy')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.tax.bailiffs')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug">{t('features.tax.more')}</div>
        </>
      ),
    },
    {
      icon: (
        <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-[#eaf1fb] dark:bg-[#eaf1fb] overflow-hidden shadow-md">
          <motion.div className="w-12 h-12 flex items-center justify-center" variants={bounceTight} animate="animate">
            <img src="/icons/4.svg" alt="icon 4" className="w-12 h-12 object-contain icon-adaptive" />
          </motion.div>
        </div>
      ),
      title: t('features.treasury.title'),
      content: (
        <>
          <div className="font-bold text-lg mb-1 leading-tight">{t('features.treasury.title')}</div>
          <div className="text-muted-foreground text-[15px] leading-snug mb-1">{t('features.treasury.desc')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.treasury.rosfin')}</div>
          <div className="font-bold text-base mb-1 leading-tight">{t('features.treasury.notary')}</div>
          <div className="font-bold text-base leading-tight">{t('features.treasury.more')}</div>
        </>
      ),
    },
  ];
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-24 mt-5">
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-8 md:mb-10">{t('features.service.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="card-glass flex flex-col h-full p-6 md:p-8 rounded-3xl shadow-lg backdrop-blur-xl bg-white/90 dark:bg-slate-900/80 items-center transition-all duration-200 hover:bg-[#eaf0fe] hover:shadow-xl hover:scale-105 hover:-translate-y-0.5" 
              style={{ willChange: 'transform' }}
            >
              {f.icon}
              <div className="flex flex-col items-center text-center w-full mt-4 flex-1 justify-between">
                {f.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppLayout() {
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const isDocPage = ['/user-agreement', '/privacy-policy', '/payment-security'].includes(location.pathname);
  return (
    <div className="min-h-screen bg-background text-foreground text-[80%] md:text-[90%]">
          <Navigation />
      <main className="flex flex-col min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/plans" element={<PlansSection />} />
          <Route path="/contact" element={<ContactSection />} />
              <Route path="/account" element={<AccountPage />} />
          <Route path="/user-agreement" element={<UserAgreementPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/payment-security" element={<PaymentSecurityPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
            </Routes>
        {!isDocPage && <Footer />}
          </main>
        </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId="324175832563-tij1fbggkl4eb68djht5g81jcg52phkh.apps.googleusercontent.com">
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppLayout />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

// Восстановленный компонент LoginPage
function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [isHover, setIsHover] = useState(false);
  const [logoX, setLogoX] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const btnRef = useRef<HTMLButtonElement>(null);
  const text = ['Продолжить', 'с', 'Google'];
  const animationRef = useRef<number | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Анимация движения логотипа и исчезновения текста
  useEffect(() => {
    let timeout: number | undefined;
    if (isHover) {
      setTextVisible(true);
      const btnWidth = btnRef.current ? btnRef.current.offsetWidth : 320;
      const iconWidth = 40;
      let start = 0;
      const duration = 900; // ms
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setLogoX(progress * (btnWidth - iconWidth - 16));
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setTextVisible(false); // Скрываем текст, когда логотип доехал до конца
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setLogoX(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      timeout = window.setTimeout(() => setTextVisible(true), 75); // Ещё быстрее
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timeout) clearTimeout(timeout);
    };
  }, [isHover]);

  const handleSendCode = async () => {
    try {
      await authAPI.sendVerificationCode(email);
      setIsCodeSent(true);
      setError('');
    } catch (err) {
      setError('Ошибка при отправке кода');
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, code);
      setError('');
    } catch (err) {
      setError('Ошибка при входе');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      const minLoaderTime = 1200; // ms
      const start = Date.now();
      try {
        const credential = (tokenResponse as any).credential;
        if (!credential) throw new Error('Нет credential');
        const { token, user } = await authAPI.verifyGoogleToken(credential);
        localStorage.setItem('token', token);
        // Ждём минимум minLoaderTime
        const elapsed = Date.now() - start;
        if (elapsed < minLoaderTime) {
          await new Promise(res => setTimeout(res, minLoaderTime - elapsed));
        }
        navigate('/account');
      } catch (e) {
        setTimeout(() => setIsGoogleLoading(false), 600); // чтобы лоадер не исчезал мгновенно
        setError("Ошибка Google авторизации");
        return;
      }
      setIsGoogleLoading(false);
    },
    onError: () => {
      setError("Ошибка Google авторизации");
    },
    flow: "implicit",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#181A20] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Вход в аккаунт</h2>
        </div>
        {isGoogleLoading ? (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white/80 dark:bg-[#181A20]/80">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-b-transparent border-l-blue-400 border-r-purple-400 animate-spin bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400 shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GoogleIcon className="w-8 h-8" />
              </div>
            </div>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-200 animate-pulse">Входим через Google...</div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-xl border border-gray-300 py-3 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm text-base pl-4"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ minHeight: '48px', fontWeight: 500 }}
                />
              </div>
              {isCodeSent && (
                <div>
                  <label htmlFor="code" className="sr-only">Код</label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="relative block w-full rounded-xl border border-gray-300 py-3 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm text-base pl-4"
                    placeholder="Введите код из почты"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ minHeight: '48px', fontWeight: 500 }}
                  />
                </div>
              )}
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div>
              {!isCodeSent ? (
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Получить код
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Войти
                </button>
              )}
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="bg-gray-50 dark:bg-[#181A20] px-2 text-gray-500">или</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  ref={btnRef}
                  type="button"
                  onClick={() => googleLogin()}
                  className={`relative flex items-center justify-center w-full py-2 rounded-2xl font-normal text-base shadow-xl border-2 border-transparent transition-all duration-200 overflow-hidden group text-[#222] ${isHover ? 'slider-animate' : ''}`}
                  style={{
                    minHeight: '38px',
                    letterSpacing: '0.02em',
                    boxShadow: '0 4px 24px 0 rgba(80, 112, 255, 0.10)',
                    background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)',
                    borderColor: 'transparent',
                  }}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                >
                  {/* Логотип Google с анимацией */}
                  <span
                    className="absolute top-1/2 -translate-y-1/2 transition-transform duration-300"
                    style={{
                      left: isHover ? (btnRef.current ? btnRef.current.offsetWidth - 48 : 220) : 12,
                      zIndex: 2,
                      transition: 'transform 0.3s, left 1.2s cubic-bezier(.4,1.7,.6,1)',
                      boxShadow: '0 0 0 4px #fff, 0 2px 8px 0 rgba(80,112,255,0.10)',
                      borderRadius: '50%',
                      background: '#fff',
                      padding: 2,
                    }}
                  >
                    <GoogleIcon className="w-7 h-7" />
                  </span>
                  {/* Текст по буквам, исчезает полностью */}
                  <span className="relative z-10 flex items-center justify-center w-full select-none tracking-wide text-center animate-appear" style={{ transition: 'opacity 0.2s, transform 0.2s', opacity: isHover ? 0 : 1, transform: isHover ? 'scale(0.98)' : 'scale(1)', visibility: 'visible', height: '24px', color: '#222' }}>
                    {text.map((word, wi) => (
                      <span key={wi} style={{ marginRight: wi < text.length - 1 ? '8px' : 0, display: 'flex' }}>
                        {word}
                      </span>
                    ))}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}