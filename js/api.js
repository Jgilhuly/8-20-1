// API Service for Employee Portal
class EmployeeAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
    }

    // Helper method for making HTTP requests
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Get all employees with optional filtering
    async getEmployees(filters = {}) {
        const queryParams = new URLSearchParams();
        
        if (filters.department) queryParams.append('department', filters.department);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.search) queryParams.append('search', filters.search);

        const queryString = queryParams.toString();
        const endpoint = `/employees${queryString ? `?${queryString}` : ''}`;
        
        return this.makeRequest(endpoint);
    }

    // Get employee by ID
    async getEmployee(id) {
        return this.makeRequest(`/employees/${id}`);
    }

    // Create new employee
    async createEmployee(employeeData) {
        return this.makeRequest('/employees', {
            method: 'POST',
            body: JSON.stringify(employeeData)
        });
    }

    // Update employee
    async updateEmployee(id, employeeData) {
        return this.makeRequest(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(employeeData)
        });
    }

    // Delete employee
    async deleteEmployee(id) {
        return this.makeRequest(`/employees/${id}`, {
            method: 'DELETE'
        });
    }

    // Get all departments
    async getDepartments() {
        return this.makeRequest('/departments');
    }

    // Get employee statistics
    async getStats() {
        return this.makeRequest('/stats');
    }

    // Health check
    async healthCheck() {
        return this.makeRequest('/health');
    }
}

// Create global instance
window.employeeAPI = new EmployeeAPI();
