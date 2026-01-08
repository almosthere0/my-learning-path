import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { MOTIVATIONAL_MESSAGES } from '@/types/roadmap';
import { Sparkles, Trophy, Rocket, Target } from 'lucide-react';

interface MotivationalBannerProps {
  progress: number;
}

export const MotivationalBanner = ({ progress }: MotivationalBannerProps) => {
  const { message, icon, colorClass } = useMemo(() => {
    let messages: string[];
    let Icon: typeof Sparkles;
    let color: string;

    if (progress === 0) {
      messages = MOTIVATIONAL_MESSAGES.starting;
      Icon = Rocket;
      color = 'text-terminal-cyan';
    } else if (progress < 50) {
      messages = MOTIVATIONAL_MESSAGES.inProgress;
      Icon = Target;
      color = 'text-terminal-yellow';
    } else if (progress < 100) {
      messages = MOTIVATIONAL_MESSAGES.almostDone;
      Icon = Sparkles;
      color = 'text-terminal-orange';
    } else {
      messages = MOTIVATIONAL_MESSAGES.completed;
      Icon = Trophy;
      color = 'text-primary';
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return { message: randomMessage, icon: Icon, colorClass: color };
  }, [progress]);

  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-card p-4 flex items-center gap-4 border-l-4 border-l-primary"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </motion.div>
      <p className="text-sm text-foreground/90 italic">
        "{message}"
      </p>
    </motion.div>
  );
};
