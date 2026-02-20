
//latest

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
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
const envOrigins = [
  process.env.CLIENT_URL,
  process.env.APP_URL,
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : []),
]
  .filter(Boolean)
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  ...envOrigins,
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // allow non-browser clients (curl/postman)
  if (allowedOrigins.has(origin)) return true;
  if (origin.startsWith('http://localhost:')) return true;
  if (origin.startsWith('http://127.0.0.1:')) return true;
  return /^https:\/\/[a-z0-9-]+\.ngrok-free\.(app|dev)$/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// 4. HELMET - COMPLETELY DISABLED FOR NOW
app.use(helmet()); //

// 5. Rate Limiter
const loginLimiter = rateLimit({
  windowMs:  15 * 60 * 1000, // 15 minutes
  max: 100, // 5 attempts per IP
  message: {
    success: false,
    message: "Too many login attempts. Try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});
// app.use('/api/auth/login', loginLimiter);

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});



