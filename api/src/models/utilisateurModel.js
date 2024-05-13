import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Utilisateur = sequelize.define('Utilisateur', {
  idUtilisateur: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  nom: { type: DataTypes.STRING, allowNull: true }, // Modifier en allowNull: true
  adresse: { type: DataTypes.STRING, allowNull: true }, // Modifier en allowNull: true
  telephone: { type: DataTypes.STRING, allowNull: true }, // Modifier en allowNull: true
  photoUrl: { type: DataTypes.STRING, allowNull: true }, // Modifier en allowNull: true
  role: { type: DataTypes.STRING, allowNull: true }, // Modifier en allowNull: true
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
});

export default Utilisateur;

