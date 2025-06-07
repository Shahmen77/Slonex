import { motion } from "framer-motion";
import { Button } from "./ui";
import { useLanguage } from '../hooks/useLanguage';

export function ContactForm() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl bg-background/80 p-8 shadow-lg backdrop-blur-sm"
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-primary/10" />

      <div className="relative">
        <form className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              {t('contact.form.name')}
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('contact.form.name_placeholder')}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              {t('contact.form.email')}
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('contact.form.email_placeholder')}
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-foreground"
            >
              {t('contact.form.message')}
            </label>
            <textarea
              id="message"
              rows={4}
              className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('contact.form.message_placeholder')}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-lg font-medium shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 py-5 h-14 flex items-center justify-center"
            size="lg"
          >
            {t('contact.form.submit')}
          </Button>
        </form>
      </div>
    </motion.div>
  );
} 