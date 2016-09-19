/**************************
 * Get page fields
 **************************/

// Returns reference to selector page object
var getNode = function(selector) {
  return document.querySelector(selector);
};

// Get the form nodes
var USER_EMAIL_INPUT = getNode("#user_email_input"),
  FPASS_INPUT = getNode("#password_first"),
  LOGIN_BUTTON = getNode("#logInButton"),
  SIGNIN_BUTTON = getNode("#signInButton");

/**************************
 * On page load events
 **************************/

// Connection to start html page server source
var SERVER_URL = window.location.hostname;
var socket = io.connect(SERVER_URL);

/**************************
 * From server side events
 **************************/

// Fires to show server message
socket.on("alert", function(msg) {
  alert(msg);
});

// Fires to clear the login form
socket.on("clean-form", function() {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";
});

// Switches user to new destination page
socket.on("redirect", function(destination) {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";

  //It was impossible to save whole profile object in sessionStorage
  var signIn_obj = socket.profile.user_email;
  sessionStorage.setItem("ss_user_profile", signIn_obj);

  window.location.href = destination;
});

/**************************
 * Page side events
 **************************/

// Initiates login data sending to server on submit button
LOGIN_BUTTON.addEventListener('click', function(event) {
  // Variables to send to the server
  var user_email = USER_EMAIL_INPUT.value,
    fpass = FPASS_INPUT.value;

  var logIn_obj = {
    user_email: user_email,
    fpass: fpass
  };

  // Store session data while server in processing
  socket.profile = logIn_obj;

  // Send the values to the server
  socket.emit("logIn", logIn_obj);

  // Prevents page reloading
  event.preventDefault();
});

// Initiates signin page loading on button click
SIGNIN_BUTTON.addEventListener("click", function() {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";

  window.location.href = "/signInForm.html";
});

