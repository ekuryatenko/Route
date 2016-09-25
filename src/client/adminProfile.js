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
const DELETE_USER_SELECT = getNode("#deleteUser");

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
      const newLi = document.createElement ("li");

      const newA = document.createElement ("a");
      newA.href = "#";
      newA.innerHTML = item.user_email + ": " + item.password;
      newA.name = item.user_email;

      newLi.appendChild(newA);
      BASE_USERS_LIST.appendChild(newLi);

      // Realize user removing
      newA.addEventListener ("click", () => {
        if(confirm ("Do you want delete " + newA.name + "?")){
          let qty = (BASE_USERS_LIST.childNodes.length);

          for (var i = 0; i < qty; i++) {
            BASE_USERS_LIST.removeChild(BASE_USERS_LIST.firstChild);
          }

          socket.emit ("removeProfile", newA.name);
        }
      });
    }
  });

  TEMPLATE_TEXT_FIELD.value = pageContent.templateText;
});

/**************************
 * Page side events
 **************************/

// Shows changes on text template field
TEMPLATE_TEXT_FIELD.addEventListener("input", changeBorder);

// Sends to server modificated template text
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


