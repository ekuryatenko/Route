import dbHelper from "./../helpers/dbHelper";

/**
 * !!!!!!!!!
 *
 * @param {string} user_email - User email
 */
export function removeUserProfileHandler(reply, user_email) {
  let adminPageContent = {};

  dbHelper.removeFromDb(user_email).
    then((onDelete) => {
      return dbHelper.getAllUsers();
    })
    .then((users) => {
      adminPageContent.usersList = users;

      return dbHelper.getMainText("1");
    })
    .then((text) =>{
      if(text){
        adminPageContent.templateText = text;
      }else{
        adminPageContent.templateText = DEFAULT_TEMPLATE_TEXT;
      }
      console.log(adminPageContent);
      reply(JSON.stringify(adminPageContent));
    });
}

