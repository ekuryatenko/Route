"use strict";

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function () {
  return {
    sendEmail: function (emailOptions) {
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

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from    : process.env.NODE_MAILER_SENDER_EMAIL, // sender address
        to      : emailOptions.to,                      // list of receivers
        subject : emailOptions.subject,                 // Subject line
        text    : emailOptions.text,                    // plaintext body
        html    : emailOptions.html                     // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return console.log('SENDING ERROR: ', error);
        }
        console.log('Message sent: ' + info.response);
      });
    }
  }
}();


