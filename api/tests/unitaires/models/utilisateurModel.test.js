
import Utilisateur from '../../../src/models/utilisateurModel.js'; // Importation du modèle Utilisateur
import sequelize from '../../../src/config/db.config.js'; // Importation de la configuration Sequelize
import dotenv from 'dotenv';

dotenv.config();

describe("Tests unitaires du modèle Utilisateur", () => {
  let utilisateur;

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données de test établie.');

      // Désactiver les vérifications des clés étrangères
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // Synchroniser la base de données
      await sequelize.sync({ force: true });

      // Réactiver les vérifications des clés étrangères
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données de test :', error);
    }
  });

  afterAll(async () => {
    // Fermer la connexion après les tests
    await sequelize.close();
  });

  beforeEach(async () => {
    // Nettoyer la table Utilisateur avant chaque test
    await Utilisateur.destroy({ where: {}, force: true });
  });

  test("Création d'un utilisateur valide", async () => {
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
      Adresse: '123 Rue de la Paix',
      NumeroDeTelephone: '0601020304',
      Role: 'Utilisateur',
    });

    expect(utilisateur).toBeDefined();
    expect(utilisateur.Nom).toBe('Dupont');
    expect(utilisateur.Email).toBe('jean.dupont@example.com');
  });

  test("Ne devrait pas créer un utilisateur sans email", async () => {
    await expect(
      Utilisateur.create({
        Nom: 'Dupont',
        MotDePasse: 'motdepasse123',
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer un utilisateur avec un email déjà utilisé", async () => {
    // Créer un premier utilisateur
    await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
    });

    // Tenter de créer un second utilisateur avec le même email
    await expect(
      Utilisateur.create({
        Nom: 'Durand',
        Email: 'jean.dupont@example.com',
        MotDePasse: 'motdepasse456',
      })
    ).rejects.toThrow();
  });

  test("Mise à jour d'un utilisateur", async () => {
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
    });

    await utilisateur.update({ Nom: 'Durand' });
    await utilisateur.reload();

    expect(utilisateur.Nom).toBe('Durand');
  });

  test("Suppression d'un utilisateur", async () => {
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
    });

    await utilisateur.destroy();

    const foundUtilisateur = await Utilisateur.findByPk(utilisateur.idUtilisateur);
    expect(foundUtilisateur).toBeNull();
  });

  test("Les champs optionnels peuvent être null", async () => {
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
      Adresse: null,
      NumeroDeTelephone: null,
      PhotoUrl: null,
      Role: null,
    });

    expect(utilisateur.Adresse).toBeNull();
    expect(utilisateur.NumeroDeTelephone).toBeNull();
    expect(utilisateur.PhotoUrl).toBeNull();
    expect(utilisateur.Role).toBeNull();
  });

  // Ajoutez ici des tests pour les méthodes personnalisées si nécessaire
});





   