import request from 'supertest';
import express from 'express';
import trajetRoutes from '../../../src/routes/trajetRoutes.js'; // Assurez-vous que le chemin est correct

// Mock des fonctions du contrôleur
jest.mock('../../../src/controllers/trajetController.js', () => ({
  createTrajet: jest.fn((req, res) => res.status(201).send('Trajet created')),
  getAllTrajets: jest.fn((req, res) => res.status(200).send('All trajets')),
  getTrajetById: jest.fn((req, res) => res.status(200).send('Trajet by ID')),
  updateTrajet: jest.fn((req, res) => res.status(200).send('Trajet updated')),
  deleteTrajet: jest.fn((req, res) => res.status(200).send('Trajet deleted')),
}));

const app = express();
app.use(express.json());
app.use('/api/trajets', trajetRoutes);

describe('Trajet Routes', () => {
  it('should create a new trajet', async () => {
    const res = await request(app).post('/api/trajets').send({ name: 'Test Trajet' });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('Trajet created');
  });

  it('should get all trajets', async () => {
    const res = await request(app).get('/api/trajets');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('All trajets');
  });

  it('should get a trajet by ID', async () => {
    const res = await request(app).get('/api/trajets/1');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Trajet by ID');
  });

  it('should update a trajet', async () => {
    const res = await request(app).put('/api/trajets/1').send({ name: 'Updated Trajet' });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Trajet updated');
  });

  it('should delete a trajet', async () => {
    const res = await request(app).delete('/api/trajets/1');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Trajet deleted');
  });
});
