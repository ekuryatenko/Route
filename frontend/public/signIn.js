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
const CPASS_INPUT = getNode('#password_confirm');
const SIGNIN_BUTTON = getNode('#signInButton');

/** ************************
 * Declarations
 ** ************************/

/**
 * Prepares request and sends user's sign in data to server
 * @param {String} userEmail
 * @param {String} fpass
 */
function submitForm(userEmail, fpass) {
  // There are no JSON need to retrieve fields values on server with such request
  const requestBody = `user_email=${encodeURIComponent(userEmail)}` +
    `&fpass=${encodeURIComponent(fpass)}`;

  return httpPostForm('/signIn', requestBody);
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
    CPASS_INPUT.value = '';
    sessionStorage.setItem('ss_user_profile', userEmail);
    window.location.href = serverReply.href;
  } else if (serverReply.action === 'cleanForm') {
    USER_EMAIL_INPUT.value = '';
    FPASS_INPUT.value = '';
    CPASS_INPUT.value = '';
  } else if (serverReply.action === 'alert') {
    alert(serverReply.msg);
  } else {
    alert('UNKNOWN SERVER REPLY');
  }
}

/**
 * Makes previous checking of form fields,
 * sends them to server and handles server response then
 * @param {Event} event
 */
function submitFormToServer(event) {
  const userEmail = USER_EMAIL_INPUT.value;
  const fpass = FPASS_INPUT.value;
  const cpass = CPASS_INPUT.value;

  // Check for empty fields
  if (userEmail === '' || cpass === '' || fpass === '') {
    alert('YOU MISSED TO FILL SOME FIELDS!');
    return;
  }

  // Check for matching passwords
  if (fpass !== cpass) {
    alert('YOUR PASSWORDS DON\'T MATCH!');
    return;
  }

  // Prevents page reloading
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

/** ************************
 * Page nodes events
 ** ***********************/

// Initiates signin server process
SIGNIN_BUTTON.addEventListener('click', submitFormToServer);
