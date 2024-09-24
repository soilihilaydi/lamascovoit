// tests/unitaires/models/evaluationModel.test.js

import Evaluation from '../../../src/models/evaluationModel.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import Trajet from '../../../src/models/trajetModel.js';
import Reservation from '../../../src/models/reservationModel.js'; // Si nécessaire
import sequelize from '../../../src/config/db.config.js';
import dotenv from 'dotenv';

dotenv.config();

// Importation de tous les modèles pour configurer les associations
const models = {
  Evaluation,
  Utilisateur,
  Trajet,
  Reservation,
};

// Configuration des associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

describe('Tests unitaires du modèle Evaluation', () => {
  let utilisateur;
  let trajet;
  let evaluation;

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
    await Evaluation.destroy({ where: {}, force: true });
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

  // 1. Création d'une évaluation valide
  test("Création d'une évaluation valide", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Excellent trajet !',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    expect(evaluation).toBeDefined();
    expect(evaluation.Note).toBe(5);
    expect(evaluation.Commentaire).toBe('Excellent trajet !');
    expect(evaluation.idUtilisateur).toBe(utilisateur.idUtilisateur);
    expect(evaluation.idTrajet).toBe(trajet.idTrajet);
  });

  // 2. Validation des champs requis
  test("Ne devrait pas créer une évaluation sans 'Note'", async () => {
    await expect(
      Evaluation.create({
        Commentaire: 'Bon trajet.',
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer une évaluation sans 'idUtilisateur'", async () => {
    await expect(
      Evaluation.create({
        Note: 4,
        Commentaire: 'Bon trajet.',
        idTrajet: trajet.idTrajet,
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer une évaluation sans 'idTrajet'", async () => {
    await expect(
      Evaluation.create({
        Note: 4,
        Commentaire: 'Bon trajet.',
        idUtilisateur: utilisateur.idUtilisateur,
      })
    ).rejects.toThrow();
  });

  // 3. Validation des valeurs de 'Note'
  test("Ne devrait pas créer une évaluation avec une 'Note' invalide", async () => {
    await expect(
      Evaluation.create({
        Note: 6, // Note invalide (doit être entre 1 et 5)
        Commentaire: 'Très bon trajet.',
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
      })
    ).rejects.toThrow();

    await expect(
      Evaluation.create({
        Note: 0, // Note invalide (doit être entre 1 et 5)
        Commentaire: 'Mauvais trajet.',
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
      })
    ).rejects.toThrow();
  });

  // 4. Association avec Utilisateur et Trajet
  test('Association avec Utilisateur et Trajet', async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Super expérience !',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation, {
      include: [
        { model: Utilisateur, as: 'Utilisateur' },
        { model: Trajet, as: 'Trajet' },
      ],
    });

    expect(foundEvaluation.Utilisateur).toBeDefined();
    expect(foundEvaluation.Utilisateur.Email).toBe('testuser@example.com');
    expect(foundEvaluation.Trajet).toBeDefined();
    expect(foundEvaluation.Trajet.Depart).toBe('Paris');
  });

  // 5. Mise à jour d'une évaluation
  test("Mise à jour d'une évaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 4,
      Commentaire: 'Bon trajet.',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    await evaluation.update({ Note: 5, Commentaire: 'Excellent trajet !' });
    await evaluation.reload();

    expect(evaluation.Note).toBe(5);
    expect(evaluation.Commentaire).toBe('Excellent trajet !');
  });

  // 6. Suppression d'une évaluation
  test("Suppression d'une évaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 3,
      Commentaire: 'Trajet moyen.',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    await evaluation.destroy();

    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation);
    expect(foundEvaluation).toBeNull();
  });

  // 7. Contraintes sur les clés étrangères
  test("Ne devrait pas créer une évaluation avec un 'idUtilisateur' invalide", async () => {
    await expect(
      Evaluation.create({
        Note: 4,
        Commentaire: 'Bon trajet.',
        idUtilisateur: 9999, // Utilisateur inexistant
        idTrajet: trajet.idTrajet,
      })
    ).rejects.toThrow();
  });

  test("Ne devrait pas créer une évaluation avec un 'idTrajet' invalide", async () => {
    await expect(
      Evaluation.create({
        Note: 4,
        Commentaire: 'Bon trajet.',
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: 9999, // Trajet inexistant
      })
    ).rejects.toThrow();
  });
});



