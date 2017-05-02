import dbHelper from './../helpers/dbHelper';

/**
 * Handles data request from userProfileForm page
 * Replies with user personal data to fill in
 * forms on page loading
 *
 * @param {Object} reply - user profile data reply
 * @param {string} userEmail - User login (email)
 */
export default function (reply, userEmail) {
  if (userEmail) {
    dbHelper.getUserProfile(userEmail).then((profile) => {
      reply(JSON.stringify(profile));
    });
  }
}
