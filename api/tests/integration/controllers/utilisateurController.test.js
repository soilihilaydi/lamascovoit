import request from 'supertest';
import app from '../../../app'; // Assurez-vous que votre application Express est exportée depuis ce fichier
import Utilisateur from '../../../src/models/utilisateurModel';
import sequelize from '../../../src/config/db.config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



describe('Tests d\'intégration pour le contrôleur utilisateur', () => {
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true }); // Réinitialise la base de données avant les tests
    } catch (error) {
      console.error('Erreur lors de la synchronisation de la base de données:', error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close(); // Ferme la connexion à la base de données après les tests
    } catch (error) {
      console.error('Erreur lors de la fermeture de la connexion à la base de données:', error);
    }
  });

  describe('POST /api/utilisateurs/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/api/utilisateurs/register')
        .send({
          Email: 'test@example.com',
          MotDePasse: 'password123',
          Nom: 'John Doe'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Utilisateur enregistré');
      expect(res.body.user).toHaveProperty('Email', 'test@example.com');
    });

    it('ne devrait pas créer un utilisateur avec un email en double', async () => {
      await Utilisateur.create({
        Email: 'duplicate@example.com',
        MotDePasse: 'password123',
        Nom: 'Jane Doe'
      });

      const res = await request(app)
        .post('/api/utilisateurs/register')
        .send({
          Email: 'duplicate@example.com',
          MotDePasse: 'password123',
          Nom: 'Jane Doe'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Un utilisateur avec cette adresse email existe déjà');
    });
  });

  describe('POST /api/utilisateurs/login', () => {
    it('devrait connecter un utilisateur existant', async () => {
      await Utilisateur.create({
        Email: 'login@example.com',
        MotDePasse: await bcrypt.hash('password123', 10),
        Nom: 'John Doe'
      });

      const res = await request(app)
        .post('/api/utilisateurs/login')
        .send({
          Email: 'login@example.com',
          MotDePasse: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('ne devrait pas connecter un utilisateur avec des informations incorrectes', async () => {
      const res = await request(app)
        .post('/api/utilisateurs/login')
        .send({
          Email: 'wrong@example.com',
          MotDePasse: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Email ou mot de passe incorrect');
    });
  });

  describe('GET /api/utilisateurs/profile', () => {
    let token;

    beforeAll(async () => {
      const user = await Utilisateur.create({
        Email: 'profile@example.com',
        MotDePasse: await bcrypt.hash('password123', 10),
        Nom: 'John Doe'
      });

      token = jwt.sign({ id: user.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('devrait récupérer le profil de l\'utilisateur', async () => {
      const res = await request(app)
        .get('/api/utilisateurs/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('Email', 'profile@example.com');
    });

    it('devrait renvoyer 401 si aucun token n\'est fourni', async () => {
      const res = await request(app)
        .get('/api/utilisateurs/profile');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Accès refusé : aucun token fourni');
    });
  });

  describe('PUT /api/utilisateurs/profile', () => {
    let token;

    beforeAll(async () => {
      const user = await Utilisateur.create({
        Email: 'update@example.com',
        MotDePasse: await bcrypt.hash('password123', 10),
        Nom: 'John Doe'
      });

      token = jwt.sign({ id: user.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('devrait mettre à jour le profil de l\'utilisateur', async () => {
      const res = await request(app)
        .put('/api/utilisateurs/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Nom: 'John Updated'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Profil mis à jour');
      expect(res.body.user).toHaveProperty('Nom', 'John Updated');
    });

    it('devrait renvoyer 401 si aucun token n\'est fourni', async () => {
      const res = await request(app)
        .put('/api/utilisateurs/profile')
        .send({
          Nom: 'John Updated'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Accès refusé : aucun token fourni');
    });
  });

  describe('DELETE /api/utilisateurs/profile', () => {
    let token;

    beforeAll(async () => {
      const user = await Utilisateur.create({
        Email: 'delete@example.com',
        MotDePasse: await bcrypt.hash('password123', 10),
        Nom: 'John Doe'
      });

      token = jwt.sign({ id: user.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('devrait supprimer le profil utilisateur', async () => {
      const res = await request(app)
        .delete('/api/utilisateurs/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Profil supprimé avec succès');
    });

    it('devrait renvoyer 401 si aucun token n\'est fourni', async () => {
      const res = await request(app)
        .delete('/api/utilisateurs/profile');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Accès refusé : aucun token fourni');
    });
  });
});

