const express = require('express')
const http = require('http')
const socket = require('socket.io')
const redux = require('redux')

const app = express()
const server = http.Server(app)
const io = socket(server)

function reducer(state = { count: 0 }, action) {
  const count = state.count
  switch (action.type) {
  case 'increase':
    return { count: count + 1 }
  default:
    return state
  }
}

const store = redux.createStore(reducer)

server.listen(9000)

app.use(express.static('public'))

io.on('connection', function (socket) {
  socket.emit('update', store.getState())

  socket.on('increase', function (newData) {
    store.dispatch({
      type: 'increase'
    })

    io.sockets.emit('update', store.getState())
  })
})
