# Company Employee Portal

A modern, responsive internal landing page for company employees with a clean design, interactive features, and **full dark mode support**.

## Features

- **Modern Design**: Glassmorphism effects with gradient background
- **Dark Mode**: High-contrast dark theme with smooth transitions
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Clickable action cards and navigation
- **Real-time Updates**: Auto-refreshing announcements and statistics
- **Accessibility**: Keyboard navigation, ARIA labels, and WCAG compliant themes
- **Component-based**: Modular JavaScript architecture
- **Theme Persistence**: Remembers user's theme preference across sessions

## File Structure

```
8-20-1/
├── index.html                    # Main dashboard page
├── employee-directory.html       # Employee directory page
├── css/
│   ├── styles.css               # Base styles, layout, and theme variables
│   ├── components.css           # Component-specific styles
│   ├── employee-directory.css   # Employee directory specific styles
│   └── responsive.css           # Media queries and responsive design
├── js/
│   ├── app.js                  # Main application logic with theme management
│   ├── components.js           # Component functionality and utilities
│   ├── employee-directory.js   # Employee directory functionality
│   └── api.js                  # API integration layer
├── .cursor/docs/
│   ├── DARK_MODE_IMPLEMENTATION_PLAN.md      # Original implementation plan
│   └── DARK_MODE_IMPLEMENTATION_COMPLETE.md  # Completed implementation docs
└── README.md                    # This file
```

## Dark Mode Features

### Theme System
- **Light Theme**: Clean, professional light design (default)
- **Dark Theme**: High-contrast dark theme for low-light environments
- **System Detection**: Automatically detects OS theme preference
- **Manual Toggle**: Easy theme switching via header button

### Theme Toggle
- **Position**: Top-right corner of header navigation
- **Icons**: Moon (🌙) for light mode, Sun (☀️) for dark mode
- **Animation**: Smooth transitions and hover effects
- **Responsive**: Adapts to mobile and tablet layouts

### Theme Persistence
- **localStorage**: Saves user preference across browser sessions
- **Cross-Page**: Consistent theme across all portal pages
- **System Sync**: Respects operating system theme changes

## CSS Organization

### `styles.css`
- Base styles and CSS reset
- **CSS Custom Properties for themes**
- Typography and layout
- Header and footer styles
- Main container and grid layout
- **Theme toggle button styles**

### `components.css`
- Quick action cards
- Announcements section
- Sidebar widgets
- Employee statistics
- Quick links
- **All components support both themes**

### `employee-directory.css`
- Employee directory specific styles
- Data tables and forms
- Modal dialogs
- **Full theme support for all elements**

### `responsive.css`
- Mobile-first responsive design
- Tablet and mobile breakpoints
- **Theme toggle responsive adjustments**
- Print styles
- High DPI display support

## JavaScript Architecture

### `app.js`
- Main `CompanyPortal` class
- **`ThemeManager` class for theme management**
- Event handling for user interactions
- Navigation and routing
- User data management
- Browser notifications

### `components.js`
- Utility functions (`Utils`)
- `AnnouncementsComponent` for managing company announcements
- `EmployeeStatsComponent` for statistics display
- `QuickActionsComponent` for interactive action cards

### `employee-directory.js`
- Employee directory functionality
- **Standalone theme management support**
- Data filtering and search
- CRUD operations for employees

## Key Components

### Quick Actions
- Time Off Requests
- Paystub Access
- Performance Reviews
- IT Support

### Company Announcements
- Real-time updates
- Priority-based styling
- Auto-refresh functionality

### Employee Dashboard
- Company statistics
- Quick access links
- Upcoming events

### Theme Management
- **Automatic theme detection**
- **Smooth theme transitions**
- **Cross-page consistency**
- **Mobile responsive design**

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- **CSS Custom Properties (CSS Variables)**
- **localStorage for theme persistence**
- **System theme detection (prefers-color-scheme)**
- Backdrop Filter (with fallbacks)

## Development

To modify the portal:

1. **Styling**: Edit CSS files in the `css/` directory
   - Use theme variables for colors: `var(--text-primary)`, `var(--bg-primary)`
   - Add new themes by extending the CSS variable system
2. **Functionality**: Modify JavaScript files in the `js/` directory
   - Theme management is handled by the `ThemeManager` class
   - Listen for `themechange` events for theme-aware components
3. **Content**: Update the HTML structure in `index.html` and `employee-directory.html`
4. **New Features**: Add new components following the existing pattern
   - Ensure all new components support both themes
   - Use the established CSS variable system

## Theme Development

### Adding New Theme Colors
```css
:root {
    --custom-color: #your-light-color;
}

[data-theme="dark"] {
    --custom-color: #your-dark-color;
}
```

### Creating Theme-Aware Components
```css
.new-component {
    background: var(--surface-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    transition: background 0.3s ease, color 0.3s ease;
}
```

### JavaScript Theme Integration
```javascript
// Listen for theme changes
window.addEventListener('themechange', (e) => {
    console.log('Theme changed to:', e.detail.theme);
    // Update component accordingly
});

// Access current theme
const currentTheme = window.companyPortal.themeManager.currentTheme;
```

## Future Enhancements

- User authentication and profiles
- Real API integration
- Advanced search functionality
- Customizable dashboard widgets
- **Additional theme options (high contrast, sepia, etc.)**
- **Theme customization for individual users**
- Multi-language support

## License

Internal use only - Company Name © 2024