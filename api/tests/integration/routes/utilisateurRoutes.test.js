import request from 'supertest';
import app from '../../../app.js'; // L'application Express
import models from '../../../src/models/index.js'; // Les modèles Sequelize
import sequelize from '../../../src/config/db.config.js'; // Configuration de la base de données
import bcrypt from 'bcrypt'; // Assurez-vous que le hachage est bien géré
import jwt from 'jsonwebtoken';

const { Utilisateur } = models;

let token;
let adminToken;
let utilisateur;
let admin;

beforeAll(async () => {
  // Authentification de la base de données
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash('hashedpassword', 10);

  // Créer un utilisateur pour les tests
  utilisateur = await Utilisateur.create({
    Nom: 'Test User',
    Email: 'testuser@example.com',
    MotDePasse: hashedPassword,
    isAdmin: false,
  });

  // Créer un administrateur pour les tests
  admin = await Utilisateur.create({
    Nom: 'Admin User',
    Email: 'admin@example.com',
    MotDePasse: hashedPassword,
    isAdmin: true,
  });

  // Générer des tokens JWT pour l'utilisateur et l'administrateur
  token = jwt.sign({ id: utilisateur.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
  adminToken = jwt.sign({ id: admin.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // Ferme la connexion après les tests
  await sequelize.close();
});

describe('Tests d\'intégration pour les routes Utilisateur', () => {
  // Test de l'inscription
  test('Inscription d\'un utilisateur', async () => {
    const response = await request(app)
      .post('/api/utilisateurs/register')
      .send({
        Nom: 'Nouvel Utilisateur',
        Email: 'nouvelutilisateur@example.com',
        MotDePasse: 'motdepasse',
      });

    expect(response.status).toBe(201);
    expect(response.body.user.Email).toBe('nouvelutilisateur@example.com');
  });

  // Test de la connexion
  test('Connexion d\'un utilisateur', async () => {
    const response = await request(app)
      .post('/api/utilisateurs/login')
      .send({
        Email: 'testuser@example.com',
        MotDePasse: 'hashedpassword', // Utiliser le même mot de passe que lors de la création
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  // Test de mise à jour d'un utilisateur par ID
  test('Mise à jour d\'un utilisateur par ID (admin uniquement)', async () => {
    const response = await request(app)
      .put(`/api/utilisateurs/${utilisateur.idUtilisateur}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        Nom: 'Utilisateur Modifié',
      });

    console.log('ID utilisateur:', utilisateur.idUtilisateur); // Vérifiez que l'ID est correct
    console.log('Réponse:', response.body); // Affichez la réponse pour voir ce qui est retourné

    expect(response.status).toBe(200);
    expect(response.body.user.Nom).toBe('Utilisateur Modifié');
  });

  // Test de suppression d'un utilisateur par ID (admin uniquement)
  test('Suppression d\'un utilisateur par ID (admin uniquement)', async () => {
    const response = await request(app)
      .delete(`/api/utilisateurs/${utilisateur.idUtilisateur}`)
      .set('Authorization', `Bearer ${adminToken}`);

    console.log('ID utilisateur supprimé:', utilisateur.idUtilisateur); // Vérifiez l'ID
    console.log('Réponse suppression:', response.body); // Affichez la réponse pour voir ce qui est retourné

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Utilisateur supprimé avec succès');
  });
});




