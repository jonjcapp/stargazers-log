const list = document.querySelector("#starred");
const status = document.querySelector("#status");

function isRepositoryEvent(event) {
  return event
    && typeof event.name === "string"
    && typeof event.url === "string"
    && typeof event.starred === "string";
}

function renderEvents(events) {
  list.replaceChildren();

  if (events.length === 0) {
    status.textContent = "No starred repositories yet.";
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = event.url;
    link.textContent = `${event.name} - starred ${event.starred}`;
    item.appendChild(link);
    list.appendChild(item);
  });

  status.textContent = `${events.length} starred ${events.length === 1 ? "repository" : "repositories"} loaded.`;
}

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load events: ${response.status}`);
    }
    return response.json();
  })
  .then((events) => {
    if (!Array.isArray(events) || !events.every(isRepositoryEvent)) {
      throw new Error("events.json has an invalid format");
    }
    renderEvents(events);
  })
  .catch((error) => {
    list.replaceChildren();
    status.textContent = "The starred repositories could not be loaded. Please try again later.";
    console.error(error);
  });
