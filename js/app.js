// Theme Management Class
class ThemeManager {
    constructor() {
        this.currentTheme = this.getCurrentTheme();
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupToggleButton();
        this.setupSystemThemeListener();
    }
    
    getCurrentTheme() {
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light'; // Default to light theme
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button icon
        this.updateToggleButtonIcon();
        
        // Trigger theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }
    
    setupToggleButton() {
        // Create theme toggle button if it doesn't exist
        let toggleButton = document.querySelector('.theme-toggle');
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.className = 'theme-toggle';
            toggleButton.setAttribute('aria-label', 'Toggle dark mode');
            toggleButton.innerHTML = '<span class="theme-icon">🌙</span>';
            
            // Add click event
            toggleButton.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // Insert into header
            const headerContent = document.querySelector('.header-content');
            if (headerContent) {
                headerContent.appendChild(toggleButton);
            }
        }
        
        this.updateToggleButtonIcon();
    }
    
    updateToggleButtonIcon() {
        const toggleButton = document.querySelector('.theme-toggle');
        if (toggleButton) {
            const icon = toggleButton.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }
    }
    
    setupSystemThemeListener() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(newTheme);
                }
            });
        }
    }
}

// Main Application JavaScript
class CompanyPortal {
    constructor() {
        this.currentUser = null;
        this.themeManager = new ThemeManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.updateTime();
        this.setupNotifications();
    }

    setupEventListeners() {
        // Action card click handlers
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleActionCardClick(e));
        });

        // Quick links click handlers
        document.querySelectorAll('.quick-links a').forEach(link => {
            link.addEventListener('click', (e) => this.handleQuickLinkClick(e));
        });

        // Navigation menu handlers
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    handleActionCardClick(event) {
        const card = event.currentTarget;
        const action = card.dataset.action;
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Handle different actions
        switch(action) {
            case 'time-off':
                this.openTimeOffModal();
                break;
            case 'paystub':
                this.openPaystubModal();
                break;
            case 'performance':
                this.openPerformanceModal();
                break;
            case 'it-support':
                this.openITSupportModal();
                break;
            default:
                console.log('Action not implemented:', action);
        }
    }

    handleQuickLinkClick(event) {
        event.preventDefault();
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        
        // Remove # from href
        const section = href.substring(1);
        
        // Handle different quick links
        switch(section) {
            case 'handbook':
                this.openEmployeeHandbook();
                break;
            case 'directory':
                this.openCompanyDirectory();
                break;
            case 'calendar':
                this.openCompanyCalendar();
                break;
            case 'benefits':
                this.openBenefitsPortal();
                break;
            case 'knowledge-base':
                this.openITKnowledgeBase();
                break;
            case 'hr-contact':
                this.openHRContact();
                break;
            default:
                console.log('Quick link not implemented:', section);
        }
    }

    handleNavigation(event) {
        event.preventDefault();
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        
        // Remove # from href
        const section = href.substring(1);
        
        // Update active navigation
        this.updateActiveNavigation(link);
        
        // Handle navigation (placeholder for future implementation)
        console.log('Navigating to:', section);
    }

    updateActiveNavigation(activeLink) {
        // Remove active class from all navigation links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    loadUserData() {
        // Simulate loading user data
        this.currentUser = {
            name: 'Employee',
            id: 'EMP001',
            department: 'Engineering',
            role: 'Software Developer',
            email: 'employee@company.com'
        };
        
        this.updateWelcomeMessage();
    }

    updateWelcomeMessage() {
        const welcomeTitle = document.querySelector('.welcome-section h1');
        if (welcomeTitle && this.currentUser) {
            welcomeTitle.textContent = `Welcome back, ${this.currentUser.name}!`;
        }
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        // Update time in header if there's a time element
        const timeElement = document.querySelector('.current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
        
        // Update every second
        setTimeout(() => this.updateTime(), 1000);
    }

    setupNotifications() {
        // Check for browser notifications support
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                this.showWelcomeNotification();
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showWelcomeNotification();
                    }
                });
            }
        }
    }

    showWelcomeNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Company Portal', {
                body: 'Welcome to your employee dashboard!',
                icon: '/favicon.ico'
            });
        }
    }

    // Modal methods (placeholder implementations)
    openTimeOffModal() {
        alert('Time Off Request Modal - Coming Soon!');
    }

    openPaystubModal() {
        alert('Paystub Viewer - Coming Soon!');
    }

    openPerformanceModal() {
        alert('Performance Review - Coming Soon!');
    }

    openITSupportModal() {
        alert('IT Support Ticket - Coming Soon!');
    }

    openEmployeeHandbook() {
        alert('Employee Handbook - Coming Soon!');
    }

    openCompanyDirectory() {
        alert('Company Directory - Coming Soon!');
    }

    openCompanyCalendar() {
        alert('Company Calendar - Coming Soon!');
    }

    openBenefitsPortal() {
        alert('Benefits Portal - Coming Soon!');
    }

    openITKnowledgeBase() {
        alert('IT Knowledge Base - Coming Soon!');
    }

    openHRContact() {
        alert('HR Contact Form - Coming Soon!');
    }
}

// Initialize the portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.companyPortal = new CompanyPortal();
});
