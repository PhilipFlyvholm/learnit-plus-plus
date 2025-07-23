# Modular Dashboard System (React-Based)

The LearnIT++ extension now features a **React-based** modular dashboard system that allows users to customize their dashboard experience with drag-and-drop functionality.

## 🎯 Key Features

- **React Components**: Built with modern React for better maintainability
- **Drag and Drop**: Reorder modules by dragging them to new positions
- **Module Toggle**: Hide/show modules using the dashboard settings panel
- **Persistent Settings**: User preferences are saved and restored across sessions
- **Extensible**: Student organizations can create custom React modules
- **Responsive**: Hover controls appear when you hover over modules
- **TypeScript**: Full type safety with React components

## 🚀 Using the Dashboard

### Basic Usage

1. **Reordering Modules**: Hover over any module to see the drag handle (⋮⋮) in the top-right corner. Click and drag to reorder.

2. **Settings Panel**: Click the "Dashboard ⚙️" button in the top navigation to open the settings panel.

3. **Toggle Modules**: In the settings panel, use the checkboxes to show/hide modules.

### Default Modules

- **Student Council Events**: Shows upcoming events from the student council
- **Study Tools**: Quick links to important ITU resources  
- **Calendar**: Integration with TimeEdit calendar (if available)

## 👩‍💻 For Developers: Creating Custom React Modules

Student organizations can now create custom modules using **React components**:

### React Module Example

```typescript
import React from 'react';

// Create your React module component
export const MyCustomModule: React.FC = () => {
  return (
    <section 
      className="block_my_module block card mb-3"
      role="complementary"
    >
      <div className="card-body p-3">
        <h5 className="card-title d-inline">My Custom Module</h5>
        <div className="card-text">
          <p>Your module content here...</p>
          <button className="btn btn-primary">Custom Action</button>
        </div>
      </div>
    </section>
  );
};

// Register your module in dashboardRoot.tsx
// Add to the moduleMap in DashboardRoot component:
moduleMap.set('my-custom-module', {
  id: 'my-custom-module',
  name: 'My Custom Module',
  component: <MyCustomModule />,
  enabled: true,
  order: 3
});
```

### Benefits of React Modules

- **Component Reusability**: Share components across modules
- **State Management**: Use React hooks for local state
- **Event Handling**: Clean event handling with React patterns
- **TypeScript Support**: Full type safety and IntelliSense
- **Developer Experience**: Hot reloading and better debugging

### Migration from Legacy Modules

If you have existing HTML-based modules, they're still supported but deprecated:

```typescript
// ❌ Deprecated: HTML-based modules
await addCustomModule('my-module', 'My Module', () => {
  const div = document.createElement('div');
  // ... HTML creation
  return div;
});

// ✅ Recommended: React-based modules
export const MyModule: React.FC = () => (
  <div>My module content</div>
);
```

### Module Interface

```typescript
interface DashboardModule {
  id: string;                                          // Unique identifier
  name: string;                                        // Display name
  component: ReactElement | HTMLElement |             // React component or HTML
    (() => ReactElement | Promise<ReactElement>) |    // Component factory
    (() => HTMLElement);                               // Legacy HTML factory
  enabled: boolean;                                    // Initial visibility state
  order: number;                                       // Initial position
}
```

### Best Practices

1. **Use React**: Create new modules as React components for better maintainability
2. **Unique IDs**: Use descriptive, unique module IDs (e.g., `student-union-events`)
3. **Consistent Styling**: Follow the existing card design pattern
4. **Error Handling**: Use React error boundaries for robust error handling
5. **Performance**: Use React.memo() and useMemo() for optimization
6. **Accessibility**: Include proper ARIA attributes and semantic JSX

## 🔧 Technical Details

### Storage

Module configurations are stored in Chrome's local storage using the key `dashboardConfig`. The configuration includes:

- Module visibility states
- Module order preferences
- Layout arrangement

### Drag and Drop

The system uses the [Swapy](https://swapy.tahazsh.com/) library for smooth drag-and-drop interactions with:

- Dynamic animations
- Auto-scroll on drag
- Visual feedback during dragging

### Backwards Compatibility

If the modular dashboard fails to initialize, the system falls back to the original hardcoded module loading approach, ensuring the extension continues to work.

## Future Enhancements

- Module marketplace for easy installation
- Module permissions and security
- Advanced layout options (grid layouts, custom positioning)
- Module-to-module communication API
- Import/export of dashboard configurations