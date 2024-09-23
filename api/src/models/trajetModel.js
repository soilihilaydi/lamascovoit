import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Trajet extends Model {
  static associate(models) {
    Trajet.belongsTo(models.Utilisateur, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',  // Supprime le trajet si l'utilisateur est supprimé
      onUpdate: 'CASCADE',  // Met à jour le trajet si l'utilisateur est mis à jour
      as: 'Utilisateur',    // Alias pour clarifier les jointures
    });
    Trajet.hasMany(models.Reservation, {
      foreignKey: 'idTrajet',
      onDelete: 'CASCADE',  // Supprime les réservations associées si le trajet est supprimé
      onUpdate: 'CASCADE',  // Met à jour les réservations si le trajet est mis à jour
      as: 'Reservations',   // Alias pour clarifier les jointures
    });
    Trajet.hasMany(models.Evaluation, {
      foreignKey: 'idTrajet',
      onDelete: 'CASCADE',  // Supprime les évaluations associées si le trajet est supprimé
      onUpdate: 'CASCADE',  // Met à jour les évaluations si le trajet est mis à jour
      as: 'Evaluations',    // Alias pour clarifier les jointures
    });
  }
}

Trajet.init(
  {
    idTrajet: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Depart: { // Nom sans accent
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Arrivee: { // Nom sans accent
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    DateHeure: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    PlacesDisponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Utilisateurs', // Assurez-vous que le nom de la table correspond bien
        key: 'idUtilisateur',
      },
      onDelete: 'CASCADE', // Supprime le trajet si l'utilisateur est supprimé
      onUpdate: 'CASCADE', // Met à jour le trajet si l'utilisateur est mis à jour
    },
  },
  {
    sequelize, // Utilisation de l'instance Sequelize
    modelName: 'Trajet', // Nom du modèle
    tableName: 'Trajets', // Nom de la table dans la base de données
    timestamps: false, // Désactivé si vous ne voulez pas de createdAt et updatedAt
  }
);

export default Trajet;


