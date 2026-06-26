# Gestion RH

Base de départ pour une application web de gestion RH avec React, Spring Boot, Git et Docker.

## Architecture cible

- Frontend: React
- Backend: Spring Boot
- Base de données: MySQL
- Orchestration locale: Docker Compose
- Build backend: Maven Wrapper

## Structure du dépôt

- frontend/ : application React
- backend/ : application Spring Boot
- docker/ : scripts ou fichiers d'infrastructure
- docs/ : documentation de démarrage et conventions

## Étapes de configuration

### 1. Initialiser Git

1. Vérifier que le dossier racine du projet est bien `gestion-rh`.
2. Lancer `git init` à la racine.
3. Ajouter ce fichier `README.md` et le `.gitignore`.
4. Faire un premier commit de structure.

### 2. Préparer le backend Spring Boot

1. Créer un projet Spring Boot dans le dossier `backend`.
2. Choisir Java 17 ou Java 21.
3. Créer le projet avec Maven et ajouter les dépendances: Spring Web, Spring Data JPA, validation, driver MySQL, Actuator.
4. Préparer les profils `dev` et `prod`.

### 3. Préparer le frontend React

1. Créer une application React dans le dossier `frontend`.
2. Utiliser Vite pour un démarrage rapide.
3. Définir une variable d'environnement pour l'URL de l'API.
4. Préparer une structure simple: components, pages, services.

### 4. Préparer Docker

1. Créer un Dockerfile pour le backend.
2. Créer un Dockerfile pour le frontend.
3. Ajouter un service MySQL dans Docker Compose.
4. Définir les variables d'environnement pour les trois services.

### 5. Lancer l'environnement local

1. Démarrer MySQL avec Docker Compose.
2. Lancer Spring Boot localement ou via Docker.
3. Lancer React localement ou via Docker.
4. Vérifier la communication frontend vers backend.

## Commandes à venir

Ce dépôt est volontairement vide de code métier. Les prochaines étapes seront de générer les projets React et Spring Boot, puis de compléter les fichiers Docker.
