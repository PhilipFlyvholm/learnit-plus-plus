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

  const handleToggleModule = async (moduleId: string) => {
    const currentEnabled = config?.modules[moduleId]?.enabled !== false;
    await configManager.updateModuleEnabled(moduleId, !currentEnabled);
    setConfig(configManager.getConfig());
  };

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
      {sortedModules.map((module) => (
        <ModuleWrapper
          key={module.id}
          module={module}
          onToggle={handleToggleModule}
        />
      ))}
    </div>
  );
};

interface ModuleWrapperProps {
  module: DashboardModule;
  onToggle: (moduleId: string) => void;
}

const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ module, onToggle }) => {
  const [showControls, setShowControls] = useState(false);
  const [renderedComponent, setRenderedComponent] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    const renderComponent = async () => {
      if (typeof module.component === 'function') {
        const result = module.component();
        if (result instanceof Promise) {
          const component = await result;
          if (component instanceof HTMLElement) {
            // Convert HTML element to React element
            setRenderedComponent(<div dangerouslySetInnerHTML={{ __html: component.outerHTML }} />);
          } else {
            setRenderedComponent(component);
          }
        } else {
          if (result instanceof HTMLElement) {
            // Convert HTML element to React element
            setRenderedComponent(<div dangerouslySetInnerHTML={{ __html: result.outerHTML }} />);
          } else {
            setRenderedComponent(result);
          }
        }
      } else {
        if (module.component instanceof HTMLElement) {
          // Convert HTML element to React element
          setRenderedComponent(<div dangerouslySetInnerHTML={{ __html: module.component.outerHTML }} />);
        } else {
          setRenderedComponent(module.component);
        }
      }
    };

    renderComponent();
  }, [module.component]);

  const handleToggle = () => {
    onToggle(module.id);
  };

  if (!renderedComponent) {
    return (
      <div className="dashboard-module-wrapper" data-swapy-slot={module.id}>
        <div className="dashboard-module-item" data-swapy-item={module.id}>
          <div>Loading {module.name}...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="dashboard-module-wrapper"
      data-swapy-slot={module.id}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="dashboard-module-item" data-swapy-item={module.id}>
        <div 
          className="dashboard-module-controls"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.2s',
            zIndex: 10,
            display: 'flex',
            gap: '5px',
          }}
        >
          <button
            onClick={handleToggle}
            title="Hide module"
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            👁️
          </button>
          <div
            data-swapy-handle=""
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'move',
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            ⋮⋮
          </div>
        </div>
        {renderedComponent}
      </div>
    </div>
  );
};

export default ModularDashboard;