/**
 * Returns reference to selector page object
 * @param {String} selector
 * @return {Object} DOM node reference
 */
export function getNode(selector) {
  return document.querySelector(selector);
}

/**
 * Makes GET XMLHttpRequest
 * @param {String} url
 * @return {Promise.<String|Error>} - Response text if resolved
 */
export function httpGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.responseText);
      } else {
        const error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };

    xhr.send();
  });
}

/**
 * Makes POST XMLHttpRequest
 * @param {String} url
 * @param {String} stringToPost
 * @return {Promise.<String|Error>} - Response text if resolved
 */
export function httpPost(url, stringToPost) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.responseText);
      } else {
        const error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };

    xhr.send(stringToPost);
  });
}

/**
 * Makes POST XMLHttpRequest with form-urlencoded request header
 * @param {String} url
 * @param {String} encodedStringToPost
 * @return {Promise.<String|Error>} - Response text if resolved
 */
export function httpPostForm(url, encodedStringToPost) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.responseText);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };

    xhr.send(encodedStringToPost);
  });
}

/**
 * Makes red border for called object
 */
export function handleRequestError(error) {
  alert(`REJECTED: ${error} ${error.code}`);
}

/**
 * Makes red border for called object
 */
export function makeRedBorder() {
  this.style.border = '5px solid red';
}

/**
 * Removes border for param object
 * @param {Object} field - Page DOM node
 */
export function removeBorder(field) {
  field.style.border = 'none';
}
