import Path from "path";
// Main routes for app server
export const serverRoutes = [//How divide this part on functional blocks
  {
    method: "GET",
    path: "/",
    handler: {
      file: __dirname + "/views/signInForm.html"
    }
  }, {
    method: "GET",
    path: "/userProfileForm.html",
    handler: {
      file: __dirname + "/views/userProfileForm.html"
    }
  }, {
    method: "GET",
    path: "/routeStyle.css",
    handler: {
      file: __dirname + "/views/routeStyle.css"
    }
  }, {
    method: "GET",
    path: "/myClient.js",
    handler: {
      file: __dirname + "/client/myClient.js"
    }
  }, {
    method: "GET",
    path: "/myClientProfile.js",
    handler: {
      file: __dirname + "/client/myClientProfile.js"
    }
  }, {
    method: "GET",
    path: "/socket.io-1.2.0.js",
    handler: {
      file: __dirname + "/socket/socket.io-1.2.0.js"
    }
  }
];

