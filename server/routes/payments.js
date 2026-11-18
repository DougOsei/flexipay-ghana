const express = require('express');
const router = express.Router();
const db = require('../db');
const { detectMoMoProvider } = require('../utils/hpCalculator');

// POST initiate and complete MoMo / Card payment for installment
router.post('/momo-checkout', (req, res) => {
  try {
    const { contractId, installmentNumber, amount, phone, paymentMethod } = req.body;

    if (!contractId || !installmentNumber) {
      return res.status(400).json({
        success: false,
        error: 'contractId and installmentNumber are required'
      });
    }

    const provider = paymentMethod || detectMoMoProvider(phone);
    const networkRef = `${provider.replace('_', '-')}-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const result = db.payInstallment(contractId, installmentNumber, {
      paymentMethod: provider,
      phone,
      networkRef,
      amount
    });

    const finalAmount = Number(amount) || (result && result.paymentRecord ? result.paymentRecord.amount : 0);
    const providerLabel = String(provider).replace(/_/g, ' ');

    res.json({
      success: true,
      message: `Payment of GH₵ ${finalAmount.toLocaleString()} successfully completed via ${providerLabel}!`,
      transactionRef: networkRef,
      contract: result.contract,
      paymentRecord: result.paymentRecord
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET all payments
router.get('/', (req, res) => {
  try {
    const { vendorId, customerId } = req.query;
    const payments = db.getPayments({ vendorId, customerId });
    res.json({ success: true, count: payments.length, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single payment record
router.get('/:id', (req, res) => {
  try {
    const payment = db.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment record not found' });
    }
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
