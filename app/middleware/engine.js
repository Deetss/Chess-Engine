const pawnT = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const knightT = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
];

const bishopT = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20]
];

const rookT = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0]
];

const queenT = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20]
];

const kingMidT = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20]
];

const kingEndT = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50]
];

// AI starts here
var minimaxRoot = function(depth, game, isMaximizingPlayer) {
  var possibleMoves = game.moves();
  var bestMoveFound;
  var bestMove = -9999;

  for (var i = 0; i < possibleMoves.length; i++) {
    var possibleMove = possibleMoves[i];
    game.move(possibleMove);

    var value = minimax(depth - 1, game, -10000, 10000, !isMaximizingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = possibleMove;
    }
  }
  return bestMoveFound;
};

var minimax = function(depth, game, alpha, beta, isMaximizingPlayer) {
  positionCount++;
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }

  var possibleMoves = game.moves();

  if (isMaximizingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer)
      );
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer)
      );
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
};

var evaluateBoard = function(board) {
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation =
        totalEvaluation +
        getPieceValue(board[i][j]) +
        getPositionBias(board[i][j], i, j);
    }
  }
  return totalEvaluation;
};

var getPositionBias = function(piece, x, y) {
  var bias = 0;
  if (piece === null) {
    return bias;
  }

  switch (piece.type) {
    case 'p':
      bias = pawnT[x][y];
      break;
    case 'r':
      bias = rookT[x][y];
      break;
    case 'n':
      bias = knightT[x][y];
      break;
    case 'b':
      bias = bishopT[x][y];
      break;
    case 'q':
      bias = queenT[x][y];
      break;
    case 'k':
      bias = kingMidT[x][y];
      break;
  }
  return bias;
};

var getPieceValue = function(piece) {
  if (piece === null) {
    return 0;
  }

  var getAbsoluteValue = function(piece) {
    if (piece.type === 'p') {
      return 100;
    } else if (piece.type === 'r') {
      return 600;
    } else if (piece.type === 'n') {
      return 300;
    } else if (piece.type === 'b') {
      return 400;
    } else if (piece.type === 'q') {
      return 900;
    } else if (piece.type === 'k') {
      return 9000;
    }
    throw 'Unknown piece type: ' + piece.type;
  };

  var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
};
