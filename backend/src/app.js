require('dotenv').config();
const cors = require('cors');
const express = require('express');

const createPhotoRouter = require('./routers/photo.js');
const createLeaderboardRouter = require('./routers/leaderboard.js');
const createGameRouter = require('./routers/game.js');

function createApp(database) {
  const app = express();

  app.use(
    cors({
      origin: 'http://127.0.0.1:5173',
      credentials: true,
    })
  );

  app.use(express.json());

  app.use('/game', createGameRouter(database));
  app.use('/photo', createPhotoRouter(database));
  app.use('/leaderboard', createLeaderboardRouter(database));

  return app;
}

module.exports = createApp;
