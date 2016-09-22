// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";
import {DB_URI as uri} from "./../myServer";

export default (function(){
  return {
    addUserToBase: addUserToBase,
    getAdminPas: getAdminPas,
    getAllUsers: getAllUsers,
    getMainText: getMainText,
    getUserProfile: getUserProfile,
    updateProfile: updateProfile,
    updateTemplate: updateTemplate
  };
})();

function updateProfile(newProfile){
  return connectToDb()
    .then(
      db => {
        var users = db.collection ('users');

        let find = {
          user_email: newProfile.user_email
        };

        let update = {
          $set: {
            password: newProfile.password,
            emailTemplate: newProfile.emailTemplate
          }
        };

        users.findOneAndUpdate (
          find ,
          update ,
          (err) => {
            db.close ();
          });
      })
    .catch(error => {
      console.error(error);
    });
}

function updateTemplate(newTemplate) {
  return connectToDb()
    .then(
      db => {
        let templates = db.collection('templates');

        let find = { version: newTemplate.version };

        let update = {
          $set: {
            version: newTemplate.version,
            text: newTemplate.text
          }
        };

        let options = {
          upsert: true
        };

        return templates.findOneAndUpdate(
          find,
          update,
          options,
          (err, res) => {
            db.close();
          });
        })
    .catch(error => {
      console.error(error);
    });
}

/** ********************************** */
function getMainText(ver){
  return connectToDb()
    .then(
      db => {
      return new Promise((resolve, reject) => {
        let templates = db.collection ('templates');
        templates
          .find ({version: ver})
          .limit (1)
          .next (function (err, textTemplate) {
            db.close ();

            resolve(textTemplate.text);
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
}

/** ********************************** */
function getAllUsers() {
  return connectToDb()
    .then(
      db => {
      return new Promise((resolve, reject) => {
        var users = db.collection('users');

        var remainInResult = {
          _id: 0,
          user_email: 1,
          password: 1,
          emailTemplate: 1
        };

        users
          .find({}, remainInResult)
          .toArray(function(err, arr) {
            db.close();

            resolve(arr);
            reject(err);
          });
      });
    }
  )
    .catch(error => {
      console.error(error);
    });
}

/** ********************************** */
function getAdminPas(){
  return connectToDb()
    .then(
      db => {
        return getUserProfileFromDb("admin", db);
      }
    )
    .then(
      profile => {
        return profile.password;
      }
    )
    .catch(error => {
      console.error(error);
    });
}

/** ********************************** */
function getUserProfileFromDb(user, db){
  return new Promise(function(resolve, reject) {
    var users = db.collection('users');
    users
      .find({
        'user_email': user
      })
      .limit(1)
      .next((err, profile) => {
        db.close();

        resolve(profile);
        reject(err);
      });
  });
}

/** ********************************** */
function getUserProfile(user){
  return connectToDb()
    .then(
      db => {return getUserProfileFromDb(user, db);}
    )
    .catch(error => {
      console.error(error);
    });
}

/** ********************************** */
function insertToDb(newProfile, db){
  return new Promise ((resolve, reject) => {
    let users = db.collection ('users');
    users.insertOne(newProfile, () => {
      db.close ();
      resolve("OK");
      reject(new Error());
    });
  });
}

/** ********************************** */
function addUserToBase(newProfile){
  return  connectToDb()
    .then(
      db => {return insertToDb(newProfile, db)}
    )
    .catch(error => {
      console.error(error);
    });
}

/** ********************************** */
function connectToDb(){
  return new Promise (function (resolve, reject) {
    MONGO_CLIENT.connect (uri, (err, db) => {
      resolve(db);
      reject(err);
    });
  });
}
