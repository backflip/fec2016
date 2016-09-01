import { Template } from 'meteor/templating';
import rangetouch from 'rangetouch';
import './main.html';

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  document.documentElement.classList.add('touch');
}

function getOrCreateOSMObject(address, module) {
  var data = {address, module};
  var OSMObject = OSM.findOne(data);

  if (!OSMObject) {
    Meteor.call('OSM.insert', data);

    OSMObject = OSM.findOne(data);
  }

  return OSMObject;
}

Template.app.helpers({
  getCV(address, module) {
    var OSMObject = getOrCreateOSMObject(address, module);

    return OSMObject.value || 0;
  },
  isTriggered(address, module) {
    var OSMObject = getOrCreateOSMObject(address, module);

    return OSMObject.value && OSMObject.value !== 0;
  }
});

Template.app.events({
  'input [data-init="cv"]'(event, instance) {
    var element = event.currentTarget;
    var address = element.dataset.address;
    var module = element.dataset.module;
    var value = parseFloat(event.currentTarget.value, 10);
    var OSMObject = getOrCreateOSMObject(address, module);

    OSMObject.value = value;

    Meteor.call('OSM.update', OSMObject);
  },
  'click [data-init="trigger"], touchstart [data-init="trigger"]'(event, instance) {
    var element = event.currentTarget;
    var address = element.dataset.address;
    var module = element.dataset.module;
    var OSMObject = getOrCreateOSMObject(address, module);

    Meteor.call('OSM.trigger', OSMObject);
  }
});
