// tests/unitaires/models/evaluationModel.test.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../src/config/db.config.js';
import Evaluation from '../../../src/models/evaluationModel.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import Trajet from '../../../src/models/trajetModel.js';

describe('Evaluation Model', () => {
  test('devrait avoir des propriétés correctes', () => {
    expect(Evaluation.rawAttributes).toHaveProperty('idEvaluation');
    expect(Evaluation.rawAttributes).toHaveProperty('Note');
    expect(Evaluation.rawAttributes).toHaveProperty('Commentaire');
    expect(Evaluation.rawAttributes).toHaveProperty('idUtilisateur');
    expect(Evaluation.rawAttributes).toHaveProperty('idTrajet');
  });

  test('devrait avoir des associations correctes', () => {
    expect(Evaluation.associations).toHaveProperty('Utilisateur');
    expect(Evaluation.associations).toHaveProperty('Trajet');
  });
});
