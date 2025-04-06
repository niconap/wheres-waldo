const {
  getPhotos,
  getPhoto,
  getLeaderBoard,
  createEntry,
  getEntries,
  getCharacter,
} = require('../src/db/db.js');
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

describe('getPhoto', () => {
  test('should return a photo with the correct id', async () => {
    const mockPhoto = {
      id: 1,
      path: '/images/photo1.jpg',
      title: 'Photo 1',
      Leaderboard: [],
      Character: [],
    };

    prismaMock.photo.findUnique.mockResolvedValue(mockPhoto);

    const photo = await getPhoto(1);

    expect(photo).toEqual(mockPhoto);
    expect(prismaMock.photo.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.photo.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        Character: true,
      },
    });
  });

  test('should return [] when no photo matches the id', async () => {
    prismaMock.photo.findUnique.mockResolvedValue(null);

    const photo = await getPhoto(999);

    expect(photo).toBeNull();
    expect(prismaMock.photo.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.photo.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: {
        Character: true,
      },
    });
  });
});

describe('getLeaderBoard', () => {
  test('correctly returns leaderboard with entries based on photo id', async () => {
    const mockLeaderboard = {
      id: 1,
      photoId: 1,
      Entry: [
        { id: 1, user: 'Alice', score: 100, leaderboardId: 1 },
        { id: 2, user: 'Bob', score: 80, leaderboardId: 1 },
      ],
    };

    prismaMock.leaderboard.findUnique.mockResolvedValue(mockLeaderboard);

    const leaderboard = await getLeaderBoard(1);

    expect(leaderboard).toEqual(mockLeaderboard);
    expect(prismaMock.leaderboard.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.leaderboard.findUnique).toHaveBeenCalledWith({
      where: { photoId: 1 },
      include: { Entry: true },
    });
  });

  test('should return null when no leaderboard exists for the photo id', async () => {
    prismaMock.leaderboard.findUnique.mockResolvedValue(null);

    const leaderboard = await getLeaderBoard(999);

    expect(leaderboard).toBeNull();
    expect(prismaMock.leaderboard.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.leaderboard.findUnique).toHaveBeenCalledWith({
      where: { photoId: 999 },
      include: { Entry: true },
    });
  });
});

describe('createEntry', () => {
  test('correctly creates multiple entries with leaderboardId, user, and score fields', async () => {
    const mockEntries = [
      { id: 1, name: 'Alice', score: 100, leaderboardId: 1 },
      { id: 2, name: 'Bob', score: 80, leaderboardId: 1 },
      { id: 3, name: 'Charlie', score: 90, leaderboardId: 1 },
    ];

    mockEntries.forEach((entry) => {
      prismaMock.entry.create.mockResolvedValueOnce(entry);
    });

    const entryDataArray = [
      [1, 'Alice', 100],
      [1, 'Bob', 80],
      [1, 'Charlie', 90],
    ];

    const createdEntries = [];
    for (const [leaderboardId, name, score] of entryDataArray) {
      const entry = await createEntry(leaderboardId, name, score);
      createdEntries.push(entry);
    }

    expect(createdEntries).toEqual(mockEntries);
    expect(prismaMock.entry.create).toHaveBeenCalledTimes(
      entryDataArray.length
    );
    entryDataArray.forEach(([leaderboardId, name, score], index) => {
      expect(prismaMock.entry.create).toHaveBeenNthCalledWith(index + 1, {
        data: { leaderboardId, name, score },
      });
    });
  });
});

describe('getEntries', () => {
  test('should return all entries for a given leaderboard ID', async () => {
    const mockEntries = [
      { id: 1, user: 'Alice', score: 100, leaderboardId: 1 },
      { id: 2, user: 'Bob', score: 80, leaderboardId: 1 },
      { id: 3, user: 'Charlie', score: 90, leaderboardId: 1 },
    ];

    prismaMock.entry.findMany.mockResolvedValue(mockEntries);

    const entries = await getEntries(1);

    expect(entries).toEqual(mockEntries);
    expect(prismaMock.entry.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
      where: { leaderboardId: 1 },
    });
  });

  test('should return an empty array when no entries exist for the given leaderboard ID', async () => {
    const mockEntries = [];

    prismaMock.entry.findMany.mockResolvedValue(mockEntries);

    const entries = await getEntries(999);

    expect(entries).toEqual(mockEntries);
    expect(prismaMock.entry.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
      where: { leaderboardId: 999 },
    });
  });
});

describe('getCharacter', () => {
  test('should return a character with the correct id', async () => {
    const mockCharacter = {
      id: 1,
      name: 'Waldo',
    };

    prismaMock.character.findUnique.mockResolvedValue(mockCharacter);

    const character = await getCharacter(1);

    expect(character).toEqual(mockCharacter);
    expect(prismaMock.character.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.character.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test('should return null when no character matches the id', async () => {
    prismaMock.character.findUnique.mockResolvedValue(null);

    const character = await getCharacter(999);

    expect(character).toBeNull();
    expect(prismaMock.character.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.character.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
