// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";
import {DB_URI as uri} from "./myServer";

//Sendgrid settings
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const MY_APP_EMAIL = "barejra@list.ru";
const MY_APP_EMAILS_SUBJECT = 'EMAIL_APP RESPONSE';

/**
 * @param request POST from CloudMailIn
 * @param reply
 * */
export function incomingMailHandler (request, reply) {
  reply ("OK!");

  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    const emailFrom = getIncomingMailSender (request);

    //Combine response text for this sender - get main Template
    let mainResponseText = "";

    var templates = db.collection ('templates');
    templates
      .find ({version: "1"})
      .limit (1)
      .next (function (err, template) {
        if (err) throw err;

        mainResponseText = template.text;

        //Get template piece for this user
        var users = db.collection ('users');
        users.find ({
          'user_email': emailFrom
        }).limit (1)
          .next (function (err, profile) {
            if (err) throw err;

            var userTemplatePiece = profile.emailTemplate;

            //Modify main response text for current user
            mainResponseText = mainResponseText.replace (/{{userName}}/g, userTemplatePiece);

            function callback(){
              db.close ();
            }

            sendResponseMail(emailFrom, mainResponseText, callback);
          });
      });
  });
}

function getIncomingMailSender (request) {
  var data = request.payload;
  var incomingFrom = data.envelope.from;
  console.log ("GET MESSAGE FROM:" + incomingFrom);
  return incomingFrom;
}

function sendResponseMail(adress, text, callback){
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
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);

    callback();
  });
}
