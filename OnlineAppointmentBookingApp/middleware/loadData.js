const Provider = require('../models/Provider');

const defaultProviders = [
  {
    name: 'Dr. Anjali Sharma',
    specialty: 'General Physician',
    experience: 12,
    location: 'Downtown Clinic',
    fee: 800,
    availableSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM'],
    description:
      'Experienced general physician focused on preventive care, routine consultations, and patient wellness.',
    image: '/images/dr-anjali-sharma.svg',
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Dermatologist',
    experience: 9,
    location: 'City Skin Center',
    fee: 1200,
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    description:
      'Specialist in skin, hair, and nail conditions offering modern treatment plans and personalized care.',
    image: '/images/dr-rajesh-kumar.svg',
  },
  {
    name: 'Dr. Priya Nair',
    specialty: 'Pediatrician',
    experience: 11,
    location: 'Sunrise Children Clinic',
    fee: 900,
    availableSlots: ['09:30 AM', '11:00 AM', '01:00 PM', '05:00 PM'],
    description:
      'Compassionate pediatrician dedicated to child health, developmental guidance, and routine checkups.',
    image: '/images/dr-priya-nair.svg',
  },
  {
    name: 'Dr. Arjun Mehta',
    specialty: 'Orthopedic Consultant',
    experience: 15,
    location: 'Wellness Specialty Hospital',
    fee: 1500,
    availableSlots: ['08:30 AM', '10:00 AM', '01:30 PM', '04:00 PM'],
    description:
      'Orthopedic expert helping patients manage joint pain, injuries, mobility issues, and rehabilitation needs.',
    image: '/images/dr-arjun-mehta.svg',
  },
];

const ensureSeedData = async (req, res, next) => {
  try {
    const providerCount = await Provider.countDocuments();

    if (providerCount === 0) {
      await Provider.insertMany(defaultProviders);
      console.log('Seeded default providers.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { ensureSeedData };