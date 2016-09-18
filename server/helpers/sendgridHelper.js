// Sendgrid settings
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const MY_APP_EMAILS_SUBJECT = 'EMAIL_APP RESPONSE';
const CYCLE_SENDING_SENDER_ADDR = 'autoInfo@allmails.cryptic-lowlands-96337.cu.cc';

export default (function(){
  return {
    getIncomingMailAddresses (request){
      var data = request.payload;

      let addresses = {
        incomingSender: data.from.split("<")[1].split(">")[0],
        incomingReciever:  data.to
      };

      console.log("GET MESSAGE FROM:" + addresses.incomingSender + " TO: " + addresses.incomingReciever);

      return addresses;
    },

    sendResponseMail(from, to, text, callback){
      var helper = sg.mail;
      var from_email = new helper.Email(from);
      var to_email = new helper.Email(to);
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

    sendEmailsInCycle(arr, mainText){
      let emailsCnt = 0;

      setTimeout(function(){
        console.log("IT WERE SENDED " + emailsCnt + " EMAILS OF " + arr.length);
      }, arr.length * 2000);

      for(var item of arr){
        var text = mainText;
        text = text.replace(/{{userName}}/g, item.emailTemplate);

        this.sendResponseMail(
          CYCLE_SENDING_SENDER_ADDR,
          item.user_email,
          text,
          (status)=>{
            if(parseInt(status) < 400) {
              emailsCnt++;
            }
        });
      }
    }
  };
})();
