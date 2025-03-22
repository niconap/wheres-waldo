const express = require('express');

function createApp(database) {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.sendStatus(200);
  });

  return app;
}

module.exports = createApp;