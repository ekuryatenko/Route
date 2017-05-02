import dbHelper from './../helpers/dbHelper';

/**
 * Fires when admin has submitted new text template from admin page
 * Saves new template in db, and admin get prompt
 *
 * @param {Object} request
 * @param {Object} reply - Holds new template text
 */
export default function (request, reply) {
  if (request.payload) {
    const newAdminTemplate = request.payload;

    // Update database template text
    dbHelper.updateTemplate(newAdminTemplate)
      .then(
      () => {
        // Confirm user
        reply('TEMPLATE CHANGED!');
      },
      (err) => {
        // Confirm user
        reply(`TEMPLATE UPDATE ERROR:  + ${err}`);// TODO: to order all alerts messages
      });
  }
}
