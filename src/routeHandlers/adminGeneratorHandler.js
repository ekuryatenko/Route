import dbHelper         from "./../helpers/dbHelper";
import nodemailerHelper from "./../helpers/nodemailerHelper";
import Co               from "co";

/**
 * ReferenceError: regeneratorRuntime is not defined
 * http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
 * https://github.com/babel/babelify/issues/28
 * https://www.npmjs.com/package/babel-plugin-transform-runtime
 */
export function adminHandler(request, reply) {
  Co(run(request, reply)).catch(onerror);
}

/**
 * Replies on admin's POST
 * Checks admin password
 * Sends email template to every user from base
 *
 * @param {Object} request
 * @param {Object} reply
 */
function* run(request, reply) {
  let sendOptions = {};

  let correctPas = yield checkAdmin(request, reply);

  console.log(correctPas);

  let mainText = yield dbHelper.getMainText("1");

  sendOptions.text = mainText;

  let arr = yield dbHelper.getAllUsers();

  let adminIdx = arr.findIndex((item)=> {
      return item.user_email == "admin";
  });

  arr.splice(adminIdx, 1);

  let opts = {
    to      : "kuryatenko@ukr.net",   // list of receivers
    subject : "TEST",                 // Subject line
    text    : "",                     // plaintext body
    html    : ""                      // html body
  };

  return nodemailerHelper.sendEmail(opts);
}

/**
 * Checks admin password from POST
 * Gets admin profile from base and
 * interacts with admin due to password validation
 *
 * @param {Object} request
 * @param {Object} reply
 */
function checkAdmin(request, reply){
  if (request.payload) {
    let data = request.payload;

    if (data.password) {
      let pas = data.password;

      return new Promise((resolve, reject) => {
        dbHelper.getAdminPas().then(
          (adminPas) => {
            if (pas == adminPas) {
              reply("HELLO ADMIN! I START SENDING EMAILS ...");

              resolve("ADMIN IS VALID! START SENDING EMAILS ...");
            } else {
              reply("ADMIN PASSWORD IS NOT VALID!");

              reject("GET WRONG ADMIN PASSWORD");
            }
          });
      })

    } else {
      console.log("NO PASSSWORD IN ADMIN POST!");
      reply ("ADMIN IS NOT AUTHORIZED!");
    }

  } else {
    console.log("GET WRONG ADMIN POST!");
    reply ("ADMIN IS NOT AUTHORIZED!");
  }
}

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}
