const express = require('express');
const Appointment = require('../models/Appointment');
const Provider = require('../models/Provider');

const router = express.Router();

router.get('/new', async (req, res, next) => {
  try {
    const providers = await Provider.find().sort({ name: 1 }).lean();

    res.render('appointments/new', {
      title: 'Book Appointment',
      providers,
      selectedProvider: req.query.provider || '',
      formData: {
        customerName: '',
        email: '',
        phone: '',
        provider: req.query.provider || '',
        appointmentDate: '',
        slot: '',
        reason: '',
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { customerName, email, phone, provider, appointmentDate, slot, reason } = req.body;

    await Appointment.create({
      customerName,
      email,
      phone,
      provider,
      appointmentDate,
      slot,
      reason,
    });

    res.redirect('/appointments');
  } catch (error) {
    try {
      const providers = await Provider.find().sort({ name: 1 }).lean();

      res.status(400).render('appointments/new', {
        title: 'Book Appointment',
        providers,
        selectedProvider: req.body.provider || '',
        formData: {
          customerName: req.body.customerName || '',
          email: req.body.email || '',
          phone: req.body.phone || '',
          provider: req.body.provider || '',
          appointmentDate: req.body.appointmentDate || '',
          slot: req.body.slot || '',
          reason: req.body.reason || '',
        },
        error: 'Unable to create appointment. Please check your details and try again.',
      });
    } catch (renderError) {
      next(renderError);
    }
  }
});

router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('provider')
      .sort({ createdAt: -1 })
      .lean();

    res.render('appointments/index', {
      title: 'Appointments',
      appointments,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('provider').lean();

    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.render('appointments/show', {
      title: 'Appointment Details',
      appointment,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    const nextStatus = req.body.status;

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).redirect('/appointments');
    }

    await Appointment.findByIdAndUpdate(req.params.id, { status: nextStatus });
    res.redirect(`/appointments/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.redirect('/appointments');
  } catch (error) {
    next(error);
  }
});

module.exports = router;