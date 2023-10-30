import { getTodaysOpeningHours } from "./openingHours";

export function injectAnalog() {
  const userMenu = document.querySelector("#usernavigation");
  if (!userMenu) return;
  const analogContainer = document.createElement("small");
  analogContainer.id = "analogContainer";
  analogContainer.className = "nav-link text-truncate";
  const openingHours = getTodaysOpeningHours();
  analogContainer.textContent = openingHours
    ? `Open ${openingHours.from}:00-${openingHours.to_h}:${openingHours.to_m}`
    : "Closed";
  analogContainer.prepend(getAnalogLogo());
  userMenu.prepend(analogContainer);
}

function getAnalogLogo() {
  const img = chrome.runtime.getURL("./public/images/analog.png");
  const imgElement = document.createElement("img");
  imgElement.src = img;
  imgElement.alt = "Analog logo";
  imgElement.style.height = "25px";
  imgElement.style.marginRight = "5px";
  return imgElement;
}
