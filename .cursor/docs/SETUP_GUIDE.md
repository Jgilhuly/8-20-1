# Setup Guide - Employee Portal Backend

This guide will help you get the Employee Portal backend API up and running on your local machine.

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Usually comes with Node.js
- **Git**: For version control (optional)

## Installation Steps

### 1. Install Dependencies

First, install all the required Node.js packages:

```bash
npm install
```

This will install the following dependencies:
- `express`: Web framework for Node.js
- `cors`: Cross-Origin Resource Sharing middleware
- `helmet`: Security middleware
- `morgan`: HTTP request logger middleware
- `nodemon`: Development dependency for auto-restarting the server

### 2. Start the Server

#### Production Mode
```bash
npm start
```

#### Development Mode (Recommended for development)
```bash
npm run dev
```

The development mode uses `nodemon` which automatically restarts the server when you make changes to the code.

### 3. Verify the Server is Running

You should see output similar to this:

```
🚀 Employee Portal API server running on port 3000
📊 API endpoints available at http://localhost:3000/api
🌐 Frontend available at http://localhost:3000
```

## Accessing the Application

### Backend API
- **Base URL**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`
- **API Documentation**: See `API_DOCUMENTATION.md`

### Frontend
- **Main Dashboard**: `http://localhost:3000`
- **Employee Directory**: `http://localhost:3000/employee-directory.html`

## Project Structure

```
8-20-1/
├── server.js                 # Main Express server
├── package.json             # Node.js dependencies and scripts
├── index.html              # Main dashboard page
├── employee-directory.html  # Employee directory page
├── css/
│   ├── styles.css          # Main styles
│   ├── components.css      # Component styles
│   ├── responsive.css      # Responsive design
│   └── employee-directory.css # Employee directory styles
├── js/
│   ├── app.js              # Main application logic
│   ├── components.js       # UI components
│   ├── api.js              # API service layer
│   └── employee-directory.js # Employee directory component
└── .cursor/
    └── docs/
        ├── API_DOCUMENTATION.md # Complete API reference
        └── SETUP_GUIDE.md       # This file
```

## Configuration

### Port Configuration

The server runs on port 3000 by default. You can change this by:

1. Setting an environment variable:
   ```bash
   export PORT=4000
   npm start
   ```

2. Or modifying the `server.js` file:
   ```javascript
   const PORT = process.env.PORT || 4000;
   ```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```bash
# .env
PORT=3000
NODE_ENV=development
```

## Development Workflow

### 1. Make Changes
Edit any of the JavaScript files in the `js/` directory or the server code.

### 2. Auto-Restart (Development Mode)
When using `npm run dev`, the server automatically restarts when you save changes.

### 3. Manual Restart (Production Mode)
If using `npm start`, you need to manually stop (Ctrl+C) and restart the server.

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Get all employees
curl http://localhost:3000/api/employees

# Get employee statistics
curl http://localhost:3000/api/stats
```

### Using Browser

1. Open your browser and navigate to `http://localhost:3000`
2. Click on "Company Directory" in the quick links
3. Use the employee directory interface to test CRUD operations

### Using Postman/Insomnia

1. Import the API endpoints from the documentation
2. Set the base URL to `http://localhost:3000/api`
3. Test each endpoint with appropriate HTTP methods and data

## Troubleshooting

### Common Issues

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: 
- Find and stop the process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```
- Or use a different port:
  ```bash
  export PORT=4000 && npm start
  ```

#### Module Not Found
```
Error: Cannot find module 'express'
```

**Solution**: 
- Reinstall dependencies:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

#### CORS Issues
If you're getting CORS errors when testing from a different domain:

**Solution**: The server already includes CORS middleware, but you can customize it in `server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
```

### Debug Mode

Enable debug logging by setting the NODE_ENV:

```bash
export NODE_ENV=development
npm start
```

This will show more detailed error messages and stack traces.

## Production Deployment

### Environment Setup
```bash
export NODE_ENV=production
export PORT=3000
```

### Process Management
Consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "employee-portal"
pm2 startup
pm2 save
```

### Security Considerations
- Enable HTTPS
- Implement authentication and authorization
- Add rate limiting
- Use environment variables for sensitive data
- Regular security updates

## Next Steps

1. **Database Integration**: Replace in-memory storage with a real database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add user login and role-based access control
3. **File Uploads**: Implement profile picture uploads
4. **Email Integration**: Add email notifications for employee changes
5. **Audit Logging**: Track all changes to employee records
6. **API Versioning**: Implement versioned API endpoints
7. **Testing**: Add unit and integration tests
8. **CI/CD**: Set up automated testing and deployment

## Support

If you encounter any issues:

1. Check the console output for error messages
2. Verify all dependencies are installed correctly
3. Ensure the port isn't being used by another application
4. Check the API documentation for correct endpoint usage
5. Review the browser console for frontend errors

## Contributing

When making changes:

1. Follow the existing code style
2. Test your changes thoroughly
3. Update documentation if needed
4. Use conventional commit messages
5. Test both frontend and backend functionality
