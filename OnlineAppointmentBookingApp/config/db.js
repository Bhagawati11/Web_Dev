const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online-appointment-booking';

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };