const express = require('express');
const app = express();
const routes = require('./routes')
require('./models');

app.use(express.static('./client/dist/'));
app.use(express.json());

app.get('/highScores', routes.getHighScores);

app.post('/highScores', routes.postHighScore);


app.listen(3000, () => console.log('listening on http://localhost:3000'));