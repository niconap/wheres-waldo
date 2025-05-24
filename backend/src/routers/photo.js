const express = require('express');

function createPhotoRouter(database) {
  const router = express.Router();

  router.get('/', async (_, res) => {
    const photos = await database.getPhotos();
    res.send(photos);
  });

  router.get('/:id', async (req, res) => {
    if (isNaN(req.params.id) && isNaN(parseInt(req.params.id))) {
      res.status(403).send({ error: 'Invalid ID format provided' });
      return;
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({ error: 'ID must be a valid number' });
      return;
    }

    const photo = await database.getPhoto(id);

    if (photo) {
      res.send(photo);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
}

module.exports = createPhotoRouter;
