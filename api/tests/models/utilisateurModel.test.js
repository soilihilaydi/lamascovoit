import sequelize from '../../src/config/db.config.js'; // Importation depuis le fichier racine
import Utilisateur from '../../src/models/utilisateurModel.js';

beforeAll(async () => {
  try {
    await sequelize.authenticate(); // Vérification de la connexion à la base de données
    await sequelize.sync({ force: true }); // Synchronisation du modèle avec la base de données
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close(); // Fermeture de la connexion à la base de données
  } catch (error) {
    console.error('Erreur lors de la fermeture de la connexion à la base de données :', error);
  }
});

describe('Utilisateur Model', () => {
  test('Création d\'un nouvel utilisateur', async () => {
    const user = await Utilisateur.create({
      email: 'test@example.com',
      password: 'password',
      nom: 'Test User',
      role: 'utilisateur'
    });

    expect(user.email).toBe('test@example.com');
    expect(user.nom).toBe('Test User');
    expect(user.role).toBe('utilisateur');
  });

  test('Erreur lors de la création d\'un utilisateur sans email', async () => {
    await expect(Utilisateur.create({
      password: 'password',
      nom: 'Test User',
      role: 'utilisateur'
    })).rejects.toThrow();
  });
});