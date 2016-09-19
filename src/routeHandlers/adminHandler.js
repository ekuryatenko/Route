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
  checkAdmin(request, reply, function(){
    console.log("ADMIN PASS AUTHORIZATION SUCCESSFULLY!!");
  });

  dbHelper.getMainText(null, "1", function(mainText){
    dbHelper.getAllUsers(null, function(arr){
      //Remove admin from arr
      let adminIdx = arr.findIndex((item)=>{
        return item.user_email == "admin";
      });
      arr.splice(adminIdx, 1);

      sgHelper.sendEmailsInCycle(arr, mainText);
    })
  })

}

/**
 * Checks admin password from POST
 * Gets admin profile from base and
 * interacts with admin due to password validation
 *
 * @param {Object} request
 * @param {Object} reply
 * @param {Function} callback
 */
function checkAdmin(request, reply, callback){
  if (request.payload) {
    let data = request.payload;

    if (data.password) {
      let pas = data.password;

      dbHelper.getAdminPas(null, function(adminPas){
        if (pas == adminPas) {
          console.log("GET ADMIN! PAS: " + pas);
          reply ("HELLO ADMIN!");

          if(callback){
            callback();
          }
        } else {
          console.log("GET WRONG ADMIN PASSWORD");
          reply ("ADMIN PASSWORD IS NOT VALID!");
        }
      });

    } else {
      console.log("NO PASSSWORD IN ADMIN POST!");
      reply ("ADMIN IS NOT AUTHORIZED!");
    }

  } else {
    console.log("GET WRONG ADMIN POST!");
    reply ("ADMIN IS NOT AUTHORIZED!");
  }
}
