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
      console.error('Impossible de se connecter à la base de données :', error);
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
      NumeroDeTelephone: '1234567890',  // Nom corrigé
      PhotoUrl: 'http://example.com/photo.jpg',
      Role: 'user'  // Nom corrigé
    });

    expect(utilisateur.Email).toBe('test@example.com');
    expect(utilisateur.MotDePasse).toBe('password123');
    expect(utilisateur.Nom).toBe('John Doe');
    expect(utilisateur.Adresse).toBe('123 Test St');
    expect(utilisateur.NumeroDeTelephone).toBe('1234567890');  // Nom corrigé
    expect(utilisateur.PhotoUrl).toBe('http://example.com/photo.jpg');
    expect(utilisateur.Role).toBe('user');  // Nom corrigé
  });

  it('ne devrait pas créer un utilisateur avec un email en double', async () => {
    try {
      await Utilisateur.create({
        Email: 'test@example.com', // Email en double
        MotDePasse: 'password123',
        Nom: 'Jane Doe',
        Adresse: '456 Test Ave',
        NumeroDeTelephone: '0987654321',  // Nom corrigé
        PhotoUrl: 'http://example.com/photo2.jpg',
        Role: 'admin'  // Nom corrigé
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});



   