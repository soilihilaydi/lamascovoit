
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Utilisateur extends Model {}

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
    NuméroDeTéléphone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    PhotoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Rôle: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize, // L'instance Sequelize doit être passée ici
    modelName: 'Utilisateur', // Nom du modèle
    tableName: 'Utilisateurs', // Nom de la table dans la base de données
    timestamps: true, // Pour ajouter les champs createdAt et updatedAt
  }
);

// Définir les associations si nécessaire
Utilisateur.associate = (models) => {
  Utilisateur.hasMany(models.Reservation, { foreignKey: 'idUtilisateur' });
  Utilisateur.hasMany(models.Trajet, { foreignKey: 'idUtilisateur' });
  Utilisateur.hasMany(models.Evaluation, { foreignKey: 'idUtilisateur' });
};

export default Utilisateur;

