/*var http = require("http");
var server = http.createServer(function(request, response) {

});

server.listen(3000);
console.log("Server is listening");*/
"use strict";
import dbHelper from "./dbHelper";

dbHelper.getAdminPas().then(
  result => {
    console.log(result);
  },
  err => {
    throw err;
  }
);


