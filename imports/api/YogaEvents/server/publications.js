import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import YogaEvents from '../YogaEvents';

Meteor.publish('yogaEvents', function yogaEvents() {
  return YogaEvents.find({ owner: this.userId });
});

// Note: yogaEvents.view is also used when editing an existing yogaEvent.
Meteor.publish('yogaEvents.view', function yogaEventsView(yogaEventId) {
  check(yogaEventId, String);
  return YogaEvents.find({ _id: yogaEventId, owner: this.userId });
});
