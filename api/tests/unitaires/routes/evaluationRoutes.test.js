// tests/unitaires/routes/evaluationRoutes.test.js
import request from 'supertest';
import express from 'express';
import { createEvaluation, getEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '../../../src/controllers/evaluationController.js';
import Evaluation from '../../../src/models/evaluationModel.js';

// Mock du modèle Evaluation
jest.mock('../../../src/models/evaluationModel.js', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post('/api/evaluations', createEvaluation);
app.get('/api/evaluations', getEvaluations);
app.get('/api/evaluations/:id', getEvaluationById);
app.put('/api/evaluations/:id', updateEvaluation);
app.delete('/api/evaluations/:id', deleteEvaluation);

describe('Evaluation Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/evaluations devrait créer une évaluation', async () => {
    const mockEvaluation = { idEvaluation: 1, Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 };
    Evaluation.create.mockResolvedValue(mockEvaluation);

    const response = await request(app)
      .post('/api/evaluations')
      .send({ Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Évaluation créée');
    expect(response.body.evaluation).toEqual(mockEvaluation);
  });

  test('GET /api/evaluations devrait récupérer toutes les évaluations', async () => {
    const mockEvaluations = [{ idEvaluation: 1, Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 }];
    Evaluation.findAll.mockResolvedValue(mockEvaluations);

    const response = await request(app).get('/api/evaluations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEvaluations);
  });

  test('GET /api/evaluations/:id devrait récupérer une évaluation par ID', async () => {
    const mockEvaluation = { idEvaluation: 1, Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 };
    Evaluation.findByPk.mockResolvedValue(mockEvaluation);

    const response = await request(app).get('/api/evaluations/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEvaluation);
  });

  test('GET /api/evaluations/:id devrait retourner 404 si l\'évaluation n\'est pas trouvée', async () => {
    Evaluation.findByPk.mockResolvedValue(null);

    const response = await request(app).get('/api/evaluations/1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Évaluation non trouvée');
  });

  test('PUT /api/evaluations/:id devrait mettre à jour une évaluation', async () => {
    const mockEvaluation = { idEvaluation: 1, Note: 4.0, Commentaire: 'Bien', idUtilisateur: 1, idTrajet: 1 };
    Evaluation.findByPk.mockResolvedValue({
      ...mockEvaluation,
      update: jest.fn().mockResolvedValue([1]), // Mock de la méthode update
    });

    const response = await request(app)
      .put('/api/evaluations/1')
      .send({ Note: 4.5, Commentaire: 'Très bien' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Évaluation mise à jour');
  });

  test('DELETE /api/evaluations/:id devrait supprimer une évaluation', async () => {
    const mockEvaluation = { idEvaluation: 1, Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 };
    Evaluation.findByPk.mockResolvedValue({
      ...mockEvaluation,
      destroy: jest.fn().mockResolvedValue(1), // Mock de la méthode destroy
    });

    const response = await request(app).delete('/api/evaluations/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Évaluation supprimée');
  });

  test('DELETE /api/evaluations/:id devrait retourner 404 si l\'évaluation n\'est pas trouvée', async () => {
    Evaluation.findByPk.mockResolvedValue(null);

    const response = await request(app).delete('/api/evaluations/1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Évaluation non trouvée');
  });
});

