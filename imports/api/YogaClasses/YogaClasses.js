/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import uniforms from 'uniforms';

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
    uniforms: () => null
  },
  createdAt: {
    type: String,
    label: 'The date this yogaClass was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
    uniforms: () => null
  },
  updatedAt: {
    type: String,
    label: 'The date this yogaClass was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
    uniforms: () => null
  },
  title: {
    type: String,
    label: 'Title',
  },
  description: {
    type: String,
    label: 'Description',
  },
  durationInMinutes : {
    type : Number,
    label: "The duration (minutes)",
    min: 0
  },
  maxAttendees : {
    type : Number,
    label : "Max number of Yogis",
    min: 1
  },
  location: {
    type: String,
    label: "Location (optional)",
    optional: true
  },
  spotifyURL : {
    type : String,
    label : "Spotify Playlist URL (optional)",
    regEx : "https:\/\/open.spotify.com\/user\/.+\/\w+",
    optional: true
  }
});

YogaClasses.attachSchema(YogaClasses.schema);

export default YogaClasses;
