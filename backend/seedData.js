const mongoose = require('mongoose');
const Book = require('./models/Book');
const Membership = require('./models/Membership');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Book.deleteMany();
    await Membership.deleteMany();
    await User.deleteMany();
    await Transaction.deleteMany();

    // Add books
    const books = [
      { name: 'The Great Gatsby', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', serialNo: 'FC(B)000001', status: 'Available' },
      { name: '1984', title: '1984', author: 'George Orwell', category: 'Fiction', serialNo: 'FC(B)000002', status: 'Available' },
      { name: 'A Brief History of Time', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', serialNo: 'SC(B)000001', status: 'Issued' },
      { name: 'The Wealth of Nations', title: 'The Wealth of Nations', author: 'Adam Smith', category: 'Economics', serialNo: 'EC(B)000001', status: 'Available' },
    ];
    await Book.insertMany(books);

    // Add memberships
    const memberships = [
      { 
        membershipId: 'M0001', 
        firstName: 'John', 
        lastName: 'Doe', 
        contactNumber: '1234567890', 
        contactAddress: '123 Main St, City', 
        aadharCardNo: '1234-5678-9012', 
        startDate: new Date('2026-01-01'), 
        endDate: new Date('2026-07-01'), 
        membershipDuration: '6months', 
        status: 'Active' 
      },
      { 
        membershipId: 'M0002', 
        firstName: 'Jane', 
        lastName: 'Smith', 
        contactNumber: '9876543210', 
        contactAddress: '456 Elm St, Town', 
        aadharCardNo: '2345-6789-0123', 
        startDate: new Date('2026-01-01'), 
        endDate: new Date('2027-01-01'), 
        membershipDuration: '1year', 
        status: 'Active' 
      },
      { 
        membershipId: 'M0003', 
        firstName: 'Alice', 
        lastName: 'Johnson', 
        contactNumber: '5678901234', 
        contactAddress: '789 Oak St, Village', 
        aadharCardNo: '3456-7890-1234', 
        startDate: new Date('2024-01-01'), 
        endDate: new Date('2026-01-01'), 
        membershipDuration: '2years', 
        status: 'Inactive' 
      },
    ];
    await Membership.insertMany(memberships);

    // Add users
    await User.create({ name: 'Administrator', username: 'adm', password: 'adm', isAdmin: true });
    await User.create({ name: 'Library User', username: 'user', password: 'user', isAdmin: false });

    // Add transactions
    const transactions = [
      { 
        bookId: (await Book.findOne({ serialNo: 'FC(B)000001' }))._id, 
        membershipId: (await Membership.findOne({ membershipId: 'M0001' }))._id, 
        serialNo: 'FC(B)000001', 
        issueDate: new Date('2026-03-01'), 
        returnDate: new Date('2026-03-16'), 
        status: 'Issued' 
      },
      { 
        bookId: (await Book.findOne({ serialNo: 'SC(B)000001' }))._id, 
        membershipId: (await Membership.findOne({ membershipId: 'M0002' }))._id, 
        serialNo: 'SC(B)000001', 
        issueDate: new Date('2026-02-01'), 
        returnDate: new Date('2026-02-16'), 
        actualReturnDate: new Date('2026-02-15'), 
        finePaid: true, 
        status: 'Returned' 
      },
    ];
    await Transaction.insertMany(transactions);

    console.log('Dummy data seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB().then(seedData);