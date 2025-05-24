const supertest = require('supertest');
const createApp = require('../src/app');

const mockDatabase = {
  getLeaderBoard: jest.fn(),
  createEntry: jest.fn(),
  getEntries: jest.fn(),
  getCharacter: jest.fn(),
};

const app = createApp(mockDatabase);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /leaderboard/:id', () => {
  test('returns status code 404 when a leaderboard is not found', async () => {
    mockDatabase.getLeaderBoard.mockResolvedValue(null);

    const response = await supertest(app).get('/leaderboard/1');

    expect(response.statusCode).toBe(404);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledWith(1);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledTimes(1);
  });

  test('returns a leaderboard with status code 200', async () => {
    const mockLeaderboard = {
      id: 1,
      photoId: 1,
      Entry: [],
    };

    mockDatabase.getLeaderBoard.mockResolvedValue(mockLeaderboard);

    const response = await supertest(app).get('/leaderboard/1');

    expect(response.body).toEqual(mockLeaderboard);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledWith(1);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledTimes(1);
  });

  test('returns a leaderboard with entries', async () => {
    const mockLeaderboardWithEntries = {
      id: 1,
      photoId: 1,
      Entry: [
        { userId: 1, score: 100 },
        { userId: 2, score: 90 },
      ],
    };

    mockDatabase.getLeaderBoard.mockResolvedValue(mockLeaderboardWithEntries);

    const response = await supertest(app).get('/leaderboard/1');

    expect(response.body).toEqual(mockLeaderboardWithEntries);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledWith(1);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledTimes(1);
  });

  test('returns a 400 status when using an incorrect ID format', async () => {
    const response = await supertest(app).get('/leaderboard/abc');
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Invalid ID format provided');
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledTimes(0);
  });
});

describe('POST /leaderboard/entry', () => {
  test('returns status code 200 when a valid name is sent', async () => {
    const response = await supertest(app)
      .post('/leaderboard/entry')
      .send({ name: 'Nico' });
    expect(response.statusCode).toBe(200);
  });

  test('creates an entry for the leaderboard with the right data', async () => {
    const mockEntry = {
      id: 1,
      leaderboardId: 1,
      name: 'Nico',
      score: 1000,
    };

    mockDatabase.createEntry.mockResolvedValue(mockEntry);

    const response = await supertest(app)
      .post('/leaderboard/entry')
      .send({ name: 'Nico' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ score: 1000 });
    expect(mockDatabase.createEntry).toHaveBeenCalledWith(1, 'Nico', 1000);
    expect(mockDatabase.createEntry).toHaveBeenCalledTimes(1);
  });

  test('returns status code 400 when no name is sent', async () => {
    const response = await supertest(app).post('/leaderboard/entry');
    expect(response.statusCode).toBe(400);
  });
});
