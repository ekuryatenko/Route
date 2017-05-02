import {
  handleRequestError,
  httpGet,
  httpPost,
  getNode,
  makeRedBorder
} from './clientLib';

/** ************************
 * Get page fields
 ** ************************/

const USER_LABEL = getNode('#userLabel');
const PASSWORD_INPUT = getNode('#passwordInput');
const PROFILE_INPUT = getNode('#profileInput');
const CHANGE_BUTTON = getNode('#changeButton');

/** ************************
 * On page load events
 ** ************************/

document.addEventListener('DOMContentLoaded', getProfileData);//TODO: modify or include this in other files

/** ************************
 * Declarations
 ** ************************/

/**
 * Asks server for this session user data and fills page fields
 */
function getProfileData() {
  // Retrieve user reference from session storage
  const ssUserEmail = sessionStorage.getItem('ss_user_profile');

  httpGet(`/getUserProfileHandler/${encodeURIComponent(ssUserEmail)}`)
    .then(
      (response) => {
        const profile = JSON.parse(response);
        USER_LABEL.innerHTML = profile.userEmail;
        PASSWORD_INPUT.value = profile.password;
        PROFILE_INPUT.value = profile.emailTemplate;

        PASSWORD_INPUT.style.border = 'none';
        PROFILE_INPUT.style.border = 'none';
      },
      (error) => {
        handleRequestError(error);
      }
  );
}

/**
 * Sends profile data to server
 */
function sendModifiedProfile() {
  // Checks for empty fields
  if (PASSWORD_INPUT.value === '' || PROFILE_INPUT.value === '') {
    alert('Whoops, you missed one!');
    return undefined;
  }

  const profileObj = {
    userEmail: USER_LABEL.innerHTML,
    password: PASSWORD_INPUT.value,
    emailTemplate: PROFILE_INPUT.value
  };

  return httpPost('/setUserProfile', JSON.stringify(profileObj));
}
/**
 * Sends profile fields to server and refreshes page after
 * server updating
 */
function changeProfileOnServerSide() {
  sendModifiedProfile()
    .then(
      (response) => {
        alert(`SERVER RESPONSE: ${response}`);// TODO: include 'SERVER RESPONSE: " to all files
        getProfileData();
      },
      (error) => {
        handleRequestError(error);
      }
  );
}

/**
 * Waits for enter key and modifies profile on server and client then
 * @param {Event} event
 */
function changeProfileOnEnterKey(event) {
  const ENTER_KEY = 13;
  if (event.keyCode === ENTER_KEY) {
    changeProfileOnServerSide();
  }
}

/** ************************
 * Page nodes events
 ** ************************/

// Initiates user message sending on Enter key due to input focus
PASSWORD_INPUT.addEventListener('keypress', changeProfileOnEnterKey);
PROFILE_INPUT.addEventListener('keypress', changeProfileOnEnterKey);

// Points to user that he changed field's value
PASSWORD_INPUT.addEventListener('input', makeRedBorder);
PROFILE_INPUT.addEventListener('input', makeRedBorder);

// Sends to server modificated users profile data
CHANGE_BUTTON.addEventListener('click', changeProfileOnServerSide);
