"use strict";

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const PATTERN = /{{userName}}/g;

module.exports = function () {
  return {
    sendEmail2        : sendEmail2,
    sendEmailsInCycle2:sendEmailsInCycle2
  }
}();

function sendEmail (emailOptions) {
  return new Promise((resolve, reject) => {
    /**
     * Invalid login error - use captcha: https://github.com/nodemailer/nodemailer#using-gmail
     */

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODE_MAILER_SENDER_EMAIL,
        pass: process.env.NODE_MAILER_SENDER_PASS
      }
    }));

    console.log("---------EMAIL SENT");

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: process.env.NODE_MAILER_SENDER_EMAIL, // sender address
      to: emailOptions.to,                      // list of receivers
      subject: emailOptions.subject,                 // Subject line
      text: emailOptions.text,                    // plaintext body
      html: emailOptions.html                     // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // TODO: Arrange correct error logging to console
        reject('SENDING ERROR: ' + error);
      }
      resolve('Message sent: ' + info.response);
    });
  });
}

function sendEmail2 (mailContent, transporter) {
  return new Promise((resolve, reject) => {
    /**
     * Invalid login error - use captcha: https://github.com/nodemailer/nodemailer#using-gmail
     */
    console.log("---------EMAIL SENT");

    // send mail with defined transport object
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

function sendEmailsInCycle (sendOptions) => {
  return new Promise((resolve, reject) => {
    let emailsCnt = 0;
    let successfulEmail = 0;

    let users = sendOptions.users;
    let text = sendOptions.text;

    for (var item of users) {
      text = text.replace(PATTERN, item.emailTemplate);

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from    : process.env.NODE_MAILER_SENDER_EMAIL, // sender address
        to      : item.user_email,                        // list of receivers
        subject : "ROUTE EMAIL",                     // Subject line
        text    : text,                                 // plaintext body
        html    : ""                                    // html body
      };

      emailsCnt++;

      try {
        console.log("SENDING!!!!!!!!!");
        this.sendEmail2(mailOptions).then(
          (success)=> {
            successfulEmail++;

            if (emailsCnt == users.length) {
              let alert = "IT WERE SENDED " + successfulEmail + " EMAILS OF " + emailsCnt;
              console.log(alert);
              resolve(alert);
            }
          },
          (fail) => {
            console.error(fail);
            let alert = "IT WERE SENDED " + successfulEmail + " EMAILS OF " + emailsCnt;
            reject(e + ": " + alert);
          }
        );
      }catch(e){
        let alert = "IT WERE SENDED " + successfulEmail + " EMAILS OF " + emailsCnt;
        reject(e + ": " + alert);
      }
    }
  });
}

/**
 * Sends emails to all receivers of param arr in cycle
 * Prepares unique email text for every user
 * Carries sending statistics to resume result of
 * sending in param callback
 *
 * @param {Object} dbData - db Content: users and text
 */
function* sendEmailsInCycle2(dbData) {
  let successfulEmail = 0;

  let users     = dbData.users;
  let text      = dbData.text;
  let emailsQty = users.length;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODE_MAILER_SENDER_EMAIL,
      pass: process.env.NODE_MAILER_SENDER_PASS
    }
  }));

  console.log("SENDING!!!!!!!!!");

  for (let item of users) {
    text = text.replace(PATTERN, item.emailTemplate);

    // setup email content
    let mailContent = {
      from    : process.env.NODE_MAILER_SENDER_EMAIL, // sender address
      to      : item.user_email,                      // list of receivers
      subject : "ROUTE EMAIL",                        // Subject line
      text    : text,                                 // plaintext body
      html    : ""                                    // html body
    };

    try {
      yield sendEmail2(mailContent, transporter);

      successfulEmail++;
    }catch(e){
      console.error('SENDING ERROR: ', e);
    }
  }

  console.log("IT WERE SENDED " + successfulEmail + " EMAILS OF " + emailsQty);
}