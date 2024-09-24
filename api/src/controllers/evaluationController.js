import Evaluation from '../models/evaluationModel.js';

export const createEvaluation = async (req, res) => {
  try {
    const { Note, Commentaire, idUtilisateur, idTrajet } = req.body;
    const evaluation = await Evaluation.create({ Note, Commentaire, idUtilisateur, idTrajet });
    res.status(201).json({ message: 'Evaluation creee', evaluation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la creation de l\'evaluation', error });
  }
};

export const getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll();
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recuperation des evaluations', error });
  }
};

export const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByPk(id);
    if (evaluation) {
      res.status(200).json(evaluation);
    } else {
      res.status(404).json({ message: 'Evaluation non trouvee' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recuperation de l\'evaluation', error });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { Note, Commentaire } = req.body;
    const evaluation = await Evaluation.findByPk(id);
    if (evaluation) {
      await evaluation.update({ Note, Commentaire });
      res.status(200).json({ message: 'Evaluation mise a jour' });
    } else {
      res.status(404).json({ message: 'Evaluation non trouvee' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise a jour de l\'evaluation', error });
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByPk(id);
    if (evaluation) {
      await evaluation.destroy();
      res.status(200).json({ message: 'Evaluation supprimee' });
    } else {
      res.status(404).json({ message: 'Evaluation non trouvee' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'evaluation', error });
  }
};

