const tokenInput = document.getElementById("access-token");
const saveButton = document.getElementById("save-button");

let accessToken = "";

saveButton.addEventListener("click", () => {
  console.log("clicked");
  accessToken = tokenInput.value;
  chrome.storage.sync.set({ accessToken });
  // reflesh
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
  });
});

chrome.storage.sync.get(["accessToken"], (result) => {
  console.log("Value currently is " + result.accessToken);
  tokenInput.value = result.accessToken;
});
