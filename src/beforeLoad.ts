//This script is loaded before page load (DOM may not be ready yet)

import { getCookieValue } from "./cookies";

loadDarkMode();

function loadDarkMode() {
    const cookie = getCookieValue("lpp/darkMode");
    if (!cookie) return;
    const darkMode = cookie === "true";
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }