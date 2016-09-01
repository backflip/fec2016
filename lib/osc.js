const osc = require('osc')

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000
})

let timeouts = {}
let modules = []

function sendSignal (data) {
  const targetModule = modules[data.module]

  if (targetModule) {
    udpPort.send({
      address: data.address,
      args: [data.value]
    }, targetModule.ip, targetModule.port)
  }
}

function registerModule (oscMsg) {
  const target = oscMsg.args[0].split(':')
  const ip = target[0]
  const port = target[1]
  const moduleExists = modules.filter((module) => (module.ip === ip && module.port === port)).length

  if (!moduleExists) {
    modules.push({
      ip,
      port
    })
  }
}

udpPort.open()

udpPort.on('message', function (oscMsg) {
  registerModule(oscMsg)

  console.log('Connected modules', modules)
})

module.exports = { udpPort, sendSignal }
