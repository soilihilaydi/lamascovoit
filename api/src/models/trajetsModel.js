// models/trajetModel.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Assurez-vous que le chemin vers votre fichier de configuration de la base de données est correct

const Trajet = sequelize.define('Trajet', {
  idTrajet: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Depart: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Arrivee: {
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Trajets',
  timestamps: true 
});

export default Trajet;
