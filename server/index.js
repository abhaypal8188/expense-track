import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import categoryRoutes from './routes/categories.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow requests from the frontend (configured via env var)
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  process.env.CLIENT_URL,  // Your Vercel frontend URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman/curl) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Expense Tracker API is running' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker')
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

export default app;
