// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";

import {DB_URI as uri} from "./myServer";

export function emailHandler(reply, user) {
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    var templates = db.collection('templates');

    templates
      .find({version:"1"})
      .limit(1)
      .next(function(err, doc){
        if (err) throw err;

        var text = doc.text;

        reply (text.replace(/{{user}}/g, user));

        db.close ();
      });

  });
}
