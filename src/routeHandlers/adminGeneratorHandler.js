// TODO: Is function defined before used every where
import Co from 'co';
import dbHelper from './../helpers/dbHelper';
import nodemailerHelper from './../helpers/nodemailerHelper';

/**
 * Checks admin password from POST
 * Gets admin profile from base and
 * interacts with admin due to password validation
 *
 * @param {Object} request
 * @param {Object} reply
 */
function checkAdmin(request, reply) {
  return new Promise((resolve, reject) => {
    if (request.payload) {
      const data = request.payload;
      if (data.password) {
        const pas = data.password;
        dbHelper.getAdminPas().then(
          (adminPas) => {
            if (pas === adminPas) {
              reply('HELLO ADMIN! I START SENDING EMAILS ...');

              resolve('ADMIN IS VALID! START SENDING EMAILS ...');
            } else {
              reply('ADMIN PASSWORD IS NOT VALID!');

              reject('GET WRONG ADMIN PASSWORD');
            }
          });
      } else {
        console.log('NO PASSSWORD IN ADMIN POST!');
        reply('REPLY: NO PASSSWORD IN ADMIN POST!');
        reject('REJECT: NO PASSSWORD IN ADMIN POST!');
      }
    } else {
      console.log('GET WRONG ADMIN POST!');
      reply('REPLY: GET WRONG ADMIN POST!');
      reject('REJECT: GET WRONG ADMIN POST!');
    }
  });
}

/**
 * Replies on admin's POST
 * Checks admin password
 * Sends email template to every user from base
 *
 * @param {Object} request
 * @param {Object} reply
 */
function* adminRequestHandler(request, reply) {
  const isCorrectPas = yield checkAdmin(request, reply);
  console.log(isCorrectPas);

  // Prepare template text
  const mainText = yield dbHelper.getMainText('1');
  const sendOptions = {};
  sendOptions.text = mainText;

  // Prepare users
  const users = yield dbHelper.getAllUsers();
  const adminIdx = users.findIndex(item => item.user_email === 'admin');
  users.splice(adminIdx, 1);
  sendOptions.users = users;

  // Start emails sending
  yield* Co(nodemailerHelper.sendEmailsInCycle(sendOptions)).then(
      emailSendingStat => console.log(`STATISTIC: ${emailSendingStat}`)
  );
}

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}

/**
 * ReferenceError: regeneratorRuntime is not defined
 * http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
 * https://github.com/babel/babelify/issues/28
 * https://www.npmjs.com/package/babel-plugin-transform-runtime
 */
export default function (request, reply) {
  Co(adminRequestHandler(request, reply)).catch(onerror);
}
