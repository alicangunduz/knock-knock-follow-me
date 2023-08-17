const getToken = async () => {
  const accessToken = await chrome.storage.sync.get("accessToken");
  return accessToken;
};

let usernameElement = document.querySelector(".p-nickname");
let currentUsername = "";

const updateUsernameElement = () => {
  usernameElement = document.querySelector(".p-nickname");
};

const insertBadge = (status, usernameElement) => {
  if (status === '204') {
    usernameElement.insertAdjacentHTML(
      "afterend",
      `<small id="acg-badge" style="display: inline-block; background-color: #28A745; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Seni takip ediyor.</small>`
    );
  } else if (status === '404') {
    usernameElement.insertAdjacentHTML(
      "afterend",
      `<small id="acg-badge"  style="display: inline-block; background-color: #DC3545; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Seni takip etmiyor.</small>`
    );
  } else if (status === '401') { //401
    usernameElement.insertAdjacentHTML(
      "afterend",
      `<small id="acg-badge"  style="display: inline-block; background-color: #DC3545; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Token boş veya geçersiz.</small>`
    );
  } else {
    usernameElement.insertAdjacentHTML(
      "afterend",
      `<small id="acg-badge"  style="display: inline-block; background-color: #DC3545; color: #fff; padding: 5px 8px; font-size: 12px; border-radius: 4px;">Bilinmeyen bir hata oluştu.</small>`
    );
  }
};

const initialize = (status, usernameElement) => {
  const badge = document.querySelector("#acg-badge");
  if (badge) {
    badge.remove();
  }
  insertBadge(status, usernameElement);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const message = request.message.split(":");
  if (currentUsername !== message[2]) {
    currentUsername = message[2];
    updateUsernameElement();
  }
  if (message[1] === 'self')
    return;
  initialize(message[1], usernameElement);
});
