import { Sequelize } from 'sequelize';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

// Initialisation de Sequelize avec les paramètres MySQL
const sequelizeInstance = new Sequelize(
  process.env.TEST_DB_NAME,
  process.env.TEST_DB_USER,
  process.env.TEST_DB_PASS,
  {
    host: process.env.TEST_DB_HOST,
    dialect: process.env.TEST_DB_DIALECT,
    logging: false, // Désactiver les logs SQL pour les tests
  }
);

const UtilisateurModel = Utilisateur(sequelizeInstance);

describe('Utilisateur Model', () => {
  beforeAll(async () => {
    try {
      await sequelizeInstance.authenticate();
      console.log('Connection has been established successfully.');
      // Désactiver les contraintes de clé étrangère temporairement
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelizeInstance.sync({ force: true });
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });

  it('devrait créer une nouvelle instance Utilisateur', async () => {
    const utilisateur = UtilisateurModel.build({
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe',
      Adresse: '123 Test St',
      NuméroDeTéléphone: '1234567890',
      PhotoUrl: 'http://example.com/photo.jpg',
      Rôle: 'user'
    });

    expect(utilisateur.Email).toBe('test@example.com');
    expect(utilisateur.MotDePasse).toBe('password123');
    expect(utilisateur.Nom).toBe('John Doe');
    expect(utilisateur.Adresse).toBe('123 Test St');
    expect(utilisateur.NuméroDeTéléphone).toBe('1234567890');
    expect(utilisateur.PhotoUrl).toBe('http://example.com/photo.jpg');
    expect(utilisateur.Rôle).toBe('user');
  });
});
   