/**************************
 * Get page fields
 **************************/

// Returns reference to selector page object
const getNode = (selector) => {
  return document.querySelector(selector);
};

// Get the page nodes
const USER_EMAIL_INPUT = getNode("#user_email_input");
const FPASS_INPUT = getNode("#password_first");
const CPASS_INPUT = getNode("#password_confirm");
const SIGNIN_BUTTON = getNode("#signInButton");

/**************************
 * Page events
 **************************/

// Initiates signin server process
SIGNIN_BUTTON.addEventListener("click", (event) => {
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
});

/**************************
 * Declarations
 **************************/

function submitForm(signIn_obj) {
  var xhr = new XMLHttpRequest();

  //There are no JSON need to retrieve fields values on server with such request
  var body = 'user_email=' + encodeURIComponent(signIn_obj.user_email) +
    '&fpass=' + encodeURIComponent(signIn_obj.fpass);

  //Async request
  xhr.open("POST", '/signIn', true);
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
      handleServerReply(signIn_obj.user_email, item);
    })
  };

  xhr.send(body);
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
