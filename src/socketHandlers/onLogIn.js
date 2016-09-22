import dbHelper from "./../helpers/dbHelper";

// App pages to redirecting from login page
const USER_PROFILE_PAGE = "userProfileForm.html";
const ADMIN_PAGE = "adminProfileForm.html";
const SIGN_IN_PAGE = "signInForm.html";

/**
 * Fires when user has submitted data from login page form
 *
 * Result - user is been moving to user profile page
 *
 * @param {Object} login_info - User login data
 */
export function onLogIn(login_info) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;

  const this_user_email = login_info.user_email,
    this_user_password = login_info.fpass;

  // Login data validation
  if (this_user_email === "" || this_user_password === "") {
    socket.emit("alert", "You must fill in both fields");
  } else {
    dbHelper.getAllUsers().then(
        users => {
          // "User has found" flag
          let found = false;

          if (users.length) {
            users.forEach(user => {
              if (user.user_email === this_user_email) {
                found = true;

                if (user.password === this_user_password) {
                  socket.emit ("clean-form");

                  if (this_user_email.toLowerCase() != "admin") {
                    socket.emit ("redirect", USER_PROFILE_PAGE);
                  }else{
                    socket.emit ("redirect", ADMIN_PAGE);
                  }

                } else {
                  socket.emit("alert", "Please retry password input");
                }

                return 0;
              }
            });

            if (!found) {
              socket.emit("clean-form");
              socket.emit("alert", "Sorry, we could not find you. Please sign up.");
              socket.emit("redirect", SIGN_IN_PAGE);
            }
          }
    });
  }
}
