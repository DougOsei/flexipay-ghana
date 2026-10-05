const express = require('express');
const router = express.Router();
const db = require('../db');
const { calculateHPPlan } = require('../utils/hpCalculator');

// GET all products with optional filters
router.get('/', (req, res) => {
  try {
    const { category, search, vendorId, sort, minPrice, maxPrice } = req.query;
    const products = db.getProducts({ category, search, vendorId, sort, minPrice, maxPrice });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Calculate HP plan preview
router.post('/calculate-plan', (req, res) => {
  try {
    const { cashPrice, markupPercent, downPaymentPercent, tenureMonths, frequency } = req.body;
    if (!cashPrice) {
      return res.status(400).json({ success: false, error: 'cashPrice is required' });
    }
    const plan = calculateHPPlan({
      cashPrice,
      markupPercent,
      downPaymentPercent,
      tenureMonths,
      frequency
    });
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Compute default 3-month and 6-month plan preview
    const samplePlan3 = calculateHPPlan({
      cashPrice: product.cashPrice,
      markupPercent: product.markupPercent,
      downPaymentPercent: product.minDownPaymentPercent || 25,
      tenureMonths: 3,
      frequency: 'monthly'
    });
    const samplePlan6 = calculateHPPlan({
      cashPrice: product.cashPrice,
      markupPercent: product.markupPercent,
      downPaymentPercent: product.minDownPaymentPercent || 25,
      tenureMonths: 6,
      frequency: 'monthly'
    });

    res.json({
      success: true,
      product,
      samplePlans: {
        months3: samplePlan3,
        months6: samplePlan6
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create product (vendor)
router.post('/', (req, res) => {
  try {
    const {
      title,
      category,
      brand,
      cashPrice,
      markupPercent,
      minDownPaymentPercent,
      allowedTenures,
      vendorId,
      vendorName,
      vendorCity,
      stock,
      image,
      description,
      features
    } = req.body;

    if (!title || !cashPrice || !vendorId) {
      return res.status(400).json({ success: false, error: 'Title, cashPrice, and vendorId are required' });
    }

    const newProduct = db.addProduct({
      title,
      category: category || 'Electronics & TV',
      brand: brand || 'Generic',
      cashPrice: Number(cashPrice),
      markupPercent: Number(markupPercent) || 10,
      minDownPaymentPercent: Number(minDownPaymentPercent) || 20,
      allowedTenures: allowedTenures || [3, 6, 12],
      vendorId,
      vendorName: vendorName || 'Official Vendor',
      vendorCity: vendorCity || 'Accra',
      stock: Number(stock) || 10,
      image: image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
      description: description || 'High quality genuine product available on flexible installment plans.',
      features: Array.isArray(features) ? features : [features].filter(Boolean)
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE product
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
