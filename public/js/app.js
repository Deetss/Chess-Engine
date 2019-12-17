const pawnT = [ 
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
]

const knightT = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
]

const bishopT = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
]

const rookT = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
]

const queenT = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
]

const kingMidT = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
]

const kingEndT = [
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
]


window.onload = function() {
    var board, game = new Chess();

    // AI starts here
    var minimaxRoot = function(depth, game, isMaximizingPlayer) {
        var possibleMoves = game.moves();
        var bestMoveFound;
        var bestMove = -9999;

        for(var i = 0; i < possibleMoves.length; i++){
            var possibleMove = possibleMoves[i];
            game.move(possibleMove);

            var value = minimax(depth - 1, game, -10000, 10000, !isMaximizingPlayer);      
            game.undo();
            if(value >= bestMove) {
                bestMove = value;
                bestMoveFound = possibleMove;
            }
        }
        return bestMoveFound;
    };

    var minimax = function(depth, game, alpha, beta, isMaximizingPlayer){
        positionCount++;
        if (depth === 0){
            return -evaluateBoard(game.board());
        }

        var possibleMoves = game.moves();

        if (isMaximizingPlayer) {
            var bestMove = -9999;
            for (var i = 0; i < possibleMoves.length; i++){
                game.move(possibleMoves[i]);
                bestMove = Math.max(bestMove, minimax(depth -1, game, alpha, beta, !isMaximizingPlayer));
                game.undo();
                alpha = Math.max(alpha, bestMove);
                if (beta <= alpha){
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            var bestMove = 9999;
            for (var i = 0; i < possibleMoves.length; i++){
                game.move(possibleMoves[i]);
                bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer));
                game.undo();
                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    };

    var evaluateBoard = function (board) {
        var totalEvaluation = 0;
        for (var i = 0; i < 8; i++){
            for (var j = 0; j < 8; j++) {
                totalEvaluation = totalEvaluation + getPieceValue(board[i][j]) + getPositionBias(board[i][j] ,i ,j);
                
            }
        }
        return totalEvaluation;
    };

    var getPositionBias = function (piece, x, y) {
        var bias = 0;
        if (piece === null) {
            return bias;
        }

        switch(piece.type) {
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
    }

    var getPieceValue = function (piece) {
        if (piece === null) {
            return 0;
        }

        var getAbsoluteValue = function (piece) {
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
            throw "Unknown piece type: " + piece.type;
        };

        var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
        return piece.color === 'w' ? absoluteValue : -absoluteValue;
    }

    // board visualization and games state handling here

    var onDragStart = function(source, piece, position, orientation) {
        if(game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1){
            return false;
        }
    };

    var makeBestMove = function () {
        var bestMove = getBestMove(game);
        game.move(bestMove);
        board.position(game.fen());
        renderMoveHistory(game.history());
        if (game.game_over()) {
            if(game.in_checkmate() === true){
                alert('Checkmate')
            }
        }
    };

    var getBestMove =  function (game) {
        if (game.game_over()) {
            alert('Game over');
        }

        positionCount = 0;
        var depth = parseInt($('#search-depth').find(':selected').text());

        var d = new Date().getTime();
        var bestMove = minimaxRoot(depth, game, true);
        var d2 = new Date().getTime();
        var moveTime = (d2 - d);
        var positionsPerS = ( positionCount * 1000 / moveTime);

        $('#position-count').text(positionCount);
        $('#time').text(moveTime/1000 + 's');
        $('#positions-per-s').text(positionsPerS);
        return bestMove;
    };

    var renderMoveHistory = function (moves) {
        var turn;
        var historyElement = $('#move-history').empty();
        historyElement.empty();

        for (var i = 0; i < moves.length; i = i + 2){
            turn = Math.round(i / 2) + 1;

            historyElement.append('<span>' + turn+ '. '+  moves[i] + ' ' +  (moves[i + 1] ? moves[i +1] : ' ') + '</span> ')
        }
        historyElement.scrollTop(historyElement[0].scrollHeight)
    };

    var onDrop = function (source, target) {
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        removeGreySquares();
        if (move === null ){
            return 'snapback';
        }

        renderMoveHistory(game.history());
        window.setTimeout(makeBestMove, 250);

    };

    var onSnapEnd = function () {
        board.position(game.fen());
    };

    var onMouseoverSquare = function (square, piece) {  
        var moves = game.moves({
            square: square,
            verbose: true
        });

        if (moves.length === 0) return;

        greySquare(square);

        for (var i = 0; i < moves.length; i++){
            greySquare(moves[i].to)
        }
    };

    var onMouseoutSquare = function(square, piece){
        removeGreySquares();
    };

    var removeGreySquares = function(){
        $('#board .square-55d63').css('background', '');
    };

    var greySquare = function (square) {  
        var squareEl = $('.board .square-' + square);

        var background = '#a9a9a9';
        if (squareEl.hasClass('black-3c85d') === true){
            background = '#696969';
        };
        squareEl.css('background', background);
    };


    let source;

    var attachStreamListeners = function(){
        source.addEventListener('message', function(e) {
            var connections = JSON.parse(e.data)
            console.log(connections)
            $("#connections").text("connections:" + connections )
          }, false)
  
          source.addEventListener('open', function(e) {
            $("#state").text("Connected")
            $("#connect").hide()
            $("#dc").show();
          }, false)
  
          source.addEventListener('disconnect', function(e) {
            $("#connections").text("connections:" + connections )
          }, false)
  
          source.addEventListener('error', function(e) {
            if (e.target.readyState == EventSource.CLOSED) {
              $("#state").text("Disconnected")
              $("#dc").hide();
              $("#connect").show();
            }
            else if (e.target.readyState == EventSource.CONNECTING) {
              $("#connect").show();
              $("#state").text("Connecting...")
            }
          }, false)
    }

    var connect = function (){
      $.get("/connect", function(){
        source = new EventSource('/stream');
        attachStreamListeners();
        $("#connect").css("color", "green");
      });

    }

    var disconnect = function(){
      $.get("/disconnect", function(){
        source.close()
        if (source.readyState == EventSource.CLOSED) {
            $("#state").text("Disconnected")
            $("#dc").hide();
            $("#connect").show();
          }
      })
    }

    if (!!window.EventSource) {

        $("#connect").on("click", function(){
            connect();
        })

        $("#dc").on("click", function(){
            disconnect();
        })
      } else {
        console.log("Your browser doesn't support SSE")
      }

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);

};
