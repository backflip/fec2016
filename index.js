const express = require('express')
const http = require('http')
const socket = require('socket.io')
const redux = require('redux')

const app = express()
const server = http.Server(app)
const io = socket(server)

let timeout

function reducer (state = { trigger: 0, range: 0 }, action) {
  switch (action.type) {
    case 'setTrigger':
      return Object.assign({}, state, { trigger: action.value })
    case 'setRange':
      return Object.assign({}, state, { range: action.value })
    default:
      return state
  }
}

const store = redux.createStore(reducer)

server.listen(9000)

app.use(express.static('public'))

io.on('connection', function (socket) {
  socket.emit('update', store.getState())

  socket.on('setTrigger', function () {
    store.dispatch({
      type: 'setTrigger',
      value: 1
    })

    io.sockets.emit('update', store.getState())

    timeout = setTimeout(function() {
      store.dispatch({
        type: 'setTrigger',
        value: 0
      })

      io.sockets.emit('update', store.getState())

      clearTimeout(timeout);
    }, 1000)
  })

  socket.on('setRange', function (value) {
    store.dispatch({
      type: 'setRange',
      value
    })

    io.sockets.emit('update', store.getState())
  })
})
