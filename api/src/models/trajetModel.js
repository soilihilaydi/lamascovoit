import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config.js';

class Trajet extends Model {}

Trajet.init(
  {
    idTrajet: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    }
  },
  {
    sequelize,
    modelName: 'Trajets',
    timestamps: true, // Activer les timestamps
    updatedAt: 'updatedAt' // Utiliser le nom de colonne par défaut
  }
);

export default Trajet;