import React, { useEffect, useState } from 'react';

interface ToolItem {
  link: string;
  icon: string;
  title: string;
}

const defaultStudyTools: ToolItem[] = [
  {
    link: "https://cloud.timeedit.net/itu/web/public/",
    icon: "fa fa-calendar",
    title: "TimeEdit: Find your schedule"
  },
  {
    link: "https://learnit.itu.dk/local/coursebase/course_catalogue.php",
    icon: "fa fa-eye",
    title: "Course catalogue"
  },
  {
    link: "https://mit.itu.dk/index.sml",
    icon: "fa fa-eye",
    title: "My.ITU"
  },
  {
    link: "https://minestudieaktiviteter.itu.dk/sbstap/sb/common/velkommen.jsp",
    icon: "fa fa-clipboard",
    title: "My Study Activities"
  },
  {
    link: "https://itustudent.itu.dk/",
    icon: "fa fa-book",
    title: "ITU student"
  },
  {
    link: "https://itustudent.itu.dk/",
    icon: "fa fa-info-circle",
    title: "Study Career Guidance"
  },
  {
    link: "https://inlearning.itu.dk/",
    icon: "fa fa-camera",
    title: "inLearning online courses"
  },
  {
    link: "https://itustudent.itu.dk/Campus-Life/Student-Life/Library",
    icon: "fa fa-search",
    title: "IT Library"
  },
  {
    link: "https://www.ordbogen.com/",
    icon: "fa fa-th-list",
    title: "Dictionaries"
  },
  {
    link: "https://learnit.itu.dk/local/coursebase/archive/www",
    icon: "fa fa-search",
    title: "Course Description Archive (1999-2019)"
  }
];

export const ToolsCardModule: React.FC = () => {
  const [tools, setTools] = useState<ToolItem[]>(defaultStudyTools);
  const [title, setTitle] = useState<string>("Study Tools");

  useEffect(() => {
    // Try to find existing tools card and extract tools from it
    const existingToolsCard = document.getElementsByClassName('tool_container')[0] as HTMLElement;
    
    if (existingToolsCard) {
      const existingTitle = existingToolsCard.closest('section')?.querySelector('#instance-118820-header') as HTMLElement;
      
      // Check if it's teacher tools and replace with study tools
      if (existingTitle && existingTitle.innerText === 'Teacher Tools') {
        setTitle("Study Tools");
        setTools(defaultStudyTools);
        return;
      }

      // Parse existing tools
      const toolElements = existingToolsCard.getElementsByClassName('tool_options');
      const extractedTools: ToolItem[] = [];
      
      for (const tool of Array.from(toolElements)) {
        const linkElement = tool.getElementsByTagName('a')[0];
        const iconElement = tool.getElementsByTagName('i')[0];
        const titleText = tool.textContent;
        
        if (linkElement && iconElement && titleText) {
          extractedTools.push({ 
            link: linkElement.href, 
            icon: iconElement.className,
            title: titleText.trim() 
          });
        }
      }

      if (extractedTools.length > 0) {
        setTools(extractedTools);
      }
    }
  }, []);

  const toolsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(127px, 1fr))',
    padding: '0',
    gap: '0.7rem'
  };

  const toolLinkStyle: React.CSSProperties = {
    fontSize: '1rem',
    textDecoration: 'none',
    color: 'inherit'
  };

  const iconStyle: React.CSSProperties = {
    paddingRight: '0.5rem'
  };

  return (
    <section 
      className="block_tool_container block card mb-3"
      role="complementary"
      data-block="cohortspecifichtml"
    >
      <div className="card-body p-3">
        <h5 id="instance-118820-header" className="card-title d-inline">
          {title}
        </h5>
        <div className="tool_container" style={toolsContainerStyle}>
          {tools.map((tool, index) => (
            <a
              key={`${tool.title}-${index}`}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              style={toolLinkStyle}
            >
              <i className={tool.icon} style={iconStyle}></i>
              {tool.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsCardModule;