/*
 * HRMS Lite Backend Server
 * Developed by: Santosh Kumar
 * College: KR Mangalam University
 */

import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import employeesRouter from './routes/employees.js';
import attendanceRouter from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 5000;

// allow all origins for now
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.json({ success: true, message: 'HRMS Lite API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API healthy' });
});

app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to init database:', err);
    process.exit(1);
});
