"use strict";

/**
 * TODO: remove "connected to data base" from server
 * TODO: Save previous field values for case of failed requests
 *
 * TODO: comments for each function (params...)
 * TODO: edit everything due to ES6
 * TODO: Search Webpack for Promises
 *
 * TODO: route sendToAll function from button
 *
 * TODO: Use Generators instead of promise...then chains
 * TODO: Search Webpack for Generators
 */

/**************************
 * Get page fields
 **************************/

// Get the page nodes
const BASE_USERS_LIST = getNode("#usersList");
const TEMPLATE_TEXT_FIELD = getNode("#templateText");
const CHANGE_BUTTON = getNode("#changeButton");
const SEND_TO_ALL_BUTTON = getNode("#sendButton");
const DELETE_USER_SELECT = getNode("#deleteUser");

/**************************
 * On page load events
 **************************/

// Requests server for page data and put them to page nodes
getPageContentFromServer();

/**************************
 * Page nodes events
 **************************/

// Shows changes on text template field
TEMPLATE_TEXT_FIELD.addEventListener("input", makeRedBorder);

// Sends to server modificated template text for saving
CHANGE_BUTTON.addEventListener("click", sendNewTemplateToServer);

// Initiates emails sending to every user
SEND_TO_ALL_BUTTON.addEventListener("click", () => {
  //TODO: ("sendToAll");
});

/**************************
 * Declarations
 **************************/

// Returns reference to selector page object
function getNode(selector) {
  return document.querySelector(selector);
}

function getPageContentFromServer() {
  httpGet("/getAdminPageContent")
    .then(
      response => {
        let pageContent = JSON.parse(response);
        setAdminPageContent(pageContent);
    },
      error => {
        //Handle error
        alert("REJECTED: " + error + " " + error.code);
    }
  );
}

// Initial page data loading
function setAdminPageContent(pageContent) {
  TEMPLATE_TEXT_FIELD.value = pageContent.templateText;

  pageContent.usersList.forEach((item) => {
    if (item.user_email.toUpperCase() != "ADMIN") {
      const newLi = document.createElement("li");

      const newA = document.createElement("a");
      newA.href = "#";
      newA.innerHTML = item.user_email + ": " + item.password;
      newA.name = item.user_email;

      newLi.appendChild(newA);
      BASE_USERS_LIST.appendChild(newLi);

      // Realize user removing
      newA.addEventListener("click", () => {
        if (confirm("Do you want delete " + newA.name + "?")) {
          let qty = (BASE_USERS_LIST.childNodes.length);

          for (var i = 0; i < qty; i++) {
            BASE_USERS_LIST.removeChild(BASE_USERS_LIST.firstChild);
          }

          httpGet("/removeUserProfile/" + encodeURIComponent(newA.name))
            .then(
              response => {
                let newPageContent = JSON.parse(response);
                setAdminPageContent(newPageContent);
            },
              error => {
                //Handle error
                alert("REJECTED: " + error + " " + error.code);
            }
          );
        }
      });
    }
  });
}

function sendNewTemplateToServer() {
  const newText = TEMPLATE_TEXT_FIELD.value;

  const newTemplate = {
    version: "1",
    text: newText
  };

  httpPost("/updateAdminTemplate", JSON.stringify(newTemplate))
    .then(
      response => {
        alert("SERVER RESPONSE: " + response);
        removeBorder(TEMPLATE_TEXT_FIELD);
    },
      error => {
        alert("REJECTED: " + error + " " + error.code);
    }
  );
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

function makeRedBorder() {
  this.style.border = "5px solid red";
}

function removeBorder(field) {
  field.style.border = "none";
}


