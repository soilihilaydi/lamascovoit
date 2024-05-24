// tests/unitaires/controllers/evaluationController.test.js
import { createEvaluation, getEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '../../../src/controllers/evaluationController.js';
import Evaluation from '../../../src/models/evaluationModel.js';

jest.mock('../../../src/models/evaluationModel.js', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

describe('Evaluation Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createEvaluation devrait créer une nouvelle évaluation', async () => {
    const mockReq = { body: { Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockEvaluation = { idEvaluation: 1, ...mockReq.body };
    Evaluation.create.mockResolvedValue(mockEvaluation);

    await createEvaluation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Évaluation créée', evaluation: mockEvaluation });
  });

  test('getEvaluations devrait retourner toutes les évaluations', async () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockEvaluations = [{ idEvaluation: 1, Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 }];
    Evaluation.findAll.mockResolvedValue(mockEvaluations);

    await getEvaluations(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockEvaluations);
  });

  test('getEvaluationById devrait retourner une évaluation par ID', async () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockEvaluation = { idEvaluation: 1, Note: 5.0, Commentaire: 'Très bien', idUtilisateur: 1, idTrajet: 1 };
    Evaluation.findByPk.mockResolvedValue(mockEvaluation);

    await getEvaluationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockEvaluation);
  });

  test('getEvaluationById devrait retourner 404 si l\'évaluation n\'est pas trouvée', async () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Evaluation.findByPk.mockResolvedValue(null);

    await getEvaluationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Évaluation non trouvée' });
  });

  test('updateEvaluation devrait mettre à jour une évaluation', async () => {
    const mockReq = { params: { id: 1 }, body: { Note: 4.5, Commentaire: 'Très bien' } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockEvaluation = {
      idEvaluation: 1,
      Note: 4.0,
      Commentaire: 'Bien',
      idUtilisateur: 1,
      idTrajet: 1,
      update: jest.fn().mockResolvedValue([1]),
    };

    Evaluation.findByPk.mockResolvedValue(mockEvaluation);

    await updateEvaluation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Évaluation mise à jour' });
  });

  test('updateEvaluation devrait retourner 404 si l\'évaluation n\'est pas trouvée', async () => {
    const mockReq = { params: { id: 1 }, body: { Note: 4.5, Commentaire: 'Très bien' } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Evaluation.findByPk.mockResolvedValue(null);

    await updateEvaluation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Évaluation non trouvée' });
  });

  test('deleteEvaluation devrait supprimer une évaluation', async () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockEvaluation = {
      idEvaluation: 1,
      Note: 5.0,
      Commentaire: 'Très bien',
      idUtilisateur: 1,
      idTrajet: 1,
      destroy: jest.fn().mockResolvedValue(1),
    };

    Evaluation.findByPk.mockResolvedValue(mockEvaluation);

    await deleteEvaluation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Évaluation supprimée' });
  });

  test('deleteEvaluation devrait retourner 404 si l\'évaluation n\'est pas trouvée', async () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Evaluation.findByPk.mockResolvedValue(null);

    await deleteEvaluation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Évaluation non trouvée' });
  });
});
