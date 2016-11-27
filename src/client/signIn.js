"use strict";

/**************************
 * Get page fields
 **************************/

// Get the page nodes
const USER_EMAIL_INPUT = getNode("#user_email_input");
const FPASS_INPUT = getNode("#password_first");
const CPASS_INPUT = getNode("#password_confirm");
const SIGNIN_BUTTON = getNode("#signInButton");

/**************************
 * Page nodes events
 **************************/

// Initiates signin server process
SIGNIN_BUTTON.addEventListener("click", submitFormToServer);

/**************************
 * Declarations
 **************************/

// Returns reference to selector page object
function getNode(selector){
  return document.querySelector(selector);
}

function submitFormToServer(event) {
  const user_email = USER_EMAIL_INPUT.value;
  const fpass = FPASS_INPUT.value;
  const cpass = CPASS_INPUT.value;

  // Check for empty fields
  if (user_email === '' || cpass === '' || fpass === '') {
    alert('YOU MISSED TO FILL SOME FIELDS!');
    return;
  }

  // Check for matching passwords
  if (fpass !== cpass) {
    alert('YOUR PASSWORDS DON\'T MATCH!');
    return;
  }

  const signIn_obj = {
    user_email: user_email,
    fpass: fpass,
    cpass: cpass
  };
  // Prevents page reloading
  event.preventDefault();

  submitForm(signIn_obj);
}

function submitForm(signIn_obj) {
  //There are no JSON need to retrieve fields values on server with such request
  var requestBody = 'user_email=' + encodeURIComponent(signIn_obj.user_email) +
    '&fpass=' + encodeURIComponent(signIn_obj.fpass);

  httpPostForm('/signIn', requestBody)
    .then(
      response => {
      const toDoList = JSON.parse(response);

      toDoList.forEach((item) => {
        handleServerReply(signIn_obj.user_email, item);
      });
    },
      error => {
      //Handle error
      alert("REJECTED: " + error + " " + error.code);
    }
  );
}

function httpPostForm(url, stringToPost) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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

function handleServerReply(user_email, serverReply){
  if(serverReply.action == "redirect"){
    USER_EMAIL_INPUT.value = "";
    FPASS_INPUT.value = "";
    CPASS_INPUT.value = "";
    sessionStorage.setItem("ss_user_profile", user_email);
    window.location.href = serverReply.href;
  } else if(serverReply.action == "cleanForm"){
    USER_EMAIL_INPUT.value = "";
    FPASS_INPUT.value = "";
    CPASS_INPUT.value = "";
  } else if(serverReply.action == "alert"){
    alert(serverReply.msg);
  } else {
    alert("UNKNOWN SERVER REPLY");
  }
}
