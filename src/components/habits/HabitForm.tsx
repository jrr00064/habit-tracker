import { useState } from 'react';
import type { Habit, ColorVariant, Frequency } from '../../types/habit';
import { Button } from '../ui/Button';

interface HabitFormProps {
  habit?: Habit;
  onSave: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  onCancel: () => void;
}

const EMOJI_OPTIONS = ['💧', '🏃', '🧘', '📚', '😴', '🥗', '💪', '🎸', '✍️', '🎨', '💊', '🧹', '🌱', '☀️', '🌙'];
const COLOR_OPTIONS: ColorVariant[] = ['emerald', 'blue', 'purple', 'orange', 'rose', 'amber'];
const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const colorClasses = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
};

export function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '');
  const [emoji, setEmoji] = useState(habit?.emoji ?? '💧');
  const [color, setColor] = useState<ColorVariant>(habit?.color ?? 'emerald');
  const [frequencyType, setFrequencyType] = useState<Frequency['type']>(habit?.frequency.type ?? 'daily');
  const [weeklyTarget, setWeeklyTarget] = useState(habit?.frequency.weeklyTarget ?? 3);
  const [customDays, setCustomDays] = useState<number[]>(habit?.frequency.days ?? [1, 2, 3, 4, 5]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 1 || name.trim().length > 50) {
      setError('El nombre debe tener entre 1 y 50 caracteres');
      return;
    }

    const frequency: Frequency = frequencyType === 'daily'
      ? { type: 'daily' }
      : frequencyType === 'weekly'
      ? { type: 'weekly', weeklyTarget }
      : { type: 'custom', days: customDays };

    onSave({
      name: name.trim(),
      emoji,
      color,
      frequency,
    });
  };

  const toggleDay = (day: number) => {
    setCustomDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Nombre del hábito
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Beber 2L de agua"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
        />
        {error && (
          <p className="mt-1 text-sm text-rose-500">{error}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Emoji
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`h-10 w-10 rounded-lg text-xl transition-all ${
                emoji === e
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 ring-2 ring-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Color
        </label>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full ${colorClasses[c]} transition-all ${
                color === c ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-800' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Frecuencia
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="freq"
              checked={frequencyType === 'daily'}
              onChange={() => setFrequencyType('daily')}
              className="text-emerald-600"
            />
            <span className="text-slate-700 dark:text-slate-300">Todos los días</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="freq"
              checked={frequencyType === 'weekly'}
              onChange={() => setFrequencyType('weekly')}
              className="text-emerald-600"
            />
            <span className="text-slate-700 dark:text-slate-300">
              <select
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                className="mx-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                disabled={frequencyType !== 'weekly'}
              >
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              veces por semana
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="radio"
              name="freq"
              checked={frequencyType === 'custom'}
              onChange={() => setFrequencyType('custom')}
              className="text-emerald-600 mt-1"
            />
            <div>
              <span className="text-slate-700 dark:text-slate-300">Días específicos</span>
              <div className="flex gap-1 mt-2">
                {WEEKDAYS.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    disabled={frequencyType !== 'custom'}
                    className={`h-8 w-8 rounded text-sm font-medium transition-all ${
                      customDays.includes(idx)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    } ${frequencyType !== 'custom' ? 'opacity-50' : ''}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {habit ? 'Guardar cambios' : 'Crear hábito'}
        </Button>
      </div>
    </form>
  );
}
