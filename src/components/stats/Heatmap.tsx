import { useMemo } from 'react';
import type { HabitLog } from '../../types/habit';
import { getDatesForHeatmap } from '../../utils/date';
import { Card } from '../ui/Card';

interface HeatmapProps {
  logs: HabitLog[];
  habitsCount: number;
}

export function Heatmap({ logs, habitsCount }: HeatmapProps) {
  const dates = useMemo(() => getDatesForHeatmap(12), []);

  const heatmapData = useMemo(() => {
    const completedByDate = new Map<string, number>();
    logs.forEach(log => {
      if (log.completed) {
        completedByDate.set(log.date, (completedByDate.get(log.date) || 0) + 1);
      }
    });
    return dates.map(date => ({
      date,
      count: completedByDate.get(date) || 0,
    }));
  }, [logs, dates]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-200 dark:bg-slate-700';
    const intensity = Math.min(count / Math.max(habitsCount, 1), 1);
    if (intensity <= 0.25) return 'bg-emerald-200 dark:bg-emerald-900/40';
    if (intensity <= 0.5) return 'bg-emerald-300 dark:bg-emerald-800/60';
    if (intensity <= 0.75) return 'bg-emerald-400 dark:bg-emerald-700/80';
    return 'bg-emerald-500 dark:bg-emerald-600';
  };

  const getTooltip = (data: { date: string; count: number }) => {
    const date = new Date(data.date);
    const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    if (data.count === 0) return `${dateStr}: Sin completar`;
    if (data.count === 1) return `${dateStr}: 1 hábito completado`;
    return `${dateStr}: ${data.count} hábitos completados`;
  };

  const weeks = useMemo(() => {
    const weeks: { date: string; count: number }[][] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      weeks.push(heatmapData.slice(i, i + 7));
    }
    return weeks;
  }, [heatmapData]);

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Actividad reciente
      </h3>
      <div className="flex items-start gap-2 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          {weekDays.map(d => (
            <span key={d} className="h-3 w-3 flex items-center justify-center">{d}</span>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`h-3 w-3 rounded-sm ${getColor(day.count)} transition-colors hover:ring-2 hover:ring-slate-400`}
                  title={getTooltip(day)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
          <div className="h-3 w-3 rounded-sm bg-emerald-300 dark:bg-emerald-800/60" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/80" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
        </div>
        <span>Más</span>
      </div>
    </Card>
  );
}
