// src/models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.TEST_DB_NAME,
  process.env.TEST_DB_USER,
  process.env.TEST_DB_PASS,
  {
    host: process.env.TEST_DB_HOST,
    dialect: process.env.TEST_DB_DIALECT,
  }
);

import Utilisateur from './utilisateurModel.js';
import Reservation from './reservationModel.js';
import Trajet from './trajetModel.js';
import Evaluation from './evaluationModel.js';

// Les modèles sont déjà initialisés avec sequelize dans leurs fichiers respectifs

// Définir les associations dans une fonction
const associateModels = () => {
  Utilisateur.hasMany(Reservation, { foreignKey: 'idUtilisateur' });
  Reservation.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

  Utilisateur.hasMany(Trajet, { foreignKey: 'idUtilisateur' });
  Trajet.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

  Evaluation.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
  Evaluation.belongsTo(Trajet, { foreignKey: 'idTrajet' });

  Utilisateur.hasMany(Evaluation, { foreignKey: 'idUtilisateur' });
  Trajet.hasMany(Evaluation, { foreignKey: 'idTrajet' });
};

// Appeler la fonction pour définir les associations
associateModels();

// Regrouper les modèles dans un objet
const models = {
  Utilisateur,
  Reservation,
  Trajet,
  Evaluation,
};

export { sequelize };
export default models;



