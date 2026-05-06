const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'complaints.json');

const loadComplaints = () => {
  try {
    const file = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const saveComplaints = (complaints) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2), 'utf8');
};

const normalizeDate = () => {
  return new Date().toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const generateId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createComplaint = (data) => {
  const complaints = loadComplaints();
  const timestamp = new Date().toISOString();

  const complaint = {
    id: generateId(),
    name: data.name,
    email: data.email,
    rollno: data.rollno,
    category: data.category,
    target: data.target,
    subject: data.subject,
    complaint: data.complaint,
    status: 'Pending',
    date: normalizeDate(),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  complaints.push(complaint);
  saveComplaints(complaints);
  return complaint;
};

const getComplaintById = (id) => {
  const complaints = loadComplaints();
  return complaints.find((item) => item.id === id);
};

const getAllComplaints = () => {
  return loadComplaints();
};

const updateComplaint = (id, updates) => {
  const complaints = loadComplaints();
  const index = complaints.findIndex((item) => item.id === id);
  if (index === -1) return null;

  complaints[index] = {
    ...complaints[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveComplaints(complaints);
  return complaints[index];
};

const deleteComplaint = (id) => {
  const complaints = loadComplaints();
  const index = complaints.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const [deleted] = complaints.splice(index, 1);
  saveComplaints(complaints);
  return deleted;
};

module.exports = {
  createComplaint,
  getComplaintById,
  getAllComplaints,
  updateComplaint,
  deleteComplaint
};