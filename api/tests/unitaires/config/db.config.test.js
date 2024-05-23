import dotenv from 'dotenv';
import sequelize from '../../../src/config/db.config.js';

dotenv.config({ path: '.env.test' });

describe('Database Configuration', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait se connecter à la base de données de test', async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to the test database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the test database:', error);
    }
  });

  it('devrait avoir des variables d environnement correctes', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.TEST_DB_USER).toBeDefined();
    expect(process.env.TEST_DB_PASS).toBeDefined();
    expect(process.env.TEST_DB_NAME).toBeDefined();
    expect(process.env.TEST_DB_HOST).toBeDefined();
    expect(process.env.TEST_DB_DIALECT).toBeDefined();
  });
});
