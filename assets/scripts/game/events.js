'use strict'

const api = require('./api')
const ui = require('./ui')
const store = require('../store')
const logic = require('./logic')
const config = require('../config')
const getFormFields = require('../../../lib/get-form-fields')
const resourceWatcher = require('../../../lib/resource-watcher')

const onClickCell = function (event) {
  // if the game isn't active or the cell is full, do nothing
  if ((store.game && store.game.over) || $(event.target).text()) {
    return
  }

  // if it's multiplayer and not your turn, do nothing
  if (store.you && logic.turn() !== store.you) {
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
  // if `you` was set from a multiplayer game, clear it
  store.you = null
  api.create()
    .then(ui.createGameSuccess)
    .catch(ui.createGameFail)
}

const onJoin = function (event) {
  // if you're joining, you're player 'o'
  store.you = 'o'

  event.preventDefault()
  const id = getFormFields(event.target).id

  store.game = { id }

  // the API expects a PATCH with a blank object as a body to "join" a game
  api.update({})
  .then(data => {
    store.game = data.game
    ui.renderGame()

    // subscribe to updates from the game you just joined
    watchGame(id)
  })
}

const onCreateMultiplayer = () => {
  // if you're hosting, you're player 'x'
  store.you = 'x'

  api.create()
    .then(data => {
      store.game = data.game
      ui.renderGame()
      $('#message').text(`The ID is ${store.game.id}`)

      // subscribe to the game you just created
      watchGame(store.game.id)
    })
}

const watchGame = id => {
  // this is the object that will recieve `change` events when the other player
  // makes a move
  const gameWatcher = resourceWatcher(`${config.apiOrigin}/games/${id}/watch`, {
    Authorization: 'Token token=' + store.user.token
  })

  // when a change event comes in, update the DOM to match the changed board
  gameWatcher.on('change', data => {
    if (data.game && data.game.cells) {
      store.game.cells = data.game.cells[1]
      ui.renderGame()
    }
  })
}

const addHandlers = () => {
  $('.cell').on('click', onClickCell)
  $('#reset').on('click', onReset)
  $('#join').on('submit', onJoin)
  $('#create-multiplayer').on('click', onCreateMultiplayer)
}

module.exports = {
  addHandlers
}
