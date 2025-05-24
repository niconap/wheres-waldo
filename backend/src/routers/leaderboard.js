const express = require('express');

function createLeaderboardRouter(database) {
  const router = express.Router();

  router.post('/entry', async (req, res) => {
    const start = req.session.start;
    const leaderboardId = req.session.leaderboardId;
    const score = req.session.score;
    const name = req.body.name;
    if (start && name) {
      database.createEntry(leaderboardId, name, score);
      res.status(200).json({ score });
    } else {
      res.sendStatus(400);
    }
  });

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
    const leaderboard = await database.getLeaderBoard(id);

    if (leaderboard) {
      res.send(leaderboard);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
}

module.exports = createLeaderboardRouter;
