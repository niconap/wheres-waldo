const { prisma } = require('./client');

/**
 * Get all the photos from the database
 * @returns {Array} an array containing the photos
 */
async function getPhotos() {
  return await prisma.photo.findMany();
}

/**
 * Get a photo with the corresponding id
 * @param {number} id - The ID of the photo
 * @returns {Object} an object containing the photo's data
 */
async function getOnePhoto(id) {
  return await prisma.photo.findUnique({ where: { id } });
}

/**
 * Get a leaderboard with the corresponding photo id
 * @param {number} photoId - The ID of the photo
 * @returns {Object} an object containing the leaderboard data, including its
 * entries
 */
async function getLeaderBoard(photoId) {
  return await prisma.leaderboard.findUnique({
    where: { photoId },
    include: {
      Entry: true,
    },
  });
}

/**
 * Create an entry in the database
 * @param {number} leaderboardId - The ID of the leaderboard
 * @param {string} user - The name of the user
 * @param {number} score - The score of the user
 * @returns {Object} The created entry
 */
async function createEntry(leaderboardId, name, score) {
  return await prisma.entry.create({
    data: {
      leaderboardId,
      name,
      score,
    },
  });
}

/**
 * Get the entries from a leaderboard
 * @param {number} leaderboardId - The ID of the leaderboard
 * @returns {Array} The array of entries
 */
async function getEntries(leaderboardId) {
  return await prisma.entry.findMany({ where: { leaderboardId } });
}

/**
 * Get a character's information
 * @param {number} id - The ID of the character
 * @returns {Object} The character's information
 */
async function getCharacter(id) {
  return await prisma.character.findUnique({ where: { id } });
}

module.exports = {
  getPhotos,
  getOnePhoto,
  getLeaderBoard,
  createEntry,
  getEntries,
  getCharacter
};
