# Employee Registration System

A full-stack Employee Registration System built with React, Tailwind CSS, Node.js, Express, and MySQL.

## Features

- ✅ Add new employees with comprehensive details
- ✅ Update existing employee information
- ✅ Delete employees with confirmation
- ✅ Search and filter employees
- ✅ View employee statistics
- ✅ Responsive design
- ✅ Form validation
- ✅ Toast notifications
- ✅ Modern UI with animations

## Tech Stack

### Frontend
- React 18 (Functional Components + Hooks)
- Tailwind CSS 3
- Axios for HTTP requests
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js
- Express.js
- MySQL2 with connection pooling
- Express Validator for input validation
- CORS enabled
- Dotenv for environment variables

## Project Structure

```
employee-registration/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection with pooling
│   ├── controllers/
│   │   └── employeeController.js # Business logic
│   ├── models/
│   │   └── employeeModel.js     # Database operations
│   ├── routes/
│   │   └── employeeRoutes.js    # API routes
│   ├── middleware/
│   │   └── validation.js        # Input validation
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env.example             # Environment variables template
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeForm.jsx # Add/Edit form
    │   │   ├── EmployeeList.jsx # List with filters
    │   │   ├── EmployeeCard.jsx # Individual card
    │   │   ├── Modal.jsx        # Reusable modal
    │   │   └── Toast.jsx        # Notification component
    │   ├── pages/
    │   │   └── Dashboard.jsx    # Main dashboard
    │   ├── hooks/
    │   │   └── useEmployees.js  # Custom hooks with AbortController
    │   ├── services/
    │   │   └── api.js           # API service layer
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd employee-registration/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create database in MySQL:
```sql
CREATE DATABASE employee_db;
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_db
PORT=5000
FRONTEND_URL=http://localhost:3000
```

6. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd employee-registration/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Start the development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | Get all employees (with filters) |
| GET | /api/employees/stats | Get statistics |
| GET | /api/employees/departments | Get unique departments |
| GET | /api/employees/:id | Get single employee |
| POST | /api/employees | Create new employee |
| PUT | /api/employees/:id | Update employee |
| PATCH | /api/employees/:id | Partial update |
| DELETE | /api/employees/:id | Delete employee |

## Database Schema

```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    designation VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    salary DECIMAL(10, 2),
    joining_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | employee_db |
| PORT | Server port | 5000 |
| FRONTEND_URL | Allowed CORS origin | http://localhost:3000 |
| NODE_ENV | Environment | development |

### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## Features in Detail

### Employee Management
- **Add Employee**: Fill form with name, email, designation, address (required), plus optional phone, department, salary, joining date
- **Edit Employee**: Click edit button on any employee card
- **Delete Employee**: Click delete button with confirmation dialog
- **View Details**: All employee information displayed in beautiful cards

### Search & Filter
- **Search**: Real-time search by name, email, or designation
- **Department Filter**: Filter by specific department
- **Status Filter**: Filter by Active/Inactive status
- **Clear Filters**: One-click reset

### Statistics Dashboard
- Total Employees count
- Active Employees count
- Inactive Employees count
- Total Departments count

### UI/UX Features
- Responsive grid layout
- Loading states with spinners
- Empty states with helpful messages
- Toast notifications for actions
- Modal dialogs for forms
- Hover effects and animations
- Keyboard accessible (ESC to close modals)

## Best Practices Implemented

### Backend
- ✅ Connection pooling for database
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ RESTful API design
- ✅ Environment variables for configuration
- ✅ Async/await with proper error handling
- ✅ SQL injection prevention with parameterized queries

### Frontend
- ✅ React 18 StrictMode
- ✅ Functional components with hooks
- ✅ Custom hooks for data fetching
- ✅ AbortController for request cancellation
- ✅ useCallback for function memoization
- ✅ useMemo for expensive calculations
- ✅ React.memo for component optimization
- ✅ Proper cleanup in useEffect
- ✅ Loading and error states

## Troubleshooting

### Database Connection Issues
1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database `employee_db` exists
4. Check MySQL port (default 3306)

### CORS Issues
1. Verify `FRONTEND_URL` in backend `.env`
2. Check that frontend is running on correct port

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: `PORT=3001 npm start`

## License

MIT License - feel free to use this project for personal or commercial purposes.
