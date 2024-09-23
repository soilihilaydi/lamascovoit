import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Evaluation extends Model {
  static associate(models) {
    // Définir les associations avec onDelete et onUpdate
    Evaluation.belongsTo(models.Utilisateur, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',  // Supprime les évaluations si l'utilisateur est supprimé
      onUpdate: 'CASCADE',  // Met à jour les évaluations si l'utilisateur est mis à jour
      as: 'Utilisateur',    // Alias pour clarifier les jointures
    });

    Evaluation.belongsTo(models.Trajet, {
      foreignKey: 'idTrajet',
      onDelete: 'CASCADE',  // Supprime les évaluations si le trajet est supprimé
      onUpdate: 'CASCADE',  // Met à jour les évaluations si le trajet est mis à jour
      as: 'Trajet',         // Alias pour clarifier les jointures
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
    },
    Commentaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateurs', // Nom de la table liée
        key: 'idUtilisateur',
      },
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trajets', // Nom de la table liée
        key: 'idTrajet',
      },
    },
  },
  {
    sequelize, // Utilisation de l'instance Sequelize
    modelName: 'Evaluation', // Nom du modèle
    tableName: 'Evaluations', // Nom de la table dans la base de données
    timestamps: true, // Pour ajouter les champs createdAt et updatedAt
  }
);

export default Evaluation;



