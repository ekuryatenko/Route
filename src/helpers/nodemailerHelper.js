import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

/** Part of text which should be replaced into user data */
const PATTERN = /{{userName}}/g;

export default (function () {
  return {
  /**
   * Sends email to single user
   *
   * @param {Object} mailContent - single user email data
   * @param {Object} transporter - nodemailer object
   * @return {Promise} returns Promise with result string
   */
    sendEmail(mailContent, transporter) {
      return new Promise((resolve, reject) => {
        /**
         * Invalid login error - use captcha:
         * https://nodemailer.com/usage/using-gmail/
         */

        // Send email with defined transport object
        transporter.sendMail(mailContent, (err, info) => {
          if (err) {
            reject(err);
          }

          try {
            resolve(`Message sent: ${info.response}`);
          } catch (unhandledErr) {
            reject(unhandledErr);
          }
        });
      });
    },

  /**
   * Sends emails to all receivers from db in cycle
   * Prepares unique email text for every user
   *
   * @param {Object} mailingContent - db Content: users and text
   * @return {String} returns - Sending statistics to resume result
   */
    sendEmailsInCycle: function* (mailingContent) {
      // Creates reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
          user: process.env.NODE_MAILER_SENDER_EMAIL,
          pass: process.env.NODE_MAILER_SENDER_PASS
        }
      }));

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
          from: process.env.NODE_MAILER_SENDER_EMAIL, // sender address
          to: item.userEmail,                        // list of receivers
          subject: mailingContent.subject,               // Subject line
          text: text,                                 // plaintext body
          html: ''                                    // html body
        };

        try {
          /**
           * Get ESLint Error with
           * yield sendEmail... when yeild was called from callback
           * https://github.com/babel/babel/issues/1271
           */
          yield this.sendEmail(mailContent, transporter);
          console.log('---------EMAIL SENT');
          successfulEmailsQty += 1;
        } catch (e) {
          console.error('---------SENDING ERROR: ', e);
        }
      }

      return (`IT WERE SENDED ${successfulEmailsQty} EMAILS OF ${emailsQty}`);
    }
  };
}());
