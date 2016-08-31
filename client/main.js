import { Template } from 'meteor/templating';
import rangetouch from 'rangetouch';
import './main.html';

var interval;

function getOrCreateOSMObject(address) {
  var data = {address: address};
  var OSMObject = OSM.findOne(data);

  if (!OSMObject) {
    Meteor.call('OSM.insert', address);

    OSMObject = OSM.findOne(data);
  }

  return OSMObject;
}

// Template.app.onCreated(function appOnCreated() {
// });

Template.app.helpers({
  aCv() {
    var aCv = OSM.findOne({address: '/osm/a/cv'}) || {}
    var value = aCv.value || 0;
    return value;
  },
  aTr() {
    var aTr = OSM.findOne({address: '/osm/a/tr'}) || {}
    var value = aTr.value || 0;
    return value;
  },
  isPressed(value) {
    return value !== 0;
  }
});

Template.app.events({
  'input input'(event, instance) {
    var value = parseFloat(event.currentTarget.value, 10);
    var aCv = getOrCreateOSMObject('/osm/a/cv');

    Meteor.call('OSM.update', {
      _id: aCv._id,
      address: aCv.address,
      value: value
    });
  },
  'mousedown .a-tr, touchstart .a-tr'(event, instance) {
    var aTr = getOrCreateOSMObject('/osm/a/tr');
    
    Meteor.call('OSM.trigger', {
      _id: aTr._id,
      address: aTr.address
    });

    interval = setInterval(function() {
      Meteor.call('OSM.trigger', {
        _id: aTr._id,
        address: aTr.address
      });
    }, 100);
  },
  'mouseup .a-tr, touchend .a-tr'(event, instance) {
    if (interval) {
      clearInterval(interval);
    }
  }
});
