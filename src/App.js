import React, {Component} from 'react';
import './App.css';

const X_CHAR = 'X'
const O_CHAR = 'O'
const ROW_WIN = 'rowWin'
const COLUMN_WIN = 'columnWin'
const CROSS_DOWN_WIN = 'crossDownWin'
const CROSS_UP_WIN = 'crossUpWin'

const emptyBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

export default class App extends Component {
  state = {
    currentTurnChar: X_CHAR,
    board: JSON.parse(JSON.stringify(emptyBoard)),
    winDetails: null
  }

  handleCellClick = (e) => {
    const {board, currentTurnChar, winDetails} = this.state

    if (winDetails) {
      return
    }

    const cellId = e.target.id
    const [x, y] = this.getXAndYFromId(cellId)
    const newBoard = [...board]

    newBoard[x][y] = currentTurnChar
    const newWinDetails = this.checkIfThereIsAWinner(x, y, currentTurnChar)

    const nextTurnChar = this.getNextTurnChar()

    this.setState({
      board: newBoard,
      currentTurnChar: nextTurnChar,
      winDetails: newWinDetails
    })
  }

  checkIfThereIsAWinner = (x, y, currentTurnChar) => {
    const {board} = this.state

    // Winning Options:

    // By Row
    if (board[x][0] === board[x][1] &&
        board[x][1] === board[x][2]) {
      return {
        winType: ROW_WIN,
        winnerCellIds: [`${x}-0`, `${x}-1`, `${x}-2`]
      }
    }

    // By Column
    if (board[0][y] === board[1][y] &&
        board[1][y] === board[2][y]) {
      return {
        winType: COLUMN_WIN,
        winnerCellIds: [`0-${y}`, `1-${y}`, `2-${y}`]
      }
    }

    // Checking if the current cell can't be
    // a part of a cross
    if ((x === 0 && y === 1) ||
        (x === 1 && y === 0) ||
        (x === 1 && y === 2) ||
        (x === 2 && y === 1)) {
      return null
    }

    // By Cross 1
    if (board[0][0] !== '' &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) {
      return {
        winType: CROSS_DOWN_WIN,
        winnerCellIds: ['0-0', '1-1', '2-2']
      }
    }

    // By Cross 2
    if (board[2][0] !== '' &&
        board[2][0] === board[1][1] &&
        board[1][1] === board[0][2]) {
      return {
        winType: CROSS_UP_WIN,
        winnerCellIds: ['2-0', '1-1', '0-2']
      }
    }

    return null
  }

  getNextTurnChar = () => {
    const {currentTurnChar} = this.state

    return (currentTurnChar === X_CHAR ? O_CHAR : X_CHAR)
  }

  getXAndYFromId = (id) => {
    const [x, y] = id.split('-')

    return [x, y]
  }

  createCell = (id) => {
    const {board, winDetails} = this.state
    const [x, y] = this.getXAndYFromId(id)
    const cellChar = board[x][y]
    const isWinnerCell =
      winDetails && winDetails.winnerCellIds.includes(id)

    return (
      <div id={id} className={`cell ${isWinnerCell && 'winner'}`} onClick={this.handleCellClick}>
        {cellChar}
      </div>
    )
  }

  handleReplayClick = () => {
    this.setState({board: JSON.parse(JSON.stringify(emptyBoard)), winDetails: null})
  }

  render() {
    const {winDetails} = this.state
    return (
      <div className="App">
        <div className="board-container">
          <div className="line">
            {this.createCell('0-0')}
            {this.createCell('0-1')}
            {this.createCell('0-2')}
          </div>
          <div className="line">
            {this.createCell('1-0')}
            {this.createCell('1-1')}
            {this.createCell('1-2')}
          </div>
          <div className="line">
            {this.createCell('2-0')}
            {this.createCell('2-1')}
            {this.createCell('2-2')}
          </div>
        </div>

        {winDetails && <div className="replay-button" onClick={this.handleReplayClick}>Replay</div>}
      </div>
    );
  }
}
