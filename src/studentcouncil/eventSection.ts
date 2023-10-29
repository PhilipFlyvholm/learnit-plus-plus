import { getEvents, type EventData } from "./eventLoader";
export async function addStudentConcileEvents() {
  const section = document.createElement("section");
  section.className = "block_sc block card mb-3";
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
  h5.textContent = "Student Council Events";

  const cardTextDiv = document.createElement("div");
  cardTextDiv.className = "card-text content";
  cardTextDiv.style.display = "flex";
  cardTextDiv.style.flexWrap = "wrap";

  const events = await getEvents();
  for (const event of events) {
    console.log(event);

    cardTextDiv.appendChild(getEventDom(event));
  }

  header.appendChild(h5);
  div.appendChild(header);
  div.appendChild(cardTextDiv);

  section.appendChild(div);
  const block_content = document.getElementById("block-region-content");
  if (!block_content) return;
  block_content.appendChild(section);
}

function getEventDom(event: EventData) {
  const divCard = document.createElement("div");
  divCard.className = "card dashboard-card";
  divCard.setAttribute("role", "listitem");
  divCard.setAttribute("data-region", "course-content");
  divCard.style.width = "48%";
  divCard.style.margin = "1%";

  const divCardBody = document.createElement("div");
  divCardBody.className = "card-body pr-1 course-info-container";

  const divTextTruncate = document.createElement("div");
  divTextTruncate.className = "w-100";

  const header = document.createElement("h5");
  header.className = "coursename mr-2";
  header.textContent = event.summary;

  const divMuted = document.createElement("div");
  divMuted.className = "text-muted muted d-flex mb-1 justify-content-between";

  const p = document.createElement("p");
  p.className = "text-truncate";
  const date = new Date(event.dtstart).toLocaleString();
  if (event.location.trim() !== "") {
    p.textContent = `${date} | ${event.location}`;
  } else {
    p.textContent = `${date}`;
  }
  const expandedText = document.createElement("div");
  expandedText.className = "expandedText hide-content";
  const description = document.createElement("p");
  description.style.fontSize = "0.8rem";
  if(event.description.endsWith("Read more")){
    event.description = event.description.substring(0, event.description.length - 9);
  }
  if (event.description.length < 100) {
    description.textContent = event.description;
    expandedText.appendChild(description);
  } else {
    description.textContent = event.description.substring(0, 100) + "...";
    const readMoreButton = document.createElement("button");
    readMoreButton.className = "btn btn-dark";
    readMoreButton.textContent = "Read more";
    readMoreButton.addEventListener("click", () => {
      if (expandedText.classList.contains("hide-content")) {
        expandedText.classList.remove("hide-content");
        description.textContent = event.description;
        readMoreButton.textContent = "Read less";
      } else {
        expandedText.classList.add("hide-content");
        description.textContent = event.description.substring(0, 100) + "...";
        readMoreButton.textContent = "Read more";
      }
    });
    expandedText.appendChild(description);
    expandedText.appendChild(readMoreButton);
  }
  divMuted.appendChild(expandedText);
  divMuted.appendChild(p);
  divTextTruncate.appendChild(header);
  divTextTruncate.appendChild(divMuted);
  divCardBody.appendChild(divTextTruncate);
  divCard.appendChild(divCardBody);
  return divCard;
}
