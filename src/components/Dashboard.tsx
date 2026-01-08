import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { MotivationalBanner } from './MotivationalBanner';
import { RoadmapCard } from './RoadmapCard';
import { 
  Target, 
  CheckCircle2, 
  FolderOpen, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onSelectRoadmap: (id: string) => void;
}

export const Dashboard = ({ onSelectRoadmap }: DashboardProps) => {
  const { 
    roadmaps, 
    categories, 
    getProgress, 
    getOverallProgress,
    getCategoryProgress 
  } = useRoadmapStore();

  const overallProgress = getOverallProgress();
  const totalSteps = roadmaps.reduce((sum, r) => sum + r.steps.length, 0);
  const completedSteps = roadmaps.reduce(
    (sum, r) => sum + r.steps.filter(s => s.completed).length, 
    0
  );

  const recentRoadmaps = [...roadmaps]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-primary">$</span>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <span className="typing-cursor text-primary">_</span>
        </div>
        <p className="text-muted-foreground">
          Welcome back! Here's your learning progress overview.
        </p>
      </motion.div>

      {/* Motivational Banner */}
      <MotivationalBanner progress={overallProgress} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={overallProgress}
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          title="Active Roadmaps"
          value={roadmaps.length}
          subtitle={`${categories.length} categories`}
          icon={Target}
          delay={0.2}
        />
        <StatCard
          title="Completed Steps"
          value={completedSteps}
          subtitle={`of ${totalSteps} total`}
          icon={CheckCircle2}
          delay={0.3}
        />
        <StatCard
          title="Categories"
          value={categories.length}
          subtitle="organized topics"
          icon={FolderOpen}
          delay={0.4}
        />
      </div>

      {/* Category Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="terminal-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Progress by Category</h2>
        </div>
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryProgress = getCategoryProgress(category.id);
            const roadmapCount = roadmaps.filter(r => r.categoryId === category.id).length;
            
            if (roadmapCount === 0) return null;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                    <span className="text-xs text-muted-foreground">
                      ({roadmapCount} roadmap{roadmapCount !== 1 ? 's' : ''})
                    </span>
                  </span>
                </div>
                <ProgressBar progress={categoryProgress} size="sm" />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Roadmaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              category={categories.find(c => c.id === roadmap.categoryId)}
              progress={getProgress(roadmap)}
              onClick={() => onSelectRoadmap(roadmap.id)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
