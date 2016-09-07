// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";
import {DB_URI as uri} from "./myServer";

/** I have to learn more about regExps here */
//const regExpSample = '/{/{user/}/}';

export function getTamplateSample(reply, requestUserName) {
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    var templates = db.collection('templates');

    templates
      .find({version:"1"})
      .limit(1)
      .next(function(err, profile){
        if (err) throw err;

        var text = profile.text;

        reply ("TAMPLATE SAMPLE IS : " + text.replace(/{{userName}}/g, requestUserName));

        db.close ();
      });

  });
}
