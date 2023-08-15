let accessToken;

async function getAccessToken() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("accessToken", (data) => {
      if (data.accessToken) {
        accessToken = data.accessToken;
      } else {
        accessToken = null;
      }
      resolve(accessToken);
    });
  });
}

async function getUsername() {
  const token = await getAccessToken();
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.login;
}

function getVisitedUsername() {
  const usernameElement = document.querySelector(".p-nickname");
  if (usernameElement) {
    const username = usernameElement.textContent.trim().split(" ")[0];
    return username;
  } else {
    return null;
  }
}

async function myFollowing() {
  const username = "alicangunduz";
  const apiUrl = `https://api.github.com/user/following/${username}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) {
    console.log(`You are now following ${username}`);
  } else {
    console.error(
      `Error following ${username}. Status code: ${response.status}`
    );
  }
}

(async () => {
  try {
    const username = await getUsername();
    const visitedUsername = getVisitedUsername();
    console.log(accessToken);
    console.log(visitedUsername);
    if (visitedUsername) {
      const apiUrl = `https://api.github.com/users/${visitedUsername}/following/${username}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 204) {
        const usernameElement = document.querySelector(".p-nickname");
        usernameElement.insertAdjacentHTML(
          "afterend",
          `<small style="color: #586069; font-size: 12px;">seni takip ediyor ✅</small>`
        );
      } else if (response.status === 404) {
        const usernameElement = document.querySelector(".p-nickname");
        usernameElement.insertAdjacentHTML(
          "afterend",
          `<small style="color: #586069; font-size: 12px;">seni takip etmiyor ❌</small>`
        );
      } else {
        console.log("Bir hata oluştu." + response.status);
      }
    } else {
      console.log("Kullanıcı adı bulunamadı.");
    }
  } catch (error) {
    console.error("Hata:", error.message);
  }
})();
