# Manual Testing Guide for Modular Dashboard

## Prerequisites
1. Load the extension in development mode
2. Navigate to https://learnit.itu.dk/my/
3. Ensure you're logged in

## Test Cases

### 1. Basic Module Loading
**Expected:** Three default modules should appear in order:
- Student Council Events (if events are available)
- Study Tools 
- Calendar (placeholder)

**Verification:**
- [ ] All modules render correctly
- [ ] Each module has the expected content
- [ ] No JavaScript errors in console

### 2. Settings Panel Access
**Expected:** Dashboard settings button appears in navigation

**Steps:**
1. Look for "Dashboard ⚙️" button in top navigation
2. Click the button

**Verification:**
- [ ] Settings panel slides in from the right
- [ ] Panel shows all three default modules
- [ ] Each module has a toggle checkbox
- [ ] All modules are checked (enabled) by default

### 3. Module Toggle Functionality
**Expected:** Users can hide/show modules

**Steps:**
1. Open settings panel
2. Uncheck "Study Tools" module
3. Close settings panel

**Verification:**
- [ ] Study Tools module disappears from dashboard
- [ ] Other modules remain visible
- [ ] Setting persists after page refresh

### 4. Drag and Drop Functionality
**Expected:** Modules can be reordered by dragging

**Steps:**
1. Hover over any module
2. Look for drag handle (⋮⋮) in top-right corner
3. Click and drag the handle to reorder modules

**Verification:**
- [ ] Drag handle appears on hover
- [ ] Module follows cursor during drag
- [ ] Module snaps to new position when dropped
- [ ] Order persists after page refresh

### 5. Example Module (Development Mode)
**Expected:** Demo announcements module appears in development

**Verification:**
- [ ] "Student Organization Announcements" module appears
- [ ] Contains example announcement content
- [ ] Can be toggled and reordered like other modules

### 6. Backwards Compatibility
**Expected:** System falls back gracefully if modular system fails

**Steps:**
1. Temporarily break the modular dashboard (e.g., rename swapy import)
2. Reload the page

**Verification:**
- [ ] Original student council events still appear
- [ ] Original tools card still appears
- [ ] No major errors prevent page functionality

### 7. Dark Mode Compatibility
**Expected:** Controls work in both light and dark modes

**Steps:**
1. Toggle dark mode using the dark mode switch
2. Hover over modules to see controls

**Verification:**
- [ ] Drag handles are visible in both modes
- [ ] Settings panel adapts to dark mode
- [ ] Module controls have appropriate contrast

### 8. Storage Persistence
**Expected:** Settings persist across browser sessions

**Steps:**
1. Modify module order and visibility
2. Close browser
3. Reopen and navigate back to dashboard

**Verification:**
- [ ] Module order matches previous session
- [ ] Module visibility matches previous session
- [ ] No modules "reset" to defaults

## Known Limitations

1. **Build Issues**: Plasmo build currently fails with segmentation fault, but TypeScript compilation works
2. **Calendar Integration**: Calendar module is a placeholder - actual calendar integration may need additional work
3. **Module Communication**: No inter-module communication API implemented yet

## Performance Considerations

- Initial load should not be noticeably slower
- Drag operations should be smooth (60fps)
- Settings panel should open/close smoothly
- No memory leaks during drag operations