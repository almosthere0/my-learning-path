import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar = ({ 
  progress, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: ProgressBarProps) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 progress-bar-track ${heights[size]}`}>
        <motion.div
          className="progress-bar-fill"
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-primary min-w-[3rem] text-right">
          {progress}%
        </span>
      )}
    </div>
  );
};
