import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import employeesRouter from './routes/employees.js';
import attendanceRouter from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 5000;

// middleware setup
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'HRMS Lite API is running' });
});

// api routes
app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// start server after db is ready
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to init database:', err);
    process.exit(1);
});
