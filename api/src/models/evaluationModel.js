
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Evaluation extends Model {}

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
    },
    Commentaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, // L'instance Sequelize doit être passée ici
    modelName: 'Evaluation', // Nom du modèle
    tableName: 'Evaluations', // Nom de la table dans la base de données
    timestamps: true, // Pour ajouter les champs createdAt et updatedAt
  }
);

// Définir les associations si nécessaire
Evaluation.associate = (models) => {
  Evaluation.belongsTo(models.Utilisateur, { foreignKey: 'idUtilisateur' });
  Evaluation.belongsTo(models.Trajet, { foreignKey: 'idTrajet' });
};

export default Evaluation;
