import request from 'supertest';
import express from 'express';
import xssProtection from '../../../src/middlewares/xssProtection.js';

const app = express();
app.use(express.json());
app.use(xssProtection);

app.post('/test-xss', (req, res) => {
  res.status(200).send(req.body);
});

describe('XSS Protection Middleware', () => {
  test('devrait nettoyer les entrées pour précipiter des attaques XSS', async () => {
    const maliciousInput = { input: '<script>alert("xss")</script>' };
    const sanitizedInput = { input: '&lt;script>alert("xss")&lt;/script>' }; 

    const response = await request(app)
      .post('/test-xss')
      .send(maliciousInput);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(sanitizedInput);
  });

  test('devrait autoriser les entrées non malveillantes', async () => {
    const safeInput = { input: 'Hello, World!' };

    const response = await request(app)
      .post('/test-xss')
      .send(safeInput);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(safeInput);
  });
});
