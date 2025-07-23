export const config: PlasmoCSConfig = {
    matches: ["https://learnit.itu.dk/*"]
}

import svgIcons from "~/utils/svgIcons";
import { addCollapseAllButton, removeChervonIfNoChildren } from "~/features/collapseAll";
import { injectAnalog } from "~/analog/inject";
import { addStudentConcileEvents } from "~/studentcouncil/eventSection";
import type { PlasmoCSConfig } from "plasmo";
import injectThemeSelection from "~features/themeSwitchInSettings";
import { addDebugButton } from "~features/clearLocalStorage";
import { makeNewToolsCard } from "~features/customizeToolsCard";
import { replaceResourceTags } from "~features/newWindowATags";
import { autoRedirectLoginPage } from "~features/autoRedirectLoginPage";
import { initializeModularDashboard } from "~/dashboard";

(function () {
  console.log("LearnIT++ enabled");
  autoRedirectLoginPage();
  replaceLogo();
  addDarkModeToggle();
  addCollapseAllButton();
  addGithubLink();
  removeChervonIfNoChildren();
  injectAnalog();
  if (isFrontPage()) {
    // Initialize modular dashboard instead of individual components
    initializeModularDashboard().catch(error => {
      console.error("Failed to initialize modular dashboard:", error);
      // Fallback to original approach if modular dashboard fails
      addStudentConcileEvents();
      makeNewToolsCard();
    });
  }
  fixMessageCtrl();
  injectThemeSelection();
  replaceResourceTags();
  addTargetBlankToLinks();
  process.env.NODE_ENV === "development" && addDebugButton();
  document.documentElement.classList.add("loaded");
})();

function isFrontPage() {
  const url = window.location.href.split("?")[0];
  return url.endsWith("/my/");
}

function addDarkModeToggle() {
  const userMenu = document.querySelector("#usernavigation");
  if (!userMenu) return;
  const darkModeToggle = document.createElement("div");
  darkModeToggle.id = "darkModeToggle";
  darkModeToggle.className = "nav-link";

  const darkModeToggleInput = document.createElement("input");
  darkModeToggleInput.type = "checkbox";
  darkModeToggleInput.id = "dark-mode-toggle";
  darkModeToggleInput.checked =
    document.documentElement.classList.contains("dark");

  const darkModeToggleInputLabel = document.createElement("label");
  darkModeToggleInputLabel.htmlFor = "dark-mode-toggle";
  darkModeToggleInputLabel.id = "dark-mode-label";

  const moonIcon = document.createElement("i");
  moonIcon.className = "darkModeOnly";
  moonIcon.innerHTML = svgIcons.moon;

  const sunIcon = document.createElement("i");
  sunIcon.className = "lightModeOnly";
  sunIcon.innerHTML = svgIcons.sun;

  darkModeToggleInputLabel.appendChild(moonIcon);
  darkModeToggleInputLabel.appendChild(sunIcon);

  darkModeToggle.appendChild(darkModeToggleInput);
  darkModeToggle.appendChild(darkModeToggleInputLabel);

  userMenu.appendChild(darkModeToggle);
  userMenu.appendChild(darkModeToggle);
  const darkModeCheckbox = document.querySelector("#dark-mode-toggle");
  if (!darkModeCheckbox) return;
  darkModeCheckbox.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const darkMode = !!target.checked;
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      chrome.storage.local.set({ "darkMode": true });
    } else {
      root.classList.remove("dark");
      chrome.storage.local.set({ "darkMode": false });
    }
  });
}
function addGithubLink() {
  const userMenu = document.querySelector("#usernavigation");
  if (!userMenu) return;
  const githubLink = document.createElement("a");
  githubLink.href = "https://github.com/PhilipFlyvholm/learnit-plus-plus"
  githubLink.className = "nav-link";
  //Add github icon
  githubLink.innerHTML = svgIcons.github;
  userMenu.prepend(githubLink);
}

function replaceLogo() {
  const img = chrome.runtime.getURL("/assets/images/logo-128.png");
  const logoInNav = document.querySelector(".site-name.navbar-brand");
  if (logoInNav) {
    //Clear all children
    logoInNav.childNodes.forEach((node) => logoInNav.removeChild(node));
    //Add new image
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.alt = "LearnIT++";
    imgElement.style.height = "100%";
    logoInNav.appendChild(imgElement);
    logoInNav.classList.add("show");
  }
}

function fixMessageCtrl(){
  const textArea:HTMLTextAreaElement | null = document.querySelector('.form-control[data-region="send-message-txt"]');
  if(!textArea) return;
  textArea.placeholder = "Write a message... Hint: Use Ctrl+Enter to send message";
  textArea.addEventListener('keydown', (e) => {
    
    if (e.key === 'Enter' && e.ctrlKey) {
      const button:HTMLButtonElement|null = document.querySelector('button[data-action="send-message"]');
      button?.click();
    }
  });
}

function addTargetBlankToLinks(){
  chrome.storage.local.get(["moreTargetBlank"], (result) => {
    if (!result.moreTargetBlank || result.moreTargetBlank === "off") return;

    const links = document.querySelectorAll<HTMLAnchorElement>(".description-inner a");
    links.forEach((link) => {
      if (link.href && link.href.startsWith("http") && !link.target
        && (result.moreTargetBlank === "all" || link.href.includes("learnit.itu.dk") === false)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  });
}