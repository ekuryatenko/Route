import dbHelper from './../helpers/dbHelper';

const USER_PROFILE_PAGE = 'userProfileForm.html';

/**
 * Finds user profile in base
 *
 * @param {String} userEmail
 * @param {String} userPassword
 * @return {Promise} returns Promise with result string
 */
function findUserInBase(userEmail, userPassword) {
  return new Promise((resolve) => {
    dbHelper.getAllUsers().then(
      (users) => {
        // 'User has found' flag
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
      });
  });
}

/**
 * Adds new user profile to base
 *
 * @param {String} userEmail
 * @param {String} userPassword
 * @return {Promise} returns Promise with result string
 */
function addUserToBase(userEmail, userPassword) {
  const profile = {
    userEmail: userEmail,
    password: userPassword,
    emailTemplate: (userEmail.indexOf('@') > -1) ? userEmail.substr(0, userEmail.indexOf('@')) : userEmail
  };

  return dbHelper.addUserToBase(profile);
}

/**
 * Handles submit from signIn page
 * Provides new user registration
 * After registration replies with array
 * which holds following activities for client side
 *
 * @param {Object} request
 * @param {Object} reply
 */
export default function (request, reply) {
  if (request.payload) {
    const signInInfo = request.payload;

    const thisUserEmail = signInInfo.userEmail;
    const thisUserPassword = signInInfo.fpass;

    // Will hold activities for client side when server reply is get
    const actionsForClient = [];

    findUserInBase(thisUserEmail, thisUserPassword)
      .then(
      (findRes) => {
        if (findRes === 'USER IS ADMIN') {
          actionsForClient.push({
            action: 'alert',
            msg: 'ADMIN PROFILE IS REFUSED'
          });
        } else if (findRes === 'USER EXIST') {
          actionsForClient.push({
            action: 'alert',
            msg: 'USERNAME ALREADY EXISTS. PLEASE USE ANOTHER ONE.'
          });
        } else if (findRes === 'USER EXIST BUT NOT VALID PASS') {
          actionsForClient.push({
            action: 'alert',
            msg: 'USERNAME ALREADY EXISTS. PLEASE USE ANOTHER ONE.'
          });
        } else if (findRes === 'NO USER FOUND') {
          return addUserToBase(thisUserEmail, thisUserPassword)
            .then(
            () => {
              actionsForClient.push({
                action: 'alert',
                msg: 'YOUR ACCOUNT HAS BEEN CREATED.'
              });
              actionsForClient.push({
                action: 'redirect',
                href: USER_PROFILE_PAGE
              });
            }
          );
        }
        return 0;
      })
      .then(
      () => {
        reply(JSON.stringify(actionsForClient));
      });
  }
}
