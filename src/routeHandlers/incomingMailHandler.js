import sgHelper from "./../helpers/sendgridHelper";
import dbHelper from "./../helpers/dbHelper";

/**
 * Handle incoming POST request from SENDGRID service
 * This POST contains incoming email
 * Function parses sender, and checks if it's registered user
 * Sends reply email with user profile settings
 *
 * @param {Object} request
 * @param {Object} reply
 */
export function incomingMailHandler (request, reply) {
  reply ("OK!");

  // Parse addresses from incoming email
  const inEmailAddresses = sgHelper.getIncomingMailAddresses(request);

  dbHelper.getUserProfile(inEmailAddresses.incomingSender).then(
    profile => {
      sendReplyEmailToUser(inEmailAddresses, profile)
    },
    reject => {
      sendToNotRegistered(inEmailAddresses);
    });
}


function sendReplyEmailToUser(addresses, userProfile){
  // "1" is version of template to for all users
  dbHelper.getMainText("1").then(
    (mainResponseText) => {
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

