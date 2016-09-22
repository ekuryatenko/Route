import dbHelper from "./../helpers/dbHelper";

// Email template
const DEFAULT_TEMPLATE_TEXT = "Hello, {{userName}}!";

/**
 * Fires when admin has loaded admin page and asks
 * to get content to fill in page forms
 * The main admin content is users list and email template
 * text
 *
 * Result - Admin page content obj is sended to admin socket
 *
 * @param {string} ss_user_email - User login (email)
 */
export function onGetAdmin(ss_user_email) {
  const socket = this;

  let adminPageContent = {};

  dbHelper.getAllUsers()
    .then((users) => {
        adminPageContent.usersList = users;
        return users;
    })
    .then((users) => {
      return dbHelper.getMainText("1");
    })
    .then((text) =>{
        if(text){
          adminPageContent.templateText = text;
        }else{
          adminPageContent.templateText = DEFAULT_TEMPLATE_TEXT;
        }

        socket.emit('setAdmin', adminPageContent);
    });
}
