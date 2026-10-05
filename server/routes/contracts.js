const express = require('express');
const router = express.Router();
const db = require('../db');
const { calculateHPPlan, isValidGhanaCard, isValidGhanaPostGPS } = require('../utils/hpCalculator');

// GET all contracts with optional filters
router.get('/', (req, res) => {
  try {
    const { customerId, vendorId, status } = req.query;
    const contracts = db.getContracts({ customerId, vendorId, status });
    res.json({ success: true, count: contracts.length, contracts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single contract by ID or contractNumber
router.get('/:id', (req, res) => {
  try {
    const contract = db.getContractById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Hire-purchase contract not found' });
    }
    res.json({ success: true, contract });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST submit new hire-purchase application
router.post('/', (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerGhanaCard,
      digitalAddress,
      city,
      employment,
      guarantorName,
      guarantorPhone,
      productId,
      downPaymentPercent,
      tenureMonths,
      frequency,
      paymentMethod,
      downPaymentNetworkRef
    } = req.body;

    // Validate customer identity inputs
    if (!customerName || !customerPhone || !customerGhanaCard || !digitalAddress || !guarantorName || !guarantorPhone) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all required Ghana verification fields (Full Name, Phone, Ghana Card PIN, GhanaPost GPS, Guarantor details).'
      });
    }

    if (!isValidGhanaCard(customerGhanaCard)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ghana Card PIN format. Example format: GHA-712345678-9'
      });
    }

    if (!isValidGhanaPostGPS(digitalAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid GhanaPost GPS Digital Address format. Example format: GA-183-9022 or AK-039-4412'
      });
    }

    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Selected product not found' });
    }

    const plan = calculateHPPlan({
      cashPrice: product.cashPrice,
      markupPercent: product.markupPercent,
      downPaymentPercent: downPaymentPercent || product.minDownPaymentPercent || 25,
      tenureMonths: tenureMonths || 3,
      frequency: frequency || 'monthly'
    });

    const newContract = db.createContract({
      customerId: customerId || 'usr_customer_kwesi',
      customerName,
      customerPhone,
      customerGhanaCard,
      customerAddress: `${city || 'Accra'} (${digitalAddress})`,
      employment: employment || 'Private Sector Employee',
      guarantorName,
      guarantorPhone,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      cashPrice: product.cashPrice,
      markupPercent: plan.markupPercent,
      totalHPAmount: plan.totalHPAmount,
      downPaymentPercent: plan.downPaymentPercent,
      downPaymentAmount: plan.downPaymentAmount,
      remainingBalance: plan.remainingBalance,
      tenureMonths: plan.tenureMonths,
      frequency: plan.frequency,
      installmentAmount: plan.installmentAmount,
      installments: plan.schedule
    });

    // Record down payment in payments ledger
    const downPaymentRef = downPaymentNetworkRef || `MOMO-GH-${Math.floor(100000 + Math.random() * 900000)}`;
    db.data.payments.unshift({
      id: `pay_${Date.now()}`,
      contractId: newContract.id,
      contractNumber: newContract.contractNumber,
      vendorId: product.vendorId,
      customerId: newContract.customerId,
      customerName: newContract.customerName,
      type: 'DOWN_PAYMENT',
      amount: plan.downPaymentAmount,
      method: paymentMethod || 'MTN_MOMO',
      phone: customerPhone,
      networkRef: downPaymentRef,
      status: 'SUCCESSFUL',
      createdAt: new Date().toISOString()
    });
    db.save();

    res.status(201).json({
      success: true,
      message: 'Hire purchase application submitted successfully! Vendor has been notified.',
      contract: newContract
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH vendor approves contract
router.patch('/:id/approve', (req, res) => {
  try {
    const contract = db.getContractById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, error: 'Contract not found' });

    const updated = db.updateContract(contract.id, {
      status: 'ACTIVE',
      deliveryStatus: 'IN_TRANSIT',
      approvedAt: new Date().toISOString()
    });

    db.addNotification({
      recipientId: contract.customerId,
      title: 'Application Approved! 🇬🇭📦',
      message: `Your hire-purchase agreement for ${contract.productTitle} was APPROVED by ${contract.vendorName}! Item is now in transit for delivery.`,
      type: 'APPLICATION_APPROVED'
    });

    res.json({ success: true, contract: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH vendor rejects contract
router.patch('/:id/reject', (req, res) => {
  try {
    const contract = db.getContractById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, error: 'Contract not found' });

    const { reason } = req.body;
    const updated = db.updateContract(contract.id, {
      status: 'REJECTED',
      rejectionReason: reason || 'Ghana Card verification could not be confirmed with registry.',
      rejectedAt: new Date().toISOString()
    });

    db.addNotification({
      recipientId: contract.customerId,
      title: 'Application Update',
      message: `Your hire purchase request for ${contract.productTitle} was not approved. Reason: ${reason || 'Incomplete guarantor or ID information.'}`,
      type: 'APPLICATION_REJECTED'
    });

    res.json({ success: true, contract: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update delivery status
router.patch('/:id/delivery', (req, res) => {
  try {
    const contract = db.getContractById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, error: 'Contract not found' });

    const { deliveryStatus } = req.body;
    const updated = db.updateContract(contract.id, {
      deliveryStatus: deliveryStatus || 'DELIVERED',
      deliveredAt: deliveryStatus === 'DELIVERED' ? new Date().toISOString() : null
    });

    res.json({ success: true, contract: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST send Ghana MoMo payment reminder (SMS / WhatsApp prompt)
router.post('/:id/remind', (req, res) => {
  try {
    const contract = db.getContractById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, error: 'Contract not found' });

    const nextPending = contract.installments.find(i => i.status === 'PENDING');
    const amountDue = nextPending ? nextPending.amount : contract.installmentAmount;
    const dueDate = nextPending ? nextPending.dueDate : 'Soon';

    const notif = db.addNotification({
      recipientId: contract.customerId,
      title: `⚡ Payment Reminder: GH₵ ${amountDue.toLocaleString()} Due`,
      message: `Friendly reminder from ${contract.vendorName}: Installment #${nextPending ? nextPending.installmentNumber : 1} of GH₵ ${amountDue.toLocaleString()} for ${contract.productTitle} is due on ${dueDate}. Pay easily via MTN MoMo or Telecel Cash on FlexiPay.`,
      type: 'PAYMENT_REMINDER'
    });

    res.json({
      success: true,
      message: `SMS reminder dispatched to customer (${contract.customerPhone})`,
      notification: notif
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
