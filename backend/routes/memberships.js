const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const memberships = await Membership.find().sort({ createdAt: -1 });
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const m = await Membership.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { membershipId: req.params.id }]
    });
    if (!m) return res.status(404).json({ message: 'Membership not found' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, contactNumber, contactAddress, aadharCardNo, startDate, membershipDuration } = req.body;
    const durationMap = { '6months': 6, '1year': 12, '2years': 24 };
    const months = durationMap[membershipDuration] || 6;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    const membership = await Membership.create({
      firstName, lastName, contactNumber, contactAddress, aadharCardNo,
      startDate: start, endDate: end, membershipDuration
    });
    res.status(201).json(membership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const m = await Membership.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Membership not found' });

    const { membershipDuration, membershipRemove } = req.body;
    if (membershipRemove) {
      m.status = 'Inactive';
    } else if (membershipDuration) {
      const durationMap = { '6months': 6, '1year': 12, '2years': 24 };
      const months = durationMap[membershipDuration] || 6;
      m.endDate = new Date(m.endDate);
      m.endDate.setMonth(m.endDate.getMonth() + months);
      m.status = 'Active';
    }
    await m.save();
    res.json(m);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
