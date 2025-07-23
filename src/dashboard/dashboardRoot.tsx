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
        // Insert before existing content
        rootContainerParent.insertBefore(rootContainer, rootContainerParent.firstChild);
        resolve(rootContainer);
      }
    }, 137);
  });

const DashboardRoot: React.FC = () => {
  const [modules] = useState(() => {
    const moduleMap = new Map<string, DashboardModule>();
    
    // Register React modules
    moduleMap.set('student-council-events', {
      id: 'student-council-events',
      name: 'Student Council Events',
      component: <StudentCouncilEventsModule />,
      enabled: true,
      order: 0
    });
    
    moduleMap.set('tools-card', {
      id: 'tools-card',
      name: 'Study Tools',
      component: <ToolsCardModule />,
      enabled: true,
      order: 1
    });
    
    moduleMap.set('calendar', {
      id: 'calendar',
      name: 'Calendar',
      component: <CalendarModule />,
      enabled: true,
      order: 2
    });
    
    return moduleMap;
  });
  
  const [configManager] = useState(() => new DashboardConfigManager());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize config manager
    configManager.loadConfig();

    // Add dashboard settings button to navigation
    const addSettingsButton = () => {
      const userNav = document.querySelector('#usernavigation');
      if (!userNav || document.querySelector('#dashboard-settings-btn')) return;
      
      const settingsBtn = document.createElement('a');
      settingsBtn.id = 'dashboard-settings-btn';
      settingsBtn.className = 'nav-link';
      settingsBtn.style.cursor = 'pointer';
      settingsBtn.textContent = 'Dashboard ⚙️';
      settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setShowSettings(prev => !prev);
      });
      
      userNav.appendChild(settingsBtn);
    };

    addSettingsButton();
  }, [configManager]);

  const handleToggleModule = useCallback(async (moduleId: string) => {
    const config = configManager.getConfig();
    const currentEnabled = config.modules[moduleId]?.enabled !== false;
    await configManager.updateModuleEnabled(moduleId, !currentEnabled);
  }, [configManager]);

  const getEnabledModules = useCallback(() => {
    const config = configManager.getConfig();
    return Object.entries(config.modules)
      .filter(([_, moduleConfig]) => moduleConfig.enabled)
      .map(([id, _]) => id);
  }, [configManager]);

  return (
    <>
      <ModularDashboard modules={modules} />
      <DashboardSettingsPanel
        modules={modules}
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        onToggleModule={handleToggleModule}
        getEnabledModules={getEnabledModules}
      />
    </>
  );
};

export const getShadowHostId = () => "plasmo-inline-modular-dashboard";

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer();
  const root = createRoot(rootContainer);
  root.render(<DashboardRoot />);
};

export default DashboardRoot;