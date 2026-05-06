const mongoose = require('mongoose');
const Complaint = require('../../../models/Complaint');
const { adminAuth } = require('../../../middleware/auth');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = async (req, res) => {
  // Check admin auth
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDB();

  if (req.method === 'GET') {
    // Get all complaints with filters
    try {
      const { category, status, search } = req.query;
      let filter = {};

      if (category) filter.category = category;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { target: { $regex: search, $options: 'i' } },
          { rollno: { $regex: search, $options: 'i' } }
        ];
      }

      const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

      const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
      };

      res.json({
        success: true,
        data: complaints,
        stats
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
