import { Meteor } from 'meteor/meteor';

import osc from 'osc';

// Create an osc.js UDP Port listening on port 57121.
const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000
});

let a;
let b;

// Open the socket.
udpPort.open();

udpPort.on("message", function (oscMsg) {
  if (!a || !b) {
    const target = oscMsg.args[0].split(':');
    const ip = target[0];
    const port = target[1];

    if (!a) {
      a = {
        ip,
        port
      }
    } else {
      b = {
        ip,
        port
      }
    }
  }
});

Meteor.methods({
  'udpPort.send'({module, address, value}) {
    const bla = (module === 'a') ? a : b;

    udpPort.send({
      address: address,
      args: [value]
    }, bla.ip, bla.port);
  }
});
