import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { ProgressBar } from './ProgressBar';
import { calculateLevel } from '@/types/roadmap';
import { 
  Sword, 
  CheckCircle, 
  Clock, 
  Lock, 
  Flame,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Quests = () => {
  const { quests, totalXP } = useRoadmapStore();
  const { currentXP, requiredXP } = calculateLevel(totalXP);
  
  const inProgressQuests = quests.filter(q => q.status === 'in_progress');
  const availableQuests = quests.filter(q => q.status === 'available');
  const completedQuests = quests.filter(q => q.status === 'completed');
  const lockedQuests = quests.filter(q => q.status === 'locked');
  
  const totalAvailableXP = [...availableQuests, ...inProgressQuests].reduce((sum, q) => sum + q.xp, 0);
  
  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return Clock;
      case 'weekly': return Target;
      case 'special': return Star;
      default: return Sword;
    }
  };
  
  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'text-terminal-cyan border-terminal-cyan/30 bg-terminal-cyan/10';
      case 'weekly': return 'text-terminal-purple border-terminal-purple/30 bg-terminal-purple/10';
      case 'special': return 'text-terminal-yellow border-terminal-yellow/30 bg-terminal-yellow/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  const QuestCard = ({ quest, index }: { quest: typeof quests[0], index: number }) => {
    const TypeIcon = getQuestTypeIcon(quest.type);
    const progress = (quest.requirement.current / quest.requirement.value) * 100;
    const isLocked = quest.status === 'locked';
    const isCompleted = quest.status === 'completed';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`terminal-card p-4 ${isLocked ? 'opacity-50' : ''} ${isCompleted ? 'border-primary/30 bg-primary/5' : ''}`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getQuestTypeColor(quest.type)}`}>
            {isLocked ? <Lock className="w-5 h-5" /> : isCompleted ? <CheckCircle className="w-5 h-5 text-primary" /> : <TypeIcon className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{quest.title}</h3>
              <span className={`text-sm font-mono ${isCompleted ? 'text-primary' : 'text-terminal-yellow'}`}>
                +{quest.xp} XP
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
            
            {!isLocked && !isCompleted && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{quest.requirement.current} / {quest.requirement.value}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} size="sm" />
              </div>
            )}
            
            {isCompleted && (
              <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="w-4 h-4" />
                <span>Completed!</span>
              </div>
            )}
            
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getQuestTypeColor(quest.type)}`}>
                {quest.type}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Sword className="w-8 h-8 text-terminal-orange" />
              Quests
            </h1>
            <p className="text-muted-foreground">
              Complete challenges to earn XP and unlock rewards
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="terminal-card p-4 text-center">
          <Flame className="w-6 h-6 mx-auto text-terminal-orange mb-1" />
          <p className="text-xl font-bold text-foreground">{inProgressQuests.length}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="terminal-card p-4 text-center">
          <Target className="w-6 h-6 mx-auto text-terminal-cyan mb-1" />
          <p className="text-xl font-bold text-foreground">{availableQuests.length}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
        <div className="terminal-card p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto text-primary mb-1" />
          <p className="text-xl font-bold text-foreground">{completedQuests.length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="terminal-card p-4 text-center">
          <Lock className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-xl font-bold text-foreground">{lockedQuests.length}</p>
          <p className="text-xs text-muted-foreground">Locked</p>
        </div>
        <div className="terminal-card p-4 text-center border-terminal-yellow/30">
          <Zap className="w-6 h-6 mx-auto text-terminal-yellow mb-1" />
          <p className="text-xl font-bold text-terminal-yellow">{totalAvailableXP}</p>
          <p className="text-xs text-muted-foreground">XP Available</p>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="terminal-card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Level Progress</span>
          <span className="text-sm font-mono text-primary">{currentXP} / {requiredXP} XP</span>
        </div>
        <ProgressBar progress={(currentXP / requiredXP) * 100} size="md" />
      </motion.div>

      {/* Quest Tabs */}
      <Tabs defaultValue="in_progress" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="in_progress" className="gap-2">
            <Flame className="w-4 h-4" />
            In Progress ({inProgressQuests.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2">
            <Target className="w-4 h-4" />
            Available ({availableQuests.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed ({completedQuests.length})
          </TabsTrigger>
          <TabsTrigger value="locked" className="gap-2">
            <Lock className="w-4 h-4" />
            Locked ({lockedQuests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in_progress" className="space-y-4">
          {inProgressQuests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {inProgressQuests.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} />
              ))}
            </div>
          ) : (
            <div className="terminal-card p-8 text-center text-muted-foreground">
              <Flame className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No quests in progress. Start a quest from the Available tab!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableQuests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {availableQuests.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} />
              ))}
            </div>
          ) : (
            <div className="terminal-card p-8 text-center text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>All quests are either in progress or completed!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {completedQuests.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} />
              ))}
            </div>
          ) : (
            <div className="terminal-card p-8 text-center text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No completed quests yet. Keep going!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          {lockedQuests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {lockedQuests.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} />
              ))}
            </div>
          ) : (
            <div className="terminal-card p-8 text-center text-muted-foreground">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>All special quests are unlocked!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
