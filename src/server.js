const createApp = require('./app.js');

const app = createApp({});
const port = 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
