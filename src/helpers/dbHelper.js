// Establish a connection to the mongo database
import { MongoClient as MONGO_CLIENT } from 'mongodb';

const DB_URI = process.env.MONGODB_URI;

/**
 * Provides app db connection
 *
 * @return {Promise} returns Promise returns db reference in resolve
 */
function connectToDb() {
  return new Promise((resolve, reject) => {
    MONGO_CLIENT.connect(DB_URI, (err, db) => {
      if (err) {
        reject(err);
      }
      if (process.env.NODE_ENV !== 'production') console.log("connectToDb");
      resolve(db);
    });
  });
}

/**
 * Inserts new user profile to db
 *
 * @param {Object} newProfile - user profile object
 * @param {Object} db - app db reference
 * @return {Promise} returns Promise with confirm message in resolve
 */
function insertToDb(newProfile, db) {
  return new Promise((resolve, reject) => {
    const users = db.collection('users');

    users.insertOne(newProfile)
      .then(
        (res) => {
          db.close();
          if (process.env.NODE_ENV !== 'production') console.log("inserted: ", newProfile);
          resolve('OK');
        });
  });
}

/**
 * Gets user profile from db and returns profile object with Promise
 *
 * @param {string} user - user email
 * @param {Object} db - app db reference
 * @return {Promise} returns Promise with user profile obj in resolve
 *                    Otherwise - message will be returned
 */
function getUserProfileFromDb(user, db) {
  return new Promise((resolve, reject) => {
    const users = db.collection('users');
    users
      .find({
        userEmail: user
      })
      .limit(1)
      .next((err, profile) => {
        db.close();
        if (err) {
          reject(err);
        }

        if (profile) {
          resolve(profile);
        } else {
          reject('NO PROFILE ERROR');
        }
      });
  });
}

/**
 * Provides library for db methods
 */
export default (function () {
  return {
  /**
   * Connect to db and insert new user profile
   *
   * @param {Object} newProfile - user profile object
   * @return {Promise} returns Promise which provide insertion
   */
    addUserToBase(newProfile) {
      return connectToDb()
        .then(
        (db) => {
          insertToDb(newProfile, db);
        })
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Gets admin profile from db and returns admin password value
   *
   * @return {Promise} returns Promise with password text string in resolve
   */
    getAdminPas() {
      return connectToDb()
        .then(
          db => getUserProfileFromDb('admin', db)
        )
        .then(
          profile => profile.password
        )
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Finds all users profiles from db and returns
   * them in array
   *
   * @return {Promise} returns Promise with users array in resolve
   */
    getAllUsers() {
      return connectToDb()
        .then(
          db => new Promise((resolve, reject) => {
            // Fetch a specific collection (containing the actual collection information)
            const users = db.collection('users');

            const remainInResult = {
              _id: 0,
              userEmail: 1,
              password: 1,
              emailTemplate: 1
            };

            users
              .find({}, remainInResult)
              .toArray((err, arr) => {
                db.close();
                resolve(arr);
                reject(err);
              });
          })
        )
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Finds existed main reply email text template and
   * returns it with Promise resolve
   *
   * @param {string} ver - main text template version
   * @return {Promise} returns Promise with text string in resolve
   */
    getMainText(ver) {
      return connectToDb()
        .then(
          db => new Promise((resolve) => {
            const templates = db.collection('templates');
            templates
              .find({version: ver})
              .limit(1)
              .next((err, textTemplate) => {
                db.close();
                resolve(textTemplate.text);
              });
          })
        )
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Makes connection to db and returns profile object with Promise
   *
   * @param {string} user - user email
   * @return {Promise} returns Promise with user profile obj in resolve
   */
    getUserProfile(user) {
      return connectToDb()
        .then(
          db => getUserProfileFromDb(user, db)
        )
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Removes existed user profile from db
   *
   * @param {string} user - user email
   * @return {Promise} returns Promise with confirm message in resolve
   */
    removeFromDb(user) {
      return connectToDb()
        .then(
          db => new Promise((resolve) => {
            const users = db.collection('users');

            const filter = {
              userEmail: user // TODO: modify to CameCase+quotes - check db
            };

            users.deleteOne(filter, () => {
              db.close();

              resolve('USER DELETED');
            });
          })
        )
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Finds existed profile by user name and update profile
   * User name is get from param Object user_email field
   *
   * @param {Object} newProfile - updated user profile
   * @return {Promise} returns Promise with simple result string
   */
    updateProfile(newProfile) {
      return connectToDb()
        .then(
        (db) => {
          const users = db.collection('users');
          const find = {
            userEmail: newProfile.userEmail
          };
          const update = {
            $set: {
              password: newProfile.password,
              emailTemplate: newProfile.emailTemplate
            }
          };
          users.findOneAndUpdate(
            find,
            update,
            () => {
              db.close();

              return 'PROFILE UPDATED';
            });
        })
        .catch((error) => {
          console.error(error);
        });
    },

  /**
   * Finds existed main reply email text template and
   * update it by param value
   *
   * @param {string} newTemplate - updated template text
   * @return {Promise} returns Promise with empty result
   */
    updateTemplate(newTemplate) {
      return connectToDb()
      .then(
        (db) => {
          const templates = db.collection('templates');
          const find = { version: newTemplate.version };
          const update = {
            $set: {
              version: newTemplate.version,
              text: newTemplate.text
            }
          };

          const options = {
            upsert: true
          };

          // Returns empty Promise result
          return templates.findOneAndUpdate(
            find,
            update,
            options,
            () => {
              db.close();
            });
        })
      .catch((error) => {
        console.error(error);
      });
    }
  };
}());
