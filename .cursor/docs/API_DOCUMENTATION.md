# Employee Directory API Documentation

## Overview

The Employee Directory API provides a complete CRUD (Create, Read, Update, Delete) interface for managing company employee information. Built with Node.js and Express, it includes features like filtering, searching, and statistics.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In a production environment, you should implement proper authentication and authorization.

## Endpoints

### 1. Get All Employees

**GET** `/employees`

Retrieves a list of all employees with optional filtering and search capabilities.

#### Query Parameters

- `department` (optional): Filter by department name
- `status` (optional): Filter by employee status (Active/Inactive)
- `search` (optional): Search by name, email, or role

#### Example Request

```bash
GET /api/employees?department=Engineering&status=Active&search=john
```

#### Example Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "department": "Engineering",
      "role": "Software Developer",
      "hireDate": "2023-01-15",
      "salary": 85000,
      "manager": "Jane Smith",
      "phone": "+1-555-0101",
      "location": "San Francisco",
      "status": "Active"
    }
  ]
}
```

### 2. Get Employee by ID

**GET** `/employees/:id`

Retrieves a specific employee by their unique ID.

#### Path Parameters

- `id`: Employee ID (e.g., EMP001)

#### Example Request

```bash
GET /api/employees/EMP001
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "role": "Software Developer",
    "hireDate": "2023-01-15",
    "salary": 85000,
    "manager": "Jane Smith",
    "phone": "+1-555-0101",
    "location": "San Francisco",
    "status": "Active"
  }
}
```

### 3. Create Employee

**POST** `/employees`

Creates a new employee record.

#### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "department": "HR",
  "role": "HR Specialist",
  "hireDate": "2024-01-15",
  "salary": 75000,
  "manager": "Alice Williams",
  "phone": "+1-555-0106",
  "location": "New York"
}
```

#### Required Fields

- `firstName`: Employee's first name
- `lastName`: Employee's last name
- `email`: Employee's email address (must be unique)
- `department`: Employee's department
- `role`: Employee's job role

#### Optional Fields

- `hireDate`: Employee's hire date (defaults to current date)
- `salary`: Employee's salary (defaults to 0)
- `manager`: Employee's manager name
- `phone`: Employee's phone number
- `location`: Employee's work location

#### Example Response

```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "EMP006",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@company.com",
    "department": "HR",
    "role": "HR Specialist",
    "hireDate": "2024-01-15",
    "salary": 75000,
    "manager": "Alice Williams",
    "phone": "+1-555-0106",
    "location": "New York",
    "status": "Active"
  }
}
```

### 4. Update Employee

**PUT** `/employees/:id`

Updates an existing employee record.

#### Path Parameters

- `id`: Employee ID to update

#### Request Body

Same structure as Create Employee, but all fields are optional. Only provided fields will be updated.

#### Example Request

```bash
PUT /api/employees/EMP001
```

```json
{
  "salary": 90000,
  "role": "Senior Software Developer"
}
```

#### Example Response

```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "role": "Senior Software Developer",
    "hireDate": "2023-01-15",
    "salary": 90000,
    "manager": "Jane Smith",
    "phone": "+1-555-0101",
    "location": "San Francisco",
    "status": "Active"
  }
}
```

### 5. Delete Employee

**DELETE** `/employees/:id`

Deletes an employee record.

#### Path Parameters

- `id`: Employee ID to delete

#### Example Request

```bash
DELETE /api/employees/EMP001
```

#### Example Response

```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": {
    "id": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "role": "Senior Software Developer",
    "hireDate": "2023-01-15",
    "salary": 90000,
    "manager": "Jane Smith",
    "phone": "+1-555-0101",
    "location": "San Francisco",
    "status": "Active"
  }
}
```

### 6. Get Departments

**GET** `/departments`

Retrieves a list of all departments in the company.

#### Example Response

```json
{
  "success": true,
  "data": ["Engineering", "HR", "Sales", "Marketing"]
}
```

### 7. Get Statistics

**GET** `/stats`

Retrieves comprehensive employee statistics.

#### Example Response

```json
{
  "success": true,
  "data": {
    "totalEmployees": 5,
    "activeEmployees": 5,
    "inactiveEmployees": 0,
    "departments": [
      {
        "department": "Engineering",
        "count": 3,
        "activeCount": 3
      },
      {
        "department": "HR",
        "count": 2,
        "activeCount": 2
      }
    ],
    "averageSalary": 108000
  }
}
```

### 8. Health Check

**GET** `/health`

Checks the API server status.

#### Example Response

```json
{
  "success": true,
  "message": "Employee Portal API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

## Data Models

### Employee Object

```json
{
  "id": "string",           // Unique employee ID (auto-generated)
  "firstName": "string",    // Employee's first name
  "lastName": "string",     // Employee's last name
  "email": "string",        // Employee's email (unique)
  "department": "string",   // Employee's department
  "role": "string",         // Employee's job role
  "hireDate": "string",     // Employee's hire date (YYYY-MM-DD)
  "salary": "number",       // Employee's salary
  "manager": "string|null", // Employee's manager name
  "phone": "string",        // Employee's phone number
  "location": "string",     // Employee's work location
  "status": "string"        // Employee status (Active/Inactive)
}
```

## Error Handling

All API endpoints return consistent error responses:

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Example Error Response

```json
{
  "success": false,
  "message": "Employee with this email already exists"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

The API includes CORS support for cross-origin requests. Configure as needed for your environment.

## Security Considerations

- Input validation is implemented for all endpoints
- Email uniqueness is enforced
- Consider implementing authentication and authorization
- Sanitize user inputs to prevent injection attacks
- Use HTTPS in production

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. For development with auto-restart:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

## Testing the API

You can test the API using tools like:
- Postman
- cURL
- Insomnia
- Browser developer tools

### Example cURL Commands

```bash
# Get all employees
curl http://localhost:3000/api/employees

# Create a new employee
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","department":"Engineering","role":"Developer"}'

# Get employee by ID
curl http://localhost:3000/api/employees/EMP001

# Update employee
curl -X PUT http://localhost:3000/api/employees/EMP001 \
  -H "Content-Type: application/json" \
  -d '{"salary":95000}'

# Delete employee
curl -X DELETE http://localhost:3000/api/employees/EMP001
```
