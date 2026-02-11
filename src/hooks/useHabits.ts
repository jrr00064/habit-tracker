import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Habit, HabitLog, HabitStats, AppState, AppSettings } from '../types/habit';
import { formatDate, getToday, getDaysBetween } from '../utils/date';

const STORAGE_KEY = 'habit-tracker-data';
const CURRENT_VERSION = '1.0.0';

const defaultState: AppState = {
  version: CURRENT_VERSION,
  habits: [],
  logs: [],
  settings: {
    theme: 'system',
    weekStartsOn: 1,
  },
};

export function useHabits() {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, defaultState);

  const habits = useMemo(() => state.habits.filter(h => !h.archived), [state.habits]);
  const archivedHabits = useMemo(() => state.habits.filter(h => h.archived), [state.habits]);
  const logs = state.logs;

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: formatDate(new Date()),
      archived: false,
    };
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
    return newHabit.id;
  }, [setState]);

  const editHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === id ? { ...h, ...updates } : h
      ),
    }));
  }, [setState]);

  const deleteHabit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
      logs: prev.logs.filter(l => l.habitId !== id),
    }));
  }, [setState]);

  const archiveHabit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === id ? { ...h, archived: !h.archived } : h
      ),
    }));
  }, [setState]);

  const toggleCompletion = useCallback((habitId: string, date: string = getToday()) => {
    setState(prev => {
      const existingLog = prev.logs.find(
        l => l.habitId === habitId && l.date === date
      );

      if (existingLog) {
        return {
          ...prev,
          logs: prev.logs.map(l =>
            l.habitId === habitId && l.date === date
              ? { ...l, completed: !l.completed, timestamp: Date.now() }
              : l
          ),
        };
      }

      return {
        ...prev,
        logs: [
          ...prev.logs,
          {
            habitId,
            date,
            completed: true,
            timestamp: Date.now(),
          },
        ],
      };
    });
  }, [setState]);

  const isCompleted = useCallback((habitId: string, date: string = getToday()): boolean => {
    return logs.some(l => l.habitId === habitId && l.date === date && l.completed);
  }, [logs]);

  const getHabitLogs = useCallback((habitId: string): HabitLog[] => {
    return logs.filter(l => l.habitId === habitId).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [logs]);

  const getHabitStats = useCallback((habitId: string): HabitStats => {
    const habitLogs = getHabitLogs(habitId).filter(l => l.completed);
    const completedDates = new Set(habitLogs.map(l => l.date));

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    const dateStr = formatDate(today);

    if (completedDates.has(dateStr)) {
      currentStreak = 1;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (!completedDates.has(formatDate(yesterday))) {
        currentStreak = 0;
      }
    }

    if (currentStreak > 0) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 1);
      while (completedDates.has(formatDate(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    const sortedDates = Array.from(completedDates).sort();
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0 || getDaysBetween(sortedDates[i - 1], sortedDates[i]) === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return completedDates.has(formatDate(d)) ? 1 : 0;
    }).reverse();

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return formatDate(d);
    });
    const completedIn30 = last30Days.filter(d => completedDates.has(d)).length;
    const completionRate = Math.round((completedIn30 / 30) * 100);

    return {
      currentStreak,
      maxStreak,
      completionRate,
      last7Days,
    };
  }, [getHabitLogs]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, [setState]);

  const exportData = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData) as AppState;
      if (!parsed.habits || !parsed.logs || !parsed.settings) {
        throw new Error('Invalid data format');
      }
      setState({
        ...parsed,
        version: CURRENT_VERSION,
      });
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }, [setState]);

  return {
    habits,
    archivedHabits,
    logs,
    settings: state.settings,
    addHabit,
    editHabit,
    deleteHabit,
    archiveHabit,
    toggleCompletion,
    isCompleted,
    getHabitLogs,
    getHabitStats,
    updateSettings,
    exportData,
    importData,
  };
}
