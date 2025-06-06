const supertest = require('supertest');
const createApp = require('../src/app');

const mockDatabase = {
  getLeaderBoard: jest.fn(),
  getPhoto: jest.fn(),
  getCharacter: jest.fn(),
};

const app = createApp(mockDatabase);

let token = null;

beforeEach(async () => {
  jest.clearAllMocks();

  mockDatabase.getLeaderBoard.mockResolvedValue({ id: 1 });
  mockDatabase.getPhoto.mockResolvedValue({
    id: 1,
    Character: [{ id: 1 }, { id: 2 }],
  });
  mockDatabase.getCharacter.mockResolvedValue({
    id: 1,
    name: 'Waldo',
    x1: 10,
    y1: 20,
    x2: 90,
    y2: 80,
  });

  const response = await supertest(app).post('/game/start/1');
  token = response.body.token;
});

describe('POST /game/start/:photoId', () => {
  test('returns a status code of 200', async () => {
    const response = await supertest(app).post('/game/start/1');
    expect(response.statusCode).toBe(200);
  });

  test('returns a status code of 400 on an invalid ID', async () => {
    const response = await supertest(app).post('/game/start/abc');
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Invalid ID format provided');
  });

  test('returns a status code of 404 when no photo has been found', async () => {
    mockDatabase.getPhoto.mockResolvedValue(null);
    const response = await supertest(app).post('/game/start/1');
    expect(response.statusCode).toBe(404);
  });

  test('creates a session and sets the start time', async () => {
    const response = await supertest(app).post('/game/start/1');
    expect(response.body.start).toBe(Date.now());
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  test('creates a session and correctly sets the leaderboard ID', async () => {
    mockDatabase.getLeaderBoard.mockClear();
    mockDatabase.getLeaderBoard.mockResolvedValue({ id: 3 });
    const response = await supertest(app).post('/game/start/1');
    expect(response.body.leaderboardId).toEqual(3);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledWith(1);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledTimes(1);
  });

  test('creates a session and correctly sets the required characters', async () => {
    const response = await supertest(app).post('/game/start/1');
    expect(response.body.status).toEqual({ found: [], notFound: [1, 2] });
    expect(response.body.characterMap[1]).toBe('Waldo');
  });
});

describe('POST /game/guess/:photoId', () => {
  test('returns a status code of 200', async () => {
    const response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Waldo', x: 15, y: 25 });
    expect(response.statusCode).toBe(200);
  });

  test('returns a status code of 400 on an invalid ID', async () => {
    const response = await supertest(app)
      .post('/game/guess/abc')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Waldo', x: 15, y: 25 });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Invalid ID format provided');
  });

  test('returns a status code of 404 when no photo has been found', async () => {
    mockDatabase.getPhoto.mockResolvedValue(null);
    const response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Waldo', x: 15, y: 25 });
    expect(response.statusCode).toBe(404);
  });

  test('marks a character as found when correct coordinates are provided', async () => {
    mockDatabase.getCharacter
      .mockResolvedValueOnce({
        id: 1,
        name: 'Waldo',
        x1: 10,
        y1: 20,
        x2: 90,
        y2: 80,
      })
      .mockResolvedValueOnce({
        id: 2,
        name: 'Odlaw',
        x1: 50,
        y1: 50,
        x2: 70,
        y2: 70,
      });

    const response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Waldo', x: 15, y: 25 });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual({
      found: [1],
      notFound: [2],
    });
  });

  test('does not mark a character when incorrect coordinates are provided', async () => {
    const response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Waldo', x: 5, y: 15 });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual({
      found: [],
      notFound: [1, 2],
    });
  });

  test('does not mark a character when an incorrect name is provided', async () => {
    const response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'NotWaldo', x: 10, y: 20 });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual({
      found: [],
      notFound: [1, 2],
    });
  });

  test('completes the game when all characters are found', async () => {
    mockDatabase.getCharacter
      .mockResolvedValueOnce({
        id: 1,
        name: 'Waldo',
        x1: 10,
        y1: 10,
        x2: 30,
        y2: 30,
      })
      .mockResolvedValueOnce({
        id: 2,
        name: 'Odlaw',
        x1: 60,
        y1: 60,
        x2: 80,
        y2: 80,
      })
      .mockResolvedValueOnce({
        id: 1,
        name: 'Waldo',
        x1: 10,
        y1: 10,
        x2: 30,
        y2: 30,
      })
      .mockResolvedValueOnce({
        id: 2,
        name: 'Odlaw',
        x1: 60,
        y1: 60,
        x2: 80,
        y2: 80,
      });

    let response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Waldo', x: 20, y: 20 });

    const newToken = response.body.token;

    response = await supertest(app)
      .post('/game/guess/1')
      .set('Authorization', `Bearer ${newToken}`)
      .send({ name: 'Odlaw', x: 70, y: 70 });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual({
      found: [1, 2],
      notFound: [],
    });
    expect(typeof response.body.score).toBe('number');
  });
});
