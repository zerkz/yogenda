import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import YogaEvents from './YogaEvents';
import rateLimit from '../../modules/rate-limit';

const mustBeAdmin = {
    roles: ['admin'],
    rolesError: {
      error: 'not-allowed',
      message: 'You are not allowed to call this method',//Optional
      reason: 'You are not allowed to call this method' //Optional
    }
  };

const mustBeLoggedIn = {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
};


const schema = YogaEvents.simpleSchema();;


export const insertYogaEvent = new ValidatedMethod({
  name: 'yogaEvents.insert',
  validate: schema.omit('owner', 'createdAt', 'updatedAt', 'attendees').validator(),
  mixins: [LoggedInMixin],
  checkRoles: mustBeAdmin,
  checkLoggedInError: mustBeLoggedIn,
  run(yogaEvent) {
    try {
      return YogaEvents.insert({ owner: this.userId, ...yogaEvent })
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});

export const updateYogaEvent = new ValidatedMethod({
  name: 'yogaEvents.update',
  validate: schema.validator(),
  mixins: [LoggedInMixin],
  checkRoles: mustBeAdmin,
  checkLoggedInError: mustBeLoggedIn,
  run(yogaEvent) {
      try {
      const yogaEventId = doc._id;
      YogaEvents.update(yogaEventId, { $set: doc });
      return yogaEventId; // Return _id so we can redirect to yogaEvent after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});

export const removeYogaEvent = new ValidatedMethod({
  name: 'yogaEvents.remove',
  validate(id) {
    check(id, String);
  },
  mixins: [LoggedInMixin],
  checkRoles: mustBeAdmin,
  checkLoggedInError: mustBeLoggedIn,
  run(yogaEventId) {
    try {
      return YogaEvents.remove(yogaEventId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
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
