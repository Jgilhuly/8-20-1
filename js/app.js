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

    // Modal methods
    openTimeOffModal() {
        const modal = document.getElementById('timeOffModal');
        const form = document.getElementById('timeOffForm');
        
        // Reset form
        form.reset();
        this.clearFormErrors();
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').min = today;
        document.getElementById('endDate').min = today;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Setup event listeners if not already setup
        if (!this.timeOffModalSetup) {
            this.setupTimeOffModal();
        }
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('startDate').focus();
        }, 300);
    }
    
    setupTimeOffModal() {
        const modal = document.getElementById('timeOffModal');
        const form = document.getElementById('timeOffForm');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = document.getElementById('cancelTimeOff');
        const submitBtn = document.getElementById('submitTimeOff');
        
        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.clearFormErrors();
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Date validation
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        startDateInput.addEventListener('change', () => {
            const startDate = startDateInput.value;
            if (startDate) {
                endDateInput.min = startDate;
                // Clear end date if it's before start date
                if (endDateInput.value && endDateInput.value < startDate) {
                    endDateInput.value = '';
                }
            }
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTimeOffSubmission();
        });
        
        this.timeOffModalSetup = true;
    }
    
    handleTimeOffSubmission() {
        const form = document.getElementById('timeOffForm');
        const submitBtn = document.getElementById('submitTimeOff');
        
        // Validate form
        if (!this.validateTimeOffForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const timeOffData = {
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            timeOffType: formData.get('timeOffType'),
            reason: formData.get('reason'),
            halfDay: formData.get('halfDay'),
            submittedAt: new Date().toISOString(),
            employeeId: this.currentUser?.id || 'EMP001',
            status: 'pending'
        };
        
        // Show loading state
        this.setSubmitLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            this.submitTimeOffRequest(timeOffData);
        }, 1500);
    }
    
    validateTimeOffForm() {
        const form = document.getElementById('timeOffForm');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        const timeOffType = document.getElementById('timeOffType');
        
        let isValid = true;
        
        // Clear previous errors
        this.clearFormErrors();
        
        // Validate start date
        if (!startDate.value) {
            this.showFieldError('startDate', 'Please select a start date');
            isValid = false;
        }
        
        // Validate end date
        if (!endDate.value) {
            this.showFieldError('endDate', 'Please select an end date');
            isValid = false;
        } else if (startDate.value && endDate.value < startDate.value) {
            this.showFieldError('endDate', 'End date must be after start date');
            isValid = false;
        }
        
        // Validate time off type
        if (!timeOffType.value) {
            this.showFieldError('timeOffType', 'Please select a leave type');
            isValid = false;
        }
        
        // Validate dates are not in the past
        const today = new Date().toISOString().split('T')[0];
        if (startDate.value && startDate.value < today) {
            this.showFieldError('startDate', 'Start date cannot be in the past');
            isValid = false;
        }
        
        return isValid;
    }
    
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    clearFormErrors() {
        const formGroups = document.querySelectorAll('.form-group.error');
        formGroups.forEach(group => {
            group.classList.remove('error');
        });
    }
    
    setSubmitLoading(isLoading) {
        const submitBtn = document.getElementById('submitTimeOff');
        const submitText = submitBtn.querySelector('.submit-text');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitText.textContent = 'Submitting...';
            loadingSpinner.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            submitText.textContent = 'Submit Request';
            loadingSpinner.style.display = 'none';
        }
    }
    
    submitTimeOffRequest(timeOffData) {
        // Simulate successful submission
        this.setSubmitLoading(false);
        
        // Close modal
        const modal = document.getElementById('timeOffModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Show success notification
        this.showTimeOffSuccessNotification(timeOffData);
        
        // In a real application, you would send this data to your API
        console.log('Time off request submitted:', timeOffData);
    }
    
    showTimeOffSuccessNotification(timeOffData) {
        // Calculate number of days
        const startDate = new Date(timeOffData.startDate);
        const endDate = new Date(timeOffData.endDate);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        
        const message = `Your time off request for ${daysDiff} day${daysDiff > 1 ? 's' : ''} has been submitted successfully and is pending approval.`;
        
        // Show browser notification if available
        if (Notification.permission === 'granted') {
            new Notification('Time Off Request Submitted', {
                body: message,
                icon: '/favicon.ico'
            });
        }
        
        // You could also show an in-app toast notification here
        alert(`✅ ${message}`);
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
