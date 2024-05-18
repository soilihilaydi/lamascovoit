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
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  MotDePasse: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Adresse: {
    type: DataTypes.STRING(255)
  },
  NuméroDeTéléphone: {
    type: DataTypes.STRING(20)
  },
  PhotoUrl: {
    type: DataTypes.STRING(255)
  },
  Rôle: {
    type: DataTypes.STRING(50),
    defaultValue: 'utilisateur'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

export { Utilisateur, sequelize };
