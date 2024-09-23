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

describe("Tests d'intégration pour les modèles Utilisateur, Trajet, Reservation, Evaluation", () => {
  
  let utilisateur, trajet, reservation, evaluation;

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Evaluation.destroy({ where: {}, force: true });
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

  test("Création d'une réservation", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    expect(reservation).toBeDefined();
    expect(reservation.idUtilisateur).toBe(utilisateur.idUtilisateur);
    expect(reservation.idTrajet).toBe(trajet.idTrajet);
  });

  test("Création d'une évaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    expect(evaluation).toBeDefined();
    expect(evaluation.Note).toBe(5);
    expect(evaluation.Commentaire).toBe('Très bon trajet');
  });

  test("Association d'une réservation avec Utilisateur et Trajet", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const foundReservation = await Reservation.findByPk(reservation.idReservation, {
      include: [
        { model: Utilisateur, as: 'Utilisateur' },
        { model: Trajet, as: 'Trajet' }
      ],
    });

    expect(foundReservation).toBeDefined();
    expect(foundReservation.Utilisateur.idUtilisateur).toBe(utilisateur.idUtilisateur);
    expect(foundReservation.Trajet.idTrajet).toBe(trajet.idTrajet);
  });

  test("Association d'une évaluation avec Utilisateur et Trajet", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation, {
      include: [
        { model: Utilisateur, as: 'Utilisateur' },
        { model: Trajet, as: 'Trajet' }
      ],
    });

    expect(foundEvaluation).toBeDefined();
    expect(foundEvaluation.Utilisateur.idUtilisateur).toBe(utilisateur.idUtilisateur);
    expect(foundEvaluation.Trajet.idTrajet).toBe(trajet.idTrajet);
  });

  test("Suppression d'un utilisateur supprime les réservations et évaluations associées", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    await utilisateur.destroy();

    const foundReservation = await Reservation.findByPk(reservation.idReservation);
    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation);

    expect(foundReservation).toBeNull(); // La réservation doit être supprimée
    expect(foundEvaluation).toBeNull();  // L'évaluation doit être supprimée
  });
});
