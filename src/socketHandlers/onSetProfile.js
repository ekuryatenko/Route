import dbHelper from "./../helpers/dbHelper";

/**
 * Fires when user has changed fields on his profile page
 *
 * Result - user profile data has changed, and user get prompt
 *
 * @param {Object} modificatedProfile - New user profile
 */
export function onSetProfile(modificatedProfile) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;

  dbHelper.updateProfile(modificatedProfile).then(
    (profileFromDB) => {
      socket.emit('setProfile', profileFromDB);

      // Confirm user
      socket.emit ('alert', 'Profile changed!');
  });
}
