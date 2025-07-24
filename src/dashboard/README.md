# Modular Dashboard System

A customizable dashboard with drag-and-drop reordering for LearnIT++.

## Features
- **Drag & Drop**: Reorder modules by dragging
- **Toggle Visibility**: Hide/show modules via settings panel
- **Persistent Settings**: Preferences saved automatically

## Usage

### For Users
1. Hover over modules to see drag handles
2. Click "Dashboard ⚙️" to access settings
3. Drag to reorder, toggle checkboxes to hide/show

### For Developers
```typescript
import { addCustomModule } from '~/dashboard';

const MyModule: React.FC = () => (
  <div className="card dashboard-card">
    <div className="card-body">
      <h5 className="card-title">My Module</h5>
      <p>Content here</p>
    </div>
  </div>
);

await addCustomModule('my-module', 'My Module', MyModule);
```

## Architecture
- **ModularDashboard.tsx**: Main container with drag-and-drop
- **DashboardSettingsPanel.tsx**: Settings interface
- **Built-in Modules**: Student Council Events, Tools Card, Calendar
- **Custom Modules**: Added via public API