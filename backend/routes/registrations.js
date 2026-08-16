/**
 * Registration API Routes
 *
 * POST /api/registrations  — save a new event registration
 * GET  /api/registrations  — list all registrations (for testing/admin)
 */

const express = require('express');
const Registration = require('../models/Registration');

const router = express.Router();

/**
 * POST /api/registrations
 *
 * Request body (JSON):
 * {
 *   "name": "Jane Doe",
 *   "email": "jane@university.edu",
 *   "eventName": "Campus Hack 2026"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, eventName } = req.body;

    // Create document — Mongoose validates against the schema
    const registration = await Registration.create({ name, email, eventName });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: registration,
    });
  } catch (error) {
    // Duplicate email + event combination
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Mongoose validation errors (missing fields, invalid email, etc.)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving registration',
    });
  }
});

/**
 * GET /api/registrations
 *
 * Returns all registrations, newest first.
 * Useful for testing that POST actually saved data.
 */
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations',
    });
  }
});

module.exports = router;
