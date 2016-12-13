"use strict";

/**
 * TODO: sort items in import
 * TODO: edit everything due to ES6
 * TODO: route sendToAll function from button
 *
 * TODO: Search Webpack for Promises
 * TODO: Save previous field values for case of failed requests
 * TODO: Use Generators instead of promise...then chains
 * TODO: Search Webpack for Generators
 */

import {
  httpGet,
  httpPost,
  getNode,
  makeRedBorder,
  removeBorder,
  handleRequestError
} from "./clientLib.js";

/**************************
 * Get page fields
 **************************/

const BASE_USERS_LIST     = getNode("#usersList");
const TEMPLATE_TEXT_FIELD = getNode("#templateText");
const CHANGE_BUTTON       = getNode("#changeButton");
const SEND_TO_ALL_BUTTON  = getNode("#sendButton");

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

/**
 * Request page content from server and fills
 * page fields by obtained data
 */
function getPageContentFromServer() {
  httpGet("/getAdminPageContent")
    .then(
      response => {
        let pageContent = JSON.parse(response);
        setAdminPageContent(pageContent);
    },
      error => {
        handleRequestError(error);
    }
  );
}

/**
 * Fills page fields by content data from param
 * @param {Object} pageContent - Page content from server
 */
function setAdminPageContent(pageContent) {
  TEMPLATE_TEXT_FIELD.value = pageContent.templateText;

  pageContent.usersList.forEach((item) => {
    if (item.user_email.toUpperCase() != "ADMIN") {
      const newLi = document.createElement("li");

      const newA = document.createElement("a");
      newA.href = "#";
      newA.innerHTML = `${item.user_email}: ${item.password}`;
      newA.name = item.user_email;

      newLi.appendChild(newA);
      BASE_USERS_LIST.appendChild(newLi);

      // Realize user removing
      newA.addEventListener("click", () => {
        if (confirm(`DO YOU WANT TO DELETE ${newA.name}?`)) {
          let qty = (BASE_USERS_LIST.childNodes.length);

          for (var i = 0; i < qty; i++) {
            BASE_USERS_LIST.removeChild(BASE_USERS_LIST.firstChild);
          }

          httpGet(`/removeUserProfile/${encodeURIComponent(newA.name)}`)
            .then(
              response => {
                let newPageContent = JSON.parse(response);
                setAdminPageContent(newPageContent);
            },
              error => {
                handleRequestError(error);
            }
          );
        }
      });
    }
  });
}

/**
 * Sends template text to server
 */
function sendNewTemplateToServer() {
  const newText = TEMPLATE_TEXT_FIELD.value;

  const newTemplate = {
    version: "1",
    text: newText
  };

  httpPost("/updateAdminTemplate", JSON.stringify(newTemplate))
    .then(
      response => {
        alert(`SERVER RESPONSE: ${response}`);
        removeBorder(TEMPLATE_TEXT_FIELD);
    },
      error => {
        handleRequestError(error);
    }
  );
}
