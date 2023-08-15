const getToken = async () => {
  const accessToken = await chrome.storage.sync.get("accessToken");
  return accessToken;
};

const checkIfFollowing = async (visitedUsername) => {
  try {
    const accessToken = await getToken();
    if (visitedUsername) {
      const apiUrl = `https://api.github.com/user/following/${visitedUsername}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      return response.status === 204;
    }
  } catch (error) {
    console.error("Hata:", error.message);
  }
};
let currentUser = "";

function getUsernameFromGitHubURL(url) {
  const parts = url.split("/");
  // The username is the third part of the URL
  const username = parts[3];
  return username;
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab.url;
  if (url.search("://github.com") > -1) {
    const visitedUsername = getUsernameFromGitHubURL(url);
    checkIfFollowing(visitedUsername).then((res) => {
      if (changeInfo.status === "complete" && currentUser !== visitedUsername) {
        chrome.tabs.sendMessage(tabId, {
          message: `response:${res}:${visitedUsername}`,
        });
        currentUser = visitedUsername;
      }
    });
  }
});
