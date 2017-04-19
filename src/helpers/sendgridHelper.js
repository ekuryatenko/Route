// Sendgrid module https://github.com/sendgrid/sendgrid-nodejs
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// Email sender address for  all broadcast sending emails - simple app email
const BROADCAST_SENDER = process.env.SENDGRID_SENDER_ADDR;
/** Part of text which should be replaced into user data */
const PATTERN = /{{userName}}/g;

/**
 * Object helps to handle emails
 * with SENDGRID service REST API
 */
export default (function () {
  return {
    /**
     * Parses addresses from current inbound email
     *
     * @param {Object} request - SENDGRID request with inbound email
     * @return {Object} addresses - email sender and receiver addresses
     */
    getIncomingMailAddresses(request) {
      const data = request.payload;

      const addresses = {
        incomingSender: data.from.split('<')[1].split('>')[0],
        incomingReciever: data.to
      };

      console.log(`SENDGRID GET MESSAGE`);
      console.log(`FROM: ${addresses.incomingSender} TO: ${addresses.incomingReciever}`);

      return addresses;
    },

    /**
     * Sends email due to SENDGRID REST API with
     * "from" and "to" addresses filled
     *
     * @param {Object} mailContent
     * @return {Promise} returns Promise with result string
     */
    sendEmail(mailContent) {
      return new Promise((resolve, reject) => {
        const helper = sg.mail;
        const fromEmail = new helper.Email(mailContent.from);
        const toEmail = new helper.Email(mailContent.to);
        const subject = mailContent.subject;
        const content = new helper.Content('text/plain', mailContent.text);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

        const sgRequest = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        // Sending
        sg.API(sgRequest, (error, response) => {
          console.log('emailHelper: ', mailContent.text);
          console.log(response.statusCode);
          console.log(response.body);
          // console.log(response.headers);
          if (error) {
            reject(error);
          }
          resolve(response.statusCode);
        });
      });
    },

    /**
     * Sends emails to all receivers of param arr in cycle
     * Prepares email text for every user
     * Carries sending statistics to resume result of
     * sending in param callback
     *
     * Haven't managed with promises in cycle here
     *
     * @param {Array} arr - Users profiles
     * @param {string} mainText - Main app reply text
     * @param {Function} callback - On whole sending cycle finish
     */
    sendEmailsInCycle: async function (mailingContent){
      const users = mailingContent.users;
      let successfulEmailsQty = 0;
      const emailsQty = users.length;
      console.log('START SENDING!');

      // Get problem with callback in forEach here
      for (let idx = 0; idx < users.length; idx += 1) {
        const item = users[idx];
        // Adopt text for this user
        let text = mailingContent.text;
        text = text.replace(PATTERN, item.emailTemplate);

        // Setup common email content
        const mailContent = {
          from: BROADCAST_SENDER,                     // sender address
          to: item.user_email,                        // list of receivers
          subject: mailingContent.subject,            // Subject line
          text: text,                                 // plaintext body
          html: ''                                    // html body
        };

        const status = await this.sendEmail(mailContent);

        if (parseInt(status) < 400) {
          successfulEmailsQty += 1;
        }
      }
      return (`IT WERE SENDED ${successfulEmailsQty} EMAILS OF ${emailsQty}`);
    }
  };
}());
