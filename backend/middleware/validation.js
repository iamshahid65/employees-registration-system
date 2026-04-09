const { body, param, validationResult } = require('express-validator');

const validateEmployee = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('designation')
        .trim()
        .notEmpty().withMessage('Designation is required')
        .isLength({ min: 2, max: 100 }).withMessage('Designation must be between 2 and 100 characters'),
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5, max: 255 }).withMessage('Address must be between 5 and 255 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[\d\s-()]{10,20}$/).withMessage('Please provide a valid phone number'),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department must not exceed 100 characters'),
    body('salary')
        .optional()
        .isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
    body('joiningDate')
        .optional()
        .isISO8601().withMessage('Please provide a valid date')
        .toDate()
];

const validateEmployeeId = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid employee ID')
];

const handleValidationErrors = (req, res, next) => {
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

module.exports = {
    validateEmployee,
    validateEmployeeId,
    handleValidationErrors
};
