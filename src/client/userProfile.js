"use strict";

/**************************
 * Get page fields
 **************************/

// Get the page nodes
const USER_LABEL = getNode("#userLabel");
const PASSWORD_INPUT = getNode("#passwordInput");
const PROFILE_INPUT = getNode("#profileInput");
const CHANGE_BUTTON = getNode("#changeButton");

/**************************
 * On page load events
 **************************/

document.addEventListener("DOMContentLoaded", getProfileData);

/**************************
 * Page nodes events
 **************************/

// Initiates user message sending on Enter key due to input focus
PASSWORD_INPUT.addEventListener ("keypress", changeProfileOnEnterKey);
PROFILE_INPUT.addEventListener ("keypress", changeProfileOnEnterKey);

// Point user that he changed field's value
PASSWORD_INPUT.addEventListener ("input", changeBorder);
PROFILE_INPUT.addEventListener ("input", changeBorder);

// Sends to server modificated users profile data
CHANGE_BUTTON.addEventListener("click", changeProfileOnServerSide);

/**************************
 * Declarations
 **************************/

// Returns reference to selector page object
function getNode(selector) {
  return document.querySelector(selector);
}

function getProfileData() {
  // Retrieve user reference from session storage
  const ss_user_email = sessionStorage.getItem("ss_user_profile");

  httpGet("/getUserProfileHandler/" +  encodeURIComponent(ss_user_email))
    .then(
      response => {
      const profile = JSON.parse(response);
      USER_LABEL.innerHTML = profile.user_email;
      PASSWORD_INPUT.value = profile.password;
      PROFILE_INPUT.value = profile.emailTemplate;

      PASSWORD_INPUT.style.border = "none";
      PROFILE_INPUT.style.border = "none";
    },
      error => {
      //Handle error
      alert("REJECTED: " + error + " " + error.code);
    }
  );
}

function changeProfileOnServerSide() {
  sendModifiedProfile()
    .then(
      response => {
        alert("SERVER RESPONSE: " + response);
        getProfileData();
    },
      error => {
        alert("REJECTED: " + error + " " + error.code);
    }
  );
}

// Sends profile data on pressed Enter key
function sendModifiedProfile() {
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

  return httpPost("/setUserProfile", JSON.stringify(profile_obj));
}

function changeProfileOnEnterKey(event) {
  const ENTER_KEY = 13;
  if (event.keyCode === ENTER_KEY) {
    changeProfileOnServerSide();
  }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.responseText);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });
}

function httpPost(url, stringToPost) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.responseText);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };

    xhr.send(stringToPost);
  });
}

function changeBorder() {
  this.style.border = "5px solid red";
}
