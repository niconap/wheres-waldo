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
      res.sendStatus(403);
    }
  });

  router.get('/:id', async (req, res) => {
    if (isNaN(req.params.id) && isNaN(parseInt(req.params.id))) {
      res.status(403).send({ error: 'Invalid ID format provided' });
      return;
    }

    const leaderboard = await database.getLeaderBoard(req.params.id);

    if (leaderboard) {
      res.send(leaderboard);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
}

module.exports = createLeaderboardRouter;
