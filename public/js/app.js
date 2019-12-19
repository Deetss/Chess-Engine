window.onload = function() {
    var board
    var game
    var source

    var apiMove = function (){
        $.get("/api/move", function(e){
        });
      }
  
    var apiStart = function (){
        source = new EventSource('/api/stream');
        attachEventListeners();
    }
    
    var attachEventListeners = function() {
        source.addEventListener('game', function(e) {
            console.log("gameStart");
            game = e.data
        }, false)
            
        source.onmessage = function(e) {
            //something that the server sends constantly
            console.log("message")
        }
    
        source.addEventListener('open', function(e) {
            $("#state").text("Connected")
        }, false)
    
        source.addEventListener('disconnect', function(e) {
            $("#connections").text("connections:" + connections )
        }, false)
    
        source.addEventListener('error', function(e) {
            if (e.target.readyState == EventSource.CLOSED) {
                $("#state").text("Disconnected")
            }
            else if (e.target.readyState == EventSource.CONNECTING) {
                $("#state").text("Connecting...")
            }
        }, false)    
    }
    
    $("#game-start").on('click', function(){
        apiStart();
        gameStart();
        $("#game-start").hide();
    })

    if (!window.EventSource) {
        console.log("Your browser doesn't support SSE")
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
