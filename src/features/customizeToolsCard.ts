type Tools = {
  link: string;
  icon: HTMLElement;
  title: string;
};

export async function makeNewToolsCard() {  
  // @ts-ignore
  const toolsCard: HTMLElement = document.getElementsByClassName('tool_container')[0];
  if (!toolsCard) return;

  toolsCard.style.display = 'grid';
  toolsCard.style.gridTemplateColumns = 'repeat(auto-fit, minmax(127px, 1fr))';
  toolsCard.style.padding = '0';
  toolsCard.style.gap = '0.7rem';
  
  const toolsType = document.getElementById('instance-118820-header');
  if (toolsType && toolsType.innerText === 'Teacher Tools') { // 'Teacher Tools'
    console.log('Replacing teacher tools with study tools');
    toolsType.innerText = 'Study Tools';
    toolsCard.innerHTML = studyTools;
    return;
  }

  // parse old card
  // extract link, icon and title
  const tools: Tools[] = [];

  for (const tool of toolsCard.getElementsByClassName('tool_options')) {
    const link = tool.getElementsByTagName('a')[0].href;
    const icon = tool.getElementsByTagName('i')[0];
    const title = tool.textContent;
    tools.push({ link, icon, title });
  }

  // remove old card
  const newCards = document.createDocumentFragment();
  for (const tool of tools) {
    const card = document.createElement('a');
    card.href = tool.link;
    card.target = '_blank';
    card.style.fontSize = '1rem';

    card.appendChild(tool.icon);
    tool.icon.style.paddingRight = '0.5rem';

    card.appendChild(document.createTextNode(tool.title));

    newCards.appendChild(card);
  }

  toolsCard.innerHTML = '';
  toolsCard.appendChild(newCards);
}

const studyTools = `
<a href="https://cloud.timeedit.net/itu/web/public/" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-calendar" style="padding-right: 0.5rem;"></i>
  TimeEdit: Find your schedule
</a>
<a href="https://learnit.itu.dk/local/coursebase/course_catalogue.php" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-eye" style="padding-right: 0.5rem;"></i>
  Course catalogue
</a>
<a href="https://mit.itu.dk/index.sml" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-eye" style="padding-right: 0.5rem;"></i>
  My.ITU
</a>
<a href="https://minestudieaktiviteter.itu.dk/sbstap/sb/common/velkommen.jsp" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-clipboard" style="padding-right: 0.5rem;"></i>
  My Study Activities
</a>
<a href="https://itustudent.itu.dk/" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-book" style="padding-right: 0.5rem;"></i>
  ITU student
</a>
<a href="https://itustudent.itu.dk/" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-info-circle" style="padding-right: 0.5rem;"></i>
  Study Career Guidance
</a>
<a href="https://inlearning.itu.dk/" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-camera" style="padding-right: 0.5rem;"></i>
  inLearning online courses
</a>
<a href="https://itustudent.itu.dk/Campus-Life/Student-Life/Library" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-search" style="padding-right: 0.5rem;"></i>
  IT Library
</a>
<a href="https://www.ordbogen.com/" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-th-list" style="padding-right: 0.5rem;"></i>
  Dictionaries
</a>
<a href="https://learnit.itu.dk/local/coursebase/archive/www" target="_blank" style="font-size: 1rem;">
  <i class="fa fa-search" style="padding-right: 0.5rem;"></i>
  Course Description Archive (1999-2019)
</a>`
