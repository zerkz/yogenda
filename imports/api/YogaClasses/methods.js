import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import YogaClasses from './YogaClasses';
import rateLimit from '../../modules/rate-limit';

import { ValidatedMethod } from 'meteor/mdg:validated-method';


export const insertYogaClass = new ValidatedMethod({
  name: 'yogaClasses.insert',
  validate: YogaClasses.simpleSchema().omit('owner','createdAt', 'updatedAt').validator(),
  run(yogaClass) {
    try {
        console.log(yogaClass);
      let insertResult = YogaClasses.insert({ owner: this.userId, ...yogaClass });

      return insertResult
    } catch (exception) {

      throw new Meteor.Error('500', exception);
    }
  }
});


export const updateYogaClass = new ValidatedMethod({
  name: 'yogaClasses.update',
  validate: YogaClasses.simpleSchema().validator(),
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
  validate: YogaClasses.simpleSchema().validator(),
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
