import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

describe('Connexion à la base de données', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize(
      process.env.TEST_DB_NAME,
      process.env.TEST_DB_USER,
      process.env.TEST_DB_PASS,
      {
        host: process.env.TEST_DB_HOST,
        dialect: process.env.TEST_DB_DIALECT,
        logging: false,
      }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('devrait se connecter à la base de données', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  test('devrait avoir toutes les tables requises', async () => {
    const [results] = await sequelize.query('SHOW TABLES');
    const tables = results.map(r => r[`Tables_in_${process.env.TEST_DB_NAME}`]);
    expect(tables).toEqual(expect.arrayContaining(['Utilisateurs', 'Trajets', 'Reservations', 'Evaluations']));
  });

  test('La table Utilisateurs devrait avoir les colonnes correctes', async () => {
    const [columns] = await sequelize.query('DESCRIBE Utilisateurs');
    const columnNames = columns.map(c => c.Field);
    expect(columnNames).toEqual(expect.arrayContaining([
      'idUtilisateur', 'Email', 'MotDePasse', 'Nom', 'Adresse', 'NumeroDeTelephone', 'PhotoUrl', 'Role', 'createdAt', 'updatedAt', 'deletedAt'
    ]));
  });

  test('La table Trajets devrait avoir les colonnes correctes', async () => {
    const [columns] = await sequelize.query('DESCRIBE Trajets');
    const columnNames = columns.map(c => c.Field);
    expect(columnNames).toEqual(expect.arrayContaining([
      'idTrajet', 'Depart', 'Arrivee', 'DateHeure', 'PlacesDisponibles', 'Prix', 'idUtilisateur'
    ]));
  });

  test('La table Reservations devrait avoir les colonnes correctes', async () => {
    const [columns] = await sequelize.query('DESCRIBE Reservations');
    const columnNames = columns.map(c => c.Field);
    expect(columnNames).toEqual(expect.arrayContaining([
      'idReservation', 'idUtilisateur', 'idTrajet', 'DateReservation', 'createdAt', 'updatedAt'
    ]));
  });

  test('La table Evaluations devrait avoir les colonnes correctes', async () => {
    const [columns] = await sequelize.query('DESCRIBE Evaluations');
    const columnNames = columns.map(c => c.Field);
    expect(columnNames).toEqual(expect.arrayContaining([
      'idEvaluation', 'Note', 'Commentaire', 'idUtilisateur', 'idTrajet', 'createdAt', 'updatedAt'
    ]));
  });
});