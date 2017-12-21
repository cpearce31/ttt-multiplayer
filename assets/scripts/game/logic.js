'use strict'

const store = require('../store')

const turn = () => {
  return store.game.cells.filter(cell => !!cell).length % 2 === 0 ? 'x' : 'o'
}

const tie = () => store.game.cells.filter(cell => cell === '').length === 0

// return true if a is a superset of b
const _superset = (a, b) => b.every(element => a.indexOf(element) !== -1)

const winner = () => {
  // if 'x' or 'o' is at all of these indices, they've won.
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

  // record what indices 'x' and 'o' are _actually_ at
  const indices = {
    'x': [],
    'o': []
  }
  store.game.cells.forEach((cell, i) => cell && indices[cell].push(i))

  // if a players positions are a superset of on of the `wins`, they've won
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
