import sequelize from '../../../src/config/db.config.js';
import Trajet from '../../../src/models/trajetModel.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('Tests d\'intégration pour le modèle Trajet', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
      console.log('La connexion à la base de données de test a été établie avec succès.');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données de test :', error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
      console.log('La connexion à la base de données de test a été fermée avec succès.');
    } catch (error) {
      console.error('Impossible de fermer la connexion à la base de données de test :', error);
    }
  });

  it('devrait créer un nouveau trajet', async () => {
  const trajetData = {
    Départ: 'Paris',
    Arrivée: 'Lyon',
    DateHeure: new Date(),
    PlacesDisponibles: 3,
    Prix: 25.50,
    idUtilisateur: 1
  };

  const trajet = await Trajet.create(trajetData);

  expect(trajet).toBeDefined();
  expect(trajet.Départ).toBe(trajetData.Départ);
  expect(trajet.Arrivée).toBe(trajetData.Arrivée);
  expect(trajet.DateHeure.toISOString().split('.')[0]).toBe(trajetData.DateHeure.toISOString().split('.')[0]);
  expect(trajet.PlacesDisponibles).toBe(trajetData.PlacesDisponibles);
  expect(trajet.Prix).toBe(trajetData.Prix);
  expect(trajet.idUtilisateur).toBe(trajetData.idUtilisateur);
});

it('devrait récupérer un trajet existant', async () => {
  const trajetData = {
    Départ: 'Marseille',
    Arrivée: 'Nice',
    DateHeure: new Date(),
    PlacesDisponibles: 4,
    Prix: 15.75,
    idUtilisateur: 2
  };

  const createdTrajet = await Trajet.create(trajetData);
  const fetchedTrajet = await Trajet.findByPk(createdTrajet.idTrajet);

  expect(fetchedTrajet).toBeDefined();
  expect(fetchedTrajet.Départ).toBe(trajetData.Départ);
  expect(fetchedTrajet.Arrivée).toBe(trajetData.Arrivée);
  expect(fetchedTrajet.DateHeure.toISOString().split('.')[0]).toBe(trajetData.DateHeure.toISOString().split('.')[0]);
  expect(fetchedTrajet.PlacesDisponibles).toBe(trajetData.PlacesDisponibles);
  expect(fetchedTrajet.Prix).toBe(trajetData.Prix);
  expect(fetchedTrajet.idUtilisateur).toBe(trajetData.idUtilisateur);
});

it('devrait mettre à jour un trajet existant', async () => {
  const trajetData = {
    Départ: 'Bordeaux',
    Arrivée: 'Toulouse',
    DateHeure: new Date(),
    PlacesDisponibles: 2,
    Prix: 20.00,
    idUtilisateur: 3
  };

  const createdTrajet = await Trajet.create(trajetData);
  const updatedData = { PlacesDisponibles: 5, Prix: 22.50 };

  await Trajet.update(updatedData, { where: { idTrajet: createdTrajet.idTrajet } });
  const updatedTrajet = await Trajet.findByPk(createdTrajet.idTrajet);

  expect(updatedTrajet.PlacesDisponibles).toBe(updatedData.PlacesDisponibles);
  expect(updatedTrajet.Prix).toBe(updatedData.Prix);
  // Vérifier que les autres champs n'ont pas changé
  expect(updatedTrajet.Départ).toBe(trajetData.Départ);
  expect(updatedTrajet.Arrivée).toBe(trajetData.Arrivée);
  expect(updatedTrajet.DateHeure.toISOString().split('.')[0]).toBe(trajetData.DateHeure.toISOString().split('.')[0]);
  expect(updatedTrajet.idUtilisateur).toBe(trajetData.idUtilisateur);
});

  it('devrait supprimer un trajet existant', async () => {
    const trajetData = {
      Départ: 'Lille',
      Arrivée: 'Bruxelles',
      DateHeure: new Date(),
      PlacesDisponibles: 1,
      Prix: 30.00,
      idUtilisateur: 4
    };

    const createdTrajet = await Trajet.create(trajetData);
    await Trajet.destroy({ where: { idTrajet: createdTrajet.idTrajet } });
    const deletedTrajet = await Trajet.findByPk(createdTrajet.idTrajet);

    expect(deletedTrajet).toBeNull();
  });
});