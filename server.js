
//latest

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
// import helmet from 'helmet'; // ← COMMENT THIS OUT
import helmet from 'helmet'; // 
import rateLimit from 'express-rate-limit';

connectDB();

const app = express();

// 1. Cookie Parser FIRST
app.use(cookieParser());

// 2. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// 4. HELMET - COMPLETELY DISABLED FOR NOW
app.use(helmet()); //

// 5. Rate Limiter
const loginLimiter = rateLimit({
  windowMs:  15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: {
    success: false,
    message: "Too many login attempts. Try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth/login', loginLimiter);

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});



