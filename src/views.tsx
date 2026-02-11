import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Habit, HabitStats } from './types/habit';
import { HabitList } from './components/habits/HabitList';
import { Heatmap } from './components/stats/Heatmap';
import { StreakCounter } from './components/stats/StreakCounter';
import { WeeklyChart } from './components/stats/WeeklyChart';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Download, Upload } from 'lucide-react';

interface TodayViewProps {
  habits: Habit[];
  isCompleted: (habitId: string) => boolean;
  toggleCompletion: (habitId: string) => void;
  getHabitStats: (habitId: string) => HabitStats;
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  onEditHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  onArchiveHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

export function TodayView(props: TodayViewProps) {
  const { habits, isCompleted } = props;
  const completedToday = habits.filter(h => isCompleted(h.id)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">Progreso de hoy</p>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <p className="text-emerald-100 text-sm">
              {completedToday} de {habits.length} hábitos completados
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Card>

      <HabitList
        habits={habits}
        isCompleted={props.isCompleted}
        toggleCompletion={props.toggleCompletion}
        getHabitStats={props.getHabitStats}
        onAdd={props.onAddHabit}
        onEdit={props.onEditHabit}
        onArchive={props.onArchiveHabit}
        onDelete={props.onDeleteHabit}
      />
    </motion.div>
  );
}

import type { HabitLog } from './types/habit';

interface StatsViewProps {
  habits: Habit[];
  logs: HabitLog[];
  getHabitStats: (habitId: string) => HabitStats;
  onExport: () => string;
  onImport: (data: string) => boolean;
}

export function StatsView({ habits, logs, getHabitStats, onExport, onImport }: StatsViewProps) {
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const totalCurrentStreak = habits.reduce((sum, h) => sum + getHabitStats(h.id).currentStreak, 0);
  const totalMaxStreak = habits.reduce((sum, h) => sum + getHabitStats(h.id).maxStreak, 0);

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = onImport(content);
        if (success) {
          setImportSuccess(true);
          setImportError('');
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          setImportError('El archivo no tiene el formato correcto');
        }
      } catch {
        setImportError('Error al leer el archivo');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <StreakCounter currentStreak={totalCurrentStreak} maxStreak={totalMaxStreak} />
      
      <WeeklyChart logs={logs.filter(l => l.completed)} />
      
      <Heatmap logs={logs.filter(l => l.completed)} habitsCount={habits.length} />

      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Backup de datos
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={handleExport} className="flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Exportar JSON
          </Button>
          <label className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer transition-colors">
              <Upload className="h-4 w-4" />
              Importar JSON
            </div>
          </label>
        </div>
        {importError && (
          <p className="mt-2 text-sm text-rose-500">{importError}</p>
        )}
        {importSuccess && (
          <p className="mt-2 text-sm text-emerald-500">Datos importados correctamente</p>
        )}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Exporta tus hábitos y progreso para hacer backup. Puedes importarlos más tarde.
        </p>
      </Card>
    </motion.div>
  );
}
