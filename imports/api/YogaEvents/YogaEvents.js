/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const YogaEvents = new Mongo.Collection('YogaEvents');

YogaEvents.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

YogaEvents.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

YogaEvents.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this yogaEvent belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this yogaEvent was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this yogaEvent was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the yogaEvent.',
  },
  body: {
    type: String,
    label: 'The body of the yogaEvent.',
  },
});

YogaEvents.attachSchema(YogaEvents.schema);

export default YogaEvents;
