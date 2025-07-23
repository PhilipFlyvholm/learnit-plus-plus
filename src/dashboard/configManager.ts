import { DEFAULT_DASHBOARD_CONFIG, type DashboardConfig } from './types';

const STORAGE_KEY = 'dashboardConfig';

export class DashboardConfigManager {
  private config: DashboardConfig = DEFAULT_DASHBOARD_CONFIG;

  async loadConfig(): Promise<DashboardConfig> {
    try {
      const stored = await chrome.storage.local.get(STORAGE_KEY);
      if (stored[STORAGE_KEY]) {
        this.config = { ...DEFAULT_DASHBOARD_CONFIG, ...stored[STORAGE_KEY] };
      }
    } catch (error) {
      console.warn('Failed to load dashboard config, using defaults:', error);
    }
    return this.config;
  }

  async saveConfig(config: DashboardConfig): Promise<void> {
    try {
      this.config = config;
      await chrome.storage.local.set({ [STORAGE_KEY]: config });
    } catch (error) {
      console.error('Failed to save dashboard config:', error);
    }
  }

  getConfig(): DashboardConfig {
    return this.config;
  }

  async updateModuleEnabled(moduleId: string, enabled: boolean): Promise<void> {
    const config = { ...this.config };
    if (!config.modules[moduleId]) {
      config.modules[moduleId] = { enabled, order: Object.keys(config.modules).length };
    } else {
      config.modules[moduleId].enabled = enabled;
    }
    await this.saveConfig(config);
  }

  async updateLayout(layout: string[]): Promise<void> {
    const config = { ...this.config };
    config.layout = layout;
    // Update order based on layout position
    layout.forEach((moduleId, index) => {
      if (config.modules[moduleId]) {
        config.modules[moduleId].order = index;
      }
    });
    await this.saveConfig(config);
  }
}