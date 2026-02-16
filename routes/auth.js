// import express from 'express';
// import { signup, login, getMe } from '../controllers/authcontroller.js';
// import { protect } from '../middleware/auth.js';

// const router = express.Router();

// router.post('/signup', signup);
// router.post('/login', login);
// router.get('/me', protect, getMe);

// export default router;






//latest

// import express from 'express';
// import { signup, login, getMe, logout } from '../controllers/authcontroller.js'; // ← ADD logout
// import { protect } from '../middleware/auth.js';

// const router = express.Router();
// router.post('/test', (req, res) => {
//   res.json({ message: "Test route working" });
// });


// router.post('/signup', signup);
// router.post('/login', login);
// router.get('/me', protect, getMe);
// router.post('/logout', logout); // ← ADD THIS

// export default router;



import express from 'express';
import { signup, login, getMe, logout, forgotPassword, resetPassword } from '../controllers/authcontroller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/test', (req, res) => res.json({ message: "Test route working" }));

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
