import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function SectionHero({ icon: Icon, title, description, className }: SectionHeroProps) {
  return (
    <div className={`relative w-full overflow-hidden py-10 ${className || ''}`}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-primary/5 to-background/0" />
      <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {/* Icon with glassmorphism effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 max-w-2xl text-xl text-muted-foreground"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
} 