const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecoDispose';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Models
const Center = require('./models/Center');
const PickupRequest = require('./models/PickupRequest');

// Data + helpers
const disposalGuide = {
  laptops: 'Donate working devices, wipe data, dismantle batteries before handing to certified recycler.',
  mobiles: 'Remove SIM/memory card, clear personal data, and recycle with authorized centers.',
  batteries: 'Do not incinerate, keep dry and take to battery recycling kiosks.',
  monitors: 'Avoid breaking glass; deliver to e-waste handling centers properly.',
  accessories: 'Collect cables and peripherals in sealed bags and recycle responsibly.',
};

const awarenessList = [
  'Don’t dispose of e-waste in regular trash.',
  'Data security is key: wipe or destroy storage media before disposal.',
  'Use certified recycling centers to prevent toxic leaks.',
  'Schedule pickups to reduce carbon footprint and transportation inefficiency.',
];

// Seed routine (only initial, idempotent)
const seedCenters = async () => {
  const count = await Center.countDocuments();
  if (count === 0) {
    await Center.insertMany([
      { name: 'GreenReCycle Center', address: '123 Eco Park Rd', city: 'Mumbai', state: 'MH', pincode: '400001', lat: 19.075983, lng: 72.877655 },
      { name: 'SmartE-Waste Hub', address: '27 Robotics Street', city: 'Bengaluru', state: 'KA', pincode: '560001', lat: 12.971599, lng: 77.594566 },
      { name: 'Sustainable Tech Disposal', address: '56 Clean Circuit Lane', city: 'Delhi', state: 'DL', pincode: '110001', lat: 28.613939, lng: 77.209021 },
    ]);
    console.log('Seeded centers');
  }
};

seedCenters().catch((err) => console.error('Seeding failed', err));

// API routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.get('/api/centers', async (req, res) => {
  const { city, state } = req.query;
  let filter = {};
  if (city) filter.city = new RegExp(city, 'i');
  if (state) filter.state = new RegExp(state, 'i');
  const centers = await Center.find(filter).sort({ name: 1 });
  res.json(centers);
});

app.get('/api/guide', (req, res) => {
  const type = (req.query.type || '').toLowerCase();
  const advice = disposalGuide[type];
  if (!advice) {
    return res.status(400).json({ error: 'Unknown e-waste type. Use laptops|mobiles|batteries|monitors|accessories' });
  }
  res.json({ type, advice });
});

app.get('/api/awareness', (req, res) => {
  res.json({ tips: awarenessList });
});

app.get('/api/pickups', async (req, res) => {
  const pickups = await PickupRequest.find().sort({ scheduledDate: 1 });
  res.json(pickups);
});

app.post('/api/pickups', async (req, res) => {
  const { name, phone, location, type, quantity, scheduledDate } = req.body;
  if (!name || !phone || !location || !type || !scheduledDate) {
    return res.status(400).json({ error: 'name, phone, location, type, scheduledDate are required' });
  }

  const pickup = await PickupRequest.create({ name, phone, location, type, quantity: quantity || 1, scheduledDate, status: 'Scheduled' });
  res.status(201).json(pickup);
});

app.get('/api/pickups/:id', async (req, res) => {
  const pickup = await PickupRequest.findById(req.params.id);
  if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
  res.json(pickup);
});

app.put('/api/pickups/:id', async (req, res) => {
  const pickup = await PickupRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
  res.json(pickup);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EcoDispose server running on http://localhost:${PORT}`));
