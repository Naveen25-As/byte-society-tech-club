/**
 * Contact API Routes
 *
 * POST /api/contacts  — save a contact form message
 * GET  /api/contacts  — list all messages (for testing/admin)
 */

const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully — we will get back to you soon',
      data: contact,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving message',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages',
    });
  }
});

module.exports = router;
