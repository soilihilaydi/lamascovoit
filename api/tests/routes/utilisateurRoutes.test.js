import request from 'supertest';
import app from '../../app'; // Importez votre application Express
import Utilisateur from '../../src/models/utilisateurModel.js';
import bcrypt from 'bcrypt';

jest.mock('../../src/models/utilisateurModel'); // Mockez le modèle Utilisateur
jest.mock('bcrypt'); // Mockez le module bcrypt

describe('POST /api/utilisateurs/inscription', () => {
  it('should create a new user and return 201 status code', async () => {
    const mockUser = {
      email: 'test@test.com',
      password: 'password',
      nom: 'Test',
      adresse: '123 Test St',
      telephone: '1234567890',
      photoUrl: 'https://test.com/photo.jpg',
      role: 'user'
    };

    // Mockez la fonction findOne pour retourner null (c'est-à-dire qu'aucun utilisateur existant n'a été trouvé)
    Utilisateur.findOne.mockResolvedValue(null);

    // Mockez la fonction create pour retourner l'utilisateur mocké
    Utilisateur.create.mockResolvedValue(mockUser);

    // Mockez la fonction hash de bcrypt pour retourner un faux hash
    bcrypt.hash.mockImplementation(() => Promise.resolve('hashedpassword'));

    const response = await request(app)
      .post('/api/utilisateurs/inscription')
      .send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
    expect(response.body).toHaveProperty('utilisateur', mockUser);
  });

  // Réinitialisez tous les mocks après chaque test
  afterEach(() => {
    jest.clearAllMocks();
  });
});