import type { DashboardModule } from '../types';

export function createToolsCardModule(): DashboardModule {
  return {
    id: 'tools-card',
    name: 'Tools Card',
    component: createToolsCardComponent,
    enabled: true,
    order: 1
  };
}

function createToolsCardComponent(): HTMLElement {
  // First try to find existing tools card and enhance it
  const existingToolsCard = document.getElementsByClassName('tool_container')[0] as HTMLElement;
  
  if (existingToolsCard) {
    // Clone the existing tools card to avoid modifying the original
    const section = existingToolsCard.closest('section')?.cloneNode(true) as HTMLElement;
    if (section) {
      const toolsCard = section.getElementsByClassName('tool_container')[0] as HTMLElement;
      enhanceToolsCard(toolsCard);
      return section;
    }
  }

  // Fallback: create a new tools card with default study tools
  return createDefaultToolsCard();
}

function enhanceToolsCard(toolsCard: HTMLElement): void {
  toolsCard.style.display = 'grid';
  toolsCard.style.gridTemplateColumns = 'repeat(auto-fit, minmax(127px, 1fr))';
  toolsCard.style.padding = '0';
  toolsCard.style.gap = '0.7rem';
  
  const toolsType = toolsCard.closest('section')?.querySelector('#instance-118820-header') as HTMLElement;
  if (toolsType && toolsType.innerText === 'Teacher Tools') {
    console.log('Replacing teacher tools with study tools');
    toolsType.innerText = 'Study Tools';
    toolsCard.innerHTML = studyToolsHtml;
    return;
  }

  // Parse existing tools and reformat them
  const tools: Array<{link: string, icon: HTMLElement, title: string}> = [];
  const toolElements = toolsCard.getElementsByClassName('tool_options');
  
  for (const tool of Array.from(toolElements)) {
    const linkElement = tool.getElementsByTagName('a')[0];
    const iconElement = tool.getElementsByTagName('i')[0];
    const title = tool.textContent;
    
    if (linkElement && iconElement && title) {
      tools.push({ 
        link: linkElement.href, 
        icon: iconElement.cloneNode(true) as HTMLElement, 
        title: title.trim() 
      });
    }
  }

  // Create new formatted cards
  const newCards = document.createDocumentFragment();
  for (const tool of tools) {
    const card = document.createElement('a');
    card.href = tool.link;
    card.target = '_blank';
    card.style.fontSize = '1rem';

    tool.icon.style.paddingRight = '0.5rem';
    card.appendChild(tool.icon);
    card.appendChild(document.createTextNode(tool.title));

    newCards.appendChild(card);
  }

  toolsCard.innerHTML = '';
  toolsCard.appendChild(newCards);
}

function createDefaultToolsCard(): HTMLElement {
  const section = document.createElement("section");
  section.className = "block_tool_container block card mb-3";
  section.setAttribute("role", "complementary");
  section.setAttribute("data-block", "cohortspecifichtml");

  const div = document.createElement("div");
  div.className = "card-body p-3";
  
  const header = document.createElement("h5");
  header.id = "instance-118820-header";
  header.className = "card-title d-inline";
  header.textContent = "Study Tools";

  const toolsCard = document.createElement("div");
  toolsCard.className = "tool_container";
  toolsCard.style.display = 'grid';
  toolsCard.style.gridTemplateColumns = 'repeat(auto-fit, minmax(127px, 1fr))';
  toolsCard.style.padding = '0';
  toolsCard.style.gap = '0.7rem';
  toolsCard.innerHTML = studyToolsHtml;

  div.appendChild(header);
  div.appendChild(toolsCard);
  section.appendChild(div);

  return section;
}

const studyToolsHtml = `
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
</a>`;