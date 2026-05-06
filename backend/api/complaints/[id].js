const mongoose = require('mongoose');
const Complaint = require('../../models/Complaint');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = async (req, res) => {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    // Get complaint by ID
    try {
      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }
      res.json({ success: true, data: complaint });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
