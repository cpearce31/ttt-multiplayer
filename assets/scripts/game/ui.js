'use strict'

const store = require('../store')
const logic = require('./logic')

// translate the `store.game.cells` array into 'x' and 'o's in the DOM
const renderGame = () => {
  $('.cell').each(function (i, el) {
    $(el).text(store.game.cells[el.dataset.index])
  })
}

const createGameSuccess = data => {
  $('#message').text('')
  store.game = data.game
  renderGame()
}

const createGameFail = err => console.error(err)

const updateGameSuccess = data => {
  $('#message').text('')
  store.game = data.game

  renderGame()

  if (logic.winner()) {
    $('#message').text(`Player ${logic.winner()} won!`)
  } else if (logic.tie()) {
    $('#message').text('It\'s a tie!')
  }
}

const updateGameFail = err => console.error(err)

module.exports = {
  createGameSuccess,
  createGameFail,
  updateGameSuccess,
  updateGameFail,
  renderGame
}
