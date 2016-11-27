import dbHelper from "./../helpers/dbHelper";
const Path = require('path');

/**
 * !!!!!
 *
 * @param {Object} request
 * @param {Object} reply
 */
export function setUserProfileHandler(request, reply) {
  if (request.payload) {
    let modificatedProfile = request.payload;
    console.log(modificatedProfile);

    dbHelper.updateProfile(modificatedProfile)
      .then(
        onUpdate => {
          reply("YOUR PROFILE IS CHANGED");
      });
  }
}

