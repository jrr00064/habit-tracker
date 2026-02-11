import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit, HabitStats } from '../../types/habit';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Plus, Archive, Trash2, Edit3 } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  isCompleted: (habitId: string) => boolean;
  toggleCompletion: (habitId: string) => void;
  getHabitStats: (habitId: string) => HabitStats;
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  onEdit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitList({
  habits,
  isCompleted,
  toggleCompletion,
  getHabitStats,
  onAdd,
  onEdit,
  onArchive,
  onDelete,
}: HabitListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const handleAdd = (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    onAdd(habitData);
    setIsAddModalOpen(false);
  };

  const handleEdit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    if (editingHabit) {
      onEdit(editingHabit.id, habitData);
      setEditingHabit(null);
    }
  };

  const handleDelete = () => {
    if (deletingHabit) {
      onDelete(deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="py-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No tienes hábitos aún
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Comienza creando tu primer hábito. Pequeños pasos diarios llevan a grandes cambios.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Crear primer hábito
          </Button>
        </Card>
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nuevo hábito">
          <HabitForm onSave={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Hábitos de hoy ({habits.filter(h => isCompleted(h.id)).length}/{habits.length})
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
          >
            <HabitCard
              habit={habit}
              isCompleted={isCompleted(habit.id)}
              onToggle={() => toggleCompletion(habit.id)}
              stats={getHabitStats(habit.id)}
            />
            <div className="flex gap-1 mt-1 justify-end">
              <button
                onClick={() => setEditingHabit(habit)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onArchive(habit.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                <Archive className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeletingHabit(habit)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nuevo hábito">
        <HabitForm onSave={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!editingHabit} onClose={() => setEditingHabit(null)} title="Editar hábito">
        {editingHabit && (
          <HabitForm
            habit={editingHabit}
            onSave={handleEdit}
            onCancel={() => setEditingHabit(null)}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingHabit} onClose={() => setDeletingHabit(null)} title="Eliminar hábito">
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            ¿Estás seguro de que quieres eliminar <strong className="text-slate-900 dark:text-slate-100">{deletingHabit?.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeletingHabit(null)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
