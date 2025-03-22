const supertest = require('supertest');
const createApp = require('../src/app');

const database = {};
const app = createApp(database);

describe('GET /', () => {
  describe('Gets a nice message', () => {
    // Should respond with status code 200
    test('Should respond with status code 200', async () => {
      const response = await supertest(app).get('/');
      expect(response.statusCode).toBe(200);
    });

    // Should return an object with a message field containing "Hello world!"
  });
});
