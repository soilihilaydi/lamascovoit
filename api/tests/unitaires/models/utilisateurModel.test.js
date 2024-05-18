import { Utilisateur, sequelize } from '../../../src/models/utilisateurModel.js';

describe('Utilisateur Model', () => {
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  });

  afterEach(async () => {
    // Nettoyer la table des utilisateurs après chaque test
    await Utilisateur.destroy({ where: {} });
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  });

  it('devrait créer un nouvel utilisateur avec des données valides', async () => {
    const userData = {
      Email: 'test@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Test',
      Adresse: 'Adresse Test',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    };

    try {
      // Ajouter l'utilisateur à la base de données
      const nouvelUtilisateur = await Utilisateur.create(userData);

      // Vérifier si l'utilisateur a été correctement ajouté
      expect(nouvelUtilisateur.Email).toBe(userData.Email);
      expect(nouvelUtilisateur.MotDePasse).toBe(userData.MotDePasse);
      expect(nouvelUtilisateur.Nom).toBe(userData.Nom);
      expect(nouvelUtilisateur.Adresse).toBe(userData.Adresse);
      expect(nouvelUtilisateur.NuméroDeTéléphone).toBe(userData.NuméroDeTéléphone);
      expect(nouvelUtilisateur.PhotoUrl).toBe(userData.PhotoUrl);
      expect(nouvelUtilisateur.Rôle).toBe(userData.Rôle);
    } catch (error) {
      // Gérer les erreurs
      console.error('Error creating user:', error);
      throw error; // Remonter l'erreur pour échouer le test
    }
  });
});

