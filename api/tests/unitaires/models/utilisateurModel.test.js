// utilisateurModel.test.js
import { Utilisateur } from '../../../src/models/utilisateurModel.js';

describe('Utilisateur Model', () => {
  it('devrait créer une nouvelle instance Utilisateur', () => {
    const utilisateur = Utilisateur.build({
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe',
      Adresse: '123 Street, City',
      NuméroDeTéléphone: '123-456-7890',
      PhotoUrl: 'https://example.com/profile.jpg',
      Rôle: 'utilisateur'
    });

    expect(utilisateur.Email).toBe('test@example.com');
    expect(utilisateur.MotDePasse).toBe('password123');
    expect(utilisateur.Nom).toBe('John Doe');
    expect(utilisateur.Adresse).toBe('123 Street, City');
    expect(utilisateur.NuméroDeTéléphone).toBe('123-456-7890');
    expect(utilisateur.PhotoUrl).toBe('https://example.com/profile.jpg');
    expect(utilisateur.Rôle).toBe('utilisateur');
  });
});