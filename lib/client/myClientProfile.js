// Connection to start html page server source
var SERVER_URL = window.location.hostname;

var socket = io.connect (SERVER_URL);

var ss_user_email = sessionStorage.getItem('ss_user_profile');
socket.emit('getProfile', ss_user_email);

// selector function
var getNode = function(s) {
  return document.querySelector(s);
};

var userLabel = getNode('#userLabel');
var passwordInput = getNode('#passwordInput');
var profileInput = getNode('#profileInput');

socket.on("setProfile", function(profile){
  userLabel.innerHTML = profile.user_email;
  passwordInput.value = profile.password;
  profileInput.value = profile.emailTemplate;
});


