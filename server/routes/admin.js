const express = require('express');
const router = express.Router();
const db = require('../db');

// GET platform oversight metrics
router.get('/metrics', (req, res) => {
  try {
    const stats = db.getPlatformStats();
    const vendors = db.getVendors();
    const recentContracts = db.getContracts().slice(0, 10);
    const recentPayments = db.getPayments().slice(0, 10);

    res.json({
      success: true,
      stats,
      vendors,
      recentContracts,
      recentPayments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH toggle vendor verification status
router.patch('/vendors/:id/verify', (req, res) => {
  try {
    const vendor = db.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found' });

    const newStatus = req.body.verified !== undefined ? req.body.verified : !vendor.verified;
    const updated = db.updateVendor(vendor.id, { verified: newStatus });

    res.json({ success: true, vendor: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST reset demo data
router.post('/reset-demo', (req, res) => {
  try {
    db.seedInitial();
    res.json({ success: true, message: 'Platform demo data successfully reset to initial Ghana state.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
