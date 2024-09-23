import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';  // Importation de l'instance Sequelize

class Utilisateur extends Model {
  static associate(models) {
    // Définir les associations avec onDelete et onUpdate
    Utilisateur.hasMany(models.Reservation, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',  // Supprimer les réservations si l'utilisateur est supprimé
      onUpdate: 'CASCADE',  // Mettre à jour les réservations si l'utilisateur est mis à jour
      as: 'Reservations',   // Alias pour clarifier les jointures
    });

    Utilisateur.hasMany(models.Trajet, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',  // Supprimer les trajets si l'utilisateur est supprimé
      onUpdate: 'CASCADE',  // Mettre à jour les trajets si l'utilisateur est mis à jour
      as: 'Trajets',        // Alias pour clarifier les jointures
    });

    Utilisateur.hasMany(models.Evaluation, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',  // Supprimer les évaluations si l'utilisateur est supprimé
      onUpdate: 'CASCADE',  // Mettre à jour les évaluations si l'utilisateur est mis à jour
      as: 'Evaluations',    // Alias pour clarifier les jointures
    });
  }
}

Utilisateur.init(
  {
    idUtilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    MotDePasse: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Adresse: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    NumeroDeTelephone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    PhotoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Role: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize, // Utilisation de l'instance Sequelize importée
    modelName: 'Utilisateur', 
    tableName: 'Utilisateurs', 
    timestamps: true, // Ajoute les champs createdAt et updatedAt
    paranoid: true,   // Ajoute le champ deletedAt pour une suppression "douce" (soft delete)
  }
);

export default Utilisateur;






