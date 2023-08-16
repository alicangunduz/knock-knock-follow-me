const getToken = async () => {
  const accessToken = await chrome.storage.sync.get("accessToken");
  return accessToken;
};

let usernameElement = document.querySelector(".p-nickname");
let currentUsername = "";

const updateUsernameElement = () => {
  usernameElement = document.querySelector(".p-nickname");
};

const initialize = (response, usernameElement) => {
  const badge = document.querySelector("#acg-badge");

  if (badge) {
    badge.remove();
    if (response === true) {
      usernameElement.insertAdjacentHTML(
        "afterend",
        `<small id="acg-badge" style="display: inline-block; background-color: #28A745; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Seni takip ediyor.</small>`
      );
    } else {
      usernameElement.insertAdjacentHTML(
        "afterend",
        `<small id="acg-badge"  style="display: inline-block; background-color: #DC3545; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Seni takip etmiyor.</small>`
      );
    }
  } else {
    if (response === true) {
      usernameElement.insertAdjacentHTML(
        "afterend",
        `<small id="acg-badge" style="display: inline-block; background-color: #28A745; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Seni takip ediyor.</small>`
      );
    } else {
      usernameElement.insertAdjacentHTML(
        "afterend",
        `<small id="acg-badge"  style="display: inline-block; background-color: #DC3545; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Seni takip etmiyor.</small>`
      );
    }
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("received message", request);
  const message = request.message.split(":");
  if (currentUsername !== message[2]) {
    currentUsername = message[2];
    updateUsernameElement();
  }
  if (request.message === `response:true:${currentUsername}`) {
    initialize(true, usernameElement);
  } else if (request.message === `response:false:${currentUsername}`) {
    initialize(false, usernameElement);
  }
});
