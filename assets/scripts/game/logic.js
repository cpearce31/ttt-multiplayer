'use strict'

const store = require('../store')

const initGame = () => {
  store.game = {
    cells: ['', '', '', '', '', '', '', '', ''],
    over: false
  }
}

const turn = () => {
  return store.game.cells.filter(cell => cell === 'x').length % 2 ? 'x' : 'o'
}

const tie = () => store.game.cells.filter(cell => cell === '').length === 0

// return true if a is a superset of b
const _superset = (a, b) => b.every(element => a.indexOf(element) !== -1)

const winner = () => {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const indices = {
    'x': [],
    'o': []
  }

  store.game.cells.forEach((cell, i) => cell && indices[cell].push(i))

  const xWon = wins.filter(win => _superset(indices.x, win)).length > 0
  const oWon = wins.filter(win => _superset(indices.o, win)).length > 0

  if (xWon) {
    return 'x'
  } else if (oWon) {
    return 'o'
  } else {
    return null
  }
}

module.exports = {
  initGame,
  turn,
  winner,
  tie
}
