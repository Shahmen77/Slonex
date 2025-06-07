import React, { useState, useRef, useEffect } from "react";
import { Zap, ChevronDown } from "lucide-react";
import { SectionHero } from "./SectionHero";
import { useNavigate } from "react-router-dom";
import { paymentAPI } from '../client/api';
import { useLanguage } from '../hooks/useLanguage';

export function PlansSection() {
  const { t } = useLanguage();
  const PERSON_QUERIES = [
    { name: t('plans.person.query.fio'), price: 99 },
    { name: t('plans.person.query.phone'), price: 79 },
    { name: t('plans.person.query.email'), price: 89 },
    { name: t('plans.person.query.inn'), price: 89 },
    { name: t('plans.person.query.passport'), price: 79 },
    { name: t('plans.person.query.snils'), price: 79 },
  ];
  const COMPANY_QUERIES = [
    { name: t('plans.company.query.inn_ogrn'), price: 99 },
    { name: t('plans.company.query.scoring'), price: 30 },
  ];
  const AUTO_QUERIES = [
    { name: t('plans.auto.query.number'), price: 55 },
    { name: t('plans.auto.query.vin'), price: 55 },
  ];
  const ALL_QUERIES = [
    ...PERSON_QUERIES,
    ...COMPANY_QUERIES,
    ...AUTO_QUERIES,
  ];
  const [selected, setSelected] = useState(PERSON_QUERIES[0]);
  const [count, setCount] = useState('1');
  const [menuOpen, setMenuOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const parsedCount = parseInt(count, 10);
  const total = !count || isNaN(parsedCount) || parsedCount < 1 ? 0 : selected.price * parsedCount;
  const [qr, setQr] = useState<string|null>(null);
  const [payError, setPayError] = useState<string|null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handlePay = async () => {
    setPayError(null);
    setQr(null);
    try {
      const userInfo = { browser: navigator.userAgent };
      const token = btoa(JSON.stringify({ userInfo }));
      const params = {
        orderId: Date.now().toString(),
        amount: total.toFixed(2),
        terminal: '200000882',
        merchant: '20000088',
        description: `Покупка: ${selected.name}`,
        clientBackUrl: window.location.origin + '/back-from-pay',
        userIp: '127.0.0.1',
        tokenType: 'SBP',
        token,
      };
      const data = await paymentAPI.paySBP(params);
      setQr(data.qrCodeContent);
    } catch (err: any) {
      setPayError(err.message || 'Ошибка оплаты');
    }
  };

  // Для выделения выбранного запроса
  const isSelected = (q: {name: string}) => selected.name === q.name;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background py-10 md:py-20">
      <SectionHero
        icon={Zap}
        title={t('plans.title')}
        description={t('plans.description')}
      />
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 mt-10 md:mt-20 flex flex-col md:flex-row gap-10 items-start justify-center">
        {/* Левая часть: тарифы */}
        <div className="flex flex-col gap-8 flex-1 min-w-0">
          {/* Физлица: горизонтальная карточка с двумя столбиками */}
          <div className="rounded-3xl bg-white dark:bg-[#23283a] shadow-xl border border-slate-100 dark:border-slate-800 p-10 max-w-3xl w-full mx-auto transition-all duration-300">
            <div className="text-2xl font-extrabold mb-8 text-black dark:text-white text-center tracking-tight drop-shadow-lg">{t('plans.persons')}</div>
            <div className="w-full grid grid-cols-2 gap-x-10 gap-y-3">
              {PERSON_QUERIES.map((row, idx) => (
                <button
                  key={row.name}
                  className={`group flex items-center gap-3 w-full py-2 px-3 rounded-xl transition-all duration-150 cursor-pointer
                    ${selected.name === row.name ? 'bg-blue-50/80 dark:bg-blue-900/30 text-primary font-bold shadow-md border-2 border-blue-300' : 'hover:bg-blue-100/60 dark:hover:bg-blue-900/20 hover:text-primary/90 border border-transparent'}
                  `}
                  onClick={() => setSelected(row)}
                  type="button"
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150
                    ${selected.name === row.name ? 'border-blue-500 bg-blue-400/80' : 'border-blue-300 bg-white dark:bg-[#23283a]'}`}
                  >
                    {selected.name === row.name && <span className="w-2 h-2 rounded-full bg-white dark:bg-[#23283a] block" />}
                  </span>
                  <span className="flex-1 text-base text-left whitespace-nowrap truncate">{row.name}</span>
                  <span className="font-semibold text-right whitespace-nowrap text-base">{row.price} {t('plans.currency')}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Нижний ряд: две карточки */}
          <div className="flex flex-row gap-8 w-full max-w-3xl mx-auto">
            {/* Юрлица */}
            <div className="flex-1 flex flex-col justify-between rounded-3xl bg-white dark:bg-[#23283a] shadow-xl border border-slate-100 dark:border-slate-800 p-8 transition-all duration-300 min-w-[220px]">
              <div className="text-xl font-extrabold mb-6 text-black dark:text-white text-center tracking-tight drop-shadow-lg">{t('plans.companies')}</div>
              <ul className="flex flex-col gap-3 divide-y divide-slate-200 dark:divide-slate-700">
                {COMPANY_QUERIES.map((row) => (
                  <li key={row.name} className="pt-2 first:pt-0">
                    <button
                      className={`flex items-center gap-3 w-full py-2 px-3 rounded-xl transition-all duration-150 cursor-pointer group
                        ${selected.name === row.name ? 'bg-blue-50/80 dark:bg-blue-900/30 text-primary font-bold shadow-md border-2 border-blue-300' : 'hover:bg-blue-100/60 dark:hover:bg-blue-900/20 hover:text-primary/90 border border-transparent'}
                      `}
                      onClick={() => setSelected(row)}
                      type="button"
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150
                        ${selected.name === row.name ? 'border-blue-500 bg-blue-400/80' : 'border-blue-300 bg-white dark:bg-[#23283a]'}`}
                      >
                        {selected.name === row.name && <span className="w-2 h-2 rounded-full bg-white dark:bg-[#23283a] block" />}
                      </span>
                      <span className="flex-1 text-base text-left whitespace-nowrap truncate">{row.name}</span>
                      <span className="font-semibold text-right whitespace-nowrap text-base">{row.price} {t('plans.currency')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Автомобили */}
            <div className="flex-1 flex flex-col justify-between rounded-3xl bg-white dark:bg-[#23283a] shadow-xl border border-slate-100 dark:border-slate-800 p-8 transition-all duration-300 min-w-[220px]">
              <div className="text-xl font-extrabold mb-6 text-black dark:text-white text-center tracking-tight drop-shadow-lg">{t('plans.cars')}</div>
              <ul className="flex flex-col gap-3 divide-y divide-slate-200 dark:divide-slate-700">
                {AUTO_QUERIES.map((row) => (
                  <li key={row.name} className="pt-2 first:pt-0">
                    <button
                      className={`flex items-center gap-3 w-full py-2 px-3 rounded-xl transition-all duration-150 cursor-pointer group
                        ${selected.name === row.name ? 'bg-blue-50/80 dark:bg-blue-900/30 text-primary font-bold shadow-md border-2 border-blue-300' : 'hover:bg-blue-100/60 dark:hover:bg-blue-900/20 hover:text-primary/90 border border-transparent'}
                      `}
                      onClick={() => setSelected(row)}
                      type="button"
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150
                        ${selected.name === row.name ? 'border-blue-500 bg-blue-400/80' : 'border-blue-300 bg-white dark:bg-[#23283a]'}`}
                      >
                        {selected.name === row.name && <span className="w-2 h-2 rounded-full bg-white dark:bg-[#23283a] block" />}
                      </span>
                      <span className="flex-1 text-base text-left whitespace-nowrap truncate">{row.name}</span>
                      <span className="font-semibold text-right whitespace-nowrap text-base">{row.price} {t('plans.currency')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Правая часть: калькулятор */}
        <div className="flex-shrink-0 w-full md:w-[340px] flex flex-col justify-center items-center mt-10 md:mt-0">
          <div className="flex flex-col justify-center items-center w-full h-full rounded-3xl shadow-2xl border border-border bg-white dark:bg-[#23283a] p-0 transition-all duration-300 min-h-[500px] max-w-xs mx-auto">
            <div className="flex flex-col justify-center items-center w-full h-full p-8 gap-7">
              <div className="text-2xl font-extrabold text-center w-full mb-2 tracking-tight text-black dark:text-white">{t('plans.calc_title')}</div>
              <div className="w-full flex flex-col gap-4">
                <label className="block text-base font-semibold mb-1 text-black dark:text-white">{t('plans.query_type')}</label>
                <div ref={selectRef} className="relative w-full">
                  <button
                    type="button"
                    className="appearance-none w-full rounded-xl border border-border bg-background px-5 py-3 text-lg text-foreground dark:text-white focus:ring-2 focus:ring-primary/40 pr-12 font-semibold shadow-sm transition-all duration-150 focus:shadow-lg focus:border-primary flex items-center justify-between gap-2 relative min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/40"
                    onClick={() => setMenuOpen((v) => !v)}
                    style={{ minHeight: '52px' }}
                  >
                    <span className="truncate text-left flex-1">{selected.name}</span>
                    <span className="pointer-events-none flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full ml-2 absolute right-3 top-1/2 -translate-y-1/2">
                      <ChevronDown className="text-primary w-7 h-7" />
                    </span>
                  </button>
                  {menuOpen && (
                    <div className="absolute left-[6px] top-full mt-0.5 w-[calc(100%-12px)] z-50 bg-background border border-border rounded-2xl shadow-xl overflow-y-auto max-h-72">
                      {ALL_QUERIES.map((row) => (
                        <button
                          key={row.name}
                          className={`w-full px-5 py-3 text-lg font-normal text-left transition-colors duration-100 cursor-pointer rounded-xl
                            ${selected.name === row.name ? 'bg-blue-50/80 dark:bg-blue-900/30 text-primary font-bold' : 'hover:bg-blue-100/60 dark:hover:bg-blue-900/20 hover:text-primary/90'}
                          `}
                          onClick={() => {
                            setSelected(row);
                            setMenuOpen(false);
                          }}
                          type="button"
                        >
                          {row.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col gap-4">
                <label className="block text-base font-semibold mb-1 text-black dark:text-white">{t('plans.count')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={count}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setCount(val);
                  }}
                  placeholder="1"
                  className="w-full rounded-xl border border-border bg-background px-5 py-3 text-lg text-foreground dark:text-white focus:ring-2 focus:ring-primary/40 font-semibold shadow-sm transition-all duration-150 focus:shadow-lg focus:border-primary hide-number-spin min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/40"
                  style={{ MozAppearance: 'textfield', minHeight: '52px' }}
                  autoComplete="off"
                />
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-black dark:text-white">
                  <span>{t('plans.total')}</span>
                  <span>{total.toLocaleString()} {t('plans.currency')}</span>
                </div>
              </div>
              <div className="w-full flex-1 flex flex-col justify-end">
                <button className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-blue-400 text-white font-bold text-xl shadow-xl mt-0 transition-all hover:scale-105 hover:shadow-primary/20 active:scale-95 active:shadow-none" onClick={handlePay}>
                  {t('plans.pay')}
                </button>
                {qr && (
                  <div className="w-full flex flex-col items-center mt-4">
                    <div className="mb-1 font-bold text-lg text-center text-black dark:text-white">{t('plans.sbp_pay')}</div>
                    <img src={`data:image/png;base64,${qr}`} alt={t('plans.sbp_qr_alt')} className="w-36 h-36 object-contain mb-1" />
                    <div className="text-xs text-muted-foreground">{t('plans.sbp_qr_hint')}</div>
                  </div>
                )}
                {payError && <div className="text-red-500 text-xs mt-1">{payError}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ section */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-bold mb-2">{t('plans.faq_title')}</h3>
        <p className="mt-3 text-muted-foreground text-base">
          {t('plans.faq_desc')}
        </p>
        <button
          className="mt-6 rounded-2xl bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/20"
          onClick={() => navigate('/contact')}
        >
          {t('plans.faq_btn')}
        </button>
      </div>
      <style>{`
        input[type=number].hide-number-spin::-webkit-outer-spin-button,
        input[type=number].hide-number-spin::-webkit-inner-spin-button,
        input[type=text].hide-number-spin::-webkit-outer-spin-button,
        input[type=text].hide-number-spin::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].hide-number-spin,
        input[type=text].hide-number-spin {
          -moz-appearance: textfield;
        }
        @media (max-width: 900px) {
          .container { flex-direction: column !important; }
          .gap-10 { gap: 1.5rem !important; }
          .max-w-xs, .max-w-sm, .max-w-3xl { max-width: 100% !important; }
          .p-6, .md\\:p-8, .p-5, .p-8 { padding: 1.2rem !important; }
          .mt-10, .md\\:mt-20 { margin-top: 1.5rem !important; }
          .grid-cols-2 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
} 