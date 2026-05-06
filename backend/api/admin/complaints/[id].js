const mongoose = require('mongoose');
const Complaint = require('../../../models/Complaint');

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

  const { id } = req.query;
  await connectDB();

  if (req.method === 'PUT') {
    // Update complaint status
    try {
      const { status } = req.body;

      if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      const complaint = await Complaint.findByIdAndUpdate(
        id,
        { status, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      res.json({
        success: true,
        data: complaint,
        message: 'Status updated successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'DELETE') {
    // Delete complaint
    try {
      const complaint = await Complaint.findByIdAndDelete(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      res.json({
        success: true,
        message: 'Complaint deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
