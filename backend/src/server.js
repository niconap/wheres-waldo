const createApp = require('./app.js');
const database = require('./db/db.js');

const app = createApp(database);
const port = 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
