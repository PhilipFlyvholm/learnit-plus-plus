//This script is loaded before page load (DOM may not be ready yet)
loadDarkMode();

import { getTheme } from './styles/main';
/* Add styles to page */
const styleUpdateHandler = function () {
  let style = document.getElementById("lpp-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "lpp-styles";
    document.head.appendChild(style);
  }
  const theme = getTheme(window.localStorage.getItem("lpp/theme"))
  style.textContent = theme.css;
  if(theme.hasDarkMode){
    document.documentElement.classList.add("has-dark-mode");
  }else{
    document.documentElement.classList.remove("has-dark-mode");
  }

};
styleUpdateHandler();

function loadDarkMode() {
  const darkModeValue = localStorage.getItem("lpp/darkMode");
  if (!darkModeValue) return;
  const darkMode = darkModeValue === "true";
  const root = document.documentElement;
  if (darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

const localStore = localStorage.setItem;

localStorage.setItem = function (key, value) {
  if (key === "lpp/theme") {
    const event = new StorageEvent("themeUpdated");
    document.dispatchEvent(event);
  }
  localStore.apply(this, [key, value]);
};

document.addEventListener("themeUpdated", styleUpdateHandler, false);
