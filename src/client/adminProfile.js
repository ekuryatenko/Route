/**************************
 * Get page fields
 **************************/

// Returns reference to selector page object
var getNode = (selector) => {
  return document.querySelector(selector);
};

// Get the page nodes
const BASE_USERS_LIST = getNode("#usersList");
const TEMPLATE_TEXT_FIELD = getNode("#templateText");
const CHANGE_BUTTON = getNode("#changeButton");
const SEND_TO_ALL_BUTTON = getNode("#sendButton");

/**************************
 * On page load events
 **************************/

// Connection to start html page server source
const SERVER_URL = window.location.hostname;
const socket = io.connect(SERVER_URL);

// Retrieve user reference from session storage
const ss_user_email = sessionStorage.getItem("ss_user_profile");
socket.emit("getAdmin", ss_user_email);

/**************************
 * From server side events
 **************************/

// Fires to show server message
socket.on("alert", (msg) => {
  alert(msg);

  // It was simple to modify text field here
  TEMPLATE_TEXT_FIELD.style.border = "none";
});

// Initial page data loading
socket.on("setAdmin", (pageContent) => {
  pageContent.usersList.forEach((item) => {
    if (item.user_email.toUpperCase() != "ADMIN") {
      let newLi = document.createElement("li");
      newLi.innerHTML = item.user_email + ": " + item.password;
      BASE_USERS_LIST.appendChild(newLi);
    }
  });

  TEMPLATE_TEXT_FIELD.value = pageContent.templateText;
});

/**************************
 * Page side events
 **************************/

// Shows changes on text template field
TEMPLATE_TEXT_FIELD.addEventListener("input", changeBorder);

// Asks server to modify main template text
CHANGE_BUTTON.addEventListener("click", () => {
  const newText = TEMPLATE_TEXT_FIELD.value;

  const newTemplate = {
    version: "1",
    text: newText
  };

  socket.emit("updateTemplate", newTemplate);
});

// Initiates emails sending to every user
SEND_TO_ALL_BUTTON.addEventListener("click", () => {
  socket.emit("sendToAll");
});

/**************************
 * Declarations
 **************************/

function changeBorder() {
  this.style.border = "5px solid red";
}


