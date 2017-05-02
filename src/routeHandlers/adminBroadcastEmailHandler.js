import dbHelper from './../helpers/dbHelper';
import sgHelper from './../helpers/sendgridHelper';

/**
 * Sends email template to every user from base in cycle
 *
 * @param {Object} reply
 */
async function adminBroadcastEmailHandler(reply) {
  try {
    // Prepare template text
    const mainText = await dbHelper.getMainText('1');
    // Prepare users
    const users = await dbHelper.getAllUsers();
    const adminIdx = users.findIndex(item => item.userEmail === 'admin');

    if (adminIdx < 0) {
      reply('SERVER BASE ERROR');
      return;
    }

    users.splice(adminIdx, 1);

    const mailingContent = {};
    mailingContent.text = mainText;
    mailingContent.users = users;
    mailingContent.subject = `${process.env.APP_DOMAIN} APP: SENDGRID MAILING DUE TO ADMIN BUTTON`;

    // Start emails sending
    const emailSendingStat = await sgHelper.sendEmailsInCycle(mailingContent);
    console.log(`STATISTIC: ${emailSendingStat}`);
    reply(`STATISTIC: ${emailSendingStat}`);
  } catch (err) {
    console.log(err);
    reply('SERVER ERROR');
  }
}

/**
 * Replies on admins page button click
 * Sends email template to every user from base
 *
 * @param {Object} reply
 */
export default function (reply) {
  adminBroadcastEmailHandler(reply);
}
