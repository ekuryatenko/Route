import dbHelper from "./../helpers/dbHelper";
import sgHelper from "./../helpers/sendgridHelper";

/**
 * Replies on admin's POST
 * Checks admin password
 * Sends email template to every user from base
 *
 * @param {Object} request
 * @param {Object} reply
 */
export function adminHandler(request, reply) {
  let sendOptions = {};

  checkAdmin(request, reply)
  .then(
    onCorrectPas => {
      console.log(onCorrectPas);
      return dbHelper.getMainText("1");
    },

    onWrongPass => {
      console.log(onWrongPass);
    }
  ).then(
    (mainText) => {
      sendOptions.text = mainText;

      return dbHelper.getAllUsers();
    }
  ).then(
    (arr)=> {
      //Remove admin from arr
      let adminIdx = arr.findIndex((item)=> {
        return item.user_email == "admin";
      });
      arr.splice(adminIdx, 1);

      sgHelper.sendEmailsInCycle(arr, sendOptions.text);
    }
  );

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
