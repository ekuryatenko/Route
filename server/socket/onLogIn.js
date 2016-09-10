const USER_PROFILE_PAGE = 'userProfileForm.html';
const ADMIN_PAGE = 'adminProfileForm.html';
/**
 */
export function onLogIn(login_info) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;
  const db = socket.db;

  var this_user_email = login_info.user_email,
    this_user_password = login_info.fpass;

  if (this_user_email === '' || this_user_password === '') {
    socket.emit('alert', 'You must fill in both fields');
  } else {
    var users = db.collection('users');
    users
      .find()
      .toArray(function (err, res) {
      if (err) throw err;

      var found = false;

      if (res.length) {
        for (var idx = 0; idx < res.length; idx++) {
          if (res[idx].user_email === this_user_email) {
            found = true;

            if (res[idx].password === this_user_password) {
              socket.emit ('clean-form');

              if (this_user_email.toUpperCase() != "ADMIN") {
                socket.emit ('redirect', USER_PROFILE_PAGE);
              }else{
                socket.emit ('redirect', ADMIN_PAGE);
              }

            } else {
              socket.emit('alert', 'Please retry password');
            }
            break;
          }
        }

        if (!found) {
          socket.emit('clean-form');
          socket.emit('alert', 'Sorry, we could not find you. Please sign up.');
          socket.emit('redirect', 'signInForm.html');
        }
      }
    });
  }
}
