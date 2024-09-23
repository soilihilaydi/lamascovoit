import request from 'supertest';
import app from '../../../app.js'; // L'application Express
import models from '../../../src/models/index.js'; // Les modèles Sequelize
import sequelize from '../../../src/config/db.config.js'; // Configuration de la base de données
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Utilisateur } = models;

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Réinitialise la base de données avant les tests
});

afterAll(async () => {
  await sequelize.close(); // Ferme la connexion après les tests
});

describe('Tests d\'intégration du contrôleur Utilisateur', () => {
  let token;
  let utilisateur;

  beforeEach(async () => {
    // Vide la table des utilisateurs avant chaque test
    await Utilisateur.destroy({ where: {} });

    // Crée un utilisateur pour le test
    utilisateur = await Utilisateur.create({
      Nom: 'Dupont',
      Email: 'jean.dupont@example.com',
      MotDePasse: await bcrypt.hash('motdepasse123', 10),
    });

    // Génère un jeton JWT pour l'utilisateur créé
    token = jwt.sign({ id: utilisateur.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  test('Inscription d\'un utilisateur', async () => {
    const response = await request(app)
      .post('/api/utilisateurs/register')
      .send({
        Nom: 'Durand',
        Email: 'jean.durand@example.com',
        MotDePasse: 'motdepasse456',
      });

    expect(response.status).toBe(201);
    expect(response.body.user.Email).toBe('jean.durand@example.com');
  });

  test('Connexion d\'un utilisateur', async () => {
    const response = await request(app)
      .post('/api/utilisateurs/login')
      .send({
        Email: 'jean.dupont@example.com',
        MotDePasse: 'motdepasse123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('Connexion échoue avec un mot de passe incorrect', async () => {
    const response = await request(app)
      .post('/api/utilisateurs/login')
      .send({
        Email: 'jean.dupont@example.com',
        MotDePasse: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Email ou mot de passe incorrect');
  });

  test('Récupération du profil utilisateur avec un token valide', async () => {
    const response = await request(app)
      .get('/api/utilisateurs/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.Email).toBe('jean.dupont@example.com');
  });

  test('Mise à jour du profil utilisateur', async () => {
    const response = await request(app)
      .put('/api/utilisateurs/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Nom: 'Durand',
      });

    expect(response.status).toBe(200);
    expect(response.body.user.Nom).toBe('Durand');
  });

  test('Suppression du profil utilisateur', async () => {
    const response = await request(app)
      .delete('/api/utilisateurs/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil supprimé avec succès');

    const deletedUser = await Utilisateur.findByPk(utilisateur.idUtilisateur);
    expect(deletedUser).toBeNull();
  });

  test('Récupération de tous les utilisateurs', async () => {
    const response = await request(app)
      .get('/api/utilisateurs')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Récupération d\'un utilisateur par ID', async () => {
    const response = await request(app)
      .get(`/api/utilisateurs/${utilisateur.idUtilisateur}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.Email).toBe('jean.dupont@example.com');
  });

  test('Mise à jour d\'un utilisateur par ID', async () => {
    const response = await request(app)
      .put(`/api/utilisateurs/${utilisateur.idUtilisateur}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Nom: 'Durand',
      });

    expect(response.status).toBe(200);
    expect(response.body.user.Nom).toBe('Durand');
  });

  test('Suppression d\'un utilisateur par ID', async () => {
    const response = await request(app)
      .delete(`/api/utilisateurs/${utilisateur.idUtilisateur}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Utilisateur supprimé avec succès');

    const deletedUser = await Utilisateur.findByPk(utilisateur.idUtilisateur);
    expect(deletedUser).toBeNull();
  });
});




       