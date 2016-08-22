import { Meteor } from 'meteor/meteor';

import osc from 'osc';

// Create an osc.js UDP Port listening on port 57121.
const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000
});

// Open the socket.
udpPort.open();

Meteor.methods({
  'udpPort.send'({address, value}) {
    udpPort.send({
      address: address,
      args: [value]
    }, '192.168.1.242', 8000);
  }
});
