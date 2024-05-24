import request from 'supertest';
import express from 'express';
import xssProtection from '../../../src/middlewares/xssProtection.js';

const app = express();
app.use(express.json());
app.use(xssProtection);

app.post('/test-xss', (req, res) => {
  res.status(200).json({ data: req.body });
});

describe('XSS Protection Middleware', () => {
  test('devrait nettoyer l\'entrée pour empêcher les attaques XSS', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await request(app)
      .post('/test-xss')
      .send({ userInput: xssPayload });

    expect(response.status).toBe(200);
    expect(response.body.data.userInput).not.toBe(xssPayload);
  });
});
