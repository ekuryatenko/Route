// Establish a connection to the mongo database
import {MongoClient as MONGO_CLIENT} from "mongodb";

// Establish a connection to the user browser
import SOCKET_IO from "socket.io";

// DB constant
const DB_URI = process.env.MONGODB_URI;

// DB constant
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


import {onGetProfile} from "./onGetProfile";
import {onJoinToRoute} from "./onJoinToRoute";


/**
 * Main handler for chat events
 * @param {Object} socket
 */
function socketHandler (socket) {
  // User has connected to Route start page
  socket.on ("join", onJoinToRoute);

  // User asks from profile page
  socket.on ("getProfile", onGetProfile);
}

export {
  DB_URI,
  initServer,
};
