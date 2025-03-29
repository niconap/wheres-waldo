const supertest = require('supertest');
const createApp = require('../src/app');
const { getOnePhoto } = require('../src/db/db');

const mockDatabase = {
  getPhotos: jest.fn(),
  getOnePhoto: jest.fn(),
  getLeaderBoard: jest.fn(),
  createEntry: jest.fn(),
  getEntries: jest.fn(),
  getCharacter: jest.fn(),
};

const app = createApp(mockDatabase);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /', () => {
  describe('Gets a nice message', () => {
    // Should respond with status code 200
    test('Should respond with status code 200', async () => {
      const response = await supertest(app).get('/');
      expect(response.statusCode).toBe(200);
    });
  });
});

describe('GET /photo', () => {
  // Should respond with a status of 200
  test('Responds with status code 200', async () => {
    const response = await supertest(app).get('/photo');
    expect(response.statusCode).toBe(200);
  });

  // Should send back an array of photos
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
    expect(response.body).toEqual(mockPhotos);
    expect(Array.isArray(response.body)).toBe(true);
    expect(mockDatabase.getPhotos).toHaveBeenCalledTimes(1);
  });

  test('Responds with an empty array when no photos are found', async () => {
    const mockPhotos = [];

    mockDatabase.getPhotos.mockResolvedValue(mockPhotos);

    const response = await supertest(app).get('/photo');
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
    expect(mockDatabase.getOnePhoto).toHaveBeenCalledWith('1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPhotos[0]);

    const response2 = await supertest(app).get('/photo/2');
    expect(mockDatabase.getOnePhoto).toHaveBeenCalledWith('2');
    expect(response2.status).toBe(200);
    expect(response2.body).toEqual(mockPhotos[1]);

    expect(mockDatabase.getOnePhoto).toHaveBeenCalledTimes(2);
  });
});
