const request = require('supertest');
const { app } = require('../server');

describe('Server', () => {
  it('should return text on /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
