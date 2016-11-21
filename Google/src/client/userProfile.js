"use strict";

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

// Retrieve user reference from session storage
//const ss_user_email = sessionStorage.getItem("ss_user_profile");
function getProfileData() {
  const ss_user_email = sessionStorage.getItem("ss_user_profile");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/getUserProfileHandler/" +  encodeURIComponent(ss_user_email), true);

  xhr.onreadystatechange = function () {
    if (this.readyState != 4) {
      return;
    }

    if (this.status != 200) {
      // обработать ошибку
      alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
      return;
    }else{
      var profile = JSON.parse(this.responseText);
      USER_LABEL.innerHTML = profile.user_email;
      PASSWORD_INPUT.value = profile.password;
      PROFILE_INPUT.value = profile.emailTemplate;

      PASSWORD_INPUT.style.border = "none";
      PROFILE_INPUT.style.border = "none";
    }
  };

  xhr.send();
}

document.addEventListener("DOMContentLoaded", getProfileData);

/**************************
 * Page side events
 **************************/

// Initiates user message sending on Enter key due to input focus
PASSWORD_INPUT.addEventListener ("keypress", function (event) {
  const ENTER_KEY = 13;
  if (event.keyCode === ENTER_KEY) {
    sendModifiedProfile(function (res) {
      alert(res);
      getProfileData();
    })
  }
});

PROFILE_INPUT.addEventListener ("keypress", function (event) {
  const ENTER_KEY = 13;
  if (event.keyCode === ENTER_KEY) {
    sendModifiedProfile(function (res) {
      alert(res);
      getProfileData();
    })
  }
});

// Point user that he changed field's value
PASSWORD_INPUT.addEventListener ("input", changeBorder);
PROFILE_INPUT.addEventListener ("input", changeBorder);

// Sends to server modificated users profile data
CHANGE_BUTTON.addEventListener("click", function (event) {
  sendModifiedProfile(function(res){
    alert(res);
    getProfileData();
  })
});

/**************************
 * Declarations
 **************************/

// Sends profile data on pressed Enter key
function sendModifiedProfile(callBack) {
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

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/setUserProfile", true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  xhr.onreadystatechange = function () {
    if (this.readyState != 4) {
      return;
    }

    if (this.status != 200) {
      var err = ('ERROR: ' + (this.status ? this.statusText : 'REQUEST FAILED'));
      alert(err);
    }else{
      if(this.responseText){
        callBack(this.responseText);
      } else {
        callBack("REQUEST SUCCESS");
      }
    }
  };

  xhr.send(JSON.stringify(profile_obj));
}

function changeBorder() {
  this.style.border = "5px solid red";
}
