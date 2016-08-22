import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// import path from 'path';

import './main.html';

// OSM = new Mongo.Collection('OSM');

var aCv, bCv, aTrigger, bTrigger;
function getOrCreateOSMObject(address) {
  var data = {address: address};
  var foo = OSM.findOne(data);

  if (!foo) {
    Meteor.call('OSM.insert', address)
    foo = OSM.findOne(data);
  }

  return foo;
}



Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  aCv() {
    var aCv = OSM.findOne({address: '/osm/a/cv'}) || {}
    var value = aCv.value || 0;
    return value;
  },
  aTr() {
    var aTr = OSM.findOne({address: '/osm/a/tr'}) || {}
    var value = aTr.value || 0;
    return value;
  }
});

Template.hello.events({
  'input input'(event, instance) {
    var value = parseFloat(event.currentTarget.value, 10);
    var aCv = getOrCreateOSMObject('/osm/a/cv');
    Meteor.call('OSM.update', {
      _id: aCv._id,
      address: aCv.address,
      value: value
    });
  },
  'click .a-tr'(event, instance) {
    var aTr = getOrCreateOSMObject('/osm/a/tr');
    Meteor.call('OSM.trigger', {
      _id: aTr._id,
      address: aTr.address
    });
  }
});
