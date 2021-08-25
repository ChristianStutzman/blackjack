const HighScore = require('./models').HighScore;

const getHighScores = async (req, res) => {
  const scores = await HighScore.find({}).sort({score: -1}).limit(20);
  res.status(200).json(scores)
}

const postHighScore = async (req, res) => {
  const response = await HighScore.create(req.body);
  res.status(201).json(response);
}

module.exports = {
  getHighScores,
  postHighScore
}