import dbHelper from "./../helpers/dbHelper";
/**
 * Fires when user has loaded user profile page and asks
 * to get his own personal data to fill in page forms
 *
 * Result - user profile obj is sended to user
 *
 * @param {string} ss_user_email - User login (email)
 */
export function onGetProfile(ss_user_email) {
  const socket = this;

  dbHelper.getUserProfile(null, ss_user_email, (profile) => {
    socket.emit('setProfile', profile);
  });
}

