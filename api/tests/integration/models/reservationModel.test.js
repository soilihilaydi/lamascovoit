import models from '../../../src/models/index.js'; // Importation des modèles
import sequelize from '../../../src/config/db.config.js'; // Importation de la configuration Sequelize
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test'; // S'assurer que les tests sont effectués dans l'environnement de test

const { Utilisateur, Trajet, Reservation } = models;

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

describe("Tests d'intégration du modèle Reservation", () => {

  let utilisateur, trajet, reservation;

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Reservation.destroy({ where: {}, force: true });
    await Trajet.destroy({ where: {}, force: true });
    await Utilisateur.destroy({ where: {}, force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Création d'un utilisateur et d'un trajet pour les tests
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: 'motdepasse123',
    });

    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur, // Associer le trajet à l'utilisateur
    });
  });

  test("Création d'une réservation valide", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    expect(reservation).toBeDefined();
    expect(reservation.idUtilisateur).toBe(utilisateur.idUtilisateur);
    expect(reservation.idTrajet).toBe(trajet.idTrajet);
  });

  test("Mise à jour d'une réservation", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    await reservation.update({ DateReservation: newDate });
    await reservation.reload();

    expect(reservation.DateReservation.toDateString()).toBe(newDate.toDateString());
  });

  test("Suppression d'une réservation", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    await reservation.destroy();

    const foundReservation = await Reservation.findByPk(reservation.idReservation);
    expect(foundReservation).toBeNull();
  });

  test("Association avec Utilisateur", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const foundReservation = await Reservation.findByPk(reservation.idReservation, {
      include: [{ model: Utilisateur, as: 'Utilisateur' }],
    });

    expect(foundReservation.Utilisateur).toBeDefined();
    expect(foundReservation.Utilisateur.idUtilisateur).toBe(utilisateur.idUtilisateur);
  });

  test("Association avec Trajet", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const foundReservation = await Reservation.findByPk(reservation.idReservation, {
      include: [{ model: Trajet, as: 'Trajet' }],
    });

    expect(foundReservation.Trajet).toBeDefined();
    expect(foundReservation.Trajet.idTrajet).toBe(trajet.idTrajet);
  });
});
