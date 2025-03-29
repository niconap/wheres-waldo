const express = require('express');
const createPhotoRouter = require('./routers/photo.js');

function createApp(database) {
  const app = express();

  app.use(express.json());

  app.use('/photo', createPhotoRouter(database));

  app.get('/', (req, res) => {
    res.sendStatus(200);
  });

  return app;
}

module.exports = createApp;
