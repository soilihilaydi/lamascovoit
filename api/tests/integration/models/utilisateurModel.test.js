import models from '../../../src/models/index.js'; // Importation des modèles
import sequelize from '../../../src/config/db.config.js'; // Importation de la configuration Sequelize
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test'; // S'assurer que les tests sont effectués dans l'environnement de test

const { Utilisateur, Reservation, Trajet, Evaluation } = models;

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

describe("Tests d'intégration du modèle Utilisateur", () => {

  let utilisateur, trajet;

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Reservation.destroy({ where: {}, force: true });
    await Trajet.destroy({ where: {}, force: true });
    await Evaluation.destroy({ where: {}, force: true });
    await Utilisateur.destroy({ where: {}, force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Création d'un trajet pour les tests
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: null, // À associer à un utilisateur plus tard
    });
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

  test("Champs optionnels peuvent être null", async () => {
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
      Adresse: null, // Champs optionnels
      NumeroDeTelephone: null,
      PhotoUrl: null,
      Role: null,
    });

    expect(utilisateur.Adresse).toBeNull();
    expect(utilisateur.NumeroDeTelephone).toBeNull();
    expect(utilisateur.PhotoUrl).toBeNull();
    expect(utilisateur.Role).toBeNull();
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

  test("Association avec Reservation", async () => {
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
    });

    // Mettre à jour le trajet avec l'utilisateur associé
    await trajet.update({ idUtilisateur: utilisateur.idUtilisateur });

    const reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet, // Associer la réservation à un trajet valide
      DateReservation: new Date(),
    });

    // Utiliser l'alias 'Utilisateur' dans l'inclusion de l'association
    const foundReservation = await Reservation.findByPk(reservation.idReservation, {
      include: [{ model: Utilisateur, as: 'Utilisateur' }],
    });

    expect(foundReservation.Utilisateur).toBeDefined();
    expect(foundReservation.Utilisateur.idUtilisateur).toBe(utilisateur.idUtilisateur);
  });
});


