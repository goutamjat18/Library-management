const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

// Check book availability
router.get('/availability', protect, async (req, res) => {
  try {
    const { name, author } = req.query;
    const filter = { status: { $in: ['Available', 'Issued'] } };
    if (name) filter.name = new RegExp(name, 'i');
    if (author) filter.author = new RegExp(author, 'i');
    const books = await Book.find(filter);
    const result = books.map(b => ({
      ...b.toObject(),
      available: b.status === 'Available'
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Issue book
router.post('/issue', protect, async (req, res) => {
  try {
    const { bookId, membershipId, issueDate, returnDate, remarks } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.status !== 'Available')
      return res.status(400).json({ message: 'Book not available for issue' });

    const issue = await Transaction.create({
      bookId, membershipId,
      serialNo: book.serialNo,
      issueDate: new Date(issueDate),
      returnDate: new Date(returnDate),
      remarks, status: 'Issued'
    });
    book.status = 'Issued';
    await book.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get active issues for return
router.get('/active', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'Issued' })
      .populate('bookId', 'name author serialNo')
      .populate('membershipId', 'membershipId firstName lastName');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Initiate return (go to pay fine page)
router.post('/return-initiate', protect, async (req, res) => {
  try {
    const { bookId, membershipId, serialNo, actualReturnDate, remarks } = req.body;
    const txn = await Transaction.findOne({ bookId, status: 'Issued' })
      .populate('bookId');
    if (!txn) return res.status(404).json({ message: 'Active issue not found' });

    const returnD = new Date(actualReturnDate || Date.now());
    const expectedReturn = new Date(txn.returnDate);
    let fine = 0;
    if (returnD > expectedReturn) {
      const diffDays = Math.ceil((returnD - expectedReturn) / (1000 * 60 * 60 * 24));
      fine = diffDays * 5; // ₹5 per day fine
    }
    txn.actualReturnDate = returnD;
    txn.fineCalculated = fine;
    if (remarks) txn.remarks = remarks;
    await txn.save();
    res.json({ transaction: txn, fineCalculated: fine });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Confirm return and pay fine
router.post('/return-confirm', protect, async (req, res) => {
  try {
    const { transactionId, finePaid, remarks } = req.body;
    const txn = await Transaction.findById(transactionId);
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });

    if (txn.fineCalculated > 0 && !finePaid)
      return res.status(400).json({ message: 'Fine must be paid before returning' });

    txn.finePaid = finePaid || false;
    txn.status = 'Returned';
    if (remarks) txn.remarks = remarks;
    await txn.save();

    const book = await Book.findById(txn.bookId);
    if (book) { book.status = 'Available'; await book.save(); }

    res.json({ message: 'Book returned successfully', transaction: txn });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
