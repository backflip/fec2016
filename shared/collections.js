OSM = new Mongo.Collection('OSM');

var timeout;

Meteor.methods({
  'OSM.insert'(address) {
    data = {address};
    instace = OSM.findOne(data);
    // Make sure the address does not exist
    if (instace) {
      throw new Meteor.Error(address + ' already exists');
    }
    OSM.insert(data);
  },

  'OSM.update'(document) {
    Meteor.call('udpPort.send', document);
    OSM.update(document._id, document);
  },

  'OSM.trigger'(document) {
    document.value = 1;
    Meteor.call('udpPort.send', document);
    OSM.update(document._id, document);
    if (timeout) {
      clearTimeout(timeout)
    };
    timeout = setTimeout(Meteor.bindEnvironment(() => {
      document.value = 0;
      Meteor.call('udpPort.send', document);
      OSM.update(document._id, document);
    }), 300);
  }
})
