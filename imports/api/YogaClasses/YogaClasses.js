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
  location: {
    type: String,
    label: "Location of the Yoga Class.",
    optional: true
  },
  title: {
    type: String,
    label: 'The title of the Yoga class.',
  },
  description: {
    type: String,
    label: 'The description of the Yoga class.',
  },
  duration : {
    type : Number,
    label: "The duration of the Yoga class in minutes.",
    min: 0
  },
  spotifyURL : {
    type : String,
    label : "The spotify playlist URL of the class.",
    regEx : "https:\/\/open.spotify.com\/user\/.+\/\w+",
    optional: true
  },
  maxAttendees : {
    type : Number,
    label : "the max amount of attendees that can attend the class.",
    min: 1
  }
});

YogaClasses.attachSchema(YogaClasses.schema);

export default YogaClasses;
