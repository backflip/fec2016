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
          trigger.value = action.value;

          oscWrapper.sendSignal(trigger)
        }

        return trigger;
      })
    case 'setCV':
      state.cvs.map(function(cv) {
        if (cv.id === action.id) {
          cv.value = action.value;

          oscWrapper.sendSignal(cv)
        }

        return cv;
      })
    default:
      return state
  }
}

function setTrigger (id) {
  store.dispatch({
    type: 'setTrigger',
    value: 1,
    id
  })

  io.sockets.emit('update', store.getState())
}

function setCV (id, value) {
  store.dispatch({
    type: 'setCV',
    id,
    value
  })

  io.sockets.emit('update', store.getState())
}

const store = redux.createStore(storeReducer)

server.listen(9000)

app.use(express.static('public'))

io.on('connection', function (socket) {
  socket.emit('update', store.getState())

  socket.on('setTrigger', function (id) {
    setTrigger(id)

    if (timeouts[id]) {
      clearTimeout(timeouts[id]);
    }

    timeouts[id] = setTimeout(function () {
      setTrigger(id)
    }, 100)
  })

  socket.on('setCV', function (id, value) {
    setCV(id, value)
  })
})
