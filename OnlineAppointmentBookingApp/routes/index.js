const express = require('express');
const Provider = require('../models/Provider');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const featuredProviders = await Provider.find().limit(3).lean();
    const [providerCount, appointmentCount, pendingCount, specialties] = await Promise.all([
      Provider.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Provider.distinct('specialty'),
    ]);

    const stats = {
      providerCount,
      appointmentCount,
      specialtyCount: specialties.length,
      pendingCount,
    };

    res.render('index', {
      title: 'Online Appointment Booking',
      featuredProviders,
      stats,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
