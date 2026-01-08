import { motion } from 'framer-motion';
import { Step } from '@/types/roadmap';
import { Check, Circle, Trash2 } from 'lucide-react';

interface StepItemProps {
  step: Step;
  onToggle: () => void;
  onDelete: () => void;
}

export const StepItem = ({ step, onToggle, onDelete }: StepItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
        step.completed
          ? 'bg-primary/5 border-primary/20'
          : 'bg-muted/30 border-border hover:border-primary/30'
      }`}
    >
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          step.completed
            ? 'bg-primary border-primary'
            : 'border-muted-foreground hover:border-primary'
        }`}
      >
        {step.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-3 h-3 text-primary-foreground" />
          </motion.div>
        )}
      </button>
      
      <span
        className={`flex-1 text-sm transition-all duration-200 ${
          step.completed
            ? 'text-muted-foreground line-through'
            : 'text-foreground'
        }`}
      >
        {step.title}
      </span>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-destructive transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
