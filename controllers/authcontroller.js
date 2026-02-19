// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '7d',
//   });
// };

// export const signup = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Please provide all fields' });
//     }

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: 'Username already exists!' });
//     }

//     const user = await User.create({ username, password });

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         username: user.username,
//       },
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username }).select('+password');
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json({
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         username: user.username,
//       },
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getMe = async (req, res) => {
//   res.json({ user: req.user });
// };








//latest

// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

// // Generate JWT Token
// const generateToken = (id) => {
//   const token= jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '7d',
//   });
//   console.log('JWT_SECRET:', process.env.JWT_SECRET);
//   console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
//   console.log('Generated token:', token);
//   return token;
// };

// // ← HELPER FUNCTION TO SET COOKIE
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = generateToken(user._id);

//   const cookieOptions = {
//     expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
//     httpOnly: true,
//     secure: false, // FALSE for localhost
//     sameSite: 'lax',
//     path: '/',
//   };

//   console.log('============ COOKIE DEBUG ============');
//   console.log('Generated token:', token);
//   console.log('Cookie options:', cookieOptions);
//   console.log('Setting cookie now...');
  
//   // Set the cookie
//   res.cookie('token', token, cookieOptions);
  
//   console.log('Cookie set! Sending response...');
//   console.log('======================================');

//   // Send response
//   res.status(statusCode).json({
//     success: true,
//     message: statusCode === 201 ? 'User created successfully' : 'Login successful',
//     user: {
//       id: user._id,
//       username: user.username,
//     },
//     token, // Include token in response temporarily
//   });
// };





// // const sendTokenResponse = (user, statusCode, res) => {
// //   const token = generateToken(user._id);

// //   // const options = {
// //   //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
// //   //   httpOnly: true, // Prevent XSS attacks
// //   //   secure: process.env.NODE_ENV === 'production', // HTTPS in production
// //   //   sameSite: 'lax', // CSRF protection
// //   // };
// // const options = {
// //   expires: new Date(Date.now() + 5* 60 * 1000), // 30 seconds
// //   httpOnly: true,
// //   secure: process.env.NODE_ENV === 'production',
// //   sameSite: 'lax',
// // };
// //  console.log('Generated token:', token); // ← add this
// //   console.log('Cookie options:', options); // ← add this


// //   res
// //     .status(statusCode)
// //     .cookie('token', token, options)
// //     .json({
// //       success: true,
// //       message: statusCode === 201 ? 'User created successfully' : 'Login successful',
// //       user: {
// //         id: user._id,
// //         username: user.username,
// //       },
// //       token,
// //     });
// // };

// export const signup = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Please provide all fields' });
//     }

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: 'Username already exists!' });
//     }

//     const user = await User.create({ username, password });

//     sendTokenResponse(user, 201, res); // ← CHANGED
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // export const login = async (req, res) => {
// //   try {
// //     const { username, password } = req.body;

// //     const user = await User.findOne({ username }).select('+password');
// //     if (!user || !(await user.comparePassword(password))) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     sendTokenResponse(user, 200, res); // ← CHANGED
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };



// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username }).select('+password');
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // DIRECT COOKIE TEST - Skip sendTokenResponse for now
//     const token = generateToken(user._id);
    
//     console.log('🔵 Setting cookie directly in login function');
//     console.log('🔵 Token:', token);
    
//     res
//       .status(200)
//       .cookie('token', token, {
//         maxAge: 300000, // 5 minutes
//         httpOnly: true,
//         sameSite: 'lax',
//       })
//       .json({
//         success: true,
//         message: 'Login successful',
//         user: {
//           id: user._id,
//           username: user.username,
//         },
//         token,
//       });
    
//     console.log('🔵 Response sent with cookie');
    
//   } catch (error) {
//     console.error('❌ Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };








// export const getMe = async (req, res) => {
//   res.json({ user: req.user });
// };

// // ← ADD LOGOUT FUNCTION
// // export const logout = async (req, res) => {
// //   res.cookie('token', 'none', {
// //     expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
// //     httpOnly: true,
// //   });

// //   res.status(200).json({
// //     success: true,
// //     message: 'Logged out successfully',
// //   });
// // };
// export const logout = async (req, res) => {
//   res.cookie('token', '', {
//     httpOnly: true,
//     expires: new Date(0),
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully',
//   });
// };





// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '5m',
//   });
// };

// export const signup = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Please provide all fields' });
//     }

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: 'Username already exists!' });
//     }

//     const user = await User.create({ username, password });
//     const token = generateToken(user._id);

//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         maxAge: 5 * 60 * 1000,
//         sameSite: 'lax',
//       })
//       .status(201)
//       .json({
//         success: true,
//         user: { id: user._id, username: user.username },
//       });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username }).select('+password');
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user._id);

//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         maxAge: 5 * 60 * 1000,
//         sameSite: 'lax',
//       })
//       .status(200)
//       .json({
//         success: true,
//         user: { id: user._id, username: user.username },
//       });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getMe = async (req, res) => {
//   res.json({ user: req.user });
// };

// export const logout = async (req, res) => {
//   res
//     .cookie('token', '', {
//       httpOnly: true,
//       expires: new Date(0),
//     })
//     .status(200)
//     .json({ success: true, message: 'Logged out' });
// };







//latest

// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '15m', // Changed from 5m to 7d
  
    
//   });
// };

// export const signup = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Please provide all fields' });
//     }

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: 'Username already exists!' });
//     }

//     const user = await User.create({ username, password });
//     const token = generateToken(user._id);

//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         secure: false,
//         sameSite: 'lax', // Changed from 'lax' to 'none'
//         path: '/',
//       })
//       .status(201)
//       .json({
//         success: true,
//         user: { id: user._id, username: user.username },
//       });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username }).select('+password');
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user._id);

//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         secure: false,
//         sameSite: 'lax', // Changed from 'lax' to 'none'
//         path: '/',
//       })
//       .status(200)
//       .json({
//         success: true,
//         user: { id: user._id, username: user.username },
//       });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getMe = async (req, res) => {
//   res.json({ user: req.user });
// };

// export const logout = async (req, res) => {
//   res
//     .cookie('token', '', {
//       httpOnly: true,
//       expires: new Date(0),
//       sameSite: 'lax',
//       path: '/',
//     })
//     .status(200)
//     .json({ success: true, message: 'Logged out' });
// };



import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// })

console.log("USER length:", process.env.SMTP_USER?.length);
console.log("PASS length:", process.env.SMTP_PASSWORD?.length);
console.log("PASS raw:", JSON.stringify(process.env.SMTP_PASSWORD));


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


export const signup = async (req, res) => {
  try {
    const { username, password, email, accountType } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists!' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const role = accountType === 'organization' ? 'admin' : 'user';
    const organizationId = accountType === 'organization' 
      ? new mongoose.Types.ObjectId().toString() 
      : undefined;
    
    const user = await User.create({ 
      username, 
      password, 
      email, 
      role,
      organizationId 
    });
    const token = generateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      })
      .status(201)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        },
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginId = (email || identifier || username || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const isEmail = loginId.includes('@');
    const query = isEmail ? { email: loginId.toLowerCase() } : { username: loginId };

    const user = await User.findOne(query).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Support legacy/plaintext passwords in DB (one-time migration to bcrypt)
    const looksBcrypt = typeof user.password === 'string' && user.password.startsWith('$2');
    let ok = false;
    if (looksBcrypt) {
      ok = await user.comparePassword(password);
    } else {
      ok = user.password === password;
      if (ok) {
        user.password = password;
        await user.save(); // will bcrypt-hash via pre-save hook
      }
    }
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      })
      .status(200)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        },
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'lax',
      path: '/',
    })
    .status(200)
    .json({ success: true, message: 'Logged out' });
};

export const forgotPassword = async (req, res) => {
 console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});


    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #1a5f7a;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to reset your password.</p>
          <a href="${resetUrl}" style="display:inline-block; padding: 12px 24px; background-color: #1a8caa; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
          <p style="margin-top: 16px; color: #666;">This link expires in <strong>15 minutes</strong>.</p>
          <p style="color: #666;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    }).select('+resetToken +resetTokenExpiry');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const user = await User.findOne({
      inviteToken: token,
      inviteTokenExpiry: { $gt: new Date() },
    }).lean();

    if (!user) {
      return res.status(400).json({ error: 'Invite link is invalid or has expired.' });
    }

    return res.status(200).json({
      success: true,
      email: user.email,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Verify invite token error:', error);
    return res.status(500).json({ error: 'Failed to verify invite token' });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    const user = await User.findOne({
      inviteToken: token,
      inviteTokenExpiry: { $gt: new Date() },
    }).select('+inviteToken +inviteTokenExpiry');

    if (!user) {
      return res.status(400).json({ error: 'Invite link is invalid or has expired.' });
    }

    user.password = password;
    user.isActive = true;
    user.inviteToken = undefined;
    user.inviteTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password set successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Set password from invite error:', error);
    return res.status(500).json({ error: 'Failed to set password' });
  }
};