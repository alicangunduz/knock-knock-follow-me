const tokenInput = document.getElementById("access-token");
const saveButton = document.getElementById("save-button");

const tokenName = "accessToken";

const saveToken = () => {
  const accessToken = tokenInput.value;
  chrome.storage.sync.set({ accessToken });
};

saveButton.addEventListener("click", saveToken);

// chrome.storage.sync.get(["accessToken"], (result) => {
//   console.log("Value currently is " + result.accessToken);
//   tokenInput.value = result.accessToken;
// });
