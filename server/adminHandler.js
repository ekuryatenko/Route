import dbHelper from "./dbHelper";
import emailHelper from "./emailHelper";

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

      sendEmailsInCycle(arr, mainText);
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

function sendEmailsInCycle(arr, mainText){
  let emailsCnt = 0;

  setTimeout(function(){
    console.log("IT WERE SENDED " + emailsCnt + " EMAILS OF " + arr.length);
  }, arr.length * 2000);

  for(var item of arr){
    var text = mainText;
    text = text.replace(/{{userName}}/g, item.emailTemplate);

    emailHelper.sendResponseMail(item.user_email, text, function(status){
      if(parseInt(status) < 400) {
        emailsCnt++;
      }
    });
  }
}
