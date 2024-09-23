import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Utilisateur from './utilisateurModel.js';
import Reservation from './reservationModel.js';
import Trajet from './trajetModel.js';
import Evaluation from './evaluationModel.js';

dotenv.config(); // Chargement des variables d'environnement

// Définir si l'on est dans l'environnement de test ou non
const isTestEnv = process.env.NODE_ENV === 'test';

// Utilisation des variables d'environnement appropriées pour la base de données
const dbName = isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME;
const dbUser = isTestEnv ? process.env.TEST_DB_USER : process.env.DB_USER;
const dbPass = isTestEnv ? process.env.TEST_DB_PASS : process.env.DB_PASS;
const dbHost = isTestEnv ? process.env.TEST_DB_HOST : process.env.DB_HOST;
const dbDialect = isTestEnv ? process.env.TEST_DB_DIALECT : process.env.DB_DIALECT;

// Initialisation de l'instance Sequelize avec les paramètres de la base de données
const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPass,
  {
    host: dbHost,
    dialect: dbDialect,
    logging: false, // Désactivation des logs SQL pour des performances plus propres
  }
);

// Initialisation des modèles avec Sequelize
Utilisateur.init(Utilisateur.rawAttributes, { sequelize });
Reservation.init(Reservation.rawAttributes, { sequelize });
Trajet.init(Trajet.rawAttributes, { sequelize });
Evaluation.init(Evaluation.rawAttributes, { sequelize });

// Appel de la méthode `associate` pour chaque modèle pour définir les associations
Utilisateur.associate({ Reservation, Trajet, Evaluation });
Reservation.associate({ Utilisateur, Trajet });
Trajet.associate({ Utilisateur, Reservation, Evaluation });
Evaluation.associate({ Utilisateur, Trajet });

// Exportation des modèles et de l'instance Sequelize
const models = {
  Utilisateur,
  Reservation,
  Trajet,
  Evaluation,
};

export { sequelize };
export default models;








