// tests/unitaires/index.test.js

import models, { sequelize } from '../../../src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

describe("Test unitaire de l'initialisation des modèles et des associations", () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données établie.');

      // Désactiver les vérifications des clés étrangères
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // Synchroniser la base de données
      await sequelize.sync({ force: true });

      // Réactiver les vérifications des clés étrangères
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données :', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Les modèles doivent être définis', () => {
    expect(models.Utilisateur).toBeDefined();
    expect(models.Reservation).toBeDefined();
    expect(models.Trajet).toBeDefined();
    expect(models.Evaluation).toBeDefined();
  });

  test('Les associations doivent être correctement configurées', () => {
    // Vérifier les associations de Utilisateur
    expect(models.Utilisateur.associations.Reservations).toBeDefined();
    expect(models.Utilisateur.associations.Trajets).toBeDefined();
    expect(models.Utilisateur.associations.Evaluations).toBeDefined();

    // Vérifier les associations de Reservation
    expect(models.Reservation.associations.Utilisateur).toBeDefined();
    expect(models.Reservation.associations.Trajet).toBeDefined();

    // Vérifier les associations de Trajet
    expect(models.Trajet.associations.Utilisateur).toBeDefined();
    expect(models.Trajet.associations.Reservations).toBeDefined();
    expect(models.Trajet.associations.Evaluations).toBeDefined();

    // Vérifier les associations de Evaluation
    expect(models.Evaluation.associations.Utilisateur).toBeDefined();
    expect(models.Evaluation.associations.Trajet).toBeDefined();
  });

  test('Les modèles doivent pouvoir créer des enregistrements', async () => {
    const utilisateur = await models.Utilisateur.create({
      Nom: 'Test User',
      Email: 'testuser@example.com',
      MotDePasse: 'password123',
    });

    const trajet = await models.Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date('2024-09-25T10:00:00Z'),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    const reservation = await models.Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const evaluation = await models.Evaluation.create({
      Note: 5,
      Commentaire: 'Excellent trajet !',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    expect(utilisateur).toBeDefined();
    expect(trajet).toBeDefined();
    expect(reservation).toBeDefined();
    expect(evaluation).toBeDefined();
  });

  test('Les associations doivent permettre de récupérer les enregistrements liés', async () => {
    const utilisateur = await models.Utilisateur.findOne({
      where: { Email: 'testuser@example.com' },
      include: [
        { model: models.Reservation, as: 'Reservations' },
        { model: models.Trajet, as: 'Trajets' },
        { model: models.Evaluation, as: 'Evaluations' },
      ],
    });

    expect(utilisateur.Reservations.length).toBeGreaterThan(0);
    expect(utilisateur.Trajets.length).toBeGreaterThan(0);
    expect(utilisateur.Evaluations.length).toBeGreaterThan(0);

    const trajet = await models.Trajet.findOne({
      where: { Depart: 'Paris' },
      include: [
        { model: models.Reservation, as: 'Reservations' },
        { model: models.Evaluation, as: 'Evaluations' },
      ],
    });

    expect(trajet.Reservations.length).toBeGreaterThan(0);
    expect(trajet.Evaluations.length).toBeGreaterThan(0);
  });
});
