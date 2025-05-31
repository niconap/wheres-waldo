const express = require('express');

const { sign, authenticateJWT } = require('../utils/jwt.js');

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

    const characterMap = {};
    await Promise.all(
      photo.Character.map(async ({ id }) => {
        const character = await database.getCharacter(id);
        characterMap[id] = character.name;
      })
    );

    const startTime = Date.now();
    const token = sign({
      start: startTime,
      leaderboardId: leaderboard.id,
      status: {
        found: [],
        notFound: photo.Character.map((character) => character.id),
      },
      photoId: photo.id,
    });

    res.json({
      start: startTime,
      leaderboardId: leaderboard.id,
      status: {
        found: [],
        notFound: photo.Character.map((character) => character.id),
      },
      characterMap: Object.fromEntries(
        Object.entries(characterMap).map(([id, name]) => [Number(id), name])
      ),
      token: token,
    });
  });

  router.post('/guess/:photoId', authenticateJWT, async (req, res) => {
    if (isNaN(req.params.photoId) && isNaN(parseInt(req.params.photoId))) {
      res.status(400).send({ error: 'Invalid ID format provided' });
      return;
    }

    let gameState = req.user;

    const id = Number(req.params.photoId);
    const photo = await database.getPhoto(id);

    if (!photo) {
      res.sendStatus(404);
      return;
    }

    let foundCharacter = null;
    for (const element of photo.Character) {
      const character = await database.getCharacter(element.id);
      if (
        character.name === req.body.name &&
        req.body.x >= character.x1 &&
        req.body.x <= character.x2 &&
        req.body.y >= character.y1 &&
        req.body.y <= character.y2
      ) {
        foundCharacter = character;
        break;
      }
    }

    if (foundCharacter) {
      if (!gameState.status.found.includes(foundCharacter.id)) {
        gameState.status.found.push(foundCharacter.id);
        gameState.status.notFound = gameState.status.notFound.filter(
          (id) => id !== foundCharacter.id
        );
      }
    }

    let score = null;
    if (gameState.status.notFound.length === 0) {
      score = Date.now() - gameState.start;
      gameState.score = score;
    }

    const newToken = sign(gameState);

    res.send({
      status: gameState.status,
      score,
      token: newToken,
    });
  });

  return router;
}

module.exports = createGameRouter;
