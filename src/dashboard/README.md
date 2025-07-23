# Modular Dashboard System

The LearnIT++ extension now features a modular dashboard system that allows users to customize their dashboard experience with drag-and-drop functionality.

## Features

- **Drag and Drop**: Reorder modules by dragging them to new positions
- **Module Toggle**: Hide/show modules using the dashboard settings panel
- **Persistent Settings**: User preferences are saved and restored across sessions
- **Extensible**: Other student organizations can create custom modules
- **Responsive**: Hover controls appear when you hover over modules

## Using the Dashboard

### Basic Usage

1. **Reordering Modules**: Hover over any module to see the drag handle (⋮⋮) in the top-right corner. Click and drag to reorder.

2. **Settings Panel**: Click the "Dashboard ⚙️" button in the top navigation to open the settings panel.

3. **Toggle Modules**: In the settings panel, use the checkboxes to show/hide modules.

### Default Modules

- **Student Council Events**: Shows upcoming events from the student council
- **Study Tools**: Quick links to important ITU resources
- **Calendar**: Integration with TimeEdit calendar (if available)

## For Developers: Creating Custom Modules

Student organizations can create custom modules by implementing the `DashboardModule` interface:

```typescript
import { addCustomModule } from '~/dashboard';

// Create your module component
function createMyModule() {
  const section = document.createElement("section");
  section.className = "block_my_module block card mb-3";
  section.setAttribute("role", "complementary");

  const div = document.createElement("div");
  div.className = "card-body p-3";

  const header = document.createElement("h5");
  header.className = "card-title d-inline";
  header.textContent = "My Custom Module";

  const content = document.createElement("div");
  content.innerHTML = "Your module content here...";

  div.appendChild(header);
  div.appendChild(content);
  section.appendChild(div);

  return section;
}

// Register the module
await addCustomModule(
  'my-custom-module',      // Unique module ID
  'My Custom Module',      // Display name
  createMyModule          // Component factory function
);
```

### Module Interface

```typescript
interface DashboardModule {
  id: string;                                    // Unique identifier
  name: string;                                  // Display name
  component: HTMLElement | (() => HTMLElement); // Component or factory
  enabled: boolean;                              // Initial visibility state
  order: number;                                 // Initial position
}
```

### Best Practices

1. **Unique IDs**: Use descriptive, unique module IDs (e.g., `student-union-events`)
2. **Consistent Styling**: Follow the existing card design pattern
3. **Error Handling**: Wrap module creation in try-catch blocks
4. **Performance**: Keep modules lightweight and avoid heavy computations in constructors
5. **Accessibility**: Include proper ARIA attributes and semantic HTML

## Technical Details

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