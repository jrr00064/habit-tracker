export type ColorVariant = 'emerald' | 'blue' | 'purple' | 'orange' | 'rose' | 'amber';

export interface Frequency {
  type: 'daily' | 'weekly' | 'custom';
  days?: number[];
  weeklyTarget?: number;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: ColorVariant;
  frequency: Frequency;
  createdAt: string;
  archived: boolean;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  timestamp: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  weekStartsOn: 0 | 1;
}

export interface AppState {
  version: string;
  habits: Habit[];
  logs: HabitLog[];
  settings: AppSettings;
}

export interface HabitStats {
  currentStreak: number;
  maxStreak: number;
  completionRate: number;
  last7Days: number[];
}
