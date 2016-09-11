// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";
const uri = "mongodb://localhost:27017/route";

export default (function(){
  return {
    getAdminPas: getAdminPas,
    getAllUsers: getAllUsers,
    getMainText: getMainText
  };
})();

function getAdminPas(){
  return new Promise (function (resolve, reject) {
    connectToBase()
      .then(
        db => {
          //Get template piece for this user
          var users = db.collection ('users');
          users
            .find ({
              'user_email': "admin"
            })
            .limit (1)
            .next (function (err, profile) {
              if (err) throw err;

              db.close ();

              resolve(profile.password);
          });
        },
        err => {
          reject(new Error(err));
        }
      );
  });

}

function getMainText(err, ver, callback){
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    var templates = db.collection ('templates');
    templates
      .find ({version: ver})
      .limit (1)
      .next (function (err, template) {
        if (err) throw err;

        db.close ();

        if (callback) {
          callback (template.text);
        }
    });
  });
}

function getAllUsers(err, callback) {
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    var users = db.collection ('users');

    var remainInResult = {
      _id: 0,
      password: 0
    };

    users
      .find ({}, remainInResult)
      .toArray (function (err, res) {
      if (err) throw err;

      db.close ();

      if (callback) {
        callback (res);
      }
    });
  });
}


function connectToBase(){
  return new Promise (function (resolve, reject) {
    MONGO_CLIENT.connect (uri, (err, db) => {
      resolve(db);
      resolve(err);
    });
  });
}
