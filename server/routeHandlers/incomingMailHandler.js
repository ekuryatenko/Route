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
  const inEmailAddr = cminHelper.getIncomingMailAdresses(request);

  isDbContainUser(
    null,
    inEmailAddr.incomingSender,
    (found, userProfile)=>{
      if(found){
        sendReplyEmailToUser(inEmailAddr, userProfile);
      }else{
        sendToNotRegistered(inEmailAddr);
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
      // Some profile param should be here for upper level function
      callback(found, profile);
    }
  });
}

function sendReplyEmailToUser(addresses, userProfile){
  // "1" is version of template to for all users
  dbHelper.getMainText(null, "1", (mainResponseText) => {
    let userTemplatePiece = userProfile.emailTemplate;

    //Modify main response text for current user profile
    mainResponseText = mainResponseText.replace (/{{userName}}/g, userTemplatePiece);

    let from = addresses.incomingReciever,
      to = addresses.incomingSender;

    sgHelper.sendResponseMail(from, to, mainResponseText);
  });
}

function sendToNotRegistered(addresses){
  let from = addresses.incomingReciever,
    to = addresses.incomingSender;

  sgHelper.sendResponseMail(from, to, "YOU ARE NOT REGISTERED!");
}

