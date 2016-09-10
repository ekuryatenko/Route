import emailHelper from "./../helpers/emailHelper";
import dbHelper from "./../helpers/dbHelper";

/**
 * @param request POST from CloudMailIn
 * @param reply
 * */
export function incomingMailHandler (request, reply) {
  reply ("OK!");

    const emailFrom = emailHelper.getIncomingMailSender(request);

    dbHelper.getAllUsers(null, function(usersArr){
      let found = false;
      let profile = {};

      if (usersArr.length) {
        for (var idx = 0; idx < usersArr.length; idx++) {
          if (usersArr[idx].user_email === emailFrom) {
            found = true;
            profile = usersArr[idx];
            break;
          }
        }
      }

      if(found){
        dbHelper.getMainText(null, "1", function(mainResponseText){
          let userTemplatePiece = profile.emailTemplate;

          //Modify main response text for current user
          mainResponseText = mainResponseText.replace (/{{userName}}/g, userTemplatePiece);

          emailHelper.sendResponseMail(emailFrom, mainResponseText);
        });
      }else{
        emailHelper.sendResponseMail(emailFrom, "YOU ARE NOT REGISTERED!");
      }
    });
}
