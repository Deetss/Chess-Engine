window.onload = function() {
    var board
    var game
    var source

    var apiMove = function (){
        var depth = parseInt(
            $('#search-depth')
              .find(':selected')
              .text()
          );
        $.get('/api/move?depth='+ depth +'&fen=' + encodeURI(game.fen()), function(data) {
            console.log(data);
            makeBestMove(data.bestMove);
            $("#position-count").text(data.positionCount)
            $("#time").text(data.moveTimeS)
            $("#positions-per-s").text(Math.round(data.positionsPerS))
        });
      }
  
    var apiStart = function (){
        $.get('/api/start', function(data) {
            console.log(data);
            game = new Chess();
        });
    }
        
    $("#game-start").on('click', function(){
        apiStart();
        gameStart();
        $("#game-start").hide();
    })

    // board visualization and games state handling here

    var onDragStart = function(source, piece, position, orientation) {
        if(game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1){
            return false;
        }
    };

    var makeBestMove = function (move) {
        game.move(move);
        board.position(game.fen());
        renderMoveHistory(game.history());
        if (game.game_over()) {
            if(game.in_checkmate() === true){
                alert('Checkmate')
            }
        }
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
        window.setTimeout(apiMove, 250);

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

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };

    var gameStart = function(){
        board = ChessBoard('board', cfg);
    }

};
