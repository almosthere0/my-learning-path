import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Roadmap, Category, Step, AppState } from '@/types/roadmap';

const STORAGE_KEY = 'learning-roadmap-data';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'programming', name: 'Programming', color: 'cyan', icon: '💻' },
  { id: 'mathematics', name: 'Mathematics', color: 'purple', icon: '📐' },
  { id: 'languages', name: 'Languages', color: 'yellow', icon: '🌍' },
  { id: 'science', name: 'Science', color: 'green', icon: '🔬' },
  { id: 'arts', name: 'Arts & Design', color: 'pink', icon: '🎨' },
  { id: 'business', name: 'Business', color: 'orange', icon: '📊' },
];

const SAMPLE_ROADMAPS: Roadmap[] = [
  {
    id: uuidv4(),
    title: 'Learn React Fundamentals',
    description: 'Master the core concepts of React including components, hooks, and state management.',
    categoryId: 'programming',
    steps: [
      { id: uuidv4(), title: 'Understand JSX syntax', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Learn useState and useEffect hooks', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Build reusable components', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Implement context API', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Master React Router', completed: false, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Spanish Language Basics',
    description: 'Learn conversational Spanish for travel and everyday communication.',
    categoryId: 'languages',
    steps: [
      { id: uuidv4(), title: 'Learn basic greetings', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Master numbers and time', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Study common verbs', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Practice conversations', completed: false, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Linear Algebra Essentials',
    description: 'Build a strong foundation in linear algebra for machine learning.',
    categoryId: 'mathematics',
    steps: [
      { id: uuidv4(), title: 'Vectors and vector spaces', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Matrix operations', completed: false, createdAt: new Date().toISOString() },
      { id: uuidv4(), title: 'Eigenvalues and eigenvectors', completed: false, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return {
    roadmaps: SAMPLE_ROADMAPS,
    categories: DEFAULT_CATEGORIES,
  };
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

  const addStep = useCallback((roadmapId: string, step: Omit<Step, 'id' | 'createdAt' | 'completed'>) => {
    const newStep: Step = {
      ...step,
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
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

  const toggleStep = useCallback((roadmapId: string, stepId: string) => {
    setState(prev => ({
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
    }));
  }, []);

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
        markdown += `**Progress:** ${progress}%\n\n`;
        if (roadmap.description) {
          markdown += `${roadmap.description}\n\n`;
        }
        markdown += '### Steps\n';
        roadmap.steps.forEach(step => {
          markdown += `- [${step.completed ? 'x' : ' '}] ${step.title}\n`;
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
        setState(imported);
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

  return {
    roadmaps: state.roadmaps,
    categories: state.categories,
    addRoadmap,
    updateRoadmap,
    deleteRoadmap,
    addStep,
    toggleStep,
    deleteStep,
    addCategory,
    updateCategory,
    deleteCategory,
    exportData,
    importData,
    getProgress,
    getOverallProgress,
    getCategoryProgress,
  };
};
