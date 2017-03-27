import dbHelper from './../helpers/dbHelper';

const DEFAULT_TEMPLATE_TEXT = 'Hello';
/**
 * Handles admin page loading
 * Replies page content to fill in page forms
 * The main admin page content is users list
 * and email template text
 *
 * @param {Object} reply - admin page content reply
 */
export default function (reply) {
  const adminPageContent = {};

  dbHelper.getAllUsers()
  .then((users) => {
    adminPageContent.usersList = users;
    return users;
  })
  .then(() => dbHelper.getMainText('1'))
  .then((text) => {
    if (text) {
      adminPageContent.templateText = text;
    } else {
      adminPageContent.templateText = DEFAULT_TEMPLATE_TEXT;
    }

    reply(JSON.stringify(adminPageContent));
  });
}
