import { Task } from '../types/task';

// URL de base de l'API backend. 
// NEXT_PUBLIC_API_URL permet une configuration dynamique via un fichier .env.local
// Si aucune variable n'est définie, le frontend contacte http://localhost:4000 par défaut.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Récupère toutes les tâches depuis le backend
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`);

  // Vérifie que la réponse est valide (status HTTP 200–299)
  if (!res.ok) throw new Error('Failed to fetch tasks');

  // Convertit la réponse en JSON et la retourne
  return res.json();
}

// Crée une nouvelle tâche dans le backend
export async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task), // Envoi des données au format JSON
  });

  if (!res.ok) throw new Error('Failed to create task');

  return res.json();
}

// Met à jour une tâche existante via son identifiant
export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task), // Envoi des champs à modifier
  });

  if (!res.ok) throw new Error('Failed to update task');

  return res.json();
}

// Supprime une tâche du backend
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });

  if (!res.ok) throw new Error('Failed to delete task');
}
