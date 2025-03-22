const { prisma } = require('./client');

async function getPhotos() {
  return await prisma.photo.findMany();
}

module.exports = { getPhotos };
