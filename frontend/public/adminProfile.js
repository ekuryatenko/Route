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
  handleRequestError,
  httpGet,
  httpPost,
  getNode,
  makeRedBorder,
  removeBorder
} from './clientLib';

/** ************************
 * Get page fields
 **************************/

const BASE_USERS_LIST = getNode('#usersList');
const TEMPLATE_TEXT_FIELD = getNode('#templateText');
const CHANGE_BUTTON = getNode('#changeButton');
const SEND_TO_ALL_BUTTON = getNode('#sendButton');

/** ************************
 * On page load events
 ** ************************/

// Requests server for page data and put them to page nodes
getPageContentFromServer();

/** ************************
 * Page nodes events
 ** ************************/

// Shows changes on text template field
TEMPLATE_TEXT_FIELD.addEventListener('input', makeRedBorder);

// Sends to server modificated template text for saving
CHANGE_BUTTON.addEventListener('click', sendNewTemplateToServer);

// Initiates emails sending to every user
SEND_TO_ALL_BUTTON.addEventListener('click', sendEmailToAll);

/** ************************
 * Declarations
 ** ************************/

/**
 * Fills page fields by content data from param
 * @param {Object} pageContent - Page content from server
 */
function setAdminPageContent(pageContent) {
  TEMPLATE_TEXT_FIELD.value = pageContent.templateText;

  pageContent.usersList.forEach((item) => {
    if(!item.userEmail) return;

    if (item.userEmail.toUpperCase() !== 'ADMIN') {
      const newLi = document.createElement('li');

      const newA = document.createElement('a');
      newA.href = '#';
      newA.innerHTML = `${item.userEmail}: ${item.password}`;
      newA.name = item.userEmail;

      newLi.appendChild(newA);
      BASE_USERS_LIST.appendChild(newLi);

      // Realize user removing
      newA.addEventListener('click', () => {
        if (confirm(`DO YOU WANT TO DELETE ${newA.name}?`)) {
          const qty = (BASE_USERS_LIST.childNodes.length);

          for (let i = 0; i < qty; i += 1) {
            BASE_USERS_LIST.removeChild(BASE_USERS_LIST.firstChild);
          }

          httpGet(`/removeUserProfile/${encodeURIComponent(newA.name)}`)
            .then(
              (response) => {
                const newPageContent = JSON.parse(response);
                setAdminPageContent(newPageContent);
              },
              (error) => {
                handleRequestError(error);
              }
          );
        }
      });
    }
  });
}

/**
 * Request page content from server and fills
 * page fields by obtained data
 */
function getPageContentFromServer() {
  httpGet('/getAdminPageContent')
    .then(
    (response) => {
      const pageContent = JSON.parse(response);
      setAdminPageContent(pageContent);
    },
    (error) => {
      handleRequestError(error);
    }
  );
}

/**
 * Sends template text to server
 */
function sendNewTemplateToServer() {
  const newText = TEMPLATE_TEXT_FIELD.value;

  const newTemplate = {
    version: '1',
    text: newText
  };

  httpPost('/updateAdminTemplate', JSON.stringify(newTemplate))
    .then(
      (response) => {
        alert(`SERVER RESPONSE: ${response}`);
        removeBorder(TEMPLATE_TEXT_FIELD);
      },
      (error) => {
        handleRequestError(error);
      }
  );
}

/**
 * Sends to server request of emails sending
 * to all users
 */
async function sendEmailToAll() {
  // TODO: couldn't realize makeRedBorder() from clientLib here
  SEND_TO_ALL_BUTTON.style.border = '5px solid red';
  const oldValue = SEND_TO_ALL_BUTTON.value;
  SEND_TO_ALL_BUTTON.value = 'Sending...';
  try {
    const res = await httpGet('/sendEmailToAll');
    removeBorder(SEND_TO_ALL_BUTTON);
    SEND_TO_ALL_BUTTON.value = oldValue;
    return alert(res);
  } catch(err) {
    SEND_TO_ALL_BUTTON.value = oldValue;
    return alert('ERROR');
  }
}
