import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { TodayView, StatsView } from './views';
import { useHabits } from './hooks/useHabits';
import { defaultHabits } from './data/defaultHabits';
import { CalendarDays, BarChart3 } from 'lucide-react';

type Tab = 'today' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const {
    habits,
    logs,
    isCompleted,
    toggleCompletion,
    getHabitStats,
    addHabit,
    editHabit,
    archiveHabit,
    deleteHabit,
    exportData,
    importData,
  } = useHabits();

  // Initialize with default habits if empty
  if (habits.length === 0 && logs.length === 0) {
    defaultHabits.forEach(habit => addHabit(habit));
  }

  return (
    <MainLayout>
      {/* Tab Navigation */}
      <div className="flex p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'today'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Estadísticas
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'today' ? (
          <TodayView
            key="today"
            habits={habits}
            isCompleted={isCompleted}
            toggleCompletion={toggleCompletion}
            getHabitStats={getHabitStats}
            onAddHabit={addHabit}
            onEditHabit={editHabit}
            onArchiveHabit={archiveHabit}
            onDeleteHabit={deleteHabit}
          />
        ) : (
          <StatsView
            key="stats"
            habits={habits}
            logs={logs}
            getHabitStats={getHabitStats}
            onExport={exportData}
            onImport={importData}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
