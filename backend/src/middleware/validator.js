const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email'),
    body('phone')
      .trim()
      .notEmpty().withMessage('Phone is required')
      .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone format'),
    body('role')
      .optional()
      .isIn(['Admin', 'Manager', 'User']).withMessage('Invalid role'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive']).withMessage('Invalid status'),
    body('department')
      .trim()
      .notEmpty().withMessage('Department is required'),
    body('location')
      .trim()
      .notEmpty().withMessage('Location is required')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = { userValidationRules, validate };