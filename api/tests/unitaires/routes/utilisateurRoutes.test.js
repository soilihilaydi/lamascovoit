import request from 'supertest';
import dotenv from 'dotenv';
import app from '../../../app.js';
import { Utilisateur, sequelize } from '../../../src/models/utilisateurModel.js';

dotenv.config();

beforeAll(async () => {
  try {
    console.log('Démarrage de la synchronisation de la base de données');
    await sequelize.sync({ force: true });
    console.log('Base de données synchronisée avec succès');
  } catch (error) {
    console.error('Erreur de synchronisation de la base de données:', error);
  }
});

afterAll(async () => {
  try {
    console.log('Fermeture de la connexion à la base de données');
    await sequelize.close();
    console.log('Connexion à la base de données fermée avec succès');
  } catch (error) {
    console.error('Erreur lors de la fermeture de la connexion à la base de données:', error);
  }
});

describe('Utilisateur Routes', () => {
  it('devrait créer un nouvel utilisateur', async () => {
    const newUser = {
      Email: process.env.TEST_USER_EMAIL,
      MotDePasse: process.env.TEST_USER_PASSWORD,
      Nom: 'Nom Test',
      Adresse: 'Adresse Test',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    };

    const response = await request(app)
      .post('/api/utilisateurs')
      .send(newUser)
      .expect(201);

    expect(response.body.Email).toBe(newUser.Email);
  });

  it('devrait récupérer tous les utilisateurs', async () => {
    const response = await request(app)
      .get('/api/utilisateurs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('devrait récupérer un utilisateur par ID', async () => {
    const user = await Utilisateur.create({
      Email: 'fetch@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Fetch',
      Adresse: 'Adresse Fetch',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    });

    const response = await request(app)
      .get(`/api/utilisateurs/${user.idUtilisateur}`)
      .expect(200);

    expect(response.body.Email).toBe(user.Email);
  });

  it('devrait mettre à jour un utilisateur par ID', async () => {
    const user = await Utilisateur.create({
      Email: 'update@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Update',
      Adresse: 'Adresse Update',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    });

    const updatedData = {
      Nom: 'Nom Updated'
    };

    const response = await request(app)
      .put(`/api/utilisateurs/${user.idUtilisateur}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.Nom).toBe(updatedData.Nom);
  });

  it('devrait supprimer un utilisateur par ID', async () => {
    const user = await Utilisateur.create({
      Email: 'delete@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Delete',
      Adresse: 'Adresse Delete',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    });

    await request(app)
      .delete(`/api/utilisateurs/${user.idUtilisateur}`)
      .expect(204);

    const fetchedUser = await Utilisateur.findByPk(user.idUtilisateur);
    expect(fetchedUser).toBeNull();
  });
});

