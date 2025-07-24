import React, { useEffect, useRef, useState } from 'react';
import { createSwapy } from 'swapy';
import { DashboardConfigManager } from '../configManager';
import type { DashboardModule, DashboardConfig } from '../types';

interface ModularDashboardProps {
  modules: Map<string, DashboardModule>;
}

export const ModularDashboard: React.FC<ModularDashboardProps> = ({ modules }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [configManager] = useState(() => new DashboardConfigManager());
  const swapyRef = useRef<any>(null);

  useEffect(() => {
    const initializeConfig = async () => {
      await configManager.loadConfig();
      setConfig(configManager.getConfig());
    };
    initializeConfig();
  }, [configManager]);

  useEffect(() => {
    if (!containerRef.current || !config) return;

    try {
      swapyRef.current = createSwapy(containerRef.current, {
        animation: 'dynamic',
        autoScrollOnDrag: true
      });

      swapyRef.current?.onSwap((event: any) => {
        const newLayout = Array.from(containerRef.current!.querySelectorAll('[data-swapy-item]'))
          .map((child: Element) => child.getAttribute('data-swapy-item') || '')
          .filter(id => id);
        
        configManager.updateLayout(newLayout);
      });
    } catch (error) {
      console.warn('Failed to initialize Swapy:', error);
    }

    return () => {
      if (swapyRef.current) {
        swapyRef.current = null;
      }
    };
  }, [config, configManager]);

  if (!config) {
    return <div>Loading dashboard...</div>;
  }

  // Sort modules by layout order
  const sortedModules = config.layout
    .map(id => modules.get(id))
    .filter((module): module is DashboardModule => 
      module !== undefined && config.modules[module.id]?.enabled !== false
    );

  return (
    <div ref={containerRef} id="modular-dashboard" className="modular-dashboard">
      {sortedModules.map((module) => {
        const Component = module.component;
        return (
          <div key={module.id} className="dashboard-module-wrapper" data-swapy-slot={module.id}>
            <div className="dashboard-module-item" data-swapy-item={module.id}>
              <Component />
            </div>
          </div>
        );
      })}
    </div>
  );
};