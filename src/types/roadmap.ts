export interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: 'green' | 'cyan' | 'yellow' | 'orange' | 'purple' | 'pink';
  icon: string;
}

export interface AppState {
  roadmaps: Roadmap[];
  categories: Category[];
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
