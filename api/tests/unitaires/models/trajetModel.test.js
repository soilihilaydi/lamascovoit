// tests/unitaires/models/trajetModel.test.js

import Trajet from '../../../src/models/trajetModel.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import Reservation from '../../../src/models/reservationModel.js'; // Si vous avez ce modèle
import Evaluation from '../../../src/models/evaluationModel.js';   // Si vous avez ce modèle
import sequelize from '../../../src/config/db.config.js';
import dotenv from 'dotenv';

dotenv.config();

// Rassembler tous les modèles dans un objet
const models = {
  Trajet,
  Utilisateur,
  Reservation,
  Evaluation,
};

// Configurer les associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

describe('Tests unitaires du modèle Trajet', () => {
  let utilisateur;
  let trajet;

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
    // Nettoyer les tables avant chaque test
    await Trajet.destroy({ where: {}, force: true });
    await Utilisateur.destroy({ where: {}, force: true });

    // Créer un utilisateur pour les tests
    utilisateur = await Utilisateur.create({
      Email: 'conducteur@example.com',
      MotDePasse: 'password123',
      Nom: 'Conducteur Test',
    });
  });

  // Vos tests...
  // 1. Création d'un trajet valide
  test("Création d'un trajet valide", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date('2024-09-25T10:00:00Z'),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    expect(trajet).toBeDefined();
    expect(trajet.Depart).toBe('Paris');
    expect(trajet.Arrivee).toBe('Lyon');
    expect(trajet.PlacesDisponibles).toBe(3);
    expect(trajet.Prix).toBe(25.5);
  });

  // ... autres tests ...

  // 5. Association avec Utilisateur
  test("Association avec Utilisateur", async () => {
    trajet = await Trajet.create({
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date('2024-09-25T10:00:00Z'),
      PlacesDisponibles: 3,
      Prix: 25.5,
      idUtilisateur: utilisateur.idUtilisateur,
    });

    const foundTrajet = await Trajet.findByPk(trajet.idTrajet, {
      include: [{ model: Utilisateur, as: 'Utilisateur' }],
    });

    expect(foundTrajet.Utilisateur).toBeDefined();
    expect(foundTrajet.Utilisateur.Email).toBe('conducteur@example.com');
  });
});




