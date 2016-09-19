/**************************
 * Get page fields
 **************************/

// Returns reference to selector page object
const getNode = (selector) => {
  return document.querySelector(selector);
};

// Get the form nodes
const USER_EMAIL_INPUT = getNode("#user_email_input");
const  FPASS_INPUT = getNode("#password_first");
const  LOGIN_BUTTON = getNode("#logInButton");
const  SIGNIN_BUTTON = getNode("#signInButton");

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
socket.on("alert", (msg) => {
  alert(msg);
});

// Fires to clear the login form
socket.on("clean-form", () => {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";
});

// Switches user to new destination page
socket.on("redirect", (destination) => {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";

  //It was impossible to save whole profile object in sessionStorage
  const signIn_obj = socket.profile.user_email;

  sessionStorage.setItem("ss_user_profile", signIn_obj);

  window.location.href = destination;
});

/**************************
 * Page side events
 **************************/

// Initiates login data sending to server on submit button
LOGIN_BUTTON.addEventListener('click', (event) => {
  // Variables to send to the server
  const user_email = USER_EMAIL_INPUT.value;
  const  fpass = FPASS_INPUT.value;

  const logIn_obj = {
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
SIGNIN_BUTTON.addEventListener("click", () => {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";

  window.location.href = "/signInForm.html";
});

