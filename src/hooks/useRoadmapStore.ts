import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Roadmap, Category, Step, AppState, PomodoroSession, DailyActivity, Resource,
  Achievement, Quest, ActivityLog, UserSettings,
  DEFAULT_ACHIEVEMENTS, DEFAULT_QUESTS, DEFAULT_SETTINGS, calculateLevel
} from '@/types/roadmap';
import { format, differenceInDays, parseISO, startOfDay } from 'date-fns';

const STORAGE_KEY = 'learning-roadmap-data';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'programming', name: 'Programming', color: 'cyan', icon: '💻' },
  { id: 'mathematics', name: 'Mathematics', color: 'purple', icon: '📐' },
  { id: 'languages', name: 'Languages', color: 'yellow', icon: '🌍' },
  { id: 'science', name: 'Science', color: 'green', icon: '🔬' },
  { id: 'arts', name: 'Arts & Design', color: 'pink', icon: '🎨' },
  { id: 'business', name: 'Business', color: 'orange', icon: '📊' },
];

const createStep = (title: string, completed: boolean = false): Step => ({
  id: uuidv4(),
  title,
  completed,
  createdAt: new Date().toISOString(),
  completedAt: completed ? new Date().toISOString() : undefined,
  resources: [],
});

const SAMPLE_ROADMAPS: Roadmap[] = [
  {
    id: uuidv4(),
    title: 'Learn React Fundamentals',
    description: 'Master the core concepts of React including components, hooks, and state management.',
    categoryId: 'programming',
    totalStudyTime: 120,
    steps: [
      createStep('Understand JSX syntax', true),
      createStep('Learn useState and useEffect hooks', true),
      createStep('Build reusable components', false),
      createStep('Implement context API', false),
      createStep('Master React Router', false),
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Spanish Language Basics',
    description: 'Learn conversational Spanish for travel and everyday communication.',
    categoryId: 'languages',
    totalStudyTime: 90,
    steps: [
      createStep('Learn basic greetings', true),
      createStep('Master numbers and time', true),
      createStep('Study common verbs', true),
      createStep('Practice conversations', false),
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Linear Algebra Essentials',
    description: 'Build a strong foundation in linear algebra for machine learning.',
    categoryId: 'mathematics',
    totalStudyTime: 45,
    steps: [
      createStep('Vectors and vector spaces', true),
      createStep('Matrix operations', false),
      createStep('Eigenvalues and eigenvectors', false),
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getDefaultState = (): AppState => ({
  roadmaps: SAMPLE_ROADMAPS,
  categories: DEFAULT_CATEGORIES,
  pomodoroSessions: [],
  dailyActivities: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalXP: 0,
  level: 1,
  achievements: DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })),
  quests: DEFAULT_QUESTS.map(q => ({ ...q })),
  activityLog: [],
  settings: { ...DEFAULT_SETTINGS },
});

const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const defaultState = getDefaultState();
      return {
        ...defaultState,
        ...parsed,
        roadmaps: (parsed.roadmaps || []).map((r: Roadmap) => ({
          ...r,
          totalStudyTime: r.totalStudyTime || 0,
          steps: (r.steps || []).map((s: Step) => ({
            ...s,
            resources: s.resources || [],
          })),
        })),
        achievements: parsed.achievements || defaultState.achievements,
        quests: parsed.quests || defaultState.quests,
        activityLog: parsed.activityLog || [],
        settings: { ...defaultState.settings, ...parsed.settings },
        totalXP: parsed.totalXP || 0,
        level: parsed.level || 1,
      };
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return getDefaultState();
};

const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const useRoadmapStore = () => {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // XP and Level Management
  const addXP = useCallback((amount: number, reason: string, relatedId?: string) => {
    setState(prev => {
      const newXP = prev.totalXP + amount;
      const { level } = calculateLevel(newXP);
      
      const newActivity: ActivityLog = {
        id: uuidv4(),
        type: 'step_completed',
        title: reason,
        description: `Earned ${amount} XP`,
        xp: amount,
        timestamp: new Date().toISOString(),
        relatedId,
      };
      
      return {
        ...prev,
        totalXP: newXP,
        level,
        activityLog: [newActivity, ...prev.activityLog].slice(0, 100),
      };
    });
  }, []);

  // Achievement checking
  const checkAchievements = useCallback(() => {
    setState(prev => {
      const completedSteps = prev.roadmaps.reduce((acc, r) => acc + r.steps.filter(s => s.completed).length, 0);
      const completedRoadmaps = prev.roadmaps.filter(r => r.steps.length > 0 && r.steps.every(s => s.completed)).length;
      const totalStudyMinutes = prev.roadmaps.reduce((acc, r) => acc + r.totalStudyTime, 0);
      const completedQuests = prev.quests.filter(q => q.status === 'completed').length;
      
      let xpGained = 0;
      const newActivities: ActivityLog[] = [];
      
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.unlockedAt) return achievement;
        
        let progress = 0;
        let shouldUnlock = false;
        
        switch (achievement.requirement.type) {
          case 'steps_completed':
            progress = Math.min(completedSteps / achievement.requirement.value * 100, 100);
            shouldUnlock = completedSteps >= achievement.requirement.value;
            break;
          case 'roadmaps_completed':
            progress = Math.min(completedRoadmaps / achievement.requirement.value * 100, 100);
            shouldUnlock = completedRoadmaps >= achievement.requirement.value;
            break;
          case 'streak_days':
            progress = Math.min(prev.currentStreak / achievement.requirement.value * 100, 100);
            shouldUnlock = prev.currentStreak >= achievement.requirement.value;
            break;
          case 'study_minutes':
            progress = Math.min(totalStudyMinutes / achievement.requirement.value * 100, 100);
            shouldUnlock = totalStudyMinutes >= achievement.requirement.value;
            break;
          case 'quests_completed':
            progress = Math.min(completedQuests / achievement.requirement.value * 100, 100);
            shouldUnlock = completedQuests >= achievement.requirement.value;
            break;
        }
        
        if (shouldUnlock) {
          xpGained += achievement.xp;
          newActivities.push({
            id: uuidv4(),
            type: 'achievement_earned',
            title: `Earned badge: ${achievement.name}`,
            description: achievement.description,
            xp: achievement.xp,
            timestamp: new Date().toISOString(),
            relatedId: achievement.id,
          });
          return { ...achievement, unlockedAt: new Date().toISOString(), progress: 100 };
        }
        
        return { ...achievement, progress };
      });
      
      const newXP = prev.totalXP + xpGained;
      const { level } = calculateLevel(newXP);
      
      return {
        ...prev,
        achievements: updatedAchievements,
        totalXP: newXP,
        level,
        activityLog: [...newActivities, ...prev.activityLog].slice(0, 100),
      };
    });
  }, []);

  // Quest progress update
  const updateQuestProgress = useCallback((type: Quest['requirement']['type'], amount: number) => {
    setState(prev => {
      let xpGained = 0;
      const newActivities: ActivityLog[] = [];
      
      const updatedQuests = prev.quests.map(quest => {
        if (quest.status === 'completed' || quest.status === 'locked') return quest;
        if (quest.requirement.type !== type) return quest;
        
        const newCurrent = quest.requirement.current + amount;
        const isCompleted = newCurrent >= quest.requirement.value;
        
        if (isCompleted) {
          xpGained += quest.xp;
          newActivities.push({
            id: uuidv4(),
            type: 'quest_completed',
            title: `Completed quest: ${quest.title}`,
            description: quest.description,
            xp: quest.xp,
            timestamp: new Date().toISOString(),
            relatedId: quest.id,
          });
          return {
            ...quest,
            requirement: { ...quest.requirement, current: newCurrent },
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
          };
        }
        
        return {
          ...quest,
          requirement: { ...quest.requirement, current: newCurrent },
          status: newCurrent > 0 ? 'in_progress' as const : quest.status,
        };
      });
      
      const newXP = prev.totalXP + xpGained;
      const { level } = calculateLevel(newXP);
      
      return {
        ...prev,
        quests: updatedQuests,
        totalXP: newXP,
        level,
        activityLog: [...newActivities, ...prev.activityLog].slice(0, 100),
      };
    });
  }, []);

  // Streak calculation
  const updateStreak = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    setState(prev => {
      if (prev.lastActiveDate === today) {
        return prev;
      }
      
      const lastDate = prev.lastActiveDate ? parseISO(prev.lastActiveDate) : null;
      const daysDiff = lastDate ? differenceInDays(startOfDay(new Date()), startOfDay(lastDate)) : Infinity;
      
      let newStreak = prev.currentStreak;
      if (daysDiff === 1) {
        newStreak = prev.currentStreak + 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      } else if (daysDiff === 0) {
        newStreak = prev.currentStreak || 1;
      }
      
      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
      };
    });
  }, []);

  const recordDailyActivity = useCallback((stepsCompleted: number, pomodoroMinutes: number, roadmapId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    setState(prev => {
      const existingIndex = prev.dailyActivities.findIndex(a => a.date === today);
      
      if (existingIndex >= 0) {
        const updated = [...prev.dailyActivities];
        updated[existingIndex] = {
          ...updated[existingIndex],
          stepsCompleted: updated[existingIndex].stepsCompleted + stepsCompleted,
          pomodoroMinutes: updated[existingIndex].pomodoroMinutes + pomodoroMinutes,
          roadmapsWorkedOn: [...new Set([...updated[existingIndex].roadmapsWorkedOn, roadmapId])],
        };
        return { ...prev, dailyActivities: updated };
      }
      
      return {
        ...prev,
        dailyActivities: [...prev.dailyActivities, {
          date: today,
          stepsCompleted,
          pomodoroMinutes,
          roadmapsWorkedOn: [roadmapId],
        }],
      };
    });
    
    updateStreak();
  }, [updateStreak]);

  const addRoadmap = useCallback((roadmap: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoadmap: Roadmap = {
      ...roadmap,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      roadmaps: [...prev.roadmaps, newRoadmap],
    }));
    return newRoadmap;
  }, []);

  const updateRoadmap = useCallback((id: string, updates: Partial<Omit<Roadmap, 'id' | 'createdAt'>>) => {
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  }, []);

  const deleteRoadmap = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.filter(r => r.id !== id),
    }));
  }, []);

  const addStep = useCallback((roadmapId: string, step: Omit<Step, 'id' | 'createdAt' | 'completed' | 'resources'>) => {
    const newStep: Step = {
      ...step,
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
      resources: [],
    };
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r =>
        r.id === roadmapId
          ? { ...r, steps: [...r.steps, newStep], updatedAt: new Date().toISOString() }
          : r
      ),
    }));
    return newStep;
  }, []);

  const updateStep = useCallback((roadmapId: string, stepId: string, updates: Partial<Step>) => {
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r =>
        r.id === roadmapId
          ? {
              ...r,
              steps: r.steps.map(s => s.id === stepId ? { ...s, ...updates } : s),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  }, []);

  const toggleStep = useCallback((roadmapId: string, stepId: string) => {
    setState(prev => {
      const roadmap = prev.roadmaps.find(r => r.id === roadmapId);
      const step = roadmap?.steps.find(s => s.id === stepId);
      const wasCompleted = step?.completed;
      
      const newActivity: ActivityLog | null = !wasCompleted ? {
        id: uuidv4(),
        type: 'step_completed',
        title: `Completed: ${step?.title || 'Step'}`,
        description: `From ${roadmap?.title || 'Roadmap'}`,
        xp: 50,
        timestamp: new Date().toISOString(),
        relatedId: stepId,
      } : null;
      
      return {
        ...prev,
        roadmaps: prev.roadmaps.map(r =>
          r.id === roadmapId
            ? {
                ...r,
                steps: r.steps.map(s =>
                  s.id === stepId
                    ? {
                        ...s,
                        completed: !s.completed,
                        completedAt: !s.completed ? new Date().toISOString() : undefined,
                      }
                    : s
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        ),
        totalXP: wasCompleted ? prev.totalXP : prev.totalXP + 50,
        activityLog: newActivity ? [newActivity, ...prev.activityLog].slice(0, 100) : prev.activityLog,
      };
    });
    
    // Record activity and update quests
    recordDailyActivity(1, 0, roadmapId);
    updateQuestProgress('complete_steps', 1);
    checkAchievements();
  }, [recordDailyActivity, updateQuestProgress, checkAchievements]);

  const deleteStep = useCallback((roadmapId: string, stepId: string) => {
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r =>
        r.id === roadmapId
          ? {
              ...r,
              steps: r.steps.filter(s => s.id !== stepId),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  }, []);

  const addResourceToStep = useCallback((roadmapId: string, stepId: string, resource: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      ...resource,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r =>
        r.id === roadmapId
          ? {
              ...r,
              steps: r.steps.map(s =>
                s.id === stepId
                  ? { ...s, resources: [...s.resources, newResource] }
                  : s
              ),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
    
    return newResource;
  }, []);

  const removeResourceFromStep = useCallback((roadmapId: string, stepId: string, resourceId: string) => {
    setState(prev => ({
      ...prev,
      roadmaps: prev.roadmaps.map(r =>
        r.id === roadmapId
          ? {
              ...r,
              steps: r.steps.map(s =>
                s.id === stepId
                  ? { ...s, resources: s.resources.filter(res => res.id !== resourceId) }
                  : s
              ),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  }, []);

  // Pomodoro session management
  const addPomodoroSession = useCallback((roadmapId: string, duration: number, completed: boolean) => {
    const session: PomodoroSession = {
      id: uuidv4(),
      roadmapId,
      startTime: new Date(Date.now() - duration * 60000).toISOString(),
      endTime: new Date().toISOString(),
      duration,
      completed,
    };
    
    const newActivity: ActivityLog = {
      id: uuidv4(),
      type: 'pomodoro_completed',
      title: 'Pomodoro Session Complete',
      description: `${duration} minutes of focused study`,
      xp: Math.floor(duration * 2),
      timestamp: new Date().toISOString(),
      relatedId: roadmapId,
    };
    
    setState(prev => ({
      ...prev,
      pomodoroSessions: [...prev.pomodoroSessions, session],
      roadmaps: prev.roadmaps.map(r =>
        r.id === roadmapId
          ? { ...r, totalStudyTime: r.totalStudyTime + duration }
          : r
      ),
      totalXP: prev.totalXP + Math.floor(duration * 2),
      activityLog: [newActivity, ...prev.activityLog].slice(0, 100),
    }));
    
    recordDailyActivity(0, duration, roadmapId);
    updateQuestProgress('study_minutes', duration);
    updateQuestProgress('pomodoro_sessions', 1);
    checkAchievements();
    
    return session;
  }, [recordDailyActivity, updateQuestProgress, checkAchievements]);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    };
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Omit<Category, 'id'>>) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      roadmaps: prev.roadmaps.map(r =>
        r.categoryId === id ? { ...r, categoryId: '' } : r
      ),
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const exportData = useCallback((format: 'json' | 'markdown') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning-roadmaps-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let markdown = '# Learning Roadmaps\n\n';
      state.roadmaps.forEach(roadmap => {
        const category = state.categories.find(c => c.id === roadmap.categoryId);
        const progress = roadmap.steps.length > 0
          ? Math.round((roadmap.steps.filter(s => s.completed).length / roadmap.steps.length) * 100)
          : 0;
        markdown += `## ${roadmap.title}\n`;
        markdown += `**Category:** ${category?.name || 'Uncategorized'}\n`;
        markdown += `**Progress:** ${progress}%\n`;
        markdown += `**Study Time:** ${Math.floor(roadmap.totalStudyTime / 60)}h ${roadmap.totalStudyTime % 60}m\n\n`;
        if (roadmap.description) {
          markdown += `${roadmap.description}\n\n`;
        }
        markdown += '### Steps\n';
        roadmap.steps.forEach(step => {
          markdown += `- [${step.completed ? 'x' : ' '}] ${step.title}`;
          if (step.dueDate) {
            markdown += ` (Due: ${step.dueDate})`;
          }
          markdown += '\n';
          if (step.resources.length > 0) {
            step.resources.forEach(res => {
              markdown += `  - ${res.type === 'link' ? `[${res.title}](${res.content})` : res.title}\n`;
            });
          }
        });
        markdown += '\n---\n\n';
      });
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning-roadmaps-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [state]);

  const importData = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as AppState;
      if (imported.roadmaps && imported.categories) {
        setState({
          ...getDefaultState(),
          ...imported,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const getProgress = useCallback((roadmap: Roadmap) => {
    if (roadmap.steps.length === 0) return 0;
    return Math.round((roadmap.steps.filter(s => s.completed).length / roadmap.steps.length) * 100);
  }, []);

  const getOverallProgress = useCallback(() => {
    const allSteps = state.roadmaps.flatMap(r => r.steps);
    if (allSteps.length === 0) return 0;
    return Math.round((allSteps.filter(s => s.completed).length / allSteps.length) * 100);
  }, [state.roadmaps]);

  const getCategoryProgress = useCallback((categoryId: string) => {
    const categoryRoadmaps = state.roadmaps.filter(r => r.categoryId === categoryId);
    const allSteps = categoryRoadmaps.flatMap(r => r.steps);
    if (allSteps.length === 0) return 0;
    return Math.round((allSteps.filter(s => s.completed).length / allSteps.length) * 100);
  }, [state.roadmaps]);

  const getUpcomingDueDates = useCallback(() => {
    const now = new Date();
    const upcoming: { step: Step; roadmap: Roadmap }[] = [];
    
    state.roadmaps.forEach(roadmap => {
      roadmap.steps.forEach(step => {
        if (step.dueDate && !step.completed) {
          const dueDate = parseISO(step.dueDate);
          if (dueDate >= now) {
            upcoming.push({ step, roadmap });
          }
        }
      });
    });
    
    return upcoming.sort((a, b) => 
      new Date(a.step.dueDate!).getTime() - new Date(b.step.dueDate!).getTime()
    );
  }, [state.roadmaps]);

  const getOverdueSteps = useCallback(() => {
    const now = new Date();
    const overdue: { step: Step; roadmap: Roadmap }[] = [];
    
    state.roadmaps.forEach(roadmap => {
      roadmap.steps.forEach(step => {
        if (step.dueDate && !step.completed) {
          const dueDate = parseISO(step.dueDate);
          if (dueDate < now) {
            overdue.push({ step, roadmap });
          }
        }
      });
    });
    
    return overdue;
  }, [state.roadmaps]);

  const getTotalStudyTime = useCallback(() => {
    return state.roadmaps.reduce((acc, r) => acc + r.totalStudyTime, 0);
  }, [state.roadmaps]);

  const resetDailyQuests = useCallback(() => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => 
        q.type === 'daily' 
          ? { ...q, requirement: { ...q.requirement, current: 0 }, status: 'available' as const, completedAt: undefined }
          : q
      ),
    }));
  }, []);

  return {
    roadmaps: state.roadmaps,
    categories: state.categories,
    pomodoroSessions: state.pomodoroSessions,
    dailyActivities: state.dailyActivities,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    totalXP: state.totalXP,
    level: state.level,
    achievements: state.achievements,
    quests: state.quests,
    activityLog: state.activityLog,
    settings: state.settings,
    addRoadmap,
    updateRoadmap,
    deleteRoadmap,
    addStep,
    updateStep,
    toggleStep,
    deleteStep,
    addResourceToStep,
    removeResourceFromStep,
    addPomodoroSession,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    exportData,
    importData,
    getProgress,
    getOverallProgress,
    getCategoryProgress,
    getUpcomingDueDates,
    getOverdueSteps,
    getTotalStudyTime,
    addXP,
    checkAchievements,
    updateQuestProgress,
    resetDailyQuests,
  };
};
