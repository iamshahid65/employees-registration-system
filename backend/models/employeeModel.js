const { getPool } = require('../config/database');
const sql = require('mssql');

class EmployeeModel {
    // Create employees table if not exists
    static async createTable() {
        try {
            const pool = getPool();
            const query = `
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'employees')
                BEGIN
                    CREATE TABLE employees (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        [name] VARCHAR(100) NOT NULL,
                        email VARCHAR(150) NOT NULL UNIQUE,
                        designation VARCHAR(100) NOT NULL,
                        [address] VARCHAR(255) NOT NULL,
                        phone VARCHAR(20),
                        department VARCHAR(100),
                        salary DECIMAL(10, 2),
                        joining_date DATE,
                        [status] VARCHAR(20) DEFAULT 'active' CHECK ([status] IN ('active', 'inactive')),
                        created_at DATETIME2 DEFAULT GETDATE(),
                        updated_at DATETIME2 DEFAULT GETDATE()
                    )
                END
            `;
            const request = pool.request();
            await request.query(query);
            console.log('✓ Employees table ready');
        } catch (error) {
            console.error('Error creating table:', error);
            throw error;
        }
    }

    // Get all employees with optional filtering
    static async getAll(filters = {}) {
        try {
            const pool = getPool();
            const request = pool.request();
            let query = 'SELECT * FROM employees WHERE 1=1';

            if (filters.status) {
                query += ' AND [status] = @status';
                request.input('status', sql.VarChar, filters.status);
            }

            if (filters.department) {
                query += ' AND department = @department';
                request.input('department', sql.VarChar, filters.department);
            }

            if (filters.search) {
                query += ' AND ([name] LIKE @search OR email LIKE @search OR designation LIKE @search)';
                const searchTerm = `%${filters.search}%`;
                request.input('search', sql.VarChar, searchTerm);
            }

            query += ' ORDER BY created_at DESC';

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    // Get employee by ID
    static async getById(id) {
        try {
            const pool = getPool();
            const request = pool.request();
            request.input('id', sql.Int, id);
            
            const result = await request.query('SELECT * FROM employees WHERE id = @id');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error fetching employee by ID:', error);
            throw error;
        }
    }

    // Get employee by email
    static async getByEmail(email) {
        try {
            const pool = getPool();
            const request = pool.request();
            request.input('email', sql.VarChar, email);
            
            const result = await request.query('SELECT * FROM employees WHERE email = @email');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error fetching employee by email:', error);
            throw error;
        }
    }

    // Create new employee
    static async create(employeeData) {
        try {
            const pool = getPool();
            const {
                name, email, designation, address,
                phone, department, salary, joiningDate
            } = employeeData;

            const request = pool.request();
            request.input('name', sql.VarChar, name);
            request.input('email', sql.VarChar, email);
            request.input('designation', sql.VarChar, designation);
            request.input('address', sql.VarChar, address);
            request.input('phone', sql.VarChar, phone || null);
            request.input('department', sql.VarChar, department || null);
            request.input('salary', sql.Decimal(10, 2), salary || null);
            request.input('joiningDate', sql.Date, joiningDate || null);

            const query = `
                INSERT INTO employees 
                ([name], email, designation, [address], phone, department, salary, joining_date, created_at, updated_at)
                VALUES (@name, @email, @designation, @address, @phone, @department, @salary, @joiningDate, GETDATE(), GETDATE());
                SELECT CAST(SCOPE_IDENTITY() as int) as id;
            `;

            const result = await request.query(query);
            const insertedId = result.recordset[0].id;

            return { id: insertedId, ...employeeData };
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    // Update employee
    static async update(id, employeeData) {
        try {
            const pool = getPool();
            const request = pool.request();
            request.input('id', sql.Int, id);

            const allowedFields = ['name', 'email', 'designation', 'address', 'phone', 'department', 'salary', 'joiningDate', 'status'];
            const updates = [];

            for (const key of allowedFields) {
                if (employeeData[key] !== undefined) {
                    const dbField = key === 'joiningDate' ? 'joining_date' : key;
                    const sqlType = this.getSqlType(key);
                    
                    request.input(key, sqlType, employeeData[key]);
                    updates.push(`[${dbField}] = @${key}`);
                }
            }

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            updates.push('updated_at = GETDATE()');
            const query = `UPDATE employees SET ${updates.join(', ')} WHERE id = @id`;

            const result = await request.query(query);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    // Delete employee
    static async delete(id) {
        try {
            const pool = getPool();
            const request = pool.request();
            request.input('id', sql.Int, id);
            
            const result = await request.query('DELETE FROM employees WHERE id = @id');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    // Get departments for filter
    static async getDepartments() {
        try {
            const pool = getPool();
            const request = pool.request();
            const result = await request.query(
                'SELECT DISTINCT department FROM employees WHERE department IS NOT NULL ORDER BY department'
            );
            return result.recordset.map(row => row.department);
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    // Get employee statistics
    static async getStats() {
        try {
            const pool = getPool();
            const request = pool.request();
            const result = await request.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN [status] = 'active' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN [status] = 'inactive' THEN 1 ELSE 0 END) as inactive,
                    COUNT(DISTINCT department) as total_departments
                FROM employees
            `);
            return result.recordset[0];
        } catch (error) {
            console.error('Error fetching employee statistics:', error);
            throw error;
        }
    }

    // Get SQL type helper
    static getSqlType(fieldName) {
        const typeMap = {
            'name': sql.VarChar(100),
            'email': sql.VarChar(150),
            'designation': sql.VarChar(100),
            'address': sql.VarChar(255),
            'phone': sql.VarChar(20),
            'department': sql.VarChar(100),
            'salary': sql.Decimal(10, 2),
            'joiningDate': sql.Date,
            'status': sql.VarChar(20)
        };
        return typeMap[fieldName] || sql.VarChar;
    }
}

module.exports = EmployeeModel;
