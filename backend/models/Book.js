const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  serialNo: { type: String, unique: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  category: {
    type: String,
    enum: ['Science', 'Economics', 'Fiction', 'Children', 'Personal Development'],
    required: true
  },
  type: { type: String, enum: ['Book', 'Movie'], default: 'Book' },
  status: { type: String, enum: ['Available', 'Issued', 'Damaged', 'Lost'], default: 'Available' },
  cost: { type: Number, default: 0 },
  procurementDate: { type: Date, default: Date.now },
  copies: { type: Number, default: 1 },
}, { timestamps: true });

// Auto-generate serial number
bookSchema.pre('save', async function (next) {
  if (this.isNew && !this.serialNo) {
    const categoryMap = {
      Science: 'SC', Economics: 'EC', Fiction: 'FC',
      Children: 'CH', 'Personal Development': 'PD'
    };
    const prefix = categoryMap[this.category] || 'GN';
    const typeChar = this.type === 'Movie' ? 'M' : 'B';
    const count = await mongoose.model('Book').countDocuments({ category: this.category, type: this.type });
    this.serialNo = `${prefix}(${typeChar})${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
