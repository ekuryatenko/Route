import dbHelper from "./../helpers/dbHelper";

/**
 * Fires when user has changed fields on his profile page
 *
 * Result - user profile data has changed, and user get prompt
 *
 * @param {Object} newProfile - New user profile
 */
export function onSetProfile(newProfile) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;

  dbHelper.updateProfile(null, newProfile, (profileFromDB) => {
    socket.emit('setProfile', profileFromDB);

    // Confirm user
    socket.emit ('alert', 'Profile changed!');
  });
}
