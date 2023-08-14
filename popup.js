const tokenInput = document.getElementById("access-token");
const saveButton = document.getElementById("save-button");

let accessToken = "";

saveButton.addEventListener("click", () => {
  console.log("clicked");
  accessToken = tokenInput.value;
  chrome.storage.sync.set({ accessToken });
});

chrome.storage.sync.get(["accessToken"], (result) => {
  console.log("Value currently is " + result.accessToken);
  tokenInput.value = result.accessToken;
});
