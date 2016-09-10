import dbHelper from "./../helpers/dbHelper";
import emailHelper from "./../helpers/emailHelper";

export function onSendToAll() {
  dbHelper.getMainText(null, "1", function(mainText){
    dbHelper.getAllUsers(null, function(usersArr){
      //Remove admin from arr
      var adminIdx = usersArr.findIndex((item)=>{
        return item.user_email == "admin";
      });
      usersArr.splice(adminIdx, 1);

      emailHelper.sendEmailsInCycle(usersArr, mainText);
    });
  });
}
