import { Template } from 'meteor/templating';
import rangetouch from 'rangetouch';
import './main.html';

var interval;

function getOrCreateOSMObject(address, module) {
  var data = {address: address, module: module};
  var OSMObject = OSM.findOne(data);

  if (!OSMObject) {
    Meteor.call('OSM.insert', data);

    OSMObject = OSM.findOne(data);
  }

  return OSMObject;
}

// Template.app.onCreated(function appOnCreated() {
// });

Template.app.helpers({
  aCv1() {
    var aCv = OSM.findOne({address: '/osm/a/cv', module: 'a'}) || {}
    var value = aCv.value || 0;
    return value;
  },
  aCv2() {
    var aCv = OSM.findOne({address: '/osm/b/cv', module: 'a'}) || {}
    var value = aCv.value || 0;
    return value;
  },
  bCv1() {
    var aCv = OSM.findOne({address: '/osm/a/cv', module: 'b'}) || {}
    var value = aCv.value || 0;
    return value;
  },
  bCv2() {
    var aCv = OSM.findOne({address: '/osm/b/cv', module: 'b'}) || {}
    var value = aCv.value || 0;
    return value;
  },
  aTr1() {
    var aTr = OSM.findOne({address: '/osm/a/tr', module: 'a'}) || {}
    var value = aTr.value || 0;
    return value;
  },
  aTr2() {
    var aTr = OSM.findOne({address: '/osm/b/tr', module: 'a'}) || {}
    var value = aTr.value || 0;
    return value;
  },
  bTr1() {
    var aTr = OSM.findOne({address: '/osm/a/tr', module: 'b'}) || {}
    var value = aTr.value || 0;
    return value;
  },
  bTr2() {
    var aTr = OSM.findOne({address: '/osm/b/tr', module: 'b'}) || {}
    var value = aTr.value || 0;
    return value;
  },
  isPressed(value) {
    return value !== 0;
  }
});

Template.app.events({
  'input #acv1'(event, instance) {
    var value = parseFloat(event.currentTarget.value, 10);
    var aCv = getOrCreateOSMObject('/osm/a/cv', 'a');

    Meteor.call('OSM.update', {
      _id: aCv._id,
      address: aCv.address,
      value: value,
      module: 'a'
    });
  },
  'input #acv2'(event, instance) {
    var value = parseFloat(event.currentTarget.value, 10);
    var aCv = getOrCreateOSMObject('/osm/b/cv', 'a');

    Meteor.call('OSM.update', {
      _id: aCv._id,
      address: aCv.address,
      value: value,
      module: 'a'
    });
  },
  'input #bcv1'(event, instance) {
    var value = parseFloat(event.currentTarget.value, 10);
    var aCv = getOrCreateOSMObject('/osm/a/cv', 'b');

    Meteor.call('OSM.update', {
      _id: aCv._id,
      address: aCv.address,
      value: value,
      module: 'b'
    });
  },
  'input #bcv2'(event, instance) {
    var value = parseFloat(event.currentTarget.value, 10);
    var aCv = getOrCreateOSMObject('/osm/b/cv', 'b');

    Meteor.call('OSM.update', {
      _id: aCv._id,
      address: aCv.address,
      value: value,
      module: 'b'
    });
  },
  'mousedown #atr1, touchstart #atr1'(event, instance) {
    var aTr = getOrCreateOSMObject('/osm/a/tr', 'a');
    
    Meteor.call('OSM.trigger', {
      _id: aTr._id,
      address: aTr.address,
      module: 'a'
    });

    // interval = setInterval(function() {
    //   Meteor.call('OSM.trigger', {
    //     _id: aTr._id,
    //     address: aTr.address
    //   });
    // }, 100);
  },
  'mousedown #atr2, touchstart #atr2'(event, instance) {
    var aTr = getOrCreateOSMObject('/osm/b/tr', 'a');
    
    Meteor.call('OSM.trigger', {
      _id: aTr._id,
      address: aTr.address,
      module: 'a'
    });

    // interval = setInterval(function() {
    //   Meteor.call('OSM.trigger', {
    //     _id: aTr._id,
    //     address: aTr.address
    //   });
    // }, 100);
  },
  'mousedown #btr1, touchstart #btr1'(event, instance) {
    var aTr = getOrCreateOSMObject('/osm/a/tr', 'b');
    
    Meteor.call('OSM.trigger', {
      _id: aTr._id,
      address: aTr.address,
      module: 'b'
    });

    // interval = setInterval(function() {
    //   Meteor.call('OSM.trigger', {
    //     _id: aTr._id,
    //     address: aTr.address
    //   });
    // }, 100);
  },
  'mousedown #btr2, touchstart #btr2'(event, instance) {
    var aTr = getOrCreateOSMObject('/osm/b/tr', 'b');
    
    Meteor.call('OSM.trigger', {
      _id: aTr._id,
      address: aTr.address,
      module: 'b'
    });

    // interval = setInterval(function() {
    //   Meteor.call('OSM.trigger', {
    //     _id: aTr._id,
    //     address: aTr.address
    //   });
    // }, 100);
  },
  // 'mouseup .a-tr, touchend .a-tr'(event, instance) {
  //   if (interval) {
  //     clearInterval(interval);
  //   }
  // }
});
