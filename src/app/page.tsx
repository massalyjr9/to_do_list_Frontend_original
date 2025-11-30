'use client';

import { useEffect, useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { fetchTasks, createTask, updateTask, deleteTask } from '../lib/api';

const statuses: TaskStatus[] = ['to do', 'in progress', 'done'];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', status: 'to do' });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Date du jour au format YYYY-MM-DD pour bloquer les dates passées
  const today = new Date().toISOString().split('T')[0];

  // Fonction utilitaire pour calculer la durée en jours (end - start)
  const computeDurationDays = (start?: string, end?: string): number | undefined => {
    if (!start || !end) return undefined;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return undefined;
    if (endDate < startDate) return undefined;
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays;
  };

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks().catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!newTask.title) return;

    // recalculer la durée avant envoi (au cas où)
    const duration =
      computeDurationDays(newTask.startDate, newTask.endDate) ?? newTask.duration;
    const payload = { ...newTask, duration };

    if (editingTaskId) {
      const updated = await updateTask(editingTaskId, payload);
      setTasks(prev => prev.map(t => (t._id === updated._id ? updated : t)));
    } else {
      const created = await createTask(payload);
      setTasks(prev => [...prev, created]);
    }

    setNewTask({ title: '', status: 'to do' });
    setEditingTaskId(null);
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    if (!task._id) return;
    const updated = await updateTask(task._id, { status });
    setTasks(prev => prev.map(t => (t._id === updated._id ? updated : t)));
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const startEdit = (task: Task) => {
    if (!task._id) return;
    const autoDuration = computeDurationDays(task.startDate, task.endDate);
    setEditingTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      duration: task.duration ?? autoDuration,
      responsible: task.responsible,
      status: task.status,
    });
  };

  // Handler pour changer la date de début
  const handleStartDateChange = (value: string) => {
    let endDate = newTask.endDate;

    // Si la date de fin existe et devient < date de début, on l'aligne sur la date de début
    if (endDate && endDate < value) {
      endDate = value;
    }

    const duration = computeDurationDays(value, endDate);

    setNewTask(prev => ({
      ...prev,
      startDate: value,
      endDate,
      duration,
    }));
  };

  // Handler pour changer la date de fin
  const handleEndDateChange = (value: string) => {
    const startDate = newTask.startDate;

    // Si pas de date de début, on fixe start = today
    const effectiveStart = startDate || today;

    // Si la fin est avant le début, on force fin = début
    let endDate = value;
    if (endDate < effectiveStart) {
      endDate = effectiveStart;
    }

    const duration = computeDurationDays(effectiveStart, endDate);

    setNewTask(prev => ({
      ...prev,
      startDate: startDate || effectiveStart,
      endDate,
      duration,
    }));
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          className="border p-2"
          placeholder="Titre"
          value={newTask.title || ''}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Description"
          value={newTask.description || ''}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />

        {/* Date de début : calendrier + dates passées bloquées */}
        <input
          className="border p-2"
          type="date"
          placeholder="Date de debut"
          value={newTask.startDate || ''}
          min={today}
          onChange={e => handleStartDateChange(e.target.value)}
        />

        {/* Date de fin : calendrier + ne peut pas être avant la date de début (ou aujourd'hui) */}
        <input
          className="border p-2"
          type="date"
          placeholder="Date de fin"
          value={newTask.endDate || ''}
          min={newTask.startDate || today}
          onChange={e => handleEndDateChange(e.target.value)}
        />

        {/* Durée calculée automatiquement en jours, affichée en lecture seule */}
        <input
          className="border p-2"
          type="number"
          placeholder="Durée (jours)"
          value={newTask.duration ?? ''}
          readOnly
        />

        <input
          className="border p-2"
          placeholder="Responsable"
          value={newTask.responsible || ''}
          onChange={e => setNewTask({ ...newTask, responsible: e.target.value })}
        />

        <select
          className="border p-2"
          value={newTask.status || 'to do'}
          onChange={e => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
        >
          {statuses.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          {editingTaskId ? 'Mettre à jour' : 'Ajouter'}
        </button>

        {editingTaskId && (
          <button
            className="px-4 py-2 rounded border"
            onClick={() => {
              setEditingTaskId(null);
              setNewTask({ title: '', status: 'to do' });
            }}
          >
            Annuler
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task._id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              <p className="text-xs text-gray-500">
                Responsable : {task.responsible || '—'}
              </p>
              {task.startDate && task.endDate && (
                <p className="text-xs text-gray-500">
                  Du {task.startDate} au {task.endDate}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                className="border p-1 text-sm"
                value={task.status}
                onChange={e => handleStatusChange(task, e.target.value as TaskStatus)}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                className="text-blue-600 text-sm"
                onClick={() => startEdit(task)}
              >
                Modifier
              </button>

              <button
                className="text-red-600 text-sm"
                onClick={() => handleDelete(task._id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
