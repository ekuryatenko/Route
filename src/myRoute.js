// TODO: resolve path for ESLint ... or unresolve
// TODO: __dirname - https://www.airpair.com/javascript/posts/using-es6-harmony-with-nodejs`

import path from 'path';
import incomingMailHandler from './routeHandlers/incomingMailHandler';
import adminHandler from './routeHandlers/adminGeneratorHandler';
import loginHandler from './routeHandlers/loginHandler';
import signInHandler from './routeHandlers/signInHandler';
import getUserProfileHandler from './routeHandlers/getUserProfileHandler';
import setUserProfileHandler from './routeHandlers/setUserProfileHandler';
import getAdminPageHandler from './routeHandlers/getAdminPageHandler';
import removeUserProfileHandler from './routeHandlers/removeUserProfileHandler';
import updateAdminTemplateHandler from './routeHandlers/updateAdminTemplateHandler';
import sendToAllAdminHandler from './routeHandlers/adminBroadcastEmailHandler';

// Main routes for app server
export default [
  {
    method: 'POST',
    path: '/login',
    handler: (request, reply) => {
      loginHandler(request, reply);
    }
  },
  {
    method: 'POST',
    path: '/signIn',
    handler: (request, reply) => {
      signInHandler(request, reply);
    }
  },
  {
    method: 'POST',
    path: '/admin',
    handler: (request, reply) => {
      adminHandler(request, reply);
    }
  },
  {
    method: 'POST',
    path: '/incomingMail',
    handler: (request, reply) => {
      incomingMailHandler(request, reply);
    }
  },
  {
    method: 'GET',
    path: '/getUserProfileHandler/{user}',
    handler: (request, reply) => {
      getUserProfileHandler(reply, request.params.user);
    }
  },
  {
    method: 'POST',
    path: '/setUserProfile',
    handler: (request, reply) => {
      setUserProfileHandler(request, reply);
    }
  },
  {
    method: 'POST',
    path: '/updateAdminTemplate',
    handler: (request, reply) => {
      updateAdminTemplateHandler(request, reply);
    }
  },
  {
    method: 'GET',
    path: '/getAdminPageContent',
    handler: (request, reply) => {
      getAdminPageHandler(reply);
    }
  },
  {
    method: 'GET',
    path: '/sendEmailToAll',
    handler: (request, reply) => {
      sendToAllAdminHandler(reply);
    }
  },
  {
    method: 'GET',
    path: '/removeUserProfile/{user}',
    handler: (request, reply) => {
      removeUserProfileHandler(reply, request.params.user);
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: {
      // Search for the given view, render the template and reply the HTML content
      // Absolute paths are not allowed in views
      view: 'logInForm.pug'
    }
  },
  {
    method: 'GET',
    path: '/logInForm.html',
    handler: {
      // Search for the given view, render the template and reply the HTML content
      // Absolute paths are not allowed in views
      view: 'logInForm.pug'
    }
  },
  {
    method: 'GET',
    path: '/signInForm.html',
    handler: {
      // Search for the given view, render the template and reply the HTML content
      // Absolute paths are not allowed in views
      view: 'signInForm.pug'
    }
  }, {
    method: 'GET',
    path: '/userProfileForm.html',
    handler: {
      // Search for the given view, render the template and reply the HTML content
      // Absolute paths are not allowed in views
      view: 'userProfileForm.pug'
    }
  }, {
    method: 'GET',
    path: '/adminProfileForm.html',
    handler: {
      // Search for the given view, render the template and reply the HTML content
      // Absolute paths are not allowed in views
      view: 'adminProfileForm.pug'
    }
  }, {
    method: 'GET',
    path: '/routeStyle.css',
    handler: {
      file: path.join(__dirname, './../frontend/routeStyle.css')
    }
  }, {
    method: 'GET',
    path: '/logIn.js',
    handler: {
      file: path.join(__dirname, '/public/logIn.js')
    }
  }, {
    method: 'GET',
    path: '/signIn.js',
    handler: {
      file: path.join(__dirname, '/public/signIn.js')
    }
  }, {
    method: 'GET',
    path: '/userProfile.js',
    handler: {
      file: path.join(__dirname, '/public/userProfile.js')
    }
  }, {
    method: 'GET',
    path: '/adminProfile.js',
    handler: {
      file: path.join(__dirname, '/public/adminProfile.js')
    }
  }
];
