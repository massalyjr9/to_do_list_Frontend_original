// Définition des statuts possibles d'une tâche.
// Utilisé côté frontend pour assurer un typage strict.
export type TaskStatus = 'to do' | 'in progress' | 'done';

// Interface représentant la structure d'une tâche dans le frontend.
// Cela permet d'assurer le typage lors des appels API et dans les composants React.
export interface Task {
  // Identifiant unique généré par MongoDB
  _id?: string;

  // Titre de la tâche, obligatoire
  title: string;

  // Description optionnelle
  description?: string;

  // Dates optionnelles, envoyées sous forme de chaînes
  startDate?: string;
  endDate?: string;

  // Durée optionnelle de la tâche
  duration?: number;

  // Personne responsable de la tâche
  responsible?: string;

  // Statut de la tâche, basé sur TaskStatus
  status: TaskStatus;
}
