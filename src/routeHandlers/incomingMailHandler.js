import sgHelper from './../helpers/sendgridHelper';
import dbHelper from './../helpers/dbHelper';

const PATTERN = /{{userName}}/g;

/**
 * Sends email through sendgrid API if this sender is registered
 * Puts user profile data into mail
 *
 * @param {Object} addresses - Parsed incoming mail addresses
 * @param {Object} userProfile - Registered user profile data
 */
async function sendReplyEmailToUser(addresses, userProfile) {
  const replyMailContent = {};
  // Modify main response text for current user profile
  // '1' is version of template to for all users
  const dbResponseText = await dbHelper.getMainText('1');
  const userTemplatePiece = userProfile.emailTemplate;
  replyMailContent.text = dbResponseText.replace(PATTERN, userTemplatePiece);

  replyMailContent.from = addresses.incomingReciever;
  replyMailContent.to = addresses.incomingSender;
  replyMailContent.subject = `${process.env.APP_DOMAIN} APP: ON YOUR MAIL SENDGRID REPLY`;

  try{
    await sgHelper.sendEmail(replyMailContent);
  } catch (err) {
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
  }
}

/**
 * Sends email through sendgrid API to unregistered sender
 *
 * @param {Object} addresses - Parsed incoming mail addresses
 */
async function sendToNotRegistered(addresses) {
  const replyMailContent = {};
  // Modify main response text for current user profile
  replyMailContent.text = 'YOU ARE NOT REGISTERED!';
  replyMailContent.from = addresses.incomingReciever;
  replyMailContent.to = addresses.incomingSender;
  replyMailContent.subject = `${process.env.APP_DOMAIN} APP: ON YOUR MAIL SENDGRID REPLY`;

  try{
    await sgHelper.sendEmail(replyMailContent);
  } catch (err) {
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
  }
}

/**
 * Handle incoming POST request from SENDGRID service
 * This POST contains incoming email to app domain mails subdomain
 * Function parses sender, and checks if it's registered user
 * Sends reply email with user profile settings
 *
 * @param {Object} request
 * @param {Object} reply
 */
export default async function (request, reply) {
  reply('OK!');

  // Parse addresses from incoming email
  const parsedAddresses = sgHelper.getIncomingMailAddresses(request);

  try {
    const profile = await dbHelper.getUserProfile(parsedAddresses.incomingSender);
    if (profile) {
      sendReplyEmailToUser(parsedAddresses, profile);
    } else {
      sendToNotRegistered(parsedAddresses);
    }
  } catch (err) {
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
  }
}
