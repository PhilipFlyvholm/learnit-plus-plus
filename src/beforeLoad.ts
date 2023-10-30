//This script is loaded before page load (DOM may not be ready yet)
loadDarkMode();

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