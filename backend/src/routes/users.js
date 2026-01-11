const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const { userValidationRules, validate } = require('../middleware/validator');

// GET all users
router.get('/', (req, res) => {
  try {
    const { search, role, status, department } = req.query;
    
    let users = UserModel.getAll();
    
    if (search) {
      users = UserModel.search(search);
    }
    
    if (role || status || department) {
      users = users.filter(u => {
        if (role && u.role !== role) return false;
        if (status && u.status !== status) return false;
        if (department && u.department !== department) return false;
        return true;
      });
    }
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET user by ID
router.get('/:id', (req, res) => {
  try {
    const user = UserModel.getById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// CREATE new user
router.post('/', userValidationRules(), validate, (req, res) => {
  try {
    const user = UserModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// UPDATE user
router.put('/:id', userValidationRules(), validate, (req, res) => {
  try {
    const user = UserModel.update(req.params.id, req.body);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// DELETE user
router.delete('/:id', (req, res) => {
  try {
    const deleted = UserModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;