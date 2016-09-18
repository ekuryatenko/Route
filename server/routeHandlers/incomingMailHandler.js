import cminHelper from "./../helpers/cloudmailinHelper";
import sgHelper from "./../helpers/sendgridHelper";
import dbHelper from "./../helpers/dbHelper";

/**
 * Handle incoming POST request from CLOUDMAILIN service
 * This POST contains incoming email
 * Function parses sender, and checks if it's registered user
 * Send reply email with user profile settings
 *
 * @param {Object} request
 * @param {Object} reply
 */
export function incomingMailHandler (request, reply) {
  reply ("OK!");

  // Parse request from CLOUDMAILIN service
  const emailFrom = cminHelper.getIncomingMailSender(request);

  isDbContainUser(
    null,
    emailFrom,
    (found, userProfile)=>{
      if(found){
        sendReplyEmailToUser(emailFrom, userProfile);
      }else{
        sendToNotRegistered(emailFrom);
      }
  });
}

function isDbContainUser(err, incomingMailSender, callback){
  dbHelper.getAllUsers(null, (usersArr) =>{
    let found = false;
    let profile = {};

    if (usersArr.length) {
      for (var idx = 0; idx < usersArr.length; idx++) {
        if (usersArr[idx].user_email === incomingMailSender) {
          found = true;
          profile = usersArr[idx];
          if(callback){
            callback(found, profile);
          }
          break;
        }
      }
    }

    if(!found && callback){
      callback(found, profile);
    }
  });
}

function sendReplyEmailToUser(emailFrom, userProfile){
  // "1" is version of template to for all users
  dbHelper.getMainText(null, "1", (mainResponseText) => {
    let userTemplatePiece = userProfile.emailTemplate;

    //Modify main response text for current user profile
    mainResponseText = mainResponseText.replace (/{{userName}}/g, userTemplatePiece);

    sgHelper.sendResponseMail(emailFrom, mainResponseText);
  });
}

function sendToNotRegistered(emailFrom){
  sgHelper.sendResponseMail(emailFrom, "YOU ARE NOT REGISTERED!");
}

