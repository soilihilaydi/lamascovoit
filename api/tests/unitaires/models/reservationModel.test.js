// tests/unitaires/models/reservationModel.test.js

import Reservation from '../../../src/models/reservationModel.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import Trajet from '../../../src/models/trajetModel.js';
import Evaluation from '../../../src/models/evaluationModel.js';
import sequelize from '../../../src/config/db.config.js';
import dotenv from 'dotenv';

dotenv.config();

// Importation de tous les modèles pour configurer les associations
const models = {
  Reservation,
  Utilisateur,
  Trajet,
  Evaluation,
};

// Configuration des associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

describe('Tests unitaires du modèle Reservation', () => {
  let utilisateur;
  let trajet;
  let reservation;

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
    await sequelize.close();
  });

  beforeEach(async () => {
    // Nettoyer les tables avant chaque test
    await Reservation.destroy({ where: {}, force: true });
    await Trajet.destroy({ where: {}, force: true });
    await Utilisateur.destroy({ where: {}, force: true });

    // Créer un utilisateur pour les tests
    utilisateur = await Utilisateur.create({
      Nom: 'Test User',
      Email: 'testuser@example.com',
      MotDePasse: 'password123',
    });

    // Créer un trajet pour les tests
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date('2024-09-25T10:00:00Z'),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });
  });

  // 1. Création d'une réservation valide
  test("Création d'une réservation valide", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    expect(reservation).toBeDefined();
    expect(reservation.idUtilisateur).toBe(utilisateur.idUtilisateur);
    expect(reservation.idTrajet).toBe(trajet.idTrajet);
    expect(reservation.DateReservation).toBeInstanceOf(Date);
  });

  // 2. Validation des champs requis
  test("Ne devrait pas créer une réservation sans 'idUtilisateur'", async () => {
    await expect(
      Reservation.create({
        idTrajet: trajet.idTrajet,
        DateReservation: new Date(),
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer une réservation sans 'idTrajet'", async () => {
    await expect(
      Reservation.create({
        idUtilisateur: utilisateur.idUtilisateur,
        DateReservation: new Date(),
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer une réservation sans 'DateReservation'", async () => {
    await expect(
      Reservation.create({
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
      })
    ).rejects.toThrow();
  });

  // 3. Association avec Utilisateur et Trajet
  test('Association avec Utilisateur et Trajet', async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const foundReservation = await Reservation.findByPk(reservation.idReservation, {
      include: [
        { model: Utilisateur, as: 'Utilisateur' },
        { model: Trajet, as: 'Trajet' },
      ],
    });

    expect(foundReservation.Utilisateur).toBeDefined();
    expect(foundReservation.Utilisateur.Email).toBe('testuser@example.com');
    expect(foundReservation.Trajet).toBeDefined();
    expect(foundReservation.Trajet.Depart).toBe('Paris');
  });

  // 4. Mise à jour d'une réservation
  test("Mise à jour d'une réservation", async () => {
    reservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: new Date(),
    });

    const nouvelleDate = new Date('2024-09-24T12:00:00Z');
    await reservation.update({ DateReservation: nouvelleDate });
    await reservation.reload();

    expect(reservation.DateReservation).toEqual(nouvelleDate);
  });

  // 5. Suppression d'une réservation
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

  // 6. Contraintes sur les clés étrangères
  test("Ne devrait pas créer une réservation avec un 'idUtilisateur' invalide", async () => {
    await expect(
      Reservation.create({
        idUtilisateur: 9999, // Utilisateur inexistant
        idTrajet: trajet.idTrajet,
        DateReservation: new Date(),
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer une réservation avec un 'idTrajet' invalide", async () => {
    await expect(
      Reservation.create({
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: 9999, // Trajet inexistant
        DateReservation: new Date(),
      })
    ).rejects.toThrow();
  });
});

