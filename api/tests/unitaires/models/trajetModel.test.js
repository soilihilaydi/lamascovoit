import Trajet from '../../../src/models/trajetModel';
import sequelize from '../../../src/config/db.config.js'; // Assurez-vous que le chemin vers votre fichier de configuration de la base de données est correct

describe('Trajet Model', () => {
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  });

  afterEach(async () => {
    // Nettoyer la table des trajets après chaque test
    await Trajet.destroy({ where: {} });
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  });

  it('should create a new trajet with valid data', async () => {
    const trajetData = {
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 5,
      Prix: 49.99
    };

    try {
      // Ajouter le trajet à la base de données
      const newTrajet = await Trajet.create(trajetData);

      // Vérifier si le trajet a été correctement ajouté
      expect(newTrajet.Depart).toBe(trajetData.Depart);
      expect(newTrajet.Arrivee).toBe(trajetData.Arrivee);
      expect(newTrajet.DateHeure).toEqual(trajetData.DateHeure);
      expect(newTrajet.PlacesDisponibles).toBe(trajetData.PlacesDisponibles);
      expect(newTrajet.Prix).toBe(trajetData.Prix);
    } catch (error) {
      // Gérer les erreurs
      console.error('Error creating trajet:', error);
      throw error; // Remonter l'erreur pour échouer le test
    }
  });

  it('should fail to create a new trajet with invalid data', async () => {
    const invalidTrajetData = {
      Depart: null, // Champ obligatoire manquant
      Arrivee: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 5,
      Prix: 49.99
    };

    await expect(Trajet.create(invalidTrajetData)).rejects.toThrow();
  });
});

