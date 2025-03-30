const supertest = require('supertest');
const createApp = require('../src/app');

const mockDatabase = {
  getPhotos: jest.fn(),
  getOnePhoto: jest.fn(),
};

const app = createApp(mockDatabase);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /photo', () => {
  test('Responds with status code 200', async () => {
    const response = await supertest(app).get('/photo');
    expect(response.statusCode).toBe(200);
  });

  test('Responds with an array of photos', async () => {
    const mockPhotos = [
      {
        id: 1,
        path: '/images/photo1.jpg',
        title: 'Photo 1',
        Leaderboard: [],
        Character: [],
      },
      {
        id: 2,
        path: '/images/photo2.jpg',
        title: 'Photo 2',
        Leaderboard: [],
        Character: [],
      },
    ];

    mockDatabase.getPhotos.mockResolvedValue(mockPhotos);

    const response = await supertest(app).get('/photo');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(mockPhotos);
    expect(Array.isArray(response.body)).toBe(true);
    expect(mockDatabase.getPhotos).toHaveBeenCalledTimes(1);
  });

  test('Responds with an empty array when no photos are found', async () => {
    const mockPhotos = [];

    mockDatabase.getPhotos.mockResolvedValue(mockPhotos);

    const response = await supertest(app).get('/photo');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(mockPhotos);
    expect(Array.isArray(response.body)).toBe(true);
    expect(mockDatabase.getPhotos).toHaveBeenCalledTimes(1);
  });
});

describe('GET /photo/:id', () => {
  test('Responds with a 404 on non-existent IDs', async () => {
    let id = 0;
    while (id < 3) {
      const response = await supertest(app).get(`/photo/${id}`);
      expect(response.statusCode).toBe(404);
      id++;
    }
    expect(mockDatabase.getOnePhoto).toHaveBeenCalledTimes(id);
  });

  test('Sends one photo with a correct ID', async () => {
    const mockPhotos = [
      {
        id: 1,
        path: '/images/photo1.jpg',
        title: 'Photo 1',
        Leaderboard: [],
        Character: [],
      },
      {
        id: 2,
        path: '/images/photo2.jpg',
        title: 'Photo 2',
        Leaderboard: [],
        Character: [],
      },
    ];

    mockDatabase.getOnePhoto.mockReturnValueOnce(mockPhotos[0]);
    mockDatabase.getOnePhoto.mockReturnValueOnce(mockPhotos[1]);

    const response = await supertest(app).get('/photo/1');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(mockDatabase.getOnePhoto).toHaveBeenCalledWith('1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPhotos[0]);

    const response2 = await supertest(app).get('/photo/2');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(mockDatabase.getOnePhoto).toHaveBeenCalledWith('2');
    expect(response2.status).toBe(200);
    expect(response2.body).toEqual(mockPhotos[1]);

    expect(mockDatabase.getOnePhoto).toHaveBeenCalledTimes(2);
  });

  test('returns a 403 status when using an incorrect ID format', async () => {
    const response = await supertest(app).get('/photo/abc');
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual('Invalid ID format provided');
    expect(mockDatabase.getOnePhoto).toHaveBeenCalledTimes(0);
    expect(mockDatabase.getPhotos).toHaveBeenCalledTimes(0);
  });
});
