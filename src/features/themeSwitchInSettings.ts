//https://learnit.itu.dk/user/edit.php
import { themes } from "~/styles/main";

export default function injectThemeSelection(){
    chrome.storage.local.get(["theme"], (result) => {
        const url = window.location.href;
        if(!url.includes("/user/edit.php")){
            return;
        }
        const themeSelect = document.getElementById("id_profile_field_colorscheme") as HTMLSelectElement | null;
        if(!themeSelect){
            return;
        }
        themeSelect.innerHTML = "";
        Object.keys(themes).forEach((themeName) => {
            const option = document.createElement("option");
            option.value = themeName;
            option.innerText = themeName;
            if(themeName === result.theme){
                option.selected = true;
            }
            themeSelect.appendChild(option);
        });
        themeSelect.addEventListener("change", (_) => {
            chrome.storage.local.set({ "theme": themeSelect.value }, () => {

            });
        });
    });
}