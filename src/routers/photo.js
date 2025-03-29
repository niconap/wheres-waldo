const express = require('express');

function createPhotoRouter(database) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const photos = await database.getPhotos();
    res.send(photos);
  });

  router.get('/:id', async (req, res) => {
    const photo = await database.getOnePhoto(req.params.id);
    if (photo) {
      res.send(photo);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
}

module.exports = createPhotoRouter;
