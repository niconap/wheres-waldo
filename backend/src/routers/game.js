const express = require('express');

function createGameRouter(database) {
  const router = express.Router();

  router.post('/start/:photoId', async (req, res) => {
    if (isNaN(req.params.photoId) && isNaN(parseInt(req.params.photoId))) {
      res.status(400).send({ error: 'Invalid ID format provided' });
      return;
    }

    const photoId = Number(req.params.photoId);
    if (isNaN(photoId)) {
      res.status(400).send({ error: 'ID must be a valid number' });
      return;
    }

    const photo = await database.getPhoto(photoId);
    const leaderboard = await database.getLeaderBoard(photoId);

    if (!photo || !leaderboard) {
      res.sendStatus(404);
      return;
    }

    req.session.start = Date.now();
    req.session.leaderboardId = leaderboard.id;
    req.session.status = {
      found: [],
      notFound: photo.Character.map((character) => character.id),
    };
    const characterMap = {};
    await Promise.all(
      photo.Character.map(async ({ id }) => {
        const character = await database.getCharacter(id);
        characterMap[id] = character.name;
      })
    );

    res.json({
      start: req.session.start,
      leaderboardId: req.session.leaderboardId,
      status: req.session.status,
      characterMap: characterMap,
    });
  });

  router.post('/guess/:photoId', async (req, res) => {
    if (isNaN(req.params.photoId) && isNaN(parseInt(req.params.photoId))) {
      res.status(400).send({ error: 'Invalid ID format provided' });
      return;
    }

    const photo = await database.getPhoto(req.params.id);

    if (!photo) {
      res.sendStatus(404);
      return;
    }

    for (const element of photo.Character) {
      const character = await database.getCharacter(element.id);
      if (
        character.name === req.body.name &&
        req.body.x >= character.x1 &&
        req.body.x <= character.x2 &&
        req.body.y >= character.y1 &&
        req.body.y <= character.y2
      ) {
        req.session.status.found.push(character.id);
        req.session.status.notFound = req.session.status.notFound.filter(
          (id) => id !== character.id
        );
      }
    }

    if (req.session.status.notFound.length === 0) {
      req.session.score = Date.now() - req.session.start;
      res.send({ status: req.session.status, score: req.session.score });
      return;
    }

    res.send({ status: req.session.status });
  });

  return router;
}

module.exports = createGameRouter;
