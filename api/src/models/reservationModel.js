import { DataTypes } from 'sequelize';

const Reservation = (sequelize) => {
  return sequelize.define('Reservation', {
    idReservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idTrajet: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DateReservation: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Reservations',
    timestamps: true
  });
};

export default Reservation;
