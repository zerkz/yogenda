/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const YogaClasses = new Mongo.Collection('YogaClasses');

YogaClasses.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

YogaClasses.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

YogaClasses.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this yogaClass belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this yogaClass was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this yogaClass was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the yogaClass.',
  },
  body: {
    type: String,
    label: 'The body of the yogaClass.',
  },
});

YogaClasses.attachSchema(YogaClasses.schema);

export default YogaClasses;
