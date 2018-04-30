class P5BoardRenderer {
    constructor(board, padding) {
        padding = padding || 50

        this.board = board
        this.sqSize = null
        this.stoneStrokeWeight = 2
        this.bgImage = null
        this.bgImageLoaded = false
        this.drawParams = null
        this.p5 = createCanvas(this.board.drawSize.w, this.board.drawSize.h)

        let maxWSqSize = (this.board.drawSize.w - padding * 2) / this.board.size.w
        let maxHSqSize = (this.board.drawSize.h - padding * 2) / this.board.size.h

        this.sqSize = Math.min(maxWSqSize, maxHSqSize)

        let rowWidth = (this.board.size.w - 1) * this.sqSize
        let colHeight = (this.board.size.h - 1) * this.sqSize
        let paddingX = (this.board.drawSize.w - rowWidth) / 2
        let paddingY = (this.board.drawSize.h - colHeight) / 2
        this.drawParams = {rowWidth, colHeight, paddingX, paddingY}

        this.bgImage = loadImage('images/circles-light.png', () => {
            this.bgImageLoaded = true
            this.redraw()
        })

        this.p5.canvas.addEventListener('click', (e) => {
            let col = Math.round((e.offsetX - this.drawParams.paddingX) / this.sqSize)
            let row = Math.round((e.offsetY - this.drawParams.paddingY) / this.sqSize)
            this.board.play(col, row)
        }, false)

        noLoop()
    }

    drawBackground() {
        if (this.bgImageLoaded) {
            let nBgRow = Math.ceil(this.board.drawSize.h / this.bgImage.height)
            let nBgCol = Math.ceil(this.board.drawSize.w / this.bgImage.width)

            for (let row = 0; row < nBgRow; row++) {
                for (let col = 0; col < nBgCol; col++) {
                    image(
                        this.bgImage,
                        col * this.bgImage.width,
                        row * this.bgImage.height
                    )
                }
            }
        }
    }

    drawGridMesh() {
        noFill()
        stroke(50)
        strokeWeight(2)

        for (let row = 0; row < this.board.size.h; row++) {
            line(
                this.drawParams.paddingX + 0,
                this.drawParams.paddingY + row * this.sqSize,
                this.board.drawSize.w - this.drawParams.paddingX,
                this.drawParams.paddingY + row * this.sqSize
            )
        }

        for (let col = 0; col < this.board.size.w; col++) {
            line(
                this.drawParams.paddingX + col * this.sqSize,
                this.drawParams.paddingY + 0,
                this.drawParams.paddingX + col * this.sqSize,
                this.board.drawSize.h - this.drawParams.paddingY
            )
        }
    }

    drawStones() {
        this.board.grid.forEach((row, irow) => {
            row.forEach((val, icol) => {
                if (val) {
                    strokeWeight(this.stoneStrokeWeight)

                    if (val === this.board.WHITE) {
                        stroke(175)
                        fill(255)
                    } else {
                        stroke(25)
                        fill(45)
                    }

                    let x = this.drawParams.paddingX + icol * this.sqSize
                    let y = this.drawParams.paddingY + irow * this.sqSize
                    ellipse(x,y,this.sqSize - this.stoneStrokeWeight)

                    /*
                    let nLiberties = this.board.getLibertiesFor(icol, irow)
                    textSize(14)
                    textAlign(CENTER);
                    fill(255, 100, 100)
                    noStroke()
                    text(
                        nLiberties,
                        this.drawParams.paddingX + icol * this.sqSize,
                        this.drawParams.paddingY + irow * this.sqSize + 5
                    )
                    */
                }
            })
        })
    }

    redraw() {
        this.drawBackground()
        this.drawGridMesh()
        this.drawStones()
    }
}
