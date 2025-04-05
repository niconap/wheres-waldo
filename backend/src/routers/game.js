const express = require('express');

function createGameRouter(database) {
  const router = express.Router();

  router.post('/start/:photoId', async (req, res) => {
    if (isNaN(req.params.photoId) && isNaN(parseInt(req.params.photoId))) {
      res.status(403).send({ error: 'Invalid ID format provided' });
      return;
    }

    const leaderboard = await database.getLeaderBoard(req.params.photoId);

    if (!leaderboard) {
      res.sendStatus(404);
      return;
    }

    req.session.start = Date.now();
    req.session.leaderboardId = leaderboard.id;
    res.json({
      start: req.session.start,
      leaderboardId: req.session.leaderboardId,
    });
  });

  return router;
}

module.exports = createGameRouter;
