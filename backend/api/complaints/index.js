const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Complaint = require('../../models/Complaint');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    // Create new complaint
    const errors = [];
    const { name, email, rollno, category, target, subject, complaint } = req.body;

    if (!name || name.length < 2) errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push({ field: 'email', message: 'Valid email is required' });
    if (!rollno) errors.push({ field: 'rollno', message: 'Roll number is required' });
    if (!['Department', 'Teacher', 'Administration', 'Hostel'].includes(category)) errors.push({ field: 'category', message: 'Invalid category' });
    if (!target) errors.push({ field: 'target', message: 'Target is required' });
    if (!subject) errors.push({ field: 'subject', message: 'Subject is required' });
    if (!complaint || complaint.length < 20) errors.push({ field: 'complaint', message: 'Complaint must be at least 20 characters' });

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const newComplaint = new Complaint({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rollno: rollno.trim(),
        category,
        target: target.trim(),
        subject: subject.trim(),
        complaint: complaint.trim()
      });

      await newComplaint.save();
      res.status(201).json({
        success: true,
        data: newComplaint,
        message: 'Complaint submitted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
