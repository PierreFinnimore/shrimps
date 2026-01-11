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

function formatForGoogle(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

const HOURS_PER_EVENT = 2;

function getLocation(location) {
  if (location.includes(`Students' Union`)) {
    location = location.replace(
      `Students' Union`,
      `Sheffield Students' Union, Western Bank, Broomhall, Sheffield S10 2TG`
    );
  }
  return location;
}

function getCalendarEvent(event) {
  const data = event.target.parentElement.parentElement.dataset;
  const endBase = new Date(data.dateTime);
  endBase.setHours(endBase.getHours() + HOURS_PER_EVENT);

  return {
    title: data.title,
    description: data.description,
    location: data.location,
    start: new Date(data.dateTime),
    end: endBase,
  };
}

function handleGoogleClick(event) {
  event.stopPropagation();
  const calendarEvent = getCalendarEvent(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendarEvent.title,
    details: calendarEvent.description,
    location: calendarEvent.location,
    dates: `${formatForGoogle(calendarEvent.start)}/${formatForGoogle(
      calendarEvent.end
    )}`,
  });
  window.open(
    "https://calendar.google.com/calendar/render?" + params.toString(),
    "_blank"
  );
}

function makeUID(event, idx) {
  const base =
    (event.title || "event") + "-" + (event.start?.toISOString?.() || idx);
  return encodeURIComponent(base) + "@shrimspimprov.com";
}

function buildICS(events = []) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//shrimpsimprov.com//EN",
    "CALSCALE:GREGORIAN",
  ];
  events.forEach((ev, i) => {
    const start = ev.start instanceof Date ? ev.start : new Date(ev.start);
    const end = ev.end instanceof Date ? ev.end : new Date(ev.end || start);
    lines.push("BEGIN:VEVENT");
    lines.push("UID:" + makeUID(ev, i));
    lines.push("DTSTAMP:" + formatICSDate(new Date()));
    lines.push("DTSTART:" + formatICSDate(start));
    lines.push("DTEND:" + formatICSDate(end));
    if (ev.title) {
      lines.push("SUMMARY:" + ev.title.replace(/\r\n|\n/g, "\\n"));
    }
    if (ev.description) {
      lines.push("DESCRIPTION:" + ev.description.replace(/\r\n|\n/g, "\\n"));
    }
    if (ev.location) {
      lines.push("LOCATION:" + ev.location.replace(/\r\n|\n/g, "\\n"));
    }
    lines.push("URL:https://shrimpsimprov.com/");
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(filename, events = []) {
  const url = URL.createObjectURL(
    new Blob([buildICS(events)], {
      type: "text/calendar;charset=utf-8",
    })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function handleICSClick(event) {
  event.stopPropagation();
  const calendarEvent = getCalendarEvent(event);
  const filename =
    (calendarEvent.title || "event") +
    " - " +
    calendarEvent.start.toISOString();
  downloadICS(filename, [calendarEvent]);
}

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function toggleCalendarDropdown(event) {
  event.stopPropagation();

  const btn = event.target.closest("button");
  const isExpanded = btn.dataset.expanded === "true";
  btn.dataset.expanded = !isExpanded;

  if (isExpanded) {
    btn.innerText = "+";
  } else {
    btn.innerText = "-";
    const dropdown = document.createElement("div");
    dropdown.dataset = "";

    const googleBtn = document.createElement("button");
    googleBtn.innerText = "Google Calendar";
    googleBtn.addEventListener("click", handleGoogleClick);

    const icsBtn = document.createElement("button");
    icsBtn.innerText = "ICS Calendar";
    icsBtn.addEventListener("click", handleICSClick);

    dropdown.appendChild(googleBtn);
    dropdown.appendChild(icsBtn);
    btn.appendChild(dropdown);
  }
}

function getEventDetails(now, el) {
  const timeEl = el.querySelector("time");
  if (!timeEl) {
    return;
  }
  const dateTime = new Date(timeEl.dateTime);
  if (dateTime < now) {
    return;
  }

  const whereEl = el.querySelector(".where");
  const location = getLocation(whereEl ? whereEl.innerText : "");
  const whatEl = el.querySelector(".what");
  const description = whatEl ? whatEl.innerText : "";

  const parent = el.parentElement;
  const isShow =
    parent.id === "next-show" || parent.parentElement.id === "shows";
  const showTitleEl = el.querySelector(".show-name");
  let title = "Shrimps Improv Workshop";
  if (isShow) {
    title = showTitleEl
      ? showTitleEl.innerText + " (Improv Show)"
      : "Shrimps Improv Show";
  }

  const endBase = new Date(dateTime);
  endBase.setHours(endBase.getHours() + HOURS_PER_EVENT);

  return {
    title,
    description,
    location,
    dateTime,
    start: new Date(dateTime),
    end: endBase,
  };
}

function setupCalendars() {
  const now = new Date();
  document
    .querySelectorAll(
      "#shows ol li, #workshops ol li, #next-workshop li, #next-show li"
    )
    .forEach((el) => {
      const calendarEvent = getEventDetails(now, el);
      if (!calendarEvent) {
        return;
      }
      const buttonEl = document.createElement("button");
      buttonEl.classList.add("toggle-calendar", "inline-button");
      buttonEl.innerText = "+";
      buttonEl.type = "button";
      buttonEl.dataset.dateTime = calendarEvent.dateTime;
      buttonEl.dataset.location = calendarEvent.location;
      buttonEl.dataset.title = calendarEvent.title;
      buttonEl.dataset.description = calendarEvent.description;
      buttonEl.addEventListener("click", toggleCalendarDropdown);
      el.appendChild(buttonEl);
    });

  const showListEls = document.querySelectorAll("#shows ol li");
  const showEvents = [];
  showListEls.forEach((el) => {
    const calendarEvent = getEventDetails(now, el);
    if (!calendarEvent) {
      return;
    }
    showEvents.push(calendarEvent);
  });
  document.getElementById("addShows").addEventListener("click", () => {
    const filename = "All Shows";
    downloadICS(filename, showEvents);
  });

  const workshopListEls = document.querySelectorAll("#workshops ol li");
  const workshopEvents = [];
  workshopListEls.forEach((el) => {
    const calendarEvent = getEventDetails(now, el);
    if (!calendarEvent) {
      return;
    }
    workshopEvents.push(calendarEvent);
  });
  document.getElementById("addWorkshops").addEventListener("click", () => {
    const filename = "All Workshops";
    downloadICS(filename, workshopEvents);
  });
}

function main() {
  setupNav();
  setupUpcoming();
  setupCalendars();
  setupPastGlories();
  setupTimes();
  setupShrimps();
  startCheckingTimeUntil();
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
