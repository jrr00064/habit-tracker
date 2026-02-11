import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { HabitLog } from '../../types/habit';
import { getLast7Days, formatDate, getDayName } from '../../utils/date';
import { Card } from '../ui/Card';

interface WeeklyChartProps {
  logs: HabitLog[];
}

export function WeeklyChart({ logs }: WeeklyChartProps) {
  const data = useMemo(() => {
    const last7Days = getLast7Days();
    const completedByDate = new Map<string, number>();
    
    logs.forEach(log => {
      if (log.completed && last7Days.includes(log.date)) {
        completedByDate.set(log.date, (completedByDate.get(log.date) || 0) + 1);
      }
    });

    return last7Days.map(date => ({
      day: getDayName(date).slice(0, 3),
      date: formatDate(new Date(date)),
      count: completedByDate.get(date) || 0,
      fullDate: date,
    }));
  }, [logs]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { fullDate: string } }> }) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.fullDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
      });
      return (
        <div className="bg-slate-900 text-slate-100 text-sm px-2 py-1 rounded">
          {date}: {payload[0].value} {payload[0].value === 1 ? 'hábito' : 'hábitos'}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Últimos 7 días
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', className: 'text-slate-500 dark:text-slate-400' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', className: 'text-slate-500 dark:text-slate-400' }}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={500}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count > 0 ? '#10b981' : '#cbd5e1'}
                  className="dark:fill-emerald-600 dark:data-[count=0]:fill-slate-600"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
