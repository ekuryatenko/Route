"use strict";

/**
 * TODO: Как прятать-шифровать URL с паролем при отправке на сервер
 * TODO: Reload page in case of failed requests
 * TODO: Strings, comments, refactoring
 */

/**************************
 * Get page fields
 **************************/

// Get the page nodes
const USER_EMAIL_INPUT = getNode("#user_email_input");
const FPASS_INPUT = getNode("#password_first");
const LOGIN_BUTTON = getNode("#logInButton");
const SIGNIN_BUTTON = getNode("#signInButton");
const FORM = getNode("#myform");

/**************************
 * Page side events
 **************************/

// Initiates login data sending to server on submit button
LOGIN_BUTTON.addEventListener('click', (event) => {
  submitFormToServer(event);
});

// Initiates signin page loading on button click
SIGNIN_BUTTON.addEventListener("click", (event) => {
  redirectToHref("/signInForm.html");
});

/**************************
 * Declarations
 **************************/

// Returns reference to selector page object
function getNode(selector){
  return document.querySelector(selector);
}

function submitFormToServer(event){
  // Variables to send to the server
  const user_email = USER_EMAIL_INPUT.value;
  const fpass = FPASS_INPUT.value;

  event.preventDefault();

  submitForm(user_email, fpass);
}

function redirectToHref(href){
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";

  window.location.href = href;
}

function submitForm(user_email, fpass) {
  //There are no JSON need to retrieve fields values on server with such request
  const requestBody = 'user_email=' + encodeURIComponent(user_email) +
    '&fpass=' + encodeURIComponent(fpass);

  httpPostForm('/login', requestBody)
    .then(
      response => {
        const toDoList = JSON.parse(response);

        toDoList.forEach((item) => {
          handleServerReply(user_email, item);
        });
      },
      error => {
        //Handle error
        alert("REJECTED: " + error + " " + error.code);
    }
  );
}

function handleServerReply(user_email, serverReply){
  if(serverReply.action == "redirect"){
    USER_EMAIL_INPUT.value = "";
    FPASS_INPUT.value = "";
    sessionStorage.setItem("ss_user_profile", user_email);

    window.location.href = serverReply.href;
  } else if(serverReply.action == "cleanForm"){
    USER_EMAIL_INPUT.value = "";
    FPASS_INPUT.value = "";
  } else if(serverReply.action == "alert"){
    alert(serverReply.msg);
  } else {
    alert("UNKNOWN SERVER REPLY");
  }
}

// Makes form-urlencoded request header
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
