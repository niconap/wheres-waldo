const express = require('express');
const createPhotoRouter = require('./routers/photo.js');
const createLeaderboardRouter = require('./routers/leaderboard.js');

function createApp(database) {
  const app = express();

  app.use(express.json());

  app.use('/photo', createPhotoRouter(database));
  app.use('/leaderboard', createLeaderboardRouter(database));

  return app;
}

module.exports = createApp;
