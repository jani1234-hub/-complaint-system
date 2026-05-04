const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database: Complaint System');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Please check your MongoDB connection string and network access');
    console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas');
  }
};

module.exports = connectDB;
