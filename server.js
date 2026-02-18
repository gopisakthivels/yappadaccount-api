// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.js';

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Routes
// app.use('/api/auth', authRoutes);

// // Root route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 Auth API Server is running',
//     status: 'OK'
//   });
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     message: 'Server Error', 
//     error: err.message 
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });









// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser'; // ← ADD THIS
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.js';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

// dotenv.config();
// connectDB();

// const app = express();

// // ← UPDATE CORS CONFIGURATION
// app.use(cors({
//   // origin: 'http://localhost:3000',
//    origin:process.env.CLIENT_URL,
//   credentials: true, // Allow cookies to be sent
// }));

// app.use(helmet());

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
// });

// app.use('/api/auth/login', loginLimiter);

// app.use(express.json());
// app.use(cookieParser()); // ← ADD THIS
// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//   res.set('Pragma', 'no-cache');
//   res.set('Expires', '0');
//   // res.setHeader('Surrogate-Control', 'no-store');
//   next();
// });


// // ... your routes (api/auth/login, api/auth/me, etc.) ...
// app.use('/api/auth', authRoutes);
// // app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







//latest

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.js';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

// // Load environment variables FIRST
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // MIDDLEWARE ORDER IS CRITICAL!

// // 1. Cookie Parser - MUST be before routes
// app.use(cookieParser());

// // 2. Body Parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 3. CORS - with credentials
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// // 4. Helmet - with relaxed settings for development
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" },
//   contentSecurityPolicy: false, // Disable CSP for development
// }));

// // 5. Rate Limiter
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: 'Too many login attempts, please try again later.',
// });
// app.use('/api/auth/login', loginLimiter);

// // 6. Cache Control
// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//   res.set('Pragma', 'no-cache');
//   res.set('Expires', '0');
//   next();
// });

// // 7. Debug middleware - logs all requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// // 8. Routes - LAST!
// app.use('/api/auth', authRoutes);

// // Test route
// app.get('/test', (req, res) => {
//   res.json({ message: 'Server is running!' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`✅ Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
// });






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



