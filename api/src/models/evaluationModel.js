// src/models/evaluationModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Utilisateur from './utilisateurModel.js';
import Trajet from './trajetModel.js';

const Evaluation = sequelize.define('Evaluation', {
  idEvaluation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Note: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  idUtilisateur: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: 'idUtilisateur',
    },
  },
  idTrajet: {
    type: DataTypes.INTEGER,
    references: {
      model: Trajet,
      key: 'idTrajet',
    },
  },
}, {
  timestamps: false,
  tableName: 'Evaluations',
});

Evaluation.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
Evaluation.belongsTo(Trajet, { foreignKey: 'idTrajet' });

export default Evaluation;
