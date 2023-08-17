const getToken = async () => {
  const accessToken = await chrome.storage.sync.get("accessToken");
  return accessToken;
};

async function getUsername() {
  const token = await getToken();
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  const data = await response.json();
  return data.login;
}

const checkIfFollowing = async (visitedUsername) => {
  try {
    const accessToken = await getToken();
    const username = await getUsername();
    if (username !== visitedUsername) {
      if (visitedUsername) {
        const apiUrl = `https://api.github.com/users/${visitedUsername}/following/${username}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
        });
        return response.status;
      }

    } else {
      return "self";
    }
  } catch (error) {
    console.error("Hata:", error.message);
  }
};
let currentUser = "";

function getUsernameFromGitHubURL(url) {
  const parts = url.split("/");
  // The username is the third part of the URL
  let username = parts[3];
  if (username.includes("?")) {
    username = username.split("?")[0];
  }
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

// Sayfa yenilendiğinde yapılması gereken işlemleri içeren fonksiyon
async function onPageReload(tabId, tab) {
  const url = tab.url;
  if (url.search("://github.com") > -1) {
    const visitedUsername = getUsernameFromGitHubURL(url);
    try {
      const isFollowing = await checkIfFollowing(visitedUsername);
      chrome.tabs.sendMessage(tabId, {
        message: `response:${isFollowing}:${visitedUsername}`,
      });
    } catch (error) {
      console.error("Hata:", error.message);
    }
  }
}

// Sayfa yenilendiğinde çalışacak kod
chrome.webNavigation.onCompleted.addListener((details) => {
  const tabId = details.tabId;
  chrome.tabs.get(tabId, (tab) => {
    onPageReload(tabId, tab);
  });
});

// İlk sayfa yüklendiğinde ve tab güncellendiğinde çalışacak kod
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    onPageReload(tabId, tab);
  }
});
