const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDb = require('./config/db.config');
const cron = require('node-cron');
const authRoutes = require('./routers/auth.routes');
const CourseRoutes = require('./routers/Course.routes');
const miscellaneousRoutes = require('./routers/miscellaneous.routes');
const paymentRoutes = require('./routers/payment.routes');


dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173', 
    'https://coursifyvs.vercel.app' 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to LEARNING Management System API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', CourseRoutes);
app.use('/api', miscellaneousRoutes);
app.use('/api/payments', paymentRoutes);

require('./config/cronJob'); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token or not authorized'
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            status: 'error',
            message: 'File size limit exceeded'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
