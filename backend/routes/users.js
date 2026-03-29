const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, username, password, isAdmin, isActive } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already exists' });
    const user = await User.create({ name, username, password, isAdmin: !!isAdmin, isActive: isActive !== false });
    res.status(201).json({ _id: user._id, name: user.name, username: user.username, isAdmin: user.isAdmin, isActive: user.isActive });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, isAdmin, isActive, password } = req.body;
    if (name) user.name = name;
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (password) user.password = password;
    await user.save();
    res.json({ _id: user._id, name: user.name, username: user.username, isAdmin: user.isAdmin, isActive: user.isActive });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
