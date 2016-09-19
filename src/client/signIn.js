/**************************
 * Get page fields
 **************************/

// Returns reference to selector page object
const getNode = (selector) => {
  return document.querySelector(selector);
};

// Get the page nodes
const USER_EMAIL_INPUT = getNode("#user_email_input");
const FPASS_INPUT = getNode("#password_first");
const CPASS_INPUT = getNode("#password_confirm");
const SIGNIN_BUTTON = getNode("#signInButton");

/**************************
 * On page load events
 **************************/

// Connection to start html page server source
const SERVER_URL = window.location.hostname;
const socket = io.connect(SERVER_URL);

/**************************
 * From server side events
 **************************/

// Fires to show server message
socket.on("alert", function(msg) {
  alert(msg);
});

// Fires to clean the login form
socket.on("clean-form", function() {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";
  CPASS_INPUT.value = "";
});

// Switches user to new destination page
socket.on("redirect", function(destination) {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";
  CPASS_INPUT.value = "";

  //It was impossible to save whole profile object in sessionStorage
  const session_user = socket.profile.user_email;

  sessionStorage.setItem("ss_user_profile", session_user);

  window.location.href = destination;
});

/**************************
 * Page events
 **************************/

// Initiates signin server process
SIGNIN_BUTTON.addEventListener("click", function(event) {
  const user_email = USER_EMAIL_INPUT.value;
  const fpass = FPASS_INPUT.value;
  const cpass = CPASS_INPUT.value;

  const signIn_obj = {
    user_email: user_email,
    fpass: fpass,
    cpass: cpass
  };

  socket.profile = signIn_obj;

  // send the values to the server
  socket.emit("signIn", signIn_obj);

  // Prevents page reloading
  event.preventDefault();
});
