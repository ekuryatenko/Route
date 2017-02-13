"use strict";

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const PATTERN = /{{userName}}/g;

module.exports = function () {
  let self = this;
  return {
    sendEmail: sendEmail,
    sendEmail2: sendEmail2,

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
    sendEmailsInCycle: (sendOptions) => {
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
    },

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

function sendEmail2 (mailOptions, transporter) {
  return new Promise((resolve, reject) => {
    /**
     * Invalid login error - use captcha: https://github.com/nodemailer/nodemailer#using-gmail
     */
    console.log("---------EMAIL SENT");

    // send mail with defined transport object

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          // TODO: Arrange correct error logging to console
          reject(err);
        }
        try{
          resolve('Message sent: ' + info.response);
        }catch(e){
          reject(e);
        }
    })
  });
}


function* sendEmailsInCycle2(sendOptions) {

  let successfulEmail = 0;

  let users = sendOptions.users;
  let text = sendOptions.text;
  let emailsQty = users.length;

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODE_MAILER_SENDER_EMAIL,
      pass: process.env.NODE_MAILER_SENDER_PASS
    }
  }));

  console.log("SENDING!!!!!!!!!");

  for (var item of users) {
    text = text.replace(PATTERN, item.emailTemplate);

    // setup e-mail data with unicode symbols
    var mailContent = {
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

function sendEmail3 (mailOptions, transporter) {
    /**
     * Invalid login error - use captcha: https://github.com/nodemailer/nodemailer#using-gmail
     */
    console.log("---------EMAIL SENT");

    // send mail with defined transport object
    try{
     return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // TODO: Arrange correct error logging to console
          console.error('SENDING ERROR: ' + error);
        }
       console.log('Message sent: ' + info.response);
      })}
    catch(e){
      console.error('BIG SENDING ERROR: ' + e);
    }
}
