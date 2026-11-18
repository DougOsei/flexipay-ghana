const express = require('express');
const router = express.Router();
const db = require('../db');

// GET current demo accounts for quick switcher
router.get('/accounts', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST login or select role
router.post('/login', (req, res) => {
  try {
    const { email, role } = req.body;
    const user = db.findUser({ email, role });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    let vendorStore = null;
    if (user.role === 'vendor' && user.storeId) {
      vendorStore = db.getVendorById(user.storeId);
    }

    res.json({
      success: true,
      user,
      vendorStore
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST register new user (customer or vendor)
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, role, ghanaCard, digitalAddress, city, employment } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, email, and phone number are required' });
    }

    const existing = db.findUser({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const newUser = db.addUser({
      name,
      email,
      phone,
      role: role || 'customer',
      ghanaCard,
      digitalAddress,
      city,
      employment
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET notifications for a user
router.get('/notifications/:userId', (req, res) => {
  try {
    const list = db.getNotifications(req.params.userId);
    res.json({ success: true, notifications: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH mark notification read
router.patch('/notifications/:id/read', (req, res) => {
  try {
    const notif = db.markNotificationRead(req.params.id);
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
