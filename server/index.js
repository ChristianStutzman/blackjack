const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes')
require('./models');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.use(express.static('./client/dist/'));
app.use(express.json());
app.use(cors());

app.get('/highScores', routes.getHighScores);

app.post('/highScores', routes.postHighScore);


app.listen(port, () => console.log('listening on http://localhost:3000'));