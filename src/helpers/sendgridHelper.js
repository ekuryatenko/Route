// Sendgrid module https://github.com/sendgrid/sendgrid-nodejs
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// Text for subject form in all reply emails
const MY_APP_EMAILS_SUBJECT = 'EMAIL_APP RESPONSE';

// Email sender address for  all broadcast sending emails - simple app email
const CYCLE_SENDING_SENDER_ADDR = 'autoInfo@allmails.cryptic-lowlands-96337.cu.cc';

/**
 * Object helps to handle emails
 * with SENDGRID service REST API
 */
export default (function() {
  return {
    /**
     * Parses addresses from current inbound email
     *
     * @param {Object} request - SENDGRID request with inbound email
     * @return {Object} addresses - email sender and receiver addresses
     */
    getIncomingMailAddresses (request){
      var data = request.payload;

      let addresses = {
        incomingSender: data.from.split("<")[1].split(">")[0],
        incomingReciever: data.to
      };

      console.log("GET MESSAGE FROM:" + addresses.incomingSender + " TO: " + addresses.incomingReciever);

      return addresses;
    },

    /**
     * Sends email due to SENDGRID REST API with
     * "from" and "to" addresses filled
     *
     * @param {string} from
     * @param {string} to
     * @param {string} text - Yet prepared text for current email receiver
     * @param {Function} callback - on SENDGRID reply after sending
     */
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
        console.log("emailHelper: " + text);
        console.log(response.statusCode);
        console.log(response.body);
        //console.log(response.headers);

        if (callback) {
          callback(response.statusCode);
        }
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
    sendEmailsInCycle(arr, mainText, callback){
        let emailsCnt = 0;
        let successfulEmail = 0;

        for (var item of arr) {
          var text = mainText;
          text = text.replace(/{{userName}}/g, item.emailTemplate);

          this.sendResponseMail(
            CYCLE_SENDING_SENDER_ADDR,
            item.user_email,
            text,
            (status)=> {

              emailsCnt++;

              if (parseInt(status) < 400) {
                successfulEmail++;
              }

              if (emailsCnt == arr.length) {
                let alert = "IT WERE SENDED " + successfulEmail + " EMAILS OF " + emailsCnt
                console.log(alert);

                if(callback){
                  callback(alert);
                }
              }
            });
        }
    }
  }
})();
