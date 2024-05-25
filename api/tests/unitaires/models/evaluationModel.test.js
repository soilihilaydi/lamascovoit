import { sequelize, UtilisateurModel, TrajetModel, EvaluationModel } from '../../../src/models/index.js';

describe('Evaluation Model', () => {
  

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
