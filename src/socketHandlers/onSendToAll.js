import dbHelper from "./../helpers/dbHelper";
import emailHelper from "./../helpers/sendgridHelper";

/**
 * Fires when admin click "Send to all users" button
 *
 * Result - ser is been moving to user profile page
 */
export function onSendToAll() {
  const socket = this;

  let send = {};

  dbHelper.getMainText("1")
    .then( mainText => {
      send.text = mainText;

      return dbHelper.getAllUsers();
    })
    .then(
      usersArr => {
        //Remove admin from arr
        let adminIdx = usersArr.findIndex((item)=>{
          return item.user_email == "admin";
        });

        usersArr.splice(adminIdx, 1);

        emailHelper.sendEmailsInCycle(usersArr, send.text, (result) => {
          socket.emit("alert", result);
        });
    })
}
