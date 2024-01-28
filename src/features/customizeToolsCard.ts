type Tools = {
  link: string;
  icon: HTMLElement;
  title: string;
};

export async function makeNewToolsCard() {
  const toolsType = document.getElementById('instance-118819-header');
  // @ts-ignore
  const toolsCard: HTMLElement = document.getElementsByClassName('tool_container')[0];
  if (!toolsCard) return;

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
  toolsCard.style.display = 'grid';
  toolsCard.style.gridTemplateColumns = 'repeat(auto-fit, minmax(127px, 1fr))';
  toolsCard.style.padding = '0';
  toolsCard.style.gap = '0.7rem';
}


/* 
if i just replace the children, then use this to fix the placement
tho i do recommend just replacing the whole thing

on the div with class row:
display: grid;
grid-template-columns: 1fr 1fr;

remove the padding from .col-md or just remove the class

and/or remove the margin from .container.tool_container
*/
