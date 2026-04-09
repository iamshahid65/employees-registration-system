const EmployeeModel = require('../models/employeeModel');

class EmployeeController {
    // Get all employees
    static async getAllEmployees(req, res) {
        try {
            const filters = {
                status: req.query.status,
                department: req.query.department,
                search: req.query.search
            };

            const employees = await EmployeeModel.getAll(filters);
            res.status(200).json({
                success: true,
                count: employees.length,
                data: employees
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch employees',
                error: error.message
            });
        }
    }

    // Get single employee
    static async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            const employee = await EmployeeModel.getById(id);

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            res.status(200).json({
                success: true,
                data: employee
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch employee',
                error: error.message
            });
        }
    }

    // Create employee
    static async createEmployee(req, res) {
        try {
            // Check if email already exists
            const existingEmployee = await EmployeeModel.getByEmail(req.body.email);
            if (existingEmployee) {
                return res.status(409).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
            }

            const employee = await EmployeeModel.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: employee
            });
        } catch (error) {
            console.error('Error creating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create employee',
                error: error.message
            });
        }
    }

    // Update employee
    static async updateEmployee(req, res) {
        try {
            const { id } = req.params;

            // Check if employee exists
            const existingEmployee = await EmployeeModel.getById(id);
            if (!existingEmployee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            // Check email uniqueness if being updated
            if (req.body.email && req.body.email !== existingEmployee.email) {
                const emailExists = await EmployeeModel.getByEmail(req.body.email);
                if (emailExists) {
                    return res.status(409).json({
                        success: false,
                        message: 'Email already in use by another employee'
                    });
                }
            }

            const updated = await EmployeeModel.update(id, req.body);
            if (updated) {
                const updatedEmployee = await EmployeeModel.getById(id);
                res.status(200).json({
                    success: true,
                    message: 'Employee updated successfully',
                    data: updatedEmployee
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'No changes made'
                });
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update employee',
                error: error.message
            });
        }
    }

    // Delete employee
    static async deleteEmployee(req, res) {
        try {
            const { id } = req.params;

            // Check if employee exists
            const existingEmployee = await EmployeeModel.getById(id);
            if (!existingEmployee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            const deleted = await EmployeeModel.delete(id);
            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: 'Employee deleted successfully'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Failed to delete employee'
                });
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete employee',
                error: error.message
            });
        }
    }

    // Get departments
    static async getDepartments(req, res) {
        try {
            const departments = await EmployeeModel.getDepartments();
            res.status(200).json({
                success: true,
                data: departments
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch departments',
                error: error.message
            });
        }
    }

    // Get statistics
    static async getStats(req, res) {
        try {
            const stats = await EmployeeModel.getStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch statistics',
                error: error.message
            });
        }
    }
}

module.exports = EmployeeController;
