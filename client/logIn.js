/** ======================
 * Get page fields
 * =======================*/

// selector function
var getNode = function(s) {
  return document.querySelector(s);
};

// get the form nodes
var USER_EMAIL_INPUT = getNode('#user_email_input'),
  FPASS_INPUT = getNode('#password_first'),
  LOGIN_BUTTON = getNode('#logInButton'),
  SIGNIN_BUTTON = getNode('#signInButton');

/** ======================
 * On page load events
 * =======================*/

// Connection to start html page server source
var SERVER_URL = window.location.hostname;
var socket = io.connect (SERVER_URL);

/** ======================
 * From server side events
 * =======================*/

// alert error messages returned from the server
socket.on('alert', function(msg){
  alert(msg);
});

// clear the login form
socket.on('clear-form', function(){
  USER_EMAIL_INPUT.value = '';
  FPASS_INPUT.value = '';
});

// Switch user to destination page
socket.on('redirect', function(destination) {
  USER_EMAIL_INPUT = "";
  FPASS_INPUT = "";

  //It was impossible to save whole profile object in sessionStorage
  var signIn_obj = socket.profile.user_email;
  sessionStorage.setItem('ss_user_profile', signIn_obj);

  window.location.href = destination;
});

/** ======================
 * Page side events
 * =======================*/

// add the event listener for the login submit button
LOGIN_BUTTON.addEventListener('click', function(event){
  // create variables to send to the server and assign them values
  var user_email = USER_EMAIL_INPUT.value,
    fpass = FPASS_INPUT.value;

  var logIn_obj = {
    user_email: user_email,
    fpass: fpass
  };

  socket.profile = logIn_obj;

  // send the values to the server
  socket.emit('logIn', logIn_obj);

  event.preventDefault();
});

// add the event listener for the login submit button
SIGNIN_BUTTON.addEventListener('click', function(){
  USER_EMAIL_INPUT.value = '';
  FPASS_INPUT.value = '';

  window.location.href = "/signInForm.html";
});

