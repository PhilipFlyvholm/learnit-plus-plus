import { getDashboardInstance } from '../index';
import type { DashboardModule } from '../types';

export class DashboardSettingsPanel {
  private panel: HTMLElement | null = null;
  private isVisible = false;

  createSettingsPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'dashboard-settings-panel';
    panel.className = 'dashboard-settings-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Dashboard Modules';
    title.style.cssText = `
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    `;
    closeBtn.onclick = () => this.hidePanel();

    header.appendChild(title);
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'settings-content';

    const description = document.createElement('p');
    description.textContent = 'Toggle modules on/off or drag to reorder them on the dashboard.';
    description.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #666;
    `;

    const modulesList = document.createElement('div');
    modulesList.className = 'modules-list';
    this.populateModulesList(modulesList);

    content.appendChild(description);
    content.appendChild(modulesList);

    panel.appendChild(header);
    panel.appendChild(content);

    this.panel = panel;
    document.body.appendChild(panel);

    // Dark mode support
    this.updateDarkMode();
    
    return panel;
  }

  private populateModulesList(container: HTMLElement): void {
    const dashboard = getDashboardInstance();
    if (!dashboard) return;

    const availableModules = dashboard.getAvailableModules();
    const enabledModules = dashboard.getEnabledModules();

    availableModules.forEach(moduleId => {
      const moduleItem = document.createElement('div');
      moduleItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      `;

      const moduleInfo = document.createElement('div');
      const moduleName = this.getModuleName(moduleId);
      moduleInfo.textContent = moduleName;
      moduleInfo.style.cssText = `
        font-size: 14px;
        font-weight: 500;
      `;

      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = enabledModules.includes(moduleId);
      toggle.style.cssText = `
        cursor: pointer;
      `;
      
      toggle.addEventListener('change', async () => {
        await dashboard.toggleModule(moduleId);
        // Refresh the list to reflect changes
        container.innerHTML = '';
        this.populateModulesList(container);
      });

      moduleItem.appendChild(moduleInfo);
      moduleItem.appendChild(toggle);
      container.appendChild(moduleItem);
    });

    if (availableModules.length === 0) {
      const noModules = document.createElement('div');
      noModules.textContent = 'No modules available';
      noModules.style.cssText = `
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 16px 0;
      `;
      container.appendChild(noModules);
    }
  }

  private getModuleName(moduleId: string): string {
    const nameMap: Record<string, string> = {
      'student-council-events': 'Student Council Events',
      'tools-card': 'Study Tools',
      'calendar': 'Calendar'
    };
    return nameMap[moduleId] || moduleId;
  }

  showPanel(): void {
    if (!this.panel) {
      this.createSettingsPanel();
    }
    
    if (this.panel) {
      this.panel.style.transform = 'translateX(0)';
      this.isVisible = true;
      
      // Refresh the modules list
      const modulesList = this.panel.querySelector('.modules-list') as HTMLElement;
      if (modulesList) {
        modulesList.innerHTML = '';
        this.populateModulesList(modulesList);
      }
    }
  }

  hidePanel(): void {
    if (this.panel) {
      this.panel.style.transform = 'translateX(100%)';
      this.isVisible = false;
    }
  }

  togglePanel(): void {
    if (this.isVisible) {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }

  private updateDarkMode(): void {
    if (!this.panel) return;
    
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      this.panel.style.background = '#2d3748';
      this.panel.style.color = 'white';
      this.panel.style.borderColor = '#4a5568';
    } else {
      this.panel.style.background = 'white';
      this.panel.style.color = 'black';
      this.panel.style.borderColor = '#ddd';
    }
  }

  destroy(): void {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
      this.isVisible = false;
    }
  }
}