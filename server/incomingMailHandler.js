// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";
import {DB_URI as uri} from "./myServer";

//Sendgrid settings
import emailHelper from "./emailHelper";

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

    const emailFrom = emailHelper.getIncomingMailSender(request);

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

            /*function callback(){
              db.close ();
            }*/
            db.close ();
            emailHelper.sendResponseMail(emailFrom, mainResponseText);
          });
      });
  });
}
