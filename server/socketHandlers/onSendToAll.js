import dbHelper from "./../helpers/dbHelper";
import emailHelper from "./../helpers/sendgridHelper";

/**
 * Fires when admin click "Send to all users" button
 *
 * Result - user is been moving to user profile page
 */
export function onSendToAll() {
  dbHelper.getMainText(null, "1", mainText => {
    dbHelper.getAllUsers(null, usersArr => {
      //Remove admin from arr
      let adminIdx = usersArr.findIndex((item)=>{
        return item.user_email == "admin";
      });
      usersArr.splice(adminIdx, 1);

      emailHelper.sendEmailsInCycle(usersArr, mainText);
    });
  });
}
