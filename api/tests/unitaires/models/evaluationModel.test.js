import { Sequelize } from 'sequelize';
import { Utilisateur, Trajet, Evaluation, sequelize } from '../../../src/models/index.js';

describe('Evaluation Model', () => {
  beforeAll(async () => {
    // Synchroniser les modèles pour s'assurer que les associations sont définies
    await sequelize.sync({ force: true });
  });

  test('devrait avoir des propriétés correctes', () => {
    const attributes = Evaluation.rawAttributes;

    expect(attributes).toHaveProperty('idEvaluation');
    expect(attributes).toHaveProperty('Note');
    expect(attributes).toHaveProperty('Commentaire');
    expect(attributes).toHaveProperty('idUtilisateur');
    expect(attributes).toHaveProperty('idTrajet');
  });

  test('devrait avoir des associations correctes', () => {
    expect(Evaluation.associations).toHaveProperty('Utilisateur');
    expect(Evaluation.associations).toHaveProperty('Trajet');
  });
});