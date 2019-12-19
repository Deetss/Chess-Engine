/*!
 * Module dependencies.
 */
var Chess = require('chess.js').Chess;
var connections = [];
var games = [];

exports.stream = function(req, res) {
  res.sseSetup();
  connections.push(res);

  games.push(new Chess());
  games[games.length - 1].id = req.sessionID;

  res.sseSend(games[games.length - 1], 'game');
};

exports.move = function(req, res) {
  //get board data from request
  //do calculations
  //respond with game.fen()
  //res.sendStatus(200);
};

//exports.disconnect = function(req, res) {
//   for (var i = 0; i < connections.length; i++) {
//     var target =
//       connections[i].req.sessionID == req.sessionID ? connections[i] : null;
//     if (target != null) {
//       var index = connections.indexOf(target);
//       connections.splice(index, 1);
//     }
//     target.sseSend(connections.length, 'disconnect');
//   }
//   res.sendStatus(204);
// }
