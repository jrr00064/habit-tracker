import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface StreakCounterProps {
  currentStreak: number;
  maxStreak: number;
}

export function StreakCounter({ currentStreak, maxStreak }: StreakCounterProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="text-center">
        <div className="text-4xl mb-2">🔥</div>
        <motion.div
          key={currentStreak}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-3xl font-bold text-orange-500"
        >
          {currentStreak}
        </motion.div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Racha actual
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          {currentStreak === 1 ? 'día' : 'días'}
        </div>
      </Card>

      <Card className="text-center">
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-3xl font-bold text-emerald-500">
          {maxStreak}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Mejor racha
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          {maxStreak === 1 ? 'día' : 'días'}
        </div>
      </Card>
    </div>
  );
}
