// TODO: Is function defined before used every where
import Co from 'co';
import dbHelper from './../helpers/dbHelper';
import nodemailerHelper from './../helpers/nodemailerHelper';
import stream from 'stream';

/**
 * Checks admin password from POST
 * Gets admin profile from base and
 * interacts with admin due to password validation
 *
 * @param {Object} request
 * @param {Object} reply
 */
function checkAdmin(request) {
  return new Promise((resolve, reject) => {
    if (request.payload) {
      const data = request.payload;
      if (data.password) {
        const pas = data.password;
        dbHelper.getAdminPas().then(
          (adminPas) => {
            if (pas === adminPas) {
              resolve('ADMIN IS VALID! START SENDING EMAILS ...');
            } else {
              reject('GET WRONG ADMIN PASSWORD');
            }
          });
      } else {
        console.log('NO PASSSWORD IN ADMIN POST!');
        reject('REJECT: NO PASSSWORD IN ADMIN POST!');
      }
    } else {
      console.log('GET WRONG ADMIN POST!');
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
  const outputStream = stream.Readable();
  outputStream._read = function (size) {};

  try {
    const isCorrectPas = yield checkAdmin(request);
    console.log(isCorrectPas);
    outputStream.push(`${isCorrectPas}
    `);

    // Prepare template text
    const mainText = yield dbHelper.getMainText('1');
    // Prepare users
    const users = yield dbHelper.getAllUsers();
    const adminIdx = users.findIndex(item => item.user_email === 'admin');
    users.splice(adminIdx, 1);

    const mailingContent = {};
    mailingContent.text = mainText;
    mailingContent.users = users;
    mailingContent.subject = `${process.env.APP_DOMAIN} APP: NODEMAILER MAILING DUE TO ADMIN PATH`;

    // Start emails sending
    yield* Co(nodemailerHelper.sendEmailsInCycle(mailingContent))
      .then(
      (emailSendingStat) => {
        console.log(`STATISTIC: ${emailSendingStat}`);
        outputStream.push(`STATISTIC: ${emailSendingStat}
        `);
        outputStream.push(null);
      }
    );
    reply(outputStream);
  } catch (err) {
    console.log(err);
    outputStream.push(err);
    outputStream.push(null);
    reply(outputStream);
  }
}

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}

/**
 * Replies on admins path request
 * If request passes password test sends
 * emails to all users in cycle.
 * Provides diagnostic stream to admin in reply
 *
 * ReferenceError: regeneratorRuntime is not defined
 * http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
 * https://github.com/babel/babelify/issues/28
 * https://www.npmjs.com/package/babel-runtime
 *
 * @param {Object} request
 * @param {Object} reply
 */
export default function (request, reply) {
  Co(adminRequestHandler(request, reply)).catch(onerror);
}
