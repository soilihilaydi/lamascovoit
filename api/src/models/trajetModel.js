import { DataTypes } from 'sequelize';

const Trajet = (sequelize) => {
  return sequelize.define('Trajet', {
    idTrajet: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Départ: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Arrivée: {
      type: DataTypes.STRING,
      allowNull: false
    },
    DateHeure: {
      type: DataTypes.DATE,
      allowNull: false
    },
    NombreDePlaces: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Trajets',
    timestamps: true
  });
};

export default Trajet;