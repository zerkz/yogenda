import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import YogaEvents from './YogaEvents';
import rateLimit from '../../modules/rate-limit';
import _ from 'lodash';

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

export const signUpForYogaEvent = new ValidatedMethod({
  name: 'yogaEvents.signUp',
  validate(id) {
    check(id, String);
  },
  mixins: [LoggedInMixin],
  checkLoggedInError: mustBeLoggedIn,
  run(id) {
    try {
      console.log(this.userId)
      let yogaEvent = YogaEvents.findOne(id);
      if (_.some(yogaEvent.attendees, {owner : this.userId})) {
        throw "You are already signed up!";
      } else {
        const user = Meteor.user();
        const attendee = {
          id : this.userId,
          name : user.profile.name,
          dateAdded : new Date()
        };
        //addtoSet is kidna made useless by dateAdded autovalue... refactor?
        return YogaEvents.update(id, { $addToSet : { 'attendees' : attendee }});
      }
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  }
});

export const dropOffYogaEvent = new ValidatedMethod({
  name: 'yogaEvents.dropOff',
  validate(id) {
    check(id, String);
  },
  mixins: [LoggedInMixin],
  checkLoggedInError: mustBeLoggedIn,
  run(id) {
    try {
      let yogaEvent = YogaEvents.findOne(id);
      if (!_.some(yogaEvent.attendees, { id : this.userId})) {
        throw "You are not signed up for the Yoga Event to begin with.";
      } else {
        //addtoSet is kidna made useless by dateAdded autovalue... refactor?
        return YogaEvents.update(id, { $pull : { 'attendees' : { id : this.userId } }}).modifiedCount;
      }
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  }
});

rateLimit({
  methods: [
    'yogaEvents.insert',
    'yogaEvents.update',
    'yogaEvents.remove',
    'yogaEvents.signUp',
    'yogaEvents.dropOff',
  ],
  limit: 5,
  timeRange: 1000,
});
