require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const methodOverride = require('method-override');

const { connectDB } = require('./config/db');
const Provider = require('./models/Provider');
const indexRoutes = require('./routes/index');
const appointmentRoutes = require('./routes/appointments');
const { ensureSeedData } = require('./middleware/loadData');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().catch((error) => {
  console.error('Database connection failed:', error.message);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'careconnect-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};

if (process.env.MONGODB_URI) {
  sessionConfig.store = new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
  });
}

app.use(session(sessionConfig));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use(ensureSeedData);

app.use('/', indexRoutes);
app.use('/appointments', appointmentRoutes);

app.get('/providers', async (req, res, next) => {
  try {
    const providers = await Provider.find().sort({ name: 1 }).lean();

    res.render('providers/index', {
      title: 'Providers',
      providers,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).render('appointments/index', {
    title: 'Page Not Found',
    appointments: [],
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).send('Something went wrong while processing your request.');
});

app.listen(PORT, () => {
  console.log(`CareConnect server running on http://localhost:${PORT}`);
});
