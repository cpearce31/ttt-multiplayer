'use strict'

const api = require('./api')
const ui = require('./ui')
const store = require('../store')
const logic = require('./logic')

const onClickCell = function (event) {
  // if the game isn't active, do nothing
  if (store.game && store.game.over) {
    return
  }

  let game
  if (store.game) {
    // if the game already exists, wrap it in a promise so that .then will work
    game = Promise.resolve({ game: store.game })
  } else {
    // if there isn't a game, create one
    game = api.create()
  }

  // pass the game data to ui.createGameSuccess
  game
    .then(ui.createGameSuccess)
    .then(game => {
      // pull the index of the clicked cell from its `data-index`
      const index = event.target.dataset.index
      const value = logic.turn()

      store.game.cells[index] = value

      // logic.winner returns 'x', 'o', or null so coerce to a bool
      const over = !!logic.winner() || logic.tie()

      return {
        game: {
          cell: {
            index,
            value
          },
          over
        }
      }
    })
    .then(api.update)
    .then(ui.updateGameSuccess)
    .catch(ui.updateGameFail)
}

const onReset = function () {
  api.create()
    .then(ui.createGameSuccess)
    .catch(ui.createGameFail)
}

const addHandlers = () => {
  $('.cell').on('click', onClickCell)
  $('#reset').on('click', onReset)
}

module.exports = {
  addHandlers
}
