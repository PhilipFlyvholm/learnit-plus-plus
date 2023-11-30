export function addDebugButton(){
    const main = document.getElementsByClassName("main-inner")[0];
    if(main == null) return;
    const button = document.createElement("button");
    button.innerHTML = "Clear local storage";
    button.onclick = clearLocalStorage;
    button.className = "btn-link";
    main.appendChild(button);
}
function clearLocalStorage(){
    chrome.storage.local.clear(() => {
        console.log("Cleared local storage");
    });
}