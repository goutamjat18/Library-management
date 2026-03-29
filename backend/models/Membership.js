const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  membershipId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactAddress: { type: String, required: true },
  aadharCardNo: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  membershipDuration: { type: String, enum: ['6months', '1year', '2years'], default: '6months' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  amountPending: { type: Number, default: 0 },
}, { timestamps: true });

membershipSchema.pre('save', async function (next) {
  if (this.isNew && !this.membershipId) {
    const count = await mongoose.model('Membership').countDocuments();
    this.membershipId = `MEM${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);
