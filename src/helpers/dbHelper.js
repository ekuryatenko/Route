// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";
import {DB_URI as uri} from "./../myServer";

export default (function(){
  return {
    getAdminPas: getAdminPas,
    getAllUsers: getAllUsers,
    getMainText: getMainText,
    getUserProfile: getUserProfile,
    addUserToBase: addUserToBase,
    updateProfile: updateProfile,
    updateTemplate: updateTemplate
  };
})();

function getAdminPas(err, callback){
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

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

        if(callback) {
          callback (profile.password);
        }
      });
  })
}

function getUserProfile(err, user, callback){
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    var users = db.collection('users');

    users.find({
      'user_email': user
    }).toArray(function(err, dbArr) {
      if (err) throw err;

      let profile = {
        user_email: dbArr[0].user_email,
        password: dbArr[0].password,
        emailTemplate: dbArr[0].emailTemplate
      };

      db.close ();

      if (callback) {
        callback (profile);
      }
    });
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
      user_email: 1,
      password: 1,
      emailTemplate: 1
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

function updateProfile(err, newProfile, callback){
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    // create a database variable
    var users = db.collection ('users');

    users.findOneAndUpdate (
      {
        user_email: newProfile.user_email
      } ,
      {
        $set: {
          password: newProfile.password,
          emailTemplate: newProfile.emailTemplate
        }
      } ,
      (err) => {
        if (err) throw err;

        db.close ();

        if (callback) {
          getUserProfile(null, newProfile.user_email,  callback)
        }
      });
  });
}

function addUserToBase(err, newProfile, callback){
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    // create a database variable
    var users = db.collection ('users');

    users.insertOne(newProfile, () => {
      if (err) throw err;

      db.close ();

      if (callback) {
        callback ();
      }
    });
  });
}

function updateTemplate(err, newTemplate, callback){
  MONGO_CLIENT.connect (uri, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    // create a database variable
    var templates = db.collection('templates');

    var find = {version: newTemplate.version};
    var update = {
      $set: {
        version: newTemplate.version,
        text: newTemplate.text
      }
    };

    var options = {
      upsert: true
    };

    templates.findOneAndUpdate (
      find,
      update,
      options,
      (err, res) => {
        if(err){
          throw err;
        }

        db.close();

        if (callback) {
          callback(res);
        }
    });
  });
}
