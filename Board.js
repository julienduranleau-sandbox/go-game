const BLACK = 1
const WHITE = 2

class Board {
    constructor(width, height, drawWidth, drawHeight) {
        this.size = { w: width, h: height }
        this.drawSize = { w: drawWidth, h: drawHeight }
        this.grid = null
        this.sqSize = this.drawSize.w / this.size.w

        createCanvas(window.innerWidth, window.innerHeight)
        noLoop()

        this.generateGrid()
        this.redraw()
    }

    generateGrid() {
        this.grid = []

        for (let row = 0; row < this.size.h; row++) {
            let row = []

            for (let col = 0; col < this.size.w; col++) {
                row.push(0)
            }

            this.grid.push(row)
        }
    }

    play(row, col, color) {
        if (this.grid[row][col])
            return false

        this.grid[row][col] = color
    }

    redraw() {
        stroke(0)
        strokeWeight(3)
        
        for (let row = 0; row < this.h; row++) {
            line(0, row * this.sqSize, this.drawSize.w, row * this.sqSize)
        }
        for (let col = 0; col < this.w; col++) {
            line(col * this.sqSize, 0, col * this.sqSize, this.drawSize.h)
        }
    }
}
