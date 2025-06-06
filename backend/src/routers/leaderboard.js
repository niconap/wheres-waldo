const express = require('express');
const { body, validationResult } = require('express-validator');

const { authenticateJWT } = require('../utils/jwt.js');

function createLeaderboardRouter(database) {
  const router = express.Router();

  router.post(
    '/entry',
    authenticateJWT,
    [body('name').trim().isLength({ min: 3 }).escape()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { start, leaderboardId, score } = req.user;
      const name = req.body.name;

      if (start && name && leaderboardId != null && score != null) {
        await database.createEntry(leaderboardId, name, score);
        res.status(200).json({ score });
      } else {
        res.sendStatus(400);
      }
    }
  );

  router.get('/:id', async (req, res) => {
    if (isNaN(req.params.id) && isNaN(parseInt(req.params.id))) {
      res.status(400).send({ error: 'Invalid ID format provided' });
      return;
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({ error: 'ID must be a valid number' });
      return;
    }
    let leaderboard = await database.getLeaderBoard(id);

    if (leaderboard) {
      leaderboard.Entry = leaderboard.Entry.sort((a, b) => {
        return a.score - b.score;
      });
      res.send(leaderboard);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
}

module.exports = createLeaderboardRouter;
