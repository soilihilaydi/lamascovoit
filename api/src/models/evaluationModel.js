import { DataTypes } from 'sequelize';

const Evaluation = (sequelize) => {
  return sequelize.define('Evaluation', {
    idEvaluation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Note: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Commentaire: {
      type: DataTypes.STRING
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });
};

export default Evaluation;