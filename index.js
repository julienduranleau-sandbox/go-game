let game = null

function setup() {
    game = new Board(19, 19, window.innerWidth, window.innerHeight)


    //randomFill(game, 0.2)

    for (let i = 0; i < 19; i++) {
        game.play(5,i,2)
    }

    game.play(2,3,1)
    game.play(3,4,1)
    game.play(3,5,1)
    game.play(2,6,1)
    game.play(1,5,1)
    game.play(1,4,1)

    game.play(0,2,1)
    game.play(1,1,1)
    game.play(2,0,1)

    //game.solve()
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
