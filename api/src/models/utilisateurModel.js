// utilisateurModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Utilisateur = sequelize.define('Utilisateur', {
  idUtilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MotDePasse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Adresse: {
    type: DataTypes.STRING
  },
  NuméroDeTéléphone: {
    type: DataTypes.STRING
  },
  PhotoUrl: {
    type: DataTypes.STRING
  },
  Rôle: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

export { Utilisateur, sequelize };
