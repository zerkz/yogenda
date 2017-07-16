import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import YogaEvents from './YogaEvents';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'yogaEvents.insert': function yogaEventsInsert(doc) {
    check(doc, {
      title: String,
      body: String,
    });

    try {
      return YogaEvents.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'yogaEvents.update': function yogaEventsUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const yogaEventId = doc._id;
      YogaEvents.update(yogaEventId, { $set: doc });
      return yogaEventId; // Return _id so we can redirect to yogaEvent after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'yogaEvents.remove': function yogaEventsRemove(yogaEventId) {
    check(yogaEventId, String);

    try {
      return YogaEvents.remove(yogaEventId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'yogaEvents.insert',
    'yogaEvents.update',
    'yogaEvents.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
