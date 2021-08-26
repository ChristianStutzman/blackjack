const mongoose = require('mongoose');


mongoose.connect('mongodb://3.19.75.226:27017/blackjack', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to "blackjack" database');
});

const highScoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
  date: String
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

module.exports = {
  HighScore
}