export const config: PlasmoCSConfig = {
    matches: ["https://learnit.itu.dk/*"]
}

import svgIcons from "~/utils/svgIcons";
import { addCollapseAllButton, removeChervonIfNoChildren } from "~/features/collapseAll";
import { addIFrameToTimeEdit } from "~/timeedit/TimeEdit";
import { injectAnalog } from "~/analog/inject";
import { addStudentConcileEvents } from "~/studentcouncil/eventSection";
import type { PlasmoCSConfig } from "plasmo";

(function () {
  console.log("LearnIT++ enabled");
  replaceLogo();
  addDarkModeToggle();
  addCollapseAllButton();
  removeChervonIfNoChildren();
  injectAnalog();
  if (isFrontPage()) {
    addIFrameToTimeEdit();
    addStudentConcileEvents();
  }
  fixMessageCtrl();
  document.documentElement.classList.add("loaded");
})();

function isFrontPage() {
  const url = window.location.href;
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