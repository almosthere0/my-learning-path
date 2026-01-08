import { motion } from 'framer-motion';
import { Roadmap, Category } from '@/types/roadmap';
import { ProgressBar } from './ProgressBar';
import { CategoryBadge } from './CategoryBadge';
import { ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: Roadmap;
  category?: Category;
  progress: number;
  onClick: () => void;
}

export const RoadmapCard = ({ roadmap, category, progress, onClick }: RoadmapCardProps) => {
  const completedSteps = roadmap.steps.filter(s => s.completed).length;
  const totalSteps = roadmap.steps.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="terminal-card p-5 cursor-pointer group transition-all duration-300 hover:border-primary/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {roadmap.title}
          </h3>
          {roadmap.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {roadmap.description}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <CategoryBadge category={category} size="sm" />
      </div>

      <ProgressBar progress={progress} size="sm" />

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{completedSteps}/{totalSteps} steps</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(roadmap.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};
