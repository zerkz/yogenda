import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import YogaClasses from './YogaClasses';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'yogaClasses.insert': function yogaClassesInsert(yogaClass) {
    check(yogaClass);
    try {
      return YogaClasses.insert({ owner: this.userId, ...yogaClass });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'yogaClasses.update': function yogaClassesUpdate(yogaClass) {
    check(yogaClass, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const yogaClassId = yogaClass._id;
      YogaClasses.update(yogaClassId, { $set: yogaClass });
      return yogaClassId; // Return _id so we can redirect to yogaEvent after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'yogaClasses.remove': function yogaClassesRemove(yogaClassId) {
    check(yogaClassId, String);

    try {
      return YogaClasses.remove(yogaClassId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'yogaClasses.insert',
    'yogaClasses.update',
    'yogaClasses.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
