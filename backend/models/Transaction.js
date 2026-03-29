const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
  serialNo: { type: String },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  actualReturnDate: { type: Date },
  fineCalculated: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String },
  status: { type: String, enum: ['Issued', 'Returned', 'Overdue', 'Requested'], default: 'Issued' },
  requestedDate: { type: Date },
  requestFulfilledDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
