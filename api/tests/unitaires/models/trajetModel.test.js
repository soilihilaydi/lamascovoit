import Trajet from '../../../src/models/trajetModel';
import sequelize from '../../../src/config/db.config.js'; // Assurez-vous que le chemin vers votre fichier de configuration de la base de données est correct

describe('Trajet Model', () => {
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error('Erreur de synchronisation de la base de données :', error);
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
      console.error('Erreur lors de la fermeture de la connexion à la base de données :', error);
    }
  });

  it('devrait créer un nouveau trajet avec des données valides', async () => {
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
      console.error('Erreur lors de la création du trajet :', error);
      throw error; // Remonter l'erreur pour échouer le test
    }
  });

  it('ne devrait pas réussir à créer un nouveau trajet avec des données invalides', async () => {
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

