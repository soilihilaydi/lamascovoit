import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Reservation extends Model {
  static associate(models) {
    Reservation.belongsTo(models.Utilisateur, {
      foreignKey: 'idUtilisateur',
      onDelete: 'CASCADE',  // Supprime les réservations si l'utilisateur est supprimé
      onUpdate: 'CASCADE',  // Met à jour la réservation si l'utilisateur est mis à jour
      as: 'Utilisateur',    // Alias pour clarifier les jointures dans les requêtes
    });
    Reservation.belongsTo(models.Trajet, {
      foreignKey: 'idTrajet',
      onDelete: 'CASCADE',  // Supprime les réservations si le trajet est supprimé
      onUpdate: 'CASCADE',  // Met à jour la réservation si le trajet est mis à jour
      as: 'Trajet',         // Alias pour clarifier les jointures dans les requêtes
    });
  }
}

Reservation.init(
  {
    idReservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateurs', // Nom de la table liée (cela peut rester, mais utiliser le modèle est préférable)
        key: 'idUtilisateur',
      },
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trajets', // Nom de la table liée (cela peut rester, mais utiliser le modèle est préférable)
        key: 'idTrajet',
      },
    },
    DateReservation: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize, // Utilisation de l'instance Sequelize
    modelName: 'Reservation', // Nom du modèle
    tableName: 'Reservations', // Nom de la table dans la base de données
    timestamps: true, // Pour ajouter les champs createdAt et updatedAt
  }
);

export default Reservation;




