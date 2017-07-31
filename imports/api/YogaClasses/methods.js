import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import YogaClasses from './YogaClasses';
import rateLimit from '../../modules/rate-limit';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const schema = YogaClasses.simpleSchema().omit('owner','createdAt','updatedAt');

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


export const insertYogaClass = new ValidatedMethod({
  name: 'yogaClasses.insert',
  validate: schema.validator(),
  mixins: [LoggedInMixin],
  checkRoles: mustBeAdmin,
  checkLoggedInError: mustBeLoggedIn,
  run(yogaClass) {
    try {
      return YogaClasses.insert({ owner: this.userId, ...yogaClass })
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});


export const updateYogaClass = new ValidatedMethod({
  name: 'yogaClasses.update',
  validate: schema.validator(),
  mixins: [LoggedInMixin],
  checkRoles: mustBeAdmin,
  checkLoggedInError: mustBeLoggedIn,
  run(yogaClass) {
    try {
      const yogaClassId = yogaClass._id;
      YogaClasses.update(yogaClassId, { $set: yogaClass });
      return yogaClassId; // Return _id so we can redirect to yogaEvent after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});

export const removeYogaClass = new ValidatedMethod({
  name: 'yogaClasses.remove',
  validate(id) {
    check(id, String);
  },
  mixins: [LoggedInMixin],
  checkRoles: mustBeAdmin,
  checkLoggedInError: mustBeLoggedIn,
  run({ yogaClassId }) {
    try {
      return YogaClasses.remove(yogaClassId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
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
