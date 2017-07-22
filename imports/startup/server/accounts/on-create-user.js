import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  const userEmail = userToCreate.services.azureAd.mail;
  const adminEmails = Meteor.settings.private.admin_user_emails || [];
  if (options.profile) userToCreate.profile = options.profile;
  userToCreate.roles = adminEmails.includes(userEmail) ? ['admin'] : ['user'];
  return userToCreate;
});
