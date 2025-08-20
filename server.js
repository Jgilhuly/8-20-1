const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// In-memory employee database
let employees = [
    {
        id: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        role: 'Software Developer',
        hireDate: '2023-01-15',
        salary: 85000,
        manager: 'Jane Smith',
        phone: '+1-555-0101',
        location: 'San Francisco',
        status: 'Active'
    },
    {
        id: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        department: 'Engineering',
        role: 'Engineering Manager',
        hireDate: '2022-06-01',
        salary: 120000,
        manager: 'Bob Johnson',
        phone: '+1-555-0102',
        location: 'San Francisco',
        status: 'Active'
    },
    {
        id: 'EMP003',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@company.com',
        department: 'Engineering',
        role: 'VP of Engineering',
        hireDate: '2021-03-15',
        salary: 180000,
        manager: null,
        phone: '+1-555-0103',
        location: 'San Francisco',
        status: 'Active'
    },
    {
        id: 'EMP004',
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@company.com',
        department: 'HR',
        role: 'HR Manager',
        hireDate: '2022-09-01',
        salary: 95000,
        manager: 'Carol Davis',
        phone: '+1-555-0104',
        location: 'New York',
        status: 'Active'
    },
    {
        id: 'EMP005',
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol.davis@company.com',
        department: 'HR',
        role: 'VP of People',
        hireDate: '2021-01-01',
        salary: 150000,
        manager: null,
        phone: '+1-555-0105',
        location: 'New York',
        status: 'Active'
    }
];

// Helper function to generate unique ID
function generateEmployeeId() {
    const existingIds = employees.map(emp => parseInt(emp.id.replace('EMP', '')));
    const maxId = Math.max(...existingIds);
    return `EMP${String(maxId + 1).padStart(3, '0')}`;
}

// Helper function to find employee by ID
function findEmployeeById(id) {
    return employees.find(emp => emp.id === id);
}

// Routes

// GET /api/employees - Get all employees
app.get('/api/employees', (req, res) => {
    try {
        const { department, status, search } = req.query;
        let filteredEmployees = [...employees];

        // Filter by department
        if (department) {
            filteredEmployees = filteredEmployees.filter(emp => 
                emp.department.toLowerCase() === department.toLowerCase()
            );
        }

        // Filter by status
        if (status) {
            filteredEmployees = filteredEmployees.filter(emp => 
                emp.status.toLowerCase() === status.toLowerCase()
            );
        }

        // Search by name, email, or role
        if (search) {
            const searchLower = search.toLowerCase();
            filteredEmployees = filteredEmployees.filter(emp => 
                emp.firstName.toLowerCase().includes(searchLower) ||
                emp.lastName.toLowerCase().includes(searchLower) ||
                emp.email.toLowerCase().includes(searchLower) ||
                emp.role.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            success: true,
            count: filteredEmployees.length,
            data: filteredEmployees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving employees',
            error: error.message
        });
    }
});

// GET /api/employees/:id - Get employee by ID
app.get('/api/employees/:id', (req, res) => {
    try {
        const employee = findEmployeeById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving employee',
            error: error.message
        });
    }
});

// POST /api/employees - Create new employee
app.post('/api/employees', (req, res) => {
    try {
        const { firstName, lastName, email, department, role, hireDate, salary, manager, phone, location } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !department || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: firstName, lastName, email, department, role'
            });
        }

        // Check if email already exists
        if (employees.find(emp => emp.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }

        const newEmployee = {
            id: generateEmployeeId(),
            firstName,
            lastName,
            email,
            department,
            role,
            hireDate: hireDate || new Date().toISOString().split('T')[0],
            salary: salary || 0,
            manager: manager || null,
            phone: phone || '',
            location: location || '',
            status: 'Active'
        };

        employees.push(newEmployee);

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: newEmployee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
});

// PUT /api/employees/:id - Update employee
app.put('/api/employees/:id', (req, res) => {
    try {
        const employee = findEmployeeById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const { firstName, lastName, email, department, role, hireDate, salary, manager, phone, location, status } = req.body;

        // Check if email is being changed and if it conflicts with another employee
        if (email && email !== employee.email) {
            if (employees.find(emp => emp.email === email && emp.id !== req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
            }
        }

        // Update employee fields
        if (firstName) employee.firstName = firstName;
        if (lastName) employee.lastName = lastName;
        if (email) employee.email = email;
        if (department) employee.department = department;
        if (role) employee.role = role;
        if (hireDate) employee.hireDate = hireDate;
        if (salary !== undefined) employee.salary = salary;
        if (manager !== undefined) employee.manager = manager;
        if (phone !== undefined) employee.phone = phone;
        if (location !== undefined) employee.location = location;
        if (status) employee.status = status;

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
});

// DELETE /api/employees/:id - Delete employee
app.delete('/api/employees/:id', (req, res) => {
    try {
        const employeeIndex = employees.findIndex(emp => emp.id === req.params.id);
        
        if (employeeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const deletedEmployee = employees.splice(employeeIndex, 1)[0];

        res.json({
            success: true,
            message: 'Employee deleted successfully',
            data: deletedEmployee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
});

// GET /api/departments - Get all departments
app.get('/api/departments', (req, res) => {
    try {
        const departments = [...new Set(employees.map(emp => emp.department))];
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving departments',
            error: error.message
        });
    }
});

// GET /api/stats - Get employee statistics
app.get('/api/stats', (req, res) => {
    try {
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
        const departments = [...new Set(employees.map(emp => emp.department))];
        
        const departmentStats = departments.map(dept => {
            const deptEmployees = employees.filter(emp => emp.department === dept);
            return {
                department: dept,
                count: deptEmployees.length,
                activeCount: deptEmployees.filter(emp => emp.status === 'Active').length
            };
        });

        const avgSalary = employees.length > 0 
            ? Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length)
            : 0;

        res.json({
            success: true,
            data: {
                totalEmployees,
                activeEmployees,
                inactiveEmployees: totalEmployees - activeEmployees,
                departments: departmentStats,
                averageSalary: avgSalary
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Employee Portal API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Employee Portal API server running on port ${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});
