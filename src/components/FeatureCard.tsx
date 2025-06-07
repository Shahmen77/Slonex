import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div className={`relative group flex-1 flex flex-col rounded-3xl bg-white/90 dark:bg-slate-900/80 p-8 shadow-lg border-0 backdrop-blur-xl transition-all duration-150 cursor-pointer overflow-hidden text-[90%] gap-4 min-h-[150px] md:min-h-[170px] hover:bg-[#eaf0fe] hover:shadow-2xl hover:shadow-primary/10 hover:scale-105 hover:-translate-y-0.5`}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60vw] h-[18vw] max-w-3xl rounded-full blur-3xl opacity-40 dark:opacity-30 bg-gradient-to-br from-blue-200 via-white to-transparent dark:from-blue-900 dark:via-slate-900 dark:to-transparent z-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="relative z-10 flex flex-col h-full w-full"
      >
        {/* Icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-primary transition-transform duration-200 group-hover:scale-110 shadow-sm">
          {icon}
        </div>
        {/* Title */}
        <h3 className="text-2xl font-extrabold mb-2 text-foreground group-hover:text-primary transition-colors duration-200">{title}</h3>
        {/* Description */}
        <p className="mt-1 text-lg text-muted-foreground group-hover:text-foreground/90 transition-colors duration-200">{description}</p>
      </motion.div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
    </div>
  );
} 