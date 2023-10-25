import { setCookie } from "./cookies";
import svgIcons from "./svgIcons";
(function () {
  console.log("ReLearnIT enabled");
  replaceLogo();
  addDarkModeToggle();
})();

function addDarkModeToggle() {
  const userMenu = document.querySelector("#usernavigation");
  if (!userMenu) return;
  const darkModeToggle = document.createElement("div");
  darkModeToggle.classList.add("dark-mode-toggle");
  darkModeToggle.innerHTML = `
  <div id="darkModeToggle" class="nav-link">
    <input type="checkbox" id="dark-mode-toggle" ${document.documentElement.classList.contains(
      "dark"
    ) ? "checked" : ""}/>
        <label for="dark-mode-toggle" id="dark-mode-label">
        <i class="darkModeOnly">${svgIcons.moon}</i>
        <i class="lightModeOnly">${svgIcons.sun}</i>
        </label>
  </div>
  `;
  userMenu.appendChild(darkModeToggle);
  const darkModeCheckbox = document.querySelector("#dark-mode-toggle");
  if (!darkModeCheckbox) return;
  darkModeCheckbox.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const darkMode = target.checked;
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      setCookie("lpp/darkMode", "true");
    } else {
      root.classList.remove("dark");
      setCookie("lpp/darkMode", "false");
    }
  });
}


function replaceLogo() {
  const img = chrome.runtime.getURL("./public/images/logo.png");
  const logoInNav = document.querySelector(".site-name.navbar-brand");
  if (logoInNav) {
    logoInNav.innerHTML = `<img src="${img}" alt="LearnIT++" style="height:100%"/>`;
    logoInNav.classList.add("show");
  }
}
