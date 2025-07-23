// Example of how external student organizations can create custom modules
import { addCustomModule } from '../index';

// Example: Student organization creates a custom announcements module
export function createAnnouncementsModule() {
  const announcementsComponent = () => {
    const section = document.createElement("section");
    section.className = "block_announcements block card mb-3";
    section.setAttribute("role", "complementary");

    const div = document.createElement("div");
    div.className = "card-body p-3";

    const header = document.createElement("h5");
    header.className = "card-title d-inline";
    header.textContent = "Student Organization Announcements";

    const content = document.createElement("div");
    content.className = "announcements-content";
    content.innerHTML = `
      <div class="announcement-item" style="padding: 12px; border-left: 4px solid #007bff; margin-bottom: 12px; background: #f8f9fa;">
        <h6 style="margin: 0 0 8px 0; color: #007bff;">Welcome to Modular Dashboard!</h6>
        <p style="margin: 0; font-size: 14px;">This is an example module created by a student organization. You can drag and drop modules to reorder them or hide them using the controls.</p>
      </div>
      <div class="announcement-item" style="padding: 12px; border-left: 4px solid #28a745; margin-bottom: 12px; background: #f8f9fa;">
        <h6 style="margin: 0 0 8px 0; color: #28a745;">How to add modules</h6>
        <p style="margin: 0; font-size: 14px;">Student organizations can now create custom modules by implementing the DashboardModule interface and registering them with addCustomModule().</p>
      </div>
    `;

    div.appendChild(header);
    div.appendChild(content);
    section.appendChild(div);

    return section;
  };

  return {
    id: 'custom-announcements',
    name: 'Announcements',
    component: announcementsComponent,
    enabled: true,
    order: 999
  };
}

// Example: How to register the module
export async function registerExampleModules(): Promise<void> {
  try {
    const module = createAnnouncementsModule();
    await addCustomModule(module.id, module.name, module.component as () => HTMLElement);
    console.log('Example announcements module registered');
  } catch (error) {
    console.warn('Failed to register example module:', error);
  }
}