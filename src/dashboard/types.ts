export interface DashboardModule {
  id: string;
  name: string;
  component: HTMLElement | (() => HTMLElement);
  enabled: boolean;
  order: number;
}

export interface DashboardConfig {
  modules: Record<string, {
    enabled: boolean;
    order: number;
  }>;
  layout: string[]; // Array of module IDs in order
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  modules: {
    'student-council-events': { enabled: true, order: 0 },
    'tools-card': { enabled: true, order: 1 },
    'calendar': { enabled: true, order: 2 }
  },
  layout: ['student-council-events', 'tools-card', 'calendar']
};