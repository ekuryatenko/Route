import {getTemplateSample} from "./routeHandlers/pathHandler.js";
import {incomingMailHandler} from "./routeHandlers/incomingMailHandler.js";
import {adminHandler} from "./routeHandlers/adminHandler.js";
import {loginHandler} from "./routeHandlers/loginHandler.js";
import {signInHandler} from "./routeHandlers/signInHandler.js";
import {getUserProfileHandler} from "./routeHandlers/getUserProfileHandler.js";
import {setUserProfileHandler} from "./routeHandlers/setUserProfileHandler.js";
import {getAdminPageHandler} from "./routeHandlers/getAdminPageHandler.js";
import {removeUserProfileHandler} from "./routeHandlers/removeUserProfileHandler.js";
import {updateAdminTemplateHandler} from "./routeHandlers/updateAdminTemplateHandler.js";

// Main routes for app server
// TODO: Search in internet - how to organize such handler files
export const serverRoutes = [
  {
    method: "POST",
    path: "/login",
    handler: function (request, reply) {
      loginHandler(request, reply);
    }
  },
  {
    method: "POST",
    path: "/signIn",
    handler: function (request, reply) {
      signInHandler(request, reply);
    }
  },
  {
    method: "POST",
    path: "/admin",
    handler: function (request, reply) {
      adminHandler(request, reply);
    }
  },
  {
    method: "POST",
    path: "/incomingMail",
    handler: function (request, reply) {
      incomingMailHandler(request, reply);
    }
  },
  {
    method: "GET",
    path: "/path/{user}",
    handler: function (request, reply) {
      getTemplateSample(reply, request.params.user);
    }
  },
  {
    method: "GET",
    path: "/getUserProfileHandler/{user}",
    handler: function (request, reply) {//test if no params in url
      getUserProfileHandler(reply, request.params.user);
    }
  },
  {
    method: "POST", //TODO: POST ?   + think how to decompose this array of handlers
    path: "/setUserProfile",
    handler: function (request, reply) {
      setUserProfileHandler(request, reply);
    }
  },
  {
    method: "POST",
    path: "/updateAdminTemplate",
    handler: function (request, reply) {
      updateAdminTemplateHandler(request, reply);
    }
  },
  {
    method: "GET",
    path: "/getAdminPageContent",
    handler: function (request, reply) {
      getAdminPageHandler(reply);
    }
  },
  {
    method: "GET",
    path: "/removeUserProfile/{user}",
    handler: function (request, reply) {
      removeUserProfileHandler(reply, request.params.user);
    }
  },
  {
    method: "GET",
    path: "/",
    handler: {
      file: __dirname + "./../views/logInForm.html"
    }
  },
  {
    method: "GET",
    path: "/logInForm.html",
    handler: {
      file: __dirname + "./../views/logInForm.html"
    }
  },
  {
    method: "GET",
    path: "/signInForm.html",
    handler: {
      file: __dirname + "./../views/signInForm.html"
    }
  }, {
    method: "GET",
    path: "/userProfileForm.html",
    handler: {
      file: __dirname + "./../views/userProfileForm.html"
    }
  }, {
    method: "GET",
    path: "/adminProfileForm.html",
    handler: {
      file: __dirname + "./../views/adminProfileForm.html"
    }
  }, {
    method: "GET",
    path: "/routeStyle.css",
    handler: {
      file: __dirname + "./../views/routeStyle.css"
    }
  }, {
    method: "GET",
    path: "/logIn.js",
    handler: {
      file: __dirname + "/client/logIn.js"
    }
  }, {
    method: "GET",
    path: "/signIn.js",
    handler: {
      file: __dirname + "/client/signIn.js"
    }
  }, {
    method: "GET",
    path: "/userProfile.js",
    handler: {
      file: __dirname + "/client/userProfile.js"
    }
  }, {
    method: "GET",
    path: "/adminProfile.js",
    handler: {
      file: __dirname + "/client/adminProfile.js"
    }
  }, {
    method: "GET",
    path: "/socket.io-1.2.0.js",
    handler: {
      file: __dirname + "./../socket/socket.io-1.2.0.js"
    }
  }
];

