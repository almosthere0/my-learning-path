import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { ProgressBar } from './ProgressBar';
import { calculateLevel } from '@/types/roadmap';
import { Trophy, Lock, Star, Flame, Target, Clock, Sparkles, Award } from 'lucide-react';

export const Achievements = () => {
  const { achievements, totalXP, level } = useRoadmapStore();
  const { currentXP, requiredXP } = calculateLevel(totalXP);
  
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'completion': return Target;
      case 'streak': return Flame;
      case 'study': return Clock;
      case 'milestone': return Star;
      case 'special': return Sparkles;
      default: return Trophy;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'completion': return 'text-terminal-cyan';
      case 'streak': return 'text-terminal-orange';
      case 'study': return 'text-terminal-purple';
      case 'milestone': return 'text-terminal-yellow';
      case 'special': return 'text-terminal-pink';
      default: return 'text-primary';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header with XP */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-8 h-8 text-terminal-yellow" />
              Achievements
            </h1>
            <p className="text-muted-foreground">
              Unlock badges by completing learning milestones
            </p>
          </div>
          
          <div className="terminal-card p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center terminal-glow">
                <span className="text-xl font-bold text-primary">{level}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Level {level}</p>
                <p className="text-lg font-bold text-foreground">{totalXP.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentXP} / {requiredXP}</span>
                <span>Next Level</span>
              </div>
              <ProgressBar progress={(currentXP / requiredXP) * 100} size="sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="terminal-card p-4 text-center">
          <Award className="w-8 h-8 mx-auto text-terminal-yellow mb-2" />
          <p className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</p>
          <p className="text-sm text-muted-foreground">Unlocked</p>
        </div>
        <div className="terminal-card p-4 text-center">
          <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-2xl font-bold text-foreground">{lockedAchievements.length}</p>
          <p className="text-sm text-muted-foreground">Locked</p>
        </div>
        <div className="terminal-card p-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {unlockedAchievements.reduce((sum, a) => sum + a.xp, 0)}
          </p>
          <p className="text-sm text-muted-foreground">XP Earned</p>
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-terminal-yellow" />
            Unlocked ({unlockedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement, i) => {
              const CategoryIcon = getCategoryIcon(achievement.category);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="terminal-card p-4 border-primary/30 bg-primary/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                        <span className="text-xs text-primary font-mono">+{achievement.xp} XP</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <CategoryIcon className={`w-3 h-3 ${getCategoryColor(achievement.category)}`} />
                        <span className="text-xs text-muted-foreground capitalize">{achievement.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Locked Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5 text-muted-foreground" />
          Locked ({lockedAchievements.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements
            .sort((a, b) => (b.progress || 0) - (a.progress || 0))
            .map((achievement, i) => {
              const CategoryIcon = getCategoryIcon(achievement.category);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  className="terminal-card p-4 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                        <span className="text-xs text-muted-foreground font-mono">+{achievement.xp} XP</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      <div className="mt-2 space-y-1">
                        <ProgressBar progress={achievement.progress || 0} size="sm" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className={`w-3 h-3 ${getCategoryColor(achievement.category)}`} />
                            <span className="text-xs text-muted-foreground capitalize">{achievement.category}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{Math.round(achievement.progress || 0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
};
