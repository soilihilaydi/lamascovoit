# 🚗 Lamastre-covoit - Site de Covoiturage Local

Bienvenue dans la documentation du projet de covoiturage local Lamastrois. Cette documentation couvre la planification, la structure des technologies et les modèles de données du backend et du frontend, ainsi que les user stories associées au projet.

## 🏗 Planification et Architecture du Backend

### 🛠 Technologies Backend

| #  | Technologie        | Description                                                                                              |
|----|--------------------|----------------------------------------------------------------------------------------------------------|
| 1  | **Node.js**        | 🌐 Plateforme de développement côté serveur basée sur le moteur JavaScript V8 de Chrome.                 |
| 2  | **Express.js**     | 🚀 Framework web pour Node.js qui simplifie la création de serveurs HTTP.                                |
| 3  | **MySQL**          | 💾 Système de gestion de base de données relationnelle pour stocker et gérer les données de l'application. |
| 4  | **Sequelize**      | 🔄 ORM pour Node.js qui prend en charge MySQL, facilitant les interactions avec la base de données.       |
| 5  | **JWT (JSON Web Tokens)** | 🔐 Technologie pour la création de tokens de session sécurisés afin de gérer les sessions utilisateurs. |
| 6  | **Bcrypt**         | 🔒 Bibliothèque pour hasher et sécuriser les mots de passe des utilisateurs.                              |
| 7  | **Nodemailer**     | 📧 Module pour l'envoi d'emails, utilisé pour des fonctionnalités comme la confirmation d'inscription.    |
| 8  | **Jest**           | 🧪 Framework de tests pour JavaScript, utilisé pour écrire des tests unitaires et d'intégration.          |
| 9  | **Supertest**      | 🌐 Bibliothèque pour tester les API HTTP en conjonction avec Jest.                                      |

## 📁 Structure du Dossier Backend avec Tests

Le backend de l'application est organisé comme suit:

/api
  /node_modules
  /src
    /config
      - db.config.js
    /controllers
      - utilisateurController.js
      - trajetController.js  
      - reservationController.js
      - commentaireController.js
    /models
      - utilisateurModel.js
      - trajetModel.js
      - reservationModel.js
      - commentaireModel.js
    /routes
      - utilisateurRoutes.js
      - trajetRoutes.js
      - reservationRoutes.js
      - commentaireRoutes.js
    /middlewares
      - authMiddleware.js
    /helpers
      - utilityHelper.js
  /tests
    /integration
      /controllers
        - utilisateurController.test.js
        - trajetController.test.js
        - reservationController.test.js
        - commentaireController.test.js
      /models
        - utilisateurModel.test.js
        - trajetModel.test.js
        - reservationModel.test.js
        - commentaireModel.test.js
      /routes
        - utilisateurRoutes.test.js
        - trajetRoutes.test.js
        - reservationRoutes.test.js
        - commentaireRoutes.test.js
    /unitaires
      /controllers
        - utilisateurController.test.js
        - trajetController.test.js
        - reservationController.test.js
        - commentaireController.test.js
      /models
        - utilisateurModel.test.js
        - trajetModel.test.js
        - reservationModel.test.js
        - commentaireModel.test.js
      /routes
        - utilisateurRoutes.test.js
        - trajetRoutes.test.js
        - reservationRoutes.test.js
        - commentaireRoutes.test.js
      /middlewares
        - authMiddleware.test.js
  /public
    - 404.html
    - 500.html
    /images
      - 404.png
      - 500.png
  - server.js
  - app.js
  - package.json
  - .env
  - .gitignore




##

# User Stories

| Rôle | En tant que... | Je veux pouvoir... | Afin de... |
|------|----------------|--------------------|------------|
| Utilisateur | passager ou conducteur | m'inscrire avec mon email et un mot de passe | créer mon compte personnel |
| Utilisateur | passager ou conducteur | me connecter à mon compte | accéder aux fonctionnalités personnalisées |
| Utilisateur | passager ou conducteur | mettre à jour mon profil | modifier mes informations personnelles comme mon contact et ma photo |
| Conducteur | conducteur | publier des trajets avec tous les détails nécessaires | que les passagers puissent les réserver |
| Conducteur | conducteur | gérer mes trajets publiés | les modifier ou les supprimer si nécessaire |
| Passager | passager | rechercher des trajets disponibles | trouver un trajet qui convient à mes préférences |
| Passager | passager | réserver une place dans un trajet | et recevoir une confirmation de ma réservation |
| Utilisateur Authentifié | utilisateur authentifié | laisser une évaluation et un commentaire après un trajet | partager mon expérience avec la communauté |
| Administrateur | administrateur | voir tous les utilisateurs, trajets et réservations | gérer le système de covoiturage efficacement |

##
# Modèle Conceptuel de Données (MCD)



![Description alternative](/api/public/MCD.svg "MCD du site de coivoituge local")

- **commenter** (<ins>_#idUtilisateur_</ins>, <ins>_#idEvaluation_</ins>)
- **concerner** (<ins>_#idTrajet_</ins>, <ins>_#idReservation_</ins>)
- **evaluation** (<ins>idEvaluation</ins>, note, commentaire)
- **noter** (<ins>_#idTrajet_</ins>, <ins>_#idEvaluation_</ins>)
- **proposer** (<ins>_#idUtilisateur_</ins>, <ins>_#idTrajet_</ins>)
- **reservation** (<ins>idReservation</ins>, status)
- **réserver** (<ins>_#idUtilisateur_</ins>, <ins>_#idReservation_</ins>)
- **trajet** (<ins>idTrajet</ins>, départ, arrivée, dateHeure, placesDisponibles, prix)
- **utilisateur** (<ins>idUtilisateur</ins>, email, motDePasse, nom, adresse, numéroDeTéléphone, photoUrl, rôle)

## Entités


| **Entité**     | **Attributs**                                        | **Description**                                                              |
|---------------|-------------------------------------------------------|-------------------------------------------------------------------------------|
| **Utilisateur** | `idUtilisateur`, `email`, `motDePasse`, `nom`, `adresse`, `numéroDeTéléphone`, `photoUrl`, `rôle` | Détails sur les utilisateurs, y compris les conducteurs et les passagers.   |
| **Trajet**      | `idTrajet`, `départ`, `arrivée`, `dateHeure`, `placesDisponibles`, `prix` | Informations sur les trajets offerts par les conducteurs, incluant la destination, la date, et les détails du trajet. |
| **Réservation** | `idReservation`, `status`                            | Réservations effectuées par les passagers pour les trajets.                 |
| **Évaluation**  | `idEvaluation`, `note`, `commentaire`                | Évaluations laissées par les passagers après un trajet, y compris la note et le commentaire. |



## Associations

- **Utilisateur - Réserve - Trajet (1:N):** Un utilisateur peut réserver plusieurs trajets. Chaque réservation est associée à un utilisateur spécifique et concerne un trajet distinct.
- **Utilisateur - Réserve - Réservation (1:N):** Un utilisateur peut effectuer plusieurs réservations. Chaque réservation est liée à un seul utilisateur.
- **Utilisateur - Évalue - Trajet (1:N):** Un utilisateur peut évaluer plusieurs trajets. Chaque évaluation est directement liée à un trajet spécifique par un utilisateur.
- **Utilisateur - Évalue - Évaluation (1:N):** Un utilisateur peut créer plusieurs évaluations. Chaque évaluation est produite par un seul utilisateur et peut être associée à différents trajets ou réservations.


### Relations entre les Entités

### Utilisateur et Trajet
- **Relation :** Un utilisateur peut proposer plusieurs trajets. Chaque trajet est directement lié à un utilisateur qui agit en tant que conducteur.

### Trajet et Réservation
- **Relation :** Un trajet peut être réservé par plusieurs utilisateurs. Chaque réservation est spécifiquement associée à un trajet.

### Trajet et Évaluation
- **Relation :** Un trajet peut être évalué par les passagers, ce qui permet de recueillir des notes et des commentaires sur l'expérience du trajet.

### Réservation et Évaluation
- **Relation :** Chaque évaluation peut être directement liée à une réservation spécifique, permettant aux passagers d'évaluer leurs trajets de manière ciblée.



### Notes Supplémentaires

- **Détails Précis:** Chaque entité contient des informations spécifiques pour refléter son rôle dans l'application.
- **Interactions:** Les entités interagissent entre elles de manière cohérente, facilitant la gestion des fonctionnalités principales de l'application de covoiturage.



## Modèle Logique de Données (MLD)

| Table         | Attribut           | Type                  | Contraintes                          |
|---------------|--------------------|-----------------------|--------------------------------------|
| **Utilisateurs** | `idUtilisateur`     | INT                   | PRIMARY KEY                          |
|               | `Email`            | VARCHAR(100)          | NOT NULL                             |
|               | `MotDePasse`       | VARCHAR(255)          | NOT NULL                             |
|               | `Nom`              | VARCHAR(100)          | NOT NULL                             |
|               | `Adresse`          | VARCHAR(255)          |                                      |
|               | `NuméroDeTéléphone`| VARCHAR(20)           |                                      |
|               | `PhotoUrl`         | VARCHAR(255)          |                                      |
|               | `Rôle`             | VARCHAR(50)           |                                      |
| **Trajets**   | `idTrajet`         | INT                   | PRIMARY KEY                          |
|               | `Départ`           | VARCHAR(100)          | NOT NULL                             |
|               | `Arrivée`          | VARCHAR(100)          | NOT NULL                             |
|               | `DateHeure`        | DATETIME              | NOT NULL                             |
|               | `PlacesDisponibles`| INT                   | NOT NULL                             |
|               | `Prix`             | FLOAT                 | NOT NULL                             |
| **Réservations** | `idReservation` | INT                   | PRIMARY KEY                          |
|               | `Status`           | VARCHAR(50)           | NOT NULL                             |
|               | `idUtilisateur`    | INT                   | FOREIGN KEY REFERENCES Utilisateurs(idUtilisateur) |
|               | `idTrajet`         | INT                   | FOREIGN KEY REFERENCES Trajets(idTrajet) |
| **Évaluations** | `idEvaluation`   | INT                   | PRIMARY KEY                          |
|               | `Note`             | FLOAT                 | NOT NULL                             |
|               | `Commentaire`      | TEXT                  |                                      |
|               | `idUtilisateur`    | INT                   | FOREIGN KEY REFERENCES Utilisateurs(idUtilisateur) |
|               | `idTrajet`         | INT                   | FOREIGN KEY REFERENCES Trajets(idTrajet) |


## Modèle Physique de Données (MPD)

### Utilisateurs

| Champ             | Type            | Description                          |
|-------------------|-----------------|--------------------------------------|
| idUtilisateur     | INT             | ID unique de l'utilisateur           |
| Email             | VARCHAR(100)    | Adresse email de l'utilisateur      |
| MotDePasse        | VARCHAR(255)    | Mot de passe de l'utilisateur       |
| Nom               | VARCHAR(100)    | Nom complet de l'utilisateur         |
| Adresse           | VARCHAR(255)    | Adresse postale de l'utilisateur    |
| NuméroDeTéléphone| VARCHAR(20)     | Numéro de téléphone de l'utilisateur|
| PhotoUrl          | VARCHAR(255)    | URL de la photo de l'utilisateur    |
| Rôle              | VARCHAR(50)     | Rôle de l'utilisateur                |

### Trajets

| Champ             | Type            | Description                          |
|-------------------|-----------------|--------------------------------------|
| idTrajet          | INT             | ID unique du trajet                  |
| Départ            | VARCHAR(100)    | Point de départ du trajet            |
| Arrivée           | VARCHAR(100)    | Point d'arrivée du trajet           |
| DateHeure         | DATETIME        | Date et heure du trajet              |
| PlacesDisponibles | INT             | Nombre de places disponibles         |
| Prix              | FLOAT           | Prix du trajet                       |

### Réservations

| Champ             | Type            | Description                          |
|-------------------|-----------------|--------------------------------------|
| idReservation     | INT             | ID unique de la réservation          |
| Status            | VARCHAR(50)     | Statut de la réservation             |
| idUtilisateur     | INT             | ID de l'utilisateur qui réserve      |
| idTrajet          | INT             | ID du trajet réservé                 |

### Évaluations

| Champ             | Type            | Description                          |
|-------------------|-----------------|--------------------------------------|
| idEvaluation      | INT             | ID unique de l'évaluation            |
| Note              | FLOAT           | Note attribuée                       |
| Commentaire       | TEXT            | Commentaire de l'utilisateur         |
| idUtilisateur     | INT             | ID de l'utilisateur qui évalue       |
| idTrajet          | INT             | ID du trajet évalué                  |




# Dictionnaire de Données


| Entité       | Attributs                                                                                                                                      |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Évaluation    | - **idEvaluation**: Identifiant unique pour l'évaluation.<br> - **Note**: La note attribuée.<br> - **Commentaire**: Un commentaire associé à l'évaluation. |
| Utilisateur  | - **idUtilisateur**: Identifiant unique pour l'utilisateur.<br> - **Email**: Adresse email de l'utilisateur.<br> - **MotDePasse**: Mot de passe de l'utilisateur.<br> - **Nom**: Nom de l'utilisateur.<br> - **Adresse**: Adresse de l'utilisateur.<br> - **NuméroDeTéléphone**: Numéro de téléphone de l'utilisateur.<br> - **PhotoUrl**: URL de la photo de profil de l'utilisateur.<br> - **Rôle**: Le rôle de l'utilisateur (par exemple, admin ou utilisateur standard). |
| Trajet       | - **idTrajet**: Identifiant unique pour le trajet.<br> - **Départ**: Lieu de départ.<br> - **Arrivée**: Lieu d'arrivée.<br> - **DateHeure**: Date et heure du trajet.<br> - **PlacesDisponibles**: Nombre de places disponibles.<br> - **Prix**: Le prix du trajet. |
| Réservation  | - **idReservation**: Identifiant unique pour la réservation.<br> - **Status**: Statut de la réservation (confirmée, annulée, etc.).            |
| Entités Additionnelles | - **Commenter**, **Noter**, **Proposer**, **Réserver**, **Concerner**: Ces entités sont identifiées dans le modèle mais n'ont pas encore d'attributs associés. |



## API Endpoints

### Authentification
| Méthode HTTP | Endpoint        | Description                            |
|--------------|-----------------|----------------------------------------|
| POST         | `/auth/register`| Inscription d'un nouvel utilisateur.   |
| POST         | `/auth/login`   | Connexion de l'utilisateur.            |

### Profil Utilisateur
| Méthode HTTP | Endpoint                  | Description                                  |
|--------------|---------------------------|----------------------------------------------|
| GET          | `/utilisateurs/profile`   | Obtenir le profil de l'utilisateur connecté. |
| PUT          | `/utilisateurs/profile`   | Mettre à jour le profil de l'utilisateur.    |

### Gestion des Trajets
| Méthode HTTP | Endpoint        | Description                        |
|--------------|-----------------|------------------------------------|
| POST         | `/trajets`      | Publier un nouveau trajet.         |
| GET          | `/trajets`      | Lister les trajets disponibles.    |
| GET          | `/trajets/:id`  | Détails d'un trajet.               |
| PUT          | `/trajets/:id`  | Mettre à jour un trajet.           |
| DELETE       | `/trajets/:id`  | Supprimer un trajet.               |

### Recherche et Réservation
| Méthode HTTP | Endpoint               | Description                                  |
|--------------|------------------------|----------------------------------------------|
| GET          | `/trajets/search`      | Rechercher des trajets selon des critères.   |
| POST         | `/reservations`        | Créer une nouvelle réservation.              |
| PUT          | `/reservations/:id`    | Mettre à jour le statut de la réservation.   |

### Évaluations
| Méthode HTTP | Endpoint         | Description                                  |
|--------------|------------------|----------------------------------------------|
| POST         | `/evaluations`          | Ajouter une évaluation pour un trajet.      |
| GET          | `/evaluations`          | Lister les évaluations.                     |

### Administration
| Méthode HTTP | Endpoint                | Description                                 |
|--------------|-------------------------|---------------------------------------------|
| GET          | `/admin/utilisateurs`   | Lister tous les utilisateurs.               |
| GET          | `/admin/trajets`        | Lister tous les trajets.                    |
| GET          | `/admin/reservations`   | Lister toutes les réservations.             |

##

# 🌐 Technologies Frontend

Bienvenue dans la section des technologies frontend utilisées pour le développement de l'interface utilisateur du site de covoiturage local Lamastrois. 

## 🖥️ Technologies Utilisées

| #  | Technologie         | Description                                                                                              |
|----|---------------------|----------------------------------------------------------------------------------------------------------|
| 1  | **React**           | 🏗️ Bibliothèque JavaScript pour la construction d'interfaces utilisateur, utilisée pour créer des vues dynamiques dans le navigateur. |
| 2  | **Vite.js**         | ⚡ Outil de build moderne qui offre un démarrage rapide et des rechargements à chaud pour les projets utilisant des modules ES.        |
| 3  | **React Router**    | 🚦 Bibliothèque pour gérer le routage dans les applications React, essentielle pour une navigation fluide et conditionnelle.          |
| 4  | **Axios**           | 🌍 Client HTTP basé sur les promesses pour le navigateur et Node.js, utilisé pour faire des requêtes HTTP efficaces.                  |
| 5  | **Formik**          | 📝 Bibliothèque pour la gestion des formulaires en React, facilitant la validation et le suivi des états des champs.                    |
| 6  | **Yup**             | 🔍 Constructeur de schéma pour la validation côté client, souvent utilisé avec Formik pour assurer l'intégrité des données saisies.   |
| 7 | **SCSS** | 🎨 Préprocesseur CSS qui permet une écriture de styles plus dynamique . |
| 8  | **Testing Library** | 🧪 Ensemble d'outils de test pour aider à écrire des tests robustes pour les composants React, garantissant la fiabilité des composants. |
| 9  | **Jest**            | 📊 Framework de tests JavaScript populaire pour les tests unitaires, assurant que le code respecte les fonctionnalités attendues.       |
| 10 | **JSX** | ⚛️ Syntaxe qui étend JavaScript permettant d'écrire des éléments HTML dans les scripts React, facilitant la création d'interfaces utilisateur dynamiques. |

## 📂 Structure du Dossier Frontend

- `/frontend`
  - `/public`
    - `index.html` : Fichier HTML principal, point d'entrée du frontend
  - `/src`
    - `/assets` : Contient les ressources statiques comme les images et les styles
    - `/components` : Composants React
      - `/Auth`
        - `LoginForm.jsx` : Formulaire de connexion
        - `RegisterForm.jsx` : Formulaire d'inscription
      - `/User`
        - `UserProfile.jsx` : Affiche le profil de l'utilisateur
      - `/Trips`
        - `TripList.jsx` : Affiche la liste des trajets disponibles
        - `TripForm.jsx` : Formulaire pour la création d'un trajet
        - `SearchForm.jsx` : Formulaire pour la recherche des trajets
      - `/Reservations`
        - `ReservationList.jsx` : Affiche la liste des réservations de l'utilisateur
      - `/Comments`
        - `CommentList.jsx` : Affiche tous les commentaires sur un trajet
        - `CommentForm.jsx` : Formulaire pour soumettre un nouveau commentaire
    - `/services` : Services pour la communication avec l'API
      - `authService.js` : Gère l'authentification et la session utilisateur
      - `tripService.js` : Gère les opérations liées aux trajets
      - `reservationService.js` : Gère les opérations liées aux réservations
      - `commentService.js` : Gère les opérations liées aux commentaires
    - `/hooks` : Hooks React personnalisés
    - `/utils` : Utilitaires
      - `config.js` : Configuration globale de l'application
      - `http.js` : Configuration et instances d'Axios pour les requêtes HTTP
    - `App.jsx` : Composant racine de l'application
    - `index.js` : Point d'entrée de l'application React
  - `/tests`
    - `/components` : Tests unitaires pour les composants
      - `/Auth`
        - `LoginForm.test.jsx`
        - `RegisterForm.test.jsx`
      - `/User`
        - `UserProfile.test.jsx`
      - `/Trips`
        - `TripList.test.jsx`
        - `TripForm.test.jsx`
        - `SearchForm.test.jsx`
      - `/Reservations`
        - `ReservationList.test.jsx`
      - `/Comments`
        - `CommentList.test.jsx`
        - `CommentForm.test.jsx`
    - `/services` : Tests pour les services qui communiquent avec l'API
      - `authService.test.js`
      - `tripService.test.js`
      - `reservationService.test.js`
      - `commentService.test.js`
  - `package.json` : Gère les dépendances et scripts npm
  - `vite.config.js` : Configuration spécifique à Vite.js

# 🚀 Développement et Outils Additionnels

## 1. **Git** 🌿

- 📝 Système de contrôle de version pour gérer les changements dans le code source du projet.

## 2. **GitHub** 🤝

- 🌐 Plateformes pour héberger des dépôts Git, faciliter la revue de code, l'intégration continue et le suivi des problèmes.

## 3. **Postman** 📦

- 🛠️ Outils pour tester les API, permettant de simuler des requêtes client vers le serveur sans utiliser de frontend.

## 4. **ESLint** 🧹

- 🔍 Linter pour JavaScript et TypeScript, aidant à maintenir la qualité du code en vérifiant les erreurs et les problèmes de style.

## 5. **Prettier** ✨

- 💅 Formateur de code pour maintenir un style cohérent dans le code source.

## 6. **dotenv** 🔑

- 🗝️ Module pour charger les variables d'environnement à partir d'un fichier `.env`.

## 7. Nodemon 🔄

 - 🗝️ Nodemon est un utilitaire qui surveille les modifications de fichiers dans votre projet Node.js et redémarre automatiquement le serveur .


##

# 🗓 Planification Agile Scrum pour le site de covoituge local Lamastre-covoit

## Semaine 1 (25 - 29 Avril)

### 🚀 Jour 1 (Jeudi 25) #Lancement

- [x] 🎉 Organiser la cérémonie de lancement (25 avr. 2024)
- [x] 🔧 Configurer les outils de développement (Installation de l'IDE, Configuration des repositories Git)

### 📅 Jour 2 (Vendredi 26) #Planification

- [x] 📝 Planifier le Sprint 1 (Estimation des tâches, Affectation des ressources)
- [x] 🗒 Définir les user stories
- [x] 🏗 Créer les tâches pour le backlog (Rédaction des tickets)

### 🌞 Weekend #Repos

- [x] 😌 Prendre du repos et se préparer pour le développement

## Semaine 2 (30 Avril - 5 Mai)

### 👨‍💻 Lundi à Vendredi #Développement

- [x] 🛠 Développer Sprint 1 (Mise en place de l'environnement de base, Définition de l'architecture initiale)
- [x] 🗝 Développement des fonctionnalités d'authentification et de profil utilisateur
- [x] 🗃 Conception de la base de données

## Semaine 3 (6 - 12 Mai)

### 🔍 Lundi #Revue

- [x] 📊 Réaliser la revue du Sprint 1
- [ ] 🔄 Organiser la rétrospective du sprint
- [x] 🗓 Planifier le Sprint 2

### 👨‍💻 Mardi à Vendredi #Développement

- [ ] 🛠 Développer Sprint 2 (Implémenter les fonctionnalités de trajet, Construire les fonctionnalités de réservation)
- [ ] 📋 Élaborer l'affichage des listes

### 🌞 Weekend #Repos

- [ ] 😌 Continuer à se reposer pour maintenir la productivité

## Semaine 4 (13 - 19 Mai)

### 👨‍💻 Lundi à Vendredi #DéveloppementContinu

- [ ] 🛠 Poursuivre le développement du Sprint 2 (Finaliser les fonctionnalités de réservation, Développer les fonctionnalités de commentaires et retour utilisateur)

### 🌞 Weekend #Repos

- [ ] 😌 Prendre du temps pour se ressourcer

## Semaine 5 (20 - 26 Mai)

### 🔍 Lundi #RevueSprint

- [ ] 📊 Effectuer la revue du Sprint 2
- [ ] 🔄 Tenir la rétrospective du sprint
- [ ] 🗓 Planifier le Sprint 3

### 👨‍💻 Mardi à Vendredi #SprintFinal

- [ ] 🛠 Travailler sur le développement du Sprint 3 (Assurer l'intégration et les tests, Implémenter les fonctionnalités de recherche)
- [ ] 🎨 Peaufiner l'UI/UX

### 🌞 Weekend #ReposFinal

- [ ] 😌 Profiter du dernier weekend avant la finalisation

## Semaine 6 (27 - 28 Mai)

### 👨‍💻 Lundi #Finalisation

- [ ] 🏁 Finaliser le développement
- [ ] 🧪 Réaliser les tests d'acceptation
- [ ] 🚀 Préparer le déploiement

### 🔚 Mardi (28) #Déploiement

- [ ] 📊 Mener la revue finale
- [ ] 🚀 Procéder au déploiement
- [ ] 🎉 Célébrer la clôture du projet

## 📋 Kanban Board

### 📝 Backlog #Backlog

- [x] 🔧 Mise en place de l'environnement de développement complet
- [x] 📝 Définition approfondie des user stories
- [x] 🖥 Configuration initiale des serveurs backend et frontend

### 🔧 Sprint 1 #Sprint1

- [x] 🧑‍💻 Implémenter les modèles de données utilisateur
- [x] 🔗 Créer les endpoints d'authentification
- [ ] 🔐 Installer le système d'authentification sur le frontend

### 🔧 Sprint 2 #Sprint2

- [ ] 🚗 Développer les composants de trajets et réservations
- [ ] 🛠 Intégrer la gestion des réservations dans le backend
- [ ] 🎨 Créer l'interface utilisateur pour les fonctionnalités de trajets

### 🔧 Sprint 3 #Sprint3

- [ ] 🔍 Affiner les fonctionnalités de recherche
- [ ] 🧪 Mener des tests d'intégration et de sécurité
- [ ] 🎨 Améliorer l'expérience utilisateur et l'interface

### 🧪 À Tester #Tests

- [ ] 🔬 Effectuer des tests unitaires des modèles et contrôleurs
- [ ] 🖥️ Réaliser des tests d'interface pour les composants React

### 🚀 À Déployer #Déploiement

- [ ] 📦 Préparer les scripts de déploiement
- [ ] ⚙️ Configurer les serveurs de production

### ✅ Terminé #Terminé

- [ ] 🎬 Marquer le lancement du projet
- [ ] 📝 Effectuer la première revue du code


### 🚀
