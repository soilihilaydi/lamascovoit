import models from '../../../src/models/index.js'; // Importation des modèles
import sequelize from '../../../src/config/db.config.js'; // Importation de la configuration Sequelize
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test'; // S'assurer que les tests sont effectués dans l'environnement de test

const { Utilisateur, Trajet, Evaluation } = models;

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion a la base de donnees de test etablie.');

    // Desactiver les verifications des cles etrangeres
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Synchroniser la base de donnees
    await sequelize.sync({ force: true });

    // Reactiver les verifications des cles etrangeres
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Impossible de se connecter a la base de donnees de test :', error);
  }
});

afterAll(async () => {
  // Fermer la connexion après les tests
  await sequelize.close();
});

describe("Tests d'integration du modele Evaluation", () => {
  
  let utilisateur, trajet, evaluation;

  beforeEach(async () => {
    // Nettoyer la base de donnees avant chaque test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Evaluation.destroy({ where: {}, force: true });
    await Trajet.destroy({ where: {}, force: true });
    await Utilisateur.destroy({ where: {}, force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Creation d'un utilisateur et d'un trajet pour les tests
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
      idUtilisateur: utilisateur.idUtilisateur, // Associer le trajet a l'utilisateur
    });
  });

  test("Creation d'une evaluation valide", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Tres bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    expect(evaluation).toBeDefined();
    expect(evaluation.Note).toBe(5);
    expect(evaluation.Commentaire).toBe('Tres bon trajet');
  });

  test("Mise a jour d'une evaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Tres bon trajet',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    await evaluation.update({ Note: 4, Commentaire: 'Bon trajet' });
    await evaluation.reload();

    expect(evaluation.Note).toBe(4);
    expect(evaluation.Commentaire).toBe('Bon trajet');
  });

  test("Suppression d'une evaluation", async () => {
    evaluation = await Evaluation.create({
      Note: 5,
      Commentaire: 'Tres bon trajet',
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
      Commentaire: 'Tres bon trajet',
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
      Commentaire: 'Tres bon trajet',
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

