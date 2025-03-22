const { getPhotos } = require('../src/db/db.js');
const { prismaMock } = require('./singleton.js');

describe('getPhotos', () => {
  test('should return all photos', async () => {
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

    prismaMock.photo.findMany.mockResolvedValue(mockPhotos);

    const photos = await getPhotos();

    expect(photos).toEqual(mockPhotos);
    expect(prismaMock.photo.findMany).toHaveBeenCalledTimes(1);
  });
});
