"use strict";

/**************************
 * Get page fields
 **************************/

/** removeProfile, updateTemplate, sendToAll */
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

//!!!!!!!!!!! Try to test callback, Promise
getProfileData();

/**************************
 * From server side events
 **************************/

// Fires to show server message
/*socket.on("alert", (msg) => {
  alert(msg);

  // It was simple to modify text field here
  TEMPLATE_TEXT_FIELD.style.border = "none";
});*/

// Initial page data loading
function setAdminPageContent(pageContent) {
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

          //Server will remove profile from base and then upload page content
          //!!!!!!!!!!!!!!!!socket.emit ("removeProfile", newA.name);
        }
      });
    }
  });

  TEMPLATE_TEXT_FIELD.value = pageContent.templateText;
}

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

  //socket.emit("updateTemplate", newTemplate);
});

// Initiates emails sending to every user
SEND_TO_ALL_BUTTON.addEventListener("click", () => {
  //socket.emit("sendToAll");
});

/**************************
 * Declarations
 **************************/

function getProfileData() {
  httpGet("/getAdminPage")
    .then(
      pageContent => {
      setAdminPageContent(pageContent);
    },
      error => {
      //Handle error
      alert('ERROR: ' + (error.status ? error.statusText : 'REQUEST FALED'));
    }
  );
}

function httpGet(url){
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onload = function () {
      if (this.status != 200) {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      } else {
        resolve(JSON.parse(this.responseText));
      }
    };

    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });
}

function changeBorder() {
  this.style.border = "5px solid red";
}


