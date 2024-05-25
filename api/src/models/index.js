import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Utilisateur from './utilisateurModel.js';
import Reservation from './reservationModel.js';
import Trajet from './trajetModel.js';
import Evaluation from './evaluationModel.js';

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

const UtilisateurModel = Utilisateur;
const ReservationModel = Reservation(sequelize);
const TrajetModel = Trajet(sequelize);
const EvaluationModel = Evaluation(sequelize);

// Définir les associations
UtilisateurModel.hasMany(ReservationModel, { foreignKey: 'idUtilisateur' });
ReservationModel.belongsTo(UtilisateurModel, { foreignKey: 'idUtilisateur' });

UtilisateurModel.hasMany(TrajetModel, { foreignKey: 'idUtilisateur' });
TrajetModel.belongsTo(UtilisateurModel, { foreignKey: 'idUtilisateur' });

EvaluationModel.belongsTo(UtilisateurModel, { foreignKey: 'idUtilisateur' });
EvaluationModel.belongsTo(TrajetModel, { foreignKey: 'idTrajet' });

UtilisateurModel.hasMany(EvaluationModel, { foreignKey: 'idUtilisateur' });
TrajetModel.hasMany(EvaluationModel, { foreignKey: 'idTrajet' });

export { sequelize, UtilisateurModel, ReservationModel, TrajetModel, EvaluationModel };

