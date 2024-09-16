import request from 'supertest';
import express from 'express';
import sequelize from '../../../src/config/db.config.js';
import Trajet from '../../../src/models/trajetModel.js';
import trajetRoutes from '../../../src/routes/trajetRoutes.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/trajets', trajetRoutes);

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('La connexion a été établie avec succès.');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe('Tests d\'intégration pour les routes de trajets', () => {
  let token;

  beforeEach(async () => {
    token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Trajet.destroy({ where: {}, force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  test('POST /api/trajets devrait créer un nouveau trajet', async () => {
    const trajetData = {
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.50,
      idUtilisateur: 1
    };

    const response = await request(app)
      .post('/api/trajets')
      .set('Authorization', `Bearer ${token}`)
      .send(trajetData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Trajet créé');
    expect(response.body.trajet).toHaveProperty('idTrajet');
    expect(response.body.trajet.Départ).toBe(trajetData.Départ);
  });

  test('GET /api/trajets devrait récupérer tous les trajets', async () => {
    // Créer quelques trajets de test
    await Trajet.bulkCreate([
      { Départ: 'Paris', Arrivée: 'Lyon', DateHeure: new Date(), PlacesDisponibles: 3, Prix: 25.50, idUtilisateur: 1 },
      { Départ: 'Marseille', Arrivée: 'Nice', DateHeure: new Date(), PlacesDisponibles: 2, Prix: 15.00, idUtilisateur: 1 }
    ]);

    const response = await request(app).get('/api/trajets');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  test('GET /api/trajets/:id devrait récupérer un trajet spécifique', async () => {
    const trajet = await Trajet.create({
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.50,
      idUtilisateur: 1
    });

    const response = await request(app).get(`/api/trajets/${trajet.idTrajet}`);

    expect(response.status).toBe(200);
    expect(response.body.Départ).toBe('Paris');
  });

  test('PUT /api/trajets/:id devrait mettre à jour un trajet', async () => {
    const trajet = await Trajet.create({
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.50,
      idUtilisateur: 1
    });

    const updatedData = { PlacesDisponibles: 2, Prix: 30.00 };

    const response = await request(app)
      .put(`/api/trajets/${trajet.idTrajet}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trajet mis à jour');

    const updatedTrajet = await Trajet.findByPk(trajet.idTrajet);
    expect(updatedTrajet.PlacesDisponibles).toBe(updatedData.PlacesDisponibles);
    expect(updatedTrajet.Prix).toBe(updatedData.Prix);
  });

  test('DELETE /api/trajets/:id devrait supprimer un trajet', async () => {
    const trajet = await Trajet.create({
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 25.50,
      idUtilisateur: 1
    });

    const response = await request(app)
      .delete(`/api/trajets/${trajet.idTrajet}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trajet supprimé');

    const deletedTrajet = await Trajet.findByPk(trajet.idTrajet);
    expect(deletedTrajet).toBeNull();
  });
});