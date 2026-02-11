import type { Habit, ColorVariant } from '../types/habit';

export const defaultHabits: Omit<Habit, 'id' | 'createdAt' | 'archived'>[] = [
  {
    name: 'Beber 2L de agua',
    emoji: '💧',
    color: 'blue' as ColorVariant,
    frequency: { type: 'daily' },
  },
  {
    name: 'Ejercicio 30 min',
    emoji: '🏃',
    color: 'emerald' as ColorVariant,
    frequency: { type: 'daily' },
  },
  {
    name: 'Meditar 10 min',
    emoji: '🧘',
    color: 'purple' as ColorVariant,
    frequency: { type: 'daily' },
  },
  {
    name: 'Leer 30 min',
    emoji: '📚',
    color: 'amber' as ColorVariant,
    frequency: { type: 'daily' },
  },
  {
    name: 'Dormir 8 horas',
    emoji: '😴',
    color: 'rose' as ColorVariant,
    frequency: { type: 'daily' },
  },
];
