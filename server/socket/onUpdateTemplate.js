import dbHelper from "./../helpers/dbHelper";

/**
 * Fires when admin has submitted new template from admin page
 *
 * Result - new template has saved in db, and admin get prompt
 *
 * @param {Object} newTemplate - New template
 */
export function onUpdateTemplate(newTemplate) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;

  // create a database variable
  dbHelper.updateTemplate(null, newTemplate, () =>{
    // Confirm user
    socket.emit ('alert', 'Template changed!');
  });
}
