/**************************
 * Get page fields
 **************************/

// Returns reference to selector page object
const getNode = (selector) => {
  return document.querySelector(selector);
};

// Get the page nodes
const USER_LABEL = getNode("#userLabel");
const PASSWORD_INPUT = getNode("#passwordInput");
const PROFILE_INPUT = getNode("#profileInput");
const CHANGE_BUTTON = getNode("#changeButton");

/**************************
 * On page load events
 **************************/

// Connection to start html page server source
const SERVER_URL = window.location.hostname;
const socket = io.connect (SERVER_URL);

// Retrieve user reference from session storage
const ss_user_email = sessionStorage.getItem("ss_user_profile");
socket.emit("getProfile", ss_user_email);

/**************************
 * From server side events
 **************************/

// Fires to show server message
socket.on("alert", (msg) =>{
  alert(msg);
});

// Fills page fields by server's data
socket.on("setProfile", (profile) => {
  USER_LABEL.innerHTML = profile.user_email;
  PASSWORD_INPUT.value = profile.password;
  PROFILE_INPUT.value = profile.emailTemplate;

  // Confirm that fields modification is accepted by server
  PASSWORD_INPUT.style.border = "none";
  PROFILE_INPUT.style.border = "none";
});

/**************************
 * Page side events
 **************************/

// Initiates user message sending on Enter key due to input focus
PASSWORD_INPUT.addEventListener ("keypress", changeProfile);
PROFILE_INPUT.addEventListener ("keypress", changeProfile);

// Point user that he changed field's value
PASSWORD_INPUT.addEventListener ("input", changeBorder);
PROFILE_INPUT.addEventListener ("input", changeBorder);

// Sends to server modificated users profile data
CHANGE_BUTTON.addEventListener("click", (event) => {
  // Check for empty fields
  if (PASSWORD_INPUT.value === "" || PROFILE_INPUT.value === "") {
    alert("Whoops, you missed one!");
    return;
  }

  const profile_obj = {
    user_email: USER_LABEL.innerHTML,
    password: PASSWORD_INPUT.value,
    emailTemplate: PROFILE_INPUT.value
  };

  socket.emit("setProfile", profile_obj);
});


/**************************
 * Declarations
 **************************/

// Sends profile data on pressed Enter key
function changeProfile(event) {
  const ENTER_KEY = 13;
  if (event.keyCode === ENTER_KEY) {

    // Checks for empty fields
    if (PASSWORD_INPUT.value === "" || PROFILE_INPUT.value === "") {
      alert("Whoops, you missed one!");
      return;
    }

    const profile_obj = {
      user_email: USER_LABEL.innerHTML,
      password: PASSWORD_INPUT.value,
      emailTemplate: PROFILE_INPUT.value
    };

    // send the values to the server
    socket.emit("setProfile", profile_obj);
  }
}

function changeBorder() {
  this.style.border = "5px solid red";
}
