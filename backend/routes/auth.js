const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// Seed default admin (run once)
router.post('/seed', async (req, res) => {
  try {
    const exists = await User.findOne({ username: 'adm' });
    if (exists) return res.json({ message: 'Admin already exists' });
    await User.create({ name: 'Administrator', username: 'adm', password: 'adm', isAdmin: true });
    await User.create({ name: 'Library User', username: 'user', password: 'user', isAdmin: false });
    res.json({ message: 'Default users created. admin: adm/adm, user: user/user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
