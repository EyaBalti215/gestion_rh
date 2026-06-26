# Guide complet de configuration

Ce document décrit la configuration complète avant développement pour une application React + Spring Boot avec Git et trois conteneurs Docker.

## 1. Choix d'architecture

- 1 conteneur React
- 1 conteneur Spring Boot
- 1 conteneur MySQL

Cette séparation permet de développer, tester et déployer chaque couche indépendamment.

## 2. Prérequis à installer

- Git
- Node.js 20 ou plus récent
- JDK 17 ou JDK 21
- Maven ou simplement le Maven Wrapper généré par Spring Initializr
- Docker Desktop
- VS Code ou IntelliJ IDEA

## 3. Mise en place du dépôt Git

1. Créer le dossier du projet.
2. Lancer `git init`.
3. Créer le fichier `.gitignore`.
4. Rédiger le `README.md`.
5. Créer la branche principale si nécessaire: `main`.

## 4. Structure recommandée

- frontend/
- backend/
- docker/
- docs/

## 5. Configuration du backend

1. Générer un projet Spring Boot dans `backend`.
2. Choisir Maven au lieu de Gradle.
3. Ajouter les dépendances nécessaires.
4. Configurer le port 8080.
5. Préparer la connexion à MySQL.
6. Ajouter la gestion CORS pour le frontend.

## 6. Configuration du frontend

1. Générer un projet React dans `frontend`.
2. Utiliser Vite.
3. Configurer le port 5173 ou 3000.
4. Prévoir un service centralisé pour les appels API.
5. Utiliser une variable d'environnement pour l'URL du backend.

## 7. Configuration Docker

1. Créer un Dockerfile pour le backend.
2. Créer un Dockerfile pour le frontend.
3. Créer un service MySQL.
4. Définir un réseau partagé entre les services.
5. Ajouter un volume pour la base de données.
6. Ajouter des healthchecks si possible.

## 8. Fichiers d'environnement

- `.env` pour les variables locales.
- `.env.example` pour documenter les variables attendues.

Variables typiques:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `VITE_API_URL`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`

## 9. Ordre de développement conseillé

1. Créer la structure de dossiers.
2. Initialiser Git.
3. Générer le backend.
4. Générer le frontend.
5. Ajouter la base MySQL.
6. Écrire les Dockerfile.
7. Écrire `docker-compose.yml`.
8. Vérifier le démarrage complet.

## 10. Ce qu'il faut valider avant de coder les fonctionnalités

- Le backend démarre sans erreur.
- Le frontend démarre sans erreur.
- La base MySQL est accessible.
- Le frontend peut appeler l'API backend.
- Le tout démarre via Docker Compose.
