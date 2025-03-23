const { prisma } = require('./client');

async function getPhotos() {
  return await prisma.photo.findMany();
}

async function getOnePhoto(id) {
  return await prisma.photo.findUnique({ where: { id } });
}

module.exports = { getPhotos, getOnePhoto };
