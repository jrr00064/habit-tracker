import { ThemeToggle } from '../ui/Toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
            ✨
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Habit Tracker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Construye hábitos, transforma tu vida
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
