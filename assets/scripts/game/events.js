'use strict'

const api = require('./api')
const ui = require('./ui')
const store = require('../store')
const logic = require('./logic')

const onClickCell = function (event) {
  if (store.game.over) {
    return
  }

  const index = event.target.dataset.id
  const symbol = logic.turn()

  store.game.cells[index] = symbol

  const over = !!logic.winner() || logic.tie()

  api.update(index, symbol, over)
    .then(ui.onUpdateSuccess)
    .catch(ui.onUpdateFail)
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
