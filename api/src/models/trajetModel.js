
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

class Trajet extends Model {}

Trajet.init(
  {
    idTrajet: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Départ: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Arrivée: {
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
    },
  },
  {
    sequelize, // L'instance Sequelize doit être passée ici
    modelName: 'Trajet', // Nom du modèle
    tableName: 'Trajets', // Nom de la table dans la base de données
    timestamps: false, // Si vous ne souhaitez pas les champs createdAt et updatedAt
  }
);

// Définir les associations si nécessaire
Trajet.associate = (models) => {
  Trajet.belongsTo(models.Utilisateur, { foreignKey: 'idUtilisateur' });
  Trajet.hasMany(models.Reservation, { foreignKey: 'idTrajet' });
  Trajet.hasMany(models.Evaluation, { foreignKey: 'idTrajet' });
};

export default Trajet;
