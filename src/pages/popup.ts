// here we add logic to the popup :)

chrome.cookies.get({
    name: 'lpp/darkMode', 
    url: 'https://learnit.itu.dk'
}, cookie => {
    const dmSwitch = document.getElementById("darkModeSwitch");
    dmSwitch.checked = cookie?.value === 'true';
});