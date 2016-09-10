import dbHelper from "./../helpers/dbHelper";
import emailHelper from "./../helpers/emailHelper";

export function adminHandler(request, reply) {
  checkAdmin(request, reply, function(){
    console.log("ADMIN PASS AUTHORIZATION SUCCESSFULLY!!");
  });

  dbHelper.getMainText(null, "1", function(mainText){
    dbHelper.getAllUsers(null, function(arr){
      //Remove admin from arr
      var adminIdx = arr.findIndex((item)=>{
        return item.user_email == "admin";
      });
      arr.splice(adminIdx, 1);

      emailHelper.sendEmailsInCycle(arr, mainText);
    })
  })

}

function checkAdmin(request, reply, callback){
  if (request.payload) {
    var data = request.payload;

    if (data.password) {
      var pas = data.password;

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
