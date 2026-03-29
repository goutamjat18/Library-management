const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Membership = require('../models/Membership');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

router.get('/books', protect, async (req, res) => {
  try {
    const books = await Book.find({ type: 'Book' }).sort({ name: 1 });
    res.json(books);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/movies', protect, async (req, res) => {
  try {
    const movies = await Book.find({ type: 'Movie' }).sort({ name: 1 });
    res.json(movies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/memberships', protect, async (req, res) => {
  try {
    const memberships = await Membership.find().sort({ createdAt: -1 });
    res.json(memberships);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/active-issues', protect, async (req, res) => {
  try {
    const issues = await Transaction.find({ status: 'Issued' })
      .populate('bookId', 'serialNo name type')
      .populate('membershipId', 'membershipId firstName lastName')
      .sort({ issueDate: -1 });
    res.json(issues);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/overdue', protect, async (req, res) => {
  try {
    const now = new Date();
    const overdue = await Transaction.find({ status: 'Issued', returnDate: { $lt: now } })
      .populate('bookId', 'serialNo name')
      .populate('membershipId', 'membershipId firstName lastName')
      .sort({ returnDate: 1 });
    const result = overdue.map(t => ({
      ...t.toObject(),
      fineCalculated: Math.ceil((now - new Date(t.returnDate)) / (1000 * 60 * 60 * 24)) * 5
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/issue-requests', protect, async (req, res) => {
  try {
    const requests = await Transaction.find({ status: 'Requested' })
      .populate('bookId', 'name author')
      .populate('membershipId', 'membershipId firstName lastName')
      .sort({ requestedDate: -1 });
    res.json(requests);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
