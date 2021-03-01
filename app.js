class Cell {
  constructor(row, column, neightbours) {
    this.row = row
    this.column = column
    this.neightbours = neightbours // map of adjacent cells {row, column, checked}
    this.adjacentMines = 0
    this.isMined = false
    this.isUncovered = false
    this.isFlagged = false
  }

  uncover() {
    this.isUncovered = true
  }

  placeMine() {
    this.isMined = true
  }

  setAdjacentMines(number) {
    this.adjacentMines = number
  }
}

class Game {
  constructor(size, difficulty) {
    this.totalMines = 0
    this.boardSize = { rows: 8, columns: 8 }
    this.board = []
    this.gameOver = false

    this.init(size, difficulty)
  }

  init(size, difficulty) {
    this.setBoardSize(size)
    this.setTotalMines(difficulty)

    let row = []

    for (let i = 0; i < this.boardSize.columns; i++) {
      row = []
      for (let j = 0; j < this.boardSize.rows; j++) {
        const neightbours = []

        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {

            const outOfBorders = i + r < 0 || i + r >= this.boardSize.rows || j + c < 0 || j + c >= this.boardSize.columns
            
            if (!(c === 0 && r === 0) && !outOfBorders) {
              neightbours.push({ row: i + r, column: j + c })
            }
          }
        }

        const cell = new Cell(i, j, neightbours);
        row.push(cell)
      }
      this.board.push(row)
    }

    for (let i = 0; i < this.totalMines; i++) {
      this.placeMine()
    }

    this.setAdjacentMines()

    console.log(this.board)
  }

  uncoverCell(row, column) {
    const cell = this.board[row][column]
    cell.uncover()

    if (cell.isMined) {
      console.log('Game Over')
      this.gameOver = true
    } else if (cell.adjacentMines === 0) {
      cell.neightbours.forEach(n => {
        if (!this.board[n.row][n.column].isUncovered) {
          this.uncoverCell(n.row, n.column)
        }
      })
    }
  }

  placeMine() {
    const row = Math.floor(Math.random() * this.boardSize.rows)
    const column = Math.floor(Math.random() * this.boardSize.columns)
    
    const cell = this.board[row][column]

    if (!cell.isMined) {
      cell.placeMine()
    } else {
      this.placeMine()
    }
  }

  setAdjacentMines() {
    for (let i = 0; i < this.boardSize.rows; i++) {
      for (let j = 0; j < this.boardSize.columns; j++) {
        let count = 0
        const cell = this.board[i][j]

        for (const neightbour of cell.neightbours) {
          if (this.board[neightbour.row][neightbour.column].isMined) {
            count++
          }
        }

        cell.setAdjacentMines(count)
      }
    }
  }

  setTotalMines(difficulty) {
    switch (difficulty.toString()) {
      case '1': 
        this.totalMines = 10
        break
      case '2': 
        this.totalMines = 40
        break
      case '3': 
        this.totalMines = 99
        break
      default: 
        this.totalMines = 10
    }
  }

  setBoardSize(size) {
    switch (size.toString()) {
      case '1': 
        this.boardSize = { rows: 8, columns: 8 }
        break
      case '2': 
        this.boardSize = { rows: 9, columns: 9 }
        break
      case '3': 
        this.boardSize = { rows: 10, columns: 10 }
        break
      case '4': 
        this.boardSize = { rows: 13, columns: 15 }
        break
      case '5': 
        this.boardSize = { rows: 16, columns: 16 }
        break
      case '6': 
        this.boardSize = { rows: 16, columns: 30 }
        break
      default: 
        this.boardSize = { rows: 8, columns: 8 }
    }
  }
}

var game = new Game(1,1)
