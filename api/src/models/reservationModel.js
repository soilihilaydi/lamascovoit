
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Reservation extends Model {}

Reservation.init(
  {
    idReservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DateReservation: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize, // L'instance Sequelize doit être passée ici
    modelName: 'Reservation', // Nom du modèle
    tableName: 'Reservations', // Nom de la table dans la base de données
    timestamps: true // Pour ajouter les champs createdAt et updatedAt
  }
);

// Définir les associations si nécessaire
Reservation.associate = (models) => {
  Reservation.belongsTo(models.Utilisateur, { foreignKey: 'idUtilisateur' });
  Reservation.belongsTo(models.Trajet, { foreignKey: 'idTrajet' });
};

export default Reservation;

