const supertest = require('supertest');
const createApp = require('../src/app');

const mockDatabase = {
  getLeaderBoard: jest.fn(),
};

const app = createApp(mockDatabase);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /game/start/:photoId', () => {
  test('returns a status code of 200', async () => {
    mockDatabase.getLeaderBoard.mockResolvedValue({ id: 1 });

    const response = await supertest(app).post('/game/start/1');
    expect(response.statusCode).toBe(200);
  });

  test('creates a session and sets the start time', async () => {
    mockDatabase.getLeaderBoard.mockResolvedValue({ id: 1 });

    const response = await supertest(app).post('/game/start/1');

    expect(response.body.start).toBe(Date.now());
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  test('creates a session and correctly sets the leaderboard id', async () => {
    mockDatabase.getLeaderBoard.mockResolvedValue({ id: 3 });

    const response = await supertest(app).post('/game/start/1');

    expect(response.body.leaderboardId).toEqual(3);
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledWith('1');
    expect(mockDatabase.getLeaderBoard).toHaveBeenCalledTimes(1);
  });

  test('returns a status code of 403 on an invalid id', async () => {
    const response = await supertest(app).post('/game/start/abc');

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual('Invalid ID format provided');
  });

  test('returns a status code of 404 when no photo has been found', async () => {
    mockDatabase.getLeaderBoard.mockResolvedValue(null);

    const response = await supertest(app).post('/game/start/1');

    expect(response.statusCode).toBe(404);
  });
});
