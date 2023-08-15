const tokenInput = document.getElementById("access-token");
const saveButton = document.getElementById("save-button");

const tokenName = "accessToken";

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
  tokenInput.value = result.accessToken;
});
