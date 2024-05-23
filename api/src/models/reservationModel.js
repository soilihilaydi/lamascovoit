import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Utilisateur from './utilisateurModel.js';
import Trajet from './trajetModel.js';

const Reservation = sequelize.define('Reservation', {
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
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Associations
Utilisateur.hasMany(Reservation, { foreignKey: 'idUtilisateur' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

Trajet.hasMany(Reservation, { foreignKey: 'idTrajet' });
Reservation.belongsTo(Trajet, { foreignKey: 'idTrajet' });

export default Reservation;
