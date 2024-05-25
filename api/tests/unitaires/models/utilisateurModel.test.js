import sequelize from '../../../src/config/db.config.js'; // Importation par défaut
import Utilisateur from '../../../src/models/utilisateurModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Utilisateur Model', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Désactiver les contraintes de clé étrangère temporairement
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.sync({ force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une nouvelle instance Utilisateur', async () => {
    const utilisateur = await Utilisateur.create({
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

  it('ne devrait pas créer un utilisateur avec un email en double', async () => {
    try {
      await Utilisateur.create({
        Email: 'test@example.com', // Email en double
        MotDePasse: 'password123',
        Nom: 'Jane Doe',
        Adresse: '456 Test Ave',
        NuméroDeTéléphone: '0987654321',
        PhotoUrl: 'http://example.com/photo2.jpg',
        Rôle: 'admin'
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});


   