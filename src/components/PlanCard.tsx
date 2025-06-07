import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "./ui";
import { paymentAPI } from "../client/api";
import React, { useState } from "react";

interface PlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  delay?: number;
}

export function PlanCard({
  title,
  price,
  description,
  features,
  isPopular = false,
  delay = 0,
}: PlanCardProps) {
  const [qrModal, setQrModal] = useState<{qr?: string, url?: string}|null>(null);
  const [loading, setLoading] = useState(false);

  // Преобразуем цену в число (убираем символы)
  const getAmount = () => {
    const num = price.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(num).toFixed(2);
  };

  const handleBuy = async () => {
    setLoading(true);
    try {
      // Пример параметров, подставьте реальные значения merchant/terminal
      const params = {
        orderId: Date.now().toString(),
        amount: getAmount(),
        terminal: "1000",
        merchant: "777",
        description: `Покупка тарифа: ${title}`,
        clientBackUrl: window.location.origin + "/back-from-pay",
        userIp: "127.0.0.1",
        tokenType: "SBP",
        token: "eyJ1c2VySW5mbyI6e...bmFibGVkIjp0cnVlfX0=", // TODO: генерировать реально
        sign: "325...95e2", // TODO: генерировать реально
      };
      const res = await paymentAPI.paySBP(params);
      setQrModal({ qr: res.qrCodeContent, url: res.qrCodePaymentUrl });
    } catch (e) {
      alert("Ошибка оплаты через СБП");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"relative group flex-1 min-h-[430px] flex flex-col rounded-3xl bg-white/90 dark:bg-slate-900/80 p-8 shadow-lg border-0 backdrop-blur-xl transition-all duration-150 cursor-pointer overflow-hidden text-[90%] gap-4 hover:bg-[#eaf0fe] hover:shadow-2xl hover:shadow-primary/10 hover:scale-105 hover:-translate-y-0.5"}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80vw] h-[24vw] max-w-5xl rounded-full blur-[120px] opacity-30 dark:opacity-20 bg-gradient-to-br from-blue-200 via-white to-transparent dark:from-blue-900 dark:via-slate-900 dark:to-transparent z-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="relative flex flex-col flex-grow w-full"
      >
        {/* Title */}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {/* Price */}
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-extrabold tracking-tight">{price}</span>
          <span className="ml-1 text-muted-foreground text-base">/месяц</span>
        </div>
        {/* Description */}
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        {/* Features */}
        <ul className="mt-5 space-y-3 text-sm">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 * index }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
        {/* CTA Button */}
        <div className="mt-auto pt-6">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-base font-medium shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 h-11"
            size="lg"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Выбрать план"}
          </Button>
        </div>
        {/* Модальное окно с QR */}
        {qrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-xs w-full relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setQrModal(null)}>&times;</button>
              <div className="mb-4 font-bold text-lg text-center">Оплата через СБП</div>
              {qrModal.qr && (
                <img src={`data:image/png;base64,${qrModal.qr}`} alt="QR для оплаты" className="w-48 h-48 object-contain mb-4" />
              )}
              <a href={qrModal.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">Открыть страницу оплаты</a>
            </div>
          </div>
        )}
      </motion.div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
    </div>
  );
} 