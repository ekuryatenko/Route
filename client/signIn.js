/** ======================
 * Get page fields
 * =======================*/

// Selector function
var getNode = function(s) {
  return document.querySelector(s);
};

// Get the form nodes
var user_email_input = getNode('#user_email_input'),
  fpass_input = getNode('#password_first'),
  cpass_input = getNode('#password_confirm');

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
socket.on('clean-form', function(){
  user_email_input.value = '';
  fpass_input.value = '';
  cpass_input.value = '';
});

// Switches user to destination page
socket.on('redirect', function(destination) {
  //It was impossible to save whole profile object in sessionStorage
  var signIn_obj = socket.profile.user_email;

  sessionStorage.setItem('ss_user_profile', signIn_obj);

  window.location.href = destination;
});


/** ======================
 * Page events
 * =======================*/

// add the event listener for the login submit button
submit_button.addEventListener('click', function(event){
  // create variables to send to the server and assign them values
  var user_email = user_email_input.value,
    fpass = fpass_input.value,
    cpass = cpass_input.value;

  var signIn_obj = {
    user_email: user_email,
    fpass: fpass,
    cpass: cpass
  };

  socket.profile = signIn_obj;

  // send the values to the server
  socket.emit('signIn', signIn_obj);

  event.preventDefault();
});
