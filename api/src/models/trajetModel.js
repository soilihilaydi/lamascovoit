import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Trajet = sequelize.define('Trajet', {
  idTrajet: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Départ: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Arrivée: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  DateHeure: {
    type: DataTypes.DATE,
    allowNull: false
  },
  PlacesDisponibles: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Prix: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  idUtilisateur: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Trajets',
  timestamps: false 
});

export default Trajet;