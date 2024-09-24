// src/models/evaluationModel.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Evaluation extends Model {
  static associate(models) {
    // Associations
    Evaluation.belongsTo(models.Utilisateur, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'Utilisateur',
    });

    Evaluation.belongsTo(models.Trajet, {
      foreignKey: 'idTrajet',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'Trajet',
    });
  }
}

Evaluation.init(
  {
    idEvaluation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Note: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Ajout de la validation minimale
        max: 5, // Ajout de la validation maximale
      },
    },
    Commentaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateurs',
        key: 'idUtilisateur',
      },
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trajets',
        key: 'idTrajet',
      },
    },
  },
  {
    sequelize,
    modelName: 'Evaluation',
    tableName: 'Evaluations',
    timestamps: true,
  }
);

export default Evaluation;




