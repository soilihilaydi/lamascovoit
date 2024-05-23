import { DataTypes } from 'sequelize';

import Reservation from '../../../src/models/reservationModel.js';

describe('Reservation Model', () => {
  test('devrait avoir un nom de modèle et des propriétés corrects', () => {
    expect(Reservation.tableName).toBe('Reservations');
    expect(Reservation.rawAttributes.idReservation.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(Reservation.rawAttributes.idUtilisateur.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(Reservation.rawAttributes.idTrajet.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(Reservation.rawAttributes.DateReservation.type).toBeInstanceOf(DataTypes.DATE);
    expect(Reservation.rawAttributes.Status.type).toBeInstanceOf(DataTypes.STRING);
  });

  test('devrait être initialisé avec les propriétés correctes', () => {
    const reservation = Reservation.build({
      idUtilisateur: 1,
      idTrajet: 1,
      DateReservation: new Date(),
      Status: 'Confirmed'
    });

    expect(reservation.idUtilisateur).toBe(1);
    expect(reservation.idTrajet).toBe(1);
    expect(reservation.DateReservation).toBeInstanceOf(Date);
    expect(reservation.Status).toBe('Confirmed');
  });
});
