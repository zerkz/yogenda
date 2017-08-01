import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish('users.profile', function usersName(userId) {
  check(userId, String);
  return Meteor.users.find(userId, {
    fields: {
      profile: 1,
    },
  });
});
