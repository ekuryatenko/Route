// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";

// Establish a connection to the user browser
import SOCKET_IO from "socket.io";

// DB constant
const DB_URI = process.env.MONGODB_URI;
let DB;

// Server initiation logging timeout time, ms
const TIME_OUT = 300;

/**
 * Makes main initial server connections.
 * @param {Object} listener - Server for browser processes.
 * @param {callback} callbackAfterServerRunning - Logging support.
 */
const initServer = function (listener, callbackAfterServerRunning) {
  MONGO_CLIENT.connect (DB_URI, (err, db) => {
    if (err) {
      throw new Error (err);
    }

    console.log (`SERVER: connected to dataBase  ${db.databaseName}`);

    // Global variable for socket.io server
    const IO = SOCKET_IO.listen (listener);

    IO.on ("connection", (socket) => {
      console.log ("socket connected");
      socket.db = db;
      socketHandler (socket);
    });

    // Wait for server to boot
    setTimeout (() => {
      callbackAfterServerRunning ()
    }, TIME_OUT);
  });
};

import {onGetProfile} from "./socketHandlers/onGetProfile";
import {onSignIn} from "./socketHandlers/onSignIn";
import {onLogIn} from "./socketHandlers/onLogIn";
import {onSetProfile} from "./socketHandlers/onSetProfile";
import {onGetAdmin} from "./socketHandlers/onGetAdmin";
import {onUpdateTemplate} from "./socketHandlers/onUpdateTemplate";
import {onSendToAll} from "./socketHandlers/onSendToAll";

/**
 * Main socket handler for chat events
 * @param {Object} socket
 */
function socketHandler (socket) {
  /** Log in page events */

  // User has send his data from login page
  socket.on ("logIn", onLogIn);

  /** Sign in page events */

  // User has send his data from registration page
  socket.on ("signIn", onSignIn);

  /** User profile page events */

  // User asks for his personal data to fill forms of profile page
  socket.on ("getProfile", onGetProfile);

  // User has changed his personal data from profile page
  socket.on ("setProfile", onSetProfile);

  /** Admin page events */

  // Admin asks for admin page content to fill page forms
  socket.on ("getAdmin", onGetAdmin);

  // Admin asks to change main email template
  socket.on ("updateTemplate", onUpdateTemplate);

  // Admin asks to make broadcast email delivery
  socket.on ("sendToAll", onSendToAll);
}

export {
  DB_URI,
  initServer,
};
