// src/controllers/evaluationController.js
import Evaluation from '../models/evaluationModel.js';

export const createEvaluation = async (req, res) => {
  try {
    const { Note, Commentaire, idUtilisateur, idTrajet } = req.body;
    const evaluation = await Evaluation.create({ Note, Commentaire, idUtilisateur, idTrajet });
    res.status(201).json({ message: 'Évaluation créée', evaluation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'évaluation', error });
  }
};

export const getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll();
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des évaluations', error });
  }
};

export const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByPk(id);
    if (evaluation) {
      res.status(200).json(evaluation);
    } else {
      res.status(404).json({ message: 'Évaluation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'évaluation', error });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { Note, Commentaire } = req.body;
    const evaluation = await Evaluation.findByPk(id);
    if (evaluation) {
      await evaluation.update({ Note, Commentaire });
      res.status(200).json({ message: 'Évaluation mise à jour' });
    } else {
      res.status(404).json({ message: 'Évaluation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'évaluation', error });
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByPk(id);
    if (evaluation) {
      await evaluation.destroy();
      res.status(200).json({ message: 'Évaluation supprimée' });
    } else {
      res.status(404).json({ message: 'Évaluation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'évaluation', error });
  }
};


