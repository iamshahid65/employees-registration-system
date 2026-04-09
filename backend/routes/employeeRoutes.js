const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee, validateEmployeeId, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Get all employees (with optional filters)
router.get('/', EmployeeController.getAllEmployees);

// Get statistics
router.get('/stats', EmployeeController.getStats);

// Get departments
router.get('/departments', EmployeeController.getDepartments);

// Get single employee
router.get('/:id', validateEmployeeId, handleValidationErrors, EmployeeController.getEmployeeById);

// Create employee
router.post('/', validateEmployee, handleValidationErrors, EmployeeController.createEmployee);

// Update employee
router.put('/:id', validateEmployeeId, validateEmployee, handleValidationErrors, EmployeeController.updateEmployee);

// Partial update (PATCH)
router.patch('/:id', validateEmployeeId, handleValidationErrors, EmployeeController.updateEmployee);

// Delete employee
router.delete('/:id', validateEmployeeId, handleValidationErrors, EmployeeController.deleteEmployee);

module.exports = router;
