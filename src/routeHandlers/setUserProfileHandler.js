import dbHelper from './../helpers/dbHelper';

/**
 * Handles /setUserProfile from userProfileForm page
 * Updates user profile by new data from request
 * After that sends reply with result string
 *
 * @param {Object} request
 * @param {Object} reply
 */
export default function (request, reply) {
  if (request.payload) {
    const modificatedProfile = request.payload;

    dbHelper.updateProfile(modificatedProfile)
      .then(
      () => {
        reply('YOUR PROFILE IS CHANGED');
      });
  }
}

