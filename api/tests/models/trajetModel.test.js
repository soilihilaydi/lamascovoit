import { Sequelize } from 'sequelize';
import Trajet from '../../src/models/trajetModel.js';

// Utiliser les paramètres de la base de données de test depuis le fichier .env
const sequelize = new Sequelize(
  `mysql://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASS}@${process.env.TEST_DB_HOST}/${process.env.TEST_DB_NAME}`,
  {
    logging: false,
    dialect: 'mysql',
  }
);

Trajet.init(Trajet.rawAttributes, {
  sequelize,
  modelName: 'Trajet',
});

describe('Modèle Trajet', () => {
  beforeEach(async () => {
    await Trajet.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Valider les champs obligatoires', async () => {
    const trajetData = {
      Depart: null,
      Arrivee: null,
      DateHeure: null,
      PlacesDisponibles: null,
      Prix: null,
    };

    try {
      await Trajet.create(trajetData);
      throw new Error('La création du trajet aurait dû échouer');
    } catch (error) {
      expect(error.message).toMatch(/notNull Violation/);
      expect(error.message).toMatch(/Trajet\.Depart cannot be null/);
      expect(error.message).toMatch(/Trajet\.Arrivee cannot be null/);
      expect(error.message).toMatch(/Trajet\.DateHeure cannot be null/);
      expect(error.message).toMatch(/Trajet\.PlacesDisponibles cannot be null/);
      expect(error.message).toMatch(/Trajet\.Prix cannot be null/);
    }
  });

  test('Créer un trajet avec des données valides', async () => {
    const trajetData = {
      Depart: 'Paris',
      Arrivee: 'Marseille',
      DateHeure: new Date(),
      PlacesDisponibles: 4,
      Prix: 50,
    };

    const trajet = await Trajet.create(trajetData);

    expect(trajet.Depart).toBe(trajetData.Depart);
    expect(trajet.Arrivee).toBe(trajetData.Arrivee);
    expect(trajet.DateHeure).toEqual(trajetData.DateHeure);
    expect(trajet.PlacesDisponibles).toBe(trajetData.PlacesDisponibles);
    expect(trajet.Prix).toBe(trajetData.Prix);
  });
});
