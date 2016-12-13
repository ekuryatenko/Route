import {MongoClient as MONGO_CLIENT} from "mongodb";
const DB_URI = process.env.MONGODB_URI;

/**
 * Service handler for development
 *
 * Returns template text on POST request
 *
 * @param {Object} reply - Route reply
 * @param {string} userName
 */
export function getTemplateSample(reply, userName) {
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    let templates = db.collection('templates');

    templates
      .find({version:"1"})
      .limit(1)
      .next((err, profile)=>{
        if (err) throw err;

        let text = profile.text;

        reply ("TEMPLATE SAMPLE IS : " + text.replace(/{{userName}}/g, userName));

        db.close ();
      });
  });
}
