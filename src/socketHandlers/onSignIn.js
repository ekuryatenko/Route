import dbHelper from "./../helpers/dbHelper";
const USER_PROFILE_PAGE = 'userProfileForm.html';

/**
 * Fires when new user has submitted data from signIn page
 *
 * Result - user profile data has saved, and user get profile page
 *
 * @param {Object} newProfile - New user signIn profile
 */
export function onSignIn(newProfile) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;

  let user_email = newProfile.user_email,
    fpass = newProfile.fpass,
    cpass = newProfile.cpass;

  // Check for empty fields
  if (user_email === '' || cpass === '' || fpass === '') {
    socket.emit('alert', 'Whoops, you missed one!');
    return;
  }

  // Check for matching passwords
  if (fpass !== cpass) {
    socket.emit('alert', 'Your passwords don\'t match.');
    return;
  }

  dbHelper.getAllUsers().then(
    (dbArr) =>{
      let found = doesUserExist(newProfile.user_email, dbArr);

      if (found !== "exists") {
        // if not found, push the user profile into the db
        let profile = {
          user_email: user_email,
          password: cpass,
          emailTemplate: (user_email.indexOf("@") > -1) ? user_email.substr(0, user_email.indexOf("@")) : user_email
        };

        socket.profile = profile;

        dbHelper.addUserToBase(profile).then(() => {
          socket.emit('alert', 'Your account has been created');
          socket.emit('clean-form');
          socket.emit('redirect', USER_PROFILE_PAGE);
          return found;
        });
      } else {
        socket.emit('clean-form');
        socket.emit('alert', 'Username already exists. Please use another one.');
      }
  });
}

const doesUserExist = function (newUser, arr) {
  if (arr.length) {
    for (var i = 0; i < arr.length; i++) {

      var answer;

      if (newUser === arr[i].user_email) {
        answer = "exists";
        break;
      } else {
        answer = "does not exist";
      }
    }
    return answer;
  } else {
    return answer = "does not exist";
  }
};
