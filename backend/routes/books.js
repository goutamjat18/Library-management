const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

// GET all books with search
router.get('/', protect, async (req, res) => {
  try {
    const { name, author, type } = req.query;
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (author) filter.author = new RegExp(author, 'i');
    if (type) filter.type = type;
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single book
router.get('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add book (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, author, category, type, cost, procurementDate, copies } = req.body;
    const book = await Book.create({ name, author, category, type, cost, procurementDate, copies });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update book (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
