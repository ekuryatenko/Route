import dbHelper from "./../helpers/dbHelper";
const Path = require('path');

const USER_PROFILE_PAGE = "userProfileForm.html";
const ADMIN_PAGE = "adminProfileForm.html";
const LOG_IN_PAGE = "logInForm.html";
const SIGN_IN_PAGE = "signInForm.html";

/**
 * !!!!!
 *
 * @param {Object} request
 * @param {Object} reply
 */
export function loginHandler(request, reply) {
  if (request.payload) {
    let login_info = request.payload;


    const this_user_email = login_info.user_email,
      this_user_password = login_info.fpass;

    var actionsForClient = [];

    findUserInBase(this_user_email, this_user_password)
      .then(
        findRes => {
          if (findRes == "USER IS ADMIN") {
            actionsForClient.push({
              action: "redirect",
              href: ADMIN_PAGE
            });
          } else if (findRes == "USER EXIST") {
            actionsForClient.push({
              action: "redirect",
              href: USER_PROFILE_PAGE
            });
          } else if (findRes == "USER EXIST BUT NOT VALID PASS") {
            //1
            actionsForClient.push({
              action: "alert",
              msg: "INCORRECT PASSWORD INPUT"
            });

            //2
            actionsForClient.push({
              action: "redirect",
              href: LOG_IN_PAGE
            });
          } else if (findRes == "NO USER FOUND") {
            //1
            actionsForClient.push({
              action: "alert",
              msg: "SORRY, WE HAVEN'T FOUND YOU. PLEASE SIGN UP"
            });

            //2
            actionsForClient.push({
              action: "redirect",
              href: SIGN_IN_PAGE
            });
          }
          console.log(actionsForClient);
          reply(JSON.stringify(actionsForClient));
        }
    )
  }
}

function findUserInBase(this_user_email, this_user_password){
  return dbHelper.getAllUsers().then(
      users => {
        return new Promise(function(resolve, reject) {
          // "User has found" flag
          let found = false;

          if (users.length) {
            users.forEach(user => {
              if (user.user_email === this_user_email) {
                found = true;

                if (user.password === this_user_password) {
                  if (this_user_email.toLowerCase() != "admin") {
                    resolve("USER EXIST");
                  }else{
                    resolve("USER IS ADMIN");
                  }
                } else {
                  resolve("USER EXIST BUT NOT VALID PASS");
                }
              }
            });

            if (!found) {
              resolve("NO USER FOUND");
            }
          }
    });
  })
}
