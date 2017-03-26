import dbHelper from './../helpers/dbHelper';

const DEFAULT_TEMPLATE_TEXT = 'Hello';
/**
 * Is get when admin page has loaded and user asks
 * to get page content to fill in page forms
 * The main admin content is users list and email template
 * text
 *
 * Result - Admin page content obj is sended to user
 */
export function getAdminPageHandler(reply) {
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
