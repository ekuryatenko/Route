import dbHelper from "./../helpers/dbHelper";

/**
 * Fires when admin has submitted new text template from admin page
 *
 * Result - new template has saved in db, and admin get prompt
 *
 * @param {Object} newTemplateText - New template
 */
export function updateAdminTemplateHandler(request, reply) {
  if (request.payload) {
    let newAdminTemplate = request.payload;
    console.log(newAdminTemplate);

    // Update database template text
    dbHelper.updateTemplate(newAdminTemplate)
      .then(
      () => {
        // Confirm user
        reply("TEMPLATE CHANGED!");
      },
      err => {
        // Confirm user
        reply("TEMPLATE UPDATE ERROR: " + err);//TODO: to order all alerts messages
      });
  }
}
