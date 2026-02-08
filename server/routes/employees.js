import { Router } from 'express';
import { queryAll, queryOne, runQuery } from '../db/database.js';
import { validateEmployee, validateIdParam } from '../middleware/validation.js';

const router = Router();

router.get('/', (req, res) => {
    try {
        const employees = queryAll(`
            SELECT id, employee_id, full_name, email, department, created_at
            FROM employees ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: employees,
            count: employees.length
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch employees' });
    }
});

router.get('/:id', validateIdParam, (req, res) => {
    try {
        const emp = queryOne(
            'SELECT id, employee_id, full_name, email, department, created_at FROM employees WHERE employee_id = ?',
            [req.params.id]
        );

        if (!emp) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, data: emp });
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch employee' });
    }
});

router.post('/', validateEmployee, (req, res) => {
    const { employee_id, full_name, email, department } = req.body;

    try {
        // check for duplicates
        const existingById = queryOne('SELECT id FROM employees WHERE employee_id = ?', [employee_id]);
        if (existingById) {
            return res.status(409).json({
                success: false,
                message: 'Employee ID already exists',
                errors: [{ field: 'employee_id', message: 'This Employee ID is already taken' }]
            });
        }

        const existingByEmail = queryOne('SELECT id FROM employees WHERE email = ?', [email]);
        if (existingByEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
                errors: [{ field: 'email', message: 'This email is already registered' }]
            });
        }

        const result = runQuery(
            'INSERT INTO employees (employee_id, full_name, email, department) VALUES (?, ?, ?, ?)',
            [employee_id, full_name, email, department]
        );

        const newEmp = queryOne('SELECT * FROM employees WHERE id = ?', [result.lastId]);

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: newEmp
        });
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ success: false, message: 'Failed to create employee' });
    }
});

router.delete('/:id', validateIdParam, (req, res) => {
    try {
        const emp = queryOne('SELECT * FROM employees WHERE employee_id = ?', [req.params.id]);

        if (!emp) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // cascade delete - remove attendance records first
        runQuery('DELETE FROM attendance WHERE employee_id = ?', [req.params.id]);
        runQuery('DELETE FROM employees WHERE employee_id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Employee deleted successfully',
            data: emp
        });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ success: false, message: 'Failed to delete employee' });
    }
});

export default router;
