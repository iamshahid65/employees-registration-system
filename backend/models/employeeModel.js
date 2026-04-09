const { pool } = require('../config/database');

class EmployeeModel {
    // Create employees table if not exists
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS employees (
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
            )
        `;
        await pool.execute(query);
    }

    // Get all employees with optional filtering
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM employees WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.department) {
            query += ' AND department = ?';
            params.push(filters.department);
        }

        if (filters.search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR designation LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    // Get employee by ID
    static async getById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    // Get employee by email
    static async getByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM employees WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    // Create new employee
    static async create(employeeData) {
        const {
            name, email, designation, address,
            phone, department, salary, joiningDate
        } = employeeData;

        const query = `
            INSERT INTO employees 
            (name, email, designation, address, phone, department, salary, joining_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            name, email, designation, address,
            phone || null, department || null, salary || null, joiningDate || null
        ]);

        return { id: result.insertId, ...employeeData };
    }

    // Update employee
    static async update(id, employeeData) {
        const fields = [];
        const values = [];

        Object.keys(employeeData).forEach(key => {
            if (employeeData[key] !== undefined) {
                // Convert camelCase to snake_case
                const dbField = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                fields.push(`${dbField} = ?`);
                values.push(employeeData[key]);
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;

        const [result] = await pool.execute(query, values);
        return result.affectedRows > 0;
    }

    // Delete employee
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM employees WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Get departments for filter
    static async getDepartments() {
        const [rows] = await pool.execute(
            'SELECT DISTINCT department FROM employees WHERE department IS NOT NULL'
        );
        return rows.map(row => row.department);
    }

    // Get employee statistics
    static async getStats() {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
                COUNT(DISTINCT department) as total_departments
            FROM employees
        `);
        return rows[0];
    }
}

module.exports = EmployeeModel;
