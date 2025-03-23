const { getPhotos, getOnePhoto } = require('../src/db/db.js');
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

  test('should return [] when there are no photos', async () => {
    const mockPhotos = [];

    prismaMock.photo.findMany.mockResolvedValue(mockPhotos);

    const photos = await getPhotos();

    expect(photos).toEqual(mockPhotos);
    expect(prismaMock.photo.findMany).toHaveBeenCalledTimes(1);
  });
});

describe('getOnePhoto', () => {
  test('should return a photo with the correct id', async () => {
    const mockPhoto = {
      id: 1,
      path: '/images/photo1.jpg',
      title: 'Photo 1',
      Leaderboard: [],
      Character: [],
    };

    prismaMock.photo.findUnique.mockResolvedValue(mockPhoto);

    const photo = await getOnePhoto(1);

    expect(photo).toEqual(mockPhoto);
    expect(prismaMock.photo.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.photo.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test('should return [] when no photo matches the id', async () => {
    prismaMock.photo.findUnique.mockResolvedValue(null);

    const photo = await getOnePhoto(999);

    expect(photo).toBeNull();
    expect(prismaMock.photo.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.photo.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
