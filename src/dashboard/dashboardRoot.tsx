import React, { useState, useEffect, useCallback } from 'react';
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoRender
} from "plasmo";
import { createRoot } from "react-dom/client";

import { ModularDashboard } from './components/ModularDashboard';
import { DashboardSettingsPanel } from './components/DashboardSettingsPanel';
import { DashboardConfigManager } from './configManager';
import type { DashboardModule } from './types';

// Import React modules
import { StudentCouncilEventsModule } from './modules/StudentCouncilEventsModule';
import { ToolsCardModule } from './modules/ToolsCardModule';
import { CalendarModule } from './modules/CalendarModule';

export const config: PlasmoCSConfig = {
  matches: ["https://learnit.itu.dk/my*"]
};

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector('#block-region-content');
      if (rootContainerParent) {
        clearInterval(checkInterval);
        const rootContainer = document.createElement("div");
        rootContainer.id = "modular-dashboard-root";
        rootContainer.className = "modular-dashboard";
        rootContainerParent.insertBefore(rootContainer, rootContainerParent.firstChild);
        resolve(rootContainer);
      }
    }, 137);
  });

const DashboardRoot: React.FC = () => {
  const [modules] = useState(() => {
    const moduleMap = new Map<string, DashboardModule>();
    
    // Register React modules as function components
    moduleMap.set('student-council-events', {
      id: 'student-council-events',
      name: 'Student Council Events',
      component: StudentCouncilEventsModule,
      enabled: true,
      order: 0
    });
    
    moduleMap.set('tools-card', {
      id: 'tools-card',
      name: 'Study Tools',
      component: ToolsCardModule,
      enabled: true,
      order: 1
    });
    
    moduleMap.set('calendar', {
      id: 'calendar',
      name: 'Calendar',
      component: CalendarModule,
      enabled: true,
      order: 2
    });
    
    return moduleMap;
  });
  
  const [configManager] = useState(() => new DashboardConfigManager());
  const [showSettings, setShowSettings] = useState(false);

  const getEnabledModules = useCallback(() => {
    const config = configManager.getConfig();
    return Object.keys(config.modules).filter(
      moduleId => config.modules[moduleId]?.enabled !== false
    );
  }, [configManager]);

  const handleToggleModule = useCallback(async (moduleId: string) => {
    const config = configManager.getConfig();
    const currentEnabled = config.modules[moduleId]?.enabled !== false;
    await configManager.updateModuleEnabled(moduleId, !currentEnabled);
  }, [configManager]);

  return (
    <div>
      <ModularDashboard modules={modules} />
      {showSettings && (
        <DashboardSettingsPanel
          modules={modules}
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
          onToggleModule={handleToggleModule}
          getEnabledModules={getEnabledModules}
        />
      )}
    </div>
  );
};

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer();
  const root = createRoot(rootContainer);
  root.render(<DashboardRoot />);
};

export default DashboardRoot;