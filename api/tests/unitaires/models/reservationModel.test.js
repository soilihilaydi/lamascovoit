import dotenv from 'dotenv';
dotenv.config();
process.env.NODE_ENV = 'test';

import sequelize from '../../../src/config/db.config.js';
import models from '../../../src/models/index.js';

console.log('models:', models); // Pour vérifier le contenu de models

const { Reservation } = models;

describe('Reservation Model', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log('La connexion à la base de données a été établie avec succès.');

      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.sync({ force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données :', error);
    }
  });

  test('devrait avoir un nom de modèle et des propriétés corrects', () => {
    expect(Reservation.tableName).toBe('Reservations');
    expect(Reservation.rawAttributes.idReservation.type.key).toBe('INTEGER');
    expect(Reservation.rawAttributes.idUtilisateur.type.key).toBe('INTEGER');
    expect(Reservation.rawAttributes.idTrajet.type.key).toBe('INTEGER');
  });

  test('devrait être initialisé avec les propriétés correctes', () => {
    const reservation = Reservation.build({
      idUtilisateur: 1,
      idTrajet: 1,
      DateReservation: new Date(),
    });

    expect(reservation.idUtilisateur).toBe(1);
    expect(reservation.idTrajet).toBe(1);
    expect(reservation.DateReservation).toBeInstanceOf(Date);
  });
});
