import React, { useState, useEffect } from 'react';
import type { DashboardModule } from '../types';

interface DashboardSettingsPanelProps {
  modules: Map<string, DashboardModule>;
  isVisible: boolean;
  onClose: () => void;
  onToggleModule: (moduleId: string) => Promise<void>;
  getEnabledModules: () => string[];
}

export const DashboardSettingsPanel: React.FC<DashboardSettingsPanelProps> = ({
  modules,
  isVisible,
  onClose,
  onToggleModule,
  getEnabledModules
}) => {
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setEnabledModules(getEnabledModules());
  }, [getEnabledModules]);

  useEffect(() => {
    const updateDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    updateDarkMode();
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const handleToggleModule = async (moduleId: string) => {
    await onToggleModule(moduleId);
    setEnabledModules(getEnabledModules());
  };

  const getModuleName = (moduleId: string): string => {
    const nameMap: Record<string, string> = {
      'student-council-events': 'Student Council Events',
      'tools-card': 'Study Tools',
      'calendar': 'Calendar'
    };
    return nameMap[moduleId] || moduleId;
  };

  const panelStyles: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '300px',
    background: isDark ? '#2d3748' : 'white',
    color: isDark ? 'white' : 'black',
    border: `1px solid ${isDark ? '#4a5568' : '#ddd'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '16px',
    zIndex: 10000,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px',
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    color: 'inherit',
  };

  const descriptionStyles: React.CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: isDark ? '#a0aec0' : '#666',
  };

  const moduleItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  };

  const moduleNameStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
  };

  const checkboxStyles: React.CSSProperties = {
    cursor: 'pointer',
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>Dashboard Modules</h3>
        <button 
          style={closeButtonStyles} 
          onClick={onClose}
          aria-label="Close settings"
        >
          ✕
        </button>
      </div>
      
      <div>
        <p style={descriptionStyles}>
          Toggle modules on/off or drag to reorder them on the dashboard.
        </p>
        
        <div>
          {Array.from(modules.keys()).map(moduleId => (
            <div key={moduleId} style={moduleItemStyles}>
              <div style={moduleNameStyles}>
                {getModuleName(moduleId)}
              </div>
              <input
                type="checkbox"
                style={checkboxStyles}
                checked={enabledModules.includes(moduleId)}
                onChange={() => handleToggleModule(moduleId)}
              />
            </div>
          ))}
          
          {Array.from(modules.keys()).length === 0 && (
            <div style={{
              textAlign: 'center',
              color: isDark ? '#a0aec0' : '#666',
              fontStyle: 'italic',
              padding: '16px 0',
            }}>
              No modules available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingsPanel;