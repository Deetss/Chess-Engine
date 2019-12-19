/*!
 * Module dependencies.
 */
var engine = require('../middleware/engine')
var Chess = require('chess.js').Chess;
var games = [];

exports.start = function(req, res) {
  games.push(new Chess());
  games[games.length - 1].id = req.sessionID;
  games[games.length - 1].fen = games[games.length - 1].fen();

  res.json(games[games.length - 1]);
};

exports.move = function(req, res) {
  var game = new Chess(req.query.fen);

  var results = engine.getBestMove(req.query.depth, game);
  res.status(200)
  res.json(results);
};
