import Trajet from '../../../src/models/trajetModel.js';

describe('Trajet Model', () => {
  test('devrait avoir un nom de modèle et des propriétés corrects', () => {
   
    expect(Trajet.tableName).toBe('Trajets');
    expect(Trajet.rawAttributes.idTrajet.type.key).toBe('INTEGER'); 
    expect(Trajet.rawAttributes.Départ.type.key).toBe('STRING'); 
    expect(Trajet.rawAttributes.Arrivée.type.key).toBe('STRING'); 
    expect(Trajet.rawAttributes.DateHeure.type.key).toBe('DATE'); 
    expect(Trajet.rawAttributes.PlacesDisponibles.type.key).toBe('INTEGER'); 
    expect(Trajet.rawAttributes.Prix.type.key).toBe('FLOAT'); 
  });

  test('devrait être initialisé avec les propriétés correctes', () => {
    const trajet = Trajet.build({
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 50,
    });

    expect(trajet.Départ).toBe('Paris');
    expect(trajet.Arrivée).toBe('Lyon');
    expect(trajet.DateHeure).toBeInstanceOf(Date);
    expect(trajet.PlacesDisponibles).toBe(3);
    expect(trajet.Prix).toBe(50);
  });
});
