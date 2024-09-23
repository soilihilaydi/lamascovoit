import models from '../../../src/models/index.js'; // Importation des modèles
import sequelize from '../../../src/config/db.config.js'; // Importation de la configuration Sequelize
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test'; // S'assurer que les tests sont effectués dans l'environnement de test

const { Utilisateur, Trajet, Evaluation } = models;

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

describe("Tests d'intégration du modèle Evaluation", () => {
  
  let utilisateur, trajet, evaluation;

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Evaluation.destroy({ where: {}, force: true });
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

  test("Création d'une évaluation valide", async () => {
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

  test("Mise à jour d'une évaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    await evaluation.update({ Note: 4, Commentaire: 'Bon trajet' });
    await evaluation.reload();

    expect(evaluation.Note).toBe(4);
    expect(evaluation.Commentaire).toBe('Bon trajet');
  });

  test("Suppression d'une évaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    await evaluation.destroy();

    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation);
    expect(foundEvaluation).toBeNull();
  });

  test("Association avec Utilisateur", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation, {
      include: [{ model: Utilisateur, as: 'Utilisateur' }],
    });

    expect(foundEvaluation.Utilisateur).toBeDefined();
    expect(foundEvaluation.Utilisateur.idUtilisateur).toBe(utilisateur.idUtilisateur);
  });

  test("Association avec Trajet", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Très bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    const foundEvaluation = await Evaluation.findByPk(evaluation.idEvaluation, {
      include: [{ model: Trajet, as: 'Trajet' }],
    });

    expect(foundEvaluation.Trajet).toBeDefined();
    expect(foundEvaluation.Trajet.idTrajet).toBe(trajet.idTrajet);
  });
});
