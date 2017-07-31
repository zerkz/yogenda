/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import YogaClasses from '../YogaClasses/YogaClasses';
import SimpleSchema from 'simpl-schema';
import uniforms from 'uniforms';
import _ from 'lodash';

const YogaEvents = new Mongo.Collection('YogaEvents');
const YogaClassesSchema = _.clone(YogaClasses.simpleSchema()._schema);

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


const AttendeeSchema = new SimpleSchema({
  id: {
    type: String,
    label: 'The ID of the attendee.',
  },
  dateAdded: {
    type: String,
    label: 'The date this yogaEvent was created.',
  },
  muscleGroups : {
    type : Array,
    label : 'The muscle groups requested to be worked on.',
    allowedValues : ['arms','chest','head','legs']
  },
  "muscleGroups.$": {
    type : String
  }
});

//extend schema object with overridable Yoga Class schema.
let eventsSchema = _.assign(YogaClassesSchema, {
  owner: {
    type: String,
    label: 'The ID of the user this Yoga Event belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this Yoga Event was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    }
  },
  attendees: {
    type: Array,
    "label" : "List of attendees",
    autoValue: function() {
      if (this.isInsert) {
        return [];
      }
    }
  },
  "attendees.$": {
    type: AttendeeSchema,
    "label" : "List of attendees"
  },
  updatedAt: {
    type: String,
    label: 'The date this Yoga Event was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    }
  },
  startsAt: {
    type: Date,
    label: 'The date this Yoga Event starts',
  },
  additionalInformation : {
    type: String,
    label : "Additional information about the yoga event.",
    optional : true
  }
});

YogaEvents.schema = new SimpleSchema(eventsSchema);

YogaEvents.attachSchema(YogaEvents.schema);

export default YogaEvents;
