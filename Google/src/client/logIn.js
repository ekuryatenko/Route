/**************************
 * Get page fields
 **************************/
/**
 * - Как прятать-шифровать URL с паролем при отправке на сервер
 * */
// Returns reference to selector page object
const getNode = (selector) => {
  return document.querySelector(selector);
};

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
  // Variables to send to the server
  const user_email = USER_EMAIL_INPUT.value;
  const fpass = FPASS_INPUT.value;
  event.preventDefault();
  submitForm(user_email, fpass);
});

// Initiates signin page loading on button click
SIGNIN_BUTTON.addEventListener("click", () => {
  USER_EMAIL_INPUT.value = "";
  FPASS_INPUT.value = "";

  window.location.href = "/signInForm.html";
});

/**************************
 * Declarations
 **************************/

function submitForm(user_email, fpass) {
  var xhr = new XMLHttpRequest();

  //There are no JSON need to retrieve fields values on server with such request
  var body = 'user_email=' + encodeURIComponent(user_email) +
    '&fpass=' + encodeURIComponent(fpass);

  //Async request
  xhr.open("POST", '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  //Server reply handler
  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;

    if (this.status != 200) {
      // обработать ошибку
      alert( 'ERROR: ' + (this.status ? this.statusText : 'REQUEST FAILED') );
      return;
    }

    var toDoList = JSON.parse(this.responseText);

    toDoList.forEach((item) => {
      handleServerReply(user_email, item);
    })
  };

  xhr.send(body);
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
