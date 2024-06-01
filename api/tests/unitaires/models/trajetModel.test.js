import { Sequelize} from 'sequelize';
import Trajet from '../../../src/models/trajetModel.js';
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

const TrajetModel = Trajet(sequelizeInstance);

describe('Trajet Model', () => {
  beforeAll(async () => {
    try {
      await sequelizeInstance.authenticate();
      console.log('La connexion à la base de données a été établie avec succès.');
      // Désactiver les contraintes de clé étrangère temporairement
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelizeInstance.sync({ force: true });
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données :', error);
    }
  });

  test('devrait avoir un nom de modèle et des propriétés corrects', () => {
    expect(TrajetModel.tableName).toBe('Trajets');
    expect(TrajetModel.rawAttributes.idTrajet.type.key).toBe('INTEGER');
    expect(TrajetModel.rawAttributes.Départ.type.key).toBe('STRING');
    expect(TrajetModel.rawAttributes.Arrivée.type.key).toBe('STRING');
  });

  test('devrait être initialisé avec les propriétés correctes', () => {
    const trajet = TrajetModel.build({
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      NombreDePlaces: 3
    });

    expect(trajet.Départ).toBe('Paris');
    expect(trajet.Arrivée).toBe('Lyon');
    expect(trajet.DateHeure).toBeInstanceOf(Date);
    expect(trajet.NombreDePlaces).toBe(3);
    });
   });
