import { Meteor } from 'meteor/meteor';
import osc from 'osc';

let modules = [];

// Create an osc.js UDP Port listening on port 57121.
const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000
});

// Open the socket.
udpPort.open();

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
