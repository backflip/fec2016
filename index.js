const express = require('express')
const http = require('http')
const socket = require('socket.io')
const redux = require('redux')
const osc = require('osc')

const app = express()
const server = http.Server(app)
const io = socket(server)

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000
})

const initialState = {
  triggers: [
    {
      address: '/osm/a/tr',
      module: 0,
      value: 0,
      label: 'Trigger A, module 1',
      id: 'aTr0'
    },
    {
      address: '/osm/b/tr',
      module: 0,
      value: 0,
      label: 'Trigger B, module 1',
      id: 'bTr0'
    },
    {
      address: '/osm/a/tr',
      module: 1,
      value: 0,
      label: 'Trigger A, module 2',
      id: 'aTr1'
    },
    {
      address: '/osm/b/tr',
      module: 1,
      value: 0,
      label: 'Trigger B, module 2',
      id: 'bTr1'
    }
  ],
  cvs: [
    {
      address: '/osm/a/cv',
      module: 0,
      value: 0,
      label: 'CV A, module 1',
      id: 'aCV0'
    },
    {
      address: '/osm/b/cv',
      module: 0,
      value: 0,
      label: 'CV B, module 1',
      id: 'bCV0'
    },
    {
      address: '/osm/a/cv',
      module: 0,
      value: 0,
      label: 'CV A, module 2',
      id: 'aCV1'
    },
    {
      address: '/osm/a/cv',
      module: 0,
      value: 0,
      label: 'CV B, module 2',
      id: 'bCV1'
    }
  ]
}

let timeouts = {}
let modules = []

function reducer (state = initialState, action) {
  switch (action.type) {
    case 'setTrigger':
      state.triggers.map(function(trigger) {
        if (trigger.id === action.id) {
          trigger.value = action.value;
        }

        return trigger;
      })
    case 'setCV':
      state.cvs.map(function(cv) {
        if (cv.id === action.id) {
          cv.value = action.value;
        }

        return cv;
      })
    default:
      return state
  }
}

const store = redux.createStore(reducer)

udpPort.open()

udpPort.on('message', function (oscMsg) {
  const target = oscMsg.args[0].split(':');
  const ip = target[0];
  const port = target[1];
  const moduleExists = modules.filter((module) => (module.ip === ip && module.port === port)).length;

  if (!moduleExists) {
    modules.push({
      ip,
      port
    })
  }

  console.log('Connected modules', modules);
});

Meteor.methods({
  'udpPort.send'({module, address, value}) {
    const targetModule = modules[module];

    if (targetModule) {
      udpPort.send({
        address: address,
        args: [value]
      }, targetModule.ip, targetModule.port);
    }
  }
});

server.listen(9000)

app.use(express.static('public'))

io.on('connection', function (socket) {
  socket.emit('update', store.getState())

  socket.on('setTrigger', function (id) {
    store.dispatch({
      type: 'setTrigger',
      value: 1,
      id
    })

    io.sockets.emit('update', store.getState())

    if (timeouts[id]) {
      clearTimeout(timeouts[id]);
    }

    timeouts[id] = setTimeout(function () {
      store.dispatch({
        type: 'setTrigger',
        value: 0,
        id
      })

      io.sockets.emit('update', store.getState())
    }, 1000)
  })

  socket.on('setCV', function (id, value) {
    store.dispatch({
      type: 'setCV',
      id,
      value
    })

    io.sockets.emit('update', store.getState())
  })
})
