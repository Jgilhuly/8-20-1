# Dark Mode Implementation Plan

## Overview
Implement a high-contrast dark mode theme for the Employee Portal that persists across browser sessions and is accessible from the header navigation.

## Requirements
- ✅ Theme preference stored in localStorage
- ✅ Toggle button positioned in header top-right
- ✅ High-contrast dark theme design
- ✅ All pages respect the theme setting

## Implementation Phases

### Phase 1: CSS Architecture & Variables
**Files to modify:**
- `css/styles.css` - Main styles and variables
- `css/components.css` - Component-specific styles
- `css/employee-directory.css` - Employee directory styles
- `css/responsive.css` - Responsive design adjustments

**Tasks:**
1. Add CSS custom properties for all colors at the top of `styles.css`
2. Define light theme color palette (current colors)
3. Define high-contrast dark theme color palette
4. Replace all hardcoded colors with CSS variables
5. Update all CSS files to use the new variable system

**Dark Theme Color Palette:**
- Background: `#0a0a0a` (very dark)
- Surface: `#1a1a1a` (dark gray)
- Primary: `#4f46e5` (bright indigo)
- Secondary: `#7c3aed` (bright purple)
- Text: `#ffffff` (white)
- Text Secondary: `#d1d5db` (light gray)
- Accent: `#f59e0b` (bright amber)
- Border: `#374151` (medium gray)

### Phase 2: JavaScript Theme Management
**Files to modify:**
- `js/app.js` - Main application logic
- `js/components.js` - UI components
- `js/employee-directory.js` - Employee directory functionality

**Tasks:**
1. Add theme management class to `app.js`
2. Implement localStorage persistence
3. Add system theme detection (prefers-color-scheme)
4. Create theme toggle functionality
5. Ensure theme state is shared across all JavaScript modules

**Theme Management Features:**
- `getCurrentTheme()` - Get current theme from localStorage or system preference
- `setTheme(theme)` - Apply theme and save to localStorage
- `toggleTheme()` - Switch between light and dark modes
- `initializeTheme()` - Set initial theme on page load

### Phase 3: UI Components & Toggle Button
**Files to modify:**
- `index.html` - Main dashboard
- `employee-directory.html` - Employee directory page

**Tasks:**
1. Add theme toggle button to header (top-right position)
2. Style toggle button with appropriate icons
3. Ensure toggle button is visible in both themes
4. Add smooth transitions between themes

**Toggle Button Design:**
- Position: Top-right of header, after navigation
- Icon: Sun (☀️) for light mode, Moon (🌙) for dark mode
- Style: Consistent with existing header design
- Animation: Smooth icon transition on theme change

### Phase 4: Theme Application & Testing
**Testing Checklist:**
- [ ] Main dashboard (`index.html`) respects theme
- [ ] Employee directory page respects theme
- [ ] All components maintain proper contrast
- [ ] Theme persists across page refreshes
- [ ] Theme persists across browser sessions
- [ ] Smooth transitions between themes
- [ ] Toggle button works on all pages
- [ ] No broken styling in either theme

## Technical Implementation Details

### CSS Variables Structure
```css
:root {
  /* Light Theme (Default) */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  /* ... more variables */
}

[data-theme="dark"] {
  /* Dark Theme */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;
  /* ... more variables */
}
```

### JavaScript Theme Management
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = this.getCurrentTheme();
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggleButton();
  }
  
  // ... implementation methods
}
```

### HTML Structure for Toggle
```html
<header class="header">
  <div class="header-content">
    <div class="logo">🏢 Company Portal</div>
    <nav>
      <!-- existing navigation -->
    </nav>
    <button class="theme-toggle" aria-label="Toggle dark mode">
      <span class="theme-icon">🌙</span>
    </button>
  </div>
</header>
```

## File Modification Order
1. `css/styles.css` - Add CSS variables and base theme styles
2. `css/components.css` - Update component colors
3. `css/employee-directory.css` - Update directory-specific styles
4. `css/responsive.css` - Ensure responsive design works with themes
5. `js/app.js` - Add theme management functionality
6. `index.html` - Add theme toggle button
7. `employee-directory.html` - Add theme toggle button
8. Test and refine across all pages

## Success Criteria
- Users can toggle between light and dark themes
- Theme preference is remembered across browser sessions
- All pages consistently display the selected theme
- High contrast ratios maintained for accessibility
- Smooth transitions between themes
- No broken styling or layout issues
- Toggle button is easily accessible in header

## Accessibility Considerations
- Maintain WCAG AA contrast ratios in both themes
- Ensure toggle button has proper ARIA labels
- Test with screen readers
- Verify keyboard navigation works in both themes
