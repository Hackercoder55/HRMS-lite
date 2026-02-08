import { Router } from 'express';
import { queryAll, queryOne, runQuery } from '../db/database.js';
import { validateAttendance, validateIdParam, validateDateQuery } from '../middleware/validation.js';

const router = Router();

// get attendance records - can filter by date, employee etc
router.get('/', validateDateQuery, (req, res) => {
    try {
        const { date, from, to, employee_id } = req.query;

        let sql = `
            SELECT a.id, a.employee_id, a.date, a.status, a.marked_at,
                   e.full_name, e.department
            FROM attendance a
            JOIN employees e ON a.employee_id = e.employee_id
            WHERE 1=1
        `;
        const params = [];

        // add filters if provided
        if (date) {
            sql += ' AND a.date = ?';
            params.push(date);
        }
        if (from) {
            sql += ' AND a.date >= ?';
            params.push(from);
        }
        if (to) {
            sql += ' AND a.date <= ?';
            params.push(to);
        }
        if (employee_id) {
            sql += ' AND a.employee_id = ?';
            params.push(employee_id);
        }

        sql += ' ORDER BY a.date DESC, a.marked_at DESC';
        const records = queryAll(sql, params);

        res.json({ success: true, data: records, count: records.length });
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
    }
});

// stats for dashboard
router.get('/stats', (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const totalEmployees = queryOne('SELECT COUNT(*) as count FROM employees')?.count || 0;
        const presentToday = queryOne(
            "SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = 'Present'",
            [today]
        )?.count || 0;
        const absentToday = queryOne(
            "SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = 'Absent'",
            [today]
        )?.count || 0;
        const notMarkedToday = totalEmployees - presentToday - absentToday;

        // per employee breakdown
        const employeeStats = queryAll(`
            SELECT e.employee_id, e.full_name, e.department,
                   SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_days,
                   SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
                   COUNT(a.id) as total_marked
            FROM employees e
            LEFT JOIN attendance a ON e.employee_id = a.employee_id
            GROUP BY e.employee_id
            ORDER BY e.full_name
        `);

        // last week data
        const recentDays = queryAll(`
            SELECT date,
                   SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
                   SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent
            FROM attendance
            WHERE date >= date('now', '-7 days')
            GROUP BY date
            ORDER BY date DESC
        `);

        res.json({
            success: true,
            data: {
                summary: { totalEmployees, presentToday, absentToday, notMarkedToday },
                employeeStats,
                recentDays
            }
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
});

// attendance for a specific employee
router.get('/employee/:id', validateIdParam, validateDateQuery, (req, res) => {
    try {
        const { from, to } = req.query;

        const emp = queryOne('SELECT * FROM employees WHERE employee_id = ?', [req.params.id]);
        if (!emp) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        let sql = 'SELECT id, employee_id, date, status, marked_at FROM attendance WHERE employee_id = ?';
        const params = [req.params.id];

        if (from) {
            sql += ' AND date >= ?';
            params.push(from);
        }
        if (to) {
            sql += ' AND date <= ?';
            params.push(to);
        }
        sql += ' ORDER BY date DESC';

        const records = queryAll(sql, params);
        const presentCount = records.filter(r => r.status === 'Present').length;
        const absentCount = records.filter(r => r.status === 'Absent').length;

        res.json({
            success: true,
            data: {
                employee: emp,
                records,
                summary: { totalRecords: records.length, presentDays: presentCount, absentDays: absentCount }
            }
        });
    } catch (err) {
        console.error('Error fetching employee attendance:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
    }
});

// mark or update attendance
router.post('/', validateAttendance, (req, res) => {
    const { employee_id, date, status } = req.body;

    try {
        const emp = queryOne('SELECT * FROM employees WHERE employee_id = ?', [employee_id]);
        if (!emp) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
                errors: [{ field: 'employee_id', message: 'No employee found with this ID' }]
            });
        }

        // check if already marked
        const existing = queryOne(
            'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
            [employee_id, date]
        );

        if (existing) {
            // just update it
            runQuery(
                "UPDATE attendance SET status = ?, marked_at = datetime('now') WHERE employee_id = ? AND date = ?",
                [status, employee_id, date]
            );

            const updated = queryOne(`
                SELECT a.*, e.full_name, e.department
                FROM attendance a JOIN employees e ON a.employee_id = e.employee_id
                WHERE a.employee_id = ? AND a.date = ?
            `, [employee_id, date]);

            return res.json({ success: true, message: 'Attendance updated', data: updated });
        }

        // new record
        const result = runQuery(
            'INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)',
            [employee_id, date, status]
        );

        const newRecord = queryOne(`
            SELECT a.*, e.full_name, e.department
            FROM attendance a JOIN employees e ON a.employee_id = e.employee_id
            WHERE a.id = ?
        `, [result.lastId]);

        res.status(201).json({ success: true, message: 'Attendance marked', data: newRecord });
    } catch (err) {
        console.error('Error marking attendance:', err);
        res.status(500).json({ success: false, message: 'Failed to mark attendance' });
    }
});

export default router;
