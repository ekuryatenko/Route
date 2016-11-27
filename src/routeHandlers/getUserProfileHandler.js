import dbHelper from "./../helpers/dbHelper";

/**
 * Fires when user has loaded user profile page and asks
 * to get his own personal data to fill in page forms
 *
 * Result - user profile obj is sended to user
 *
 * @param {string} user_email - User login (email)
 */
export function getUserProfileHandler(reply, user_email) {
  if (user_email) {
    dbHelper.getUserProfile(user_email).then((profile) => {
      reply(JSON.stringify(profile));
    });
  }
}
