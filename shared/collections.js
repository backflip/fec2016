OSM = new Mongo.Collection('OSM');

let timeout;

Meteor.methods({
  'OSM.insert'(data) {
    const instance = OSM.findOne(data);

    if (!instance) {
      OSM.insert(data);
    }
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
    }), 100);
  }
})
