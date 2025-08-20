// Component-specific JavaScript functionality

// Utility functions
const Utils = {
    // Format date to relative time
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    },

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to read from localStorage:', e);
                return defaultValue;
            }
        }
    }
};

// Announcements component
class AnnouncementsComponent {
    constructor() {
        this.announcements = [];
        this.init();
    }

    init() {
        this.loadAnnouncements();
        this.setupRefresh();
    }

    loadAnnouncements() {
        // Simulate loading announcements from API
        this.announcements = [
            {
                id: 1,
                title: 'New Office Policy Update',
                content: 'Updated hybrid work policy effective next month. All employees are required to be in office 3 days per week.',
                postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                priority: 'high'
            },
            {
                id: 2,
                title: 'Quarterly All-Hands Meeting',
                content: 'Join us this Friday at 2 PM for our quarterly company update. We\'ll discuss Q4 goals and achievements.',
                postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                priority: 'medium'
            },
            {
                id: 3,
                title: 'New Employee Benefits',
                content: 'Enhanced health insurance coverage and new wellness programs available starting next month.',
                postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                priority: 'low'
            }
        ];

        this.renderAnnouncements();
    }

    renderAnnouncements() {
        const container = document.querySelector('.announcements');
        if (!container) return;

        const announcementsList = container.querySelector('.announcement-item').parentNode;
        if (!announcementsList) return;

        // Clear existing announcements (keep the first one as template)
        const template = announcementsList.querySelector('.announcement-item');
        announcementsList.innerHTML = '';
        announcementsList.appendChild(template);

        // Add announcements
        this.announcements.forEach(announcement => {
            const announcementElement = this.createAnnouncementElement(announcement);
            announcementsList.appendChild(announcementElement);
        });
    }

    createAnnouncementElement(announcement) {
        const element = document.createElement('div');
        element.className = 'announcement-item';
        element.dataset.id = announcement.id;
        
        if (announcement.priority === 'high') {
            element.classList.add('priority-high');
        }

        element.innerHTML = `
            <h4>${announcement.title}</h4>
            <p>${announcement.content}</p>
            <div class="announcement-date">Posted: ${Utils.formatRelativeTime(announcement.postedAt)}</div>
        `;

        return element;
    }

    setupRefresh() {
        // Refresh announcements every 5 minutes
        setInterval(() => {
            this.loadAnnouncements();
        }, 5 * 60 * 1000);
    }
}

// Employee Stats component
class EmployeeStatsComponent {
    constructor() {
        this.stats = {};
        this.init();
    }

    init() {
        this.loadStats();
        this.setupAutoUpdate();
    }

    loadStats() {
        // Simulate loading stats from API
        this.stats = {
            totalEmployees: 247,
            newThisMonth: 12,
            satisfaction: 89,
            openPositions: 15
        };

        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const statElements = document.querySelectorAll('.stat-number');
        statElements.forEach(element => {
            const label = element.nextElementSibling.textContent.toLowerCase();
            let value = 0;

            switch(true) {
                case label.includes('total'):
                    value = this.stats.totalEmployees;
                    break;
                case label.includes('new'):
                    value = this.stats.newThisMonth;
                    break;
                case label.includes('satisfaction'):
                    value = this.stats.satisfaction + '%';
                    break;
                case label.includes('open'):
                    value = this.stats.openPositions;
                    break;
            }

            // Animate the number
            this.animateNumber(element, value);
        });
    }

    animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const target = parseInt(targetValue) || 0;
        const increment = (target - currentValue) / 20;
        let current = currentValue;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 50);
    }

    setupAutoUpdate() {
        // Update stats every 10 minutes
        setInterval(() => {
            this.loadStats();
        }, 10 * 60 * 1000);
    }
}

// Quick Actions component
class QuickActionsComponent {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupKeyboardNavigation();
    }

    setupHoverEffects() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupKeyboardNavigation() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', card.querySelector('h3').textContent);
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    window.announcementsComponent = new AnnouncementsComponent();
    window.employeeStatsComponent = new EmployeeStatsComponent();
    window.quickActionsComponent = new QuickActionsComponent();
    
    // Add global utility functions
    window.Utils = Utils;
});
