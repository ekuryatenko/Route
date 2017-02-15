"use strict";

const nodemailer    = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const PATTERN       = /{{userName}}/g;

module.exports = function () {
  return {
    sendEmail          : sendEmail,
    sendEmailsInCycle  : sendEmailsInCycle
  }
}();

/**
 * Sends email to single user
 *
 * @param {Object} mailContent - single user email data
 * @param {Object} transporter - nodemailer object
 * @return {Promise} returns Promise with result string
 */
function sendEmail (mailContent, transporter) {
  return new Promise((resolve, reject) => {
    /**
     * Invalid login error - use captcha: https://github.com/nodemailer/nodemailer#using-gmail
     */

    // Send email with defined transport object
    transporter.sendMail(mailContent, (err, info) => {
      if (err) {
        reject(err);
      }

      try{
        resolve('Message sent: ' + info.response);
      }catch(unHandledErr){
        reject(unHandledErr);
      }
    })
  });
}

/**
 * Sends emails to all receivers from db in cycle
 * Prepares unique email text for every user
 * Carries sending statistics to resume result of
 * sending in param callback
 *
 * @param {Object} dbData - db Content: users and text
 */
function* sendEmailsInCycle(dbData) {
  let successfulEmail = 0;

  let users     = dbData.users;
  let text      = dbData.text;
  let emailsQty = users.length;

  // Creates reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODE_MAILER_SENDER_EMAIL,
      pass: process.env.NODE_MAILER_SENDER_PASS
    }
  }));

  console.log("SENDING!");

  for (let item of users) {
    text = text.replace(PATTERN, item.emailTemplate);

    // setup common email content
    let mailContent = {
      from    : process.env.NODE_MAILER_SENDER_EMAIL, // sender address
      to      : item.user_email,                      // list of receivers
      subject : "ROUTE EMAIL",                        // Subject line
      text    : text,                                 // plaintext body
      html    : ""                                    // html body
    };

    try {
      yield sendEmail(mailContent, transporter);
      console.log("---------EMAIL SENT");
      successfulEmail++;
    }catch(e){
      console.error('---------SENDING ERROR: ', e);
    }
  }

  return("IT WERE SENDED " + successfulEmail + " EMAILS OF " + emailsQty);
}
