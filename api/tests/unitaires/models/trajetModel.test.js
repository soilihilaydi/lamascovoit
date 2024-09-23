import { Sequelize } from 'sequelize';
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
    dialect: process.env.TEST_DB_DIALECT || 'mysql',
    logging: false, // Désactiver les logs SQL pour les tests
  }
);

describe('Trajet Model', () => {
  beforeAll(async () => {
    try {
      await sequelizeInstance.authenticate();
      console.log('La connexion à la base de données a été établie avec succès.');
      
      // Désactiver les contraintes de clé étrangère temporairement
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelizeInstance.sync({ force: true }); // Réinitialise les tables de test
      await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données :', error);
    }
  });

  test('devrait avoir un nom de modèle et des propriétés correctes', () => {
    expect(Trajet.tableName).toBe('Trajets');
    expect(Trajet.rawAttributes.idTrajet.type.key).toBe('INTEGER');
    expect(Trajet.rawAttributes.Depart.type.key).toBe('STRING');  // Correction : Depart sans accent
    expect(Trajet.rawAttributes.Arrivee.type.key).toBe('STRING'); // Correction : Arrivee sans accent
  });

  test('devrait être initialisé avec les propriétés correctes', () => {
    const trajet = Trajet.build({
      Depart: 'Paris',  // Correction : Depart sans accent
      Arrivee: 'Lyon',  // Correction : Arrivee sans accent
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.50,
      idUtilisateur: 1
    });
    
    expect(trajet.Depart).toBe('Paris');
    expect(trajet.Arrivee).toBe('Lyon');
    expect(trajet.DateHeure).toBeInstanceOf(Date);
    expect(trajet.PlacesDisponibles).toBe(3);
    expect(trajet.Prix).toBe(25.50);
    expect(trajet.idUtilisateur).toBe(1);
  });
  
  afterAll(async () => {
    await sequelizeInstance.close(); // Ferme la connexion après les tests
  });
});

