import { Mail, Phone, MapPin } from "lucide-react";
import { SectionHero } from "./SectionHero";
import { ContactForm } from "./ContactForm";
import { useLanguage } from '../hooks/useLanguage';

export function ContactSection() {
  const { t } = useLanguage();
  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.phone'),
      description: t('contact.phone_value'),
    },
    {
      icon: Mail,
      title: t('contact.email'),
      description: t('contact.email_value'),
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      description: t('contact.address_value'),
    },
  ];
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHero
          icon={Mail}
          title={t('contact.title')}
          description={t('contact.desc')}
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="flex items-start gap-4 rounded-2xl bg-white/80 dark:bg-card/80 border border-border shadow-2xl p-7 md:p-8 backdrop-blur-xl transition-all duration-200 group"
                style={{ boxShadow: '0 8px 32px 0 rgba(30,64,175,0.10)' }}
              >
                <div className={
                  'flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40 text-primary'
                }>
                  <info.icon className="h-8 w-8 mx-auto" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">{info.title}</h3>
                  <p className="mt-1 text-base text-muted-foreground">
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="w-full min-h-[420px] flex flex-col transition-all duration-300">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
} 