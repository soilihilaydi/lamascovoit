import Utilisateur from '../../src/models/utilisateurModel.js';

describe('Utilisateur Model', () => {
  beforeEach(async () => {
    // Réinitialiser la base de données de test avant chaque test
    await Utilisateur.destroy({ where: {}, truncate: true });
  });

  test('Valider les champs obligatoires', async () => {
    // Données d'utilisateur incomplètes
    const userData = {
      email: null,
      password: null,
      nom: null,
    };

    // Utilisation de try-catch pour capturer les erreurs de validation
    try {
      // Tentative de création d'un utilisateur avec des champs obligatoires manquants
      await Utilisateur.create(userData);
      // Si la création réussit, nous devrions échouer le test car des champs obligatoires sont manquants
      throw new Error('La création de l\'utilisateur aurait dû échouer');
    } catch (error) {
      // Vérification que l'erreur correspond bien à une violation de non-nullité
      expect(error.message).toMatch(/notNull Violation/);
      expect(error.message).toMatch(/Utilisateur\.email cannot be null/);
      expect(error.message).toMatch(/Utilisateur\.password cannot be null/);
      expect(error.message).toMatch(/Utilisateur\.nom cannot be null/);
    }
  });
});
