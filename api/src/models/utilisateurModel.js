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
    type: DataTypes.STRING(255),
    allowNull: true
  },
  NuméroDeTéléphone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  PhotoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Rôle: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {

  timestamps: true
});

export default Utilisateur;
