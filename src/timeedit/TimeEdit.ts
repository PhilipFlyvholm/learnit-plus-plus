export function addIFrameToTimeEdit() {
  const block_content = document.getElementById("block-region-content");
  if (!block_content) return;

  const section = document.createElement("section");
  section.className = "block_timeedit block card mb-3";
  section.setAttribute("role", "complementary");
  section.setAttribute("data-block", "cohortspecifichtml");

  const div = document.createElement("div");
  div.className = "card-body p-3";
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  const h5 = document.createElement("h5");
  h5.id = "instance-118819-header";
  h5.className = "card-title d-inline";
  h5.textContent = "TimeEdit";

  const cardTextDiv = document.createElement("div");
  cardTextDiv.className = "card-text content mt-3";
  const timeEditContainer = document.createElement("div");
  if (!timeEditContainer) return;
  const notSetupP = document.createElement("p");
  notSetupP.className = "text-muted text-center notSetupP";
  notSetupP.textContent =
    "TimeEdit not setup. Please enter a valid timeedit url";
  cardTextDiv.appendChild(notSetupP);

  const iframe = document.createElement("iframe");
  iframe.src =
    "https://cloud.timeedit.net/itu/web/public/ri1159Z5Q5777YQ5Q7.html";
  iframe.id = "timeEditFrame";
  iframe.className = "timeEditFrame";
  iframe.width = "100%";
  iframe.height = "500px";
  iframe.classList.add("hidden");
  cardTextDiv.appendChild(iframe);
  header.appendChild(h5);
  const input = urlInput();
  header.appendChild(input);
  div.appendChild(header);
  div.appendChild(cardTextDiv);

  section.appendChild(div);
  block_content.appendChild(section);
  if (input.value.includes("timeedit")) {
    iframe.classList.remove("hidden");
    iframe.src = input.value;
    notSetupP.classList.add("hidden");
  }
}

function urlInput() {
  const input = document.createElement("input");
  input.type = "url";
  input.setAttribute("role", "searchbox");
  input.setAttribute("data-region", "input");
  input.setAttribute("data-action", "search");
  input.className = "form-control withclear rounded";
  input.placeholder = "Enter a valid timeedit url";
  input.name = "timeeditURL";
  //Get local storage if it exists
  const timeeditStorage = localStorage.getItem("lpp/timeeditURL");
  if (timeeditStorage && timeeditStorage != "") {
    input.value = timeeditStorage;
  } else {
    input.value = "";
  }
  input.autocomplete = "off";
  input.style.maxWidth = "500px";
  input.style.width = "100%";
  input.addEventListener("change", (e) => {
    //Set local storage with content if url contains timeedit
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const url = target.value;
    const notSetupP = document.querySelector(".notSetupP");
    const timeEditFrame: HTMLIFrameElement | null =
      document.querySelector("#timeEditFrame");
    if (!timeEditFrame) return;
    if (!notSetupP) return;
    if (url.includes("timeedit")) {
      localStorage.setItem("lpp/timeeditURL", url);
      timeEditFrame.src = url;
      timeEditFrame.classList.remove("hidden");
      notSetupP.classList.add("hidden");
    } else {
      if (url.trim() == "") {
        localStorage.setItem("lpp/timeeditURL", "");
      }
      notSetupP.classList.remove("hidden");
      timeEditFrame.classList.add("hidden");
    }
  });
  return input;
}
