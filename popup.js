const tokenInput = document.getElementById("access-token");
const saveButton = document.getElementById("save-button");
const tokenName = "accessToken";
const visibilityButton = document.getElementById("togglePassword");

const changeVisibility = () => {
  const type = tokenInput.type;
  tokenInput.type = type === "password" ? "text" : "password";
};

visibilityButton.addEventListener("click", changeVisibility);

const saveToken = () => {
  const accessToken = tokenInput.value;
  chrome.storage.sync.set({ accessToken });
  // reflesh
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.reload(tabs[0].id);
  });
};

saveButton.addEventListener("click", saveToken);

tokenInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveToken();
  }
});

chrome.storage.sync.get(["accessToken"], (result) => {
  result.accessToken && (tokenInput.value = result.accessToken);
});