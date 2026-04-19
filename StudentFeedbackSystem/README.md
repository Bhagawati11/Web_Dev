# Student Feedback Review System

A full-stack web application for managing student feedback with MongoDB backend, Express.js API, and React.js frontend.

## Features

- User authentication (students and admins)
- Students can submit feedback with ratings and categories
- Admins can review and respond to feedback
- Dashboard for viewing personal feedback (students) or all feedback (admins)
- JWT-based authentication
- Responsive UI

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, React Router
- **Authentication:** JWT, bcrypt
- **Validation:** express-validator

## Project Structure

```
StudentFeedbackSystem/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── feedback.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── FeedbackForm.js
    │   │   ├── AdminDashboard.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── index.js
    │   ├── App.css
    │   └── index.css
    ├── public/
    │   └── index.html
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd StudentFeedbackSystem/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/studentfeedback
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. Start MongoDB service (if running locally)

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd StudentFeedbackSystem/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

## Usage

1. Register as a student or admin
2. Login with your credentials
3. Students can submit feedback and view their own feedback
4. Admins can view all feedback, change status, and respond to feedback

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Feedback
- `POST /api/feedback` - Submit feedback (authenticated)
- `GET /api/feedback/my` - Get user's feedback (authenticated)
- `GET /api/feedback` - Get all feedback (admin only)
- `PUT /api/feedback/:id` - Update feedback status/response (admin only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.