require('dotenv').config();
const createApp = require('./app.js');
const database = require('./db/db.js');

const app = createApp(database);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
