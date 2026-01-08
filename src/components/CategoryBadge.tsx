import { Category } from '@/types/roadmap';

interface CategoryBadgeProps {
  category?: Category;
  size?: 'sm' | 'md';
}

const colorClasses: Record<Category['color'], string> = {
  green: 'bg-terminal-green/10 text-terminal-green border-terminal-green/30',
  cyan: 'bg-terminal-cyan/10 text-terminal-cyan border-terminal-cyan/30',
  yellow: 'bg-terminal-yellow/10 text-terminal-yellow border-terminal-yellow/30',
  orange: 'bg-terminal-orange/10 text-terminal-orange border-terminal-orange/30',
  purple: 'bg-terminal-purple/10 text-terminal-purple border-terminal-purple/30',
  pink: 'bg-terminal-pink/10 text-terminal-pink border-terminal-pink/30',
};

export const CategoryBadge = ({ category, size = 'md' }: CategoryBadgeProps) => {
  if (!category) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border ${size === 'sm' ? 'text-[10px] px-2' : ''}`}>
        📁 Uncategorized
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium border ${colorClasses[category.color]} ${size === 'sm' ? 'text-[10px] px-2' : 'text-xs'}`}>
      {category.icon} {category.name}
    </span>
  );
};
