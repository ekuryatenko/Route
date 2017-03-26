import dbHelper from './../helpers/dbHelper';
// TODO: console.log
const DEFAULT_TEMPLATE_TEXT = 'Hello';

/**
 * Has been sent from admin page
 * Removes user profile from base
 * @param {Object} reply - Holds server reply
 * @param {string} userEmail - User email
 */
export default function (reply, userEmail) {
  const adminPageContent = {};

  dbHelper.removeFromDb(userEmail)
    .then(() => dbHelper.getAllUsers())
    .then((users) => {
      adminPageContent.usersList = users;
      return dbHelper.getMainText('1');
    })
    .then((text) => {
      if (text) {
        adminPageContent.templateText = text;
      } else {
        adminPageContent.templateText = DEFAULT_TEMPLATE_TEXT;
      }
      console.log(adminPageContent);
      reply(JSON.stringify(adminPageContent));
    });
}

