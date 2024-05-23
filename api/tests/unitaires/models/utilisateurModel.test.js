import Utilisateur from '../../../src/models/utilisateurModel.js';

describe('Utilisateur Model', () => {
  it('devrait créer une nouvelle instance Utilisateur', () => {
    const utilisateur = Utilisateur.build({
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe',
      Adresse: '123 Test St',
      NuméroDeTéléphone: '1234567890',
      PhotoUrl: 'http://example.com/photo.jpg',
      Rôle: 'user'
    });

    expect(utilisateur.Email).toBe('test@example.com');
    expect(utilisateur.MotDePasse).toBe('password123');
    expect(utilisateur.Nom).toBe('John Doe');
    expect(utilisateur.Adresse).toBe('123 Test St');
    expect(utilisateur.NuméroDeTéléphone).toBe('1234567890');
    expect(utilisateur.PhotoUrl).toBe('http://example.com/photo.jpg');
    expect(utilisateur.Rôle).toBe('user');
  });
});