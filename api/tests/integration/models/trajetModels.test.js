import models from '../../../src/models/index.js'; // Importation des modèles
import sequelize from '../../../src/config/db.config.js'; // Importation de la configuration Sequelize
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test'; // S'assurer que les tests sont effectués dans l'environnement de test

const { Trajet, Utilisateur, Reservation, Evaluation } = models;

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

describe("Tests d'intégration du modèle Trajet", () => {

  let utilisateur, trajet;

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Reservation.destroy({ where: {}, force: true });
    await Evaluation.destroy({ where: {}, force: true });
    await Trajet.destroy({ where: {}, force: true });
    await Utilisateur.destroy({ where: {}, force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Création d'un utilisateur pour les tests
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
    });
  });

  test("Création d'un trajet valide", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur, // Associer le trajet à l'utilisateur
    });

    expect(trajet).toBeDefined();
    expect(trajet.Depart).toBe('Paris');
    expect(trajet.Arrivee).toBe('Lyon');
  });

  test("Mise à jour d'un trajet", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    await trajet.update({ PlacesDisponibles: 2 });
    await trajet.reload();

    expect(trajet.PlacesDisponibles).toBe(2);
  });

  test("Suppression d'un trajet", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    await trajet.destroy();

    const foundTrajet = await Trajet.findByPk(trajet.idTrajet);
    expect(foundTrajet).toBeNull();
  });

  test("Association avec Utilisateur", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    const foundTrajet = await Trajet.findByPk(trajet.idTrajet, {
      include: [{ model: Utilisateur, as: 'Utilisateur' }],
    });

    expect(foundTrajet.Utilisateur).toBeDefined();
    expect(foundTrajet.Utilisateur.idUtilisateur).toBe(utilisateur.idUtilisateur);
  });

  test("Association avec Reservation", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    const reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const foundTrajet = await Trajet.findByPk(trajet.idTrajet, {
      include: [{ model: Reservation, as: 'Reservations' }],
    });

    expect(foundTrajet.Reservations).toBeDefined();
    expect(foundTrajet.Reservations.length).toBe(1);
    expect(foundTrajet.Reservations[0].idTrajet).toBe(trajet.idTrajet);
  });

  test("Association avec Evaluation", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    const evaluation = await Evaluation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      Note: 4,
      Commentaire: 'Très bon trajet',
    });

    const foundTrajet = await Trajet.findByPk(trajet.idTrajet, {
      include: [{ model: Evaluation, as: 'Evaluations' }],
    });

    expect(foundTrajet.Evaluations).toBeDefined();
    expect(foundTrajet.Evaluations.length).toBe(1);
    expect(foundTrajet.Evaluations[0].idTrajet).toBe(trajet.idTrajet);
  });
});




