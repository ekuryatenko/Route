/*var http = require("http");
var server = http.createServer(function(request, response) {

});

server.listen(3000);
console.log("Server is listening");*/
"use strict";
import dbHelper from "./dbHelper";

/*let tick = new Promise(function(resolve, reject) {
  setTimeout(resolve(text), 1000);
});*/

dbHelper.getAdminPas().then(
    pass => {
      return (pass);
    },
    err => {
      throw err;
    }
  )
  .then(
    result => {
      console.log("1: " + result);

      return new Promise((res, rej)=>{
        setTimeout(function () {
          res(result.split(""));
          rej("Error");
        }, 1000);
      });
    },
    err => {
      console.log(err);
    }
  )
  .then(
    (arr) => {
      console.log("2: " + arr[0]);
    },
    (err) => {
      console.log("2: ERROR " + err);
    }
  );




