class Board {
    constructor(width, height, drawWidth, drawHeight) {
        this.EMPTY = 0
        this.BLACK = 1
        this.WHITE = 2

        this.size = { w: width, h: height }
        this.drawSize = { w: drawWidth, h: drawHeight }
        this.grid = null
        this.renderer = new P5BoardRenderer(this)
        this.currentTurn = this.BLACK

        this.generateGrid()
        this.renderer.redraw()
    }

    generateGrid() {
        this.grid = []

        for (let row = 0; row < this.size.h; row++) {
            let row = []

            for (let col = 0; col < this.size.w; col++) {
                row.push(this.EMPTY)
            }

            this.grid.push(row)
        }
    }

    play(col, row, forceColor) {
        let color = forceColor || this.currentTurn

        if (this.grid[row][col])
            return false

        if (this.getLibertiesFor(col, row) === 0) {
            console.log('Suicidal move')
            return false
        }

        this.grid[row][col] = color

        this.filterGrid()

        this.currentTurn = (color === this.BLACK)
            ? this.WHITE
            : this.BLACK

        this.renderer.redraw()
    }

    solve() {
        let areas = []

        for (let row = 0; row < this.size.h; row++) {
            for (let col = 0; col < this.size.w; col++) {
                if (this.grid[row][col] === this.EMPTY) {
                    let alreadyParsed = false

                    for (let area of areas) {
                        if (area.positions.includes(`${col},${row}`)) {
                            alreadyParsed = true
                            break
                        }
                    }

                    if (!alreadyParsed) {
                        areas.push({
                            color: this.EMPTY,
                            positions: this.findEmptyAreaAround(col, row)
                        })
                    }
                }
            }
        }

        for (let area of areas) {
            this.solveArea(area)
        }

        this.renderer.solvedAreas = areas
        this.renderer.redraw()
    }

    solveArea(area) {
        let whiteSurrounding = false
        let blackSurrounding = false

        for (let positionStr of area.positions) {
            let [col, row] = positionStr.split(',').map(Number)

            if (
                col > 0 && this.grid[row][col - 1] === this.BLACK ||
                col < this.size.w - 1 && this.grid[row][col + 1] === this.BLACK ||
                row > 0 && this.grid[row - 1][col] === this.BLACK ||
                row < this.size.h - 1 && this.grid[row + 1][col] === this.BLACK
                ) {
                blackSurrounding = true
            }

            if (
                col > 0 && this.grid[row][col - 1] === this.WHITE ||
                col < this.size.w - 1 && this.grid[row][col + 1] === this.WHITE ||
                row > 0 && this.grid[row - 1][col] === this.WHITE ||
                row < this.size.h - 1 && this.grid[row + 1][col] === this.WHITE
                ) {
                whiteSurrounding = true
            }

            if (whiteSurrounding && blackSurrounding) {
                console.log('found both, break')
                break
            }
        }

        if (whiteSurrounding && ! blackSurrounding) {
            console.log('set white')
            area.color = this.WHITE
        } else if (blackSurrounding && ! whiteSurrounding) {
            console.log('set black')
            area.color = this.BLACK
        } else {
            area.color = this.EMPTY
            console.log('set unknown')
        }
    }

    findEmptyAreaAround(col, row, stack) {
        stack = stack || []
        stack.push(`${col},${row}`)

        let leftNeighbourStr = `${col - 1},${row}`
        let rightNeighbourStr = `${col + 1},${row}`
        let topNeighbourStr = `${col},${row - 1}`
        let bottomNeighbourStr = `${col},${row + 1}`

        // left neighbour
        if (col > 0 && ! stack.includes(leftNeighbourStr)) {
            if (this.grid[row][col - 1] === this.EMPTY) {
                this.findEmptyAreaAround(col - 1, row, stack)
            }
        }

        // right neighbour
        if (col < this.size.w - 1 && ! stack.includes(rightNeighbourStr)) {
            if (this.grid[row][col + 1] === this.EMPTY) {
                let a = this.findEmptyAreaAround(col + 1, row, stack)
            }
        }

        // top neighbour
        if (row > 0 && ! stack.includes(topNeighbourStr)) {
            if (this.grid[row - 1][col] === this.EMPTY) {
                this.findEmptyAreaAround(col, row - 1, stack)
            }
        }

        // bottom neighbour
        if (row < this.size.h - 1 && ! stack.includes(bottomNeighbourStr)) {
            if (this.grid[row + 1][col] === this.EMPTY) {
                this.findEmptyAreaAround(col, row + 1, stack)
            }
        }

        return stack
    }

    filterGrid() {
        let stonesToKill = []

        for (let row = 0; row < this.size.h; row++) {
            for (let col = 0; col < this.size.w; col++) {
                if (this.grid[row][col]) {
                    let nLiberties = this.getLibertiesFor(col, row)

                    if (nLiberties === 0) {
                        stonesToKill.push({col, row})
                    }
                }
            }
        }

        this.killStones(stonesToKill)
    }

    killStones(stonesToKill) {
        for (let stone of stonesToKill) {
            this.grid[stone.row][stone.col] = this.EMPTY
        }
    }

    getLibertiesFor(col, row, skipLocations) {
        skipLocations = skipLocations || []

        let color = this.grid[row][col] || this.currentTurn
        let nLiberties = 0
        let leftNeighbourStr = `${col - 1},${row}`
        let rightNeighbourStr = `${col + 1},${row}`
        let topNeighbourStr = `${col},${row - 1}`
        let bottomNeighbourStr = `${col},${row + 1}`

        // left neighbour
        if (col > 0 && ! skipLocations.includes(leftNeighbourStr)) {
            skipLocations.push(leftNeighbourStr)
            let neighbourColor = this.grid[row][col - 1]

            if (neighbourColor === this.EMPTY) {
                nLiberties++
            } else if (neighbourColor === color) {
                nLiberties += this.getLibertiesFor(col - 1, row, skipLocations)
            }
        }

        // right neighbour
        if (col < this.size.w - 1 && ! skipLocations.includes(rightNeighbourStr)) {
            skipLocations.push(rightNeighbourStr)
            let neighbourColor = this.grid[row][col + 1]

            if (neighbourColor === this.EMPTY) {
                nLiberties++
            } else if (neighbourColor === color) {
                nLiberties += this.getLibertiesFor(col + 1, row, skipLocations)
            }
        }

        // top neighbour
        if (row > 0 && ! skipLocations.includes(topNeighbourStr)) {
            skipLocations.push(topNeighbourStr)
            let neighbourColor = this.grid[row - 1][col]

            if (neighbourColor === this.EMPTY) {
                nLiberties++
            } else if (neighbourColor === color) {
                nLiberties += this.getLibertiesFor(col, row - 1, skipLocations)
            }
        }

        // bottom neighbour
        if (row < this.size.h - 1 && ! skipLocations.includes(bottomNeighbourStr)) {
            skipLocations.push(bottomNeighbourStr)
            let neighbourColor = this.grid[row + 1][col]

            if (neighbourColor === this.EMPTY) {
                nLiberties++
            } else if (neighbourColor === color) {
                nLiberties += this.getLibertiesFor(col, row + 1, skipLocations)
            }
        }

        return nLiberties
    }

    log() {
        let str = ''

        for (let row of this.grid) {
            for (let col of row) {
                switch(col) {
                    case this.BLACK:
                        str += 'x'
                        break
                    case this.WHITE:
                        str += 'o'
                        break
                    default:
                        str += '-'
                }
                str += ''
            }
            str += '\n'
        }

        console.log(`%c${str}`, 'line-height:11px;font-size:16px')
    }
}
