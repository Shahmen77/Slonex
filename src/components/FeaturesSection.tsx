import {
  BarChart3,
  Shield,
  Zap,
  Users,
  LineChart,
  Settings,
} from "lucide-react";
import { SectionHero } from "./SectionHero";
import { FeatureCard } from "./FeatureCard";
import { useLanguage } from '../hooks/useLanguage';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function FeaturesSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const features = [
    {
      icon: BarChart3,
      title: t('features.analytics_title'),
      description: t('features.analytics_desc'),
    },
    {
      icon: Shield,
      title: t('features.security_title'),
      description: t('features.security_desc'),
    },
    {
      icon: Zap,
      title: t('features.automation_title'),
      description: t('features.automation_desc'),
    },
    {
      icon: Users,
      title: t('features.teamwork_title'),
      description: t('features.teamwork_desc'),
    },
    {
      icon: LineChart,
      title: t('features.monitoring_title'),
      description: t('features.monitoring_desc'),
    },
    {
      icon: Settings,
      title: t('features.integration_title'),
      description: t('features.integration_desc'),
    },
  ];
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHero
          icon={BarChart3}
          title={t('features.section_title')}
          description={t('features.section_desc')}
        />

        {/* Features grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="h-7 w-7" />}
              title={feature.title}
              description={feature.description}
              delay={0.2 * index}
            />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold">{t('features.cta_title')}</h3>
          <p className="mt-4 text-muted-foreground">
            {t('features.cta_desc')}
          </p>
          <button
            className="mt-8 rounded-full bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/20"
            onClick={() => navigate('/contact')}
          >
            {t('features.cta_btn')}
          </button>
        </div>
      </div>
    </section>
  );
} 