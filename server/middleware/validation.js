import { body, param, query, validationResult } from 'express-validator';

// Validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Employee validation rules
export const validateEmployee = [
    body('employee_id')
        .trim()
        .notEmpty().withMessage('Employee ID is required')
        .isLength({ min: 2, max: 20 }).withMessage('Employee ID must be 2-20 characters'),

    body('full_name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('department')
        .trim()
        .notEmpty().withMessage('Department is required')
        .isLength({ min: 2, max: 50 }).withMessage('Department must be 2-50 characters'),

    handleValidationErrors
];

// Attendance validation rules
export const validateAttendance = [
    body('employee_id')
        .trim()
        .notEmpty().withMessage('Employee ID is required'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['Present', 'Absent']).withMessage('Status must be "Present" or "Absent"'),

    handleValidationErrors
];

// ID parameter validation
export const validateIdParam = [
    param('id')
        .trim()
        .notEmpty().withMessage('ID is required'),
    handleValidationErrors
];

// Date query validation (optional)
export const validateDateQuery = [
    query('date')
        .optional()
        .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),
    query('from')
        .optional()
        .isISO8601().withMessage('Invalid from date format'),
    query('to')
        .optional()
        .isISO8601().withMessage('Invalid to date format'),
    handleValidationErrors
];
