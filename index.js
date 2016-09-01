const express = require('express')
const http = require('http')
const socket = require('socket.io')
const redux = require('redux')

const oscWrapper = require('./lib/osc.js')
const config = require('./config.js')

const app = express()
const server = http.Server(app)
const io = socket(server)

const initialState = config

let timeouts = {}
let modules = []

function storeReducer (state = initialState, action) {
  switch (action.type) {
    case 'setTrigger':
      state.triggers.map(function(trigger) {
        if (trigger.id === action.id) {
          trigger.value = parseFloat(action.value);

          oscWrapper.sendSignal(trigger)
        }

        return trigger;
      })
    case 'setCV':
      state.cvs.map(function(cv) {
        if (cv.id === action.id) {
          cv.value = parseFloat(action.value);

          oscWrapper.sendSignal(cv)
        }

        return cv;
      })
    default:
      return state
  }
}

function dispatch (type, id, value) {
  store.dispatch({
    type,
    value,
    id
  })

  io.sockets.emit('update', store.getState())
}

const store = redux.createStore(storeReducer)

server.listen(3001)

app.use(express.static('public'))

io.on('connection', function (socket) {
  socket.emit('update', store.getState())

  socket.on('setTrigger', function (id) {
    dispatch('setTrigger', id, 1)

    if (timeouts[id]) {
      clearTimeout(timeouts[id]);
    }

    timeouts[id] = setTimeout(function () {
      dispatch('setTrigger', id, 0)
    }, 100)
  })

  socket.on('setCV', function (id, value) {
    dispatch('setCV', id, value)
  })
})
