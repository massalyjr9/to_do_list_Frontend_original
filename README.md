# 📝 Todo List Frontend — Next.js & TypeScript

## Présentation

Cette application constitue la partie frontend du projet **Todo List**, développée avec **Next.js**, **TypeScript** et **Tailwind CSS**.  
Elle permet de créer, modifier, afficher et supprimer des tâches, en communiquant avec une API backend basée sur **NestJS**.

L’interface propose un formulaire complet de gestion des tâches, une mise à jour dynamique du statut, un sélecteur de dates avec contrôle des valeurs, ainsi qu’un calcul automatique de la durée entre deux dates.

---

## Fonctionnalités

Création d’une tâche comprenant les champs suivants :  
- Titre  
- Description  
- Responsable  
- Date de début (sélection via calendrier, dates passées interdites)  
- Date de fin (toujours supérieure ou égale à la date de début)  
- Durée totale en jours (calcul automatique)  
- Statut : *to do*, *in progress*, *done*

Modification d’une tâche existante  
Suppression d’une tâche  
Mise à jour du statut directement dans la liste  
Interface responsive  
Communication complète avec l’API backend  

---

## Technologies utilisées

- Next.js 16  
- React 18  
- TypeScript  
- Tailwind CSS  
- Fetch API  
- Variables d’environnement  

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/massalyjr9/to_do_list_frontend.git
cd todo-frontend
```

### 2. Installer les dépendances
```bash
    npm install
```

### 3. Configuration des variables d’environnement
Créer un fichier nommé :
```bash
    .env.local
```
Ajouter la ligne suivante:

```bash
    NEXT_PUBLIC_API_URL=http://localhost:4000
```
Modifier l’URL en fonction de l’adresse du backend en production.

### 3. Démarrer le projet
```bash
   npm run dev
```
Le frontend sera accessible à l’adresse :
http://localhost:3000

Structure du projet 
```bash
src/
  app/
    page.tsx               Page principale
  lib/
    api.ts                 Fonctions d’appel à l’API backend
  types/
    task.ts                Types et interfaces TypeScript

```
Connexion au backend
```bash
    Toutes les requêtes passent par :
    NEXT_PUBLIC_API_URL
```
Routes consommées auprès du backend NestJS :
```bash 
    GET    /tasks
    POST   /tasks
    PUT    /tasks/:id
    DELETE /tasks/:id

```
Améliorations possibles: 
Moteur de recherche / filtres  
Statistiques globales  
Authentification utilisateur  
Pagination ou infinite scroll  
Mode sombre  
Tests front automatisés

Auteur  
Idrissa Massaly  
Développeur Fullstack — Next.js, React, TypeScript, NestJs  

Déploiement sur Vercel
L’option la plus simple pour déployer ce projet est d’utiliser Vercel.  
```bash 
Lien : https://vercel.com
Documentation : https://nextjs.org/docs/app/building-your-application/deploying
```