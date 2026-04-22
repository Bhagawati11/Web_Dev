# OnlineAppointmentBookingApp

A server-rendered appointment booking app built with Node.js, Express, MongoDB, Mongoose, EJS, sessions, and method override.

## Features

- Browse service providers with specialty, experience, fee, location, and available slots
- Book new appointments through a simple form
- View all appointments in one place
- Open appointment details and update status
- Cancel or delete appointments
- Seeded sample providers for quick local testing
- Responsive blue/teal booking interface with EJS views and shared CSS

## Prerequisites

- Node.js
- npm
- MongoDB running locally

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file and update values if needed:
   ```bash
   copy .env.example .env
   ```

3. Make sure MongoDB is running locally on:
   ```text
   mongodb://127.0.0.1:27017/online-appointment-booking
   ```

4. Edit `.env` and set:
   - `PORT`
   - `MONGODB_URI`
   - `SESSION_SECRET`

## Run

Start the application:

```bash
npm run dev
```

or

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Notes

- The app uses server-rendered EJS templates.
- Method override is expected with the `_method` query parameter.
- If the database has no providers, sample provider data should be seeded automatically on startup/request flow.