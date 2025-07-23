import { ModularDashboard } from './modularDashboard';
import {
  createStudentCouncilEventsModule,
  createToolsCardModule,
  createCalendarModule
} from './modules';

let dashboardInstance: ModularDashboard | null = null;

const dashboardCss = `
.modular-dashboard {
  position: relative;
}

.dashboard-module-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.dashboard-module-item {
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 8px;
}

.dashboard-module-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-module-item.swapy-dragging {
  transform: rotate(5deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}

.dashboard-module-controls {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
  display: flex;
  gap: 5px;
}

.dashboard-module-item:hover .dashboard-module-controls {
  opacity: 1;
}

.dashboard-module-controls button,
.dashboard-module-controls [data-swapy-handle] {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.dashboard-module-controls button:hover {
  background: rgba(0, 0, 0, 0.9);
}

.dashboard-module-controls [data-swapy-handle] {
  cursor: move;
  line-height: 1;
}

.dashboard-module-controls [data-swapy-handle]:hover {
  background: rgba(0, 0, 0, 0.9);
}

/* Dark mode support */
.dark .dashboard-module-controls button,
.dark .dashboard-module-controls [data-swapy-handle] {
  background: rgba(255, 255, 255, 0.8);
  color: black;
}

.dark .dashboard-module-controls button:hover,
.dark .dashboard-module-controls [data-swapy-handle]:hover {
  background: rgba(255, 255, 255, 0.95);
}

/* Swapy specific styles */
[data-swapy-slot] {
  transition: all 0.2s ease;
}

[data-swapy-item] {
  transition: all 0.2s ease;
}

.swapy-placeholder {
  background: rgba(0, 123, 255, 0.1);
  border: 2px dashed rgba(0, 123, 255, 0.3);
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 123, 255, 0.6);
  font-size: 0.9rem;
}

.swapy-placeholder::before {
  content: "Drop module here";
}
`;

export async function initializeModularDashboard(): Promise<void> {
  // Inject CSS
  if (!document.getElementById('modular-dashboard-styles')) {
    const style = document.createElement('style');
    style.id = 'modular-dashboard-styles';
    style.textContent = dashboardCss;
    document.head.appendChild(style);
  }

  // Initialize dashboard
  dashboardInstance = new ModularDashboard();
  await dashboardInstance.initialize();

  // Register default modules
  try {
    const studentCouncilModule = await createStudentCouncilEventsModule();
    dashboardInstance.registerModule(studentCouncilModule);
  } catch (error) {
    console.warn('Failed to create student council events module:', error);
  }

  dashboardInstance.registerModule(createToolsCardModule());
  dashboardInstance.registerModule(createCalendarModule());

  // Render modules
  await dashboardInstance.renderModules();
}

export function getDashboardInstance(): ModularDashboard | null {
  return dashboardInstance;
}

export async function addCustomModule(moduleId: string, name: string, componentFactory: () => HTMLElement): Promise<void> {
  if (!dashboardInstance) {
    console.warn('Dashboard not initialized');
    return;
  }

  const customModule = {
    id: moduleId,
    name,
    component: componentFactory,
    enabled: true,
    order: dashboardInstance.getAvailableModules().length
  };

  dashboardInstance.registerModule(customModule);
  await dashboardInstance.renderModules();
}