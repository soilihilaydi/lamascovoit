import models from '../../../src/models/index.js';

const { Evaluation } = models;

describe('Evaluation Model', () => {
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


