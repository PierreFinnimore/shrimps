function setupNav() {
  const nav = document.getElementById("navigation");
  const sections = document.getElementsByTagName("section");
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const firstH1 = section.querySelector("h1");
    if (!firstH1) {
      continue;
    }
    const navButton = document.createElement("a");
    navButton.innerText = firstH1.innerText;
    navButton.href = "#" + section.id;
    nav.appendChild(navButton);
  }
}

function getMostRecent(containerId) {
  const container = document.getElementById(containerId);
  const listEls = Array.from(container.getElementsByTagName("li"));
  const now = new Date();
  const futureEls = listEls.filter((el) => {
    const timeEl = el.querySelector("time");
    if (!timeEl) {
      return false;
    }
    if (!timeEl.dateTime) {
      return false;
    }
    const date = new Date(timeEl.dateTime);
    if (date < now) {
      return false;
    }
    return true;
  });

  if (!futureEls.length) {
    return null;
  }
  futureEls.sort((a, b) => {
    const aTimeEl = a.querySelector("time");
    const bTimeEl = b.querySelector("time");
    const aDate = new Date(aTimeEl.dateTime);
    const bDate = new Date(bTimeEl.dateTime);

    return aDate - bDate;
  });
  return futureEls[0];
}

function setupUpcoming() {
  const nextWorkshop = document.getElementById("next-workshop");
  const latestWorkshop = getMostRecent("workshops");
  if (latestWorkshop) {
    nextWorkshop.appendChild(latestWorkshop.cloneNode(true));
  } else {
    nextWorkshop.innerText = "Watch this space...";
  }

  const nextShow = document.getElementById("next-show");
  const latestShow = getMostRecent("shows");
  if (latestShow) {
    nextShow.appendChild(latestShow.cloneNode(true));
  } else {
    nextShow.innerText = "Watch this space...";
  }
}

function main() {
  setupNav();
  setupUpcoming();
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
