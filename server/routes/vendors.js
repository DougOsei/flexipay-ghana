const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all vendors
router.get('/', (req, res) => {
  try {
    const vendors = db.getVendors();
    res.json({ success: true, count: vendors.length, vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single vendor with their products
router.get('/:id', (req, res) => {
  try {
    const vendor = db.getVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor store not found' });
    }
    const products = db.getProducts({ vendorId: vendor.id });
    res.json({ success: true, vendor, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET vendor dashboard stats and application requests
router.get('/:id/dashboard', (req, res) => {
  try {
    const stats = db.getVendorStats(req.params.id);
    if (!stats.vendor) {
      return res.status(404).json({ success: false, error: 'Vendor store not found' });
    }
    const contracts = db.getContracts({ vendorId: req.params.id });
    const payments = db.getPayments({ vendorId: req.params.id });
    const products = db.getProducts({ vendorId: req.params.id });

    res.json({
      success: true,
      stats,
      recentContracts: contracts.slice(0, 10),
      recentPayments: payments.slice(0, 10),
      products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST register new vendor
router.post('/', (req, res) => {
  try {
    const {
      name,
      tagline,
      ownerEmail,
      phone,
      momoNumber,
      momoNetwork,
      region,
      city,
      digitalAddress,
      logo,
      coverImage
    } = req.body;

    if (!name || !ownerEmail || !phone || !momoNumber) {
      return res.status(400).json({
        success: false,
        error: 'Store name, owner email, phone number, and Mobile Money payout number are required.'
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newVendor = db.addVendor({
      name,
      slug,
      tagline: tagline || 'Verified Electronics & Goods Merchant',
      ownerEmail,
      phone,
      momoNumber,
      momoNetwork: momoNetwork || 'MTN_MOMO',
      momoMerchantName: name.toUpperCase(),
      region: region || 'Greater Accra',
      city: city || 'Accra',
      digitalAddress: digitalAddress || 'GA-000-0000',
      logo: logo || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=200&q=80',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80'
    });

    res.status(201).json({ success: true, vendor: newVendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update vendor store settings
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateVendor(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }
    res.json({ success: true, vendor: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST request payout to vendor's MoMo wallet
router.post('/:id/request-payout', (req, res) => {
  try {
    const vendor = db.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found' });

    const { amount } = req.body;
    const payoutAmount = Number(amount) || 500;
    const ref = `PAYOUT-GH-${Math.floor(100000 + Math.random() * 900000)}`;

    db.addNotification({
      recipientId: vendor.id,
      title: 'Disbursement Processed 💸',
      message: `GH₵ ${payoutAmount.toLocaleString()} has been disbursed to your ${vendor.momoNetwork} wallet (${vendor.momoNumber}). Ref: ${ref}`,
      type: 'PAYOUT'
    });

    res.json({
      success: true,
      message: `Payout of GH₵ ${payoutAmount.toLocaleString()} initiated to ${vendor.momoNumber}`,
      reference: ref,
      status: 'PROCESSING_MOMO_DISBURSEMENT'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
