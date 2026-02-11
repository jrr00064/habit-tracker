import { motion } from 'framer-motion';
import type { Habit, HabitStats } from '../../types/habit';
import { Card } from '../ui/Card';

const colorMap = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
};

const lightColorMap = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  stats?: HabitStats;
}

export function HabitCard({ habit, isCompleted, onToggle, stats }: HabitCardProps) {
  return (
    <Card className="group">
      <div className="flex items-center gap-4">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl cursor-pointer transition-all ${
            isCompleted ? colorMap[habit.color] : 'bg-slate-100 dark:bg-slate-700'
          } ${isCompleted ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}
          onClick={onToggle}
        >
          {isCompleted ? (
            <motion.svg
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          ) : (
            <span>{habit.emoji}</span>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${lightColorMap[habit.color]}`}>
              {habit.frequency.type === 'daily' ? 'Diario' : habit.frequency.type === 'weekly' ? `${habit.frequency.weeklyTarget}x semana` : 'Personalizado'}
            </span>
            {stats && stats.currentStreak > 0 && (
              <span className="text-xs text-orange-500 flex items-center gap-1">
                <span>🔥</span>
                <span>{stats.currentStreak}</span>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500 dark:hover:bg-slate-600'
          }`}
        >
          {isCompleted ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </Card>
  );
}
