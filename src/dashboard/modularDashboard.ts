import { createSwapy } from 'swapy';
import { DashboardConfigManager } from './configManager';
import type { DashboardModule, DashboardConfig } from './types';

export class ModularDashboard {
  private configManager = new DashboardConfigManager();
  private modules = new Map<string, DashboardModule>();
  private container: HTMLElement | null = null;
  private swapy: any = null;

  async initialize(): Promise<void> {
    await this.configManager.loadConfig();
    this.createDashboardContainer();
    this.setupSwapy();
  }

  private createDashboardContainer(): void {
    const blockRegion = document.getElementById('block-region-content');
    if (!blockRegion) {
      console.warn('Block region content not found');
      return;
    }

    // Create the modular dashboard container
    this.container = document.createElement('div');
    this.container.id = 'modular-dashboard';
    this.container.className = 'modular-dashboard';
    
    // Insert before existing content
    blockRegion.insertBefore(this.container, blockRegion.firstChild);
  }

  private setupSwapy(): void {
    if (!this.container) return;

    try {
      this.swapy = createSwapy(this.container, {
        animation: 'dynamic',
        autoScrollOnDrag: true
      });

      // Listen for swap events
      this.swapy?.onSwap((event: any) => {
        const newLayout = Array.from(this.container!.querySelectorAll('[data-swapy-item]')).map(
          (child: Element) => child.getAttribute('data-swapy-item') || ''
        ).filter(id => id);
        
        this.configManager.updateLayout(newLayout);
      });
    } catch (error) {
      console.warn('Failed to initialize Swapy:', error);
    }
  }

  registerModule(module: DashboardModule): void {
    this.modules.set(module.id, module);
  }

  async renderModules(): Promise<void> {
    if (!this.container) return;

    const config = this.configManager.getConfig();
    
    // Clear existing content
    this.container.innerHTML = '';

    // Sort modules by layout order
    const sortedModules = config.layout
      .map(id => this.modules.get(id))
      .filter((module): module is DashboardModule => 
        module !== undefined && config.modules[module.id]?.enabled !== false
      );

    // Render each enabled module
    for (const module of sortedModules) {
      const moduleWrapper = this.createModuleWrapper(module);
      const moduleItem = moduleWrapper.querySelector('.dashboard-module-item')!;
      
      if (typeof module.component === 'function') {
        const component = module.component();
        if (component instanceof Promise) {
          // Handle async components
          component.then((resolvedComponent) => {
            if (resolvedComponent instanceof HTMLElement) {
              moduleItem.appendChild(resolvedComponent);
            } else {
              // This is a React element, we can't directly append it to DOM
              console.warn('React elements not supported in legacy dashboard. Use dashboardRoot.tsx instead.');
            }
          });
        } else {
          if (component instanceof HTMLElement) {
            moduleItem.appendChild(component);
          } else {
            // This is a React element, we can't directly append it to DOM
            console.warn('React elements not supported in legacy dashboard. Use dashboardRoot.tsx instead.');
          }
        }
      } else {
        if (module.component instanceof HTMLElement) {
          moduleItem.appendChild(module.component);
        } else {
          // This is a React element, we can't directly append it to DOM
          console.warn('React elements not supported in legacy dashboard. Use dashboardRoot.tsx instead.');
        }
      }
      
      this.container.appendChild(moduleWrapper);
    }

    // Update Swapy if available
    if (this.swapy) {
      this.swapy.update();
    }
  }

  private createModuleWrapper(module: DashboardModule): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-module-wrapper';
    wrapper.setAttribute('data-swapy-slot', module.id);
    
    const item = document.createElement('div');
    item.className = 'dashboard-module-item';
    item.setAttribute('data-swapy-item', module.id);
    
    // Add module controls
    const controls = this.createModuleControls(module);
    item.appendChild(controls);
    
    wrapper.appendChild(item);
    
    return wrapper; // Return the wrapper so content gets added to the item via the next line
  }

  private createModuleControls(module: DashboardModule): HTMLElement {
    const controls = document.createElement('div');
    controls.className = 'dashboard-module-controls';
    controls.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 10;
      display: flex;
      gap: 5px;
    `;

    // Hide/Show toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '👁️';
    toggleBtn.title = 'Hide module';
    toggleBtn.style.cssText = `
      background: rgba(0,0,0,0.7);
      border: none;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    toggleBtn.onclick = async () => {
      await this.configManager.updateModuleEnabled(module.id, false);
      this.renderModules();
    };

    // Drag handle
    const dragHandle = document.createElement('div');
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.style.cssText = `
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: move;
      font-size: 12px;
      line-height: 1;
    `;
    dragHandle.setAttribute('data-swapy-handle', '');

    controls.appendChild(toggleBtn);
    controls.appendChild(dragHandle);

    // Show controls on hover
    const moduleItem = controls.parentElement || controls;
    const showControls = () => controls.style.opacity = '1';
    const hideControls = () => controls.style.opacity = '0';
    
    // Add hover listeners to the parent when it's available
    setTimeout(() => {
      const parent = controls.closest('.dashboard-module-item');
      if (parent) {
        parent.addEventListener('mouseenter', showControls);
        parent.addEventListener('mouseleave', hideControls);
      }
    }, 0);

    return controls;
  }

  async toggleModule(moduleId: string): Promise<void> {
    const config = this.configManager.getConfig();
    const currentEnabled = config.modules[moduleId]?.enabled !== false;
    await this.configManager.updateModuleEnabled(moduleId, !currentEnabled);
    this.renderModules();
  }

  getAvailableModules(): string[] {
    return Array.from(this.modules.keys());
  }

  getEnabledModules(): string[] {
    const config = this.configManager.getConfig();
    return Object.entries(config.modules)
      .filter(([_, moduleConfig]) => moduleConfig.enabled)
      .map(([id, _]) => id);
  }
}