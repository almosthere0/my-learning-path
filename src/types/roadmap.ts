export interface Resource {
  id: string;
  type: 'link' | 'file' | 'note';
  title: string;
  content: string;
  createdAt: string;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  resources: Resource[];
}

export interface PomodoroSession {
  id: string;
  roadmapId: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
}

export interface DailyActivity {
  date: string;
  stepsCompleted: number;
  pomodoroMinutes: number;
  roadmapsWorkedOn: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
  totalStudyTime: number;
  isPublic?: boolean;
  author?: string;
  downloads?: number;
}

export interface Category {
  id: string;
  name: string;
  color: 'green' | 'cyan' | 'yellow' | 'orange' | 'purple' | 'pink';
  icon: string;
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  category: 'completion' | 'streak' | 'study' | 'milestone' | 'special';
  requirement: {
    type: 'steps_completed' | 'roadmaps_completed' | 'streak_days' | 'study_minutes' | 'quests_completed';
    value: number;
  };
  unlockedAt?: string;
  progress?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: 'daily' | 'weekly' | 'special';
  requirement: {
    type: 'complete_steps' | 'study_minutes' | 'complete_roadmap' | 'login_streak' | 'pomodoro_sessions';
    value: number;
    current: number;
  };
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  expiresAt?: string;
  completedAt?: string;
  reward?: {
    type: 'xp' | 'badge';
    value: string | number;
  };
}

export interface ActivityLog {
  id: string;
  type: 'step_completed' | 'roadmap_completed' | 'quest_completed' | 'achievement_earned' | 'pomodoro_completed' | 'course_completed' | 'quiz_completed';
  title: string;
  description: string;
  xp: number;
  timestamp: string;
  relatedId?: string;
}

export interface UserSettings {
  profile: {
    displayName: string;
    email: string;
    avatar: string;
    bio: string;
  };
  notifications: {
    emailReminders: boolean;
    pushNotifications: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
    achievementAlerts: boolean;
    dueDateReminders: boolean;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    accentColor: 'green' | 'cyan' | 'purple' | 'orange';
    compactMode: boolean;
    animationsEnabled: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showProgress: boolean;
    showActivity: boolean;
    allowMessages: boolean;
  };
}

export interface RoadmapTemplate {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  steps: Omit<Step, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'resources'>[];
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  createdAt: string;
  isOfficial?: boolean;
}

export interface AppState {
  roadmaps: Roadmap[];
  categories: Category[];
  pomodoroSessions: PomodoroSession[];
  dailyActivities: DailyActivity[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  quests: Quest[];
  activityLog: ActivityLog[];
  settings: UserSettings;
}

export type SortOption = 'title' | 'category' | 'progress' | 'created' | 'updated';
export type SortDirection = 'asc' | 'desc';

export const MOTIVATIONAL_MESSAGES = {
  starting: [
    "Every expert was once a beginner. Let's start this journey!",
    "The secret of getting ahead is getting started.",
    "A journey of a thousand miles begins with a single step.",
  ],
  inProgress: [
    "You're making great progress! Keep going!",
    "Consistency is the key to mastery.",
    "Small steps every day lead to big results.",
    "You're doing amazing! Don't stop now!",
  ],
  almostDone: [
    "So close to the finish line! Push through!",
    "The last mile is the hardest, but you've got this!",
    "Victory is just around the corner!",
  ],
  completed: [
    "🎉 Congratulations! You've completed this roadmap!",
    "🏆 Achievement unlocked! You did it!",
    "⭐ Excellence achieved! What's next?",
  ],
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first learning step',
    icon: '👣',
    xp: 50,
    category: 'milestone',
    requirement: { type: 'steps_completed', value: 1 },
  },
  {
    id: 'step_master_10',
    name: 'Getting Started',
    description: 'Complete 10 learning steps',
    icon: '📚',
    xp: 100,
    category: 'completion',
    requirement: { type: 'steps_completed', value: 10 },
  },
  {
    id: 'step_master_50',
    name: 'Knowledge Seeker',
    description: 'Complete 50 learning steps',
    icon: '🎯',
    xp: 250,
    category: 'completion',
    requirement: { type: 'steps_completed', value: 50 },
  },
  {
    id: 'step_master_100',
    name: 'Step Master',
    description: 'Complete 100 learning steps',
    icon: '🏆',
    xp: 500,
    category: 'completion',
    requirement: { type: 'steps_completed', value: 100 },
  },
  {
    id: 'roadmap_first',
    name: 'Road Warrior',
    description: 'Complete your first roadmap',
    icon: '🗺️',
    xp: 200,
    category: 'milestone',
    requirement: { type: 'roadmaps_completed', value: 1 },
  },
  {
    id: 'roadmap_5',
    name: 'Pathfinder',
    description: 'Complete 5 roadmaps',
    icon: '🧭',
    xp: 500,
    category: 'completion',
    requirement: { type: 'roadmaps_completed', value: 5 },
  },
  {
    id: 'roadmap_10',
    name: 'Grand Explorer',
    description: 'Complete 10 roadmaps',
    icon: '🌟',
    xp: 1000,
    category: 'completion',
    requirement: { type: 'roadmaps_completed', value: 10 },
  },
  {
    id: 'streak_3',
    name: 'Consistent Learner',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    xp: 75,
    category: 'streak',
    requirement: { type: 'streak_days', value: 3 },
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    xp: 200,
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 },
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: '💎',
    xp: 1000,
    category: 'streak',
    requirement: { type: 'streak_days', value: 30 },
  },
  {
    id: 'study_60',
    name: 'Focused Mind',
    description: 'Study for 60 minutes total',
    icon: '🧠',
    xp: 100,
    category: 'study',
    requirement: { type: 'study_minutes', value: 60 },
  },
  {
    id: 'study_300',
    name: 'Deep Focus',
    description: 'Study for 5 hours total',
    icon: '🎧',
    xp: 300,
    category: 'study',
    requirement: { type: 'study_minutes', value: 300 },
  },
  {
    id: 'study_1000',
    name: 'Marathon Learner',
    description: 'Study for 1000 minutes total',
    icon: '🏅',
    xp: 750,
    category: 'study',
    requirement: { type: 'study_minutes', value: 1000 },
  },
  {
    id: 'speed_learner',
    name: 'Speed Learner',
    description: 'Complete 5 steps in a single day',
    icon: '⚡',
    xp: 150,
    category: 'special',
    requirement: { type: 'steps_completed', value: 5 },
  },
  {
    id: 'quest_hunter',
    name: 'Quest Hunter',
    description: 'Complete 10 quests',
    icon: '🗡️',
    xp: 300,
    category: 'special',
    requirement: { type: 'quests_completed', value: 10 },
  },
];

export const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'daily_steps_3',
    title: 'Daily Learner',
    description: 'Complete 3 learning steps today',
    xp: 50,
    type: 'daily',
    requirement: { type: 'complete_steps', value: 3, current: 0 },
    status: 'available',
  },
  {
    id: 'daily_pomodoro_2',
    title: 'Focus Time',
    description: 'Complete 2 Pomodoro sessions today',
    xp: 75,
    type: 'daily',
    requirement: { type: 'pomodoro_sessions', value: 2, current: 0 },
    status: 'available',
  },
  {
    id: 'daily_study_30',
    title: 'Study Session',
    description: 'Study for 30 minutes today',
    xp: 60,
    type: 'daily',
    requirement: { type: 'study_minutes', value: 30, current: 0 },
    status: 'available',
  },
  {
    id: 'weekly_steps_15',
    title: 'Weekly Progress',
    description: 'Complete 15 steps this week',
    xp: 200,
    type: 'weekly',
    requirement: { type: 'complete_steps', value: 15, current: 0 },
    status: 'available',
  },
  {
    id: 'weekly_roadmap',
    title: 'Finish Strong',
    description: 'Complete a roadmap this week',
    xp: 300,
    type: 'weekly',
    requirement: { type: 'complete_roadmap', value: 1, current: 0 },
    status: 'available',
  },
  {
    id: 'weekly_streak_5',
    title: 'Streak Builder',
    description: 'Maintain a 5-day streak this week',
    xp: 150,
    type: 'weekly',
    requirement: { type: 'login_streak', value: 5, current: 0 },
    status: 'available',
  },
  {
    id: 'special_marathon',
    title: 'Study Marathon',
    description: 'Study for 2 hours in one day',
    xp: 250,
    type: 'special',
    requirement: { type: 'study_minutes', value: 120, current: 0 },
    status: 'locked',
  },
  {
    id: 'special_perfectionist',
    title: 'Perfectionist',
    description: 'Complete all daily quests in a single day',
    xp: 400,
    type: 'special',
    requirement: { type: 'complete_steps', value: 10, current: 0 },
    status: 'locked',
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    displayName: 'Learner',
    email: '',
    avatar: '👤',
    bio: '',
  },
  notifications: {
    emailReminders: true,
    pushNotifications: true,
    dailyDigest: false,
    weeklyReport: true,
    achievementAlerts: true,
    dueDateReminders: true,
  },
  appearance: {
    theme: 'dark',
    accentColor: 'green',
    compactMode: false,
    animationsEnabled: true,
  },
  privacy: {
    profilePublic: false,
    showProgress: true,
    showActivity: true,
    allowMessages: false,
  },
};

export const ROADMAP_TEMPLATES: RoadmapTemplate[] = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Master React from basics to advanced concepts',
    categoryId: 'programming',
    steps: [
      { title: 'Understanding JSX and React Elements' },
      { title: 'Components and Props' },
      { title: 'State and Lifecycle' },
      { title: 'Handling Events' },
      { title: 'Conditional Rendering' },
      { title: 'Lists and Keys' },
      { title: 'Forms and Controlled Components' },
      { title: 'Lifting State Up' },
      { title: 'Composition vs Inheritance' },
      { title: 'React Hooks Basics' },
    ],
    author: 'LearnPath',
    downloads: 1250,
    rating: 4.8,
    tags: ['react', 'javascript', 'frontend'],
    createdAt: new Date().toISOString(),
    isOfficial: true,
  },
  {
    id: 'typescript-essentials',
    title: 'TypeScript Essentials',
    description: 'Learn TypeScript for better JavaScript development',
    categoryId: 'programming',
    steps: [
      { title: 'TypeScript Setup and Configuration' },
      { title: 'Basic Types and Type Annotations' },
      { title: 'Interfaces and Type Aliases' },
      { title: 'Functions and Parameters' },
      { title: 'Classes and OOP' },
      { title: 'Generics' },
      { title: 'Enums and Literal Types' },
      { title: 'Type Guards and Narrowing' },
    ],
    author: 'LearnPath',
    downloads: 890,
    rating: 4.7,
    tags: ['typescript', 'javascript', 'programming'],
    createdAt: new Date().toISOString(),
    isOfficial: true,
  },
  {
    id: 'spanish-basics',
    title: 'Spanish for Beginners',
    description: 'Start your Spanish language journey',
    categoryId: 'languages',
    steps: [
      { title: 'Alphabet and Pronunciation' },
      { title: 'Greetings and Introductions' },
      { title: 'Numbers 1-100' },
      { title: 'Common Verbs (Ser, Estar, Tener)' },
      { title: 'Present Tense Conjugation' },
      { title: 'Days, Months, and Time' },
      { title: 'Food and Restaurant Vocabulary' },
      { title: 'Basic Conversation Practice' },
    ],
    author: 'LearnPath',
    downloads: 720,
    rating: 4.6,
    tags: ['spanish', 'language', 'beginner'],
    createdAt: new Date().toISOString(),
    isOfficial: true,
  },
  {
    id: 'calculus-1',
    title: 'Calculus I',
    description: 'Foundation of differential calculus',
    categoryId: 'mathematics',
    steps: [
      { title: 'Limits and Continuity' },
      { title: 'Definition of Derivative' },
      { title: 'Differentiation Rules' },
      { title: 'Chain Rule' },
      { title: 'Implicit Differentiation' },
      { title: 'Applications of Derivatives' },
      { title: 'Related Rates' },
      { title: 'Optimization Problems' },
    ],
    author: 'LearnPath',
    downloads: 560,
    rating: 4.5,
    tags: ['math', 'calculus', 'university'],
    createdAt: new Date().toISOString(),
    isOfficial: true,
  },
  {
    id: 'ui-design-basics',
    title: 'UI Design Fundamentals',
    description: 'Learn the principles of great UI design',
    categoryId: 'arts',
    steps: [
      { title: 'Color Theory' },
      { title: 'Typography Basics' },
      { title: 'Layout and Spacing' },
      { title: 'Visual Hierarchy' },
      { title: 'Consistency and Patterns' },
      { title: 'Responsive Design Principles' },
      { title: 'Accessibility Basics' },
    ],
    author: 'LearnPath',
    downloads: 430,
    rating: 4.7,
    tags: ['design', 'ui', 'ux'],
    createdAt: new Date().toISOString(),
    isOfficial: true,
  },
];

export const calculateLevel = (xp: number): { level: number; currentXP: number; requiredXP: number } => {
  const xpPerLevel = 1000;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentXP = xp % xpPerLevel;
  const requiredXP = xpPerLevel;
  return { level, currentXP, requiredXP };
};
