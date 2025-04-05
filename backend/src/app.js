require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { prisma } = require('./db/client.js');

const createPhotoRouter = require('./routers/photo.js');
const createLeaderboardRouter = require('./routers/leaderboard.js');
const createGameRouter = require('./routers/game.js');

function createApp(database) {
  const app = express();

  app.use(express.json());
  app.use(
    session({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    })
  );

  app.use('/game', createGameRouter(database));
  app.use('/photo', createPhotoRouter(database));
  app.use('/leaderboard', createLeaderboardRouter(database));

  return app;
}

module.exports = createApp;
