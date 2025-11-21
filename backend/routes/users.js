const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET environment variable is missing! Set it in .env file");
}

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Registration
router.post('/register', async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email required and password min 6 chars' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name || null, email, password_hash, role || 'user']
    );

    const [user] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(user[0]);
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});


//reset-forgot password

const transporter = nodemailer.createTransport({
host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});


//forgot password

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Forgot password request received for:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [token, expiry, email]
    );

    const resetLink = `${process.env.BACKEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      to: email,
      from: 'kyrylishynaviktoriia@gmail.com',
      subject: 'Password Reset Request',
      html: `
        <p>HI,</p>
        <p>You requested a password reset for your account.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link will expire in 1 hour.</p>
        `
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


//reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE reset_token = ?', [token]);
    if (rows.length === 0) return res.status(400).json({ message: 'Invalid or expired token.' });

    const user = rows[0];

    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ message: 'Token expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
