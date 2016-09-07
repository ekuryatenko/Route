//Sendgrid settings
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const MY_APP_EMAIL = process.env.CLOUDMAILIN_EMAIL;
const MY_APP_EMAILS_SUBJECT = 'EMAIL_APP RESPONSE';

export default (function(){
  return {
    sendResponseMail(adress, text, callback){
      var helper = sg.mail;
      var from_email = new helper.Email(MY_APP_EMAIL);
      var to_email = new helper.Email(adress);
      var subject = MY_APP_EMAILS_SUBJECT;
      var content = new helper.Content('text/plain', text);
      var mail = new helper.Mail(from_email, subject, to_email, content);

      var sgRequest = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(sgRequest, function(error, response) {
        console.log ("emailHelper: " + text);
        console.log (response.statusCode);
        console.log (response.body);
        console.log (response.headers);

        if (callback) {
          callback (response.statusCode);
        }
      });
    },

    getIncomingMailSender (request){
      var data = request.payload;
      var incomingFrom = data.envelope.from;
      console.log("GET MESSAGE FROM:" + incomingFrom);
      return incomingFrom;
    }
  };
})();
