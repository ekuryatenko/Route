/** ======================
 * Get page fields
 * =======================*/

// selector function
var getNode = function(s) {
  return document.querySelector(s);
};

// get the form nodes
var BASE_USERS_LIST = getNode('#usersList'),
  TEMPLATE_TEXT_FIELD = getNode('#templateText'),
  CHANGE_BUTTON = getNode('#changeButton');

/** ======================
 * On page load events
 * =======================*/

var SERVER_URL = window.location.hostname;
var socket = io.connect (SERVER_URL);

var ss_user_email = sessionStorage.getItem('ss_user_profile');
socket.emit('getAdmin', ss_user_email);

/** ======================
 * From server side events
 * =======================*/

// Server notifications to user
socket.on('alert', function(msg){
  alert(msg);
});

// alert error messages returned from the server
socket.on('setAdmin', function(profile){

  for(var item of profile){
    if(item.user_email.toUpperCase() != "ADMIN") {
      var newLi = document.createElement ("li");
      newLi.innerHTML = item.user_email + ": " + item.pass;
      BASE_USERS_LIST.appendChild (newLi);
    }
  }

});

/** ======================
 * Page side events
 * =======================*/

TEMPLATE_TEXT_FIELD.addEventListener ("input", changeBorder);

CHANGE_BUTTON.addEventListener('click', function(event){
  var newText = TEMPLATE_TEXT_FIELD.value;

  var newTemplate = {
    version: "1",
    text: newText
  };

  socket.emit('updateTemplate', newTemplate);

  TEMPLATE_TEXT_FIELD.style.border = "none";
});

/** ======================
 * Declarations
 * =======================*/

function changeBorder() {
  this.style.border = "5px solid red";
}


