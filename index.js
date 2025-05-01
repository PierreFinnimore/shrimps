const twoHours = 2 * 1000 * 60 * 60;

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
  now.setHours(now.getHours() - 2);
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

function createWatchThisSpace() {
  const watchThisSpace = document.createElement("li");
  watchThisSpace.innerText = "Watch this space...";
  watchThisSpace.classList.add("watch");
  return watchThisSpace;
}

function setupPastGlories() {
  const allWorkshops = document.querySelectorAll("#workshops li");
  const allShows = document.querySelectorAll("#shows li");

  const now = new Date();
  now.setHours(now.getHours() - 2);

  const pastEls = [...Array.from(allShows), ...Array.from(allWorkshops)].filter(
    (el) => {
      const timeEl = el.querySelector("time");
      if (!timeEl) {
        return false;
      }
      if (!timeEl.dateTime) {
        return false;
      }
      const date = new Date(timeEl.dateTime);
      if (date > now) {
        return false;
      }
      return true;
    }
  );

  if (!pastEls.length) {
    return null;
  }
  pastEls.sort((a, b) => {
    const aTimeEl = a.querySelector("time");
    const bTimeEl = b.querySelector("time");
    const aDate = new Date(aTimeEl.dateTime);
    const bDate = new Date(bTimeEl.dateTime);

    return bDate - aDate;
  });

  const newContainer = document.querySelector("#past-glories ol");
  for (let i = 0; i < pastEls.length; i++) {
    const showOrWorkshop = pastEls[i].parentElement.parentElement.id;
    pastEls[i].classList.add(
      showOrWorkshop === "shows" ? "past-show" : "past-workshop"
    );
    newContainer.appendChild(pastEls[i]);
  }

  const workshopsLeft = document.querySelectorAll("#workshops li");
  if (Array.from(workshopsLeft).length === 0) {
    const workshopContainer = document.querySelector("#workshops ol");
    workshopContainer.appendChild(createWatchThisSpace());
  }
  const showsLeft = document.querySelectorAll("#shows li");
  if (Array.from(showsLeft).length === 0) {
    const workshopContainer = document.querySelector("#shows ol");
    workshopContainer.appendChild(createWatchThisSpace());
  }
}

function setupUpcoming() {
  const nextWorkshop = document.getElementById("next-workshop");
  nextWorkshop.innerHTML = "";
  const latestWorkshop = getMostRecent("workshops");

  if (latestWorkshop) {
    nextWorkshop.appendChild(latestWorkshop.cloneNode(true));
  } else {
    nextWorkshop.appendChild(createWatchThisSpace());
  }

  const nextShow = document.getElementById("next-show");
  nextShow.innerHTML = "";
  const latestShow = getMostRecent("shows");
  if (latestShow) {
    nextShow.appendChild(latestShow.cloneNode(true));
  } else {
    nextShow.appendChild(createWatchThisSpace());
  }
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function setupTimes() {
  const timeEls = document.getElementsByTagName("time");

  for (let i = 0; i < timeEls.length; i++) {
    const timeEl = timeEls[i];
    const date = new Date(timeEl.dateTime);

    const optionsDate = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const optionsTime = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };

    const day = date.getDate();
    const dateString = date
      .toLocaleString("en-UK", optionsDate)
      .replace(/(\d+)/, `${day}${getOrdinalSuffix(day)}`);
    const timeString = date.toLocaleString("en-UK", optionsTime);

    timeEl.textContent = `${dateString} ${timeString}`;

    const untilSpan = document.createElement("div");
    untilSpan.classList.add("time-until");
    untilSpan.dataset.timestamp = date;
    timeEl.appendChild(untilSpan);
  }
}

function updateTimeUntils(timeUntilEls) {
  const now = new Date();
  for (let i = 0; i < timeUntilEls.length; i++) {
    const el = timeUntilEls[i];
    const date = new Date(el.dataset.timestamp);
    const diff = date - now;

    let resultString = "";

    if (diff > 0) {
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      resultString = `(${days}d ${hours}h ${minutes}m ${seconds}s)`;
    } else if (diff > -twoHours) {
      resultString = "(Happening Now!)";
    } else {
      resultString = "(Already happened!)";
    }
    el.innerText = resultString;
  }
}

function startCheckingTimeUntil() {
  const timeUntilEls = document.getElementsByClassName("time-until");
  updateTimeUntils(timeUntilEls);
  setInterval(() => updateTimeUntils(timeUntilEls), 1000);
}

function setupShrimps() {
  const shrimps = document.getElementsByClassName("shrimp");
  for (let i = 0; i < shrimps.length; i++) {
    const shrimp = shrimps[i];
    shrimp.addEventListener("click", (evt) => {
      const el = evt.target;
      if (el.classList.contains("playing")) {
        el.classList.remove("playing");
      } else {
        el.classList.add("playing");
      }
    });
  }
}

function main() {
  setupNav();
  setupUpcoming();
  setupPastGlories();
  setupTimes();
  setupShrimps();
  startCheckingTimeUntil();
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
