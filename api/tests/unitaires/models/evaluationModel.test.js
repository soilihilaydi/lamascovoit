import { sequelize, UtilisateurModel, TrajetModel, EvaluationModel } from '../../../src/models/index.js';

describe('Evaluation Model', () => {
  beforeAll(async () => {
    // Désactiver les contraintes de clé étrangère temporairement
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  test('devrait avoir des propriétés correctes', () => {
    const attributes = EvaluationModel.rawAttributes;

    expect(attributes).toHaveProperty('idEvaluation');
    expect(attributes).toHaveProperty('Note');
    expect(attributes).toHaveProperty('Commentaire');
    expect(attributes).toHaveProperty('idUtilisateur');
    expect(attributes).toHaveProperty('idTrajet');
  });

  test('devrait avoir des associations correctes', () => {
    expect(EvaluationModel.associations).toHaveProperty('Utilisateur');
    expect(EvaluationModel.associations).toHaveProperty('Trajet');
  });
});
