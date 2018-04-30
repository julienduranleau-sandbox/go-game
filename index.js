let game = null

function setup() {
    game = new Board(19, 19, window.innerWidth, window.innerHeight)


    randomFill(game, 0.4)

/*
    game.play(0,0,2)
    game.play(0,1,2)
    game.play(1,1,2)
    game.play(2,1,2)
    game.play(3,1,2)
    game.play(3,0,2)
    */
}

function randomFill(game, percentEmpty) {
    for (let row = 0; row < game.size.h; row++) {
        for (let col = 0; col < game.size.w; col++) {
            if (Math.random() > percentEmpty) {
                let player = Math.random() > 0.5
                    ? game.WHITE
                    : game.BLACK

                game.play(col, row, player)
            }
        }
    }
}
