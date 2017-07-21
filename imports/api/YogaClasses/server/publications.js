import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import YogaClasses from '../YogaClasses';

Meteor.publish('yogaClasses', function yogaClasses() {
  return YogaClasses.find({ owner: this.userId });
});

// Note: yogaClasses.view is also used when editing an existing yogaEvent.
Meteor.publish('yogaClasses.view', function yogaClassesView(yogaClassId) {
  check(yogaClassId, String);
  return YogaClasses.find({ _id: yogaClassId, owner: this.userId });
});
