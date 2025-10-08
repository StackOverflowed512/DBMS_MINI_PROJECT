# Vaccine Tracker System

A comprehensive full-stack web application for managing vaccine distribution, tracking vaccination sessions, and maintaining records of persons, vaccines, and locations.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT tokens
- **Person Management**: Add, view, and manage individual records
- **Vaccine Management**: Track different vaccine types and inventory
- **Location Management**: Manage vaccination centers and facilities
- **Session Management**: Schedule and track vaccination sessions
- **Dashboard**: Overview of system statistics and recent activities
- **Responsive Design**: Mobile-friendly interface using Bootstrap

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Bootstrap 5** for styling
- **Axios** for API calls
- **React Hook Form** for form handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd DBMS_Project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/vaccine_tracker
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
DBMS_Project/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── contexts/    # React contexts
    │   └── assets/      # Static assets
    └── public/          # Public files
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Persons
- `GET /api/persons` - Get all persons
- `POST /api/persons` - Create new person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Vaccines
- `GET /api/vaccines` - Get all vaccines
- `POST /api/vaccines` - Create new vaccine
- `PUT /api/vaccines/:id` - Update vaccine
- `DELETE /api/vaccines/:id` - Delete vaccine

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request



## 📞 Support

For support, email omkarmutyalwar5@gmail.com or create an issue in the repository.
