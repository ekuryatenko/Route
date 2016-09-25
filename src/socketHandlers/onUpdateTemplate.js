import dbHelper from "./../helpers/dbHelper";

/**
 * Fires when admin has submitted new text template from admin page
 *
 * Result - new template has saved in db, and admin get prompt
 *
 * @param {Object} newTemplateText - New template
 */
export function onUpdateTemplate(newTemplateText) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;

  // create a database variable
  dbHelper.updateTemplate(newTemplateText).then(
    () =>{
      // Confirm user
      socket.emit ('alert', 'Template changed!');
  });
}
