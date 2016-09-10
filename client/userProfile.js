/** ======================
 * Get page fields
 * =======================*/
// selector function
var getNode = function(s) {
  return document.querySelector(s);
};

var userLabel = getNode('#userLabel');
var PASSWORD_INPUT = getNode('#passwordInput');
var PROFILE_INPUT = getNode('#profileInput');
var CHANGE_BUTTON = getNode('#changeButton');

/** ======================
 * On page load events
 * =======================*/

// Connection to start html page server source
var SERVER_URL = window.location.hostname;
var socket = io.connect (SERVER_URL);

var ss_user_email = sessionStorage.getItem('ss_user_profile');
socket.emit('getProfile', ss_user_email);

/** ======================
 * From server side events
 * =======================*/

// Fills page fields by server's data
socket.on("setProfile", function(profile){
  userLabel.innerHTML = profile.user_email;
  PASSWORD_INPUT.value = profile.password;
  PROFILE_INPUT.value = profile.emailTemplate;

  // Confirm that fields modification is accepted by server
  PASSWORD_INPUT.style.border = "none";
  PROFILE_INPUT.style.border = "none";
});

// Server notifications to user
socket.on('alert', function(msg){
  alert(msg);
});

/** ======================
 * Page side events
 * =======================*/

// Initiates user message sending on Enter key due to input focus
PASSWORD_INPUT.addEventListener ("keypress", changeProfile);
PROFILE_INPUT.addEventListener ("keypress", changeProfile);

// Point user that he changed field's value
PASSWORD_INPUT.addEventListener ("input", changeBorder);
PROFILE_INPUT.addEventListener ("input", changeBorder);

CHANGE_BUTTON.addEventListener('click', function(event){
  var newText = PROFILE_INPUT.value;

  // check for empty fields
  if (PASSWORD_INPUT.value === '' || PROFILE_INPUT.value === '') {
    alert('Whoops, you missed one!');
    return;
  }

  var profile_obj = {
    user_email: userLabel.innerHTML,
    fpass: PASSWORD_INPUT.value,
    emailTemplate: PROFILE_INPUT.value
  };

  // send the values to the server
  socket.emit('setProfile', profile_obj);
});


/** ======================
 * Declarations
 * =======================*/

function changeProfile(event) {
  var ENTER_KEY = 13;
  if (event.keyCode === ENTER_KEY) {

    // check for empty fields
    if (PASSWORD_INPUT.value === '' || PROFILE_INPUT.value === '') {
      alert('Whoops, you missed one!');
      return;
    }

    var profile_obj = {
      user_email: userLabel.innerHTML,
      fpass: PASSWORD_INPUT.value,
      emailTemplate: PROFILE_INPUT.value
    };

    // send the values to the server
    socket.emit('setProfile', profile_obj);

  }
}

function changeBorder() {
  this.style.border = "5px solid red";
}
