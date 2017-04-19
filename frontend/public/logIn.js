import {
  handleRequestError,
  httpPostForm,
  getNode
} from './clientLib';

/** ************************
 * Get page fields
 ** ************************/

const USER_EMAIL_INPUT = getNode('#user_email_input');
const FPASS_INPUT = getNode('#password_first');
const LOGIN_BUTTON = getNode('#logInButton');
const SIGNIN_BUTTON = getNode('#signInButton');

/** ************************
 * Declarations
 ** ************************/

/**
 * Prepares request and sends login user data to server
 * @param {String} userEmail
 * @param {String} fpass
 */
function submitForm(userEmail, fpass) {
  // There are no JSON need to retrieve fields values on server with such request
  const requestBody = `user_email=${encodeURIComponent(userEmail)}` +
    `&fpass=${encodeURIComponent(fpass)}`;

  return httpPostForm('/login', requestBody);
}

/**
 * Handles server reply
 * @param {String} userEmail
 * @param {JSON} serverReply - Server's commands to do
 */
function handleServerReply(userEmail, serverReply) {
  if (serverReply.action === 'redirect') {
    USER_EMAIL_INPUT.value = '';
    FPASS_INPUT.value = '';
    sessionStorage.setItem('ss_user_profile', userEmail);

    window.location.href = serverReply.href;
  } else if (serverReply.action === 'cleanForm') {
    USER_EMAIL_INPUT.value = '';
    FPASS_INPUT.value = '';
  } else if (serverReply.action === 'alert') {
    alert(serverReply.msg);
  } else {
    alert('UNKNOWN SERVER REPLY');
  }
}

/**
 * Sends form fields to server and handles server response then
 * @param {Event} event
 */
function submitFormToServer(event) {
  const userEmail = USER_EMAIL_INPUT.value;
  const fpass = FPASS_INPUT.value;

  event.preventDefault();

  submitForm(userEmail, fpass)
    .then(
      (response) => {
        const toDoList = JSON.parse(response);

        toDoList.forEach((item) => {
          handleServerReply(userEmail, item);
        });
      },
      (error) => {
        handleRequestError(error);
      }
  );
}

/**
 * Redirect client page into new hyper reference
 * @param {String} href
 */
function redirectToHref(href) {
  USER_EMAIL_INPUT.value = '';
  FPASS_INPUT.value = '';

  window.location.href = href;
}

/** ************************
 * Page side events
 ** ************************/

// Initiates login data sending to server on submit button
LOGIN_BUTTON.addEventListener('click', (event) => {
  submitFormToServer(event);
});

// Initiates signin page loading on button click
SIGNIN_BUTTON.addEventListener('click', (event) => {
  redirectToHref('/signInForm.html');
});
