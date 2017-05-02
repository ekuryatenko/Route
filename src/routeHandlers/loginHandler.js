import dbHelper from './../helpers/dbHelper';

const USER_PROFILE_PAGE = 'userProfileForm.html';
const ADMIN_PAGE = 'adminProfileForm.html';
const LOG_IN_PAGE = 'logInForm.html';
const SIGN_IN_PAGE = 'signInForm.html';

/**
 * Finds user profile in base
 *
 * @param {String} userEmail - User submitted data
 * @param {String} userPassword - User submitted data
 * @return {Promise} returns Promise with result string
 */
function findUserInBase(userEmail, userPassword) {
  return new Promise((resolve) => {
    dbHelper.getAllUsers().then(
      (users) => {
        // "User has found" flag
        let found = false;

        if (users.length) {
          users.forEach((item) => {
            if (item.userEmail === userEmail) {
              found = true;

              if (item.password === userPassword) {
                if (userEmail.toLowerCase() !== 'admin') {
                  resolve('USER EXIST');
                } else {
                  resolve('USER IS ADMIN');
                }
              } else {
                resolve('USER EXIST BUT NOT VALID PASS');
              }
            }
          });

          if (!found) {
            resolve('NO USER FOUND');
          }
        }
      }
    );
  });
}

/**
 * Handles submit from logInForm page
 * Provides authorisation
 * Replies with array
 * which holds following activities for client side
 *
 * @param {Object} request
 * @param {Object} reply
 */
export default function (request, reply) {
  if (request.payload) {
    const loginInfo = request.payload;
    const userEmail = loginInfo.userEmail;
    const userPassword = loginInfo.fpass;
    // Will hold activities for client side when server reply is get
    const actionsForClient = [];

    findUserInBase(userEmail, userPassword)
    .then(
      (findRes) => {
        if (findRes === 'USER IS ADMIN') {
          actionsForClient.push({
            action: 'redirect',
            href: ADMIN_PAGE
          });
        } else if (findRes === 'USER EXIST') {
          actionsForClient.push({
            action: 'redirect',
            href: USER_PROFILE_PAGE
          });
        } else if (findRes === 'USER EXIST BUT NOT VALID PASS') {
          actionsForClient.push({
            action: 'alert',
            msg: 'INCORRECT PASSWORD INPUT'
          });
          actionsForClient.push({
            action: 'redirect',
            href: LOG_IN_PAGE
          });
        } else if (findRes === 'NO USER FOUND') {
          actionsForClient.push({
            action: 'alert',
            msg: 'SORRY, WE HAVEN\'T FOUND YOU. PLEASE SIGN UP'
          });
          actionsForClient.push({
            action: 'redirect',
            href: SIGN_IN_PAGE
          });
        }

        reply(JSON.stringify(actionsForClient));
      }
    );
  }
}
