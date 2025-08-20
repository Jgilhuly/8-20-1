// Theme Management Class (duplicated for standalone use)
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

// Employee Directory Component
class EmployeeDirectory {
    constructor() {
        this.employees = [];
        this.departments = [];
        this.currentFilters = {};
        this.themeManager = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupThemeManager();
        this.render();
    }

    setupThemeManager() {
        // Check if ThemeManager exists (from app.js)
        if (window.companyPortal && window.companyPortal.themeManager) {
            this.themeManager = window.companyPortal.themeManager;
        } else {
            // Create standalone theme manager for this page
            this.themeManager = new ThemeManager();
        }
        
        // Listen for theme changes
        window.addEventListener('themechange', (e) => {
            this.handleThemeChange(e.detail.theme);
        });
    }

    handleThemeChange(theme) {
        // Re-render components that might need theme-specific updates
        this.render();
    }

    async loadData() {
        try {
            // Load employees and departments
            const [employeesResponse, departmentsResponse] = await Promise.all([
                window.employeeAPI.getEmployees(),
                window.employeeAPI.getDepartments()
            ]);

            this.employees = employeesResponse.data;
            this.departments = departmentsResponse.data;
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showNotification('Failed to load employee data', 'error');
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('employee-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.filterEmployees();
            }, 300));
        }

        // Department filter
        const deptFilter = document.getElementById('department-filter');
        if (deptFilter) {
            deptFilter.addEventListener('change', (e) => {
                this.currentFilters.department = e.target.value || null;
                this.filterEmployees();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value || null;
                this.filterEmployees();
            });
        }

        // Add employee button
        const addBtn = document.getElementById('add-employee-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showEmployeeModal());
        }
    }

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
    }

    filterEmployees() {
        let filtered = [...this.employees];

        if (this.currentFilters.department) {
            filtered = filtered.filter(emp => 
                emp.department === this.currentFilters.department
            );
        }

        if (this.currentFilters.status) {
            filtered = filtered.filter(emp => 
                emp.status === this.currentFilters.status
            );
        }

        if (this.currentFilters.search) {
            const search = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(emp => 
                emp.firstName.toLowerCase().includes(search) ||
                emp.lastName.toLowerCase().includes(search) ||
                emp.email.toLowerCase().includes(search) ||
                emp.role.toLowerCase().includes(search)
            );
        }

        this.renderEmployeeList(filtered);
    }

    render() {
        this.renderFilters();
        this.renderEmployeeList(this.employees);
        this.renderStats();
    }

    renderFilters() {
        const filtersContainer = document.getElementById('employee-filters');
        if (!filtersContainer) return;

        filtersContainer.innerHTML = `
            <div class="filters-row">
                <div class="filter-group">
                    <label for="employee-search">Search:</label>
                    <input type="text" id="employee-search" placeholder="Search employees...">
                </div>
                <div class="filter-group">
                    <label for="department-filter">Department:</label>
                    <select id="department-filter">
                        <option value="">All Departments</option>
                        ${this.departments.map(dept => 
                            `<option value="${dept}">${dept}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="filter-group">
                    <label for="status-filter">Status:</label>
                    <select id="status-filter">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <button id="add-employee-btn" class="btn btn-primary">+ Add Employee</button>
            </div>
        `;
    }

    renderEmployeeList(employees) {
        const listContainer = document.getElementById('employee-list');
        if (!listContainer) return;

        if (employees.length === 0) {
            listContainer.innerHTML = `
                <div class="no-results">
                    <p>No employees found matching your criteria.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div class="employee-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.map(emp => this.renderEmployeeRow(emp)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Re-attach event listeners for action buttons
        this.attachRowEventListeners();
    }

    renderEmployeeRow(employee) {
        return `
            <tr data-employee-id="${employee.id}">
                <td>
                    <div class="employee-name">
                        <strong>${employee.firstName} ${employee.lastName}</strong>
                        <small>${employee.id}</small>
                    </div>
                </td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.role}</td>
                <td>
                    <span class="status-badge status-${employee.status.toLowerCase()}">
                        ${employee.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary view-employee" data-id="${employee.id}">
                            👁️ View
                        </button>
                        <button class="btn btn-sm btn-primary edit-employee" data-id="${employee.id}">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-employee" data-id="${employee.id}">
                            🗑️ Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    attachRowEventListeners() {
        // View employee
        document.querySelectorAll('.view-employee').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.viewEmployee(id);
            });
        });

        // Edit employee
        document.querySelectorAll('.edit-employee').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.editEmployee(id);
            });
        });

        // Delete employee
        document.querySelectorAll('.delete-employee').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.deleteEmployee(id);
            });
        });
    }

    async renderStats() {
        try {
            const statsResponse = await window.employeeAPI.getStats();
            const stats = statsResponse.data;
            
            const statsContainer = document.getElementById('employee-stats');
            if (!statsContainer) return;

            statsContainer.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalEmployees}</div>
                        <div class="stat-label">Total Employees</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.activeEmployees}</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.departments.length}</div>
                        <div class="stat-label">Departments</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">$${stats.averageSalary.toLocaleString()}</div>
                        <div class="stat-label">Avg Salary</div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    async viewEmployee(id) {
        try {
            const response = await window.employeeAPI.getEmployee(id);
            const employee = response.data;
            this.showEmployeeModal(employee, 'view');
        } catch (error) {
            this.showNotification('Failed to load employee details', 'error');
        }
    }

    async editEmployee(id) {
        try {
            const response = await window.employeeAPI.getEmployee(id);
            const employee = response.data;
            this.showEmployeeModal(employee, 'edit');
        } catch (error) {
            this.showNotification('Failed to load employee details', 'error');
        }
    }

    async deleteEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) return;

        const confirmed = confirm(
            `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
        );

        if (confirmed) {
            try {
                await window.employeeAPI.deleteEmployee(id);
                this.employees = this.employees.filter(emp => emp.id !== id);
                this.render();
                this.showNotification('Employee deleted successfully', 'success');
            } catch (error) {
                this.showNotification('Failed to delete employee', 'error');
            }
        }
    }

    showEmployeeModal(employee = null, mode = 'add') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = this.renderEmployeeModal(employee, mode);
        
        document.body.appendChild(modal);
        
        // Setup modal event listeners
        this.setupModalEventListeners(modal, employee, mode);
    }

    renderEmployeeModal(employee, mode) {
        const isView = mode === 'view';
        const isEdit = mode === 'edit';
        const isAdd = mode === 'add';
        
        return `
            <div class="modal">
                <div class="modal-header">
                    <h2>${isAdd ? 'Add New Employee' : isEdit ? 'Edit Employee' : 'Employee Details'}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="employee-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name *</label>
                                <input type="text" id="firstName" name="firstName" value="${employee?.firstName || ''}" ${isView ? 'readonly' : ''} required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" value="${employee?.lastName || ''}" ${isView ? 'readonly' : ''} required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" value="${employee?.email || ''}" ${isView ? 'readonly' : ''} required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" value="${employee?.phone || ''}" ${isView ? 'readonly' : ''}>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="department">Department *</label>
                                <select id="department" name="department" ${isView ? 'disabled' : ''} required>
                                    <option value="">Select Department</option>
                                    ${this.departments.map(dept => 
                                        `<option value="${dept}" ${employee?.department === dept ? 'selected' : ''}>${dept}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="role">Role *</label>
                                <input type="text" id="role" name="role" value="${employee?.role || ''}" ${isView ? 'readonly' : ''} required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="hireDate">Hire Date</label>
                                <input type="date" id="hireDate" name="hireDate" value="${employee?.hireDate || ''}" ${isView ? 'readonly' : ''}>
                            </div>
                            <div class="form-group">
                                <label for="salary">Salary</label>
                                <input type="number" id="salary" name="salary" value="${employee?.salary || ''}" ${isView ? 'readonly' : ''} min="0">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="manager">Manager</label>
                                <input type="text" id="manager" name="manager" value="${employee?.manager || ''}" ${isView ? 'readonly' : ''}>
                            </div>
                            <div class="form-group">
                                <label for="location">Location</label>
                                <input type="text" id="location" name="location" value="${employee?.location || ''}" ${isView ? 'readonly' : ''}>
                            </div>
                        </div>
                        
                        ${!isView ? `
                            <div class="form-group">
                                <label for="status">Status</label>
                                <select id="status" name="status" ${isView ? 'disabled' : ''}>
                                    <option value="Active" ${employee?.status === 'Active' ? 'selected' : ''}>Active</option>
                                    <option value="Inactive" ${employee?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                                </select>
                            </div>
                        ` : ''}
                        
                        <div class="modal-actions">
                            ${!isView ? `
                                <button type="submit" class="btn btn-primary">
                                    ${isAdd ? 'Add Employee' : 'Update Employee'}
                                </button>
                            ` : ''}
                            <button type="button" class="btn btn-secondary modal-close">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    setupModalEventListeners(modal, employee, mode) {
        const closeBtn = modal.querySelector('.modal-close');
        const form = modal.querySelector('#employee-form');
        
        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Form submission
        if (mode !== 'view') {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleEmployeeSubmit(e, employee, mode);
                modal.remove();
            });
        }
    }

    async handleEmployeeSubmit(event, employee, mode) {
        const formData = new FormData(event.target);
        const employeeData = Object.fromEntries(formData.entries());
        
        // Convert salary to number
        if (employeeData.salary) {
            employeeData.salary = parseInt(employeeData.salary);
        }
        
        try {
            if (mode === 'add') {
                const response = await window.employeeAPI.createEmployee(employeeData);
                this.employees.push(response.data);
                this.showNotification('Employee added successfully', 'success');
            } else if (mode === 'edit') {
                const response = await window.employeeAPI.updateEmployee(employee.id, employeeData);
                const index = this.employees.findIndex(emp => emp.id === employee.id);
                if (index !== -1) {
                    this.employees[index] = response.data;
                }
                this.showNotification('Employee updated successfully', 'success');
            }
            
            this.render();
        } catch (error) {
            this.showNotification(`Failed to ${mode} employee: ${error.message}`, 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize employee directory when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('employee-directory')) {
        window.employeeDirectory = new EmployeeDirectory();
    }
});
