const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

const router = express.Router();

// Submit feedback
router.post('/', [
  auth,
  body('subject').notEmpty().withMessage('Subject is required'),
  body('category').isIn(['course', 'faculty', 'facility', 'other']).withMessage('Invalid category'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('message').notEmpty().withMessage('Message is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subject, category, rating, message } = req.body;

  try {
    const feedback = new Feedback({
      student: req.user.id,
      subject,
      category,
      rating,
      message,
    });

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all feedbacks (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const feedbacks = await Feedback.find().populate('student', 'name email studentId');
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's feedbacks
router.get('/my', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user.id });
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update feedback status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { status, adminResponse } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ msg: 'Feedback not found' });
    }

    feedback.status = status || feedback.status;
    feedback.adminResponse = adminResponse || feedback.adminResponse;

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;