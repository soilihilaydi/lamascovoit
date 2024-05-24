import { Sequelize, DataTypes } from 'sequelize';
import Reservation from '../../../src/models/reservationModel.js';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

// Initialisation de Sequelize avec les paramètres MySQL
const sequelizeInstance = new Sequelize(
  process.env.TEST_DB_NAME,
  process.env.TEST_DB_USER,
  process.env.TEST_DB_PASS,
  {
    host: process.env.TEST_DB_HOST,
    dialect: process.env.TEST_DB_DIALECT,
    logging: false, // Désactiver les logs SQL pour les tests
  }
);

const ReservationModel = Reservation(sequelizeInstance);

describe('Reservation Model', () => {
  beforeAll(async () => {
    try {
      await sequelizeInstance.authenticate();
      console.log('Connection has been established successfully.');

      // Désactiver les contraintes de clé étrangère temporairement
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelizeInstance.sync({ force: true });
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) { 
      console.error('Unable to connect to the database:', error);
    }
  });

  test('devrait avoir un nom de modèle et des propriétés corrects', () => {
    expect(ReservationModel.tableName).toBe('Reservations');
    expect(ReservationModel.rawAttributes.idReservation.type.key).toBe('INTEGER');
    expect(ReservationModel.rawAttributes.idUtilisateur.type.key).toBe('INTEGER');
    expect(ReservationModel.rawAttributes.idTrajet.type.key).toBe('INTEGER');
  });

  test('devrait être initialisé avec les propriétés correctes', () => {
    const reservation = ReservationModel.build({
      idUtilisateur: 1,
      idTrajet: 1,
      DateReservation: new Date()
    });

    expect(reservation.idUtilisateur).toBe(1);
    expect(reservation.idTrajet).toBe(1);
    expect(reservation.DateReservation).toBeInstanceOf(Date);
  });
});
