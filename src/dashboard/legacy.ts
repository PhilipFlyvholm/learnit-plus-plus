// Legacy support for backwards compatibility
// This maintains the old API while warning developers to migrate to React

import { ModularDashboard } from './modularDashboard';

let legacyDashboardInstance: ModularDashboard | null = null;

export function getDashboardInstance(): ModularDashboard | null {
  console.warn('getDashboardInstance() is deprecated. Please use React-based dashboard components instead.');
  return legacyDashboardInstance;
}

export async function addCustomModule(
  moduleId: string, 
  name: string, 
  componentFactory: () => HTMLElement
): Promise<void> {
  console.warn('addCustomModule() is deprecated. Please create React components and register them directly in the dashboard.');
  
  if (!legacyDashboardInstance) {
    console.warn('Legacy dashboard not initialized');
    return;
  }

  const customModule = {
    id: moduleId,
    name,
    component: componentFactory as () => HTMLElement,
    enabled: true,
    order: legacyDashboardInstance.getAvailableModules().length
  };

  legacyDashboardInstance.registerModule(customModule);
  await legacyDashboardInstance.renderModules();
}